# Operação do Site EndControl

O deploy Docker na stack `endcontrol` foi autorizado e realizado em 2026-11-25. A operação atual está em [deploy/README.md](../../deploy/README.md), com evidências em [validação do corte](docker-deployment-2026-11-25.md).

A URL atual é https://endcontrol.suporteide.digital/. Os runbooks nativos abaixo são alternativas históricas; seus comandos systemd e caminhos não descrevem os containers ativos. O destino externo e a automatização dos backups ainda precisam ser definidos.

- [Implantação nativa](deployment.md)
- [Backup e restauração](backup-restore.md)
- [Rollback de release](release-rollback.md)
- [Recuperação de acesso administrativo](admin-recovery.md)
- [Validação local](local-validation.md)

Templates versionados:

- scripts/operations/templates/endcontrol.service
- scripts/operations/templates/endcontrol.nginx.conf
- scripts/operations/templates/mysql-endcontrol.cnf
- scripts/operations/templates/endcontrol.env.example
- scripts/operations/templates/endcontrol-migration.env.example
- scripts/operations/templates/mysql-operations.cnf.example

Os valores com example.com e REPLACE são placeholders. Arquivos preenchidos com URLs, senhas, segredos ou credenciais devem ficar fora do repositório.
