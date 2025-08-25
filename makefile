VENV_DIR := .venv
PYTHON := $(VENV_DIR)/bin/python
PIP := $(VENV_DIR)/bin/pip

DOCKER_IMAGE := pdflatex-image


all: shared-folder docker-up

docker-up: 
	docker-compose up --build

shared-folder: 
	sudo mkdir -p /var/data
	sudo chmod -R 777 /data

run-local: 
	$(PYTHON) -m app.local

ssl-certif:
	bash reverse_proxy.sh

clean:
	rm -rf $(VENV_DIR)
	find . -type d -name "__pycache__" -exec rm -rf {} +
	@if docker images -q pdflatex-image > /dev/null; then \
		echo "Removing Docker image pdflatex-image..."; \
		docker rmi pdflatex-image; \
	else \
		echo "Docker image pdflatex-image not found."; \
	fi