# Changelog — ENDCONTROL Engenharia

## [2026-08-12] - Correção de Cache CSS na VPS e Padronização de Imagens do Accordion

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
