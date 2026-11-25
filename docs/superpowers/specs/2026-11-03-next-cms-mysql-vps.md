# Plano de migração do Site EndControl para Next.js, CMS e MySQL na VPS

**Status:** implementação local autorizada; VPS e domínio ficam para uma etapa futura.
**Direção escolhida pelo usuário:** aplicação Next.js full-stack hospedada em VPS, com painel CMS e MySQL para os conteúdos.
**Repositório analisado:** `idedigitalbr/site-end-controll`, checkout `Endcontrol2`, branch `main`.

Para este plano, a escolha explícita do usuário define a VPS como destino futuro. O `AGENTS.md` foi alinhado no checkout local para preservar GitHub Pages como produção atual até o corte aprovado e orientar desenvolvimento local primeiro; essa alteração ainda não foi enviada ao GitHub. Não executar ações remotas nesta fase.

## 0. Estado de execução local

### Atualização de execução — 2026-11-14

Os relatos de estado de 2026-11-03 abaixo são históricos. A implementação atual já inclui autenticação, permissões admin/editor, publicação/prévia, histórico/restauração/autoria, mídia e configurações globais. Consulte `docs/qa-acceptance.md` e `docs/operations/local-validation.md` para evidências e gates ainda abertos.

| Fase | Situação local atual |
|---|---|
| 1 — Next e paridade | Templates React das rotas originais, layouts isolados e 404 implementados; QA visual e inicialização após hidratação em validação. |
| 2 — MySQL e acesso | Migrações aplicadas, Better Auth e papéis implementados; testes integrados de acesso em execução. |
| 3 — CMS | Revisões, restauração, auditoria, links, fotos, fundos, ordem, navegação e configurações implementados; E2E em execução. |
| 4 — Importação | 15 publicações iniciais importadas, rascunhos preservados e 352 imagens compatíveis cadastradas sem duplicação; reexecuções idempotentes verificadas. |
| 5 — Operação | Runbooks/templates nativos preparados e restauração MySQL/uploads verificada localmente; aceitação Linux e corte remoto continuam futuros. |

Correções do inventário inicial baseadas no HTML atual: a seção FFS é composta por **12 cards**, não pelo antigo radar de oito itens do script sem uso. A timeline antiga também não existe no HTML atual. O CMS gerencia os cards FFS reais e a narrativa de Sobre Nós; não introduz estruturas visuais ausentes do site original.

O desenvolvimento continua local. Definição do domínio/host, destino externo de backup, aceitação Linux e autorização do corte permanecem requisitos antes de qualquer implantação remota.

### Histórico inicial — 2026-11-03

- Em 2026-11-03, o usuário esclareceu que a migração deve recriar o site EndControl existente sem redesign: mesmos textos, fotos, identidade visual, tipografia e efeitos.
- A primeira etapa local preservou os arquivos de origem por Route Handlers e comparou byte a byte 18 HTML, 20 CSS, 9 JS e três imagens. Agora as 15 rotas CMS usam templates React; os Route Handlers continuam servindo CSS, JavaScript, mídia e as duas páginas auxiliares que ainda dependem de eventos inline.
- A base shadcn/ui foi configurada com primitivas Radix e ícones Lucide para o CMS. O painel `/admin` e o editor local já leem e gravam rascunhos/versionamentos no MySQL local.
- As 15 rotas públicas agora passam por templates React que convertem a marcação original sem recriar textos, fotos ou estilos. As páginas públicas exigem uma versão publicada; páginas retiradas ou arquivadas deixam de ser servidas e saem do sitemap.
- O 404 global renderiza o template original com status 404. CSS, JavaScript e mídia continuam vindo dos arquivos do repositório, enquanto rotas auxiliares que ainda dependem de eventos inline entregam o HTML original.
- O importador idempotente cria uma publicação inicial somente quando a rota ainda não tem histórico publicado. Ele preserva despublicações e arquivamentos e mantém um rascunho humano como a versão mais recente. A mídia original já foi importada para um banco descartável local pelo root; a seed de conteúdo ainda aguarda execução controlada.
- Os testes locais do preparador React/SEO e da política de seed passaram. A comparação visual completa no navegador e o build integrado ainda ficam para a validação local do root. Não há deploy nem operação remota.

## 1. Objetivo

Migrar o site institucional estático para Next.js preservando identidade visual, páginas, comportamento e SEO. Criar uma área administrativa autenticada para editar conteúdo estruturado, salvar rascunhos, visualizar prévias e publicar as páginas. O Next.js executará em runtime Node na VPS e persistirá conteúdo e dados editoriais em MySQL.

## 2. Estado atual verificado

- O checkout contém 18 arquivos HTML: Home, Sobre Nós, Política de Privacidade, 12 páginas de serviço, 404 e duas páginas auxiliares. O App Router entrega os 15 templates CMS como React e mantém as auxiliares inline em HTML original.
- Há 20 folhas CSS, 9 scripts JS e 361 arquivos de mídia versionados. O projeto local tem `package.json`, lockfile, configuração Next e migrations Drizzle; o deploy remoto permanece fora desta fase.
- O conteúdo editorial parte do HTML/JS original. `src/js/solucoes.js` contém os 12 serviços e a ordem do radar; o menu e o rodapé são editáveis por conteúdo compartilhado. A seção FFS visível tem 12 cards estáticos; o antigo script de radar FFS não está carregado pelo HTML atual. A timeline não tem marcação visível no template atual.
- O `sitemap.xml` original lista as 15 páginas CMS; o runtime Next gera sitemap e robots com base nas versões publicadas. As URLs `.html`, canonicals e dados Open Graph do site permanecem preservados.
- Os testes existentes incluem auditorias de páginas e integridade do site; devem ser adaptados como verificações de regressão durante a migração.
- A regra original em `AGENTS.md` definia GitHub Pages como destino exclusivo. Ela foi alinhada localmente para manter essa URL como produção atual até a aprovação do corte, registrar VPS como destino futuro e limitar esta etapa a desenvolvimento local. A exigência de confirmação antes de qualquer `git push` continua vigente.

## 3. Abordagens consideradas

| Abordagem | Vantagem | Custo ou limitação | Decisão |
|---|---|---|---|
| Next.js full-stack na VPS com MySQL | Site, CMS, autenticação e API no mesmo runtime; permite renderização no servidor e prévia de rascunhos | Exige definir domínio, acesso e rotina de operação/backup da VPS; muda o destino oficial de produção | **Escolhida pelo usuário** |
| Next estático no GitHub Pages e CMS/API separados | Preserva a URL atual do Pages | Dois deploys e uma API externa; exportação estática não suporta recursos de servidor do Next | Não escolhida |
| Manter HTML atual e acrescentar CMS separado | Menor migração inicial | Não transforma o site público para Next e mantém a duplicação atual | Não escolhida |

## 4. Arquitetura proposta

- **Aplicação:** Next.js App Router com TypeScript, executando localmente durante o desenvolvimento e em Node.js na VPS somente após o corte aprovado. O usuário exige paridade visual e funcional com o site atual; não criar identidade, textos ou mídia alternativos. Templates React preservam a marcação original; Route Handlers entregam CSS, JavaScript e arquivos de mídia diretamente do checkout, sem duplicar os assets no bundle.
- **UI:** Tailwind CSS; componentes shadcn/ui configurados para primitivas Radix; `lucide-react` para ícones. Aplicar shadcn/ui principalmente ao painel CMS, mantendo componentes de apresentação próprios para preservar a identidade visual atual.
- **Admin:** rotas `/admin`, `/admin/pages`, `/admin/services`, `/admin/media` e `/admin/settings`. O cadastro público fica desativado; contas são criadas por um administrador.
- **Persistência:** MySQL com Drizzle ORM e `mysql2`, migrations versionadas no repositório e conexão criada apenas no servidor. Drizzle documenta suporte nativo ao driver `mysql2` ([guia MySQL](https://orm.drizzle.team/docs/mysql/get-started-mysql)).
- **Autenticação:** Better Auth integrado ao Next e ao MySQL, com sessão segura e papéis `admin` e `editor`. A documentação mantém integração Next e adaptador MySQL ([Next.js](https://better-auth.com/docs/integrations/next), [MySQL](https://better-auth.com/docs/adapters/other-relational-databases)).
- **Autorização:** concentrar leitura e mutações numa camada server-only de acesso a dados. Cada Server Action ou Route Handler que altera conteúdo deve validar sessão e papel; esconder botões no painel não é controle de acesso suficiente. A documentação Next recomenda verificações junto à camada de dados e em cada ação/endpoint ([autenticação e autorização](https://nextjs.org/docs/app/guides/authentication)).
- **Publicação:** páginas públicas leem somente a versão publicada. A prévia autenticada lê a versão de rascunho. Ao publicar, salvar uma revisão e invalidar o cache da rota afetada; começar com uma instância Next, cujo cache local é suficiente para esse desenho inicial ([self-hosting Next.js](https://nextjs.org/docs/app/guides/self-hosting)).
- **Imagens:** o importador `npm run db:import-media` registra os assets originais no MySQL com seus caminhos de origem, preservando os arquivos e as URLs existentes. Novos uploads ficam fora do diretório de release, em armazenamento persistente da VPS; MySQL guarda caminho, texto alternativo, tipo MIME, dimensões e autoria, não os bytes das imagens. Caso o serviço passe a rodar em múltiplas instâncias, migrar os arquivos para armazenamento de objetos compartilhado.

## 5. Modelo inicial de conteúdo

1. **Page:** rota pública estável, tipo de página, título, status, SEO, versão publicada e vínculo com o conteúdo estruturado.
2. **PageVersion / PageSection:** revisões imutáveis e blocos ordenados com tipos permitidos, por exemplo `hero`, texto, lista, galeria, FAQ, etapas, cards técnicos e CTA. Validar cada tipo no servidor; não aceitar HTML arbitrário.
3. **Service:** slug estável, rota legada, título de menu e card, resumo, categoria, imagem e texto alternativo, CTA, chave de ícone e ordenações do menu/radar.
4. **FfsMechanism:** os 12 cards de mecanismos exibidos na seção FFS do serviço de integridade, com título, resumo, tópicos, mídia e posição. Permanecem separados dos 12 serviços comerciais.
5. **NavigationItem / NavigationGroup:** rótulos, referências a páginas/serviços, chave de ícone e ordem.
6. **TimelineEntry:** ano, título, descrição, imagem e ordem da linha do tempo institucional.
7. **SiteSettings:** contatos, endereço, WhatsApp, redes sociais, rodapé e opções globais de SEO.
8. **MediaAsset:** caminho persistente, nome, MIME, tamanho, dimensões, alt text e autoria.
9. **Redirect e AuditLog:** rotas antigas, alterações editoriais, publicações e autor da mudança.
10. **Usuários e sessões:** tabelas geridas pelo adaptador Better Auth; papel editorial associado ao usuário.

O painel deve usar formulários específicos por tipo de conteúdo. Os blocos são definidos pelos templates React do site; isso permite editar textos, imagens, ordem e CTAs sem permitir que o admin altere CSS, scripts ou markup executável.

## 6. Migração de páginas e SEO

- Criar um mapa explícito de todas as rotas públicas atuais e manter inicialmente os caminhos `.html` para minimizar mudança de URL. Separar `routePath` público do `slug` interno do CMS.
- Gerar inventário dos caminhos realmente referenciados e preservar nomes e espaços. A camada Next atual serve os arquivos originais do checkout, evitando duplicar os 361 assets (aprox. 215 MB); mover para `public/assets` só se uma etapa posterior exigir e sem alterar URLs.
- Extrair textos, metadados, serviços, ordem do radar, 12 cards FFS, navegação e configurações do HTML/JS para conteúdo editável. A timeline fica fora do escopo enquanto não houver marcação visível. Importar para MySQL de forma idempotente e gerar revisões publicadas iniciais.
- Comparar cada página migrada com a versão estática nos breakpoints desktop, tablet e mobile. Corrigir referências de mídia e comportamento antes de trocar a origem pública.
- Gerar metadata, canonical, Open Graph, JSON-LD, `robots.txt` e `sitemap.xml` a partir das páginas publicadas. Criar tabela de redirects antes de qualquer mudança de URL.
- A URL oficial GitHub Pages atual não pode ser apontada por DNS para a VPS. Antes do corte, definir um novo domínio/subdomínio e certificado TLS. Manter temporariamente o site estático antigo como aviso/link de transição se a URL antiga não puder emitir redirect HTTP 301.

## 7. Plano por fases e critérios de saída

### Fase 0 — Preparar decisões e regras

- Fase local autorizada: criar e validar o aplicativo Next e o CMS em localhost sem depender do domínio ou executar operações remotas.
- Inventariar sistema operacional, CPU/RAM/disco, proxy existente e portas livres. O padrão provisório é Next.js e MySQL como serviços nativos separados na mesma VPS; manter MySQL acessível apenas por loopback/rede privada. Se os recursos ou o plano de recuperação não forem suficientes, usar MySQL gerenciado em rede privada.
- Definir domínio oficial e mecanismo de deploy/acesso remoto. A URL `github.io` não pode ser redirecionada por DNS. A recomendação provisória é manter o site antigo como página estática de transição com link para o novo domínio até a data de encerramento definida pelo usuário.
- Definir retenção e destino externo à VPS para backups do MySQL e uploads. O corte fica bloqueado até existir uma cópia restaurável e um procedimento de rollback.
- O `AGENTS.md` local e a memória já registram desenvolvimento local e VPS como destino futuro. Antes do corte, completar as regras com domínio, runtime e mecanismo de deploy aprovados; manter a confirmação obrigatória antes de qualquer `git push`.
- Este plano não usa Docker. A instrução atual proíbe Docker na VPS e a decisão do usuário só mudou o destino para VPS; escolher uma implantação em containers exigiria uma decisão posterior explícita.

**Saída:** decisões de hospedagem e domínio documentadas, plano de rollback aprovado antes de qualquer publicação.

### Fase 1 — Base Next e preservação visual

- Criar `package.json`, lockfile e estrutura App Router; adicionar scripts locais de desenvolvimento, build e inicialização. **Base local criada.**
- Configurar Tailwind CSS, `components.json` com primitivas Radix, aliases shadcn/ui e `lucide-react`. **Configurado.**
- Manter os HTML, CSS, JS e assets originais como fonte de paridade. Os templates React convertem as 15 páginas CMS e os Route Handlers continuam entregando CSS, JS e mídia do checkout sem cópia.
- Portar Home, Sobre Nós, Privacidade, 12 páginas de serviço e 404 para templates Next, mantendo rotas, textos e estruturas visuais. **Implementado localmente; build e paridade visual integrados pendentes.**
- Preservar efeitos e interações servindo os scripts originais junto com os templates React; páginas auxiliares que ainda usam eventos inline continuam com HTML original. **Implementado localmente; smoke test de navegador pendente.**
- Isolar os layouts públicos do CSS administrativo, conservar `sn-page-wrapper` nas rotas originais e disponibilizar apenas os utilitários Tailwind no público, sem preflight global. **Implementado localmente.**
- Gerar metadata, canonical, Open Graph, JSON-LD, `robots.txt` e `sitemap.xml` com os dados publicados do CMS. Rotas despublicadas e arquivadas ficam fora da publicação e do sitemap. **Implementado localmente; validação de runtime pendente.**

**Saída parcial:** a primeira etapa verificou a entrega byte a byte dos arquivos originais. **Implementação local:** templates React cobrem as 15 páginas CMS e o 404; páginas auxiliares inline continuam em HTML original. **Saída final:** build e comparação visual confirmam a equivalência nos breakpoints desktop, tablet e mobile.

### Fase 2 — Banco, autenticação e autorização

- Provisionar MySQL, usuário de aplicação sem privilégios administrativos, conexão privada e migrations Drizzle.
- Criar tabelas e índices iniciais; validar constraints para rota única, status, ordem e referências.
- Integrar Better Auth, criar o primeiro admin por seed seguro e desativar cadastro público.
- Implementar a camada de dados server-only e verificar papel em cada leitura privada e mutação.

**Saída:** login/logout e autorização por papel funcionam; nenhuma credencial MySQL chega ao bundle do navegador.

**Estado local:** MySQL 8.4 foi conectado em localhost por usuário dedicado, com duas migrations aplicadas para `pages` e `page_versions`. As credenciais permanecem em `.env.local` ignorado pelo Git. Autenticação ainda não foi implementada.

### Fase 3 — CMS e fluxo editorial

- Construir listagem, busca, filtros por status, formulário de blocos, SEO, serviços, FFS, navegação, timeline e configurações globais.
- Adicionar rascunho, prévia autenticada, revisão, publicação e auditoria.
- Criar biblioteca de mídia com validação de MIME/tamanho, nomes aleatórios e armazenamento persistente fora do release da aplicação.

**Saída:** editor consegue atualizar uma página e visualizar a prévia; usuário sem permissão não lê rascunho nem publica.

**Estado local:** listagem de páginas lê os 15 registros do MySQL. O editor salva novas versões de rascunho com título, resumo, campos SEO e blocos de título/parágrafo. A publicação não está habilitada e esses rascunhos ainda não alteram o HTML público.

### Fase 4 — Importação e validação de conteúdo

- Escrever importador idempotente para conteúdo HTML/JS e assets, preservando IDs estáveis e rotas. **Código local preparado; mídia é importada por `npm run db:import-media` e conteúdo inicial por `npm run db:seed`.**
- Importar páginas e services em banco descartável/local; validar contagens, títulos, links, alt texts e canonicals. **Aguardando a execução controlada da seed; não usar produção.**
- Comparar visualmente as 15 páginas públicas e adaptar as auditorias existentes para o novo renderer.

**Saída:** todas as páginas públicas têm uma versão publicada no CMS; nenhuma URL do mapa de rotas fica sem conteúdo ou asset.

### Fase 5 — Preparação de VPS e corte

- Instalar runtime Node compatível com a versão Next fixada e executar Next atrás do reverse proxy já aprovado para a VPS; manter o processo com serviço do sistema e health check.
- Expor apenas HTTPS publicamente; MySQL fica em localhost/rede privada, sem porta 3306 pública. Configurações e segredos ficam fora do repositório.
- Automatizar build e migrations com uma release versionada; manter a release anterior pronta para rollback.
- Configurar backups regulares do MySQL e dos uploads com cópia fora da VPS e testar restauração. A documentação MySQL trata backups e reload como parte do processo de recuperação ([política de backup](https://dev.mysql.com/doc/refman/8.4/en/backup-policy.html), [`mysqldump`](https://dev.mysql.com/doc/refman/8.4/en/using-mysqldump.html)).
- Validar domínio/TLS, health check, sitemap, links, login, publicação e recuperação antes do corte. Atualizar canonicals e a URL oficial somente na janela aprovada.

**Saída:** smoke checks e restauração de backup aprovados; usuário autoriza a mudança de DNS/produção separadamente.

## 8. Critérios de aceite

- As 15 rotas públicas mantêm conteúdo, navegação, responsividade e identidade visual esperados.
- Title, description, canonical, Open Graph, JSON-LD, `robots.txt` e sitemap refletem somente conteúdo publicado e o novo domínio.
- Admin autenticado cria, edita, pré-visualiza e publica; editores sem permissão administrativa não gerenciam usuários.
- Conteúdo e metadados persistem no MySQL após restart/deploy; upload persiste fora do diretório temporário de release.
- Acesso direto a ações/endpoints sem sessão ou sem papel apropriado resulta em bloqueio no servidor.
- Backup recupera o banco e referências de mídia; rollback restaura a versão anterior sem apagar conteúdo recém-publicado.

## 9. Decisões ainda pendentes

- Domínio/subdomínio público da VPS; a URL atual `github.io` não pode ser reendereçada por DNS.
- Confirmar o padrão provisório de MySQL local na VPS ou escolher uma instância privada separada após conferir CPU/RAM/disco e estratégia de backup.
- Sistema operacional, proxy reverso já instalado, mecanismo de acesso/deploy e destino de backup fora da VPS.
- Política de retenção de revisões, papéis adicionais, tamanho máximo e formatos permitidos para uploads.
- Duração da página de transição no GitHub Pages e tratamento final da URL antiga.

## 10. Referências técnicas

- [Next.js — self-hosting](https://nextjs.org/docs/app/guides/self-hosting)
- [Next.js — autenticação e autorização](https://nextjs.org/docs/app/guides/authentication)
- [Drizzle ORM — MySQL com `mysql2`](https://orm.drizzle.team/docs/mysql/get-started-mysql)
- [Better Auth — integração Next.js](https://better-auth.com/docs/integrations/next)
- [Better Auth — adaptadores relacionais, incluindo MySQL](https://better-auth.com/docs/adapters/other-relational-databases)
- [MySQL 8.4 — política de backup](https://dev.mysql.com/doc/refman/8.4/en/backup-policy.html)
