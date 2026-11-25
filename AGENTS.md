# 🚨 REGRAS OBRIGATÓRIAS DE DOMÍNIO, DEPLOY E INFRAESTRUTURA — PROJETO ENDCONTROL

> [!CRITICAL]
> ## 🛡️ MEMÓRIA PERMANENTE DO PROJETO (NUNCA ESQUECER)
>
> 1. **🌐 PRODUÇÃO ATUAL E DESTINO FUTURO:**
>    - Corte autorizado e realizado em 2026-11-25: **`https://endcontrol.suporteide.digital/`** passa a ser o endereço oficial do site Next.js e CMS.
>    - GitHub Pages (`https://idedigitalbr.github.io/site-end-controll/`) permanece como publicação legada, sem ser o alvo deste deploy.
>    - A stack `sistema-endcontrol` é outro sistema e permanece fora do escopo.
>
> 2. **🧭 DESENVOLVIMENTO LOCAL E FUTURA VPS:**
>    - Em 2026-11-25 o usuário autorizou SSH e deploy Docker na VPS 161.97.108.92, exclusivamente na stack `endcontrol`, com backup prévio.
>    - O alvo aprovado é `endcontrol-web`, em `https://endcontrol.suporteide.digital`; `sistema-endcontrol` é outro sistema e não deve ser alterado.
>    - A release inicial teve backup prévio verificado, healthchecks aprovados e as 15 páginas públicas validadas. Consulte `deploy/README.md` para os caminhos e rollback.
>    - Preservar banco e uploads em volumes próprios; fazer backup atualizado antes das próximas migrações.
>
> 3. **📱 RELATÓRIOS DO WHATSAPP, NOTION E DOCUMENTAÇÃO:**
>    - Relatórios atuais devem apontar para `https://endcontrol.suporteide.digital/`.
>    - Referências ao GitHub Pages em registros antigos são históricas.
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
