from config import UID, SECRET, REDIRECT_URI, TOKEN_URL, AUTH_URL, LOG_VIEW_PASSWORD, LOG_PATH
from .services.handle_oauth_redirect import handle_oauth_redirect
from .services.fill_latex_template import fill_latex_template
from .services.generate_pdf import generate_pdf
from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse, FileResponse, JSONResponse, RedirectResponse
import os
import json
import urllib.parse

app = FastAPI()

@app.get("/")
def authorization_request():
	auth_url = f"{AUTH_URL}?{urllib.parse.urlencode({
		'client_id': UID,
		'redirect_uri': REDIRECT_URI,
		'response_type': 'code',
		'scope': 'public'
	})}"
	return RedirectResponse(auth_url)


@app.get("/my_fabulous_transcript")
def authorization_request():
	auth_url = f"{AUTH_URL}?{urllib.parse.urlencode({
		'client_id': UID,
		'redirect_uri': REDIRECT_URI,
		'response_type': 'code',
		'scope': 'public'
	})}"
	return RedirectResponse(auth_url)


@app.get("/oauth_redirect")
def oauth_redirect(request: Request):
	code = request.query_params.get("code")
	if not code:
		return HTMLResponse("<h1>Authentication failed.</h1>", status_code=400)
	return handle_oauth_redirect(code)


@app.post("/transcript")
def create_transcript(
	user_id: str = Form(...),
	date_of_birth: str = Form(...),
	location_of_birth: str = Form(...),
	language: str = Form(...),
	transcript_type: str = Form(...),
):
	user_path = os.path.join("data", f"user_{user_id}")
	try:
		with open(user_path + ".json", "r", encoding="utf-8") as f:
			user_data = json.load(f)
	except Exception as e:
		return HTMLResponse(f"<h1>Error loading user data: {str(e)}</h1>", status_code=500)
	
	try:
		fill_latex_template(user_path, user_data, date_of_birth, location_of_birth, language, transcript_type)
	except Exception as e:
		return HTMLResponse(f"<h1>User Data can't be used to generate a transcipt</h1>", status_code=500)
	
	try:
		generate_pdf(user_path)
	except Exception as e:
		return HTMLResponse(f"<h1>PDF Generator failed, try again or contact support</h1>", status_code=500)
	
	pdf_path = user_path + ".pdf"
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


@app.get("/logs") #TODO add more secured log function
def get_logs(password: str = ""):
	if password != LOG_VIEW_PASSWORD:
		return HTMLResponse("<h1>Unauthorized</h1>", status_code=401)
	try:
		with open(LOG_PATH, "r", encoding="utf-8") as f:
			content = f.read()
		return HTMLResponse(f"<pre>{content}</pre>", status_code=200)
	except Exception as e:
		return HTMLResponse(f"<h1>Error reading access log: {str(e)}</h1>", status_code=500)

