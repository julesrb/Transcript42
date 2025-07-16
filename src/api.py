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

app = FastAPI()

load_dotenv()
UID = os.getenv("42UID")
SECRET = os.getenv("42SECRET")
REDIRECT_URI = os.getenv("OAUTH_REDIRECT_URI", "http://68.183.66.13:8000/callback")
AUTH_URL = "https://api.intra.42.fr/oauth/authorize"
TOKEN_URL = "https://api.intra.42.fr/oauth/token"
USER_URL = "https://api.intra.42.fr/v2/me"

@app.get("/login")
def login():
    params = {
        "client_id": UID,
        "redirect_uri": REDIRECT_URI,
        "response_type": "code",
        "scope": "public"
    }
    url = f"{AUTH_URL}?{urllib.parse.urlencode(params)}"
    return RedirectResponse(url)

@app.get("/callback")
def callback(request: Request):
    code = request.query_params.get("code")
    if not code:
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
            return HTMLResponse("<h1>Failed to get access token.</h1>", status_code=400)
        # Fetch user data
        headers = {"Authorization": f"Bearer {access_token}"}
        user_response = requests.get(USER_URL, headers=headers)
        user_response.raise_for_status()
        user_data = user_response.json()
        # Save user data to file (for fill_template)
        with open("./data/user.json", "w", encoding="utf-8") as f:
            json.dump(user_data, f, ensure_ascii=False, indent=4)
        # Generate transcript
        fill_template()
        generate_pdf()
        pdf_path = os.path.join("data", "output.pdf")
        if os.path.exists(pdf_path):
            return FileResponse(pdf_path, media_type="application/pdf", filename="transcript.pdf")
        else:
            return HTMLResponse("<h1>PDF not found after generation.</h1>", status_code=500)
    except Exception as e:
        return HTMLResponse(f"<h1>Error: {str(e)}</h1>", status_code=500)

@app.post("/generate")
def generate_transcript():
    # This endpoint is now for local/manual testing only
    try:
        fill_template()
        generate_pdf()
        pdf_path = os.path.join("data", "output.pdf")
        if os.path.exists(pdf_path):
            return FileResponse(pdf_path, media_type="application/pdf", filename="transcript.pdf")
        else:
            return JSONResponse(content={"status": "error", "message": "PDF not found after generation."}, status_code=500)
    except Exception as e:
        return JSONResponse(content={"status": "error", "message": str(e)}, status_code=500)

if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
