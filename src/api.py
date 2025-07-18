# from .get_user_data import get_user_data
from .utils import log_event, save_json
from .services import exchange_code_for_token, fetch_user_data, generate_transcript
from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse, FileResponse, JSONResponse, RedirectResponse
import uvicorn
import os
import requests
import json
from dotenv import load_dotenv
import urllib.parse
import datetime

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

@app.get("/my_fabulous_transcript")
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
    code = request.query_params.get("code")
    if not code:
        return HTMLResponse("<h1>Authentication failed. No code found.</h1>", status_code=400)
    return HTMLResponse(f"""
        <html>
        <body>
            <h2>Complete your profile</h2>
            <form action=\"/transcript\" method=\"post\">
                <input type=\"hidden\" name=\"code\" value=\"{code}\">
                <label>Date of Birth: <input type=\"date\" name=\"date_of_birth\" required></label><br>
                <label>Location of Birth: <input type=\"text\" name=\"location_of_birth\" required></label><br>
                <label>Language:
                    <select name=\"language\" required>
                        <option value=\"en\">English</option>
                        <option value=\"de\">German</option>
                    </select>
                </label><br>
                <label>Transcript Type:
                    <select name=\"transcript_type\" required>
                        <option value=\"core\">Core</option>
                        <option value=\"core_advanced\">Core + Advanced</option>
                    </select>
                </label><br>
                <button type=\"submit\">Generate Transcript</button>
            </form>
        </body>
        </html>
    """)

@app.post("/transcript")
def create_transcript(
    request: Request,
    code: str = Form(...),
    date_of_birth: str = Form(...),
    location_of_birth: str = Form(...),
    language: str = Form(...),
    transcript_type: str = Form(...),
):
    try:
        access_token = exchange_code_for_token(code, UID, SECRET, REDIRECT_URI, TOKEN_URL)
        user_data = fetch_user_data(access_token, USER_URL)
    except Exception as e:
        # If the code is expired or invalid, offer a relogin
        return HTMLResponse(f"""
            <html>
            <body>
                <h2>Session expired or invalid. Please log in again.</h2>
                <form action='/my_fabulous_transcript' method='get'>
                    <button type='submit'>Re-login</button>
                </form>
                <p style='color:gray;font-size:small;'>Error: {str(e)}</p>
            </body>
            </html>
        """, status_code=401)
    generate_transcript(
        user_data=user_data,
        date_of_birth=date_of_birth,
        location_of_birth=location_of_birth,
        language=language,
        transcript_type=transcript_type
    )
    pdf_path = os.path.join("data", "output.pdf")
    if os.path.exists(pdf_path):
        first_name = user_data.get("first_name", "Unknown")
        last_name = user_data.get("last_name", "Unknown")
        safe_first_name = ''.join(c for c in first_name if c.isalnum())
        safe_last_name = ''.join(c for c in last_name if c.isalnum())
        if language == "de":
            pdf_filename = f"Akademische_Leistungsübersicht_{safe_first_name}_{safe_last_name}.pdf"
        else:
            pdf_filename = f"Academic_Transcript_{safe_first_name}_{safe_last_name}.pdf"
        return FileResponse(pdf_path, media_type="application/pdf", filename=pdf_filename)
    else:
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
