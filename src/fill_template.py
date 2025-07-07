import json
from jinja2 import Template

def fill_template():

    # Load JSON data
    with open("./data/user.json") as f:
        data = json.load(f)

    # Load the LaTeX template
    with open("./src/transcript_template.tex") as f:
        template = Template(f.read())

    # Render the template with the JSON data
    output_tex = template.render(data)

    # Save output .tex file
    with open("./data/output.tex", "w") as f:
        f.write(output_tex)
