#!/usr/bin/env bash
set -Eeuo pipefail
umask 077

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
# shellcheck source=_common.sh
source "$SCRIPT_DIR/_common.sh"

usage() {
  cat <<'USAGE'
Uso:
  sudo env MYSQL_DATABASE=... MYSQL_DEFAULTS_FILE=... CMS_MEDIA_DIR=... \
    scripts/operations/backup.sh

Variáveis opcionais: APP_STATE_DIR, BACKUP_DIR, APP_SERVICE, APP_USER,
APP_GROUP, MYSQL_BIN e MYSQLDUMP_BIN. O serviço é parado durante o snapshot
para manter o dump do MySQL e os uploads no mesmo ponto de recuperação.
USAGE
}

if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  usage
  exit 0
fi
[[ "$#" -eq 0 ]] || ops_die "Argumentos extras não são aceitos. Use --help."

ops_require_root
ops_load_config
ops_validate_config
ops_acquire_lock
ops_test_database_connection

WORK_DIR="$(mktemp -d -- "$BACKUP_DIR/.endcontrol-backup.XXXXXXXX")"
RESTART_SERVICE_ON_EXIT=1
SERVICE_WAS_ACTIVE=0
trap ops_finish EXIT

ops_stop_service_if_active
backup_id="$(date -u +%Y%m%dT%H%M%SZ)-$$"
archive="$BACKUP_DIR/endcontrol-$backup_id.tar.gz"
ops_make_snapshot "$WORK_DIR/snapshot" "$archive"
