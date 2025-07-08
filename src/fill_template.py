import json
from jinja2 import Template

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
    core_completed = "September 6, 2024"
    # {% for project in projects_users %}
	# 	{%- if project.id == 3816445 -%}
	# 		{%- if project["validated?"] -%}
	# 			date: {{ project.marked_at }} \\
	# 		{%- endif -%}
	# 	{%- endif -%}
	# {% endfor %}
    advanced_prog = "in progress"

    rank0 = [{"name": "Libft",
              "details": "jfghdjkfgsdfgvwdfvsdfvsdff",
              "grade": 125,
              "h": 70}]
    
    project_id = 1314

    # is proje validated ? DEF return grade

    def is_project_validated(project_id)
        for project in data.projects_users:
            if project.get("id") == project_id and project.get("status") == "finished" and project.get("validated?"):
                return project.get("final_mark")

    if is_project_validated(1314):
        # add to Rank 0




    




    # Load the LaTeX template
    with open("./src/transcript_template.tex") as f:
        template = Template(f.read())

    # Render the template with the JSON data
    output_tex = template.render(data)

    # Save output .tex file
    with open("./data/output.tex", "w") as f:
        f.write(output_tex)
