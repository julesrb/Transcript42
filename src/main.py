from .get_user_data import get_user_data
from .fill_template import fill_template
from .generate_pdf import generate_pdf
import json

# get_user_data()
with open("data/user.json", "r", encoding="utf-8") as f:
            user_data = json.load(f)
fill_template(user_data)
generate_pdf()
