# Recuperação de acesso administrativo

Este roteiro cria uma nova conta administrativa usando o CLI Better Auth do próprio projeto. Ele não altera a senha, o papel ou as sessões de uma conta existente. Use-o somente no host de preparação ou no servidor futuro, após confirmar o banco configurado no EnvironmentFile.

O checkout atual já habilita o plugin Admin do Better Auth e contém o comando npm auth:admin:create. O comando usa auth@1.7.16 via npx, pois o CLI não está instalado em node_modules neste checkout. Antes do corte, valide o comando em preparação e deixe essa versão disponível no artefato ou no cache npm da conta endcontrol; assim, a recuperação não depende de obter um pacote durante a indisponibilidade.

Para aquecer o cache da conta de serviço antes do corte, faça isso no ambiente de preparação e confirme a execução sem criar conta:

    sudo systemd-run --wait --pipe --collect --unit=endcontrol-admin-cli-cache \
      --property=User=endcontrol \
      --property=Group=endcontrol \
      --property=WorkingDirectory=/opt/endcontrol/current \
      --property=Environment=HOME=/var/cache/endcontrol \
      /usr/bin/npm cache add auth@1.7.16

Na preparação, valide `npm run auth:admin:create -- --help`. Não aqueça o pacote durante um incidente de produção; faça a conferência antes do corte aprovado.

Execute interativamente em uma unidade transitória do systemd para que o arquivo com DATABASE_URL e BETTER_AUTH_SECRET seja carregado pelo systemd e a senha digitada fique fora da linha de comando:

    sudo systemd-run --pty --wait --collect \
      --unit=endcontrol-admin-recovery \
      --property=User=endcontrol \
      --property=Group=endcontrol \
      --property=WorkingDirectory=/opt/endcontrol/current \
      --property=EnvironmentFile=/etc/endcontrol/endcontrol.env \
      --property=Environment=HOME=/var/cache/endcontrol \
      /usr/bin/npm run auth:admin:create -- \
      --email="novo-admin@dominio-aprovado" \
      --name="Administrador de recuperação" \
      --role=admin

Use um endereço real de uma pessoa autorizada. Não passe --password, --yes ou --force. O CLI pede a senha sem colocá-la no comando e exige confirmação quando já existem usuários. O Better Auth cria a conta por sua API server-side e aplica o hash normal de senha.

Depois:

1. Confirme que a nova conta entra em /login e acessa as páginas administrativas esperadas.
2. Confirme com o responsável qual conta deve continuar como admin permanente.
3. Se criou uma conta temporária, remova-a por /admin/users somente após validar que outra conta administrativa funciona.
4. Verifique o log da unidade transient e registre o atendimento sem guardar a senha.

Não use este fluxo para alterar credenciais de uma pessoa real sem autorização explícita. Se a conta informada já existir, pare e use o processo de recuperação de senha aprovado; não passe opções para forçar ou sobrescrever o cadastro.
