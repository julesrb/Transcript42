import json
from jinja2 import Template
from datetime import datetime


def fill_template():

	# Load JSON data
	with open("./data/user.json") as f:
		data = json.load(f)

	with open("./projects/projects_dict.json") as f:
		pj_dic = json.load(f)

	def parse_projects(data, pj_dic):
		parsed = {}
		for entry in data["projects_users"]:
			project = entry.get("project", {})
			project_name = project.get("name")
			if project_name:
				# Parse the marked_at date once
				marked_at_str = entry.get("marked_at")
				marked_at = None
				if marked_at_str:
					try:
						marked_at = datetime.fromisoformat(marked_at_str.replace("Z", "+00:00"))
					except ValueError:
						marked_at = None  # or log/raise depending on how strict you want to be
				project_id = str(project.get("id"))
				project_data = pj_dic.get(project_id, {})
				parsed[project_name] = {
					"id": project_id,
					"name": project_data.get("name"),
					"validated": entry.get("validated?"),
					"marked_at": marked_at,
					"description": project_data.get("description"),
					"grade": entry.get("final_mark"),
					"hours": project_data.get("hours")
				}
		return parsed
	
	parsed = parse_projects(data, pj_dic)

	with open("./data/user_prj.json", "w", encoding="utf-8") as f:
		json.dump(parsed, f, ensure_ascii=False, indent=4, default=str)

	# TODO add logic to get the campus here
	school_address = """42 Berlin
					Harzer Straße 39
					12059 Berlin
					GERMANY"""
	
	first_name = data["first_name"]
	last_name = data["last_name"]
	date_of_birth = "06.07.1994"

	passed_selection = data["pool_month"] + " " + data["pool_year"]
	core_started = "November 28, 2022"

	tran = parsed.get("ft_transcendence")
	exam = parsed.get("Exam Rank 06")

	if all([tran, exam, tran["validated"], exam["validated"]]):
		core_completed = max(tran["marked_at"], exam["marked_at"]).isoformat()
	else:
		core_completed = "in progress"

	# TODO add logic to get the date here
	advanced_completed = "in progress" 

	# Rank 0
	rank0 = []
	if parsed.get("Libft", {}).get("validated"):
		rank0.append(parsed["Libft"])


	# Rank 1
	rank1 = []
	if parsed.get("ft_printf", {}).get("validated"):
		rank1.append(parsed["ft_printf"])

	if parsed.get("Born2beroot", {}).get("validated"):
		rank1.append(parsed["Born2beroot"])

	if parsed.get("get_next_line", {}).get("validated"):
		rank1.append(parsed["get_next_line"])

	# Rank 2
	rank2 = []
	if parsed.get("FdF", {}).get("validated"):
		rank2.append(parsed["FdF"])

	if parsed.get("so_long", {}).get("validated"):
		rank2.append(parsed["so_long"])

	if parsed.get("fract-ol", {}).get("validated"):
		rank2.append(parsed["fract-ol"])

	if parsed.get("push_swap", {}).get("validated"):
		rank2.append(parsed["push_swap"])

	if parsed.get("minitalk", {}).get("validated"):
		rank2.append(parsed["minitalk"])

	if parsed.get("pipex", {}).get("validated"):
		rank2.append(parsed["pipex"])

	# Rank 3
	rank3 = []
	if parsed.get("minishell", {}).get("validated"):
		rank3.append(parsed["minishell"])

	if parsed.get("Philosophers", {}).get("validated"):
		rank3.append(parsed["Philosophers"])

	# Rank 4
	rank4 = []
	if parsed.get("cub3d", {}).get("validated"):
		rank4.append(parsed["cub3d"])

	if parsed.get("miniRT", {}).get("validated"):
		rank4.append(parsed["miniRT"])

	if parsed.get("NetPractice", {}).get("validated"):
		rank4.append(parsed["NetPractice"])

	if parsed.get("CPP Module 00", {}).get("validated"):
		rank4.append(parsed["CPP Module 00"])

	if parsed.get("CPP Module 01", {}).get("validated"):
		rank4.append(parsed["CPP Module 01"])

	if parsed.get("CPP Module 02", {}).get("validated"):
		rank4.append(parsed["CPP Module 02"])

	if parsed.get("CPP Module 03", {}).get("validated"):
		rank4.append(parsed["CPP Module 03"])

	if parsed.get("CPP Module 04", {}).get("validated"):
		rank4.append(parsed["CPP Module 04"])


	# Rank 5
	rank5 = []
	if parsed.get("CPP Module 05", {}).get("validated"):
		rank5.append(parsed["CPP Module 05"])

	if parsed.get("CPP Module 06", {}).get("validated"):
		rank5.append(parsed["CPP Module 06"])

	if parsed.get("CPP Module 07", {}).get("validated"):
		rank5.append(parsed["CPP Module 07"])

	if parsed.get("CPP Module 08", {}).get("validated"):
		rank5.append(parsed["CPP Module 08"])

	if parsed.get("CPP Module 09", {}).get("validated"):
		rank5.append(parsed["CPP Module 09"])

	if parsed.get("ft_irc", {}).get("validated"):
		rank5.append(parsed["ft_irc"])

	if parsed.get("webserv", {}).get("validated"):
		rank5.append(parsed["webserv"])

	if parsed.get("Inception", {}).get("validated"):
		rank5.append(parsed["Inception"])


	# Rank 6
	rank6 = []
	if parsed.get("ft_transcendence", {}).get("validated"):
		rank6.append(parsed["ft_transcendence"])




	# Load the LaTeX template
	with open("./src/transcript_template.tex") as f:
		template = Template(f.read())

	extra_vars = {
		"school_address": school_address,
		"first_name": first_name,
		"last_name": last_name,
		"date_of_birth": date_of_birth,
		"passed_selection": passed_selection,
		"core_started": core_started,
		"core_completed": core_completed,
		"advanced_completed": advanced_completed,
		"rank0": rank0,
		"rank1": rank1,
		"rank2": rank2,
		"rank3": rank3,
		"rank4": rank4,
		"rank5": rank5,
		"rank6": rank6
	}
	
	# Render the template with the JSON data
	output_tex = template.render(**extra_vars)

	# Save output .tex file
	with open("./data/output.tex", "w") as f:
		f.write(output_tex)
