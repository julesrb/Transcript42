
all: docker-up

ENV_FILE ?= .env
docker-up: 
	docker compose --env-file $(ENV_FILE) down
	docker compose --env-file $(ENV_FILE) up --build -d

