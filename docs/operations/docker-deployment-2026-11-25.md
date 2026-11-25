# Deploy Docker — 2026-11-25

O usuário confirmou o repositório `idedigitalbr/site-end-controll`, o push para
`main`, SSH na VPS e o alvo correto: stack `endcontrol`. A stack independente
`sistema-endcontrol` permaneceu intocada. Não houve alteração de DNS.

## Backup anterior à troca

`/var/backups/endcontrol/pre-next-20261125T163312Z` contém:

- Imagem Nginx anterior: `image.tar.gz`, aproximadamente 108 MB.
- Pasta original completa: `project.tar.gz`, aproximadamente 614 MB.
- Inspeções do container e da imagem e arquivo `SHA256SUMS`.

Os arquivos comprimidos passaram por verificação de integridade e SHA-256.
O serviço estático anterior não tinha volumes nem banco de dados. O backup
permanece privado na VPS; nenhuma cópia externa automática foi configurada.

## Release e persistência

- Imagem ativa: `endcontrol-next:201c440babbdb0ebe78094fb602648e2233bec58`.
- Runtime: Node.js 22 e Next.js 16.4.5, processo sem root.
- Compose ativo: `/opt/endcontrol-site/cms/compose.yml`, projeto `endcontrol`.
- Serviços: `endcontrol-web` e `endcontrol-cms-db` (MySQL 8.4).
- Volumes: `endcontrol_cms_db` e `endcontrol_cms_media`.
- Configuração e segredos privados: `/opt/endcontrol-site/cms`, arquivos 0600.
- Build dedicado e limitado, desligado após o build; nenhuma limpeza global.
- Retenção: plano executado, uma release encontrada, nenhuma imagem removida.

O importador de mídia foi executado no namespace de rede do MySQL para manter
sua restrição a localhost. Foram criadas 15 publicações e cadastradas 352 imagens
originais. A conta administrativa foi criada diretamente no novo banco; usuários
e sessões de desenvolvimento não foram copiados.

Os ajustes posteriores de healthcheck e serviço de importação alteram somente
a orquestração. O código da aplicação da imagem continua no commit indicado.

## Verificação obtida

- Build Linux e TypeScript passaram.
- Migrações, seed e importação de mídia concluídos.
- Instância isolada passou no healthcheck antes da troca.
- Web e MySQL saudáveis; endpoint HTTPS `/api/health` retornou `ok`.
- As 15 URLs publicadas responderam 200 e o sitemap aponta para o domínio atual.
- Home inicializou os scripts originais sem erro de execução no navegador.
- Login real, páginas, mídia, configurações e usuários abriram com autorização.
- Painel sem excesso de largura em viewport de 390 px; logout e retorno ao login
  ao tentar reabrir `/admin` confirmados pelo navegador.

Esta foi uma verificação de implantação, não uma repetição completa da paridade
visual e de todos os fluxos editoriais. Os rótulos de ambiente do painel ainda
contêm referências ao desenvolvimento local e precisam de ajuste de apresentação.

## Rollback

O compose estático e sua imagem foram preservados. Para retornar ao site anterior:

```bash
docker compose -f /opt/endcontrol-site/app/docker-compose.yml up -d --no-build web
```

Isso não remove o MySQL nem os uploads do CMS. Antes de uma próxima migração,
fazer backup atualizado desses volumes e da configuração privada. A política de
backup externo e sua automatização continuam pendentes.
