# Features — ENDCONTROL Engenharia

## Adoção do Acervo Oficial 16:9 (`originais-16-9`) e Purga Total de Imagens Rejeitadas

- Status: Concluída
- Data: 2026-08-21
- **Arquivos:** `assets/Fotografias/originais-16-9/`, `index.html`, `sobre-nos.html`, `10-solucao-trepanacao-hot-tapping.html`, `12-solucao-consultoria-e-assessoria-tecnica.html`, `2-solucao-inspecao-em-obras-de-artes-especiais.html`, `3-solucao-ensaios-nao-destrutivos-ends.html`, `9-solucao-calibracao-de-instrumentos.html`, `componentes-cards-.html`, `identidade-visual.html`, `src/data/drive-assets.js`, `src/data/units.js`, `src/js/album.js`, `src/js/main.js`, `src/js/service-pages.js`, `src/js/solucoes-integridade.js`, `src/js/solucoes.js`, `src/css/brand-pages.css`, `tests/about-media.test.js`, `tests/service-visual-standard.test.js`.
- **Acervo Oficial 16:9:** Substituídas 100% das imagens rejeitadas pelo novo lote de 12 fotografias técnicas de alta qualidade devidamente categorizadas por técnica e aplicação industrial.
- **Purga Total:** Exclusão física de `assets/Fotografias/editadas` e limpeza de todas as referências em código, scripts, templates, testes e configurações.

## Layout Direto e Limpo na Seção Nosso Compromisso (Sobre Nós)

- Status: Concluída
- Data: 2026-08-21
- **Arquivos:** `sobre-nos.html`, `src/css/sobre-nos.css`, `MD/changelog.md`, `MD/features.md`
- **Padrão Oficial 1:1 (Print 1):** Removido totalmente o bloco de itens (Segurança, Confiabilidade, Eficiência, Sustentabilidade), deixando a seção estritamente com a cápsula badge `NOSSO COMPROMISSO`, a headline `Excelência técnica começa com responsabilidade.` e o botão de ação `Fale com nossos especialistas →` diretamente integrado sobre a foto técnica.

## Consolidação da Página Sobre Nós e Identidade Visual Unificada

- Status: Concluída
- Data: 2026-08-21
- **Arquivos:** `sobre-nos.html`, `src/css/sobre-nos.css`, `index.html`, páginas de soluções 1 a 12, `MD/changelog.md`, `MD/features.md`
- **Layout Premium Consolidado:** Integradas as 4 seções principais na página oficial `sobre-nos.html`:
  1. *Sobre a EndControl / Nossa História* (`#sobre`) com vídeo institucional HUD customizado e banner de 5 indicadores de autoridade.
  2. *Nossa Identidade Corporativa* (`#essencia`) com fundo `#EFFAFF`, cápsula azul marinho e cards de Missão, Visão e Valores alinhados à identidade visual da Home.
  3. *Como Trabalhamos* (`#metodologia`) com foto técnica panorâmica e 4 etapas metodológicas.
  4. *Nosso Compromisso* (`#compromisso`) com os 4 pilares de responsabilidade e botão de contato direto.
- **Limpeza:** Arquivo temporário `sobre-nos-2.html` excluído e links no menu global devidamente limpos e padronizados.

## Remoção Completa da Seção Álbum de Fotos em Sobre Nós

- Status: Concluída
- Data: 2026-08-21
- **Arquivos:** `sobre-nos.html`, `src/css/sobre-nos.css`, `src/js/sobre-nos.js`, `MD/changelog.md`
- **Limpeza e Otimização:** Seção S5 (Álbum de Fotos / Galeria 3x3) e o Lightbox interativo removidos completamente de `sobre-nos.html`, garantindo fluxo visual direto entre Metodologia (*Como Trabalhamos*) e *Nosso Compromisso*. Código CSS e JS limpos de regras obsoletas, com versionamento de cache atualizado.


- Status: Concluída
- Data: 2026-08-20
- **Arquivos:** `index.html`, `src/css/solucoes.css`, `src/js/solucoes.js`, `tests/site-integrity.ps1`, `MD/changelog.md`
- **Fundo Claro e Legibilidade:** Fundo principal convertido para `#ffffff`, com tipografia ajustada para cores escuras de alto contraste (`#071429` e `#475569`), nós de serviço, anéis orbitais, feixe de varredura (*sweep*) e card lateral calibrados para o tema claro com invalidação de cache (`v=58.0`).

## Elevação Frontal e Elementos Blueprint Decorativos na Seção Oportunidades

- Status: Concluída
- Data: 2026-08-20
- **Arquivos:** `index.html`, `src/css/sections.css`, `MD/changelog.md`
- **Elementos Blueprint & HUD:** Integrados radar com feixe de varredura rotativo, sonar em arcos, matrizes de crosshairs (+) HUD, corner brackets e linhas técnicas com nós de neon ciano no background da seção Oportunidades e Carreiras.
- **Sobreposição Frontal e Elevação (`z-index: 25`):** Aplicada elevação com sombra profunda `box-shadow: 0 24px 60px rgba(7, 20, 41, 0.16)` e margens negativas de -48px no topo e rodapé, garantindo que o card se sobreponha frontalmente à seção anterior (#segmentos-secao) e à seção seguinte (#faq-secao).

## Margem Direita de 200px e Elevação na Seção Como Trabalhamos

- Status: Concluída
- Data: 2026-08-20
- **Arquivos:** `src/css/sobre-nos.css`, `src/css/servico-integridade.css`, `3-solucao-ensaios-nao-destrutivos-ends.html`, `6-solucao-elaboracao-de-projetos-mecanicos.html`, `8-solucao-inspecao-e-adequacao-normativa.html`, `10-solucao-trepanacao-hot-tapping.html`, `12-solucao-consultoria-e-assessoria-tecnica.html`, `MD/changelog.md`
- **Layout Panorâmico Calibrado:** Margem direita de 200px em 1920px no container `.sn-process-widescreen-container`, eliminando qualquer contato dos ícones com a borda. Redução de ~70px no recuo esquerdo para posicionar o texto de forma harmoniosa com a foto. Elevação de camada (`z-index: 20`) com sombra dupla para destaque superior sobre as seções adjacentes. Remoção de todos os botões de CTA residuais.

## Calibração Ultra-Wide (1920px) de Margens e Espaçamento em Áreas de Atuação

- Status: Concluída
- Data: 2026-08-20
- **Arquivos:** `src/css/segmentos.css`, `src/css/sections.css`, `index.html`, `MD/changelog.md`
- **Espaçamento e Respiro Visual:** Expandido `padding-bottom` de `.segmentos-secao` para 170px e `padding-top` de `#oportunidades` para 130px. Configurada largura segura `width: min(1440px, calc(100% - 96px))` no accordion `.endo-acc-full-wrapper` com 240px de margem lateral em telas 1920px, evitando proximidade das bordas. Versão do CSS atualizada para `sections.css?v=36.0` e `segmentos.css?v=34.0`.

## Página da Solução 4: Engenharia de Soldagem e Integração Global

- Status: Concluída
- Data: 2026-08-19
- **Arquivo:** `4-solucao-engenharia-de-soldagem.html`
- **Página Institucional Completa:** Desenvolvida a página do serviço 4 com layout oficial de alto nível: Hero Inox, Sobre o Serviço com 2 fotos sobrepostas em moldura HUD, Accordion Quando Aplicar (8 situações críticas em soldagem), Metodologia Como Trabalhamos (4 etapas), Bento Grid Master com painel lateral dark e arte vetorial de tocha/arco elétrico, Metodologia, Compromisso e Rodapé Minimal Glow.
- **Navegação Global:** Dropdowns, menus e radar atualizados conectando `4-solucao-engenharia-de-soldagem.html` em todo o ecossistema do site.

## Painel Lateral Institucional (Sidebar Dark) 1:1 com Arte da Ponte Estaiada

- Status: Concluída
- Data: 2026-08-19
- **Arquivo:** `componentes-cards-.html`
- **Arte Vetorial Integrada:** Wireframe CAD de ponte estaiada com cabos radiantes, treliças e flare estelar luminoso no topo do mastro.
- **Acabamento Premium:** Gradiente Dark Navy, ambient neon glow no canto inferior esquerdo e badges circulares com anel de vidro ciano.

## Expanding Bento Grid com Painel Lateral Institucional (Composição Master Oficial)

- Status: Concluída
- Data: 2026-08-19
- **Arquivo:** `componentes-cards-.html`
- **Painel Lateral Institucional (Sidebar Dark):** Logo ENDCONTROL, tag `INSPEÇÕES ESPECIALIZADAS`, headline com destaque neon, parágrafo executivo, divisor e 4 pilares verticais (`Segurança em primeiro lugar`, `Dados que geram confiança`, `Tecnologia e experiência`, `Compromisso com resultados`).
- **Mosaico Bento Grid Integrado (13 Cards):** Grade expansível com física real de empurrão acoplada ao lado do painel de apresentação.
- **Adaptação Completa:** Layout mestre de 2 colunas com suporte a telas ultra-wide, laptops, tablets e mobile.

## Expanding Bento Grid com Expansão Física e Deslocamento Dinâmico dos Vizinhos

- Status: Concluída
- Data: 2026-08-19
- **Arquivo:** `componentes-cards-.html`
- **Expansão Física Real:** O card em hover ganha largura/proporção dinâmica ativa, empurrando fisicamente os cards vizinhos que se comprimem suavemente em tempo real.
- **Física Elástica em Linhas Coordenadas:** Linha 1 (Hero + ENDs + Geotecnia/Monitoramento), Linha 2 (Inspeção + Materiais + Integridade + Geometria), Linha 3 (Topografia + GPR + Análise), Linha 4 (Documentação + Consultoria).
- **Fluidez e Retorno Suave:** Curvas físicas `cubic-bezier(0.25, 1, 0.35, 1)` a 60/120 FPS.

## Bento Grid com Física Elástica (Expansão do Focado & Contração dos Vizinhos)

- Status: Concluída
- Data: 2026-08-19
- **Arquivo:** `componentes-cards-.html`
- **Dinâmica de Respiração:** O card sob foco do cursor cresce de forma proeminente (`scale(1.06)` a `scale(1.025)` com `z-index: 30`) enquanto todos os outros cards do mosaico se retraem suavemente (`scale(0.965)` e `opacity: 0.68`).
- **Fluidez 60/120 FPS:** Renderização 100% acelerada por hardware via GPU com curvas spring `cubic-bezier(0.25, 1, 0.35, 1)`.

## Bento Grid Editorial 12 Colunas (Masonry Arquitetônico & Hover Escalado)

- Status: Concluída
- Data: 2026-08-19
- **Arquivo:** `componentes-cards-.html`
- **Estrutura 12 Colunas Fluida:** `grid-template-columns: repeat(12, minmax(0, 1fr))`, `gap: clamp(8px, 1vw, 14px)`, `max-width: 1440px`.
- **Encaixe Perfeito sem Buracos:** Composição matemática exata dos 13 serviços distribuídos em 5 linhas de altura proporcional (`aspect-ratio` e `grid-row`).
- **Interações Expansíveis Premium:** Hover com escala diferenciada por tamanho do card (`1.038` pequeno, `1.025` médio, `1.015` grande), micro-zoom na imagem, elevação suave e foco spotlight nos cards ativos.
- **Responsividade Multi-Dispositivo:** Adaptação suave para 6 colunas em tablets e 2/1 colunas em mobile.

## Bento Grid 1:1 Idêntico à Referência (13 Capacidades Integradas)

- Status: Concluída
- Data: 2026-08-19
- **Arquivo:** `componentes-cards-.html`
- **Fidelidade Visual 1:1:** Fundo suave `#dceef5`, cards borderless com sombras suaves, proporções exatas da grade 4x4, alinhamentos laterais precisos e fotografias com transições de degradê idênticas ao design original.

## Cards Borderless & Smooth Shadows (Design Sem Bordas)

- Status: Concluída
- Data: 2026-08-19
- **Arquivo:** `componentes-cards-.html`
- **Design Sem Bordas:** Eliminadas todas as bordas duras (`border: none`) dos cards Dark e White.
- **Profundidade com Sombras:** Uso de sombras suaves e degradês sem emendas para integração visual limpa com fotos e fundos.

## Expanding Dynamic Bento Grid 100% Modular (Reutilização dos 4 Componentes)

- Status: Concluída
- Data: 2026-08-19
- **Arquivo:** `componentes-cards-.html` padronizado e limpo, sem classes redundantes.
- **Reutilização Direta:** A seção 3 (Bento Grid) consome diretamente as 4 tipologias oficiais (`.ec-card-dark`, `.ec-card-white`, `ec-card-*-overlay--horizontal`, `--vertical`, `--hero`).
- **Composição dos 13 Serviços:** 1 Hero largo, 3 sem foto (ENDs, Integridade, Materiais), 6 horizontais (Geotecnia, Monitoramento, Topografia, GPR, Documentação, Consultoria) e 3 verticais (Inspeção visual, Geometria Drone e Análise Estrutural).
- **Fluidez & Dynamic Grid:** Efeito Spotlight, elevação no hover (`translateY(-5px) scale(1.015)`), borda neon ativa e responsividade total.

## Catálogo de Componentes de Cards (4 Tipologias / Dark & White)

## Catálogo de Componentes de Cards (4 Tipologias / Dark & White)

- Status: Concluída
- Data: 2026-08-19
- **Arquivo:** `componentes-cards-.html` consolidado com os 4 formatos oficiais de cards para o projeto.
- **Tipo 1 (Horizontal):** Fusão horizontal (`to right`), conteúdo estruturado à esquerda e fotografia técnica à direita.
- **Tipo 2 (Vertical):** Fusão vertical (`to bottom`), cabeçalho e checklist no topo e foto em destaque na base inferior (Drone / Inspeção).
- **Tipo 3 (Sem Foto):** Layout clean sem imagem, ícone 3D Cube no topo, título e lista técnica expandida de 5 itens.
- **Tipo 4 (Foto Cheia / Hero Destaque):** Layout full background media, tag superior e headline institucional de alto impacto na base.
- **Variações Dark e White:** Duas seções padronizadas com os 4 tipos de cards (Dark Navy `#071429` com nós neon e White `#ffffff` com nós azuis).

## Gerenciamento de Pausa e Retomada Inteligente do Radar (Hover 2s / Clique 10s) & Refinamento de Feixe F5

- Status: Concluída
- Data: 2026-08-19
- **Controle Inteligente de Autoplay:** Hover no card e nós pausa o autoplay e retoma em **2 segundos** após a saída do cursor; cliques manuais (nós, setas, dots) acionam janela de espera de **10 segundos** (`manualResumeDelay: 10000`).
- **Priorização de Cooldown:** Clique manual tem prioridade estrita sobre o hover, garantindo que o usuário tenha tempo de leitura sem interrupções indesejadas.
- **Proteção do Feixe no F5/Carregamento:** Estilo inline inicial e variável CSS `--sweep-radius-initial: 29.2%` evitam que o feixe laser ultrapasse o rótulo do Item 0 no primeiro frame.
- **Ajuste de Rótulos 6 e 8:** Item 6 reposicionado para a esquerda e Item 8 para a direita do anel interno, com espaçamento simétrico.
- **Testes Automatizados:** 25 testes unitários passando com 100% de sucesso.

## Cálculo Dinâmico de Raio Seguro do Feixe do Radar e Refinamento de Quadrantes

- Status: Concluída
- Data: 2026-08-19
- Implementado cálculo dinâmico e euclidiano da distância entre o centro do radar e os nós (`getDistanceToRect`, `getSafeSweepRadius`), garantindo que o feixe de varredura termine com margem de segurança de 16px antes dos ícones/rótulos ativos.
- Refinamento de quadrantes para 180° e 210°, atualização das variáveis CSS `--sweep-radius` em tempo real e adição de 20 testes unitários automatizados.

## Padronização Oficial da Hierarquia da Seção Sobre o Serviço (Soluções 1, 2 e 3)

- Status: Concluída
- Data: 2026-08-18
- Padronizada a hierarquia visual em 4 níveis (Eyebrow -> Headline com Nome do Serviço -> Mini Título / Subtítulo Técnico -> Parágrafos Corridos) nas páginas de serviços (`1-solucao...`, `2-solucao...`, `3-solucao...`).
- Atualizadas as fotografias de Obras de Artes Especiais para a pasta oficial `02` e bump de cache para `v=86.0`.

## Padronização da Altura do Banner de Topo (Hero) nas Soluções 1, 2 e 3

- Status: Concluída
- Data: 2026-08-18
- Padronizada a altura compacta do banner hero inox escovado na página `3-solucao-ensaios-nao-destrutivos-ends.html` em conformidade com as páginas 1 e 2.
- Atualizado o versionamento de cache para `v=85.0` em todas as páginas de soluções.

## Página 3: Ensaios Não Destrutivos (ENDs) e Integração de Soluções

- Status: Concluída
- Data: 2026-08-18
- Criada a página `3-solucao-ensaios-nao-destrutivos-ends.html` com arquitetura visual e técnica oficial: Hero Inox, Sobre o Serviço com 3 fotos reais e métricas flutuantes, Como Trabalhamos HUD, Accordion de 10 Segmentos Industriais, Grade de Técnicas Convencionais e Avançadas, Metodologia de 4 passos, Compromisso e Footer Minimal Glow.
- Atualizados os links e dropdowns de soluções em todas as páginas do site (`index.html`, `sobre-nos.html`, `1-solucao...`, `2-solucao...`, `src/js/solucoes.js`).
- Estilização dedicada em `src/css/servico-integridade.css` para a composição de 3 fotos e capacidades técnicas.

## Redesign dos Cards de Missão, Visão e Valores & Reordenação dos Cards de Compromisso

- Status: Concluída
- Data: 2026-08-18
- Redesenhada a seção de Identidade Corporativa (Missão, Visão e Valores) em `sobre-nos.html` com layout de header em linha (ícone à esquerda + título à direita), aba superior azul decorativa e alinhamento à esquerda.
- Reordenados os 4 cards de compromisso (Eficiência, Segurança, Parceria, Confiabilidade) e travadas suas dimensões exatas em pixels (`168px` de largura por `245px` de altura mínima).
- Removido botão redundante da seção "Como Trabalhamos" para foco na metodologia de 4 etapas.
- Versionamento de cache atualizado para `v=82.0`.


## Modernização Completa do Radar FFS (12 Mecanismos API 579 em Inglês) & Design System #04163A

- Status: Concluída
- Data: 2026-08-18
- Implementada a matriz completa dos 12 mecanismos de dano da norma ASME FFS-1 / API 579 em inglês no radar interativo da página de Engenharia de Integridade Estrutural.
- Corrigido o alinhamento contextual externo dos 12 rótulos, eliminando o deslocamento lateral no estado ativo e desobstruindo 100% o interior do radar.
- Feixe de varredura laser contínuo de 480px com tecnologia neon azul/ciano, blur atmosférico e núcleo luminoso (padrão 1:1 com a Home).
- Núcleo central FFS compacto (165px) com gradiente aberto e luminoso no tom `#04163A` sem poluição de logo.
- Backup standalone da seção CTA Final criado em `backup-secao-cta-final.html` e removido das páginas ativas.
- Validação: 36 testes automatizados aprovados.

## Correção de Responsividade da Seção Metodologia e Diferencial em Notebooks (1366px)

- Status: Concluída
- Data: 2026-08-18
- Ajustado o dimensionamento dos 4 passos (`.sn-step-unit`, `.sn-step-node`, `.sn-step-line-connector`) e a proporção de grid do container panorâmico (`.sn-process-widescreen-container`) em `src/css/sobre-nos.css`.
- Eliminado o corte lateral do 4º passo ("Solução personalizada" / "Análise e resultado") em monitores de notebooks com 1366px, 1440px e 1280px.
- Aplicado automaticamente na página Sobre Nós (`sobre-nos.html`) e nas páginas de Serviços (`1-solucao-engenharia-de-integridade-estrutural.html`).
- Versionamento de cache de CSS atualizado para `v=70.0`.

## Refinamento Visual e Estrutural da Página Sobre Nós

- Status: Concluída
- Data: 2026-08-15
- Commit: `aa2d568`
- Refinado o layout da página `sobre-nos.html` com 100% de fidelidade visual às referências oficiais em `REF-SOBRE-NOS`.
- Implementado Hero compacto de aço escovado com logotipo 3D espiral, topo arredondado na seção clara de história e barra de indicadores flutuante com z-index independente.
- Ajustadas todas as seções corporativas com backgrounds oficiais e fotografias reais da EndControl.
- Limpeza da barra de navegação no header da Home e da página Sobre Nós.

## Nova Página Institucional Sobre Nós

- Status: Concluída
- Data: 2026-08-14
- Criada a página `sobre-nos.html` com layout de alta fidelidade técnica, 8 seções especializadas (Hero, Indicadores flutuantes, História + Vídeo, Timeline 2006-2023+, Missão/Visão/Valores com circuitos SVG, Metodologia 4 etapas, Galeria 3x3 com lightbox, Compromisso e CTA Final).
- Integrados estilos dedicados em `src/css/sobre-nos.css` e interatividades em `src/js/sobre-nos.js`.
- Conectada a navegação bidirecional com a Home (`index.html`).
- Validação: integridade do site e testes unitários 100% aprovados.

## Mapeamento e Atualização Geral do Contexto do Projeto

- Status: Concluída
- Data: 2026-08-14
- Mapeada e consolidada toda a estrutura do projeto: repositório GitHub (`idedigitalbr/site-endcontrol`), pipeline de deploy VPS com GitHub Actions e Docker Compose, DNS Cloudflare (`endcontrol.suporteide.digital`), memória Obsidian local (`MD/`) e base do Notion (`DB_IDE`).

## Autoplay do radar com cadência fixa

- Status: Concluída
- Data: 2026-08-14
- O radar avança automaticamente de um serviço para o próximo a cada 2 segundos.
- A transição permanece em 1.600 ms e o código calcula os 400 ms restantes para completar cada intervalo de 2 segundos.
- A versão do JavaScript foi atualizada para `v=59.0` para garantir a entrega do comportamento novo após o deploy.
- Validação: teste de cadência, testes automatizados completos, integridade estrutural e `git diff --check` aprovados.

## Remoção de foto não utilizada

- Status: Concluída
- Data: 2026-08-14
- Removida a foto de inspeção por alpinismo em vaso de pressão e eliminadas suas referências ativas.
- Conteúdos que dependiam dela passaram a utilizar uma foto existente de inspeção por ultrassom.

## Radar Sweep com feixe reforcado

- Status: Concluida
- Data: 2026-08-14
- O feixe rotativo passou a usar tres camadas visuais: cone ciano com cauda gradual, nucleo branco-ciano e halo difuso com blur.
- Preservados a animacao WAAPI, o centro do radar, os arcos de progresso, a navegacao e o suporte a `prefers-reduced-motion`.
- Validacao: 18 testes do radar, integridade estrutural do site e verificacao de whitespace aprovados.

## Curadoria das fotos do HERO

- Status: Concluída
- Data: 2026-08-14
- Removidas do carrossel do topo as fotos de ultrassom em solda de tubulação e do técnico em refinaria noturna, conforme aprovação visual.
- Os arquivos físicos foram preservados porque continuam sendo usados em outras seções do site.

## Ordem compartilhada de serviços e agrupador Projetos

- Status: Concluída
- Data: 2026-08-14
- Menu, radar e cards seguem a mesma sequência de 12 serviços.
- `Projetos` funciona como agrupador sem numeração para Gerenciamento de Projetos e Elaboração de Projetos Mecânicos.
- Navegação por menu, radar, autoplay, setas e dots permanece sincronizada.
- Validação: testes da ordem, testes do radar e integridade estrutural aprovados.

## Logo do credito do rodape

- Status: Concluida
- Data: 2026-08-14
- Substituida a logo SVG embutida do credito "Desenvolvido por" pela imagem oficial `assets/Logos/logo-dev-idedigital.png`.
- Mantidos o link para o site da ide digital, o texto alternativo, o hover e a responsividade.

## Radar Sweep sincronizado

- Status: Concluida
- Data: 2026-08-13
- Feixe de varredura real com linha frontal, setor gradual e glow controlado.
- Sequencia temporizada 1 a 12 vinculada aos angulos reais dos icones medidos no DOM.
- Estados futuro, percorrido, atual, saindo e aproximando sincronizados com o card de destaque.
- Responsividade recalculada em resize e suporte a `prefers-reduced-motion`.
- Arquivos principais: index.html, src/css/solucoes.css, src/js/solucoes.js e src/js/radar-progress.js.
- Validacao: ciclo completo, quatro viewports, console do radar e testes automatizados aprovados.

## Refinamento visual do accordion de areas

- Status: Concluida
- Data: 2026-08-13
- Altura desktop reduzida para 360px e tablet para 340px, deixando os paineis mais quadrados.
- Mobile mantido em 360px para preservar leitura e navegacao por swipe.

## Accordion de Áreas de Atuação

- Status: Concluída
- Data: 2026-08-13
- Escopo: redução proporcional da altura dos painéis para 3/4 do tamanho anterior.
- Resultado: 435px no desktop, 390px em tablet e 360px em telas menores, preservando recorte, expansão e responsividade.
- Navegação mobile: swipe, setas, dots e toque sincronizam o card ativo; o painel centralizado abre automaticamente.
- Arquivos principais: index.html e src/css/segmentos.css.

## Radar orbital de soluções

- Status: Concluída
- Data: 2026-08-13
- Escopo: refinamento da linha de progresso, estados visuais e posicionamento contextual dos labels.
- Correção adicional: labels laterais permanecem sempre no lado externo correspondente ao ícone.
- Ajuste adicional: labels dos itens 2, 3, 9 e 10 ficam abaixo dos ícones.
- Alinhamento aprovado: itens 2, 3, 7, 8 e 11 à direita; itens 4, 9, 10 e 12 abaixo; itens 5 e 6 à esquerda.
- Quebras de linha das legendas ajustadas conforme o mapa visual aprovado.
- Revisão visual: as pontas das conexões agora desaparecem em 0% de opacidade antes dos ícones, sem máscaras sobre os nós.
- Ajuste final: ícones ganharam fundo opaco e as conexões passaram a manter uma lacuna angular maior ao redor deles, sem fundo adicional nos títulos.
- Estado inativo refinado: círculo e preenchimento permanecem com opacidade total; apenas o símbolo SVG interno usa opacidade reduzida.
- Posicionamento complementar: texto do item 7 abaixo do ícone e texto do item 8 à esquerda do ícone.
- Gradientes dos arcos agora acompanham o vetor real de cada trecho, mantendo o centro iluminado inclusive entre 2→3 e 5→6.
- Arquivos principais: index.html, src/js/radar-progress.js, src/js/solucoes.js, src/css/solucoes.css.
- Validação: testes unitários do radar e integridade estrutural do site aprovados.
