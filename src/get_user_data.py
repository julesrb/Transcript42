import os
import json
import requests
import webbrowser
import threading
import http.server
import socketserver
from urllib.parse import urlparse, parse_qs
from dotenv import load_dotenv
from .utils import save_json, load_json
from .services import exchange_code_for_token, fetch_user_data

def load_env_vars():
    """Load .env variables and return UID and SECRET."""
    load_dotenv()
    UID = os.getenv("42UID")
    SECRET = os.getenv("42SECRET")
    return UID, SECRET


def start_oauth_server(auth_code_holder, server_ready):
    """Start a local HTTP server to receive the OAuth redirect and code."""
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

    class ReusableTCPServer(socketserver.TCPServer):
        allow_reuse_address = True

    with ReusableTCPServer(("127.0.0.1", 8000), OAuthHandler) as httpd:
        server_ready.set()
        httpd.handle_request()


def open_browser_for_auth(UID, redirect_uri, auth_url):
    """Open the browser for user authentication."""
    params = {
        "client_id": UID,
        "redirect_uri": redirect_uri,
        "response_type": "code",
        "scope": "public"
    }
    from urllib.parse import urlencode
    auth_full_url = f"{auth_url}?{urlencode(params)}"
    print("Opening browser for authentication...")
    webbrowser.open(auth_full_url)


def get_user_data():
    """Orchestrate the OAuth flow and user data retrieval."""
    UID, SECRET = load_env_vars()
    print(UID)
    print(SECRET)
    redirect_uri = "http://127.0.0.1:8000"
    auth_url = "https://api.intra.42.fr/oauth/authorize"
    token_url = "https://api.intra.42.fr/oauth/token"
    user_url = "https://api.intra.42.fr/v2/me"

    # Shared variable + threading event
    auth_code_holder = {"code": None}
    server_ready = threading.Event()

    # Start server in background
    server_thread = threading.Thread(target=start_oauth_server, args=(auth_code_holder, server_ready), daemon=True)
    server_thread.start()
    server_ready.wait()

    # Open browser for authentication
    open_browser_for_auth(UID, redirect_uri, auth_url)

    # Wait for code
    print("Waiting for redirect and authorization code...")
    while auth_code_holder["code"] is None:
        pass
    print("✅ Received code.")

    # Exchange code for access token
    access_token = exchange_code_for_token(auth_code_holder["code"], UID, SECRET, redirect_uri, token_url)

    # Fetch user data
    user_data = fetch_user_data(access_token, user_url)

    # Save user data
    save_json(user_data, "./data/user.json")