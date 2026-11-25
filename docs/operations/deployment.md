# Implantação nativa — referência futura

O roteiro abaixo pressupõe uma distribuição Linux com systemd, Node.js compatível com o Next fixado no package-lock.json, MySQL 8.4 local e Nginx. O sistema operacional e o domínio ainda não foram escolhidos; adapte os caminhos e o nome da unidade MySQL antes de qualquer instalação.

O Next usa runtime Node e deve ficar atrás de um reverse proxy. A documentação da versão instalada recomenda Nginx ou proxy equivalente para limitar requisições e proteger o servidor. O cache Next padrão fica no disco local; mantenha uma instância durante a fase inicial. Uma topologia com várias instâncias exige cache compartilhado e uploads em armazenamento compartilhado.

## Diretórios e contas

- Releases imutáveis: /opt/endcontrol/releases/<commit-validado>
- Ponteiro ativo: /opt/endcontrol/current
- Estado do serviço: /var/lib/endcontrol
- Uploads: /var/lib/endcontrol/media
- Backups locais: /var/backups/endcontrol, fora das releases e acessível somente a root
- Variáveis da aplicação: /etc/endcontrol/endcontrol.env
- URL privada de migrations DDL: /etc/endcontrol/endcontrol-migration.env
- Credenciais de backup: /etc/endcontrol/mysql-operations.cnf

Crie uma conta de serviço sem login interativo e diretórios separados. Os uploads não podem ficar em /opt/endcontrol/current, pois cada release é substituída como unidade.

    sudo adduser --system --group --no-create-home --home /nonexistent endcontrol
    sudo install -d -o root -g root -m 0755 /opt/endcontrol/releases
    sudo install -d -o root -g root -m 0755 /opt/endcontrol
    sudo install -d -o root -g endcontrol -m 0750 /var/lib/endcontrol
    sudo install -d -o endcontrol -g endcontrol -m 0750 /var/lib/endcontrol/media
    sudo install -d -o endcontrol -g endcontrol -m 0750 /var/cache/endcontrol
    sudo install -d -o root -g root -m 0700 /var/backups/endcontrol
    sudo install -d -o root -g root -m 0750 /etc/endcontrol

## Banco e segredos

Se o MySQL ficar na VPS, mantenha a porta 3306 ligada apenas em 127.0.0.1 e não a abra no firewall público. O template scripts/operations/templates/mysql-endcontrol.cnf contém somente essa configuração provisória; confira o diretório de configuração do pacote antes de instalá-lo.

Crie um banco da aplicação e contas separadas: a conta de runtime recebe apenas os privilégios DML necessários; a conta de migração recebe DDL durante a instalação de uma release; a conta endcontrol_ops recebe as permissões limitadas ao schema que o backup e a restauração exigem. Não use root para conectar a aplicação.

Copie scripts/operations/templates/endcontrol.env.example para /etc/endcontrol/endcontrol.env. Substitua a URL de exemplo, configure DATABASE_URL com senha codificada para URL, gere BETTER_AUTH_SECRET com alta entropia e use CMS_MEDIA_DIR=/var/lib/endcontrol/media. Restrinja o arquivo:

    sudo chown root:root /etc/endcontrol/endcontrol.env
    sudo chmod 0600 /etc/endcontrol/endcontrol.env
    sudoedit /etc/endcontrol/endcontrol.env
    sudo install -o root -g root -m 0600 \
      scripts/operations/templates/endcontrol-migration.env.example \
      /etc/endcontrol/endcontrol-migration.env
    sudoedit /etc/endcontrol/endcontrol-migration.env

O arquivo contém segredos e nunca deve ser colocado no checkout ou na linha de comando. NEXT_PUBLIC_SITE_URL e BETTER_AUTH_URL precisam refletir o domínio aprovado antes do build e do corte.

## Build versionado

Empacote somente um commit revisado e validado. Não copie a pasta de trabalho inteira: ela pode conter .env.local, node_modules, .next, .git e storage/backups. git archive inclui os arquivos versionados do commit, incluindo as páginas e assets originais, mas exclui esses arquivos locais. Antes de empacotar, defina o caminho do checkout validado e verifique que nenhum .env com segredos nem arquivo de storage/media foi adicionado ao Git:

    CHECKOUT=/caminho/do/checkout-validado
    git -C "$CHECKOUT" ls-files | grep -E '(^|/)\.env($|\.)'
    git -C "$CHECKOUT" ls-files storage/media

Revise os nomes retornados e interrompa o empacotamento se aparecer um arquivo local ou secreto. Não implante alterações ainda não versionadas.

O runtime público lê os arquivos originais do diretório da release. Confirme que o commit arquivado contém os 18 HTML originais (incluindo `index.html`, as 15 rotas CMS, `404.html` e as duas páginas auxiliares), além de `assets/`, `src/css/` e `src/js/`. Esses arquivos precisam permanecer no diretório da release; um pacote contendo apenas o build Next não atende às rotas públicas nem aos recursos originais.

Crie a pasta da release como conta de serviço e extraia o commit validado nela. Não edite a release ativa. Instale dependências, aplique migrations e faça build como a conta de serviço, fornecendo o arquivo privado pelo mecanismo EnvironmentFile do systemd:

    COMMIT=sha-do-commit-revisado
    RELEASE_ID=$COMMIT
    RELEASE_DIR=/opt/endcontrol/releases/$RELEASE_ID
    git -C "$CHECKOUT" status --short
    test ! -e "$RELEASE_DIR"
    sudo install -d -o endcontrol -g endcontrol -m 0750 "$RELEASE_DIR"
    git -C "$CHECKOUT" archive --format=tar "$COMMIT" | sudo -u endcontrol tar -xf - -C "$RELEASE_DIR"

    sudo systemd-run --wait --pipe --collect --unit=endcontrol-install-$RELEASE_ID \
      --property=User=endcontrol \
      --property=Group=endcontrol \
      --property=WorkingDirectory=$RELEASE_DIR \
      --property=Environment=HOME=/var/cache/endcontrol \
      /usr/bin/npm ci

    sudo systemd-run --wait --pipe --collect --unit=endcontrol-migrate-$RELEASE_ID \
      --property=User=endcontrol \
      --property=Group=endcontrol \
      --property=WorkingDirectory=$RELEASE_DIR \
      --property=EnvironmentFile=/etc/endcontrol/endcontrol-migration.env \
      --property=Environment=HOME=/var/cache/endcontrol \
      /usr/bin/npm run db:migrate

    sudo systemd-run --wait --pipe --collect --unit=endcontrol-build-$RELEASE_ID \
      --property=User=endcontrol \
      --property=Group=endcontrol \
      --property=WorkingDirectory=$RELEASE_DIR \
      --property=EnvironmentFile=/etc/endcontrol/endcontrol.env \
      --property=Environment=HOME=/var/cache/endcontrol \
      /usr/bin/npm run build

Execute a importação inicial do conteúdo original apenas na primeira instalação de um banco CMS novo, depois das migrations e antes de liberar edição editorial. O script cria a publicação inicial em uma transação e preserva páginas já arquivadas, já publicadas e sem publicação; se houver rascunho, mantém uma cópia como rascunho. Não rode `db:seed` em cada release. Uma repetição deliberada requer backup restaurável e revisão do conteúdo antes da execução:

    sudo systemd-run --wait --pipe --collect --unit=endcontrol-initial-seed \
      --property=User=endcontrol \
      --property=Group=endcontrol \
      --property=WorkingDirectory=$RELEASE_DIR \
      --property=EnvironmentFile=/etc/endcontrol/endcontrol.env \
      --property=Environment=HOME=/var/cache/endcontrol \
      /usr/bin/npm run db:seed

`db:import-media` é um importador local restrito a banco em `localhost`/`127.0.0.1`; não o execute apontando para um servidor remoto. Os assets originais continuam versionados junto do código e não fazem parte do backup dos uploads enviados pelo CMS.

Faça migrations compatíveis com a release ativa e com a anterior. Para mudanças incompatíveis de schema, planeje uma etapa expand/contract e um backup restaurável antes de liberar a alteração.

Depois do build, deixe o código sob root e permita escrita ao usuário do serviço somente no cache local do Next e em /var/lib/endcontrol:

    sudo chown -R root:endcontrol "$RELEASE_DIR"
    sudo chmod -R u=rwX,g=rX,o= "$RELEASE_DIR"
    sudo install -d -o endcontrol -g endcontrol -m 0750 "$RELEASE_DIR/.next/cache"
    sudo chown -R endcontrol:endcontrol "$RELEASE_DIR/.next/cache"

Crie um link temporário e mova-o atomicamente para current:

    test ! -e /opt/endcontrol/current.next
    sudo ln -s "$RELEASE_DIR" /opt/endcontrol/current.next
    sudo mv -Tf /opt/endcontrol/current.next /opt/endcontrol/current

## systemd

Revise scripts/operations/templates/endcontrol.service. Ele pressupõe MySQL como mysql.service, Node instalado em /usr/bin e a aplicação ouvindo apenas em 127.0.0.1:3000. Ajuste o nome da unidade se o pacote da distribuição usar outro.

    sudo install -o root -g root -m 0644 \
      scripts/operations/templates/endcontrol.service \
      /etc/systemd/system/endcontrol.service
    sudo systemctl daemon-reload
    sudo systemctl enable --now endcontrol.service
    sudo systemctl status --no-pager endcontrol.service
    sudo journalctl -u endcontrol.service -n 100 --no-pager
    curl --fail --silent --show-error http://127.0.0.1:3000/
    curl --fail --silent --show-error http://127.0.0.1:3000/api/health

## Nginx e HTTPS

O template scripts/operations/templates/endcontrol.nginx.conf usa endcontrol.example.com e certificados Let's Encrypt inexistentes. Só o instale depois do domínio aprovado e de TLS provisionado. Configure server_name e os dois caminhos dos certificados, valide e então recarregue Nginx.

    sudo install -o root -g root -m 0644 \
      scripts/operations/templates/endcontrol.nginx.conf \
      /etc/nginx/sites-available/endcontrol
    sudo ln -s /etc/nginx/sites-available/endcontrol /etc/nginx/sites-enabled/endcontrol
    sudo nginx -t
    sudo systemctl reload nginx
    APP_DOMAIN=dominio-aprovado
    curl --fail --silent --show-error "https://$APP_DOMAIN/"
    curl --fail --silent --show-error "https://$APP_DOMAIN/api/health"

client_max_body_size está em 11m para aceitar o limite atual do CMS: 10 MiB de imagem mais até 64 KiB de multipart. Só HTTPS deve ficar exposto; MySQL e a porta 3000 permanecem locais.

## Verificações antes do corte

- As 15 rotas públicas preservam o conteúdo e a identidade visual original.
- Admin, editor, sessão, publicação e mídia foram verificados no ambiente de preparação.
- Conteúdo e uploads persistem após reiniciar o serviço e trocar a release.
- Health check local, TLS, sitemap, canonical e links apontam para o domínio aprovado.
- Backup fora da VPS e restauração testada em banco descartável.
- Plano de rollback revisado e executável.
- O usuário aprovou separadamente o corte; até lá, GitHub Pages continua sendo a publicação oficial.

Este runbook não executa acesso remoto, deploy, alteração de DNS ou instalação no servidor.
