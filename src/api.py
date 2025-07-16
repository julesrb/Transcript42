from fastapi import FastAPI
from fastapi.responses import FileResponse, JSONResponse
import uvicorn
from get_user_data import get_user_data
from fill_template import fill_template
from generate_pdf import generate_pdf
import os

app = FastAPI()

@app.post("/generate")
def generate_transcript():
    try:
        get_user_data()
        fill_template()
        generate_pdf()
        pdf_path = os.path.join("data", "output.pdf")
        if os.path.exists(pdf_path):
            return FileResponse(pdf_path, media_type="application/pdf", filename="transcript.pdf")
        else:
            return JSONResponse(content={"status": "error", "message": "PDF not found after generation."}, status_code=500)
    except Exception as e:
        return JSONResponse(content={"status": "error", "message": str(e)}, status_code=500)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
