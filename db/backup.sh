# Based on https://dev.to/mkubdev/mongodump-and-mongorestore-with-docker-39m7

docker-compose exec -T db sh -c 'mongodump --archive' > ./backups/$(date '+%Y-%m-%d|%H:%M:%S').dump