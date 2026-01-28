
all: docker-up

docker-up: shared-folder
	docker compose down
	docker compose up --build -d

shared-folder: 
	mkdir -p ../transcript_42_shared_data
	chmod -R 777 ../transcript_42_shared_data
