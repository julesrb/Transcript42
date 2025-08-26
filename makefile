
all: shared-folder docker-up

docker-up: 
	docker compose up --build

shared-folder: 
	mkdir -p ./transcript_42/output
	chmod -R 777 ./transcript_42/output

run-local: 
	$(PYTHON) -m app.local

ssl-certif:
	bash reverse_proxy.sh
