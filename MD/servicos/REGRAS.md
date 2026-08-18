# REGRAS — Páginas de Serviços EndControl

## Regra principal

Antes de criar, alterar, implementar ou gerar uma full-page de qualquer serviço, leia primeiro o contexto específico desse serviço dentro desta pasta e consulte também as fontes institucionais em `MD/plus`.

Nunca comece pela interface.

## Fontes de verdade

Prioridade obrigatória:

1. Arquivo específico do serviço em `MD/servicos/`;
2. Materiais institucionais em `MD/plus`, principalmente portfólio e briefing;
3. Referências visuais full-page da Home e Sobre Nós;
4. Código, tokens, estilos e componentes existentes;
5. Assets reais do projeto.

Não invente funcionalidades, benefícios, números, cases, clientes, integrações, certificações, tecnologias ou diferenciais não sustentados pelas fontes.

## Antes de qualquer página

Para cada serviço:

1. Identifique o serviço exato.
2. Leia o arquivo específico nesta pasta.
3. Consulte o portfólio/briefing em `MD/plus`.
4. Entenda:
   - o que é;
   - qual problema resolve;
   - para quem é;
   - quando é utilizado;
   - benefícios sustentados;
   - diferenciais sustentados;
   - processo/etapas;
   - capacidades e informações técnicas;
   - dúvidas que a página precisa remover;
   - fatos ausentes ou não confirmados.
5. Inspecione assets relacionados.
6. Inspecione componentes, CSS e tokens existentes.
7. Analise as referências full-page.
8. Só então defina narrativa, seções e composição.

## Referências visuais obrigatórias

Procure e analise principalmente:

- `home-ref-full-page.png`
- `sobre-nos-ref-full-page.png`
- nomes equivalentes com diferenças de caixa/caminho, como `SOBRE-NOS-REF-FULL-PAGE.png`

Use as referências para entender o design system completo:
estrutura, ritmo vertical, alternância entre seções, grid, containers, margens, paddings, tipografia, hierarquia, cores, fundos, contraste, botões, cards, imagens, elementos gráficos, bordas, radius, sombras, CTAs, proporções, densidade e responsividade.

Não faça apenas algo “inspirado”. A página precisa parecer parte natural do mesmo site.

## Consistência sem repetição

Teremos aproximadamente 12 páginas de serviços.

Não copie a mesma estrutura 12 vezes trocando título, descrição e imagem.

Mantenha consistentes:
- tipografia;
- cores;
- botões;
- containers;
- grid;
- espaçamentos;
- radius;
- componentes;
- linguagem visual;
- tratamento de imagens;
- padrões de interação.

Permita variar:
- ordem das seções;
- quantidade;
- tipo;
- composição;
- narrativa;
- destaques;
- componentes específicos.

Pergunta obrigatória:

> O que uma pessoa precisa entender sobre este serviço para compreender seu valor e tomar uma decisão?

A arquitetura deve nascer da resposta.

## Possíveis seções

Hero, explicação, problema, indicação, benefícios, diferenciais, processo, etapas, capacidades, tecnologias, aplicações, resultados esperados, comparações, FAQ, CTA e outras seções específicas.

Essa lista é repertório, não template.

## Reutilização

Antes de criar algo novo:
- inspecione assets;
- componentes;
- estilos;
- tokens;
- padrões da Home e Sobre Nós.

Reutilize o que fizer sentido. Não force componentes inadequados.

## Full-page

Quando a tarefa for gerar uma imagem full-page:
- represente a página completa;
- use conteúdo real e sustentado;
- preserve o ritmo visual da Home/Sobre Nós;
- use assets EndControl;
- evite repetição mecânica de cards;
- mantenha começo, meio e fim da narrativa;
- não introduza uma identidade visual diferente.

## Padrão Oficial: Topo (Hero) e Seção "Sobre o Serviço" (Obrigatório em Todas as 12 Páginas)

Em todas as páginas de serviços (`1-solucao...` a `12-solucao...`), a abertura e a segunda seção devem seguir estritamente esta estrutura padronizada:

### 1. Topo Hero Inox Compacto
- **Elemento:** `<section class="sn-hero-section" id="hero-sobre">` com `<div class="sn-hero-overlay"></div>`.
- **Altura Compacta:** Estilizado com `.sn-page-wrapper .sn-hero-section { margin-top: -80px; }` em `src/css/servico-integridade.css`, garantindo a altura compacta do banner hero inox com a marca d'água 3D perfeitamente posicionada.

### 2. Seção Sobre o Serviço — Hierarquia em 4 Níveis
- **Nível 1 — Eyebrow / Tag:** `SOBRE O SERVIÇO` (ou `SOBRE A SOLUÇÃO EM...`)
- **Nível 2 — Headline Principal (H1):** **Nome Oficial do Serviço** (ex: *1. Engenharia de Integridade Estrutural*, *2. Inspeção em Obras de Artes Especiais*, *3. Ensaios Não Destrutivos (ENDs)*, etc.).
- **Nível 3 — Mini Título / Subtítulo (`.svc-solution-subtitle`):** Frase técnica de apoio menor que o H1, resumindo a proposta de valor.
- **Nível 4 — Texto Corrido / Parágrafos (`.svc-solution-paragraphs`):** Explicação aprofundada com termos técnicos e normas destacados.

---

## Critério final

O resultado deve parecer criado pela mesma equipe da Home e do Sobre Nós, dentro do mesmo sistema visual, mas com uma composição pensada especificamente para aquele serviço.

