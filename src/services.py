import requests
import os
from .fill_template import fill_template
from .generate_pdf import generate_pdf

def exchange_code_for_token(code, UID, SECRET, REDIRECT_URI, TOKEN_URL):
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

def fetch_user_data(access_token, USER_URL):
    """Fetch user data from the 42 API using the access token."""
    headers = {"Authorization": f"Bearer {access_token}"}
    user_response = requests.get(USER_URL, headers=headers)
    user_response.raise_for_status()
    return user_response.json()

def generate_transcript(date_of_birth=None, location_of_birth=None):
    """Generate the transcript PDF by filling the template and generating the PDF file."""
    fill_template(date_of_birth=date_of_birth, location_of_birth=location_of_birth)
    generate_pdf() 