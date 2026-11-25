#!/usr/bin/env bash
set -euo pipefail
umask 077
cd /opt/endcontrol-site/cms
exec 9>/opt/endcontrol-site/cms/deploy.lock
flock -n 9 || { echo 'Another EndControl deploy is active'; exit 1; }
: "${RELEASE_ID:?release required}"
: "${BACKUP_DIR:?verified backup required}"
sha256sum -c "$BACKUP_DIR/SHA256SUMS"
source_dir="/opt/endcontrol-site/releases/$RELEASE_ID"
test -f "$source_dir/package-lock.json"
compose=(docker compose --env-file .env -f compose.yml)
if ! docker buildx inspect endcontrol-builder >/dev/null 2>&1; then
  docker buildx create --name endcontrol-builder --driver docker-container --driver-opt memory=2g --driver-opt cpu-quota=100000 --buildkitd-config "$source_dir/deploy/buildkitd.toml"
fi
docker buildx build --builder endcontrol-builder --load --tag "endcontrol-next:$RELEASE_ID" --label io.idedigital.deploy.project=endcontrol --label "io.idedigital.deploy.release=$RELEASE_ID" -f "$source_dir/deploy/Dockerfile" "$source_dir"
"${compose[@]}" up -d db
for i in $(seq 1 90); do
  state=$(docker inspect -f '{{.State.Health.Status}}' endcontrol-cms-db)
  [ "$state" != healthy ] || break
  sleep 2
done
test "$state" = healthy
"${compose[@]}" run --rm --no-deps web npm run db:migrate
"${compose[@]}" run --rm --no-deps web npm run db:seed
"${compose[@]}" run --rm --no-deps web npm run db:import-media
"${compose[@]}" run --rm --no-deps --user root web sh -c 'mkdir -p /app/storage/media && chown node:node /app/storage/media'
if [ -f .env.bootstrap ]; then
  docker run --rm --network endcontrol_default --env-file .env.app --env-file .env.bootstrap "endcontrol-next:$RELEASE_ID" node deploy/bootstrap-admin.mjs
  rm .env.bootstrap
fi
docker run -d --name endcontrol-next-smoke --network endcontrol_default --env-file .env.app --memory 768m "endcontrol-next:$RELEASE_ID"
trap 'docker rm -f endcontrol-next-smoke >/dev/null 2>&1 || true' EXIT
for i in $(seq 1 60); do
  if docker exec endcontrol-next-smoke node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"; then ready=1; break; fi
  sleep 2
done
test "${ready:-0}" = 1
docker rm -f endcontrol-next-smoke
trap - EXIT
"${compose[@]}" up -d web
for i in $(seq 1 60); do
  state=$(docker inspect -f '{{.State.Health.Status}}' endcontrol-web)
  [ "$state" != healthy ] || break
  sleep 2
done
if [ "$state" != healthy ]; then
  echo 'Healthcheck failed; restoring the original static service'
  docker compose -f /opt/endcontrol-site/app/docker-compose.yml up -d --no-build web
  exit 1
fi
curl --fail --silent --show-error --retry 5 https://endcontrol.suporteide.digital/api/health
python3 "$source_dir/deploy/docker_retention.py" --project endcontrol --repository endcontrol-next --active-tag "$RELEASE_ID" --keep-releases 3 --health-container endcontrol-web
echo 'RELEASE_HEALTHY'
