# Backup e restauração de MySQL e uploads

Os scripts operam apenas em Linux com systemd, MySQL 8.4, GNU tar e coreutils. Eles são destinados a um banco e diretório de mídia da aplicação no host futuro; não apontam para a VPS nem para o MySQL local do desenvolvimento.

Se endcontrol.service estiver ativo, o backup o para brevemente para capturar o dump do banco e os uploads no mesmo ponto; ao final, restaura o estado anterior do serviço. O script exige que a unidade exista e esteja carregada. Ele cria um arquivo tar.gz com permissões 0600, manifesto e SHA-256 de cada arquivo. O diretório precisa estar acessível somente a root. O dump inclui o schema e os dados da base CMS; não inclui contas MySQL, segredos, código ou mídia original versionada no site.

## Preparar a conta de backup

Crie uma conta MySQL sem privilégios globais. No MySQL 8.4, abra uma sessão administrativa com o prompt de senha e o histórico de comandos desativado, por exemplo:

    sudo env MYSQL_HISTFILE=/dev/null mysql -u root -p

No prompt SQL, substitua o nome do banco pelo escolhido e crie o usuário com senha aleatória gerada pelo servidor:

    CREATE USER 'endcontrol_ops'@'127.0.0.1' IDENTIFIED BY RANDOM PASSWORD;
    GRANT SELECT, SHOW VIEW, TRIGGER, LOCK TABLES, CREATE, DROP, ALTER, INDEX, REFERENCES, INSERT, UPDATE, DELETE
      ON endcontrol_cms.* TO 'endcontrol_ops'@'127.0.0.1';

O servidor mostrará a senha gerada uma vez. Guarde-a em um gerenciador de senhas e configure o arquivo fora do repositório:

    sudo install -o root -g root -m 0600 \
      scripts/operations/templates/mysql-operations.cnf.example \
      /etc/endcontrol/mysql-operations.cnf
    sudoedit /etc/endcontrol/mysql-operations.cnf
    sudo chmod 0600 /etc/endcontrol/mysql-operations.cnf

Substitua o placeholder de senha no editor. Se a senha contiver caracteres especiais da sintaxe de arquivos de opção do MySQL, aplique as aspas e escapes dessa sintaxe. Os scripts recusam arquivos de credenciais que não pertençam a root ou que deem leitura a grupo/outros usuários.

## Criar um backup

Execute a partir de um checkout validado. Ajuste o nome do banco se necessário; nenhum segredo vai na linha de comando:

    sudo env \
      MYSQL_DATABASE=endcontrol_cms \
      MYSQL_DEFAULTS_FILE=/etc/endcontrol/mysql-operations.cnf \
      APP_STATE_DIR=/var/lib/endcontrol \
      CMS_MEDIA_DIR=/var/lib/endcontrol/media \
      BACKUP_DIR=/var/backups/endcontrol \
      APP_SERVICE=endcontrol.service \
      APP_USER=endcontrol APP_GROUP=endcontrol \
      bash scripts/operations/backup.sh

O script confirma a conexão, adquire um lock, para o serviço se ele estiver ativo, produz e valida o arquivo e restaura o estado anterior do serviço. Copie o arquivo e o SHA-256 exibidos para uma localização fora da VPS por um mecanismo aprovado. Uma cópia no mesmo disco não protege contra perda do host. Retenção e destino offsite ainda precisam ser definidos; o script não apaga backups antigos.

Verifique um arquivo sem restaurá-lo:

    ARCHIVE_NAME=endcontrol-AAAAMMDDTHHMMSSZ-ID.tar.gz
    sudo tar -tzf "/var/backups/endcontrol/$ARCHIVE_NAME"
    sudo bash -c 'cd /var/backups/endcontrol && sha256sum --check "$1.sha256"' -- "$ARCHIVE_NAME"

O script cria o arquivo lateral .sha256. Copie os dois arquivos juntos, mantenha o nome do arquivo de backup e verifique o hash em uma cópia independente antes de usá-la. `restore.sh` exige o arquivo lateral adjacente e valida seu SHA-256 automaticamente antes de extrair o pacote.

## Restaurar com confirmação

A restauração substitui o conteúdo do schema confirmado e a pasta ativa de uploads pelo conteúdo do mesmo snapshot. Escolha um arquivo verificado, confirme que é o banco correto e planeje a perda de alterações posteriores àquele snapshot.

    ARCHIVE=/var/backups/endcontrol/endcontrol-AAAAMMDDTHHMMSSZ-ID.tar.gz
    sudo env \
      MYSQL_DATABASE=endcontrol_cms \
      MYSQL_DEFAULTS_FILE=/etc/endcontrol/mysql-operations.cnf \
      APP_STATE_DIR=/var/lib/endcontrol \
      CMS_MEDIA_DIR=/var/lib/endcontrol/media \
      BACKUP_DIR=/var/backups/endcontrol \
      APP_SERVICE=endcontrol.service \
      APP_USER=endcontrol APP_GROUP=endcontrol \
      bash scripts/operations/restore.sh \
      "$ARCHIVE" \
      --confirm-database=endcontrol_cms

Antes da importação, o script verifica os caminhos internos e hashes, confirma que o manifesto pertence ao banco indicado, para o serviço e cria um snapshot pré-restauração. Se a importação falhar, tenta restaurar o SQL anterior e mantém uploads atuais. Se não puder garantir a reversão, deixa o serviço parado e informa o arquivo de segurança. Após sucesso, a pasta de uploads anterior fica ao lado da pasta ativa como media.pre-restore-<timestamp>, com owner root e modo 0700; o snapshot do estado anterior permanece em BACKUP_DIR. Remova essas cópias apenas depois de validar a recuperação e confirmar outra cópia restaurável.

O diretório de mídia precisa conter arquivos produzidos pelo CMS, com nomes UUID e extensões suportadas. Links simbólicos, subdiretórios ou nomes inesperados fazem o script interromper sem importar o arquivo.

## Ensaio isolado obrigatório

Antes do corte, execute o roteiro em um servidor de preparação com banco novo, por exemplo endcontrol_ops_drill_YYYYMMDD, e CMS_MEDIA_DIR em um subdiretório descartável dentro de APP_STATE_DIR. Use uma conta MySQL com permissões somente nesse schema e APP_SERVICE=endcontrol-drill.service para não parar a aplicação real.

1. Crie uma tabela marcador e um arquivo de imagem de teste com nome UUID.
2. Execute backup.sh e guarde o caminho e checksum emitidos.
3. Altere o marcador e troque o arquivo de teste.
4. Execute restore.sh com --confirm-database apontando exatamente ao banco descartável.
5. Confirme que o marcador e os uploads voltaram ao primeiro estado, que o snapshot pré-restauração foi criado e que o serviço teve seu estado anterior preservado.
6. Descarte o schema, o estado de mídia e os backups temporários somente após confirmar que os caminhos são os criados para o ensaio.

Não ensaie com o banco de produção nem com a pasta ativa de produção. O ensaio de aceitação da VPS continua pendente até ser realizado após provisionamento.
