import json
from jinja2 import Template
from datetime import datetime
from utils.json_utils import save_json

def load_data(user_path: str, projects_path: str) -> tuple[dict, dict]:
	"""Load user and project dictionary data from JSON files."""
	with open(user_path) as f:
		user_data = json.load(f)
	with open(projects_path) as f:
		projects_dict = json.load(f)
	return user_data, projects_dict


def parse_projects(data: dict, pj_dic: dict, language: str = "en") -> dict:
	"""Parse and enrich project data from user and project dictionary."""
	parsed = {}
	for entry in data["projects_users"]:
		project = entry.get("project", {})
		project_name = project.get("name")
		if project_name:
			marked_at_str = entry.get("marked_at")
			marked_at = None
			if marked_at_str:
				try:
					marked_at = datetime.fromisoformat(marked_at_str.replace("Z", "+00:00"))
				except ValueError:
					marked_at = None
			project_id = str(project.get("id"))
			project_data = pj_dic.get(project_id, {})
			if language == "de":
				description = project_data.get("beschreibung")
			else:
				description = project_data.get("description")
			if project_data:
				parsed[project_name] = {
					"id": project_id,
					"name": project_data.get("name"),
					"validated": entry.get("validated?"),
					"marked_at": marked_at,
					"description": description,
					"grade": entry.get("final_mark"),
					"hours": project_data.get("hours")
				}
	return parsed


def append_validated_project(parsed: dict, rank: list, project_name: str):
	"""Append project to rank if validated."""
	if parsed.get(project_name, {}).get("validated"):
		rank.append(parsed[project_name])


def organize_projects_by_category(parsed: dict) -> dict:
	"""Organize projects into categories/ranks as required by the template, with one line per project assignment."""
	# Rank 0
	rank0 = []
	append_validated_project(parsed, rank0, "Libft")

	# Rank 1
	rank1 = []
	append_validated_project(parsed, rank1, "ft_printf")
	append_validated_project(parsed, rank1, "Born2beroot")
	append_validated_project(parsed, rank1, "get_next_line")

	# Rank 2
	rank2 = []
	append_validated_project(parsed, rank2, "FdF")
	append_validated_project(parsed, rank2, "so_long")
	append_validated_project(parsed, rank2, "fract-ol")
	append_validated_project(parsed, rank2, "push_swap")
	append_validated_project(parsed, rank2, "minitalk")
	append_validated_project(parsed, rank2, "pipex")

	# Rank 3
	rank3 = []
	append_validated_project(parsed, rank3, "minishell")
	append_validated_project(parsed, rank3, "Philosophers")

	# Rank 4
	rank4 = []
	append_validated_project(parsed, rank4, "cub3d")
	append_validated_project(parsed, rank4, "miniRT")
	append_validated_project(parsed, rank4, "NetPractice")
	append_validated_project(parsed, rank4, "CPP Module 00")
	append_validated_project(parsed, rank4, "CPP Module 01")
	append_validated_project(parsed, rank4, "CPP Module 02")
	append_validated_project(parsed, rank4, "CPP Module 03")
	append_validated_project(parsed, rank4, "CPP Module 04")

	# Rank 5
	rank5 = []
	append_validated_project(parsed, rank5, "CPP Module 05")
	append_validated_project(parsed, rank5, "CPP Module 06")
	append_validated_project(parsed, rank5, "CPP Module 07")
	append_validated_project(parsed, rank5, "CPP Module 08")
	append_validated_project(parsed, rank5, "CPP Module 09")
	append_validated_project(parsed, rank5, "ft_irc")
	append_validated_project(parsed, rank5, "webserv")
	append_validated_project(parsed, rank5, "Inception")

	# Rank 6
	rank6 = []
	append_validated_project(parsed, rank6, "ft_transcendence")

	# AI and Algo
	ai = []
	append_validated_project(parsed, ai, "gomoku")
	append_validated_project(parsed, ai, "expert-system")
	append_validated_project(parsed, ai, "n-puzzle")
	append_validated_project(parsed, ai, "ft_linear_regression")
	append_validated_project(parsed, ai, "krpsim")
	append_validated_project(parsed, ai, "rubik")
	append_validated_project(parsed, ai, "dslr")
	append_validated_project(parsed, ai, "multilayer-perceptron")
	append_validated_project(parsed, ai, "total-perspective-vortex")
	append_validated_project(parsed, ai, "zappy")
	append_validated_project(parsed, ai, "lem_in")
	append_validated_project(parsed, ai, "corewar")
	# append_validated_project(parsed, ai, "Python for Data Science")
	# append_validated_project(parsed, ai, "Piscine Data Science")
	append_validated_project(parsed, ai, "Data Science - 0")
	append_validated_project(parsed, ai, "Data Science - 1")
	append_validated_project(parsed, ai, "Data Science - 2")
	append_validated_project(parsed, ai, "Data Science - 3")
	append_validated_project(parsed, ai, "Data Science - 4")
	append_validated_project(parsed, ai, "Python - 0 - Starting")
	append_validated_project(parsed, ai, "Python - 1 - Array")
	append_validated_project(parsed, ai, "Python - 2 - DataTable")
	append_validated_project(parsed, ai, "Python - 3 - OOP")
	append_validated_project(parsed, ai, "Python - 4 - Dod")
	append_validated_project(parsed, ai, "Leaffliction")

	# Security
	security = []
	append_validated_project(parsed, security, "ft_nmap")
	append_validated_project(parsed, security, "snow-crash")
	append_validated_project(parsed, security, "darkly")
	append_validated_project(parsed, security, "rainfall")
	append_validated_project(parsed, security, "dr-quine")
	append_validated_project(parsed, security, "woody-woodpacker")
	append_validated_project(parsed, security, "famine")
	append_validated_project(parsed, security, "pestilence")
	append_validated_project(parsed, security, "war")
	append_validated_project(parsed, security, "death")
	append_validated_project(parsed, security, "boot2root")
	append_validated_project(parsed, security, "ft_shield")
	append_validated_project(parsed, security, "override")
	append_validated_project(parsed, security, "ft_malcolm")
	append_validated_project(parsed, security, "tinky-winkey")

	# Networking
	devops = []
	append_validated_project(parsed, devops, "taskmaster")
	append_validated_project(parsed, devops, "ft_ping")
	append_validated_project(parsed, devops, "ft_traceroute")
	append_validated_project(parsed, devops, "cloud-1")
	append_validated_project(parsed, devops, "Inception-of-Things")
	append_validated_project(parsed, devops, "Bgp At Doors of Autonomous Systems is Simple")

	# Web & Mobile
	web = []
	append_validated_project(parsed, web, "ft_hangouts")
	append_validated_project(parsed, web, "swifty-companion")
	append_validated_project(parsed, web, "camagru")
	append_validated_project(parsed, web, "matcha")
	append_validated_project(parsed, web, "hypertube")
	append_validated_project(parsed, web, "swifty-proteins")
	append_validated_project(parsed, web, "music-room")
	append_validated_project(parsed, web, "red-tetris")
	append_validated_project(parsed, web, "Piscine RoR")
	append_validated_project(parsed, web, "Piscine Django")
	append_validated_project(parsed, web, "Piscine Symfony")
	append_validated_project(parsed, web, "Mobile")

	# Kernel
	kernel = []
	append_validated_project(parsed, kernel, "libasm")
	append_validated_project(parsed, kernel, "nibbler")
	append_validated_project(parsed, kernel, "strace")
	append_validated_project(parsed, kernel, "ft_linux")
	append_validated_project(parsed, kernel, "little-penguin-1")
	append_validated_project(parsed, kernel, "matt-daemon")
	append_validated_project(parsed, kernel, "process-and-memory")
	append_validated_project(parsed, kernel, "drivers-and-interrupts")
	append_validated_project(parsed, kernel, "filesystem")
	append_validated_project(parsed, kernel, "kfs-2")
	append_validated_project(parsed, kernel, "kfs-1")
	append_validated_project(parsed, kernel, "kfs-3")
	append_validated_project(parsed, kernel, "kfs-4")
	append_validated_project(parsed, kernel, "kfs-5")
	append_validated_project(parsed, kernel, "kfs-6")
	append_validated_project(parsed, kernel, "kfs-7")
	append_validated_project(parsed, kernel, "kfs-8")
	append_validated_project(parsed, kernel, "kfs-9")
	append_validated_project(parsed, kernel, "kfs-x")
	append_validated_project(parsed, kernel, "userspace_digressions")
	append_validated_project(parsed, kernel, "lem-ipc")
	append_validated_project(parsed, kernel, "nm")
	append_validated_project(parsed, kernel, "malloc")
	append_validated_project(parsed, kernel, "ft_ls")
	append_validated_project(parsed, kernel, "42sh")

	# Graphics
	graphics = []
	append_validated_project(parsed, graphics, "42run")
	append_validated_project(parsed, graphics, "bomberman")
	append_validated_project(parsed, graphics, "scop")
	append_validated_project(parsed, graphics, "humangl")
	append_validated_project(parsed, graphics, "xv")
	append_validated_project(parsed, graphics, "in-the-shadows")
	append_validated_project(parsed, graphics, "particle-system")
	append_validated_project(parsed, graphics, "ft_vox")
	append_validated_project(parsed, graphics, "shaderpixel")
	append_validated_project(parsed, graphics, "guimp")
	append_validated_project(parsed, graphics, "doom-nukem")
	append_validated_project(parsed, graphics, "mod1")
	append_validated_project(parsed, graphics, "rt")
	append_validated_project(parsed, graphics, "ft_newton")
	append_validated_project(parsed, graphics, "ft_minecraft")
	append_validated_project(parsed, graphics, "Unity")

	# Crypto
	crypto = []
	append_validated_project(parsed, crypto, "computorv1")
	append_validated_project(parsed, crypto, "computorv2")
	append_validated_project(parsed, crypto, "ft_ssl_rsa")
	append_validated_project(parsed, crypto, "ft_ssl_md5")
	append_validated_project(parsed, crypto, "ft_ssl_des")
	append_validated_project(parsed, crypto, "ready set boole")
	append_validated_project(parsed, crypto, "matrix")
	append_validated_project(parsed, crypto, "ft_kalman")

	# Dev
	dev = []
	append_validated_project(parsed, dev, "ft_turing")
	append_validated_project(parsed, dev, "ft_ality")
	append_validated_project(parsed, dev, "h42n42")
	append_validated_project(parsed, dev, "avaj-launcher")
	append_validated_project(parsed, dev, "swingy")
	append_validated_project(parsed, dev, "fix-me")
	append_validated_project(parsed, dev, "Open Project")
	append_validated_project(parsed, dev, "Rushes")
	append_validated_project(parsed, dev, "Piscine Object")
	append_validated_project(parsed, dev, "Abstract_data")
	append_validated_project(parsed, dev, "ft_lex")
	append_validated_project(parsed, dev, "ft_yacc")

	return {
		"rank0": rank0,
		"rank1": rank1,
		"rank2": rank2,
		"rank3": rank3,
		"rank4": rank4,
		"rank5": rank5,
		"rank6": rank6,
		"ai": ai,
		"security": security,
		"devops": devops,
		"web": web,
		"kernel": kernel,
		"graphics": graphics,
		"crypto": crypto,
		"dev": dev,
	}


def prepare_template_variables(data: dict, parsed: dict, organized: dict, date_of_birth=None, location_of_birth=None, language=None, transcript_type=None) -> dict:
	"""Prepare all variables required for the LaTeX template."""
	school_address = """Harzer Straße 39\n12059 Berlin\nGERMANY"""
	first_name = data["first_name"].upper()
	last_name = data["last_name"].upper()
	# Format date_of_birth if provided
	if date_of_birth:
		try:
			dob_dt = datetime.fromisoformat(date_of_birth)
			date_of_birth_formatted = dob_dt.strftime("%d.%m.%Y")
		except Exception:
			date_of_birth_formatted = date_of_birth  # fallback to original if parsing fails
	else:
		date_of_birth_formatted = "-coming soon-"
	location_of_birth = location_of_birth if location_of_birth else "-coming soon-"
	date_issued = datetime.today().strftime("%d.%m.%Y")
	month_name = data["pool_month"].strip().capitalize()
	year = data["pool_year"].strip()
	try:
		# Parse "October" into a datetime object
		dt = datetime.strptime(month_name, "%B")
		month_number = dt.month
		passed_selection = f"{month_number:02}.{year}"
	except Exception as e:
		passed_selection = f"{month_name} {year}"

	target_cursus = next(
		(c for c in data["cursus_users"] if c["id"] in {244384, 196717}),
		None
	)
	core_started = None
	if target_cursus:
		raw_date = target_cursus["begin_at"]
		dt = datetime.fromisoformat(raw_date.replace("Z", "+00:00"))
		core_started = dt.strftime("%d.%m.%Y")
	tran = parsed.get("ft_transcendence")
	exam = parsed.get("Exam Rank 06")
	if tran is not None and exam is not None and tran.get("validated") and exam.get("validated"):
		dt = max(tran["marked_at"], exam["marked_at"])
		core_completed = dt.strftime("%d.%m.%Y")
	else:
		core_completed = "in progress"
	advanced_completed = "in progress"  # TODO: add logic to get the date here
	extra_vars = {
		"school_address": school_address,
		"first_name": first_name,
		"last_name": last_name,
		"date_of_birth": date_of_birth_formatted,
		"location_of_birth": location_of_birth,
		"date_issued": date_issued,
		"passed_selection": passed_selection,
		"core_started": core_started,
		"core_completed": core_completed,
		"advanced_completed": advanced_completed,
		"language": language,
		"transcript_type": transcript_type,
	}
	extra_vars.update(organized)
	return extra_vars


def render_and_save_template(template_path: str, variables: dict, output_path: str):
	"""Render the LaTeX template and save the output."""
	with open(template_path) as f:
		template = Template(f.read())
	output_tex = template.render(**variables)
	with open(output_path, "w") as f:
		f.write(output_tex)

def fill_latex_template(user_path, user_data, date_of_birth=None, location_of_birth=None, language=None, transcript_type=None):
	"""Orchestrate the transcript template filling process."""
	with open("/app/projects/projects_dict.json") as f:
		projects_dict = json.load(f)
	# Ensure language is a string and not None
	lang = language if isinstance(language, str) and language else "en"
	parsed = parse_projects(user_data, projects_dict, lang)
	# Optionally, you can still write parsed to a user-specific file if needed, but not to a shared file
	organized = organize_projects_by_category(parsed)
	variables = prepare_template_variables(user_data, parsed, organized, date_of_birth, location_of_birth, language, transcript_type)
	render_and_save_template("/app/template/transcript_template.tex", variables, user_path + ".tex")
