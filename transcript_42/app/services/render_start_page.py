from fastapi.responses import HTMLResponse

def render_start_page(auth_url: str) -> HTMLResponse:
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
                display: flex;
                justify-content: center;
                align-items: center;
                color: white;
                flex-direction: column;
            }}
            .container {{
                max-width: 400px;
                width: 100%;
                background: #1d2028;
                border-radius: 8px;
                border: 1px solid #424242;
                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                padding: 32px;
                box-sizing: border-box;
                text-align: center;
                margin-bottom: 16px;
            }}
            h1, h2 {{
                margin: 0;
                line-height: 1.2;
                color: white;
            }}
            h2 {{
                margin-top: 4px;
                margin-bottom: 30px;
                font-weight: normal;
            }}
            a.button {{
                display: inline-block;
                background: #00babc;
                color: white;
                padding: 12px 20px;
                border-radius: 4px;
                font-size: 16px;
                font-weight: bold;
                text-decoration: none;
                transition: background 0.3s;
            }}
            a.button:hover {{
                background: #009fa0;
            }}
            .footer {{
                margin-top: 20px;
                font-size: 13px;
                color: #a0a0a0;
                text-align: center;
            }}
            .footer a {{
                color: #00babc;
                text-decoration: none;
            }}
            .footer a:hover {{
                text-decoration: underline;
            }}
            .note {{
                max-width: 400px;
                color: #cfcfcf;
                font-size: 13px;
                text-align: center;
            }}
            .note a {{
                color: #00babc;
                text-decoration: none;
            }}
            .note a:hover {{
                text-decoration: underline;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>42 Berlin</h1>
            <h2>Academic Transcript</h2>
            <a class="button" href="{auth_url}">Login with 42</a>

        </div>
            <div class="footer">
                <a href="https://42berlin.de/" target="_blank">42 Berlin </a>© | Made by 
                <a href="https://github.com/julesrb" target="_blank">Jules Bernard</a>
            </div>
    </body>
    </html>
    """)