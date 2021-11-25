#!/usr/bin/bash
# usage: sudo ./restore.sh {backup-filepath} {db-name}

# warning! this WON'T overwrite already exist records (see https://techoverflow.net/2019/06/25/how-to-fix-mongorestore-e11000-duplicate-key-error-collection/)

docker-compose exec -T db sh -c "mongorestore --username ogle --password nikita --authenticationDatabase $2 --archive" < $1
