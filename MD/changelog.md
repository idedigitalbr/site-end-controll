# Changelog — ENDCONTROL Engenharia

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
