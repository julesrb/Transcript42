VENV_DIR := .venv
PYTHON := $(VENV_DIR)/bin/python
PIP := $(VENV_DIR)/bin/pip

DOCKER_IMAGE := pdflatex-image


all: docker-image venv install run

docker-image:
	@if [ -z "$$(docker images -q $(DOCKER_IMAGE))" ]; then \
		echo "Building Docker image $(DOCKER_IMAGE)..."; \
		docker build -t $(DOCKER_IMAGE) .; \
	else \
		echo "Docker image $(DOCKER_IMAGE) already exists."; \
	fi

venv:
	@test -d $(VENV_DIR) || python3 -m venv $(VENV_DIR)

install: venv
	$(PIP) install --upgrade pip
	$(PIP) install -r requirements.txt

run: 
	$(PYTHON) -m app.local

serve: docker-image venv install
	PYTHONPATH=app nohup $(VENV_DIR)/bin/gunicorn app.main:app \
		--workers 1 \
		--worker-class uvicorn.workers.UvicornWorker \
		--bind 0.0.0.0:80 \
		--access-logfile - \
		--error-logfile - \
		>> data/logs.log 2>&1 &

clean:
	rm -rf $(VENV_DIR)
	find . -type d -name "__pycache__" -exec rm -rf {} +
	@if docker images -q pdflatex-image > /dev/null; then \
		echo "Removing Docker image pdflatex-image..."; \
		docker rmi pdflatex-image; \
	else \
		echo "Docker image pdflatex-image not found."; \
	fi