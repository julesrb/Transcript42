from datetime import datetime
from fastapi.responses import HTMLResponse

def render_profile_form(user_id: str) -> HTMLResponse:
	return HTMLResponse(f"""
		<html>
		<head>
			<style>
				* {{
					font-family: Arial, sans-serif;
				}}
				body {{
					background: #12141a;
					margin: 0;
					padding: 0;
					height: 100vh;

					/* Flex to center container vertically and horizontally */
					display: flex;
					justify-content: center;
					align-items: center;
					color: white;
				}}
				.container {{
					max-width: 400px;
					width: 100%;
					margin: 40px auto;
					background: #1d2028;
					border-radius: 8px;
					border: 1px solid #424242;
					box-shadow: 0 2px 8px rgba(0,0,0,0.08);
					padding: 32px;
					box-sizing: border-box;
					color: white;
				}}
				h1, h2 {{
					text-align: center;
					color: white;
					margin: 0;
					line-height: 1.2;
					}}
				h2 {{
					margin-top: 4px;
					margin-bottom: 30px;
				}}

				form label {{
					display: block;
					margin-bottom: 12px;
					color: white;
				}}
				form input,
				form select {{
					width: 100%;
					padding: 8px;
					margin-top: 4px;
					border-radius: 4px;
					border: 1px solid #00babc;
					box-sizing: border-box;
					background: #2a2d37;
					color: white;
				}}
				.date-group {{
					display: flex;
					gap: 8px;
				}}
				.date-group select {{
					width: 33%;
				}}
				button {{
					width: 100%;
					background: #00babc;
					color: white;
					border: none;
					padding: 12px;
					border-radius: 4px;
					font-size: 16px;
					cursor: pointer;
					margin-top: 16px;
					font-weight: bold;
				}}
				button:hover {{
					background: #0056b3;
				}}
			</style>
		</head>
		<body>
			<div class="container">
				<h1>42 Berlin</h1>
				<h2>Academic Transcript</h2>
				<form action="/transcript" method="post">
					<input type="hidden" name="user_id" value="{user_id}">
					<input type="hidden" name="date_of_birth" id="date_of_birth">
					<label>Date of Birth:
						<div class="date-group">
							<select name="dob_day" required>
								<option value="">Day</option>
								{''.join(f'<option value="{d}">{d}</option>' for d in range(1, 32))}
							</select>
							<select name="dob_month" required>
								<option value="">Month</option>
								{''.join(f'<option value="{m}">{m}</option>' for m in range(1, 13))}
							</select>
							<select name="dob_year" required>
								<option value="">Year</option>
								{''.join(f'<option value="{y}">{y}</option>' for y in range(1940, datetime.now().year - 10))}
							</select>
						</div>
					</label>
					<label>Location of Birth: <input type="text" name="location_of_birth" required></label>
					<label>Language:
						<select name="language" required>
							<option value="en">English</option>
							<option value="de">German</option>
						</select>
					</label>
					<label>Transcript Type:
						<select name="transcript_type" required>
							<option value="core">Core</option>
							<option value="core_advanced">Core + Advanced</option>
						</select>
					</label>
					<button type="submit">Generate Transcript</button>
				</form>
			</div>
			<script>
				document.querySelector('form').addEventListener('submit', function(e) {{
					var day = document.querySelector('[name="dob_day"]').value;
					var month = document.querySelector('[name="dob_month"]').value;
					var year = document.querySelector('[name="dob_year"]').value;
					if (day && month && year) {{
						document.getElementById('date_of_birth').value = year + '-' + month.padStart(2, '0') + '-' + day.padStart(2, '0');
					}}
				}});
			</script>
		</body>
		</html>
	""")
