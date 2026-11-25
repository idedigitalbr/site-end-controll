# 🚨 REGRAS OBRIGATÓRIAS DE DOMÍNIO, DEPLOY E INFRAESTRUTURA — PROJETO ENDCONTROL

> [!CRITICAL]
> ## 🛡️ MEMÓRIA PERMANENTE DO PROJETO (NUNCA ESQUECER)
>
> 1. **🌐 PRODUÇÃO ATUAL E DESTINO FUTURO:**
>    - Até o corte aprovado, a URL oficial atual continua sendo o GitHub Pages: **`https://idedigitalbr.github.io/site-end-controll/`**.
>    - O destino futuro escolhido pelo usuário é Next.js full-stack, CMS e MySQL em VPS; o novo domínio ainda será definido.
>    - O endereço antigo da VPS continua desativado e proibido.
>
> 2. **🧭 DESENVOLVIMENTO LOCAL E FUTURA VPS:**
>    - Desenvolver e visualizar localmente primeiro. Nesta fase não acessar VPS, DNS, SSH nem executar deploy.
>    - Docker na VPS continua fora do escopo. A implantação planejada usa Node.js e MySQL em serviços nativos, salvo autorização posterior explícita para outra forma.
>    - Antes do corte, atualizar esta regra com domínio, arquitetura e procedimento aprovados. Até lá, GitHub Pages permanece a publicação oficial atual.
>
> 3. **📱 RELATÓRIOS DO WHATSAPP, NOTION E DOCUMENTAÇÃO:**
>    - Antes do corte, relatórios e documentação devem apontar para a URL atual do GitHub Pages.
>    - Depois do corte aprovado, usar somente o novo domínio oficial registrado nesta regra.
>
> 4. **🐙 CONFIRMAÇÃO DE REPOSITÓRIO GITHUB (REGRA DE OURO):**
>    - Sempre solicitar confirmação antes do `git push`:
>      *"Tá, vou fazer, mas só confirma se o GitHub é esse: `https://github.com/idedigitalbr/site-end-controll.git`"*
>
> 5. **🧱 STACK DO FRONT-END:**
>    - Next.js App Router com TypeScript.
>    - Tailwind CSS para estilos utilitários.
>    - shadcn/ui configurado para primitivas Radix.
>    - `lucide-react` para ícones.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
