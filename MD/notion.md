# Histórico de sincronização — DB_IDE

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
