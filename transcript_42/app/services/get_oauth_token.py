import requests
from config import UID, SECRET, REDIRECT_URI, TOKEN_URL

def get_oauth_token(code):
	"""Exchange the authorization code for an access token."""
	data = {
		"grant_type": "authorization_code",
		"client_id": UID,
		"client_secret": SECRET,
		"code": code,
		"redirect_uri": REDIRECT_URI
	}
	response = requests.post(TOKEN_URL, data=data)
	response.raise_for_status()
	token_info = response.json()
	return token_info.get("access_token")
