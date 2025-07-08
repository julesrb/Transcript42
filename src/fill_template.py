import json
from jinja2 import Template
from datetime import datetime

def is_project_validated(name, data):
	for entry in data.projects_users:
		if (entry.get("project", {}).get("name") == name
			and entry.get("status") == "finished"
			and entry.get("validated?") is True):
			return (
				True,                         # Project was validated
				entry.get("final_mark"),      # Final mark
				entry.get("marked_at")        # When it was marked
			)
	return (False, -1, None)  # Not validated


def fill_template():

	# Load JSON data
	with open("./data/user.json") as f:
		data = json.load(f)

	school_adress = """42 Berlin
					Harzer Straße 39
					12059 Berlin
					GERMANY"""
	
	first_name = data.first_name
	last_name = data.last_name
	date_of_birth = "06.07.1994"

	passed_selection = data.pool_month + " " + data.pool_year
	core_started = "November 28, 2022"
	core_completed = "in_progress"

	ft_valid, ft_mark, ft_date = is_project_validated("ft_transcendence", data)
	exam_valid, exam_mark, exam_date = is_project_validated("Exam Rank 06", data)

	if ft_valid and exam_valid:
		# Convert both dates to datetime objects
		dates = [datetime.fromisoformat(d.replace("Z", "+00:00")) for d in (ft_date, exam_date)]
		latest_date = max(dates)

		# Save the latest date in ISO format
		core_completed = latest_date.isoformat()

	advanced_prog = "in progress"

	rank0 = [{"name": "Libft",
			  "details": "jfghdjkfgsdfgvwdfvsdfvsdff",
			  "grade": 125,
			  "h": 70}]
	
	project_id = 1314

	# is proje validated ? DEF return grade

	

	# if is_project_validated(1314)
		# add to Rank 0



	# Load the LaTeX template
	with open("./src/transcript_template.tex") as f:
		template = Template(f.read())

	# Render the template with the JSON data
	output_tex = template.render(data)

	# Save output .tex file
	with open("./data/output.tex", "w") as f:
		f.write(output_tex)
