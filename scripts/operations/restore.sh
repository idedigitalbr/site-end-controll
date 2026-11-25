#!/usr/bin/env bash
set -Eeuo pipefail
umask 077

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
# shellcheck source=_common.sh
source "$SCRIPT_DIR/_common.sh"

usage() {
  cat <<'USAGE'
Uso:
  sudo env MYSQL_DATABASE=endcontrol_cms MYSQL_DEFAULTS_FILE=... \
    CMS_MEDIA_DIR=/var/lib/endcontrol/media \
    scripts/operations/restore.sh /var/backups/endcontrol/backup.tar.gz \
    --confirm-database=endcontrol_cms

O nome confirmado deve coincidir com MYSQL_DATABASE e com o banco registrado
no manifesto do backup. Antes de importar, o script salva o estado atual em
BACKUP_DIR e mantém a cópia anterior de uploads como media.pre-restore-*.
USAGE
}

if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  usage
  exit 0
fi
[[ "$#" -eq 2 ]] || ops_die "Informe o arquivo e --confirm-database=NOME. Use --help."

archive_input="$1"
confirmation="$2"
[[ "$confirmation" == --confirm-database=* ]] || ops_die "A confirmação precisa usar --confirm-database=NOME."
confirmed_database="${confirmation#--confirm-database=}"

ops_require_root
ops_load_config
ops_validate_config
[[ "$confirmed_database" == "$MYSQL_DATABASE" ]] || ops_die "O banco confirmado precisa coincidir com MYSQL_DATABASE."
ops_acquire_lock

[[ -f "$archive_input" && ! -L "$archive_input" ]] || ops_die "O backup precisa ser um arquivo regular, não um link simbólico."
archive="$(realpath -e -- "$archive_input")" || ops_die "Arquivo de backup não encontrado."
checksum_file="$archive.sha256"
[[ -f "$checksum_file" && ! -L "$checksum_file" ]] || ops_die "O arquivo lateral SHA-256 do backup não foi encontrado."
(
  cd "$(dirname -- "$archive")"
  sha256sum --check --strict -- "$(basename -- "$archive").sha256" >/dev/null
) || ops_die "O SHA-256 externo do backup não confere."
WORK_DIR="$(mktemp -d -- "$BACKUP_DIR/.endcontrol-restore.XXXXXXXX")"
RESTART_SERVICE_ON_EXIT=1
SERVICE_WAS_ACTIVE=0
MEDIA_STAGE_ROOT=""
trap ops_finish EXIT

ops_unpack_snapshot "$archive" "$WORK_DIR/requested"
archive_database="$(ops_snapshot_database_name "$WORK_DIR/requested/manifest.txt")"
[[ "$archive_database" == "$MYSQL_DATABASE" ]] || ops_die "O backup pertence a outro banco. Nenhuma alteração foi aplicada."
ops_test_database_connection
ops_validate_upload_tree "$CMS_MEDIA_DIR"

ops_stop_service_if_active
restore_id="$(date -u +%Y%m%dT%H%M%SZ)-$$"
rollback_archive="$BACKUP_DIR/endcontrol-pre-restore-$restore_id.tar.gz"
ops_make_snapshot "$WORK_DIR/current" "$rollback_archive"
ops_unpack_snapshot "$rollback_archive" "$WORK_DIR/current-snapshot"

CMS_MEDIA_PARENT="$(dirname -- "$CMS_MEDIA_DIR")"
[[ -d "$CMS_MEDIA_PARENT" && ! -L "$CMS_MEDIA_PARENT" ]] || ops_die "O diretório pai dos uploads não é válido."
MEDIA_STAGE_ROOT="$(mktemp -d -- "$CMS_MEDIA_PARENT/.endcontrol-restore-media.XXXXXXXX")"
prepared_media="$MEDIA_STAGE_ROOT/media"
mkdir -m 700 -- "$prepared_media"
cp -a -- "$WORK_DIR/requested/uploads/." "$prepared_media/"
chown -R "$APP_USER:$APP_GROUP" -- "$prepared_media"
chmod 750 -- "$prepared_media"
find "$prepared_media" -type f -exec chmod 600 -- {} +

previous_media="$CMS_MEDIA_DIR.pre-restore-$restore_id"
[[ ! -e "$previous_media" && ! -L "$previous_media" ]] || ops_die "A pasta de retenção anterior já existe: $previous_media."

if ! "$MYSQL_BIN" "--defaults-extra-file=$MYSQL_DEFAULTS_FILE" \
  --default-character-set=utf8mb4 "$MYSQL_DATABASE" \
  < "$WORK_DIR/requested/database.sql"; then
  printf 'ERRO: importação do backup falhou; restaurando o banco anterior.\n' >&2
  if "$MYSQL_BIN" "--defaults-extra-file=$MYSQL_DEFAULTS_FILE" \
    --default-character-set=utf8mb4 "$MYSQL_DATABASE" \
    < "$WORK_DIR/current-snapshot/database.sql"; then
    ops_die "A importação foi revertida. A pasta de uploads atual foi preservada."
  fi
  RESTART_SERVICE_ON_EXIT=0
  ops_die "A importação falhou e a reversão do banco também. O serviço ficará parado. Backup de segurança: $rollback_archive."
fi

if ! mv -- "$CMS_MEDIA_DIR" "$previous_media"; then
  if "$MYSQL_BIN" "--defaults-extra-file=$MYSQL_DEFAULTS_FILE" \
    --default-character-set=utf8mb4 "$MYSQL_DATABASE" \
    < "$WORK_DIR/current-snapshot/database.sql"; then
    ops_die "Não foi possível trocar a pasta de uploads; o banco foi revertido."
  fi
  RESTART_SERVICE_ON_EXIT=0
  ops_die "A troca falhou e a reversão do banco também. O serviço ficará parado. Backup de segurança: $rollback_archive."
fi

if ! mv -- "$prepared_media" "$CMS_MEDIA_DIR"; then
  if ! mv -- "$previous_media" "$CMS_MEDIA_DIR"; then
    RESTART_SERVICE_ON_EXIT=0
    ops_die "A troca de uploads falhou e a pasta anterior não voltou ao lugar. O serviço ficará parado. Backup de segurança: $rollback_archive."
  fi
  if "$MYSQL_BIN" "--defaults-extra-file=$MYSQL_DEFAULTS_FILE" \
    --default-character-set=utf8mb4 "$MYSQL_DATABASE" \
    < "$WORK_DIR/current-snapshot/database.sql"; then
    ops_die "Não foi possível instalar os uploads; banco e pasta foram revertidos."
  fi
  RESTART_SERVICE_ON_EXIT=0
  ops_die "A troca e a reversão falharam. O serviço ficará parado. Backup de segurança: $rollback_archive."
fi

if ! chown root:root -- "$previous_media" || ! chmod 700 -- "$previous_media"; then
  RESTART_SERVICE_ON_EXIT=0
  ops_die "A restauração foi aplicada, mas não foi possível proteger os uploads anteriores. O serviço ficará parado; confira os donos e modos de $previous_media antes de iniciar."
fi

printf 'Restauração aplicada ao banco %s.\n' "$MYSQL_DATABASE"
printf 'Uploads antigos retidos em: %s\n' "$previous_media"
printf 'Snapshot anterior retido em: %s\n' "$rollback_archive"
