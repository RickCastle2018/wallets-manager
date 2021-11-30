#!/usr/bin/bash

SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
BACKUP_DIR="$SCRIPT_DIR/backups/"
find $BACKUP_DIR -mindepth 1 -mtime +30 -delete
