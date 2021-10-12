# based on https://dev.to/mkubdev/mongodump-and-mongorestore-with-docker-39m7
# usage: sudo sh restore.sh {backup-filename}

# warning! this WON'T overwrite already exist records (see https://techoverflow.net/2019/06/25/how-to-fix-mongorestore-e11000-duplicate-key-error-collection/)

docker-compose exec -T db sh -c 'mongorestore --archive' < ./backups/$1
