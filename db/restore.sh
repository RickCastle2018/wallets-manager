# TODO: choose backup and restore it

docker-compose exec -T <mongodb service> sh -c 'mongorestore --archive' < db.dump