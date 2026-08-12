# Changelog — ENDCONTROL Engenharia

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
