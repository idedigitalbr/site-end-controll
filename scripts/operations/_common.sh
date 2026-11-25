#!/usr/bin/env bash
# Shared safety checks for the EndControl VPS operations scripts.

set -Eeuo pipefail
umask 077

ops_die() {
  printf 'ERRO: %s\n' "$*" >&2
  exit 1
}

ops_require_root() {
  [[ "${EUID:-$(id -u)}" -eq 0 ]] || ops_die "Execute com sudo/root."
}

ops_load_config() {
  : "${MYSQL_DATABASE:?Defina MYSQL_DATABASE.}"
  : "${MYSQL_DEFAULTS_FILE:?Defina MYSQL_DEFAULTS_FILE para o arquivo de credenciais MySQL.}"
  : "${CMS_MEDIA_DIR:?Defina CMS_MEDIA_DIR para o diretório persistente de uploads.}"

  APP_STATE_DIR="${APP_STATE_DIR:-/var/lib/endcontrol}"
  BACKUP_DIR="${BACKUP_DIR:-/var/backups/endcontrol}"
  APP_SERVICE="${APP_SERVICE:-endcontrol.service}"
  APP_USER="${APP_USER:-endcontrol}"
  APP_GROUP="${APP_GROUP:-endcontrol}"
  MYSQL_BIN="${MYSQL_BIN:-mysql}"
  MYSQLDUMP_BIN="${MYSQLDUMP_BIN:-mysqldump}"
}

ops_validate_config() {
  [[ "$MYSQL_DATABASE" =~ ^[A-Za-z0-9_]+$ ]] || ops_die "MYSQL_DATABASE contém caracteres não permitidos."
  [[ "$APP_SERVICE" =~ ^[A-Za-z0-9_.@-]+$ ]] || ops_die "APP_SERVICE inválido."
  [[ "$APP_USER" =~ ^[A-Za-z0-9_.-]+$ ]] || ops_die "APP_USER inválido."
  [[ "$APP_GROUP" =~ ^[A-Za-z0-9_.-]+$ ]] || ops_die "APP_GROUP inválido."

  [[ "$APP_STATE_DIR" == /* && "$APP_STATE_DIR" != "/" ]] || ops_die "APP_STATE_DIR deve ser um caminho absoluto diferente de /."
  [[ "$CMS_MEDIA_DIR" == /* && "$CMS_MEDIA_DIR" != "/" ]] || ops_die "CMS_MEDIA_DIR deve ser um caminho absoluto diferente de /."
  [[ "$APP_STATE_DIR" != *"/../"* && "$APP_STATE_DIR" != */.. ]] || ops_die "APP_STATE_DIR não pode conter segmentos .."
  [[ "$CMS_MEDIA_DIR" != *"/../"* && "$CMS_MEDIA_DIR" != */.. ]] || ops_die "CMS_MEDIA_DIR não pode conter segmentos .."
  [[ -d "$APP_STATE_DIR" && ! -L "$APP_STATE_DIR" ]] || ops_die "APP_STATE_DIR precisa existir e não pode ser um link simbólico."
  [[ -d "$CMS_MEDIA_DIR" && ! -L "$CMS_MEDIA_DIR" ]] || ops_die "CMS_MEDIA_DIR precisa existir e não pode ser um link simbólico."

  APP_STATE_DIR="$(realpath -e -- "$APP_STATE_DIR")"
  CMS_MEDIA_DIR="$(realpath -e -- "$CMS_MEDIA_DIR")"
  [[ "$CMS_MEDIA_DIR" == "$APP_STATE_DIR/"* ]] || ops_die "CMS_MEDIA_DIR precisa ficar dentro de APP_STATE_DIR; isso evita um restore acidental de outro diretório."

  [[ "$MYSQL_DEFAULTS_FILE" == /* ]] || ops_die "MYSQL_DEFAULTS_FILE deve ser um caminho absoluto."
  [[ -f "$MYSQL_DEFAULTS_FILE" && ! -L "$MYSQL_DEFAULTS_FILE" ]] || ops_die "O arquivo de credenciais MySQL não existe ou é um link simbólico."
  [[ "$(stat -c '%u' -- "$MYSQL_DEFAULTS_FILE")" == "0" ]] || ops_die "O arquivo de credenciais MySQL deve pertencer a root."
  local defaults_mode
  defaults_mode="$(stat -c '%a' -- "$MYSQL_DEFAULTS_FILE")"
  (( (8#$defaults_mode & 077) == 0 )) || ops_die "O arquivo de credenciais MySQL não pode conceder acesso ao grupo ou a outros usuários."

  mkdir -p -- "$BACKUP_DIR"
  [[ -d "$BACKUP_DIR" && ! -L "$BACKUP_DIR" ]] || ops_die "BACKUP_DIR precisa ser um diretório real."
  BACKUP_DIR="$(realpath -e -- "$BACKUP_DIR")"
  [[ "$BACKUP_DIR" != "$CMS_MEDIA_DIR/"* && "$CMS_MEDIA_DIR" != "$BACKUP_DIR/"* ]] || ops_die "BACKUP_DIR e CMS_MEDIA_DIR precisam ser diretórios separados."
  [[ "$(stat -c '%u' -- "$BACKUP_DIR")" == "0" ]] || ops_die "BACKUP_DIR deve pertencer a root."
  local backup_mode
  backup_mode="$(stat -c '%a' -- "$BACKUP_DIR")"
  (( (8#$backup_mode & 077) == 0 )) || ops_die "BACKUP_DIR precisa estar acessível somente a root (modo 700)."

  command -v realpath >/dev/null || ops_die "Comando obrigatório ausente: realpath."
  command -v stat >/dev/null || ops_die "Comando obrigatório ausente: stat."
  command -v flock >/dev/null || ops_die "Comando obrigatório ausente: flock."
  command -v tar >/dev/null || ops_die "Comando obrigatório ausente: tar."
  command -v gzip >/dev/null || ops_die "Comando obrigatório ausente: gzip."
  command -v sha256sum >/dev/null || ops_die "Comando obrigatório ausente: sha256sum."
  command -v systemctl >/dev/null || ops_die "Comando obrigatório ausente: systemctl."
  command -v "$MYSQL_BIN" >/dev/null || ops_die "Cliente MySQL não encontrado: $MYSQL_BIN."
  command -v "$MYSQLDUMP_BIN" >/dev/null || ops_die "mysqldump não encontrado: $MYSQLDUMP_BIN."
}

ops_acquire_lock() {
  local lock_file="$BACKUP_DIR/.operations.lock"
  [[ ! -L "$lock_file" ]] || ops_die "O arquivo de lock não pode ser um link simbólico."
  ( umask 077; : >> "$lock_file" )
  chmod 600 -- "$lock_file"
  exec {OPS_LOCK_FD}>"$lock_file"
  flock -x "$OPS_LOCK_FD"
}

ops_test_database_connection() {
  "$MYSQL_BIN" "--defaults-extra-file=$MYSQL_DEFAULTS_FILE" \
    --default-character-set=utf8mb4 \
    --batch --skip-column-names \
    "$MYSQL_DATABASE" \
    --execute='SELECT 1' >/dev/null
}

ops_validate_upload_tree() {
  local directory="$1"
  local candidate relative

  [[ -d "$directory" && ! -L "$directory" ]] || ops_die "Diretório de uploads inválido: $directory."
  while IFS= read -r -d '' candidate; do
    [[ -f "$candidate" && ! -L "$candidate" ]] || ops_die "Uploads precisam conter apenas arquivos regulares."
    relative="${candidate#"$directory"/}"
    [[ "$relative" != */* ]] || ops_die "Subdiretórios inesperados em uploads: $relative."
    [[ "$relative" =~ ^[0-9a-f-]{36}\.(jpg|png|webp|gif|avif)$ ]] || ops_die "Nome de upload inesperado: $relative."
  done < <(find "$directory" -mindepth 1 -print0)
}

ops_make_snapshot() {
  local workspace="$1"
  local archive="$2"
  local partial="$archive.partial"
  local checksum="$archive.sha256"
  local checksum_partial="$checksum.partial"

  [[ "$archive" == "$BACKUP_DIR/"* ]] || ops_die "O arquivo de backup precisa ficar dentro de BACKUP_DIR."
  [[ ! -e "$archive" && ! -L "$archive" && ! -e "$partial" && ! -L "$partial" ]] || ops_die "O destino do backup já existe: $archive."
  [[ ! -e "$checksum" && ! -L "$checksum" && ! -e "$checksum_partial" && ! -L "$checksum_partial" ]] || ops_die "O checksum de destino já existe: $checksum."
  mkdir -m 700 -- "$workspace"
  mkdir -m 700 -- "$workspace/uploads"
  ops_validate_upload_tree "$CMS_MEDIA_DIR"

  "$MYSQLDUMP_BIN" "--defaults-extra-file=$MYSQL_DEFAULTS_FILE" \
    --default-character-set=utf8mb4 \
    --single-transaction --quick --skip-lock-tables \
    --no-tablespaces --hex-blob --triggers \
    "$MYSQL_DATABASE" > "$workspace/database.sql"
  [[ -s "$workspace/database.sql" ]] || ops_die "mysqldump produziu um arquivo SQL vazio."

  cp -a -- "$CMS_MEDIA_DIR/." "$workspace/uploads/"
  printf 'format=1\ndatabase=%s\ncreated_utc=%s\nmedia_directory=%s\n' \
    "$MYSQL_DATABASE" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$CMS_MEDIA_DIR" \
    > "$workspace/manifest.txt"
  (
    cd "$workspace"
    find database.sql uploads -type f -print0 | sort -z | xargs -0 -r sha256sum > checksums.sha256
  )
  chmod 600 -- "$workspace/database.sql" "$workspace/manifest.txt" "$workspace/checksums.sha256"
  find "$workspace/uploads" -type f -exec chmod 600 -- {} +
  chmod 700 -- "$workspace/uploads"

  tar --create --gzip --file "$partial" --directory "$workspace" \
    database.sql checksums.sha256 manifest.txt uploads
  chmod 600 -- "$partial"
  mv -- "$partial" "$archive"
  (
    cd "$BACKUP_DIR"
    sha256sum "$(basename -- "$archive")" > "$checksum_partial"
  )
  chmod 600 -- "$checksum_partial"
  mv -- "$checksum_partial" "$checksum"
  printf 'Backup criado: %s\nChecksum salvo em: %s\n' "$archive" "$checksum"
  cat -- "$checksum"
}

ops_unpack_snapshot() {
  local archive="$1"
  local destination="$2"
  local listing verbose member entry_type entry
  local saw_database=0 saw_checksums=0 saw_manifest=0 saw_uploads=0
  local -A seen=()

  [[ -f "$archive" && ! -L "$archive" ]] || ops_die "O backup não é um arquivo regular."
  listing="$(tar --list --gzip --file "$archive")" || ops_die "Não foi possível listar o backup."
  [[ -n "$listing" ]] || ops_die "O backup está vazio."

  while IFS= read -r member; do
    [[ -n "$member" && "$member" != /* && "$member" != *".."* && "$member" != *\\* ]] || ops_die "Caminho inválido dentro do backup."
    [[ -z "${seen["$member"]+present}" ]] || ops_die "O backup contém caminhos duplicados."
    seen["$member"]=1
    case "$member" in
      database.sql) saw_database=1 ;;
      checksums.sha256) saw_checksums=1 ;;
      manifest.txt) saw_manifest=1 ;;
      uploads|uploads/) saw_uploads=1 ;;
      uploads/*)
        entry="${member#uploads/}"
        entry="${entry%/}"
        [[ "$entry" != */* ]] || ops_die "O backup contém pastas aninhadas em uploads."
        [[ "$entry" =~ ^[0-9a-f-]{36}\.(jpg|png|webp|gif|avif)$ ]] || ops_die "O backup contém um nome de upload inválido."
        ;;
      *) ops_die "O backup contém um arquivo não permitido: $member." ;;
    esac
  done <<< "$listing"
  (( saw_database && saw_checksums && saw_manifest && saw_uploads )) || ops_die "O backup não contém todos os arquivos obrigatórios."

  verbose="$(tar --list --verbose --gzip --file "$archive")" || ops_die "Não foi possível validar os tipos de arquivo do backup."
  while IFS= read -r member; do
    entry_type="${member:0:1}"
    [[ "$entry_type" == "-" || "$entry_type" == "d" ]] || ops_die "O backup contém link simbólico ou arquivo especial."
  done <<< "$verbose"

  [[ ! -e "$destination" && ! -L "$destination" ]] || ops_die "A pasta temporária de extração já existe."
  mkdir -m 700 -- "$destination"
  tar --extract --gzip --file "$archive" --directory "$destination" \
    --no-same-owner --no-same-permissions --no-overwrite-dir
  (
    cd "$destination"
    sha256sum --check --strict checksums.sha256 >/dev/null
  ) || ops_die "A verificação SHA-256 do backup falhou."
  [[ -s "$destination/database.sql" && -f "$destination/manifest.txt" ]] || ops_die "O backup está incompleto."
  ops_validate_upload_tree "$destination/uploads"
}

ops_snapshot_database_name() {
  local manifest="$1"
  local database
  database="$(sed -n 's/^database=//p' "$manifest")"
  [[ "$database" =~ ^[A-Za-z0-9_]+$ ]] || ops_die "O nome do banco no manifesto do backup é inválido."
  printf '%s' "$database"
}

ops_stop_service_if_active() {
  local load_state
  load_state="$(systemctl show --property=LoadState --value "$APP_SERVICE" 2>/dev/null)" \
    || ops_die "Não foi possível consultar a unidade systemd $APP_SERVICE."
  [[ "$load_state" == "loaded" ]] || ops_die "A unidade systemd $APP_SERVICE não está carregada."

  SERVICE_WAS_ACTIVE=0
  if systemctl is-active --quiet "$APP_SERVICE"; then
    systemctl stop "$APP_SERVICE"
    SERVICE_WAS_ACTIVE=1
  fi
}

ops_finish() {
  local exit_code=$?
  trap - EXIT

  if [[ -n "${MEDIA_STAGE_ROOT:-}" && "$MEDIA_STAGE_ROOT" == "${CMS_MEDIA_PARENT:-}"/.endcontrol-restore-media.* ]]; then
    rm -rf -- "$MEDIA_STAGE_ROOT"
  fi
  if [[ -n "${WORK_DIR:-}" && "$WORK_DIR" == "$BACKUP_DIR"/.endcontrol-* ]]; then
    rm -rf -- "$WORK_DIR"
  fi

  if (( ${SERVICE_WAS_ACTIVE:-0} && ${RESTART_SERVICE_ON_EXIT:-1} )); then
    if ! systemctl start "$APP_SERVICE"; then
      printf 'ERRO: não foi possível iniciar %s; verifique systemctl status e journalctl.\n' "$APP_SERVICE" >&2
      exit_code=1
    fi
  fi
  exit "$exit_code"
}
