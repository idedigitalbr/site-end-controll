# Docker deployment — EndControl

Authorized on 2026-11-25 for the `endcontrol` stack at
https://endcontrol.suporteide.digital. The separate `sistema-endcontrol` stack
must remain untouched. Earlier native/systemd runbooks are historical alternatives.

The operator keeps Compose and private `.env`, `.env.app`, `.env.db` files in
`/opt/endcontrol-site/cms`, mode 0600. Sources are immutable Git archives at
`/opt/endcontrol-site/releases/<full-commit>`. MySQL and uploads use the named
volumes `endcontrol_cms_db` and `endcontrol_cms_media`. No database port is published.

The private `.env` also contains `LOCAL_IMPORT_DATABASE_URL`, using the same CMS
database credentials but host `127.0.0.1`. The `media-import` tool shares the MySQL
network namespace to honor the original importer's localhost-only restriction.
It does not expose a database port or weaken the importer guard.

Before the initial switch, the original static image, inspect metadata and entire
project were backed up at `/var/backups/endcontrol/pre-next-20261125T163312Z`.
Both compressed archives passed integrity checks and SHA-256 verification.
The original static container had no mounted volumes and no database.

Run `release.sh` on the host with `RELEASE_ID` and `BACKUP_DIR` provided in the
environment. It serializes deploys, builds using a dedicated bounded builder,
migrates/seeds/imports original media, runs an isolated smoke container, switches
the existing service, and checks HTTPS health. The first admin bootstrap requires
an empty user table and a private temporary `.env.bootstrap`; it is removed after
successful account creation. Never copy local development users into production.

Image retention runs in plan mode, preserving all releases; no automatic image,
volume or backup deletion is enabled. The project helper supports a reviewed
three-release policy after enough releases exist. Other project caches are untouched.

Initial rollback: run `docker compose -f /opt/endcontrol-site/app/docker-compose.yml
up -d --no-build web`. Keep the original image and project directory. Do not remove
the CMS database or uploads when rolling back. Subsequent deploys must additionally
back up the live MySQL database and uploaded media consistently before migrations.

Do not run the initial bootstrap workflow against an existing production database.
