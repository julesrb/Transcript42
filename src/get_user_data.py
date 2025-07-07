import os
import json
import requests
import webbrowser
import threading
import http.server
import socketserver
from urllib.parse import urlparse, parse_qs
from dotenv import load_dotenv

def get_user_data():
    # Load .env variables
    load_dotenv()
    UID = os.getenv("UID")
    SECRET = os.getenv("SECRET")

    redirect_uri = "http://127.0.0.1:8000"
    auth_url = "https://api.intra.42.fr/oauth/authorize"
    token_url = "https://api.intra.42.fr/oauth/token"

    # Shared variable + threading event
    auth_code_holder = {"code": None}
    server_ready = threading.Event()

    class OAuthHandler(http.server.SimpleHTTPRequestHandler):
        def do_GET(self):
            parsed = urlparse(self.path)
            code = parse_qs(parsed.query).get("code")
            if code:
                auth_code_holder["code"] = code[0]
                self.send_response(200)
                self.send_header("Content-type", "text/html")
                self.end_headers()
                self.wfile.write(b"<h1>Authentication successful. You can close this window.</h1>")
            else:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(b"<h1>Authentication failed. No code found.</h1>")

    def start_server():
        with socketserver.TCPServer(("127.0.0.1", 8000), OAuthHandler) as httpd:
            server_ready.set()
            httpd.handle_request()

    # Start server in background
    server_thread = threading.Thread(target=start_server, daemon=True)
    server_thread.start()
    server_ready.wait()

    # Build and open auth URL
    params = {
        "client_id": UID,
        "redirect_uri": redirect_uri,
        "response_type": "code",
        "scope": "public"
    }
    auth_full_url = f"{auth_url}?{requests.compat.urlencode(params)}"
    print("Opening browser for authentication...")
    webbrowser.open(auth_full_url)

    # Wait for code
    print("Waiting for redirect and authorization code...")
    while auth_code_holder["code"] is None:
        pass
    print("✅ Received code.")

    # Step 3: Exchange code for access token
    data = {
        "grant_type": "authorization_code",
        "client_id": UID,
        "client_secret": SECRET,
        "code": auth_code_holder["code"],
        "redirect_uri": redirect_uri
    }

    response = requests.post(token_url, data=data)
    response.raise_for_status()
    token_info = response.json()
    access_token = token_info.get("access_token")
    print("✅ Access token received.")

    # Step 4: Use token to fetch user info
    headers = {"Authorization": f"Bearer {access_token}"}
    user_url = "https://api.intra.42.fr/v2/me"
    print("Fetching user data...")
    user_response = requests.get(user_url, headers=headers)
    user_response.raise_for_status()
    user_data = user_response.json()

    # Save user data to file
    with open("./data/user.json", "w", encoding="utf-8") as f:
        json.dump(user_data, f, ensure_ascii=False, indent=4)

    print("✅ User data saved to user.json")