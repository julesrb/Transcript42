from datetime import datetime
from fastapi.responses import HTMLResponse

def render_profile_form(user_id: str) -> HTMLResponse:
    return HTMLResponse(f"""
        <html>
        <head>
            <style>
                /* styles omitted for brevity, keep your existing styles here */
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Complete your profile</h2>
                <form action="/transcript" method="post">
                    <input type="hidden" name="user_id" value="{user_id}">
                    <input type="hidden" name="date_of_birth" id="date_of_birth">
                    <label>Date of Birth:
                        <div class="date-group">
                            <select name="dob_day" required>
                                <option value="">Day</option>
                                {''.join(f'<option value="{d}">{d}</option>' for d in range(1,32))}
                            </select>
                            <select name="dob_month" required>
                                <option value="">Month</option>
                                {''.join(f'<option value="{m}">{m}</option>' for m in range(1,13))}
                            </select>
                            <select name="dob_year" required>
                                <option value="">Year</option>
                                {''.join(f'<option value="{y}">{y}</option>' for y in range(1980, datetime.datetime.now().year-10))}
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
                if(day && month && year) {{
                    document.getElementById('date_of_birth').value = year + '-' + month.padStart(2, '0') + '-' + day.padStart(2, '0');
                }}
            }});
            </script>
        </body>
        </html>
    """)