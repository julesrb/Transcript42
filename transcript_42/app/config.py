import os

UID = os.getenv("FORTYTWO_UID")
SECRET = os.getenv("FORTYTWO_SECRET")
REDIRECT_URI = os.getenv("OAUTH_REDIRECT_URI", "https://transcript42.project-cloud.cloud/oauth_redirect")
AUTH_URL = "https://api.intra.42.fr/oauth/authorize"
TOKEN_URL = "https://api.intra.42.fr/oauth/token"
USER_URL = "https://api.intra.42.fr/v2/me"
LOG_VIEW_PASSWORD = os.getenv("LOG_VIEW_PASSWORD", "changeme")
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY", "")

# Check if /app/output/logs.log exists, otherwise use logs.log
if os.path.exists("/app/output/logs.log"):
    LOG_PATH = "/app/output/logs.log"
else:
    LOG_PATH = "logs.log"