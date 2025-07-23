from services.get_oauth_token import get_oauth_token
from services.fetch_user_data import fetch_user_data
from services.render_input_form import render_profile_form
from utils.json_utils import save_json
from fastapi.responses import HTMLResponse, FileResponse, JSONResponse, RedirectResponse
import os

def handle_oauth_redirect(code: str) -> HTMLResponse:
	try:
		access_token = get_oauth_token(code)
		user_data = fetch_user_data(access_token)
		user_id = user_data.get("id")
		user_path = os.path.join("data", f"user_{user_id}.json")
		save_json(user_data, user_path)
	except Exception as e:
		return HTMLResponse(f"<h1>Authentication failed: {str(e)}</h1>", status_code=400)
	return render_profile_form(user_id)