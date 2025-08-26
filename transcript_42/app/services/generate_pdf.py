import os
import subprocess
import logging

def generate_pdf(user_path):
	filled_template_path = user_path + ".tex"

	try:
		# Run pdflatex directly (no docker run needed)
		for i in range(2):  # run twice for references
			subprocess.run([
				"pdflatex",
				"-interaction=nonstopmode",
				"-output-directory", "/app/output",
				filled_template_path
			], check=True, capture_output=True)

		# Check if PDF was generated
		pdf_path = os.path.join(
			"/app/output",
			os.path.splitext(os.path.basename(filled_template_path))[0] + ".pdf"
		)

		if os.path.exists(pdf_path):
			logging.info(f"✅ PDF successfully generated: {pdf_path}")
		else:
			logging.error("❌ PDF generation failed - no output file created")

	except subprocess.CalledProcessError as e:
		print(f"🔥 Error during PDF generation:")
		print(f"Command: {e.cmd}")
		print(f"Exit code: {e.returncode}")
		print(f"Stderr: {e.stderr.decode('utf-8')}")
		print(f"Stdout: {e.stdout.decode('utf-8')}")
