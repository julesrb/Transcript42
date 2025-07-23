from app.services.fill_latex_template import fill_latex_template
from app.services.generate_pdf import generate_pdf
import json

# provide the "user_local.json" as your user API call response

with open("data/user" + ".json", "r", encoding="utf-8") as f:
			user_data = json.load(f)
fill_latex_template(user_path = "data/user_local",
					user_data = user_data,
					date_of_birth = "-test-",
					location_of_birth = "-test",
					language = "de",
					transcript_type = "core_advanced")
generate_pdf(user_path = "data/user_local")

