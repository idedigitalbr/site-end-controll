# Operação futura do Site EndControl

Estes arquivos são templates e runbooks locais para uma futura hospedagem Linux com Node.js, MySQL nativo, systemd e Nginx. Nenhum deles autoriza acesso à VPS, mudança de DNS ou corte de produção.

A URL oficial permanece https://idedigitalbr.github.io/site-end-controll/ até a aprovação do corte. O domínio futuro, o sistema operacional, a instância MySQL e o destino externo de backup ainda precisam ser definidos.

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
