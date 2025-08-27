
all: docker-up

docker-up: shared-folder
	docker compose down
	docker compose up --build

shared-folder: 
	mkdir -p ../transcript_42_shared_data
	chmod -R 777 ../transcript_42_shared_data

run-local: shared-folder
	docker compose build transcript_42
	docker compose run --rm transcript_42 python3 local.py
	echo "The generated files are in ../transcript_42_shared_data"

ssl-certif:
	bash reverse_proxy.sh
