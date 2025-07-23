import requests
from ..config import USER_URL

def fetch_user_data(access_token):
    """Fetch user data from the 42 API using the access token."""
    headers = {"Authorization": f"Bearer {access_token}"}
    user_response = requests.get(USER_URL, headers=headers)
    user_response.raise_for_status()
    return user_response.json()
