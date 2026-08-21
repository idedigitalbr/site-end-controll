# Changelog — ENDCONTROL Engenharia

## [2026-08-21] - Padronização da Cor dos Ícones de Áreas de Atuação na Home para Ciano (`#00a9df`)

- **Arquivos:** `src/css/segmentos.css`, `index.html`, `MD/changelog.md`.

### Enhanced & Standardized
- **Seção Áreas de Atuação (`.segmentos-secao` em `index.html`):**
  - Atualizada a cor dos 10 ícones da sanfona vertical de segmentos (`.endo-acc-icon`) de azul-marinho escuro para o tom ciano oficial (`#00a9df`), garantindo alto contraste e visibilidade idêntica à seção correspondente das páginas de soluções (*Situações em que este serviço agrega valor*).
  - Versionamento de cache atualizado para `segmentos.css?v=39.0`.
  - 125/125 testes aprovados e deploy na VPS com 100% de sucesso.


- **Arquivos:** `assets/Fotografias/originais-16-9/` (novo acervo de 12 fotos 16:9), `assets/Fotografias/editadas/` (excluída completamente), `index.html`, `sobre-nos.html`, `10-solucao-trepanacao-hot-tapping.html`, `12-solucao-consultoria-e-assessoria-tecnica.html`, `2-solucao-inspecao-em-obras-de-artes-especiais.html`, `3-solucao-ensaios-nao-destrutivos-ends.html`, `9-solucao-calibracao-de-instrumentos.html`, `componentes-cards-.html`, `identidade-visual.html`, `src/data/drive-assets.js`, `src/data/units.js`, `src/js/album.js`, `src/js/main.js`, `src/js/service-pages.js`, `src/js/solucoes-integridade.js`, `src/js/solucoes.js`, `src/css/brand-pages.css`, `tests/about-media.test.js`, `tests/service-visual-standard.test.js`, `.dockerignore`, `.superdesign/init/pages.md`, `MD/implementation_plan-SOBRE-NOS.md`, `MD/changelog.md`.

### Removed & Purged
- **Exclusão Completa da Pasta `assets/Fotografias/editadas`:**
  - Removidos física e definitivamente todos os 8 arquivos rejeitados (`operacional-alpinismo-industrial-escada-tanque-edit.webp`, `operacional-alpinismo-inspecao-vaso-pressao-edit.webp`, `operacional-discussao-engenheiros-tela-original.png`, `operacional-engenheiros-inspecao-bomba-edit.webp`, `operacional-inspecao-ultrassom-casco-estrutura-edit.webp`, `operacional-ultrassom-solda-tubulacao-edit-final.webp`, `ultrassom-raptor-scan-crawler-operacao-edit.webp`, `ultrassom-raptor-scan-tecnicos-reunidos-campo-edit.webp`).
  - Nenhuma referência restante no código fonte, HTML, JS, CSS, testes ou configurações.

### Added & Replaced
- **Adoção Exclusiva do Acervo `assets/Fotografias/originais-16-9` (12 Fotografias de Alta Resolução):**
  1. `endcontrol-inspecao-altura-nr35-escada-tanque-industrial.webp` (Trabalho em altura / NR-35 / Tanques industriais)
  2. `endcontrol-laboratorio-ensaio-dureza-digimess-certificacao-materiais.webp` (Ensaio de dureza Digimess / Laboratório / Certificação)
  3. `endcontrol-ensaios-nao-destrutivos-ultrassom-medicao-espessura-naval.webp` (Ultrassom / Medição de espessura / Setor naval e offshore)
  4. `endcontrol-integridade-estrutural-aquisicao-dados-planta-industrial.webp` (Engenharia de integridade / Diagnóstico e aquisição de dados)
  5. `endcontrol-ultrassom-phased-array-inspecao-solda-dutos-tubulacoes.webp` (Ultrassom Phased Array em junta soldada de dutos)
  6. `endcontrol-calibracao-medicao-vazao-ultrassonica-duto-industrial.webp` (Medição de vazão não intrusiva / Calibração em tubulação)
  7. `endcontrol-inspecao-integridade-dutos-adutoras-sensores-campo.webp` (Inspeção de integridade em linhas e adutoras / Sensores de campo)
  8. `endcontrol-calibracao-manometros-pressao-em-campo-nr13.webp` (Calibração de manômetros e instrumentos de pressão em campo NR-13)
  9. `endcontrol-engenharia-soldagem-qualificacao-soldadores-eps-rqps.webp` (Qualificação de soldadores / EPS / RQPS / Engenharia de soldagem)
  10. `endcontrol-institucional-lideranca-gestao-projetos-escritorio.webp` (Institucional / Liderança executiva / Gestão de projetos)
  11. `endcontrol-equipe-escritorio-projetos-mecanicos-engenharia.webp` (Escritório de projetos de engenharia / Equipe técnica)
  12. `endcontrol-consultoria-tecnica-demonstracao-scanner-ultrassom-tubos.webp` (Consultoria técnica / Demonstração de scanner de ultrassom)

### Tested & Validated
- 125/125 testes unitários e de integração (`tests/*.test.js`) aprovados com 100% de sucesso.
- Script de integridade estrutural (`site-integrity.ps1`) com status `PASS`.


- **Arquivos:** `sobre-nos.html`, `src/css/sobre-nos.css`, `MD/changelog.md`

### Cleaned & Refined
- **Seção Nosso Compromisso (`#compromisso` em `sobre-nos.html`):**
  - Removido completamente o bloco intermediário de valores/cards (Segurança, Confiabilidade, Eficiência, Sustentabilidade), alinhando 100% com o layout executivo (Print 1).
  - Mantidos exclusivamente a cápsula badge (`NOSSO COMPROMISSO`), a headline de impacto (`Excelência técnica começa com responsabilidade.`) e o botão de ação imediata (`Fale com nossos especialistas →`) sobre a foto técnica panorâmica.
  - 125/125 testes automatizados validados com 100% de aprovação.

## [2026-08-21] - Faixa de Indicadores Minimalista e Sóbria na Página Sobre Nós (100% Padrão Hero)

- **Arquivos:** `sobre-nos.html`, `MD/guia-identidade-endcontrol-antigravity.md`, `tests/about-eyebrow-color.test.js`, `MD/changelog.md`

### Enhanced & Standardized
- **Faixa de Indicadores de Autoridade (`.about-values-banner`) em `sobre-nos.html`:**
  - Removidos todos os ícones circulares, efeitos de blur, sombras neon e cores azul claro (#00C2FF).
  - Aplicado layout estritamente minimalista idêntico ao da Home (Anexo 1): fundo azul-marinho sólido (`#00215d`), números grandes no topo (`+18 anos`, `+300`, `+1.250`, `100%`, `+120`), legendas explicativas centralizadas abaixo e divisores verticais sutis.
  - Registrada regra de ouro no Guia de Identidade proibindo cores neon, blur e glow no projeto.
  - Testes automatizados (125/125) atualizados e validados com 100% de sucesso.

- **Arquivos:** `sobre-nos.html`, `src/css/sobre-nos.css`, `MD/changelog.md`

### Enhanced & Redesigned
- **Seção Como Trabalhamos (`#metodologia`):**
  - Removido fundo escuro/foto e aplicado visual corporativo minimalista com fundo branco puro (`#ffffff`), matriz técnica sutil de pontinhos à esquerda e arcos concêntricos à direita.
  - Pipeline de 4 etapas horizontais (Entendimento do desafio, Planejamento técnico, Execução em campo, Análise e resultado) conectados por setas minimalistas e ícones padronizados Lucide Icons.
  - Elevação frontal da seção com `z-index: 50 !important;` sobrepondo perfeitamente as seções adjacentes.
- **Seção Nosso Compromisso (`#compromisso`):**
  - Substituída a grade antiga de cards soltos por um card horizontal consolidado com fundo translúcido/branco, cantos arredondados (`20px`) e divisores verticais finos.
  - 4 pilares com ícones circulares no topo (Segurança, Confiabilidade, Eficiência e Sustentabilidade) centralizados acima dos títulos e descrições.
  - Botão de ação padronizado em Azul Marinho (`#00215D`): `Fale com nossos especialistas →` com ícone Lucide.
- **Padronização Global de Ícones (Lucide Icons):**
  - Todos os ícones das seções de Essência, Metodologia e Compromisso convertidos para o padrão oficial Lucide (`data-lucide`) com inicialização resiliente.
  - Testes automatizados (113/113) passando com 100% de sucesso.

## [2026-08-21] - Elevação Frontal da Seção Sobre Nós / Nossa História sobre a Próxima Seção (Home)

- **Arquivos:** `src/css/sections.css`, `MD/changelog.md`

### Enhanced & Layered
- **Camada Frontal da Seção `#sobre` (Sobre Nós / Nossa História):**
  - Ajustado `#sobre.about-premium-section` com `position: relative !important`, `z-index: 5 !important` e sombra de elevação (`box-shadow: 0 12px 30px rgba(7, 20, 41, 0.08) !important`).
  - Mantido `border-radius: 0 0 28px 28px !important` visível e sobreposto à seção subsequente (`#solucoes`), garantindo que o acabamento inferior arredondado da seção Sobre Nós fique em camada frontal sobre o topo da próxima seção.
  - Testes automatizados (106/106) e integridade do projeto validados com 100% de sucesso.

## [2026-08-21] - Consolidação da Página Sobre Nós e Remoção de Versão Temporária

- **Arquivos:** `sobre-nos.html`, `sobre-nos-2.html` (removido), `index.html`, páginas de soluções 1 a 12, `src/css/sobre-nos.css`, `MD/changelog.md`

### Changed & Consolidated
- **Unificação do Layout Oficial em `sobre-nos.html`:**
  - A página `sobre-nos.html` foi atualizada com a estrutura premium completa:
    1. Seção Sobre a EndControl / Nossa História (`#sobre` com player de vídeo HUD e banner de 5 indicadores de autoridade).
    2. Seção Nossa Identidade Corporativa (`#essencia` com fundo `#EFFAFF`, cápsula marinho e cards de Missão, Visão e Valores).
    3. Seção Como Trabalhamos (`#metodologia` com foto técnica panorâmica e 4 etapas sequenciais).
    4. Seção Nosso Compromisso (`#compromisso` com 4 pilares e botão CTA de contato).
  - Removido o arquivo temporário `sobre-nos-2.html`.
  - Limpos os links temporários de navegação "Sobre Nós 2" em todos os menus do site.
  - Testes automatizados (87/87) passando com 100% de conformidade.

## [2026-08-21] - Remoção Definitiva e Substituição de 4 Fotografias Operacionais/Laboratório

- **Arquivos:** `index.html`, `sobre-nos-2.html`, `12-solucao-consultoria-e-assessoria-tecnica.html`, `9-solucao-calibracao-de-instrumentos.html`, `2-solucao-inspecao-em-obras-de-artes-especiais.html`, `componentes-cards-.html`, `identidade-visual.html`, `src/data/units.js`, `src/js/album.js`, `src/js/main.js`, `src/js/solucoes.js`, `src/js/solucoes-integridade.js`, `MD/changelog.md`, `MD/features.md`

### Removed & Replaced
- **Exclusão Física e Descontinuação de 4 Imagens:**
  - `operacional-phased-array-chapas-soldadas-edit.webp`
  - `operacional-tecnico-refinaria-noite-edit.webp`
  - `operacional-discussao-engenheiros-tela-edit.webp`
  - `laboratorio-analise-placa-eletronica-edit.webp`
- **Substituições Contextuais Realizadas:**
  - Substituídas em todos os pontos por fotografias ativas e aprovadas: `operacional-inspecao-ultrassom-casco-estrutura-edit.webp`, `ultrassom-raptor-scan-crawler-operacao-edit.webp`, `ultrassom-raptor-scan-tecnicos-reunidos-campo-edit.webp`, `operacional-alpinismo-inspecao-vaso-pressao-edit.webp`, `operacional-engenheiros-inspecao-bomba-edit.webp` e `operacional-ultrassom-solda-tubulacao-edit-final.webp`.
  - Zero referências ou links quebrados remanescentes em código, estilos e scripts.

## [2026-08-21] - Remoção Completa da Seção Álbum de Fotos (S5) em Sobre Nós

- **Arquivos:** `sobre-nos.html`, `src/css/sobre-nos.css`, `src/js/sobre-nos.js`, `MD/changelog.md`, `MD/features.md`

### Removed & Cleaned
- **Remoção da Seção Álbum de Fotos (Galeria 3x3):**
  - Removido completamente o bloco `<section class="sn-gallery-section" id="fotos">` e todo o grid de fotos operacionais da página `sobre-nos.html`.
  - Removido o modal/overlay de Lightbox (`.sn-lightbox`) do HTML e suas respectivas regras de estilo de `src/css/sobre-nos.css`.
  - Removidos os scripts de controle de abertura, navegação anterior/próxima e fechamento por tecla ESC do lightbox em `src/js/sobre-nos.js`.
  - Ajustada a transição e sobreposição entre a seção anterior (*Como Trabalhamos*) e a seção seguinte (*Nosso Compromisso*), mantendo a elevação, raio de curvatura (`48px`) e fluxo contínuo.
  - Invalidação de cache aplicada com sucesso (`sobre-nos.css?v=126.0`, `sobre-nos.js?v=66.0`).


- **Arquivos:** `src/css/solucoes.css`, `src/js/solucoes.js`, `index.html`, `tests/site-integrity.ps1`, `MD/changelog.md`

### Enhanced
- **Fundo Branco e Alto Contraste na Seção Nossas Soluções (Radar Orbital):**
  - Fundo principal ajustado para `#ffffff` com grid técnico blueprint sutil.
  - Tipografia (títulos, descrições, métricas e cards) adaptada para cores escuras de alta legibilidade (`#071429` e `#475569`).
  - Anéis orbitais, feixe de varredura (sweep) e nós interativos recalibrados em tons de azul e ciano sobre fundo claro.
  - Invalidação de cache aplicada (`solucoes.css?v=58.0`).

## [2026-08-20] - Elevação Total da Camada (z-index: 25) e Sobreposição Frontal sobre Seção Anterior e Próxima (v=39.0)

- **Arquivos:** `index.html`, `src/css/sections.css`, `MD/changelog.md`

### Fixed & Enhanced
- **1. Elementos Decorativos de Fundo Blueprint e Radar (Anexos 2 e 3):**
  - Adicionado grid de pontos CAD / blueprint dot matrix (`.oportunidades-bg-pattern`) preenchendo o fundo claro sem sobrecarregar.
  - Implementado radar com círculos concêntricos técnicos e feixe cônico animado com rotação contínua (`.oportunidades-decor-radar.radar-top-right`) no canto superior direito.
  - Inserido sonar/radar em arcos concêntricos na lateral esquerda (`.radar-left`).
  - Adicionadas matrizes de crosshairs HUD (`+ + + +`) nos topos e rodapés internos (`.oportunidades-cross-grid`), idênticas ao mockup do Anexo 3.
  - Implementados corner brackets HUD (`┌ ┐ └ ┘`), linhas guia técnicas com nós luminosos em ciano neon e laser de varredura suave horizontal.
  - Removidas todas as escritas/tags de texto decorativas de fundo (`SYS.SEC...` e `GRID...`), mantendo o design 100% limpo, geométrico e visual.
- **2. Hierarquia de Camadas, Sombra de Elevação e Sobreposição Frontal Total (`z-index: 25 !important`):**
  - Configurado `z-index: 25 !important`, `position: relative !important`, `border-radius: 28px !important` e sombra de elevação profunda `box-shadow: 0 24px 60px rgba(7, 20, 41, 0.16) !important` na `#oportunidades` / `.oportunidades-section`.
  - Aplicadas margens negativas de sobreposição (`margin-top: -48px !important` e `margin-bottom: -48px !important`), garantindo que tanto o topo quanto o rodapé arredondado fiquem **completamente na frente** da seção anterior (`#segmentos-secao`) e da seção seguinte (`#faq-secao`).
  - Ajustado o padding da seção FAQ (`padding-top: 130px !important`) com `z-index: 1 !important` para passar 100% por baixo de Oportunidades.
- **3. Invalidação de Cache (`sections.css?v=39.0`):**
  - Atualizada a versão do stylesheet em `index.html` para atualização imediata.


## [2026-08-20] - Ajuste de Margem Direita (280px), Recuo Esquerdo Otimizado e Cache Invalidation v=112.0

- **Arquivos:** `src/css/sobre-nos.css`, `src/css/servico-integridade.css`, todas as 12 páginas de soluções, `sobre-nos.html`, `MD/changelog.md`, `MD/features.md`

### Fixed & Enhanced
- **1. Margem Direita Ampliada para 280px em Widescreen (1920px):**
  - Configurado padding lateral do container `.sn-process-widescreen-container` com `padding-right: 280px !important;` e `padding-left: 16px !important;`.
  - Respiro interno na trilha `.sn-process-track-zone` com `padding-right: 48px !important;`.
  - Ajustada a proporção de colunas para `14% Foto | 28% Texto | 58% Metodologia`, trazendo o texto ainda mais para a esquerda e garantindo respiro generoso e intocável de 280px na lateral direita.
  - Dimensionamento compacto e refinado dos círculos (92px em Full HD, 84px em 1600px, 78px em 1440px, 70px em 1280px).
- **2. Invalidação Total de Cache (`v=112.0`):**
  - Atualizadas as tags de link de estilos em 100% das páginas HTML para forçar o download instantâneo do novo CSS em todos os navegadores.
- **3. Elevação Visual e Camada Superior (`z-index: 20`):**
  - Mantida elevação de camada com sombra dupla e sobreposição frontal elegante sobre seções vizinhas.
- **4. Remoção Definitiva de CTAs residuais:**
  - Seção 100% limpa, focada em metodologia e sem botões de ação.

## [2026-08-20] - Calibração Ultra-Wide / 1920px de Margens e Espaçamento em Áreas de Atuação

- **Arquivos:** `src/css/segmentos.css`, `src/css/sections.css`, `index.html`, `MD/changelog.md`

### Fixed & Enhanced
- **1. Respiro Vertical e Margem Superior de Oportunidades (`#segmentos-secao` & `#oportunidades`):**
  - Aumentado o `padding-bottom` de `.segmentos-secao` para `170px` (desktop), `130px` (laptop/tablet 1024px), `110px` (tablet 860px) e `95px` (mobile).
  - Aumentado o `padding-top` de `#segmentos-secao + #oportunidades` para `130px` (desktop) e `95px` (mobile/tablet).
- **2. Margens Laterais e Largura Segura em Telas Ultra-Wide e 1920px:**
  - Configurada a largura do accordion como `width: min(1440px, calc(100% - 96px))` com `margin: 36px auto 0 auto;`, garantindo recuo lateral mínimo de 48px em qualquer tela e centralização com margens confortáveis de 240px em monitores 1920px.
  - Atualizada a versão dos estilos para `sections.css?v=36.0` e `segmentos.css?v=34.0` em `index.html`.

## [2026-08-20] - Auditoria Global do Site, Correção de Âncoras e Padronização do Rodapé

- **Arquivos:** `index.html`, `tests/site-full-audit.test.js`, `MD/changelog.md`, `MD/notion.md`

### Fixed & Enhanced
- **1. Correção de Âncora Global `#contato` e Endereço Oficial:**
  - Adicionado `id="contato"` ao rodapé de `index.html`, permitindo navegação fluida e direta a partir de qualquer página institucional.
  - Atualizado o endereço no rodapé de `index.html` para o padrão oficial da agência: `Av. Alcindo Cacela, 2120`, `Belém, Pará - Brasil` (eliminando texto temporário de placeholder).
- **2. Criação da Suíte de Testes de Auditoria Automatizada (`tests/site-full-audit.test.js`):**
  - Validação de integridade de 100% das 14 páginas HTML (Home, Sobre Nós e 12 Soluções).
  - Validação de presença e resolução de mais de 300 imagens locais, scripts e folhas de estilo.
  - Verificação de 100% das 73 âncoras e rotas internas do site com zero links quebrados.
  - Verificação rigorosa de metadados de SEO (Titles, Meta Descriptions, URLs Canônicas e OpenGraph tags).
  - Total de 50 testes automatizados 100% aprovados.

## [2026-08-20] - Criação e Integração Completa das Páginas de Soluções 5 a 12

- **Arquivos:** `5-solucao-gerenciamento-de-projetos.html`, `6-solucao-elaboracao-de-projetos-mecanicos.html`, `7-solucao-solucoes-tecnologicas-integradas.html`, `8-solucao-inspecao-e-adequacao-normativa.html`, `9-solucao-calibracao-de-instrumentos.html`, `10-solucao-trepanacao-hot-tapping.html`, `11-solucao-certificacao-de-materia-prima.html`, `12-solucao-consultoria-e-assessoria-tecnica.html`, `1-solucao-engenharia-de-integridade-estrutural.html`, `2-solucao-inspecao-em-obras-de-artes-especiais.html`, `3-solucao-ensaios-nao-destrutivos-ends.html`, `4-solucao-engenharia-de-soldagem.html`, `index.html`, `sobre-nos.html`, `MD/changelog.md`, `MD/notion.md`

### Added & Refined
- **1. Desenvolvimento das 8 Páginas Oficiais de Soluções:**
  - `5. Gerenciamento de Projetos`: Fiscalização, PMO, auditoria técnica e supervisão de obras.
  - `6. Elaboração de Projetos Mecânicos`: Modelagem 3D, cálculos estruturais e detalhamento executivo.
  - `7. Soluções Tecnológicas Integradas`: Automação, monitoramento contínuo e digitalização de ativos.
  - `8. Inspeção e Adequação Normativa`: NR-13, NR-12, NR-11, prontuários e inspeção de conformidade.
  - `9. Calibração de Instrumentos`: Rastreabilidade RBC/Inmetro e calibração de instrumentos de medição.
  - `10. Trepanação (Hot Tapping)`: Intervenção em tubulações e dutos sob carga e sem parada de linha.
  - `11. Certificação de Matéria-Prima`: Ensaios químicos, mecânicos, metalografia e validação de corrida.
  - `12. Consultoria e Assessoria Técnica`: Pareceres, perícias de falhas, arbitragens e laudos sêniores.
- **2. Integração Global de Navegação:**
  - Submenus de soluções sincronizados em 100% das páginas institucionais com rotas ativas.
- **3. Padronização Estrutural e Visual:**
  - Header Global Inox, Seção Sobre o Serviço, Accordion Quando Aplicar, Metodologia Como Trabalhamos, Escopo Técnico Bento Grid Master, Compromisso Institucional e Footer Minimal Glow.

## [2026-08-20] - Otimização e Eliminação de Fotos Duplicadas no Bento Grid de OAEs (Solução 2)

- **Arquivos:** `2-solucao-inspecao-em-obras-de-artes-especiais.html`, `MD/changelog.md`, `MD/notion.md`

### Fixed & Enhanced
- **1. Eliminação de Duplicidade Visual no Stack Vertical (Cards 3 e 4):**
  - O Card 3 (*Inspeção Rotineira*) agora é um card clean branco de alto contraste, com ícone de periodicidade e checklist limpo, eliminando o background repetido.
  - O Card 4 (*Inspeção Detalhada*) passa a utilizar a fotografia `obras_arte_especiais_02.webp` (engenheiro em plataforma suspensa acessando aparelho de apoio e pontos críticos em altura), dando sentido técnico direto ao escopo.
- **2. Correção de Imagens Incoerentes e Repetições:**
  - Card 9 (*Inspeção Estrutural Especializada*): utiliza `obras_arte_especiais_04.webp` (ensaios não destrutivos e ultrassom de campo em estruturas metálicas/pontes).
  - Card 10 (*Inspeção Subaquática*): removida a foto genérica de bomba de fábrica; transformado em card dark minimalista com ícone de radar/sonar subaquático e acabamento neon.
  - Card 14 (*Consultoria Técnica*): substituída a foto repetida por `ultrassom-raptor-scan-tecnicos-reunidos-campo-edit.webp` (equipe sênior em alinhamento técnico e consultoria).
  - Card 8 (*Inspeção Geométrica*): convertido em card dark clean com ícone 3D e foco em escaneamento laser e topografia.

## [2026-08-20] - Correção e Restauração de Proporção e Sticky no Painel Lateral Bento (`.ec-bento-sidebar`)

- **Arquivos:** `src/css/servico-integridade.css`, `1-solucao-engenharia-de-integridade-estrutural.html`, `2-solucao-inspecao-em-obras-de-artes-especiais.html`, `3-solucao-ensaios-nao-destrutivos-ends.html`, `4-solucao-engenharia-de-soldagem.html`

### Fixed
- **1. Eliminação do Esticamento Excessivo e Gaps Internos (`.ec-bento-sidebar`):**
  - Corrigido o `align-self: stretch` e `height: 100%` que forçavam a sidebar a esticar por toda a altura de 1400px das 4 linhas do Bento Grid.
  - Removido `justify-content: space-between` de `.ec-bento-sidebar-content`, eliminando vazios gigantes entre logotipo, eyebrow, headline, parágrafo e os 4 pilares.
  - Restaurado `position: sticky; top: clamp(80px, 9vh, 96px); align-self: start; height: auto;`, permitindo que o painel acompanhe suavemente a rolagem do usuário ao lado dos cards de escopo técnico.
  - Ajustado `align-items: flex-start` nos pilares de excelência para alinhamento harmônico entre ícones neon e textos descritivos.
  - Bump de versão de cache CSS para `v=96.0`.

## [2026-08-19] - Criação da Página da Solução 4 (Engenharia de Soldagem) e Integração Global

- **Arquivos:** `4-solucao-engenharia-de-soldagem.html`, `index.html`, `sobre-nos.html`, `1-solucao-engenharia-de-integridade-estrutural.html`, `2-solucao-inspecao-em-obras-de-artes-especiais.html`, `3-solucao-ensaios-nao-destrutivos-ends.html`, `src/js/solucoes.js`, `src/css/servico-integridade.css`

### Added & Refined
- **1. Página Oficial da Solução 4 (`4-solucao-engenharia-de-soldagem.html`):**
  - Desenvolvida a página institucional completa para o serviço **4. Engenharia de Soldagem**:
    - **Header Global & Topo Hero Inox:** Padrão com marca d'água 3D e navegação integrada.
    - **Sobre o Serviço:** Seção cyan com 2 fotos técnicas sobrepostas em moldura HUD, headline, texto oficial focado em qualificação de EPS, RQPS, PIT, IEIS e normas ASME/AWS/ISO, além do botão de contato direto via WhatsApp.
    - **Quando Aplicar:** Accordion interativo full-width com os 8 mecanismos e situações críticas em soldagem (Qualificação RQPS, Qualificação de Soldadores, Trincas e Descontinuidades, Reparos em Operação, Revestimentos/Cladding, Controle Térmico/PWHT, Auditorias/PIT e Continuidade Operacional).
    - **Como Trabalhamos:** Seção com arte técnica de supervisão e fluxo de 4 passos conectados (01 Elaboração EPS/PIT, 02 Qualificação RQPS, 03 Instrução IEIS, 04 Inspeção e Data Book Final).
    - **Escopo Técnico (Bento Grid Master):** Painel lateral dark com arte vetorial de tocha de soldagem/arco elétrico e os 4 pilares de excelência + grade elástica expansível com capacidades técnicas completas.
    - **Metodologia, Compromisso e Footer:** Seções padronizadas e footer minimalista com iluminação glow.
- **2. Integração Global nos Menus e Submenus de Soluções:**
  - Atualizados os menus de navegação em `index.html`, `sobre-nos.html`, `1-solucao...`, `2-solucao...`, `3-solucao...` e `src/js/solucoes.js` conectando o item "4. Engenharia de Soldagem" à nova página.
- **3. Refinamento de Proporções do Painel Lateral Bento (`.ec-bento-sidebar`):**
  - Ajustada a altura e distribuição vertical em `src/css/servico-integridade.css` para eliminar qualquer possibilidade de corte ou barra de rolagem interna, mantendo proporção harmônica e fluida em todas as resoluções.

## [2026-08-19] - Ajuste do Espaçamento Inferior da Seção Bento para 160px

- **Arquivo:** `src/css/servico-integridade.css`, páginas HTML

### Updated
- **1. Respiro Inferior Ampliado na Seção Bento Grid (`.svc-bento-section`):**
  - Ajustado `padding: 120px 0 160px 0;` (120px no topo e 160px na base) no desktop para garantir uma folga visual ampla e harmoniosa antes da transição da seção seguinte.
  - Bump de versão de estilos para `v=95.0`.

## [2026-08-19] - Remoção Definitiva de Scroll Interno no Painel Lateral Bento (`.ec-bento-sidebar`)

- **Arquivo:** `src/css/servico-integridade.css`, `componentes-cards-.html`, páginas de soluções HTML

### Fixed
- **1. Eliminação de Rolagem Interna e Altura Auto no Painel Lateral (`.ec-bento-sidebar`):**
  - Removidas restrições rígidas de altura (`calc(100vh - ...)`, `max-height: 94vh`, `min-height: 600px`), permitindo que o painel lateral ajuste sua altura naturalmente de acordo com o conteúdo completo.
  - Eliminado qualquer aparecimento de scrollbar interna e corte de textos (título, logotipo e pilares de excelência sempre 100% visíveis).
  - Mantido comportamento `position: sticky; top: clamp(80px, 9vh, 96px)` fluído e natural enquanto o usuário navega pelo grid de serviços.
  - Bump de versão de estilos para `v=95.0`.

## [2026-08-19] - Ajuste dos Espaçamentos Superior e Inferior da Seção Bento para 120px

- **Arquivo:** `src/css/servico-integridade.css`, páginas HTML

### Updated
- **1. Respiro Generoso na Seção Bento Grid (`.svc-bento-section`):**
  - Configurado `padding: 120px 0;` (superior e inferior) no desktop para garantir um enquadramento arejado e espaçamento equilibrado entre a seção escura de cima e a seção de metodologia de baixo.
  - Mantido `padding: 60px 0;` em telas mobile para preservar a densidade e usabilidade em telas compactas.
  - Bump de versão de estilos para `v=94.0`.

## [2026-08-19] - Aumento de Contraste e Legibilidade dos Badges de Categoria sobre Fotos

- **Arquivo:** `src/css/servico-integridade.css`, `componentes-cards-.html`, `3-solucao-ensaios-nao-destrutivos-ends.html`

### Fixed & Enhanced
- **1. Alta Legibilidade dos Badges sobre Fotografias Industriais (`.ec-card-badge`):**
  - **Cards Claros (Convencional):** Fundo em vidro branco fosco quase opaco (`background: rgba(255, 255, 255, 0.94)`), `backdrop-filter: blur(12px)`, sombra suave e texto em azul marinho escuro profundo (`#071e3d`) com micro-indicador azul `#0062e3`. Cria contraste nítido instantâneo mesmo sobre uniformes escuros ou peças de aço da foto de fundo.
  - **Cards Escuros (Avançado):** Fundo em vidro marinho profundo (`background: rgba(2, 16, 36, 0.88)`), borda ciano 40%, sombra e texto em ciano elétrico (`#00c2ff`) com micro-indicador brilhante.
  - Bump de versão de estilos para `v=93.0`.

## [2026-08-19] - Badges Discretos de Categoria e Diferenciação Visual nos Cards de ENDs (Página 3)

- **Arquivo:** `src/css/servico-integridade.css`, `3-solucao-ensaios-nao-destrutivos-ends.html`, `componentes-cards-.html`

### Added & Refined
- **1. Badges Discretos no Canto Superior Direito (`.ec-card-badge`):**
  - Adicionados micro-badges elegantes, sutis e minimalistas em formato pill no canto superior direito de cada card.
  - Tipografia compacta com `font-size: 10px`, `font-weight: 600` e cores suaves em cinza slate / cinza translúcido sem competir com o título ou checklist principal.
  - Safe zone com `padding-right` no cabeçalho dos cards evitando qualquer sobreposição visual.
- **2. Diferenciação Visual por Categorias em Ensaios Não Destrutivos (ENDs):**
  - **Ensaios Avançados (Cards Dark):** Phased Array & TOFD, Radiografia Digital, Réplicas Metalográficas, Ondas Guiadas & EMAT, Correntes Parasitas & ACFM, Emissão Acústica e Drones.
  - **Ensaios Convencionais (Cards White):** Inspeção Visual, Líquido Penetrante, Partículas Magnéticas, Ultrassom Convencional, Estanqueidade, Termografia e Laudos Normativos.
  - Bump de versão de estilos para `v=92.0`.

## [2026-08-19] - Expansão do Painel Lateral Bento para Ocupar a Altura do Viewport (~94-95vh)

- **Arquivo:** `src/css/servico-integridade.css`, `componentes-cards-.html`, páginas HTML

### Fixed & Refined
- **1. Ocupação Total da Altura do Viewport (`.ec-bento-sidebar`):**
  - Ajustada a altura do painel lateral para `height: calc(100vh - clamp(95px, 11vh, 120px))`, `max-height: 94vh` e `min-height: 600px`, fazendo o card preencher elegantemente quase toda a altura da tela (~94vh–95vh) enquanto permanece fixado (`position: sticky`) durante toda a rolagem do Bento Grid.
  - O container interno `.ec-bento-sidebar-content` agora utiliza `display: flex; flex-direction: column; justify-content: space-between; height: 100%`, distribuindo perfeitamente o cabeçalho institucional no topo e a lista dos 4 pilares na metade inferior sem sobrar espaços vazios ou parecer encolhido.
  - Bump de versão de estilos para `v=91.0`.

## [2026-08-19] - Destravamento de Sticky Scroll e Compactação Elegante do Painel Bento no Viewport

- **Arquivo:** `src/css/sobre-nos.css`, `src/css/base.css`, `src/css/servico-integridade.css`, `componentes-cards-.html`, páginas HTML

### Fixed & Refined
- **1. Destravamento do Scroll Context do `position: sticky`:**
  - Removido `overflow-x: hidden` de `.sn-page-wrapper` e `#sn-main-content` em `src/css/sobre-nos.css` e substituído por `overflow-x: clip` em `src/css/base.css`, eliminando o container de overflow falso que impedia o card de grudar durante o scroll da página.
- **2. Compactação Proporcional e Enquadramento Completo (`.ec-bento-sidebar`):**
  - Reduzidos os paddings, gaps e tamanhos tipográficos de forma perfeitamente harmoniosa, permitindo que todo o conteúdo (logo, headline, parágrafo e todos os 4 pilares) caiba com folga em qualquer altura de tela sem sobrar ou cortar no rodapé e sem gerar barras de rolagem internas.
  - Fixado em `position: sticky; top: 96px; align-self: start;`.
  - Bump de versão de estilos para `v=90.0`.

## [2026-08-19] - Ajuste do Canto Boleado Inferior na Seção 'Sobre o Serviço' em Soluções 2

- **Arquivo:** `src/css/servico-integridade.css`, `2-solucao-inspecao-em-obras-de-artes-especiais.html`

### Fixed & Refined
- **1. Acabamento Boleado Inferior na Seção Cyan (`.svc-solution-section--cyan`):**
  - Ajustado `border-radius: 48px !important` e `z-index: 10` na seção `#sobre-servico` para garantir que o seu fundo gradiente ciano tenha as curvas inferiores completamente visíveis e arredondadas (boleadas) sobre a seção seguinte.
  - Ajustada a transição da seção seguinte (`.sn-page-wrapper .segmentos-secao`) com `margin-top: -48px !important`, `padding-top: 110px !important` e remoção dos cantos arredondados superiores (`border-top-left-radius: 0 !important; border-top-right-radius: 0 !important`), eliminando o corte reto/recortes expostos e permitindo que o contorno curvo ciano se sobreponha suavemente ao fundo branco.
  - Sincronização e bump de versão de estilos para `v=89.1`.

## [2026-08-19] - Fix Sticky & Enquadramento 100vh do Painel Lateral do Bento Grid

- **Arquivo:** `src/css/servico-integridade.css`, `componentes-cards-.html`, `2-solucao-inspecao-em-obras-de-artes-especiais.html`, `3-solucao-ensaios-nao-destrutivos-ends.html`

### Added & Refined
- **1. Painel Lateral Sticky e Contido no Viewport (`.ec-bento-sidebar`):**
  - Ajustado `align-items: start` no container mestre `.bento-master-layout` para que o painel lateral não estique infinitamente acompanhando toda a altura das 4 linhas do Bento Grid.
  - Aplicado `position: sticky`, `top: clamp(80px, 10vh, 100px)` e `max-height: calc(100vh - clamp(95px, 12vh, 115px))` no card escuro para fixá-lo perfeitamente na tela durante a rolagem do usuário ao longo da seção e travar suavemente no rodapé da seção ao término.
  - Adicionado scrollbar discreto customizado no container interno `.ec-bento-sidebar-content` para telas com altura vertical reduzida, mantendo todos os 4 pilares e textos sempre acessíveis.
  - Atualizado `overflow-x: clip` na seção `.svc-bento-section` para destravar a rolagem vertical de elementos `position: sticky`.
  - Bump de cache das folhas de estilo para `v=89.0`.

## [2026-08-19] - Integração da Seção 4 (Expanding Bento Grid Master com Painel Lateral) em '2. Inspeção em Obras de Artes Especiais'

- **Arquivo:** `2-solucao-inspecao-em-obras-de-artes-especiais.html`, `src/css/servico-integridade.css`

### Added & Refined
- **1. Inserção da Composição Master na Página de Solução 2 (`2-solucao-inspecao-em-obras-de-artes-especiais.html`):**
  - Adicionada a nova seção `#escopo-tecnico` logo após *"Sobre o Serviço"* e antes de *"Como Trabalhamos"*.
  - **Sidebar Institucional 1:1:** Wireframe CAD da ponte estaiada com flare estelar, headline destacada e os 4 Pilares de Excelência.
  - **Mapeamento Contextual dos 14 Serviços Oficiais das Fotos:**
    - *Inspeção Cadastral e Rotineira (Normativa ABNT NBR)*
    - *Geotecnia e Fundações*
    - *Monitoramento Contínuo com Sensores e Automação*
    - *Inspeção Visual Detalhada com Cesto Elevatório e Andaimes*
    - *Análise Laboratorial (Carbonatação, Testemunhos, Cloretos, Metalografia)*
    - *Integridade Estrutural e Prova de Carga*
    - *Inspeção Geométrica com Drone e Laser 3D*
    - *Inspeção Especial com Topografia de Alta Precisão*
    - *Inspeção Extraordinária com Georadar (GPR)*
    - *Análise e Modelagem Numérica (MEF 3D)*
    - *Elaboração de Relatório Técnico (NBR 9452 e Custos)*
    - *Consultoria e Inspeção Subaquática (Mergulho e ROV)*
  - **Física Elástica Ativa:** Expansão dinâmica e empurrão dos vizinhos a 60/120 FPS.

- **Arquivo:** `componentes-cards-.html`

### Added & Refined
- **1. Eliminação de Truncamento de Textos (`componentes-cards-.html`):**
  - **Remoção de `white-space: nowrap`:** Eliminada a regra restritiva que forçava títulos longos em linha única mesmo quando a coluna estava em estado de repouso comprimido.
  - **Tipografia Fluida com `clamp()` e `overflow-wrap`:** Aplicado `word-break: normal; overflow-wrap: break-word; min-width: 0; font-size: clamp(14px, 1.05vw, 18px)` nos títulos e `clamp(11.5px, 0.82vw, 13.5px)` no checklist.
  - **Resultado:** O título *"Materiais e durabilidade"* e todos os testes laboratoriais agora são exibidos 100% legíveis e completos, sem nenhum corte ou elipse em qualquer resolução de tela.

## [2026-08-19] - Customização Contextual da Seção "Como Trabalhamos" por Serviço (Fotos & Metodologias Exclusivas)

- **Arquivos:** `1-solucao-engenharia-de-integridade-estrutural.html`, `2-solucao-inspecao-em-obras-de-artes-especiais.html`, `3-solucao-ensaios-nao-destrutivos-ends.html`

### Changed & Refined
- **1. Serviço 01 — Engenharia de Integridade Estrutural (`1-solucao-engenharia-de-integridade-estrutural.html`):**
  - **Fotografia Específica:** Aplicada foto técnica real de campo `analise-ultrassom-a-scan-perfil-espessura-viga-metalica.webp`.
  - **Eyebrow, Headline & Descrição:** Adaptados para a metodologia Fitness-For-Service (FFS) e normas internacionais (API 579 / ASME FFS-1).
  - **4 Etapas Conectadas:**
    - `01. Mapeamento de Danos` — Levantamento de corrosão, espessuras e deformações.
    - `02. Caracterização de Mecanismos` — Identificação dos modos de degradação e histórico.
    - `03. Modelagem e Cálculo FFS` — Simulações analíticas e computacionais de tensões.
    - `04. Laudo e Vida Residual` — Parecer conclusivo, limites operacionais e plano mitigatório.

- **2. Serviço 02 — Inspeção em Obras de Artes Especiais (`2-solucao-inspecao-em-obras-de-artes-especiais.html`):**
  - **Fotografia Específica:** Substituída a foto genérica institucional pela foto técnica `obras_arte_especiais_03.webp` (topógrafo/engenheiro inspecionando ponte).
  - **Eyebrow, Headline & Descrição:** Focados em conformidade com a ABNT NBR 9452 para pontes, viadutos, passarelas e túneis.
  - **4 Etapas Conectadas:**
    - `01. Levantamento Cadastral` — Histórico estrutural, geometria e acesso.
    - `02. Inspeção e Ensaios em Campo` — Investigação minuciosa de patologias e apoios.
    - `03. Diagnóstico e Classificação NBR` — Classificação do estado da obra segundo a NBR 9452.
    - `04. Relatório Técnico e Recomendações` — Laudo conclusivo e plano de intervenção.

- **3. Serviço 03 — Ensaios Não Destrutivos (`3-solucao-ensaios-nao-destrutivos-ends.html`):**
  - **Fotografia Específica:** Substituída a foto genérica pela foto operacional `ensaios_nao_destrutivos_04.webp`.
  - **Eyebrow, Headline & Descrição:** Focados na detecção de descontinuidades sem dano aos componentes e calibração de instrumentos.
  - **4 Etapas Conectadas:**
    - `01. Avaliação do Ativo e Criticidade` — Análise de geometria, soldas e esforço operacional.
    - `02. Seleção do Método e Procedimento` — Escolha técnica (US, LP, PM, RI, EV) conforme normas ASME/AWS/ISO.
    - `03. Execução Técnica em Campo` — Aplicação por inspetores qualificados com instrumentos calibrados.
    - `04. Laudo Técnico e Rastreabilidade` — Laudo detalhado com dimensionamento de descontinuidades.

- **4. Preservação Total de Layout:** Mantidos 100% intactos o layout panorâmico widescreen de 3 zonas, conectores SVG, grids responsivas e estilos CSS.

- **Arquivo:** `componentes-cards-.html`

### Added & Refined
- **1. Refinamento de Fidelidade da Sidebar Institucional (`componentes-cards-.html`):**
  - **Arte Vetorial Integrada da Ponte Estaiada:** Renderização de modelo vetorial CAD com mastro, vigas transversais, treliça em X, cabos estaiados radiantes e flare luminoso estelar no topo do pilar.
  - **Filtro de Iluminação & Flare:** Efeito de glow estelar com `feGaussianBlur` e halos concêntricos ciano e branco puro.
  - **Ambient Glow Neon:** Halo difuso ciano no canto inferior esquerdo (`rgba(0, 194, 255, 0.28)`) trazendo profundidade atmosférica.
  - **Badges Circulares Neon 1:1:** Ícones circulares com anel de vidro ciano, fundo navy translúcido e tipografia perfeitamente ajustada aos 4 pilares.

- **Arquivo:** `componentes-cards-.html`

### Added & Refined
- **1. Seção 4: Composição Master com Painel Lateral Institucional (`componentes-cards-.html`):**
  - **Coluna da Esquerda (`ec-bento-sidebar`):**
    - Logo oficial negativo da ENDCONTROL.
    - Eyebrow tag neon: `INSPEÇÕES ESPECIALIZADAS`.
    - Headline com destaque ciano: *"Escopo técnico completo para pontes, viadutos e estruturas críticas."*
    - Divisor ciano e parágrafo institucional.
    - 4 Pilares de Excelência em lista vertical com ícones circulares neon (`Segurança em primeiro lugar`, `Dados que geram confiança`, `Tecnologia e experiência`, `Compromisso com resultados`).
    - Marca d'água técnica de blueprint no fundo inferior.
  - **Coluna da Direita (`bento-expanding-wrapper`):**
    - O mosaico de 13 capacidades técnicas completas integradas com física autêntica de expansão/empurrão em tempo real.
  - **Responsividade Master:** 2 colunas em desktop, empilhamento perfeito com fluidez touch em tablets e smartphones.

- **Arquivo:** `componentes-cards-.html`

### Added & Refined
- **1. Mecânica Real de Expansão e Deslocamento Elástico (`componentes-cards-.html`):**
  - **Expansão Dinâmica por `flex-grow`:** Ao passar o mouse sobre qualquer card, sua largura física é ampliada em tempo real (ex: de `flex: 1` para `flex: 2.4` ou de `flex: 5` para `flex: 7.2`).
  - **Deslocamento / Empurrão dos Vizinhos:** Os cards vizinhos na mesma linha são fisicamente empurrados e contraem sua largura (ex: para `flex: 0.65` ou `flex: 1.8`) para acomodar o card ativo.
  - **Stack Vertical Independente:** Dentro da coluna de Geotecnia e Monitoramento, o card focado também expande sua altura interna vertical (`flex: 1.45`), comprimindo o irmão (`flex: 0.7`).
  - **Física de Mola Suave e Contínua:** Transições com `cubic-bezier(0.25, 1, 0.35, 1)` a 60/120 FPS em aceleração de hardware.
  - **Degradação Elegante em Mobile:** Em telas touch/mobile, o layout se adapta a colunas independentes sem sobreposições ou distorções.

- **Arquivo:** `componentes-cards-.html`

### Added & Refined
- **1. Sistema de Expansão e Contração Adaptativa (`componentes-cards-.html`):**
  - **Card em Hover (Expansão Fluida):** Ganha elevação `translateY(-7px)` e escala ampliada proporcionalmente (`1.06` para pequenos, `1.045` para médios e `1.025` para hero), alcançando `z-index: 30`, halo neon ciano e brilho calibrado.
  - **Cards Vizinhos (Contração Elástica):** Ao focar em qualquer card, todos os demais cards sofrem uma contração suave e coordenada (`transform: scale(0.965); opacity: 0.68; filter: saturate(0.85)`), criando espaço visual imediato para o card em destaque.
  - **Aceleração por Hardware GPU:** Aplicação de `will-change: transform, box-shadow, opacity, filter` e `backface-visibility: hidden` para atingir 60/120 fps constantes em monitores de alta taxa de atualização com curva spring `cubic-bezier(0.25, 1, 0.35, 1)`.

- **Arquivo:** `componentes-cards-.html`

### Added & Refined
- **1. Arquitetura em CSS Grid de 12 Colunas (`componentes-cards-.html`):**
  - Implementada a composição assimétrica de 12 colunas com `grid-auto-flow: dense`, `gap: clamp(8px, 1vw, 14px)` e `max-width: 1440px`.
  - **Mapeamento Preciso dos 13 Cards (Zero Espaços Vazios):**
    - `Hero Destaque:` `grid-column: span 5; grid-row: span 2; aspect-ratio: 1.25 / 1;` (Colunas 1 a 5, Linhas 1 a 2).
    - `Ensaios Não Destrutivos:` `grid-column: span 3; grid-row: span 2;` (Colunas 6 a 8, Linhas 1 a 2).
    - `Geotecnia:` `grid-column: span 4; grid-row: span 1;` (Colunas 9 a 12, Linha 1).
    - `Monitoramento Estrutural:` `grid-column: span 4; grid-row: span 1;` (Colunas 9 a 12, Linha 2).
    - `Inspeção Visual:` `grid-column: span 3;` (Colunas 1 a 3, Linha 3).
    - `Materiais e Durabilidade:` `grid-column: span 3;` (Colunas 4 a 6, Linha 3).
    - `Integridade Estrutural:` `grid-column: span 3;` (Colunas 7 a 9, Linha 3).
    - `Geometria (Drone):` `grid-column: span 3; grid-row: span 2; aspect-ratio: 0.72 / 1;` (Colunas 10 a 12, Linhas 3 a 4).
    - `Topografia:` `grid-column: span 3;` (Colunas 1 a 3, Linha 4).
    - `GPR:` `grid-column: span 3;` (Colunas 4 a 6, Linha 4).
    - `Análise Estrutural:` `grid-column: span 3;` (Colunas 7 a 9, Linha 4).
    - `Documentação e Gestão:` `grid-column: span 6;` (Colunas 1 a 6, Linha 5).
    - `Consultoria Técnica:` `grid-column: span 6;` (Colunas 7 a 12, Linha 5).
  - **Micro-Interações e Hover Expansível Escalado:**
    - `.card--small:hover`: `translateY(-4px) scale(1.038)`.
    - `.card--medium:hover`: `translateY(-4px) scale(1.025)`.
    - `.card--large:hover`: `translateY(-3px) scale(1.015)`.
    - Suavização dos cards vizinhos com `:has()`, micro-zoom na imagem de fundo (`scale(1.035)`) e rotação sutil de ícones.
  - **Totalmente Responsivo:** Grid de 6 colunas no tablet (`768px - 1100px`) e grid de 2/1 colunas no mobile com tratamento rigoroso de touch (`@media (hover: hover)` e `@media (prefers-reduced-motion)`).

- **Arquivo:** `componentes-cards-.html`

### Added & Refined
- **1. Fidelidade Visual 1:1 (`componentes-cards-.html`):**
  - O mosaico Bento Grid agora flutua diretamente sobre o fundo suave ciano/ice blue (`#dceef5`), eliminando a caixa preta externa anterior e reproduzindo com exatidão a estética da referência.
  - **Reutilização e Proporções dos 13 Cards:**
    1. *Hero (Ponte Estaiada à Noite):* Destaque com gradiente ascendente, tag ciano neon e headline em 2 linhas.
    2. *Ensaios Não Destrutivos:* Card branco sem foto com 5 itens de checklist.
    3. *Geotecnia (Top) + Monitoramento Estrutural (Bottom):* Stack na coluna 4 com fotos integradas à direita e transição de degradê sem emendas.
    4. *Inspeção Visual:* Card vertical com foto de plataforma elevatória na base e fusão vertical suave.
    5. *Materiais e Durabilidade:* Card Dark Navy com ícone de balão de ensaio e 4 testes laboratoriais.
    6. *Integridade Estrutural:* Card branco sem foto com prova de carga e ensaio dinâmico.
    7. *Geometria (Drone):* Card vertical Dark alto (2 linhas) com cabeçalho no topo e foto de drone sob o pilar.
    8. *Topografia & GPR:* Cards Dark com fotos operacionais à direita.
    9. *Análise Estrutural:* Render isométrico MEF 3D colorido com gradiente de tensões.
    10. *Documentação e Gestão:* Card branco largo (2 colunas) com plantas e relatórios.
    11. *Consultoria Técnica:* Card Dark largo (2 colunas) com engenheiros consultores em campo.
  - Tipografia calibrada com `DM Sans` para títulos e `Inter` para checklists, ícones circulares com halos suaves e transições fluidas no hover.

- **Arquivo:** `componentes-cards-.html`

### Added & Refined
- **1. Remoção de Bordas Duras (`componentes-cards-.html`):**
  - Removidas todas as bordas (`border: none`) dos cards Dark e White (`.ec-card-dark`, `.ec-card-white`), criando uma integração visual 100% limpa, contínua e moderna.
  - O relevo e a profundidade agora são definidos exclusivamente por sombras suaves (`box-shadow: 0 6px 22px rgba(...)`) e realce luminoso no hover, exatamente como na referência visual.

- **Arquivo:** `componentes-cards-.html`

### Added & Refined
- **1. Reutilização Modular Estrita no Bento Grid (`componentes-cards-.html`):**
  - O mosaico Bento Grid de 13 serviços foi totalmente reconstruído reutilizando diretamente as classes e estrutura HTML dos **4 componentes oficiais** criados (`.ec-card-dark`, `.ec-card-white`, `.ec-card-*-overlay--horizontal`, `.ec-card-*-overlay--vertical`, `.ec-card-*-overlay--hero`, `.ec-card-*-content`, `.ec-card-*-head-row`, `.ec-card-*-icon-wrapper`, `.ec-card-*-checklist`).
  - **Grid 4 Colunas Fluida & Dinâmica:**
    - *Card 1 (Span 2):* Componente **Foto Cheia Hero** (`Avaliação completa. Tecnologia, método e especialistas...`).
    - *Card 2 (Col 3):* Componente **Sem Foto White** (`Ensaios não destrutivos` - 5 itens).
    - *Cards 3 e 4 (Stack Col 4):* Componentes **Horizontal White** compactos (`Geotecnia` e `Monitoramento estrutural`).
    - *Card 5 (Col 1):* Componente **Vertical White** (`Inspeção visual` com foto na base).
    - *Card 6 (Col 2):* Componente **Sem Foto Dark** (`Materiais e durabilidade`).
    - *Card 7 (Col 3):* Componente **Sem Foto White** (`Integridade estrutural`).
    - *Card 8 (Col 4 - Span 2 Linhas):* Componente **Vertical Dark** alto (`Geometria` com foto do drone).
    - *Cards 9 e 10 (Col 1 e 2):* Componentes **Horizontal Dark** (`Topografia` e `GPR`).
    - *Card 11 (Col 3):* Componente **Vertical White** (`Análise estrutural` com gráfico MEF 3D).
    - *Cards 12 e 13 (Span 2 cada):* Componentes **Horizontal Largo White & Dark** (`Documentação e gestão` e `Consultoria técnica`).
  - **Efeito Spotlight e Expansão:** Transições suaves com física de mola (`cubic-bezier(0.2, 0.8, 0.2, 1)`), elevação e iluminação de borda neon cyan.

- **Arquivo:** `componentes-cards-.html`

### Added & Refined
- **1. Seção 3: Expanding Dynamic Bento Grid (`componentes-cards-.html`):**
  - Implementada a composição completa e fluida das **13 capacidades técnicas e serviços** baseada no layout Bento/Masonry oficial.
  - **Efeito Spotlight e Expansão:** Foco interativo com elevação suave (`transform: translateY(-4px) scale(1.018)`), halo luminoso neon cyan e suavização dos cards secundários no hover do mosaico.
  - **13 Cards Integrados:**
    1. *Ponte Hero Destaque:* Avaliação completa em grande formato.
    2. *Ensaios Não Destrutivos:* Lista técnica de 5 métodos com ícone 3D.
    3. *Geotecnia:* Split horizontal com foto de sondagem em campo.
    4. *Monitoramento Estrutural:* Split horizontal com instrumentação e sensores.
    5. *Inspeção Visual:* Card com foto em base do cesto aéreo.
    6. *Materiais e Durabilidade:* Card Dark Navy com 4 testes laboratoriais.
    7. *Integridade Estrutural:* Prova de Carga e Ensaio Dinâmico.
    8. *Geometria (Drone):* Card vertical de 2 linhas com fotografia de drone sob o pilar da ponte.
    9. *Topografia:* Card Dark com estação total em campo.
    10. *GPR:* Card Dark com carrinho de Georadar em pavimento.
    11. *Análise Estrutural:* Card com gráfico isométrico MEF 3D de elementos finitos.
    12. *Documentação e Gestão:* Split largo com relatórios e laptop.
    13. *Consultoria Técnica:* Card Dark largo com parecer técnico e engenheiros consultores.
  - Grade 100% responsiva (4 colunas no Desktop, 3/2 colunas no Tablet, 1 coluna no Mobile).

- **Arquivo:** `componentes-cards-.html`

### Added & Refined
- **1. Catálogo com 4 Tipologias de Cards (`componentes-cards-.html`):**
  - **Tipo 1 (Horizontal):** Layout com fusão horizontal (`to right`), textos à esquerda e foto à direita (`operacional-discussao-engenheiros-tela-edit.webp`).
  - **Tipo 2 (Vertical):** Layout com fusão vertical (`to bottom`), cabeçalho e checklist no topo e foto em evidência na base inferior (`obras_arte_especiais_02.webp` - Drone / Geometria).
  - **Tipo 3 (Sem Foto / Clean):** Layout liso sem fotografia, ícone 3D Cube no topo, título e lista técnica expandida de 5 itens (Ultrassom, LP, PM, CP, Impact-Echo).
  - **Tipo 4 (Foto Cheia / Hero Destaque):** Layout full-photo (`obras_arte_especiais_03.webp`), degradê ascendente na base com Tag em destaque (`Avaliação completa.`) e Headline de impacto (`Tecnologia, método e especialistas em cada detalhe.`).
  - **Seção 1 (Cards Dark):** Os 4 modelos no tema escuro navy (`#071429`) com nós neon cyan (`#00c2ff`).
  - **Seção 2 (Cards White):** Os 4 modelos no tema claro (`#ffffff`) com nós azuis (`#0077ff`) e marcadores ciano.

- **Arquivo:** `componentes-cards-.html`

### Added & Refined
- **1. Tríade de Padrões de Cards (`componentes-cards-.html`):**
  - **Card 1 (Horizontal):** Layout com fusão de degradê horizontal (`to right`), textos e checklist organizados à esquerda e fotografia técnica à direita (`operacional-discussao-engenheiros-tela-edit.webp`).
  - **Card 2 (Vertical):** Layout com fusão vertical (`to bottom`), cabeçalho e checklist no topo e foto em evidência na base inferior (`obras_arte_especiais_02.webp` - Drone / Geometria).
  - **Card 3 (Sem Foto / Clean):** Layout liso sem imagem de fundo, ícone 3D Cube no topo, título e lista técnica expandida de 5 métodos de Ensaios Não Destrutivos (Ultrassom, LP, PM, CP, Impact-Echo).
  - **Seção 1 (Cards Dark):** Versão completa dos 3 cards no tema escuro navy (`#071429`) com nós neon cyan (`#00c2ff`).
  - **Seção 2 (Cards White):** Versão completa dos 3 cards no tema claro (`#ffffff`) com nós azuis (`#0077ff`) e marcadores ciano.

- **Arquivo Criado:** `componentes-cards-.html`

### Added & Refined
- **1. Biblioteca Modular de Cards (`componentes-cards-.html`):**
  - **Card Horizontal (Esquerda):** Layout com fusão horizontal (`linear-gradient(to right, ...)`), textos e checklist organizados à esquerda e fotografia de discussão técnica na tela (`operacional-discussao-engenheiros-tela-edit.webp`) posicionada à direita.
  - **Card Vertical (Direita):** Layout com fusão vertical de cima para baixo (`linear-gradient(to bottom, ...)`), cabeçalho alinhado horizontalmente no topo (ícone badge + título `Geometria`) e checklist logo abaixo, com fotografia do drone (`obras_arte_especiais_02.webp`) em evidência na base inferior.
  - **Seção 1 (Cards Dark):** Versão com fundo navy (`#071429`), nós neon cyan (`#00c2ff`) e tipografia clara.
  - **Seção 2 (Cards White):** Versão clara com fundo branco puro (`#ffffff`), nós azuis (`#0077ff`), tipografia em dark navy (`#071429`) e marcadores ciano.
  - Design 100% responsivo, limpo e sem botões redundantes, pronto para reutilização na criação de novas seções.

- **Commit:** `81b1a9d`

### Added & Refined
- **1. Gerenciamento Centralizado de Pausa e Retomada (`src/js/solucoes.js`, `tests/radar-progress.test.js`):**
  - **Hover no Card e nos Nós do Radar:** Ao passar o mouse sobre o card de destaque (`highlightCard`) ou nós do radar, o autoplay pausa instantaneamente. Ao retirar o mouse, aguarda exatamente **2 segundos** (`hoverResumeDelay: 2000`) antes de retomar o ciclo normal.
  - **Interação / Clique Intencional:** Ao clicar em qualquer nó do radar, setas de navegação (anterior/próximo), pontos de paginação ou links de serviço, o autoplay pausa com janela de espera de **10 segundos** (`manualResumeDelay: 10000`).
  - **Prioridade Estrita de Estados:** A pausa por clique (10s) tem prioridade total sobre o hover simples (2s). Se o usuário clica e retira o mouse, o slider só retoma após completar os 10s da interação. Se o usuário re-hoverar durante a contagem regressiva de 2s ou 10s, o timer é imediatamente cancelado até que o mouse saia novamente.
  - **Prevenção de Conflitos e Múltiplos Timers:** Unificado o controle de timers (`resumeTimer`, `cycleTimer`, `isHovered`, `manualPauseUntil`), impedindo duplicação de autoplays e garantindo transições suaves.
  - Suíte de 43 testes unitários 100% aprovada.

### Fixed & Refined
- **1. Reposicionamento dos Rótulos dos Nós 6 e 8 (`src/js/radar-progress.js`, `src/css/solucoes.css`, `tests/radar-progress.test.js`):**
  - **Ícone 6 (Elaboração de Projetos Mecânicos - 210° / 10h no anel externo):** Texto movido do lado direito para a **esquerda** do ícone (`label-pos-left`), desobstruindo a geometria interna do radar.
  - **Ícone 8 (Inspeção e Adequação Normativa - 0° / 3h no anel interno):** Texto movido do lado esquerdo para a **direita** do ícone (`label-pos-right`), aproveitando o espaço externo à direita do anel interno.
  - Adicionada regra CSS de espaçamento simétrico `.service-node.label-ring-inner.label-pos-right .service-node-label { left: calc(100% + 9px); }`.
  - Atualizados os testes unitários em `tests/radar-progress.test.js` e as versões de cache buster nos scripts.

## [2026-08-19] - Correção do Feixe do Radar na Inicialização e Refresh (F5)

### Fixed & Refined
- **1. Raio Seguro Inicial do Feixe (`index.html`, `src/css/solucoes.css`, `src/js/solucoes.js`):**
  - Corrigido o estado inicial do feixe do radar no carregamento da página e F5: o feixe agora inicia imediatamente no comprimento seguro (`--sweep-radius-initial: 29.2%`), terminando no ponto ciano logo abaixo do título *1. Engenharia de Integridade Estrutural*, sem atravessar o texto ou o ícone superior (conforme Print 2).
  - Substituído o fallback do CSS `.radar-sweep` de `--r-outer` (49.5% / borda externa total) para `--sweep-radius-initial: 29.2%`.
  - Definido estilo inline inicial em `#radarSweep` no HTML para evitar qualquer transição ou flash de layout antes da execução do JavaScript.
  - Adicionadas travas e proteção estrita de limites geométricos no `solucoes.js` para o Item 0 (12:00), garantindo posicionamento perfeito em todas as resoluções e atualizados os testes automatizados em `tests/radar-progress.test.js`.

## [2026-08-19] - Cálculo Dinâmico de Raio Seguro do Feixe do Radar e Refinamento de Quadrantes

- **Commit:** `38824d6`

### Added & Refined
- **1. Cálculo Dinâmico de Raio Seguro do Feixe (`src/js/radar-progress.js`, `src/js/solucoes.js`, `src/css/solucoes.css`):**
  - Implementadas as funções `getDistanceToRect` e `getSafeSweepRadius` para calcular geometricamente a distância euclidiana exata entre o centro do radar e a caixa delimitadora do ícone e label do nó ativo.
  - O feixe laser de varredura agora termina com recuo seguro e margem de respiro (`safetyGap: 16px`), evitando sobreposição ou avanço indesejado sobre o ícone e rótulo do serviço selecionado.
  - Adicionada medição e atribuição dinâmica via CSS custom property `--sweep-radius` em tempo real nas mudanças de serviço, autoplay, redimensionamento (`ResizeObserver`) e carregamento de fontes (`document.fonts.ready`).
- **2. Refinamento de Posicionamento por Quadrantes e Testes:**
  - Ajustadas regras de alinhamento para ângulos de 180° e 210°.
  - Criados testes unitários dedicados em `tests/radar-progress.test.js` para `getDistanceToRect` e `getSafeSweepRadius`. Suíte de 20 testes 100% aprovada.

## [2026-08-18] - Padronização Oficial da Hierarquia da Seção Sobre o Serviço (Soluções 1, 2 e 3)

- **Commit:** `250039c`
- **Deploy:** Concluído com sucesso na VPS (`https://endcontrol.suporteide.digital/`)

### Fixed & Refined
- **1. Padronização da Hierarquia Visual e Textual da Seção Sobre o Serviço:**
  - Implementado o padrão oficial em todas as páginas de serviços:
    - **Eyebrow / Tag:** `SOBRE O SERVIÇO`
    - **Headline (H1):** Nome oficial do serviço (`Engenharia de Integridade Estrutural`, `Inspeção em Obras de Artes Especiais`, `Ensaios Não Destrutivos (ENDs)`)
    - **Mini Título / Subtítulo:** Frase técnica de destaque (`p.svc-solution-subtitle`)
    - **Texto Corrido / Parágrafos:** Detalhamento técnico oficial com termos destacados
  - Atualizada a página `2-solucao-inspecao-em-obras-de-artes-especiais.html` com o título exato, subtítulo, texto descritivo oficial e fotografias reais da pasta `02 - Inspeção em Obras de Artes Especiais` (`obras_arte_especiais_01.webp` e `obras_arte_especiais_02.webp`).
  - Atualizada a página `3-solucao-ensaios-nao-destrutivos-ends.html` para seguir estritamente o mesmo padrão estrutural.
  - Atualizada a estilização de subtítulo e espaçamento em `src/css/servico-integridade.css` e bump de cache para `v=86.0`.

## [2026-08-18] - Remoção e Substituição da Imagem Phased Array Chapas Soldadas

### Removed & Replaced
- **1. Exclusão e Substituição de Imagem Operacional (`operacional-phased-array-chapas-soldadas-edit.webp`):**
  - Removido o arquivo físico de imagem `assets/Fotografias/editadas/operacional-phased-array-chapas-soldadas-edit.webp`.
  - Substituídas todas as suas ocorrências no código:
    - `index.html`: Hero slider atualizado com `operacional-ultrassom-solda-tubulacao-edit-final.webp`.
    - `sobre-nos.html`: Card 4 da galeria atualizado com `operacional-alpinismo-industrial-escada-tanque-edit.webp`.
    - `src/data/units.js`: Base Paragominas/Carajás atualizada com `operacional-alpinismo-industrial-escada-tanque-edit.webp`.
    - `src/js/album.js`: Inspeção de Vasos sob Pressão atualizada com `operacional-alpinismo-industrial-escada-tanque-edit.webp`.
    - `src/js/main.js`: Trajetória / Linha do tempo (ano 2017) atualizada com `ultrassom-raptor-scan-tecnicos-reunidos-campo-edit.webp`.
    - `src/js/solucoes-integridade.js`: Mecanismo Trincas e Indicadores atualizado com `ensaio-ultrassom-solda-coluna-estrutura-metalica.webp`.
    - `src/js/solucoes.js`: Serviço de Engenharia de Soldagem atualizado com `ensaio-ultrassom-solda-coluna-estrutura-metalica.webp`.
    - `MD/implementation_plan-SOBRE-NOS.md`: Referência documental atualizada.

## [2026-08-18] - Padronização da Altura do Banner de Topo (Hero) na Solução 3

### Fixed & Refined
- **1. Padronização da Altura do Hero na Página 3 (`3-solucao-ensaios-nao-destrutivos-ends.html`):**
  - Ajustado o versionamento dos stylesheets para `v=85.0` garantindo a correta aplicação da regra `.sn-page-wrapper .sn-hero-section { margin-top: -80px; }` definida em `src/css/servico-integridade.css`.
  - A altura do banner hero inox escovado agora fica idêntica e compacta como nas páginas de Solução 1 e 2, eliminando o espaçamento vertical excessivo.
  - Atualizados os cabeçalhos de cache em `1-solucao...` e `2-solucao...` para `v=85.0`.

## [2026-08-18] - Otimização Global e Padronização de Imagens dos 12 Serviços (Banco de Imagens)

### Changed & Optimized
- **1. Compressão em Lote e Isolamento de Originais em `bckp/originais/` (Todas as 12 Pastas):**
  - Isoladas e organizadas todas as **83 fotografias originais em alta resolução** na pasta dedicada [`bckp/originais/`](file:///g:/Meu%20Drive/.PROJETOS/Sites%20Institucionais/site-end-controll/bckp/originais) com subpastas por serviço (totalizando **156,54 MB**).
  - Adicionado `bckp/` ao `.gitignore` para manter o repositório git leve e limpo.
  - Convertidas e comprimidas todas as fotos para o padrão moderno de alta fidelidade **WebP (qualidade 85)** na raiz de cada pasta em `assets/Fotografias/Serviços - Banco de Imagens/` (totalizando apenas **12,75 MB**).
  - **Redução global de 91,9% (economia de 143,79 MB)** no diretório de assets públicos do site.
  - Atualizadas as referências de imagem em `3-solucao-ensaios-nao-destrutivos-ends.html`.

## [2026-08-18] - Criação da Página 3: Ensaios Não Destrutivos (ENDs) e Integração Global

### Added
- **1. Nova Página da Solução 3 (`3-solucao-ensaios-nao-destrutivos-ends.html`):**
  - Desenvolvida a página institucional completa para o serviço **3. Ensaios Não Destrutivos (ENDs)** com base nos dados do portfólio oficial e na composição visual de referência:
    - **Header Global & Topo Hero Inox Escovado:** Padronizada a altura com `.sn-hero-section` e marca d'água 3D.
    - **Sobre o Serviço:** Headline e parágrafos oficiais focados na detecção de descontinuidades sem alterações ou danos aos componentes, composição de 3 fotos reais de inspeção em campo (`.svc-trio-photo-grid`) e barra de Indicadores Flutuantes (`.sn-indicators-card`).
    - **Como Trabalhamos:** Seção HUD escura com foto em campo e 4 passos circulares conectados (01 Entendimento, 02 Planejamento, 03 Execução, 04 Análise).
    - **Situações em que esse serviço agrega valor:** Accordion vertical full-width interativo com os 10 segmentos industriais (Aeroespacial, Alimentício, Ambiental, Energia, Ferroviário, Mineração, Naval, Óleo & Gás, Papel & Celulose, Químico & Petroquímico).
    - **Capacidades Técnicas:** Grade de alta tecnologia apresentando o portfólio completo de ensaios **Convencionais** (EV, LP, PM, US, RI, LT, EVI, RM) e **Avançados** (PAUT, TOFD, GWUT, EMAT, DR/CR, CT Scan, IR, ET, ACFM, Drones e Escaneamento 3D).
    - **Nossa Metodologia:** Fluxo horizontal com 4 etapas conectadas sobre fundo aço inox claro.
    - **Nosso Compromisso:** Grid dos 4 pilares (*Segurança*, *Confiabilidade*, *Eficiência*, *Parceria*) com fotografia técnica e botão CTA para atendimento WhatsApp.
    - **Footer Minimal Glow:** Rodapé completo com dados institucionais, redes sociais e canais de contato.

### Changed & Refined
- **2. Integração dos Menus de Navegação:**
  - Atualizados os links do submenu de soluções em `index.html`, `sobre-nos.html`, `1-solucao-engenharia-de-integridade-estrutural.html`, `2-solucao-inspecao-em-obras-de-artes-especiais.html` e `src/js/solucoes.js` para apontarem para `3-solucao-ensaios-nao-destrutivos-ends.html`.
- **3. Estilização Dedicada em `src/css/servico-integridade.css`:**
  - Adicionadas classes para a composição de 3 fotos (`.svc-trio-photo-grid`) e grade técnica de capacidades (`.svc-techniques-section`), com total responsividade para Desktop, Tablet e Mobile.


### Fixed & Refined
- **1. Restauração do Fundo Branco Puro na Seção 2 do Serviço 1 (`1-solucao-engenharia-de-integridade-estrutural.html`, `src/css/servico-integridade.css`):**
  - Isolada a regra base de `.svc-solution-section` com fundo branco `#ffffff`, container arredondado e coluna de conteúdo limpa e transparente para o **Serviço 1** (*Engenharia de Integridade Estrutural*).
  - Escopado o estilo azul/cyan (`linear-gradient(135deg, #c4eefb 0%, #d8f4fd 50%, #cbf0fc 100%)`) e o card dot-matrix exclusivamente para o **Serviço 2** (`.svc-solution-section--cyan`), eliminando qualquer sobreposição ou conflito entre as páginas.
  - Atualizado o versionamento de cache para `v=82.0`.

## [2026-08-18] - Reordenação e Ajuste de Seções da Página 2 (Inspeção em Obras de Artes Especiais)

### Changed & Refined
- **1. Reordenação Estrita das Seções (`2-solucao-inspecao-em-obras-de-artes-especiais.html`):**
  - Sequência ajustada com fidelidade ao modelo de referência:
    1. **Header Global & Topo Institucional** (`site-header`, `sn-hero-section`)
    2. **Sobre o Serviço** (`svc-solution-section` / `#sobre-servico`)
    3. **Como Trabalhamos** (`sn-process-section` / `#como-trabalhamos` — Foto lateral + 4 passos circulares azuis conectados)
    4. **Quando Aplicar / Situações em que este serviço agrega valor** (`segmentos-secao` / `#quando-aplicar` — Accordion vertical)
    5. **Nossa Metodologia** (`svc-methodology-section` / `#metodologia` — Fundo Aço Inox claro, 4 cards brancos 01 a 04 + citação/frase de destaque na base)
    6. **Nosso Compromisso** (`sn-commitment-section` / `#compromisso` — Foto técnica + 4 cards verticais)
    7. **Footer Minimalista Glow** (`footer-minimal-glow-section`)
- **5. Limpeza Visual e Redução de Altura da Seção 3 (`2-solucao-inspecao-em-obras-de-artes-especiais.html`, `src/css/sobre-nos.css`):**
  - Removido o botão *"Conheça nossas soluções"* da seção **Como Trabalhamos**, tornando a lateral de texto mais leve e focada.
  - Reduzida a altura vertical da seção **Como Trabalhamos** (`padding: 60px 0; min-height: 480px`) para eliminar excesso de espaço vazio e manter proporção compacta.
  - Removida a faixa/frase inferior de citação da seção **Nossa Metodologia** conforme solicitado.

## [2026-08-18] - Duplicação da Página de Soluções: Criação do Serviço 2 (Inspeção em Obras de Artes Especiais)

### Added
- **1. Nova Página da Solução 2 (`2-solucao-inspecao-em-obras-de-artes-especiais.html`):**
  - Duplicada a estrutura completa e validada da Solução 1 (`1-solucao-engenharia-de-integridade-estrutural.html`).
  - Atualizados títulos, metatags de SEO, URLs canônicas, Open Graph e Twitter Cards para *Inspeção em Obras de Artes Especiais*.
  - Configurado o menu de navegação global destacando o Item 2 como ativo no submenu de soluções.
  - Atualizados os links de direcionamento do menu e do radar/soluções em `index.html`, `sobre-nos.html`, `1-solucao-engenharia-de-integridade-estrutural.html` e `src/js/solucoes.js`.

## [2026-08-18] - Redesign Completo dos Cards de Missão, Visão e Valores (Fidelidade ao Print)

### Changed & Refined
- **1. Estrutura e Alinhamento dos Cards (`sobre-nos.html`, `src/css/sobre-nos.css`):**
  - Redesenhada a seção de **Identidade Corporativa (Missão, Visão e Valores)** com fidelidade pixel-perfect à referência oficial:
    - **Header em Linha:** Ícone circular à esquerda (`60px`, fundo `#eaf2fd` e borda azul suave) e título em negrito à direita (`font-size: 1.7rem; color: #08182e`).
    - **Aba Azul Superior:** Inserida a aba azul de destaque no topo esquerdo de cada card (`.sn-essence-card-tab`).
    - **Underline em Visão:** Inserido o traço azul decorativo de sublinhado sob o título *Visão*.
    - **Corpo e Lista de Valores:** Parágrafos alinhados à esquerda com excelente contraste e legibilidade; lista de *Valores* estruturada com marcadores de ponto azul vibrante (`•`).
    - **Cards e Sombreamento:** Fundo branco puro (`#ffffff`), cantos arredondados de `24px` e sombra realista profunda sobre a textura metálica de aço escovado (`BG-aco-inox-claro-fundo.webp`).
  - Cache atualizado para `v=82.0`.

## [2026-08-18] - Reordenação e Travamento de Dimensões Exatas em Pixels dos Cards de Compromisso

### Changed & Refined
- **1. Reordenação dos Cards de Compromisso (`sobre-nos.html`, `1-solucao-engenharia-de-integridade-estrutural.html`):**
  - Atualizada a ordem sequencial dos 4 cards de compromisso:
    1. **Eficiência** (*Soluções que otimizam recursos e reduzem riscos.*)
    2. **Segurança** (*Protegemos pessoas, meio ambiente e operações.*)
    3. **Parceria** (*Relacionamentos sólidos e foco em resultados.*)
    4. **Confiabilidade** (*Entregamos com qualidade e responsabilidade.*)
- **2. Travamento Rígido em Pixels (`src/css/sobre-nos.css`):**
  - Removidas frações e percentuais variáveis da grade.
  - Definida largura física idêntica e fixa de **`168px`** para todos os 4 cards (`width: 168px; min-width: 168px; max-width: 168px; box-sizing: border-box`).
  - Definida altura mínima uniforme de **`245px`** (`min-height: 245px; height: 100%`) com padding equilibrado (`28px 16px 24px`), assegurando simetria geométrica 100% idêntica entre os 4 blocos.
  - Grade estruturada em `grid-template-columns: repeat(4, 168px)` com `gap: 16px` no Desktop, `220px` no Tablet e `280px` no Mobile.
  - Cache atualizado para `v=81.0`.
- **3. Remoção de Botão na Seção "Como Trabalhamos" (`sobre-nos.html`):**
  - Removido o botão redundante *"Conheça nossas soluções"* do bloco descritivo lateral, limpando o layout e dando foco total aos 4 passos da metodologia.

## [2026-08-18] - Modernização Completa do Radar FFS (12 Mecanismos API 579), Feixe Laser e Fundo #04163A

### Added & Refined
- **1. Matriz Oficial de 12 Mecanismos de Dano da API 579 em Inglês (`src/js/radar-ffs.js`, `src/css/radar-ffs.css`):**
  - Implementada a matriz completa dos 12 mecanismos ASME FFS-1 / API 579: *1. Brittle Fracture, 2. General Metal Loss, 3. Local Metal Loss, 4. Pitting Corrosion, 5. Hydrogen Blisters & Damages, 6. Weld (Misalignment & Distortion), 7. Crack-like Flaws, 8. Creep, 9. Fire Damage, 10. Dents and Gouges, 11. Lamination Damage, 12. Fatigue Damage*.
  - Ícones vetoriais SVG customizados em alta resolução e tipografia técnica em inglês.
  - Distribuição polar perfeita em 360° com espaçamento regular de 30°.
- **2. Posicionamento Contextual Externo dos Rótulos (Fim do "Indo pro ladinho"):**
  - Corrigido o conflito de `transform: scale()` no estado ativo que sobrescrevia a translação e causava deslocamento lateral do texto.
  - Todos os 12 rótulos agora residem 100% no lado externo da órbita (`top`, `top-right`, `right`, `bottom-right`, `bottom`, `bottom-left`, `left`, `top-left`), garantindo alinhamento central estável e visão totalmente desobstruída do interior do radar.
- **3. Feixe de Varredura Laser de Alta Definição (Sem "Cotó"):**
  - Feixe contínuo de 480px (raio 240px) estendendo-se do centro à órbita externa com laser neon azul/ciano (`#00C2FF`), núcleo branco e blur atmosférico (`filter: blur(1.5px)`), proporcionando estética de scanner industrial idêntica à Home.
- **4. Núcleo Central FFS (#04163A) & Paleta Aberta:**
  - Reduzido o diâmetro do núcleo para 165px (proporção harmônica) e removida a imagem de logo duplicada acima da sigla.
  - Abertura da cor de fundo da seção `.ffs-section` e do núcleo para o tom azul nobre `#04163A` com gradientes radiais em `#0B3375` e `#07265E`, halo atmosférico expandido e bases dos nós em `#061A3C`.
- **5. Backup Standalone da Seção CTA Final:**
  - Criado o arquivo `backup-secao-cta-final.html` com todos os estilos e estrutura isolada, removendo a seção de `sobre-nos.html` e `1-solucao-engenharia-de-integridade-estrutural.html`.
- **6. Testes Unitários:** Todos os 36 testes automatizados passando com 100% de sucesso.

## [2026-08-18] - Correção de Responsividade da Seção Metodologia / Diferencial em Notebooks (1366px)

### Fixed & Refined
- **1. Fluid Sizing da Seção Panorâmica de 3 Zonas (`src/css/sobre-nos.css`):**
  - Corrigido o overflow e corte lateral do 4º pilar/etapa ("Solução personalizada" / "Análise e resultado") que ocorria em resoluções de notebooks (1366x768, 1440x900, 1280x800).
  - Transformadas as unidades `.sn-step-unit` de largura rígida (`flex: 0 0 auto; width: 180px`) em flexíveis e auto-adaptáveis (`flex: 1 1 0; min-width: 0; max-width: 175px`), com conectores direcionais retráteis (`flex: 0 1 50px; min-width: 8px-14px`).
  - Redefinida a proporção do grid de 3 zonas para `16% 30% 54%` em notebooks (1440px / 1366px), garantindo respiro e espaço suficiente para que todos os 4 passos fiquem 100% visíveis em linha horizontal contínua sem quebrar ou vazar a borda da tela.
- **2. Breakpoints Dedicados (1600px, 1440px/1366px, 1280px, 1024px e 768px):**
  - Escala proporcional de círculos (`118px` em Full HD, `106px` em 1600px, `86px` em 1366px/1440px, `76px` em 1280px, `96px` em tablet e `88px` em mobile).
  - Alinhamento pixel-perfect dos conectores contínuos com cálculo geométrico exato no centro dos círculos (`margin-top` balanceado em cada viewport).
  - Tipografia de títulos e descrições escalada proporcionalmente para excelente legibilidade sem sobreposições.
- **3. Aplicação Unificada:**
  - O ajuste corrige automaticamente tanto a página *Sobre Nós* (`sobre-nos.html`, seção *Como Trabalhamos / Metodologia*) quanto as páginas de Serviços (`1-solucao-engenharia-de-integridade-estrutural.html`, seção *Nosso Diferencial Técnico*).
- **4. Cache Invalidation:** Atualizado o versionamento de `sobre-nos.css` para `v=70.0` em ambas as páginas.

## [2026-08-18] - Refinamento e Recorte Focal (Zoom & Destaque) das Fotos do Accordion (Serviço 1)

### Changed & Refined
- **1. Enquadramento e Foco Técnico nos 8 Painéis do Accordion (`quando-aplicar`):**
  - **Perda de espessura:** Recorte e zoom direcionados para o tablet de diagnóstico exibindo a curva A-Scan / medição de espessura em primeiro plano e o transdutor de ultrassom posicionado no perfil metálico.
  - **Trincas:** Zoom no cordão de solda da coluna estrutural e sensor de ultrassom acoplado diretamente na junta soldada.
  - **Distorções:** Foco nos chumbadores, porcas de fixação da placa de base, fundação e instrumento de medição/calibrador de profundidade.
  - **Corrosão:** Zoom expressivo na textura oxidada e descamação/piteamento da viga metálica com a sonda de contato medindo a camada corroída.
  - **Danos térmicos:** Foco no anel e suportes diagonais superiores do tanque sob altas temperaturas de processo com o técnico apontando para o ponto crítico.
  - **Hidrogênio:** Foco no corpo da bomba centrífuga industrial, acoplamento, skid de assentamento e lanterna de inspeção estrutural.
  - **Fadiga:** Foco na escalada técnica na escada marinheiro com gaiola no costado do tanque cilíndrico em altura (NR35).
  - **Continuidade operacional:** Foco na caminhada da equipe técnica da ENDCONTROL com maletas e equipamentos rumo à refinaria em operação.
- **2. Otimização de CSS (`segmentos.css`):** Removidos overrides legados de `object-position` para garantir centralização precisa e simétrica em todos os viewports e resoluções.
- **3. Backup Seguro:** Imagens originais em alta resolução preservadas na pasta `originals_backup`.
- **4. Cache Invalidation:** Atualizado o versionamento de `segmentos.css` para `v70.0`.

## [2026-08-17] - Refinamento de Consistência Visual do Serviço 1 (Engenharia de Integridade Estrutural)

### Changed & Refined
- **1. Topo da Página:** Replicada a estrutura e background da página *Sobre Nós* (`sn-hero-section` com `bg-topo-hero-sobre-nos-com-logo-.webp`), removendo o logo monocromático duplicado.
- **2. Headline Principal da S2:** Definido o título principal H1 como **Engenharia de Integridade Estrutural**, com subtítulo harmonioso em menor escala (*Avaliações Fitness-For-Service (FFS) e decisões seguras sobre ativos críticos*).
- **3. Imagem do Hero (S2):** Substituído o mosaico fotográfico por uma única foto grande em alta resolução com moldura HUD e glow da Home (`operacional-engenheiros-inspecao-bomba-edit.webp`).
- **4. Botões Padronizados:** Unificado o estilo de botão em toda a página utilizando o componente oficial da Home S2 (`.btn-about-outline-premium` com `.btn-about-icon-circle` e setas animadas).
- **5. Animação e Interação do Radar FFS (1:1 com a Home):** Replicada integralmente a lógica de medição de ângulos por `getBoundingClientRect()`, rotação única de feixe via Web Animations API, leitura contínua de matriz de transformação (`DOMMatrixReadOnly`), pausa no hover para leitura sem conflitos e ativação instantânea no clique com `moveSweepTo(index, 'nearest')`.

- **6. Seção "Quando Aplicar":** Restaurado o componente oficial de Accordion vertical full-width (`.endo-acc-full-wrapper` / `.endo-acc-row`) com 8 situações de dano (*Perda de espessura, Trincas, Distorções, Corrosão, Danos térmicos, Hidrogênio, Fadiga, Continuidade operacional*), controles por swipe, touch e setas. Adicionado padding inferior de 115px para eliminar qualquer sobreposição dos cards pela seção seguinte.

- **8. Aplicação do Banco Fotográfico Oficial do Serviço 1:**
  - **S2 (Hero / Sobre o Serviço):** Inserida a fotografia de destaque `inspecao-corrosao-viga-metalica-eng-integridade.webp`.
  - **S5 (Quando Aplicar - 8 Painéis do Accordion):** Mapeadas as 8 fotografias exclusivas em alta resolução da pasta `assets/Paginas Imgs/SOLUCOES/1.Engenharia de Integridade/SESSAO CARDS/` (`endcontrol_01_corrosao_foco_superior.png` a `endcontrol_08_continuidade_operacional_foco_superior.png`).
  - **S6 (Nosso Diferencial):** Foto de inspeção mecânica de skid `inspecao-integridade-base-bomba-industrial-skid.webp`.
  - **S7 (Nosso Compromisso):** Foto da equipe técnica `equipe-engenharia-integridade-estrutural-planta-industrial.webp`.
- **Testes & Qualidade:** 36 testes unitários passando com 100% de sucesso via Node.js test runner.


## [2026-08-17] - Implementação da Arquitetura Panorâmica de 3 Zonas na Seção "Como Trabalhamos" (Fidelidade Figma)

### Added
- **Arquitetura Panorâmica Widescreen de 3 Zonas (`sobre-nos.html`, `src/css/sobre-nos.css`):**
  - **ZONA 1 — Fotografia do Técnico (26%):** Espaçador físico no grid reservando o primeiro quarto para a fotografia ancorada na extrema esquerda, com preservação da iluminação quente industrial e transição multi-stop suave em gradiente até o navy escuro (`#010610`).
  - **ZONA 2 — Bloco de Conteúdo (27%):** Eyebrow `COMO TRABALHAMOS` (tracking 0.2em), headline em exatamente duas linhas com destaque ciano em `cada etapa.`, parágrafo em 3 linhas de respiro e botão `Conheça nossas soluções` amplo (340px) com seta ciano à direita (`space-between`).
  - **ZONA 3 — Metodologia (47%):** 4 nós metodológicos com círculos de 126px com glow ciano translúcido, números `01-04` centralizados no mesmo eixo vertical dos círculos, ícones com stroke fino de 1.8px (equipe, prancheta, ferramentas cruzadas, gráfico crescente) e conectores horizontais contínuos que preenchem os gaps alinhados pelo centro geométrico dos círculos.
  - **Container Widescreen e Detalhes de Fundo:** Container com `max-width: 1920px` e largura livre, pontilhado técnico superior e arcos blueprint sutis.
- **Player de Vídeo Institucional com Controles e Auto-Hide (`sobre-nos.html`, `src/js/sobre-nos.js`):** Autoplay contínuo, barra de progresso interativa com scrub, timecode `mm:ss`, mute/unmute, fullscreen e auto-hide após 2,5s.
- **Padronização de Arredondamentos e Sobreposições (`src/css/sobre-nos.css`):** Cantos arredondados (`36px`), encaixe profundo sem gaps (`-36px`) e paddings ampliados em todas as seções.

## [2026-08-15] - Refinamento Visual Meticuloso da Página Sobre Nós & Ajuste do Header

### Added
- **Refinamento da Página Sobre Nós (`sobre-nos.html`, `src/css/sobre-nos.css`):** Reestruturação visual com fidelidade total às referências oficiais em `REF-SOBRE-NOS`.
- **Hero Compacto & Logotipo 3D Metálico:** Enquadramento proporcional do background em aço escovado com o logotipo espiral 3D cromado, texto `— SOBRE NÓS —` e letreiro oficial centralizados.
- **Canvas Claro Arredondado & Indicadores Flutuantes:** A seção de história recebeu topo arredondado (`border-radius: 44px 44px 0 0`) e a barra de métricas flutua com `z-index: 30` sem cortes ou sobreposições.
- **Identidade Corporativa 3D Glass:** Fundo em aço inox claro (`BG-aco-inox-claro-fundo.webp`), cards com badges 3D (Alvo, Olho, Diamante) e pílulas luminosas azuis.
- **Metodologia de 4 Etapas:** Integração da foto operacional com máscara suave de fade e fluxo interligado por setas com glow ciano.
- **Compromisso Técnico & CTA Final:** Foto dos engenheiros em campo à direita, 4 pilares técnicos e CTA final com fundo em aço escuro e emblema com traços tech.

### Changed
- **Menu de Navegação Global (`index.html`, `sobre-nos.html`):** Removido o atalho temporário "☀️ Versão Light" da barra de navegação, mantendo o menu limpo e oficial (Home, Sobre Nós, Nossas Soluções, Contatos).

## [2026-08-14] - Implementação da Nova Página Institucional Sobre Nós

### Added
- **Página Sobre Nós (`sobre-nos.html`):** Estrutura completa e semântica com Hero institucional, card flutuante de indicadores de impacto (+18 anos, +300 projetos, +1.250 ativos, 100% segurança, +120 clientes), seção de história com vídeo institucional e modal de reprodução, timeline histórica 2006–2023+, pilares de Missão, Visão e Valores com glassmorphism e circuitos eletrônicos, metodologia de trabalho em 4 passos com setas conectoras, galeria grid 3x3 de fotografias operacionais reais com lightbox interativo, 4 pilares de compromisso técnico e CTA final pré-footer.
- **Estilos Modulares (`src/css/sobre-nos.css`):** Design system exclusivo utilizando tokens globais (`tokens.css`), responsividade refinada para 7 viewports e animações de hover e transição.
- **Scripts Dedicados (`src/js/sobre-nos.js`):** Controle de abertura/fechamento e reprodução de vídeo institucional, lightbox com navegação por teclado e setas da galeria 3x3, nós interativos da timeline e animações suaves de entrada com `IntersectionObserver`.

### Changed
- **Navegação Integrada (`index.html`):** Links do menu principal e botão "Saiba Mais" da seção institucional direcionando para a nova página `sobre-nos.html`.

## [2026-08-14] - Mapeamento e Atualização Geral do Contexto do Projeto

### Changed
- Sincronizada e consolidada toda a memória do projeto abrangendo repositório GitHub (`idedigitalbr/site-endcontrol`), pipeline de CI/CD VPS GitHub Actions, Docker Compose via Traefik, registros de DNS Cloudflare (`endcontrol.suporteide.digital`) e documentação local Obsidian (`MD/`) e Notion (`DB_IDE`).

## [2026-08-14] - Cadência fixa do autoplay do radar

### Changed
- Ajustada a configuração do radar para avançar automaticamente em intervalos constantes de 2 segundos.
- Mantida a transição visual de 1.600 ms, usando automaticamente os 400 ms restantes para completar cada intervalo de 2 segundos.
- Atualizada a versão do JavaScript para `v=59.0` para invalidar o cache do navegador/CDN.
- Adicionado teste de regressão em `tests/solucoes-stats.test.js`.

## [2026-08-14] - Remoção de foto não utilizada

### Changed
- Removido o arquivo `assets/Fotografias/editadas/operacional-alpinismo-inspecao-vaso-pressao-edit.webp`.
- Retiradas as referências do carrossel e substituídas as referências de conteúdo por operacional-inspecao-ultrassom-casco-estrutura-edit.webp.

## [2026-08-14] - Reforco visual do Radar Sweep

### Changed
- **Sweep do radar (`src/css/solucoes.css`):** reforcado o feixe rotativo com cone ciano mais denso, nucleo branco-ciano, halo difuso e ponto de origem com brilho controlado.
- Mantidos a animacao existente, os arcos SVG de progresso, os nos, labels, autoplay e o comportamento de movimento reduzido.
- Validacao: `node --test tests/radar-progress.test.js`, `tests/site-integrity.ps1` e `git diff --check` aprovados.

## [2026-08-14] - Encaixe visual entre seções arredondadas

## [2026-08-14] - Substituicao da logo do credito do rodape

### Changed
- **Credito ide digital (`index.html`):** substituido o SVG embutido por `assets/Logos/logo-dev-idedigital.png`, mantendo o link externo, texto alternativo e o estilo visual do rodape.

### Changed
- A seção seguinte agora sobrepõe a anterior em `28px`, cobrindo os cantos expostos e eliminando as faixas escuras entre blocos.
- Paddings superiores foram compensados nos breakpoints de desktop, tablet e mobile para preservar a posição do conteúdo.

## [2026-08-14] - Curadoria das fotos do HERO

### Changed
- Removidas do carrossel de fundo do HERO as fotos `operacional-ultrassom-solda-tubulacao-edit-final.webp` e `operacional-tecnico-refinaria-noite-edit.webp`.
- Mantidos os arquivos no projeto porque continuam referenciados em outras seções.
- Ajustada a primeira foto restante para manter o estado inicial `active` e o carregamento prioritário do carrossel.

## [2026-08-14] - Reorganização dos serviços e agrupador Projetos

### Changed
- Reordenados menu, radar e cards para a sequência aprovada: Integridade Estrutural, Obras de Artes Especiais, ENDs, Soldagem, Projetos, Soluções Tecnológicas Integradas, Adequação Normativa, Calibração, Trepanação, Certificação e Consultoria.
- Criado o agrupador visual **Projetos**, sem numeração, com os serviços **5. Gerenciamento de Projetos** e **6. Elaboração de Projetos Mecânicos**.
- Atualizada a navegação compartilhada para manter os 12 serviços sincronizados entre menu, radar, autoplay, setas, dots e card de destaque.

## [2026-08-14] - Padronização dos cantos arredondados das seções

### Changed
- Aplicado o mesmo `border-radius: 28px` da seção de depoimentos às seções principais da página e à Presença Nacional.
- Mantido `overflow: hidden` para impedir que fundos e imagens ultrapassem os cantos em desktop, tablet e mobile.

## [2026-08-13] - Radar Sweep sincronizado com as 12 solucoes

### Added & Changed
- Adicionada camada real de varredura com linha frontal ciano, setor luminoso em `conic-gradient` e rastro de baixa opacidade.
- O controlador agora mede no DOM o angulo de cada icone a partir do centro visual da logo e percorre a sequencia 1 a 12, incluindo a normalizacao de 12 para 1 sem rotacao inversa.
- Centralizada a temporizacao em `RADAR_CONFIG`: 1600ms de movimento, 1200ms de pausa e easing suave.
- Adicionados estados transitorios de saida e aproximacao antes da promocao do proximo item a atual.
- Incluidos `data-step`, `data-angle`, suporte a resize/`ResizeObserver` e comportamento estatico para `prefers-reduced-motion`.
- Corrigida a referencia inexistente `wrapper` no modulo legado de navegacao dos depoimentos, eliminando o erro originado pelo codigo do site.
- Cache busters atualizados para `solucoes.css?v=56.0`, `radar-progress.js?v=6.0`, `solucoes.js?v=58.0` e `main.js?v=23.0`.

### Validation
- 18 testes unitarios aprovados e teste de integridade estrutural aprovado.
- Ciclo completo observado no navegador sem saltos: 1, 2, 3, ..., 12, 1.
- Validacao visual realizada em 1920x1080, 1366x900, 768x1024 e 390x844, com centro subpixel e sem overflow horizontal dos nos.

## [2026-08-13] - Compactacao adicional do accordion

### Changed
- Altura refinada para 360px no desktop e 340px em tablet, aproximando os paineis de um formato mais quadrado.
- Cache buster de `segmentos.css` atualizado para `v32.0`.

## [2026-08-13] - Redução da altura das Áreas de Atuação

### Changed
- Reduzida a altura do accordion para 3/4 das medidas anteriores: 435px no desktop, 390px em tablet e 360px em telas menores.
- Mantidos o recorte `object-fit: cover`, a expansão dos painéis e o comportamento responsivo.
- Corrigido o índice usado pelas setas no mobile para abrir e centralizar exatamente o card anterior ou seguinte.
- Adicionada sincronização por swipe: ao terminar a rolagem, o card mais próximo do centro é ativado e expandido automaticamente.
- Cache buster de `segmentos.css` atualizado para `v31.0`.

## [2026-08-13] - Refinamento da linha de progresso e labels do radar

### Changed & Improved
- Substituídos os arcos uniformes por paths SVG com recuo angular seguro, gradiente de intensidade fraca nas extremidades e pico moderado no centro.
- Criados estados visuais semânticos para conexões: is-completed, is-current e is-future, com glow controlado por variáveis CSS.
- Atualizados os cache busters do radar para radar-progress.js?v=3.0, solucoes.js?v=53.0 e solucoes.css?v=53.0.
- Labels agora recebem posicionamento por quadrante e anel, com fallback automático para evitar invasão da coluna do card e empilhamento vertical seguro em tablet/mobile.
- Mantidas a geometria polar, a separação entre anéis, a navegação do card, o autoplay e a regra de não conectar anéis diferentes.

### Fixed
- Removida a inversão automática que colocava labels do lado direito para dentro do radar e labels do lado esquerdo para dentro do radar.
- Labels laterais agora permanecem fora do respectivo ícone: direita no lado direito, esquerda no lado esquerdo.
- Cache buster do renderizador atualizado para solucoes.js?v=54.0.
- Labels dos itens 2, 3, 9 e 10 ajustados para aparecerem abaixo dos respectivos ícones.
- Cache buster do módulo de posicionamento atualizado para radar-progress.js?v=4.0.
- Labels dos itens 5 e 6 ajustados para ficarem abaixo dos ícones.
- Cache buster atualizado para radar-progress.js?v=5.1.
- Mapa final de alinhamento aplicado: itens 2, 3, 7, 8 e 11 à direita; 4, 9, 10 e 12 abaixo; 5 e 6 à esquerda.
- Quebras de linha das legendas ajustadas; cache busters atualizados para radar-progress.js?v=5.2 e solucoes.js?v=55.0.
- Revisão visual: endpoints dos gradientes ajustados para 0% de opacidade; cache busters atualizados para radar-progress.js?v=5.3 e solucoes.js?v=56.0.
- Nós inativos agora preservam círculo e preenchimento em 100% de opacidade; somente o SVG interno permanece em 55%. Cache de solucoes.css atualizado para v55.0.
- Labels reposicionados: item 7 abaixo do ícone e item 8 à esquerda; cache de radar-progress.js atualizado para v5.4.
- Gradientes SVG convertidos para `userSpaceOnUse` e orientados pelo início/fim de cada arco, corrigindo centros apagados entre os itens 2→3 e 5→6. Cache busters: radar-progress.js?v=5.5 e solucoes.js?v=57.0.
- Ícones com fundo opaco e lacuna angular ampliada nas conexões; cache de solucoes.css atualizado para v54.0.
- Cache buster atualizado para radar-progress.js?v=5.0.

## [2026-08-13] - Ampliação do respiro vertical no radar de soluções

### Fixed
- Mantido o espaço da `.solucoes-section` em 80px no topo e padding inferior compacto de 24px, preservando a proximidade correta após a barra de status.
- Adicionados 80px de espaço inferior no grid desktop entre o radar e a barra de status, sem mudanças na geometria dos anéis ou no layout mobile/tablet.

## [2026-08-12] - Linha de Progresso Neon Ciano Conectando os Serviços Visitados (`<path id="radarTrailPath">`)

### Changed & Improved
- **Traçado Orbital Neon Dinâmico (`index.html`, `src/js/solucoes.js` & `src/css/solucoes.css`):**
  - **Camada SVG de Progresso (`<svg class="radar-trail-svg">`):** Adicionada camada SVG com traço ciano neon brilhante (`stroke-width: 2.5`, `filter: drop-shadow(0 0 14px rgba(0, 194, 255, 0.7))`) que se estende conectando os serviços visitados.
  - **Lógica de Conexão Radial (`updateRadarTrail()`):** Calcula automaticamente as coordenadas exatas dos nós visitados e desenha arcos circulares perfeitos ao longo dos anéis (e vetores de transição entre anéis), conectando dinamicamente do nó 1 até o nó ativo em tempo real.
  - **Reset com Animação:** Ao completar a volta ou selecionar o Serviço 1, a linha de progresso é zerada instantaneamente.
  - Cache busters atualizados para `solucoes.css?v=51.0` e `solucoes.js?v=51.0`.

## [2026-08-12] - Ajuste Fino Perfeito das Opacidades (100%, 80%, 55%/13%, 95%)

### Changed & Improved
- **Refinamento Fino (`src/css/solucoes.css`):**
  - **1. ACTIVE:** **100% (`opacity: 1.0`)**
  - **2. VISITED / PREVIOUS:** Ajustado para **80% (`opacity: 0.80`)**
  - **3. INACTIVE:** Ícones ajustados para **55% (`opacity: 0.55`)** e rótulos/textos para **13% (`opacity: 0.13`)**
  - **4. INACTIVE HOVER:** Mantido em **95% (`opacity: 0.95`)**
  - Cache busters atualizados para `solucoes.css?v=50.0` e `solucoes.js?v=50.0`.

## [2026-08-12] - Nova Calibração de Opacidades do Radar (100%, 90%, 66%/18%, 95%)

### Changed & Improved
- **Atualização Fina dos Percentuais (`src/css/solucoes.css`):**
  - **1. ACTIVE:** **100% (`opacity: 1.0`)**
  - **2. VISITED / PREVIOUS:** Elevado para **90% (`opacity: 0.90`)**
  - **3. INACTIVE:** Ícones elevados para **66% (`opacity: 0.66`)** e rótulos mantidos em **18% (`opacity: 0.18`)**
  - **4. INACTIVE HOVER:** Elevado para **95% (`opacity: 0.95`)**
  - Cache busters atualizados para `solucoes.css?v=49.0` e `solucoes.js?v=49.0`.

## [2026-08-12] - Ajuste Fino dos Percentuais de Opacidade dos Nós do Radar (100%, 80%, 40%/20%, 70%)

### Changed & Improved
- **Calibração de Opacidades (`src/css/solucoes.css`):**
  - **1. ACTIVE:** Opacidade mantida em **100% (`opacity: 1.0`)** com ciano neon vibrante e glow expansivo.
  - **2. VISITED / PREVIOUS:** Opacidade elevada para **80% (`opacity: 0.80`)** para destacar a trilha de serviços percorrida.
  - **3. INACTIVE:** Opacidade dos **ícones em 40% (`opacity: 0.40`)** e opacidade dos **rótulos/textos em 20% (`opacity: 0.20`)**, garantindo um contraste legível porém discreto.
  - **4. INACTIVE HOVER:** Opacidade ao passar o mouse configurada em **70% (`opacity: 0.70`)**.
  - Cache busters atualizados para `solucoes.css?v=48.0` e `solucoes.js?v=48.0`.

## [2026-08-12] - Rastro de Luz Acumulativo (Histórico de Serviços Visitados com Reset no Item 1)

### Changed & Improved
- **Lógica de Rastro de Progresso (`src/js/solucoes.js` & `src/css/solucoes.css`):**
  - **Histórico Acumulativo (`visitedIndices`):** Todos os serviços já percorridos no ciclo atual permanecem acesos no estado **VISITED (~68% de intensidade)** conforme o radar avança.
  - **Reset no Item 1:** Ao completar a volta ou selecionar o **Serviço 1 ("1. Gerenciamento de Projetos")**, todo o histórico de visitados é limpo (`visitedIndices.clear()`), voltando os demais nós para o estado **INACTIVE (16%)** e reiniciando a trilha de luz.
  - Cache busters atualizados para `solucoes.css?v=47.0` e `solucoes.js?v=47.0`.

## [2026-08-12] - Hierarquia Visual Dinâmica de 3 Níveis nos Nós do Radar (Active, Previous, Inactive)

### Changed & Improved
- **Sistema de Estados de 3 Níveis (`index.html`, `src/js/solucoes.js` & `src/css/solucoes.css`):**
  - **Single Source of Truth:** Centralizadas todas as formas de navegação (setas, cliques diretos nos nós, dots de paginação, autoplay e links de serviço) na função `goToService(newIndex)`, gerenciando `activeIndex` e `previousActiveIndex`.
  - **Estado 1 — ACTIVE (100% Intensidade):** Opacidade 1, brilho ciano neon forte (`box-shadow: 0 0 34px rgba(0,194,255,0.8)`), escala `1.12`, rótulo ciano destacado e `aria-current="true"`. Inicializado no Item 1 ("1. Gerenciamento de Projetos").
  - **Estado 2 — PREVIOUS (65%–70% Intensidade):** Opacidade 0.68, brilho discreto (~22% do active), escala `1.02`, preservando a memória visual do serviço anteriormente visitado (não atribuído no carregamento inicial).
  - **Estado 3 — INACTIVE (15%–20% Intensidade):** Opacidade 0.16 no repouso, tom ciano escuro desaturado e sem glow, reduzindo o ruído visual e atuando como background tecnológico. Hover sutil eleva opacidade para ~35% indicando interatividade.
  - **Sincronização com Card:** O card direito inicializa exibindo o serviço 1 e mantém sincronia absoluta de 100% com o radar em todas as formas de navegação.
  - Cache busters atualizados para `solucoes.css?v=46.0` e `solucoes.js?v=46.0`.

## [2026-08-12] - Fixação das Setas no Centro Vertical do Card (`top: 50%`) & Estabilização de Altura

### Changed & Improved
- **Ancoragem Fixa no Meio do Card (`index.html`, `src/js/solucoes.js` & `src/css/solucoes.css`):**
  - **Setas Laterais Fixas (`top: 50%`):** As setas minimalistas de navegação foram posicionadas nas bordas laterais do card (`.card-side-arrow`) com ancoragem absoluta no centro vertical exacto (`top: 50%; transform: translateY(-50%)`).
  - **Posição Imóvel sob o Cursor:** O botão de avançar/voltar fica 100% estático na tela durante a navegação, permitindo que o usuário clique repetidamente sem que a seta mude de posição.
  - **Estabilização de Altura do Corpo (`.highlight-card-body`):** Definida `min-height: 275px` e layout `flex-direction: column; justify-content: space-between`, impedindo qualquer salto na altura do card entre serviços.
  - Cache busters atualizados para `solucoes.css?v=45.0` e `solucoes.js?v=45.0`.

## [2026-08-12] - Remoção das Setas Superiores da Imagem (Mantidas apenas as Setas Inferiores)

### Changed & Improved
- **Limpeza do Layout do Card (`index.html`, `src/js/solucoes.js` & `src/css/solucoes.css`):**
  - **Setas Superiores Removidas:** Removidas as setas flutuantes sobre a imagem do card de destaque.
  - **Exclusividade da Base:** Mantidas apenas as setas minimalistas inferiores que ladeiam os pontos de progresso na barra de rodapé do card (`.card-footer-nav`).
  - Cache busters atualizados para `solucoes.css?v=44.0` e `solucoes.js?v=44.0`.

## [2026-08-12] - Adição de Setas Navegacionais Minimalistas no Card de Destaque (Anterior / Próximo)

### Changed & Improved
- **Navegação Minimalista por Setas (`index.html`, `src/js/solucoes.js` & `src/css/solucoes.css`):**
  - **Setas de Navegação:** Adicionadas setas direcionais minimalistas (`<` e `>`) tanto sobre a imagem do card de destaque quanto na barra inferior ao lado dos pontos de progresso.
  - **Interatividade:** Clique na seta esquerda retrocede para o serviço anterior (com wrap-around do 0 ao 11); clique na seta direita avança para o próximo serviço (wrap-around do 11 ao 0), pausando automaticamente o autoplay para permitir leitura do usuário.
  - **Estilo Visual:** Botões circulares minimalistas com acento ciano neon, efeito de transparência glassmorphism e animações suaves ao passar o mouse.
  - Cache busters atualizados para `solucoes.css?v=43.0` e `solucoes.js?v=43.0`.

## [2026-08-12] - Ampliação da Circunferência Interna (Raio 30.5% & Separação de ~255px entre Ícones Internos)

### Changed & Improved
- **Espaçamento entre Ícones Internos (`src/js/solucoes.js` & `src/css/solucoes.css`):**
  - **Raio do Anel Interno (`--r-inner: 30.5%`):** Elevado para 30.5% (diâmetro de 61%), expandindo o perímetro da circunferência interna.
  - **Afastamento dos Ícones Internos:** A distância em arco entre os 6 nós internos passou a ser de **~255px** (244px de separação horizontal direta no topo entre o item 12 e 7), acabando com qualquer aproximação visual entre os ícones.
  - **Raio do Anel Externo (`--r-outer: 49.5%`):** Mantido em 49.5% (diâmetro de 99%), preservando 19% de vão livre entre anéis (~152px) e 22.25% de respiro para a logo central.
  - Cache busters atualizados para `solucoes.css?v=42.0` e `solucoes.js?v=42.0`.

## [2026-08-12] - Expansão Adicional da Separação entre Anéis (Vão Livre Elevado para 26%)

### Changed & Improved
- **Ampliação do Vão Livre Radial (`src/js/solucoes.js` & `src/css/solucoes.css`):**
  - **Raio do Anel Externo (`--r-outer: 49.5%`):** Expandido para ocupar 99% da área útil da coluna do radar.
  - **Raio do Anel Interno (`--r-inner: 23.5%`):** Ajustado para 23.5% (diâmetro de 47%), ampliando a distância radial entre os dois anéis para **26.0% de amplitude** (~208px de vão totalmente desimpedido).
  - Cache busters atualizados para `solucoes.css?v=41.0` e `solucoes.js?v=41.0`.

## [2026-08-12] - Padronização do Texto do Botão CTA do Card ("Saiba Mais")

### Changed & Improved
- **Simplificação do Texto do Botão CTA (`src/js/solucoes.js`):**
  - Atualizada a propriedade `ctaText` de todos os 12 serviços no array `servicesData` para o padrão conciso **`Saiba Mais`** (exibindo `SAIBA MAIS ->` no card de destaque).
  - Cache busters atualizados para `solucoes.js?v=40.0`.

## [2026-08-12] - Proteção Rígida contra Quebra de Palavras em Rótulos (<span class="label-line">)

### Changed & Improved
- **Blindagem do Texto dos Rótulos (`src/js/solucoes.js` & `src/css/solucoes.css`):**
  - **Encapsulamento por Linha:** Cada fração de texto dividida por `<br>` no JS passou a ser renderizada dentro de um `<span class="label-line">`.
  - **CSS `white-space: nowrap !important`:** Aplicada regra rígida na `.label-line` que proíbe o navegador de quebrar o texto em espaços em branco (` `).
  - **Resultado:** O **Item 2** (`2. Inspeção em Obras / de Artes Especiais`) e o **Item 3** (`3. Ensaios Não Destrutivos / (ENDs)`) ficam **100% garantidos em exatamente 2 linhas (1 única quebra de linha)** sem sofrer colapso de texto independente de tamanho de tela ou cache antigo.
  - Cache busters atualizados para `solucoes.css?v=39.0` e `solucoes.js?v=39.0`.

## [2026-08-12] - Otimização de Quebra de Linha dos Rótulos (Itens 2 e 3)

### Changed & Improved
- **Correção da Quebra de Linha dos Rótulos (`src/js/solucoes.js` & `src/css/solucoes.css`):**
  - **Item 2 (`2. Inspeção em Obras de Artes Especiais`):** Ajustado a `shortTitle` para `2. Inspeção em Obras<br>de Artes Especiais` e expandida a `max-width` da `.service-node-label` de `115px` para `165px` (`155px` em laptops e `185px` em 4K), reduzindo o texto de 5 linhas para **exatamente 2 linhas (1 única quebra de linha)**.
  - **Item 3 (`3. Ensaios Não Destrutivos (ENDs)`):** Ajustado a `shortTitle` para `3. Ensaios Não Destrutivos<br>(ENDs)`, garantindo **exatamente 2 linhas (1 única quebra de linha)**.
  - Cache busters atualizados para `solucoes.css?v=38.0` e `solucoes.js?v=38.0`.

## [2026-08-12] - Alinhamento Total com a Referência Visual Anexo 2 (Raio Externo 48.5%, Raio Interno 28.5% & Vão Livre de 20%)

### Changed & Improved
- **Geometria Aberta e Respiro Expandido (`src/js/solucoes.js` & `src/css/solucoes.css`):**
  - **Expandida a Circunferência Externa (`--r-outer: 48.5%`):** O anel externo aproveita 97% da largura útil da caixa do radar.
  - **Ajustada a Circunferência Interna (`--r-inner: 28.5%`):** O anel interno foi posicionado com precisão para criar **uma distância exatamente equivalente de 20.0% de amplitude entre o anel interno e externo** e de **20.25% de amplitude entre a logo central e o anel interno**.
  - **Central Logo Compacta (`width: 16.5%`):** Reduzido o diâmetro da logo central para 16.5% (~110px-135px), criando respiro visual leve e moderno idêntico ao modelo ideal (Anexo 2).
- **Proporção dos Ícones e Rótulos (`.service-node-icon` & `.service-node-label`):**
  - Ajustados os ícones circulares para `clamp(42px, 3.4vw, 54px)` e tipografia para `clamp(0.64rem, 0.68vw, 0.76rem)`, ampliando em mais de 45% a sensação visual de espaço livre ao redor de cada um dos 12 serviços.
- **Ampliação da Coluna Central (`solucoes-main-content`):**
  - Grid otimizada (`minmax(190px, 220px) 1fr minmax(260px, 320px)`) expandindo o radar central para até `min(900px, 84vh)`.
  - Item inicial ativo configurado para o **Item 4: Engenharia de Soldagem** (index `3`), combinando 100% com o screenshot da referência do Anexo 2.
  - Cache busters atualizados para `solucoes.css?v=37.0` e `solucoes.js?v=37.0`.

## [2026-08-12] - Refatoração Geométrica Polar do Radar Orbital (Anel Interno Expandido, 60° Uniforme & Offset de 30°)

### Changed & Improved
- **Geometria Polar com Raio Interno Ampliado (`src/js/solucoes.js` & `src/css/solucoes.css`):**
  - **Raio do Anel Interno Expandido:** `--r-inner` elevado de `25.5%` para **`32.5%`** (diâmetro 65%), proporcionando um arco livre de **247px** entre cada um dos 6 nós internos e acabando com qualquer concentração ou aproximação de ícones nas partes superior/inferior (itens 7/12 e 9/10).
  - **Raio do Anel Externo:** Ajustado para **`46.5%`** (`--r-outer`, diâmetro 93%), mantendo uma faixa livre visível de **14% de amplitude** entre os dois círculos e respiro elegante para o logo central (diâmetro 21%).
- **Cálculo Polar Puro e Distribuição Angular Uniforme (60° de Separação Exata):**
  - **Anel Externo (6 nós em $360^\circ$):** Item 1 ($-90^\circ$ / 12h), Item 2 ($-30^\circ$ / 2h), Item 3 ($30^\circ$ / 4h), Item 4 ($90^\circ$ / 6h), Item 5 ($150^\circ$ / 8h), Item 6 ($210^\circ$ / 10h).
  - **Anel Interno (6 nós em $360^\circ$ com Offset de $30^\circ$):** Item 7 ($-60^\circ$ / 1h), Item 8 ($0^\circ$ / 3h), Item 9 ($60^\circ$ / 5h), Item 10 ($120^\circ$ / 7h), Item 11 ($180^\circ$ / 9h), Item 12 ($240^\circ$ / 11h).
  - Posições $x, y$ derivadas estritamente por $x = 50\% + r \cdot \cos(\theta)$ e $y = 50\% + r \cdot \sin(\theta)$, garantindo simetria perfeita em qualquer resolução.
- **Prioridade para o Radar na Grid Três Colunas:**
  - Reduzidas as colunas laterais (`minmax(200px, 230px)` à esquerda e `minmax(270px, 330px)` à direita) para priorizar a coluna central (`1fr`, com max-width do radar de `min(840px, 80vh)`), garantindo radar de até **780px** em notebooks 1366px e **920px** em telas 4K.
- **Formatação de Rótulos & Sem Colisões:**
  - Rótulos com alinhamento centralizado e respiro vertical sob/sobre os ícones (`flex-direction: column` / `column-reverse`), reproduzindo exatamente o padrão visual do anexo de referência.
  - Cache busters atualizados para `solucoes.css?v=36.0` e `solucoes.js?v=36.0`.

## [2026-08-12] - Refinamento Completo do Radar Orbital de Serviços (Espaçamento entre Anéis, Staggering 12 Serviços & Responsividade)

### Changed & Improved
- **Organização Estrita dos Anéis (`src/js/solucoes.js` & `src/css/solucoes.css`):**
  - **Anel Externo (Itens 1 a 6):** `1. Gerenciamento de Projetos`, `2. Inspeção em Obras de Artes Especiais`, `3. Ensaios Não Destrutivos (ENDs)`, `4. Engenharia de Soldagem`, `5. Engenharia de Integridade Estrutural`, `6. Soluções Tecnológicas Integradas`.
  - **Anel Interno (Itens 7 a 12):** `7. Inspeção e Adequação Normativa`, `8. Calibração de Instrumentos`, `9. Trepanação (Hot Tapping)`, `10. Certificação de Matéria-Prima`, `11. Consultoria e Assessoria Técnica`, `12. Elaboração de Projetos Mecânicos`.
- **Aumento Significativo do Espaçamento dos Anéis:**
  - Definido raio interno (`--r-inner: 25.5%`) e raio externo (`--r-outer: 44.5%`), criando uma zona livre perceptível de 19% de amplitude entre os dois círculos.
- **Deslocamento Angular (Staggering de 30°):**
  - Anel externo posicionado em $270^\circ, 330^\circ, 30^\circ, 90^\circ, 150^\circ, 210^\circ$.
  - Anel interno posicionado com offset angular em $300^\circ, 0^\circ, 60^\circ, 120^\circ, 180^\circ, 240^\circ$.
  - Alternância perfeita no sentido horário (Item 1 Ext -> Item 7 Int -> Item 2 Ext -> Item 8 Int...).
- **Posicionamento Direcional Inteligente dos Rótulos (`.pos-top`, `.pos-bottom`, `.pos-right`, `.pos-left`, `.pos-*-inner`, `.pos-*-outer`):**
  - Rótulos dos itens internos projetam-se para o espaço livre entre anéis.
  - Rótulo superior do anel externo expande para baixo; rótulo inferior expande para cima (`flex-direction: column-reverse`).
  - Eliminação total de colisões ou encavalo entre ícones, números e textos.
- **Responsividade Aprimorada (1366px Laptop, 1920px Full HD & 4K):**
  - Adaptação dinâmica para notebooks 1366px (`grid 240px 1fr 330px`, radar `720px`).
  - Suporte a monitores grandes e 4K (min-width `1800px` com radar `920px`).
  - Cache busters atualizados para `solucoes.css?v=35.0` e `solucoes.js?v=35.0`.

## [2026-08-12] - Reestruturação do Rodapé para Layout em 3 Colunas com Divisores Glow & Altura Reduzida

### Changed & Improved
- **Layout em 3 Colunas (`index.html` & `src/css/work-units-footer.css`):**
  - **Coluna 1 (Esquerda):** Adicionado bloco de `LOCALIZAÇÃO` com endereço (`Av. Lorem Ipsumm, 9119`, `Ipsum, Lorem-PA`, `(Escritório Sede)`).
  - **Coluna 2 (Centro):** Mantidos logo vertical monocromática EndControl, slogan institucional e os 3 botões circulares de redes sociais (Instagram, LinkedIn, YouTube).
  - **Coluna 3 (Direita):** Criado bloco `FALE CONOSCO` com linha decorativa com dot central cyan, número do WhatsApp (`(11) 9.2019-4396`), e-mail (`contato@endcontrol.com.br`), ícone SVG vetorial oficial do WhatsApp em versão outline vazada destacada (32px) e botão de ação `CHAMAR NO WHATSAPP`.
  - **Divisores Verticais com Glow:** Inseridas linhas finas verticais com gradiente cyan/azul e efeito de brilho suave separando visualmente as 3 colunas.
  - **Redução da Altura:** Ajustados padding vertical (`34px 20px 18px 20px`) e espaçamentos internos para tornar o rodapé mais compacto e moderno.
  - **Versão de Cache:** Invalidação de cache atualizada para `work-units-footer.css?v=34.0`.



### Fixed & Improved
- **Correção de Salto de Scroll no Fullscreen (`src/css/base.css` & `src/js/main.js`):**
  - Removidos `height: 100% !important` e `position: fixed !important` da classe `.modal-open` no `base.css`.
  - Mantida apenas a propriedade `overflow: hidden !important` em `html.modal-open` e `body.modal-open`, preservando integralmente a posição exata de scroll (`window.scrollY`) do usuário ao abrir e fechar o player fullscreen dos vídeos de depoimento.
- **Diagramação & Alinhamento Centrado (`src/css/sections.css` & `index.html`):**
  - Reestruturada a grid com **Vídeos na Esquerda** (`order: 1`) e **Texto na Direita** (`order: 2`), com cards dimensionados pela altura do viewport (`calc(100vh - 100px)` com `aspect-ratio: 9/16`).
  - Container centralizado com margens simétricas e separação ampla entre as colunas (`gap: clamp(56px, 6vw, 120px)`).
- **Versão de Cache (`index.html`):** Invalidação de cache atualizada para `base.css?v=32.0`, `sections.css?v=35.0` e `main.js?v=22.0`.

### Fixed
- **Cache Busters CSS (`index.html`):** Atualizados todos os links de folha de estilo para `?v=30.0` para forçar a invalidação de cache no Cloudflare e navegadores, garantindo o carregamento completo do CSS do Accordion (`segmentos.css`).
- **Sintaxe & Nomes de Arquivos WebP:** Renomeados os arquivos `Alimentício.webp` -> `Alimenticio.webp` e `Papel e Celulose.webp` -> `Papel-Celulose.webp` para evitar falhas de codificação UTF-8 / URL decoding em servidores Linux/Nginx.
- **Ícones SVGs Inline:** Inseridos SVGs inline diretos em cada um dos 10 painéis do Accordion para eliminação total da dependência de scripts externos.

## [2026-08-12] - Novo Componente Accordion Interativo para Áreas de Atuação

### Added & Changed
- **Seção Áreas de Atuação (`index.html` & `src/css/segmentos.css`):**
  - **Componente Accordion Expansível:** Reformulada a seção com o layout em sanfona expansível (`.endo-acc-row`), exibindo os 10 setores operacionais (Aeroespacial, Alimentício, Ambiental, Energia, Ferroviário, Mineração, Naval, Óleo e Gás, Papel e Celulose, Químico e Petroquímico).
  - **Imagens WebP Otimizadas:** Atualizadas todas as 10 imagens dos cards no formato WebP de alta qualidade.
  - **Indicadores Dots & Interatividade:** Adicionados botões de navegação por pontos (`.endo-acc-dots`) e suporte a telas menores com scroll horizontal fluido.
- **Marquee de Setores (`src/js/main.js`):**
  - Adicionada a função `initSectorsMarquee()` para permitir navegação manual via setas superior (`#sectorsNavUp`) e inferior (`#sectorsNavDown`).

## [2026-08-12] - Ampliação da Janela Visual para Exibir 10 Setores

### Changed
- **Card Setores que Atendemos (`src/css/presenca-nacional.css`):**
  - **Exibição de 10 Itens:** Ajustada a altura do viewport para **`285px`**, exibindo exatamente **10 setores simultaneamente** em tela.
  - Mantida a animação contínua e suave (`@keyframes sectorsScrollUp 24s linear infinite`), pausa no hover e setas minimalistas `^` / `v`.

## [2026-08-12] - Ajuste Fino da Janela Visual para Exibir 8 Setores

### Changed
- **Card Setores que Atendemos (`src/css/presenca-nacional.css`):**
  - **Exibição de 8 Itens:** Ajustada a altura do viewport de `215px` para **`245px`**, permitindo a visualização perfeita de exatamente **8 setores simultaneamente** sem distorcer o cartão nem esticar o layout.
  - Mantida a animação fluida contínua (`@keyframes sectorsScrollUp 24s linear infinite`), pausa no hover e navegação minimalista por setas (`^` / `v`).

## [2026-08-12] - Restauração da Altura Compacta (215px) e Animação de Auto-Scroll CSS

### Fixed
- **Card Setores que Atendemos (`src/css/presenca-nacional.css` & `src/js/main.js`):**
  - **Altura Compacta Equilibrada (215px):** Reduzido o viewport para `215px` (`overflow: hidden`), exibindo exatamente 5 a 6 setores por vez e mantendo as proporções ideais do cartão sem esticar ou deixar altura gigante.
  - **Auto-Scroll CSS Restaurado:** Reativada a animação CSS `@keyframes sectorsScrollUp 24s linear infinite`, garantindo que a lista gire suavemente e infinitamente no estado normal.
  - **Pausa e Clique nas Setas:** O mouse hover trava o giro (`animation-play-state: paused`) e abre as setas minimalistas `^` e `v` no topo e na base (sem sobrepor o texto), permitindo avançar e voltar passo a passo.

## [2026-08-12] - Expansão da Altura do Viewport para Eliminar Espaço Vazio

### Changed
- **Card Setores que Atendemos (`src/css/presenca-nacional.css`):**
  - **Ampliação da Janela Visual:** Aumentada a altura útil do viewport de `200px` para **`280px`** (`flex: 1`).
  - **Mais Setores Visíveis:** Agora são exibidos de **6 a 7 setores simultaneamente** (em vez de 3 a 4), preenchendo 100% da altura do card e eliminando o espaço em branco na parte inferior.
  - A seta inferior (`v`) fica encaixada no rodapé interno do card, alinhando a altura do Card 2 com a do Card 1 ("ONDE ATUAMOS").

## [2026-08-12] - Separação Estrita das Setas (Sem Sobrepor o Texto do Viewport)

### Changed
- **Card Setores que Atendemos (`src/css/presenca-nacional.css`):**
  - **Fluxo de Layout em Coluna:** Convertido o container `.sectors-marquee-container` para flexbox vertical (`display: flex; flex-direction: column; align-items: center; gap: 6px`).
  - **Zero Sobreposição:** A seta superior (`^`) agora fica fisicamente alocada no seu próprio espaço **acima** da área de rolagem, e a seta inferior (`v`) fica no seu espaço próprio **abaixo** da área de rolagem.
  - As setas nunca mais ficam por cima das linhas de texto ou da máscara de fade, aparecendo com suavidade no hover exatamente como no print do usuário.

## [2026-08-12] - Reposicionamento das Setas de Navegação (Acima e Abaixo da Lista)

### Changed
- **Card Setores que Atendemos (`index.html` & `src/css/presenca-nacional.css`):**
  - **Título Independente:** O cabeçalho `SETORES QUE ATENDEMOS` voltou a ser limpo e alinhado à esquerda.
  - **Setas Minimalistas (`^` e `v`):** Posicionadas no centro da parte superior (`.sectors-arrow-btn--top`) e no centro da parte inferior (`.sectors-arrow-btn--bottom`) da lista de setores.
  - **Visibilidade Exclusiva no Hover:** As setas permanecem invisíveis (`opacity: 0`) no estado normal e aparecem suavemente (`opacity: 1`) apenas ao passar o mouse sobre o card, permitindo a navegação manual de subir e descer conforme o print de referência.

## [2026-08-12] - Correção do Texto do Marquee e Setas de Navegação Manual (Up/Down)

### Fixed & Added
- **Card Setores que Atendemos (`index.html`, `src/css/presenca-nacional.css`, `src/js/main.js`):**
  - **Exibição Completa de Texto (Sem Cortar Nomes):** Ajustada a tipografia (`font-size: 0.83rem; line-height: 1.35; white-space: normal`) e recuos do viewport para garantir que setores de nomes longos (*"Química e Petroquímica"*, *"Mineração e Siderurgia"*, *"Alimentos e Bebidas"*, *"Infraestrutura e OAE"*) sejam exibidos 100% inteiros sem nenhum corte à direita.
  - **Setas Interativas de Navegação (`▲` / `▼`):** Adicionadas setas circulares no topo do card (`#sectorsNavUp` e `#sectorsNavDown`). Ao passar o mouse, o auto-scroll pausa e as setas permitem navegar manualmente item a item para cima ou para baixo.
  - **Auto-scroll em JS (`requestAnimationFrame`):** Migrada a animação de rolagem contínua para JavaScript (`initSectorsMarquee`), garantindo integração perfeita entre a rolagem suave automática e o controle manual pelas setas.

## [2026-08-12] - Remoção da Tag Flutuante de Versão e Modal de Changelog

### Removed
- **Widget de Versão (`index.html`):**
  - Removido o selo flutuante de versão (`#changelog-trigger` / `v1.jul.17h43`) fixado no canto inferior esquerdo da tela, seus estilos CSS inline e o modal pop-up de changelog (`#changelog-modal`) juntamente com o script de controle.

## [2026-08-12] - Marquee Infinito Vertical na Seção "Setores que Atendemos"

### Added & Changed
- **Card Setores que Atendemos (`index.html` & `src/css/presenca-nacional.css`):**
  - **Formato Texto Limpo:** Removidos os ícones grandes e substituída a lista por marcadores bullet sutis (`•`) com tipografia limpa.
  - **Rolagem Infinita Vertical (Auto-Scroll Up):** Implementada animação de marquee vertical contínua subindo itens um por um (`@keyframes sectorsScrollUp 22s linear infinite`) com duplicidade de faixa para looping 100% contínuo e sem saltos.
  - **Máscara de Fade e Pause Hover:** Adicionado gradiente de máscara vertical (`mask-image`) nas bordas superior/inferior para efeito de transição fluida, e pausa automática da rolagem ao passar o mouse (`:hover`).

## [2026-08-12] - Ajuste do Cabeçalho da Seção para "Áreas de Atuação"

### Changed
- **Seção Áreas de Atuação (`index.html`):**
  - **Badge Superior:** Atualizado para `NOSSAS ÁREAS DE ATUAÇÃO`.
  - **Título Principal H2:** Atualizado para `Principais <span class="segmentos-highlight">Áreas de Atuação</span>`.
  - **Subtítulo:** Atualizado para `"Soluções de engenharia sob medida para diferentes áreas e setores industriais, com conhecimento técnico especializado e alta confiabilidade."`

## [2026-08-12] - Reestilização dos Ícones e Espaçamento na Seção Oportunidades

### Changed
- **Seção Oportunidades (`index.html` & `src/css/sections.css`):**
  - **Texto da Proposta:** Atualizada a frase para `"Fale com nossos especialistas e descubra a melhor solução para o seu desafio."` (removida a palavra *"industrial"*).
  - **Espaçamento Título/Ícone:** Adicionado `display: flex; flex-direction: column; gap: 20px;` no `.oportunidades-card-header` para separar o ícone circular e o título com espaço equilibrado.
  - **Ajuste na Largura do Texto descritivo:** Reduzida a largura máxima (`max-width: 310px`) do parágrafo `.oportunidades-card-text` para que o texto quebre até a metade da coluna (alinhado com o término do título) sem sobrepor o rosto/corpo dos engenheiros na fotografia de fundo.
  - **Estilo Neón Cyan (Radar Node):** Reestilizados os ícones circulares `.oportunidades-card-icon-wrapper` para o padrão tech do Radar de Soluções (Anexo 1):
    - **Estado Normal:** Fundo escuro glassmorphism (`rgba(6, 18, 38, 0.9)`), anel com borda fina ciano (`1.5px solid rgba(0, 194, 255, 0.45)`), stroke do ícone em ciano vibrante (`#00c2ff`) e leve sombra cyan.
    - **Estado Hover:** Brilho neon cyan estendido (`box-shadow: 0 0 28px rgba(0, 194, 255, 0.75), ...`), fundo cyan translúcido (`rgba(0, 156, 255, 0.18)`), efeito glow no traço do ícone (`filter: drop-shadow(0 0 8px rgba(0, 194, 255, 0.9))`) e ampliação suave (`scale(1.08)`).

## [2026-08-11] - Remoção dos Cards da Seção Segmentos de Atuação

### Removed
- **Seção Segmentos de Atuação (`index.html`):**
  - Removido o painel `.segmentos-panel` com os 12 cards de imagens e ícones dos setores.
  - Mantido apenas o cabeçalho/título da seção (`.segmentos-head`) para reformulação futura.

## [2026-08-11] - Correção do Submenuzinho no Item 1 do Menu ("1. Gerenciamento de Projetos")

### Fixed
- **Submenuzinho Dropdown (`src/js/main.js`, `src/js/solucoes.js`, `index.html`):**
  - Corrigido o evento de clique em `a.item-has-children` para não fechar o menu mobile ou colapsar o dropdown desktop.
  - Ajustado o manipulador de eventos em `initMenu()` para garantir que o clique em `1. Gerenciamento de Projetos` alterne corretamente a classe `.is-open` do `.item-with-submenu`, expandindo/recolhendo suavemente as opções `Análise` e `Gestão`.
  - Integrada a seleção interativa `data-service-id` para sincronizar os itens do menu suspenso diretamente com o carrossel de soluções da seção `#solucoes`.
  - Atualizados os cache busters no `index.html` (`?v=12.0`).

## [2026-08-11] - Correção do Rodapé Online & Adição de Cache Busters

### Fixed
- **Cache & Estilização do Rodapé (`index.html` & `work-units-footer.css`):**
  - Adicionado o parâmetro de versão `?v=11.0` em todos os links CSS do `index.html` para forçar a invalidação de cache no Cloudflare e navegadores.
  - Adicionados atributos inline de tamanho (`width="135" height="135" style="max-width: 135px; width: 135px; height: auto;"`) na imagem do logo `.footer-minimal-logo` e regras estritas `!important` no CSS para impedir estouro de layout em conexões com cache antigo.
  - Publicadas alterações no GitHub e deploy efetuado com sucesso na VPS.

## [2026-08-11] - Correção dos Cantos Arredondados e Eliminação de Bordas Pretas na Seção Oportunidades

### Fixed
- **Seção Oportunidades (`src/css/sections.css`):**
  - Removido o `border-radius: 0 0 28px 28px !important` da classe `.oportunidades-section` (definindo `border-radius: 0 !important`).
  - Eliminado o vazamento do fundo escuro `#071429` (Dark Navy) do container principal `#wf-main-content` que aparecia em formato de pontas/bordas pretas nas extremidades inferiores da seção.

## [2026-08-11] - Substituição do Rodapé em index.html pelo Rodapé Minimalista EndControl

### Changed
- **Integração no Site Principal (`index.html` & `work-units-footer.css`):**
  - **CSS Centralizado:** Inseridos todos os estilos do `.footer-minimal-glow-section` no arquivo `src/css/work-units-footer.css`.
  - **Substituição da Estrutura HTML:** Removido o rodapé antigo (`.footer-dark-section`) em `index.html` e aplicado o novo rodapé minimalista com ponto de luz suave azul EndControl, logo vertical monocromática negativa, slogan institucional, links sociais e créditos `ide digital`.




## [2026-08-11] - Atualização dos Textos da Seção "Palavra da Nossa Presidência" (Depoimentos)

### Changed
- **Seção de Depoimentos (`index.html` & `sections.css`):**
  - **Badge:** Atualizada para `• PALAVRA DA NOSSA PRESIDÊNCIA`.
  - **Título (H2):** Atualizado para `Visões que <br> conduzem a <br> <span class="highlight-blue">Endcontrol</span>` com destaque em Azul Vibrante (#1652f0).
  - **Subtítulo:** Atualizado para `Conheça as perspectivas, os valores e os compromissos da nossa Presidência que orientam a trajetória e o futuro da Endcontrol.`

## [2026-08-11] - Ajuste Fino dos Chevrons: Exclusividade no Botão 1

### Fixed & Refined
- **Menu Principal (`index.html`):** Mantido o chevron indicador `v` (que rotaciona para `^` ao expandir) **exclusivamente no Botão 1 (`1. Gerenciamento de Projetos`)**, pois é o único item que possui o submenuzinho (**Análise** e **Gestão**).
- Os demais itens (2 a 12) permanecem como links diretos sem ícone de expansão.

## [2026-08-11] - Ajuste do Menu de Navegação: "Nossas Soluções" (12 Soluções)

### Changed
- **Menu Principal (`index.html` & `header.css`):** Atualizado o item de menu "Nossas Divisões" para **"Nossas Soluções"** e reestruturado o dropdown rico com rolagem suave e as 12 Soluções de Engenharia da EndControl:
  1. Gerenciamento de Projetos
  2. Inspeção em Obras de Artes Especiais
  3. Ensaios Não Destrutivos (ENDs)
  4. Engenharia de Soldagem
  5. Engenharia de Integridade Estrutural
  6. Soluções Tecnológicas Integradas
  7. Inspeção e Adequação Normativa
  8. Calibração de Instrumentos
  9. Trepanação (Hot Tapping)
  10. Certificação de Matéria-Prima
  11. Consultoria e Assessoria Técnica
  12. Elaboração de Projetos Mecânicos

## [2026-08-11] - Aplicação das Cores Oficiais da Identidade Visual

### Changed (Ajustes de Cores & Identidade Visual)
- **Variáveis de Identidade (`tokens.css`):** Adicionadas as variáveis oficiais `--color-azul-fraco: #67a8b8;`, `--color-cinza-forte: #9ac3cd;` e `--color-cinza-fraco: #cce6ed;`.
- **Seção Depoimentos (`sections.css`):** Aplicada a cor **Cinza Forte (`#9ac3cd`)** no fundo com textos, badges e setas de navegação ajustados para azul marinho de alto contraste (`#071429`).
- **Seção Oportunidades (`sections.css`):** Aplicada a cor **Cinza Fraco (`#cce6ed`)** no fundo da seção, mantendo os cartões em azul marinho profundo (`#071429`) com bordas em **Azul Fraco (`#67a8b8`)**.

## [2026-08-11] - Inicialização do Repositório & Higienização Completa

### Added (Novos Recursos & Componentes)
- **Carrossel de Fundo Dinâmico do Hero (`index.html`, `hero.css`, `main.js`):** Implementado slideshow automático e fluido na seção topo (Hero) alternando as 11 fotografias operacionais editadas com efeito Ken Burns (pan & zoom), transições suaves de fade (opacity), pause no blur da aba e indicadores modernos de navegação.
- **Componente de Clientes (`clientes.html`):** Seção isolada e interativa com os maiores grupos industriais do Brasil (Petrobras, Hydro, Vale, Suzano, SBM Offshore, MODEC, Ipiranga, Natura & Oxiteno, Termonorte, Albras, Agropalma).
- **SEO Estruturado (JSON-LD):** Adicionados metadados de `ProfessionalService` e `Organization` no `<head>` do `index.html`.
- **Bases Operacionais Industriais (`units.js`):** Cadastro oficial das 7 bases regionais no Pará, São Paulo, Rio de Janeiro, Bahia, Ceará, Rondônia e Acre.

### Changed (Refatoração & Ajustes)
- **Sanização de Dados Legados:** Removidos 100% dos dados de supermercados e farmácias legados do projeto anterior (`unidades.js`, `album.js`, `drive-assets.js`).
- **Nomenclatura Semântica:** Atualização das classes CSS e links do menu suspenso para as 5 Divisões Estratégicas (`brand-integridade`, `brand-ativos`, `brand-ensaios`, `brand-normativa`, `brand-tecnologia`).
- **Linha do Tempo ("Nossa Trajetória"):** Marcos históricos reais de 2015 a 2024 da ENDCONTROL Engenharia.

### Infrastructure (Repositório & GitHub)
- **Repositório GitHub:** Criado e sincronizado com a branch `main` em [https://github.com/idedigitalbr/site-end-controll](https://github.com/idedigitalbr/site-end-controll).
