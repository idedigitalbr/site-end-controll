# QA visual do painel admin — 2026-11-23

Ambiente: build de produção em 127.0.0.1:3011, conta administradora. Telas vistas em desktop (1280) e celular (375): Visão geral, Páginas, editor de página, Mídia, Mecanismos FFS, Soluções da Home, Navegação, Identidade visual (`/admin/settings`), Contas. Tablet não foi percorrido.

## Estado geral

Todas as telas abrem sem erro. Layout limpo e consistente (cartões brancos, barra lateral escura, tipografia uniforme). Navegação por abas no celular funciona. Miniaturas da mídia carregam sob demanda (lazy).

## Melhorias — editor de página (prioridade alta) — itens 1 a 9 implementados em 2026-11-23

1. **Lista plana de 131 textos** (`Textos da página`): vira uma rolagem de ~19 mil px. Agrupar por seção (Hero, Sobre, Quando aplicar, Como trabalhamos…) com blocos recolhíveis e busca interna.
2. **Textos repetidos**: H1 e vários parágrafos aparecem 2 a 13 vezes (versões desktop/mobile do mesmo template). Mostrar uma vez só e aplicar a todas as ocorrências, ou rotular "versão mobile".
3. **Rótulos técnicos**: "SPAN · …", "H3 · …", "P · …". Trocar por nomes humanos ("Título da seção", "Descrição").
4. **SEO vazio**: título e descrição para buscadores aparecem em branco, embora o site publicado já use os valores originais. Pré-preencher com o valor efetivo (ou placeholder), contador de caracteres (60/160) e pré-visualização do resultado no Google.
5. **Resumo** vazio depois do alinhamento da seed: explicar que o campo alimenta o texto do card na Home e que vazio mantém o texto original.
6. **Barra de ações no fim da página**: Salvar, Pré-visualizar, Publicar e Retirar ficam depois de 19 mil px. Torná-la fixa (sticky) no rodapé.
7. **Informações da página ausentes no topo**: faltam URL canônica, data da última publicação, quem publicou e estado (rascunho x publicado) em um bloco de resumo; hoje só há um selo e o número da versão.
8. **Histórico**: "Autoria não registrada" nas versões da seed e "Ainda não há eventos de auditoria". Esperado, mas mostrar "Importado do site original" em vez de mensagem de falta.
9. **Alterações não salvas**: não há aviso ao sair da página nem indicador de "alterações pendentes".

## Melhorias — Identidade visual / configurações (prioridade alta)

10. **Imagens de fundo**: o seletor lista centenas de arquivos pelo nome cru (`01.jpeg`, `04.jpeg`, duplicados) sem miniatura. Usar seletor visual com miniaturas, busca e rótulo do local onde a imagem aparece.
11. **Tela única muito longa** (cores, contatos/rodapé, fundos) com três botões de salvar. Separar em abas (Cores, Contatos e rodapé, Imagens de fundo) e indicar a que parte do site cada bloco se aplica.
12. **Nome da rota**: o item do menu é "Identidade visual", mas a rota é `/admin/settings` e o título é "Cores globais". Alinhar os nomes.
13. **Cores**: sem pré-visualização do efeito no site nem botão "restaurar padrão"; sem checagem de contraste.
14. **Contatos**: sem máscara/validação visível para telefone, WhatsApp (somente números) e URLs; sem pré-visualização do rodapé.

## Melhorias — outras telas

15. **Título da aba** é sempre "EndControl | Engenharia de Integridade Industrial" em todo o admin. Usar o título da tela ("Páginas | Painel EndControl").
16. **Cabeçalhos inconsistentes**: Páginas, Mídia, Navegação e Soluções da Home têm migalhas; Mecanismos FFS e Contas, não. Padronizar.
17. **Busca do topo** ("Buscar conteúdo…") não está claro o que pesquisa; confirmar que funciona em todas as telas ou remover.
18. **Rota `/admin/services`** redireciona para Soluções da Home; manter, mas documentar ou remover.
19. **Soluções da Home** e **FFS**: salvar sem pré-visualização do resultado na Home. Oferecer link "ver no site".
20. **Contas**: senha inicial sem indicação de regra mínima (agora 8 caracteres); sem redefinição de senha, desativação ou exclusão de conta pela tela.
21. **Visão geral**: textos "Publicação: Não configurada" e blocos de passos ocupam espaço; trocar por atividade recente (últimas edições, rascunhos pendentes).

## Celular

22. **Tabela de páginas** é cortada à direita: some a coluna de ação "Editar". Virar lista de cartões no celular.
23. **Barra de abas** do menu rola na horizontal sem indicação; adicionar sombra/seta nas bordas.
24. **Tablet** ainda não revisado.

## Validação não feita

Fluxos de gravação (salvar, publicar, restaurar, despublicar, upload) não foram exercitados nesta rodada; dependem de `scripts/qa/cms-runtime.mjs` e `tests/e2e/admin-workflow.spec.ts` com as credenciais de QA.
