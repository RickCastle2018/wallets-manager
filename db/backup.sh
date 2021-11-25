#!/usr/bin/bash
# usage: sudo ./backup.sh {db-name}

SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
BACKUP_DIR="$SCRIPT_DIR/backups"
[[ ! -d "$BACKUP_DIR" ]] && mkdir -p "$BACKUP_DIR"
FILENAME="$(date '+%Y-%m-%d-%H:%M:%S')-$1.dump"
docker-compose exec -T db sh -c "mongodump --username ogle --password nikita --authenticationDatabase $1 --archive" > "${BACKUP_DIR}"/"${FILENAME}"
