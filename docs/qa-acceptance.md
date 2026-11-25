# Aceite da migração EndControl

Objetivo: concluir o plano `superpowers/specs/2026-11-03-next-cms-mysql-vps.md` preservando o site original. A implantação remota e o domínio dependem do corte aprovado previsto no próprio plano; não executar ações remotas durante a fase local.

## Evidências já obtidas em 2026-11-14

- Quinze rotas públicas responderam HTTP 200.
- Matriz automatizada cobre os 15 HTML originais: edição e hidratação de texto e imagem, escaping, classes e scripts preservados, bytes intactos sem alterações.
- Navegador: criação de página temporária, rascunho/404, publicação/200, novo rascunho sem vazar no público, prévia privada e retirada/404. Dados temporários removidos.
- Navegador: salvar cores, recarregar e conferir token no CSS público; configuração original restaurada.
- Navegador: upload PNG, imagem pública/200 e edição de alt text; dados temporários removidos.

## Validação de 2026-11-23 (ambiente local, build de produção em 127.0.0.1:3000)

- `npm run build`, `npx tsc --noEmit` e `npm run test:cms` (79/79) passaram.
- Playwright público: 64 passaram, 2 falharam, 3 ignorados. Os ignorados são testes de menu de desktop, sem efeito nesta rodada.
- Paridade visual (15 páginas x desktop/tablet/mobile) passou, exceto o menu mobile abaixo.
- 404: uma única tag `robots` (`noindex`), sem duplicação durante o carregamento.
- Prévia privada de página criada em rota própria usa o template selecionado (corrigido; coberto por `tests/cms/template-path.test.ts`). Não reproduzido ao vivo.
- `scripts/qa/cms-runtime.mjs` (23 checks) passou contra o servidor local: acesso anônimo bloqueado, CSS intacto, upload/alt/exclusão de mídia, editor e prévia das 15 páginas, criar/rascunho/publicar/prévia/restaurar/despublicar com autoria na auditoria, rota despublicada fora do sitemap, permissões de editor, health.
- `tests/e2e/admin-workflow.spec.ts` passou em desktop, tablet e celular (login, painel responsivo sem rolagem horizontal, criação, dois salvamentos, restauração).
- Sem registros temporários restantes após os testes (0 páginas, contas e mídias de QA).
- Verificado ao vivo pelo painel, com conferência no site público e restauração ao final (9/9): cor da marca chega ao CSS público; telefone e e-mail aparecem no rodapé de Home, Sobre Nós e solução; rótulo do menu renomeado aparece na Home e em Sobre Nós; título e descrição de um card FFS aparecem na página de integridade, que mantém os 12 cards. As tabelas de configuração voltaram a ficar vazias (padrões originais).
- Ainda não verificados ao vivo: ordem dos serviços da Home, imagens de fundo do menu e upload de mídia aplicado a uma foto de página.

Menu mobile corrigido (`src/js/main.js`): o `click` logo após o `mouseenter` não fecha mais o submenu de soluções. Os testes de menu passam em desktop, tablet e celular (a regressão completa do restante não foi repetida depois dessa correção).

## Gates ainda a concluir

- [ ] Templates React públicos e 404, separados dos estilos do admin.
- [ ] Paridade visual desktop/tablet/mobile, incluindo efeitos (falta o menu mobile).
- [ ] Histórico, autoria, auditoria e restauração de revisão.
- [ ] Links/CTAs, imagens de fundo e ordenação editorial.
- [ ] Permissões reais admin/editor e contas; acesso indevido bloqueado.
- [ ] Importação idempotente das 15 versões publicadas, preservando edições existentes.
- [ ] SEO, canonical, OG, JSON-LD, robots e sitemap dinâmicos.
- [ ] Metadados completos e persistência de uploads fora da release.
- [ ] Backup e restauração verificados em base descartável.
- [ ] Build de produção e smoke test após restart.
- [ ] Runbook de implantação nativa, monitoramento, rollback e recuperação de acesso.
- [ ] Domínio, infraestrutura e backup externo definidos pelo responsável antes do corte.
- [ ] Corte remoto aprovado e validado (etapa futura, não autorizada nesta fase).

Resultados de teste unitário não provam paridade visual nem implantação em produção. Este arquivo acompanha os gates sem reduzir o escopo do plano original.
