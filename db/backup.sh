# based on https://dev.to/mkubdev/mongodump-and-mongorestore-with-docker-39m7
# usage: sudo sh backup.sh

SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
BACKUP_DIR="$SCRIPT_DIR/backups"
[[ ! -d "$BACKUP_DIR" ]] && mkdir -p "$BACKUP_DIR"
FILENAME="$(date '+%Y-%m-%d-%H:%M:%S').dump"
docker-compose exec -T db sh -c 'mongodump --archive' > "${BACKUP_DIR}"/"${FILENAME}"
