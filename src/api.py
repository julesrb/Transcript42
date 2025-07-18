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
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; background: #f7f7f7; margin: 0; padding: 0; }}
                .container {{ max-width: 400px; margin: 40px auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); padding: 32px; }}
                h2 {{ text-align: center; color: #333; }}
                form label {{ display: block; margin-bottom: 12px; color: #222; }}
                form input, form select {{ width: 100%; padding: 8px; margin-top: 4px; border-radius: 4px; border: 1px solid #ccc; box-sizing: border-box; }}
                .date-group {{ display: flex; gap: 8px; }}
                .date-group select {{ width: 33%; }}
                button {{ width: 100%; background: #007bff; color: #fff; border: none; padding: 12px; border-radius: 4px; font-size: 16px; cursor: pointer; margin-top: 16px; }}
                button:hover {{ background: #0056b3; }}
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Complete your profile</h2>
                <form action="/transcript" method="post">
                    <input type="hidden" name="code" value="{code}">
                    <input type="hidden" name="date_of_birth" id="date_of_birth">
                    <label>Date of Birth:
                        <div class="date-group">
                            <select name="dob_day" required>
                                <option value="">Day</option>
                                {''.join(f'<option value="{d}">{d}</option>' for d in range(1,32))}
                            </select>
                            <select name="dob_month" required>
                                <option value="">Month</option>
                                {''.join(f'<option value="{m}">{m}</option>' for m in range(1,13))}
                            </select>
                            <select name="dob_year" required>
                                <option value="">Year</option>
                                {''.join(f'<option value="{y}">{y}</option>' for y in range(1980, datetime.datetime.now().year-10))}
                            </select>
                        </div>
                    </label>
                    <label>Location of Birth: <input type="text" name="location_of_birth" required></label>
                    <label>Language:
                        <select name="language" required>
                            <option value="en">English</option>
                            <option value="de">German</option>
                        </select>
                    </label>
                    <label>Transcript Type:
                        <select name="transcript_type" required>
                            <option value="core">Core</option>
                            <option value="core_advanced">Core + Advanced</option>
                        </select>
                    </label>
                    <button type="submit">Generate Transcript</button>
                </form>
            </div>
            <script>
            document.querySelector('form').addEventListener('submit', function(e) {{
                var day = document.querySelector('[name="dob_day"]').value;
                var month = document.querySelector('[name="dob_month"]').value;
                var year = document.querySelector('[name="dob_year"]').value;
                if(day && month && year) {{
                    document.getElementById('date_of_birth').value = year + '-' + month.padStart(2, '0') + '-' + day.padStart(2, '0');
                }}
            }});
            </script>
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
