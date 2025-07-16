# from .get_user_data import get_user_data
from .fill_template import fill_template
from .generate_pdf import generate_pdf
from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse, RedirectResponse
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
    code = request.query_params.get("code")
    client_host = request.client.host if hasattr(request, 'client') and request.client else 'unknown'
    now = datetime.datetime.now().isoformat()
    if not code:
        error_msg = f"[{now}] [IP: {client_host}] Authentication failed. No code found."
        with open(ERROR_LOG_PATH, "a", encoding="utf-8") as f:
            f.write(error_msg + "\n")
        return HTMLResponse("<h1>Authentication failed. No code found.</h1>", status_code=400)
    # Exchange code for access token
    data = {
        "grant_type": "authorization_code",
        "client_id": UID,
        "client_secret": SECRET,
        "code": code,
        "redirect_uri": REDIRECT_URI
    }
    try:
        response = requests.post(TOKEN_URL, data=data)
        response.raise_for_status()
        token_info = response.json()
        access_token = token_info.get("access_token")
        if not access_token:
            error_msg = f"[{now}] [IP: {client_host}] Failed to get access token."
            with open(ERROR_LOG_PATH, "a", encoding="utf-8") as f:
                f.write(error_msg + "\n")
            return HTMLResponse("<h1>Failed to get access token.</h1>", status_code=400)
        # Fetch user data
        headers = {"Authorization": f"Bearer {access_token}"}
        user_response = requests.get(USER_URL, headers=headers)
        user_response.raise_for_status()
        user_data = user_response.json()
        # Save user data to file (for fill_template)
        with open("./data/user.json", "w", encoding="utf-8") as f:
            json.dump(user_data, f, ensure_ascii=False, indent=4)
        # Extract first and last name for filename
        first_name = user_data.get("first_name", "Unknown")
        last_name = user_data.get("last_name", "Unknown")
        safe_first_name = ''.join(c for c in first_name if c.isalnum())
        safe_last_name = ''.join(c for c in last_name if c.isalnum())
        pdf_filename = f"Academic_Transcript_{safe_first_name}_{safe_last_name}.pdf"
        # Log successful login
        log_entry = f"[{now}] [IP: {client_host}] Login: {first_name} {last_name} (ID: {user_data.get('id', 'N/A')}, Login: {user_data.get('login', 'N/A')})"
        with open(ACCESS_LOG_PATH, "a", encoding="utf-8") as f:
            f.write(log_entry + "\n")
        # Generate transcript
        fill_template()
        generate_pdf()
        pdf_path = os.path.join("data", "output.pdf")
        if os.path.exists(pdf_path):
            return FileResponse(pdf_path, media_type="application/pdf", filename=pdf_filename)
        else:
            error_msg = f"[{now}] [IP: {client_host}] PDF not found after generation."
            with open(ERROR_LOG_PATH, "a", encoding="utf-8") as f:
                f.write(error_msg + "\n")
            return HTMLResponse("<h1>PDF not found after generation.</h1>", status_code=500)
    except Exception as e:
        error_msg = f"[{now}] [IP: {client_host}] Error: {str(e)}"
        with open(ERROR_LOG_PATH, "a", encoding="utf-8") as f:
            f.write(error_msg + "\n")
        return HTMLResponse(f"<h1>Error: {str(e)}</h1>", status_code=500)

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
