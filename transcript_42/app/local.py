from services.fill_latex_template import fill_latex_template
from services.generate_pdf import generate_pdf
import json

# provide the "user_local.json" as your user API call response

with open("/app/output/user_local.json", "r", encoding="utf-8") as f:
			user_data = json.load(f)
fill_latex_template(user_path = "/app/output/user_local",
					user_data = user_data,
					date_of_birth = "place-your-own",
					location_of_birth = "plcae-your-own",
					language = "en",
					transcript_type = "core_advanced")
generate_pdf(user_path = "/app/output/user_local")

