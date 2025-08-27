
all: shared-folder docker-up

docker-up: 
	docker compose up --build

shared-folder: 
	mkdir -p ../transcript_42_shared_data
	chmod -R 777 ../transcript_42_shared_data

run-local: 
	$(PYTHON) -m app.local

ssl-certif:
	bash reverse_proxy.sh
