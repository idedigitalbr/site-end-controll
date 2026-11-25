# EndControl — Next.js e CMS

Site EndControl, preservando páginas, fotos, estilos e efeitos originais. Next.js App Router/TypeScript, Tailwind, shadcn/Radix, Lucide, Better Auth, MySQL e Drizzle.

Publicação atual: https://endcontrol.suporteide.digital/. CMS: https://endcontrol.suporteide.digital/login. O deploy Docker foi autorizado e realizado em 2026-11-25 na stack `endcontrol`, com backup prévio. Consulte [operação Docker](deploy/README.md) e [validação do corte](docs/operations/docker-deployment-2026-11-25.md). GitHub Pages permanece como publicação legada.

## Executar localmente

Use Node.js 22 e MySQL 8.4. Copie `.env.example` para `.env.local` e configure a conexão e o segredo de autenticação. Nunca versione o arquivo preenchido.

```powershell
npm ci
npm run db:migrate
npm run db:seed
npm run db:import-media
npm run dev -- --hostname 127.0.0.1 --port 3000
```

Site: http://127.0.0.1:3000/. CMS: http://127.0.0.1:3000/login.

Se ainda não houver administrador, use `npm run auth:admin:create` interativamente. O cadastro público é desativado. Administradores criam contas em `/admin/users`; editores gerenciam conteúdo e mídia. Senhas e credenciais não ficam neste README.

O seed importa uma publicação inicial a partir dos templates originais sem substituir publicações, rascunhos ou retiradas de publicação já existentes. A importação de mídia cadastra as imagens originais no MySQL sem copiá-las; seus arquivos continuam em `assets/`. Uploads novos ficam em `CMS_MEDIA_DIR`, que deve apontar para uma pasta persistente fora das releases na implantação futura.

## Operação editorial

- Páginas: textos, fotos, links, fundos, seções, SEO, rascunhos, prévia privada, publicação e restauração de revisões.
- Navegação: rótulos, destinos e ordem dos grupos e serviços existentes.
- Soluções da Home: ordem dos doze serviços originais; conteúdo dos cards acompanha a publicação de cada serviço.
- Mecanismos FFS: títulos, descrições e ordem dos doze cards existentes de integridade estrutural.
- Identidade visual: cores, contatos, endereço, redes sociais, rodapé e fundo compartilhado do menu.
- Mídia: busca, uploads, dimensões e texto alternativo; imagens originais e arquivos referenciados ficam protegidos contra exclusão.

Rascunhos de página não substituem a versão publicada. Configurações globais informam no formulário quando o salvamento se aplica diretamente ao site local. As revisões são preservadas; não existe limpeza automática de histórico.

## Verificar

```powershell
npm run test:cms
npx tsc --noEmit
npm run build
```

Para QA de HTTP/Server Actions, configure `CMS_QA_EMAIL` e `CMS_QA_PASSWORD` apenas no ambiente do processo e execute `node --env-file=.env.local scripts/qa/cms-runtime.mjs`. O script usa páginas, contas e uploads temporários e faz limpeza ao final; é limitado a localhost.

Para a comparação visual, inicie o Next local e, em outro terminal, `node scripts/qa/reference-server.mjs`. Execute `npm run test:e2e`; o projeto usa o Chrome instalado. Os testes comparam as 15 páginas com a referência original na porta 4179 em desktop/tablet/mobile. Os artefatos ficam em `.playwright/`, ignorado pelo Git. Credenciais dos testes do admin também são fornecidas apenas pelo ambiente; traces com credenciais devem permanecer desativados.

## Plano e infraestrutura

- [Plano da migração](docs/superpowers/specs/2026-11-03-next-cms-mysql-vps.md)
- [Matriz de aceite](docs/qa-acceptance.md)
- [Operação futura, backup e rollback](docs/operations/README.md)

Os HTML originais são a referência de identidade e alimentam os templates React. O site público usa layouts separados do admin para preservar a tipografia e os estilos. As rotas `.html` são mantidas. A timeline citada no plano inicial não existe no HTML atual; a narrativa institucional existente é gerenciada na página Sobre Nós.
