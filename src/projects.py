import os
from dotenv import load_dotenv
import requests
import json

# Load .env variables
load_dotenv()

UID = os.getenv("UID")
SECRET = os.getenv("SECRET")


# Step 1: Get an access token
auth_url = "https://api.intra.42.fr/oauth/token"
data = {
    "grant_type": "client_credentials",
    "client_id": UID,
    "client_secret": SECRET
}

response = requests.post(auth_url, data=data)
response.raise_for_status()  # Raises error if request failed
access_token = response.json()["access_token"]

# Step 2: Use the token to get cursus
headers = {"Authorization": f"Bearer {access_token}"}
api_url = "https://api.intra.42.fr/v2/projects"
all_projects = []
page = 1

while True:
    print(f"Fetching page {page}...")
    response = requests.get(api_url, headers=headers, params={"page[number]": page})
    response.raise_for_status()
    page_data = response.json()

    if not page_data:
        break

    all_projects.extend(page_data)

    link_header = response.headers.get("Link", "")
    if 'rel="next"' not in link_header:
        break

    page += 1

# for project in all_projects:
#     print(f"- {project.get('name')} (ID: {project.get('id')})")
    
with open("all_projects.json", "w", encoding="utf-8") as f:
    json.dump(all_projects, f, ensure_ascii=False, indent=4)
    
# Create a dictionary with ID as key and name as value
id_name_dict = {project['id']: project['name'] for project in all_projects}

# Save this dictionary to a JSON file
with open("projects_id_dic.json", "w", encoding="utf-8") as f:
    json.dump(id_name_dict, f, ensure_ascii=False, indent=4)

print("✅ Project ID-to-Name dictionary saved to projects_id_name.json")

