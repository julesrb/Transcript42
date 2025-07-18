# from .get_user_data import get_user_data
from .utils import log_event, save_json
from .services import exchange_code_for_token, fetch_user_data, generate_transcript
from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse, RedirectResponse
import uvicorn
import os
import requests
import json
from dotenv import load_dotenv
import urllib.parse
import datetime
from filelock import FileLock, Timeout
from fastapi import Form

app = FastAPI()

load_dotenv()
UID = os.getenv("42UID")
SECRET = os.getenv("42SECRET")
REDIRECT_URI = os.getenv("OAUTH_REDIRECT_URI", "http://68.183.66.13/callback")
AUTH_URL = "https://api.intra.42.fr/oauth/authorize"
TOKEN_URL = "https://api.intra.42.fr/oauth/token"
USER_URL = "https://api.intra.42.fr/v2/me"
LOG_VIEW_PASSWORD = os.getenv("LOG_VIEW_PASSWORD", "changeme")
ACCESS_LOG_PATH = os.path.join("data", "access.log")
ERROR_LOG_PATH = os.path.join("data", "error.log")

@app.get("/login")
def login():
    # Log login attempt (IP will be logged on callback)
    return RedirectResponse(f"{AUTH_URL}?{urllib.parse.urlencode({
        'client_id': UID,
        'redirect_uri': REDIRECT_URI,
        'response_type': 'code',
        'scope': 'public'
    })}")


@app.get("/callback")
def callback(request: Request):
    """Handle OAuth callback, exchange code, fetch user, and redirect to profile completion."""
    lock_path = os.path.join("data", "callback.lock")
    lock = FileLock(lock_path, timeout=60)  # Wait up to 60 seconds for the lock
    try:
        with lock:
            code = request.query_params.get("code")
            client_host = request.client.host if hasattr(request, 'client') and request.client else 'unknown'
            now = datetime.datetime.now().isoformat()
            if not code:
                error_msg = f"[{now}] [IP: {client_host}] Authentication failed. No code found."
                log_event(ERROR_LOG_PATH, error_msg)
                return HTMLResponse("<h1>Authentication failed. No code found.</h1>", status_code=400)
            try:
                access_token = exchange_code_for_token(code, UID, SECRET, REDIRECT_URI, TOKEN_URL)
                if not access_token:
                    error_msg = f"[{now}] [IP: {client_host}] Failed to get access token."
                    log_event(ERROR_LOG_PATH, error_msg)
                    return HTMLResponse("<h1>Failed to get access token.</h1>", status_code=400)
                user_data = fetch_user_data(access_token, USER_URL)
                save_json(user_data, "./data/user.json")
                log_entry = f"[{now}] [IP: {client_host}] Login: {user_data.get('first_name', 'Unknown')} {user_data.get('last_name', 'Unknown')} (ID: {user_data.get('id', 'N/A')}, Login: {user_data.get('login', 'N/A')})"
                log_event(ACCESS_LOG_PATH, log_entry)
                # Redirect to profile completion form
                return RedirectResponse("/complete-profile")
            except Exception as e:
                error_msg = f"[{now}] [IP: {client_host}] Error: {str(e)}"
                log_event(ERROR_LOG_PATH, error_msg)
                return HTMLResponse(f"<h1>Error: {str(e)}</h1>", status_code=500)
    except Timeout:
        return HTMLResponse("<h1>Server busy. Please try again in a moment.</h1>", status_code=503)

@app.get("/complete-profile")
def complete_profile():
    return HTMLResponse("""
        <html>
        <body>
            <h2>Complete your profile</h2>
            <form action="/transcript" method="post">
                <label>Date of Birth: <input type="date" name="date_of_birth" required></label><br>
                <label>Location of Birth: <input type="text" name="location_of_birth" required></label><br>
                <label>Language:
                    <select name="language" required>
                        <option value="en">English</option>
                        <option value="de">German</option>
                    </select>
                </label><br>
                <label>Transcript Type:
                    <select name="transcript_type" required>
                        <option value="core">Core</option>
                        <option value="core_advanced">Core + Advanced</option>
                    </select>
                </label><br>
                <button type="submit">Generate Transcript</button>
            </form>
        </body>
        </html>
    """)

@app.post("/transcript")
def create_transcript(
    request: Request,
    date_of_birth: str = Form(...),
    location_of_birth: str = Form(...),
    language: str = Form(...),
    transcript_type: str = Form(...),
):
    generate_transcript(date_of_birth=date_of_birth, location_of_birth=location_of_birth, language=language, transcript_type=transcript_type)
    # Return the PDF as before
    user_data_error = None
    try:
        with open("./data/user.json", "r", encoding="utf-8") as f:
            user_data = json.load(f)
        first_name = user_data.get("first_name", "Unknown")
        last_name = user_data.get("last_name", "Unknown")
    except Exception as e:
        first_name = "Unknown"
        last_name = "Unknown"
        user_data_error = str(e)
        log_event(ERROR_LOG_PATH, f"[{datetime.datetime.now().isoformat()}] Could not load user.json: {user_data_error}")
    safe_first_name = ''.join(c for c in first_name if c.isalnum())
    safe_last_name = ''.join(c for c in last_name if c.isalnum())
    pdf_filename = f"Academic_Transcript_{safe_first_name}_{safe_last_name}.pdf"
    pdf_path = os.path.join("data", "output.pdf")
    client_host = request.client.host if hasattr(request, 'client') and request.client else 'unknown'
    if os.path.exists(pdf_path):
        pdf_log_entry = f"[{datetime.datetime.now().isoformat()}] [IP: {client_host}] PDF generated for: {first_name} {last_name} (ID: N/A, Login: N/A)"
        log_event(ACCESS_LOG_PATH, pdf_log_entry)
        if user_data_error:
            return FileResponse(pdf_path, media_type="application/pdf", filename=pdf_filename, headers={"X-User-Data-Warning": "User name could not be retrieved. PDF will have generic name."})
        return FileResponse(pdf_path, media_type="application/pdf", filename=pdf_filename)
    else:
        error_msg = f"[{datetime.datetime.now().isoformat()}] [IP: {client_host}] PDF not found after generation."
        log_event(ERROR_LOG_PATH, error_msg)
        return HTMLResponse("<h1>PDF not found after generation.</h1>", status_code=500)


@app.get("/logs/access")
def get_access_log(password: str = ""):
    if password != LOG_VIEW_PASSWORD:
        return HTMLResponse("<h1>Unauthorized</h1>", status_code=401)
    try:
        with open(ACCESS_LOG_PATH, "r", encoding="utf-8") as f:
            content = f.read()
        return HTMLResponse(f"<pre>{content}</pre>", status_code=200)
    except Exception as e:
        return HTMLResponse(f"<h1>Error reading access log: {str(e)}</h1>", status_code=500)

@app.get("/logs/error")
def get_error_log(password: str = ""):
    if password != LOG_VIEW_PASSWORD:
        return HTMLResponse("<h1>Unauthorized</h1>", status_code=401)
    try:
        with open(ERROR_LOG_PATH, "r", encoding="utf-8") as f:
            content = f.read()
        return HTMLResponse(f"<pre>{content}</pre>", status_code=200)
    except Exception as e:
        return HTMLResponse(f"<h1>Error reading error log: {str(e)}</h1>", status_code=500)

if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
