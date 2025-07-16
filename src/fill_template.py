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

	school_address = """42 Berlin
					Harzer Straße 39
					12059 Berlin
					GERMANY"""
	
	first_name = data["first_name"].upper()
	last_name = data["last_name"].upper()
	date_of_birth = "-coming soon-"
	location_of_birth = "-coming soon-"
	date_issued = datetime.today().strftime("%B %d, %Y")

	passed_selection = data["pool_month"].capitalize() + " " + data["pool_year"]
	core_started = "November 28, 2022"

	tran = parsed.get("ft_transcendence")
	exam = parsed.get("Exam Rank 06")

	if all([tran, exam, tran.get("validated"), exam.get("validated")]):
		dt = max(tran["marked_at"], exam["marked_at"])
		core_completed = dt.strftime("%B %-d, %Y")  # Use "%B %d, %Y" on Windows
	else:
		core_completed = "in progress"

	# TODO add logic to get the date here
	advanced_completed = "in progress" 

	def append_validated_project(rank, project_name):
		if parsed.get(project_name, {}).get("validated"):
			rank.append(parsed[project_name])

	# Rank 0
	rank0 = []
	append_validated_project(rank0, "Libft")

	# Rank 1
	rank1 = []
	append_validated_project(rank1, "ft_printf")
	append_validated_project(rank1, "Born2beroot")
	append_validated_project(rank1, "get_next_line")

	# Rank 2
	rank2 = []
	append_validated_project(rank2, "FdF")
	append_validated_project(rank2, "so_long")
	append_validated_project(rank2, "fract-ol")
	append_validated_project(rank2, "push_swap")
	append_validated_project(rank2, "minitalk")
	append_validated_project(rank2, "pipex")

	# Rank 3
	rank3 = []
	append_validated_project(rank3, "minishell")
	append_validated_project(rank3, "Philosophers")

	# Rank 4
	rank4 = []
	append_validated_project(rank4, "cub3d")
	append_validated_project(rank4, "miniRT")
	append_validated_project(rank4, "NetPractice")
	append_validated_project(rank4, "CPP Module 00")
	append_validated_project(rank4, "CPP Module 01")
	append_validated_project(rank4, "CPP Module 02")
	append_validated_project(rank4, "CPP Module 03")
	append_validated_project(rank4, "CPP Module 04")

	# Rank 5
	rank5 = []
	append_validated_project(rank5, "CPP Module 05")
	append_validated_project(rank5, "CPP Module 06")
	append_validated_project(rank5, "CPP Module 07")
	append_validated_project(rank5, "CPP Module 08")
	append_validated_project(rank5, "CPP Module 09")
	append_validated_project(rank5, "ft_irc")
	append_validated_project(rank5, "webserv")
	append_validated_project(rank5, "Inception")


	# Rank 6
	rank6 = []
	append_validated_project(rank6, "ft_transcendence")

	#AI and Algo
	ai= []
	append_validated_project(ai, "gomoku")
	append_validated_project(ai, "expert-system")
	append_validated_project(ai, "n-puzzle")
	append_validated_project(ai, "ft_linear_regression")
	append_validated_project(ai, "krpsim")
	append_validated_project(ai, "rubik")
	append_validated_project(ai, "dslr")
	append_validated_project(ai, "multilayer-perceptron")
	append_validated_project(ai, "total-perspective-vortex")
	append_validated_project(ai, "zappy")
	append_validated_project(ai, "lem_in")
	append_validated_project(ai, "corewar")
	append_validated_project(ai, "Python for Data Science")
	append_validated_project(ai, "Piscine Data Science")
	append_validated_project(ai, "Leaffliction")

	#Security 
	security = []
	append_validated_project(security, "ft_nmap")
	append_validated_project(security, "snow-crash")
	append_validated_project(security, "darkly")
	append_validated_project(security, "rainfall")
	append_validated_project(security, "dr-quine")
	append_validated_project(security, "woody-woodpacker")
	append_validated_project(security, "famine")
	append_validated_project(security, "pestilence")
	append_validated_project(security, "war")
	append_validated_project(security, "death")
	append_validated_project(security, "boot2root")
	append_validated_project(security, "ft_shield")
	append_validated_project(security, "override")
	append_validated_project(security, "ft_malcolm")
	append_validated_project(security, "tinky-winkey")
	

	# Networking
	devops = []
	append_validated_project(devops, "taskmaster")
	append_validated_project(devops, "ft_ping")
	append_validated_project(devops, "ft_traceroute")
	append_validated_project(devops, "cloud-1")
	append_validated_project(devops, "Inception-of-Things")
	append_validated_project(devops, "Bgp At Doors of Autonomous Systems is Simple")

	# Web & Mobile
	web = []
	append_validated_project(web, "ft_hangouts")
	append_validated_project(web, "swifty-companion")
	append_validated_project(web, "camagru")
	append_validated_project(web, "matcha")
	append_validated_project(web, "hypertube")
	append_validated_project(web, "swifty-proteins")
	append_validated_project(web, "music-room")
	append_validated_project(web, "red-tetris")
	append_validated_project(web, "Piscine RoR")
	append_validated_project(web, "Piscine Django")
	append_validated_project(web, "Piscine Symfony")
	append_validated_project(web, "Mobile")

	# Kernel
	kernel = []
	append_validated_project(kernel, "libasm")
	append_validated_project(kernel, "nibbler")
	append_validated_project(kernel, "strace")
	append_validated_project(kernel, "ft_linux")
	append_validated_project(kernel, "little-penguin-1")
	append_validated_project(kernel, "matt-daemon")
	append_validated_project(kernel, "process-and-memory")
	append_validated_project(kernel, "drivers-and-interrupts")
	append_validated_project(kernel, "filesystem")
	append_validated_project(kernel, "kfs-2")
	append_validated_project(kernel, "kfs-1")
	append_validated_project(kernel, "kfs-3")
	append_validated_project(kernel, "kfs-4")
	append_validated_project(kernel, "kfs-5")
	append_validated_project(kernel, "kfs-6")
	append_validated_project(kernel, "kfs-7")
	append_validated_project(kernel, "kfs-8")
	append_validated_project(kernel, "kfs-9")
	append_validated_project(kernel, "kfs-x")
	append_validated_project(kernel, "userspace_digressions")
	append_validated_project(kernel, "lem-ipc")
	append_validated_project(kernel, "nm")
	append_validated_project(kernel, "malloc")
	append_validated_project(kernel, "ft_ls")
	append_validated_project(kernel, "42sh")

	# Graphics
	graphics = []
	append_validated_project(graphics, "42run")
	append_validated_project(graphics, "bomberman")
	append_validated_project(graphics, "scop")
	append_validated_project(graphics, "humangl")
	append_validated_project(graphics, "xv")
	append_validated_project(graphics, "in-the-shadows")
	append_validated_project(graphics, "particle-system")
	append_validated_project(graphics, "ft_vox")
	append_validated_project(graphics, "shaderpixel")
	append_validated_project(graphics, "guimp")
	append_validated_project(graphics, "doom-nukem")
	append_validated_project(graphics, "mod1")
	append_validated_project(graphics, "rt")
	append_validated_project(graphics, "ft_newton")
	append_validated_project(graphics, "ft_minecraft")
	append_validated_project(graphics, "Unity")

	# Crypto
	crypto = []
	append_validated_project(crypto, "computorv1")
	append_validated_project(crypto, "computorv2")
	append_validated_project(crypto, "ft_ssl_rsa")
	append_validated_project(crypto, "ft_ssl_md5")
	append_validated_project(crypto, "ft_ssl_des")
	append_validated_project(crypto, "ready set boole")
	append_validated_project(crypto, "matrix")
	append_validated_project(crypto, "ft_kalman")


	# Dev
	dev = []
	append_validated_project(dev, "ft_turing")
	append_validated_project(dev, "ft_ality")
	append_validated_project(dev, "h42n42")
	append_validated_project(dev, "avaj-launcher")
	append_validated_project(dev, "swingy")
	append_validated_project(dev, "fix-me")
	append_validated_project(dev, "Open Project")
	append_validated_project(dev, "Rushes")
	append_validated_project(dev, "Piscine Object")
	append_validated_project(dev, "Abstract_data")
	append_validated_project(dev, "ft_lex")
	append_validated_project(dev, "ft_yacc")


	# Load the LaTeX template
	with open("./src/transcript_template.tex") as f:
		template = Template(f.read())

	extra_vars = {
		"school_address": school_address,
		"first_name": first_name,
		"last_name": last_name,
		"date_of_birth": date_of_birth,
		"location_of_birth": location_of_birth,
		"date_issued": date_issued,
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
	
	# Render the template with the JSON data
	output_tex = template.render(**extra_vars)

	# Save output .tex file
	with open("./data/output.tex", "w") as f:
		f.write(output_tex)
