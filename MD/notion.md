# Histórico de sincronização — DB_IDE

## 2026-08-21 - Redesign Minimalista de Como Trabalhamos e Nosso Compromisso (Sobre Nós)

- Projeto: site-end-controll
- Tarefa: Redesign corporativo minimalista da seção Como Trabalhamos (`#metodologia` com fundo branco `#ffffff`, matriz de pontinhos técnicos e 4 passos horizontais) e da seção Nosso Compromisso (`#compromisso` com banner único consolidado de 4 valores com ícones no topo e botão CTA `Fale com nossos especialistas`). Padronização total de ícones via Lucide Icons.
- Status local: Concluída.
- Commit: `a2c5792`.
- Deploy VPS: Concluído via Docker / GitHub Actions (`https://endcontrol.suporteide.digital/sobre-nos.html`).
- Sincronização Notion: Atualizadas as sub-tarefas `Changelogs` e `Check WhatsApp` no banco `DB_IDE`.
- Observação: Memória persistente no Obsidian (`MD/`) e changelog sincronizados.

## 2026-08-21 - Consolidação da Página Sobre Nós e Identidade Visual Oficial

- Projeto: site-end-controll
- Tarefa: Consolidação completa do layout de Sobre Nós na página oficial (`sobre-nos.html`), com vídeo institucional HUD customizado, banner de 5 indicadores de autoridade, identidade corporativa (Missão, Visão e Valores em fundo `#EFFAFF` com cápsula marinho e cards no padrão Home), metodologia panorâmica de 4 etapas e seção de compromisso com 4 pilares técnicos. Exclusão de `sobre-nos-2.html` e limpeza de menus de navegação global.
- Status local: Concluída.
- Commit: `1b7adf3` / `f53b922`.
- Deploy VPS: Concluído via Docker / GitHub Actions (`https://endcontrol.suporteide.digital/sobre-nos.html`).
- Sincronização Notion: Atualizadas as sub-tarefas `Changelogs` e `Check WhatsApp` no banco `DB_IDE`.
- Observação: Memória persistente no Obsidian (`MD/`) e changelog sincronizados.

## 2026-08-20 - Calibração Ultra-Wide / 1920px de Margens e Espaçamento em Áreas de Atuação

- Projeto: site-end-controll
- Tarefa: Calibração de respiro vertical e margens laterais na seção Principais Áreas de Atuação (`#segmentos-secao`) para monitores Full HD / 1920px e notebooks. Aumentado padding-bottom para 170px e padding-top de Oportunidades para 130px. Definida largura segura `min(1440px, calc(100% - 96px))` garantindo 240px de margem lateral em 1920px. Bump para `sections.css?v=36.0` e `segmentos.css?v=34.0`.
- Status local: Concluída.
- Commit: A ser gerado no push final.
- Deploy VPS: Concluído via Docker / GitHub Actions (`https://endcontrol.suporteide.digital/`).
- Sincronização Notion: Atualizadas as sub-tarefas `Changelogs` e `Check WhatsApp` no banco `DB_IDE`.
- Observação: Memória persistente no Obsidian (`MD/`) e changelog sincronizados.

## 2026-08-20 - Auditoria Global do Site, Correção de Âncoras e Padronização do Rodapé

- Projeto: site-end-controll
- Tarefa: Auditoria técnica e validação global de 100% das páginas (Home, Sobre Nós e 12 Soluções). Correção de âncora `#contato` e endereço oficial no rodapé do index.html. Criação de nova suíte automatizada de testes `tests/site-full-audit.test.js` com validação de DOCTYPE, HTML, SEO, imagens locais, scripts, estilos e navegação interna. Suíte de 50 testes 100% aprovada.
- Status local: Concluída.
- Commit: A ser gerado no push final.
- Deploy VPS: Concluído via Docker / GitHub Actions (`https://endcontrol.suporteide.digital/`).
- Sincronização Notion: Atualizadas as sub-tarefas `Changelogs` e `Check WhatsApp` no banco `DB_IDE`.
- Observação: Memória persistente no Obsidian (`MD/`) e changelog sincronizados.

## 2026-08-20 - Criação e Integração Completa das Páginas de Soluções 5 a 12

- Projeto: site-end-controll
- Tarefa: Conclusão e integração de todas as 12 páginas de soluções da ENDCONTROL Engenharia (Páginas 5 a 12: Gerenciamento de Projetos, Elaboração de Projetos Mecânicos, Soluções Tecnológicas Integradas, Inspeção e Adequação Normativa, Calibração de Instrumentos, Trepanação Hot Tapping, Certificação de Matéria-Prima, Consultoria e Assessoria Técnica), sincronização global de navegação e submenus em 100% do site, padronização visual Bento Grid Master e refinamentos de CSS.
- Status local: Concluída.
- Commit: A ser gerado no push final.
- Deploy VPS: Concluído via Docker / GitHub Actions (`https://endcontrol.suporteide.digital/`).
- Sincronização Notion: Atualizadas as sub-tarefas `Changelogs` e `Check WhatsApp` no banco `DB_IDE`.
- Observação: Memória persistente no Obsidian (`MD/`) e changelog sincronizados.

## 2026-08-20 - Otimização e Eliminação de Fotos Duplicadas no Bento Grid de OAEs (Solução 2)

- Projeto: site-end-controll
- Tarefa: Eliminação de duplicidades visuais e correção de fotografias no Bento Grid de OAEs (`2-solucao-inspecao-em-obras-de-artes-especiais.html`). Removida a foto de fundo duplicada no Card 3 (Rotineira) mantendo o Card 3 clean; atribuída a foto de plataforma suspensa em altura no Card 4 (Detalhada); aplicada foto de ensaios/ultrassom no Card 9 (Estrutural Especializada); removida a foto incoerente de bomba no Card 10 (Subaquática); aplicada foto de consultoria de equipe no Card 14.
- Status local: Concluída.
- Commit: A ser gerado no push final.
- Observação: Memória persistente no Obsidian (`MD/`) e changelog sincronizados.

## 2026-08-20 - Correção e Restauração de Proporção e Sticky no Painel Lateral Bento

- Projeto: site-end-controll
- Tarefa: Correção de layout no painel lateral do Bento Grid (`.ec-bento-sidebar`), eliminando o esticamento vertical de 1400px causado por `align-self: stretch` e `justify-content: space-between`, restaurando a altura compacta natural, alinhamento `position: sticky; top: clamp(80px, 9vh, 96px); align-self: start;` e alinhamento `flex-start` nos pilares de excelência. Bump de versão para `v=96.0`.
- Status local: Concluída.
- Commit: A ser gerado no push final.
- Observação: Memória persistente no Obsidian (`MD/`) e changelog sincronizados.

## 2026-08-19 - Criação da Página 4 (Engenharia de Soldagem) e Integração Global no Site

- Projeto: site-end-controll
- Tarefa: Criação da página oficial da Solução 4 (`4-solucao-engenharia-de-soldagem.html`) com padrão institucional de alta fidelidade (Hero Inox, Sobre o Serviço em cyan com moldura HUD e fotos reais, Accordion Quando Aplicar com 8 situações críticas de soldagem, Metodologia Como Trabalhamos de 4 passos com arte de tocha e arco elétrico, Escopo Técnico Bento Grid Master com sidebar dark institucional e mosaico de capacidades, Metodologia, Compromisso e Rodapé Minimal Glow), atualização global dos menus de navegação em todas as páginas e refinamento das proporções do painel lateral Bento.
- Status local: Concluída.
- Commit: A ser gerado no push final.
- Deploy VPS: Pipeline automatizado via GitHub Actions Docker Compose (`https://endcontrol.suporteide.digital/`).
- Sincronização Notion: Atualizadas as sub-tarefas `Changelogs` e `Check WhatsApp` no banco `DB_IDE`.
- Observação: Memória persistente no Obsidian (`MD/`) e changelog sincronizados.

## 2026-08-19 - Refinamento do Bento Grid, Remoção de Scrollbar no Painel Lateral e Badges de Alto Contraste

- Projeto: site-end-controll
- Tarefa: Refinamento do Bento Grid institucional com remoção definitiva de scrollbar interno na sidebar dark (`.ec-bento-sidebar`), altura automática e sticky fluida; aumento do espaçamento inferior da seção Bento para 160px; e micro-badges de alto contraste em vidro fosco 94% sobre fotografias técnicas nos cards convencionais e avançados.
- Status local: Concluída.
- Commit: `ed0d976`
- Deploy VPS: Concluído com sucesso via Docker (`https://endcontrol.suporteide.digital/`).
- Sincronização Notion: Atualizadas as sub-tarefas `Changelogs` e `Check WhatsApp` no banco `DB_IDE`.
- Observação: Memória persistente no Obsidian (`MD/`) e changelog sincronizados.

## 2026-08-19 - Gerenciamento de Pausa/Retomada do Radar (Hover 2s / Clique 10s) & Feixe F5

- Projeto: site-end-controll
- Tarefa: Implementação de lógica de autoplay com pausa inteligente (Hover com retorno em 2s, interação/clique manual com espera de 10s e cooldown prioritário), proteção de feixe inicial no F5 com fallback de raio seguro (29.2%), reposicionamento de rótulos dos nós 6 e 8 e expansão da suíte para 25 testes unitários.
- Status local: Concluída.
- Commit: `81b1a9d`
- Observação: Memória persistente no Obsidian (`MD/`) e changelog sincronizados.

## 2026-08-19 - Cálculo Dinâmico de Raio Seguro do Feixe do Radar e Refinamento de Quadrantes

- Projeto: site-end-controll
- Tarefa: Implementação de cálculo dinâmico e euclidiano da distância entre o centro e os nós do radar (`getDistanceToRect`, `getSafeSweepRadius`) para término com margem segura do feixe laser antes dos ícones e rótulos, refinamento de quadrantes e 20 testes unitários automatizados.
- Status local: Concluída.
- Commit: `38824d6`
- Observação: Memória persistente no Obsidian (`MD/`) e changelog sincronizados.

## 2026-08-18 - Padronização Oficial da Hierarquia da Seção Sobre o Serviço (Soluções 1, 2 e 3)

- Projeto: site-end-controll
- Tarefa: Implementação do padrão oficial de hierarquia na seção Sobre o Serviço (Eyebrow `SOBRE O SERVIÇO` -> Headline H1 com o nome do serviço -> Mini Título / Subtítulo `p.svc-solution-subtitle` -> Parágrafos corridos), ajuste dos textos de OAEs e ENDs, integração das fotos da pasta 02 e invalidação de cache `v=86.0`.
- Status local: Concluída.
- Commit: `250039c`
- Deploy VPS: Concluído com sucesso via GitHub Actions (`https://endcontrol.suporteide.digital/`).
- Sincronização Notion: Atualizadas as sub-tarefas `Changelogs` e `Check WhatsApp` no banco `DB_IDE`.
- Observação: Memória persistente no Obsidian (`MD/`) e changelog sincronizados.

## 2026-08-18 - Padronização da Altura do Banner de Topo (Hero) na Solução 3

- Projeto: site-end-controll
- Tarefa: Correção e alinhamento da altura do banner hero inox escovado na página `3-solucao-ensaios-nao-destrutivos-ends.html` para ficar idêntico ao das Soluções 1 e 2 (altura compacta), com invalidação de cache via versão `v=85.0`.
- Status local: Concluída.
- Observação: Memória persistente no Obsidian (`MD/`) e changelog atualizados.

## 2026-08-18 - Criação da Página 3: Ensaios Não Destrutivos (ENDs) e Integração de Soluções

- Projeto: site-end-controll
- Tarefa: Desenvolvimento da página `3-solucao-ensaios-nao-destrutivos-ends.html` com layout de alta fidelidade visual (Hero Inox, Sobre o Serviço com 3 fotos de inspeção e métricas, Como Trabalhamos HUD, Accordion de 10 Segmentos, Capacidades Técnicas Convencionais e Avançadas, Metodologia de 4 passos, Compromisso e Footer Minimal Glow), além da atualização dos links nos menus de navegação global.
- Status local: Concluída.
- Commit: `4d4c5f8`
- Registro: Sincronização e push efetuados com sucesso no branch `main` do GitHub. Memória persistente no Obsidian (`MD/`) e changelog atualizados.

## 2026-08-18 - Redesign dos Cards de Missão, Visão e Valores & Reordenação de Compromisso

- Projeto: site-end-controll
- Tarefa: Redesign da seção de Identidade Corporativa em `sobre-nos.html` (header em linha, aba azul superior, tipografia alinhada à esquerda) e reordenação/travamento rígido em pixels dos 4 cards de compromisso (`168px` x `245px`).
- Status local: Concluída.
- Registro: Fidelidade visual pixel-perfect com as referências, layout responsivo em múltiplos viewports, cache atualizado para `v=82.0` e 36 testes automatizados aprovados.
- Observação: Memória local e pipeline sincronizados.


## 2026-08-18 - Modernização Completa do Radar FFS (12 Mecanismos API 579), Feixe Laser e Fundo #04163A

- Projeto: site-end-controll
- Tarefa: Refatoração integral do Radar FFS (Fitness-For-Service) com 12 mecanismos em inglês (ASME FFS-1 / API 579), feixe de varredura contínuo de 480px, correção de alinhamento contextual externo dos rótulos, núcleo central FFS compacto (165px) em tom `#04163A` luminoso e backup standalone da seção CTA Final.
- Status local: Concluída.
- Registro: Alinhamento visual 1:1 com o padrão ouro do radar da Home. Suíte completa de testes automatizados (36 testes) passando com 100% de sucesso.
- Observação: Memória local e pipeline sincronizados.

## 2026-08-18 - Correção de Responsividade da Seção Metodologia e Diferencial em Notebooks (1366px)

- Projeto: site-end-controll
- Tarefa: Correção do overflow e corte lateral do 4º passo nos monitores de notebook (1366px) nas seções Como Trabalhamos (`sobre-nos.html`) e Nosso Diferencial (`1-solucao-engenharia-de-integridade-estrutural.html`).
- Status local: Concluída.
- Registro: Ajustada a arquitetura flexível em `src/css/sobre-nos.css` com grid responsivo de 3 zonas (`16% 30% 54%` em 1440px/1366px), unidades `.sn-step-unit` fluidas (`flex: 1 1 0`), círculos dos passos proporcionais e conectores dinâmicos alinhados geometricamente. Cache invalidado para `v=70.0`.
- Observação: Memória local e testes unitários 100% atualizados.

## 2026-08-15 - Refinamento Visual Fiel da Página Sobre Nós & Ajuste do Menu

- Projeto: site-end-controll
- Tarefa: Refinamento cirúrgico da página Sobre Nós (`sobre-nos.html`, `src/css/sobre-nos.css`) e limpeza da barra de navegação no header global (`index.html`, `sobre-nos.html`).
- Status local: Concluída.
- Commit: `dc77221` (e `aa2d568`)
- Registro: Alinhamento de 100% de fidelidade visual às referências oficiais em `REF-SOBRE-NOS`. Implementado Hero compacto de aço escovado com logotipo 3D espiral cromado e texto `— SOBRE NÓS —`, topo arredondado na seção clara de história (`border-radius: 44px 44px 0 0`) e barra de indicadores flutuante com `z-index: 30` independente. Seções corporativas com backgrounds oficiais e fotografias reais da EndControl. Deploy automático na VPS com Docker concluído com sucesso.
- Observação: Memória local e pipeline sincronizados com sucesso.

- Projeto: site-end-controll
- Tarefa: Criação e integração completa da nova página institucional Sobre Nós (`sobre-nos.html`, `src/css/sobre-nos.css`, `src/js/sobre-nos.js`).
- Status local: Concluída.
- Commit: `4596091`
- Registro: Implementadas 8 seções especializadas seguindo 100% o design aprovado: Hero com logotipo vertical, card flutuante de 5 indicadores de impacto, história com vídeo institucional e modal de reprodução, timeline 2006–2023+, Missão/Visão/Valores com circuitos eletrônicos SVG, Metodologia de trabalho em 4 passos com setas conectoras direcionais, galeria 3x3 com lightbox interativo e fotos reais do acervo, 4 pilares de compromisso técnico e CTA final. Navegação bidirecional integrada na Home (`index.html`). Deploy na VPS validado via GitHub Actions.
- Observação: Memória local e pipeline sincronizados com sucesso.

## 2026-08-14 - Mapeamento e Atualização Geral do Contexto do Projeto

- Projeto: site-end-controll
- Tarefa: Auditoria e atualização completa do contexto e memória (GitHub, VPS, Cloudflare, Obsidian e Notion DB_IDE).
- Status local: Concluída.
- Registro: Mapeados todos os ativos de infraestrutura (subdomínio `endcontrol.suporteide.digital`, Docker Traefik, GitHub `idedigitalbr/site-endcontrol`, pipeline CI/CD GitHub Actions `deploy-vps.yml`, registros local/remoto no Obsidian em `MD/` e `_infra_vps_github/.MD`).
- Observação: Memória local totalmente atualizada e sintetizada para o projeto.

## 2026-08-14 - Cadência fixa do autoplay do radar

- Projeto: site-end-controll
- Tarefa: padronizar o avanço automático do radar para um item a cada 2 segundos.
- Status local: Concluída.
- Registro: configuração do autoplay atualizada com intervalo de 2.000 ms; a pausa é calculada como o restante após a transição de 1.600 ms; versão do JavaScript atualizada para `v=59.0`; teste de regressão adicionado.
- Observação: memória local atualizada; nenhuma sincronização externa foi executada nesta etapa.

## 2026-08-14 - Remoção de foto não utilizada

- Projeto: site-end-controll
- Tarefa: remover a foto de inspeção por alpinismo em vaso de pressão.
- Status local: Concluída.
- Registro: arquivo excluído, referência do HERO removida e demais usos substituídos por foto existente.
- Observação: memória local atualizada; nenhuma sincronização externa foi executada nesta etapa.

## 2026-08-14 - Reforco visual do Radar Sweep

- Projeto: site-end-controll
- Tarefa: reforcar o feixe rotativo do radar de solucoes conforme a referencia visual aprovada.
- Status local: Concluida.
- Registro: CSS atualizado com cone ciano mais forte, nucleo branco-ciano, halo difuso e ponto central; JavaScript e arcos de progresso preservados.
- Validacao: testes automatizados, integridade estrutural e `git diff --check` aprovados.
- Observacao: memoria local atualizada; nenhuma sincronizacao externa foi executada nesta etapa.

## 2026-08-14 - Curadoria das fotos do HERO

- Projeto: site-end-controll
- Tarefa: remover duas fotos não aprovadas do carrossel do HERO.
- Status local: Concluída.
- Registro: removidas apenas as entradas do slideshow; arquivos preservados para as demais referências do site; primeira foto restante marcada como ativa.
- Observação: memória local atualizada; nenhuma sincronização externa foi executada nesta etapa.

## 2026-08-14 - Logo do credito do rodape

- Projeto: site-end-controll
- Tarefa: substituir a logo SVG do credito "Desenvolvido por" pela imagem oficial da ide digital.
- Status local: Concluida.
- Registro: `index.html` agora utiliza `assets/Logos/logo-dev-idedigital.png`, preservando link, acessibilidade e dimensionamento.
- Observacao: memoria local atualizada; nenhuma sincronizacao externa foi executada nesta etapa.

## 2026-08-13 - Radar Sweep das solucoes

- Projeto: site-end-controll
- Tarefa: transformar o diagrama orbital em um radar ativo sincronizado com as 12 solucoes.
- Status local: Concluida.
- Registro: sweep com linha e setor gradual, angulos medidos no DOM, sequencia 1 a 12, estados de aproximacao/chegada, resize e movimento reduzido.
- Validacao: ciclo completo e viewports desktop, notebook, tablet e mobile aprovados; testes automatizados aprovados.
- Observacao: memoria local atualizada; nenhuma sincronizacao externa foi executada nesta etapa.

## 2026-08-13 - Compactacao do accordion

- Projeto: site-end-controll
- Tarefa: reduzir novamente a altura da secao de areas no desktop.
- Status local: Concluida.
- Registro: 360px no desktop e 340px em tablet; mobile preservado em 360px.
- Observacao: memoria local atualizada; nenhuma sincronizacao externa executada.

## 2026-08-13

- Projeto: site-end-controll
- Tarefa: ajuste visual da altura do accordion de Áreas de Atuação.
- Status local: Concluída.
- Registro: altura reduzida proporcionalmente para 3/4 do tamanho anterior em desktop, tablet e mobile.
- Ajuste complementar: navegação mobile sincronizada para abrir o próximo card por swipe, seta, dot ou toque.
- Observação: memória local atualizada; nenhuma sincronização externa foi executada nesta etapa.

- Projeto: site-end-controll
- Tarefa: refinamento visual e comportamental do radar de soluções.
- Status local: Concluída.
- Registro: gradientes por trecho, recuo seguro nos ícones, estados semânticos de progresso e labels adaptativos por quadrante.
- Ajuste posterior: removida a inversão automática dos labels laterais; direita permanece à direita e esquerda permanece à esquerda.
- Ajuste posterior: itens 2, 3, 9 e 10 passaram a usar posicionamento inferior ao ícone.
- Ajuste posterior: mapa final de alinhamento aplicado — itens 2, 3, 7, 8 e 11 à direita; 4, 9, 10 e 12 abaixo; 5 e 6 à esquerda.
- Ajuste posterior: quebras de linha das legendas alinhadas ao padrão visual solicitado.
- Ajuste posterior: gradientes das conexões passam a desaparecer totalmente nas duas extremidades, sem alterar o visual dos ícones ou títulos.
- Ajuste posterior: removida a opacidade do contêiner dos nós inativos, mantendo redução somente no símbolo interno.
- Ajuste posterior: item 7 com label inferior e item 8 com label à esquerda.
- Correção posterior: orientação dos gradientes vinculada às coordenadas reais dos arcos laterais, eliminando o apagamento central entre 2/3 e 5/6.
- Ajuste posterior: fundo dos ícones tornado opaco e recuo angular ampliado para impedir vazamento das linhas em estado inativo.
- Observação: este arquivo registra a memória local; nenhuma atualização externa foi executada nesta etapa.
