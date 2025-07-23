from .get_user_data import get_user_data
from .services.fill_latex_template import fill_latex_template
from .generate_pdf import generate_pdf
import json

# get_user_data()
with open("data/user.json", "r", encoding="utf-8") as f:
            user_data = json.load(f)
fill_latex_template(user_data)
generate_pdf()
