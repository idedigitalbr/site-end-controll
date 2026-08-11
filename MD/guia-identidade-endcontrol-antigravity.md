# Guia de Identidade Visual — Site EndControl Engenharia

Use este arquivo como referência principal para aplicar a identidade visual da EndControl Engenharia em todo o site.

A referência visual é o banner hero enviado: visual escuro, premium, tecnológico, corporativo e industrial, com forte presença de azul/ciano, fotografia técnica real, elementos gráficos digitais sutis e acabamento sofisticado.

---

## 1. Objetivo visual

O site deve parecer uma plataforma institucional premium de engenharia industrial.

A identidade precisa transmitir:

- engenharia de integridade;
- inspeção técnica especializada;
- ensaios não destrutivos;
- calibração de alta confiabilidade;
- segurança operacional;
- precisão técnica;
- tecnologia aplicada a ativos críticos;
- atuação corporativa e industrial de alto padrão.

A aparência geral deve ser:

- moderna;
- premium;
- tecnológica;
- corporativa;
- industrial;
- sóbria;
- elegante;
- confiável;
- limpa;
- com alto contraste;
- com detalhes em azul elétrico/ciano.

Evitar qualquer aparência genérica, colorida demais, antiga, infantil, poluída ou com cara de template comum.

---

## 2. Tipografia oficial

Usar somente a fonte **Inter** em todo o site.

A fonte Inter deve ser aplicada em:

- títulos;
- subtítulos;
- textos corridos;
- menus;
- botões;
- tags;
- cards;
- formulários;
- rodapé;
- labels;
- blocos de serviço;
- chamadas comerciais.

Não usar nenhuma outra fonte no site, exceto a própria logo da EndControl quando aplicada como imagem.

### Pesos permitidos

- Inter Regular 400
- Inter Medium 500
- Inter SemiBold 600
- Inter Bold 700
- Inter ExtraBold 800

### Regra tipográfica geral

A tipografia deve ser limpa, forte, técnica e corporativa.

Headlines devem ter bastante presença visual, peso alto e espaçamento de letras levemente negativo.

Textos de apoio devem ser claros, legíveis e com bom espaçamento entre linhas.

---

## 3. Paleta de cores oficial

### Cores principais

```css
:root {
  --color-bg-primary: #071429;
  --color-bg-secondary: #0A1B33;
  --color-bg-deep: #020B18;

  --color-primary: #009CFF;
  --color-primary-strong: #007BFF;
  --color-primary-light: #18B7FF;
  --color-cyan: #00C2FF;

  --color-text-primary: #F5F7FB;
  --color-text-secondary: #C7D0DE;
  --color-text-muted: #8FA3BC;

  --color-border-blue: rgba(0, 156, 255, 0.35);
  --color-card-bg: rgba(7, 20, 41, 0.78);
  --color-card-bg-solid: #0B1B31;
}
```

### Cores de apoio vindas das fotografias

Essas cores podem aparecer naturalmente nas fotos ou em detalhes muito sutis. Não usar como cor principal do layout.

```css
:root {
  --color-industrial-copper: #994E35;
  --color-industrial-orange: #C57049;
  --color-metal-gray: #67768C;
}
```

### Regras de uso das cores

- Azul/ciano é a cor principal da marca no site.
- Fundo principal deve ser azul-marinho escuro.
- Textos principais devem ser brancos ou quase brancos.
- Textos secundários devem usar cinza azulado.
- Bordas, ícones, linhas técnicas e detalhes digitais devem usar azul/ciano.
- Não usar amarelo como cor primária.
- Não usar vermelho como cor secundária.
- Não usar gradientes coloridos fora da paleta.
- Tons quentes devem vir preferencialmente das fotografias industriais.

---

## 4. Layout global

O site deve ter estrutura ampla, limpa e bem espaçada.

### Container principal

```css
.container {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding-left: 72px;
  padding-right: 72px;
}
```

### Padding lateral responsivo

```css
/* Desktop grande */
.container {
  padding-left: 72px;
  padding-right: 72px;
}

/* Desktop médio */
@media (max-width: 1280px) {
  .container {
    padding-left: 56px;
    padding-right: 56px;
  }
}

/* Tablet */
@media (max-width: 991px) {
  .container {
    padding-left: 32px;
    padding-right: 32px;
  }
}

/* Mobile */
@media (max-width: 640px) {
  .container {
    padding-left: 22px;
    padding-right: 22px;
  }
}
```

### Espaçamento entre seções

```css
.section {
  padding-top: 112px;
  padding-bottom: 112px;
}

@media (max-width: 991px) {
  .section {
    padding-top: 80px;
    padding-bottom: 80px;
  }
}

@media (max-width: 640px) {
  .section {
    padding-top: 56px;
    padding-bottom: 56px;
  }
}
```

### Grid

Usar grid de 12 colunas no desktop.

```css
.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
}
```

No mobile, transformar em coluna única.

```css
@media (max-width: 767px) {
  .grid-12 {
    grid-template-columns: 1fr;
  }
}
```

---

## 5. Hero section padrão

A hero section deve seguir a mesma estética da referência enviada.

### Estrutura do hero

- Fundo azul-marinho escuro.
- Fotografia industrial real no lado direito ou como background full-width.
- Gradiente escuro sobre a imagem para garantir leitura.
- Conteúdo textual principal no lado esquerdo.
- Elementos técnicos digitais sutis no fundo.
- Tag pequena acima do headline.
- Headline grande, forte e com destaque em azul/ciano.
- Subtexto claro e técnico.
- CTAs alinhados lado a lado no desktop.
- Barra de diferenciais abaixo do bloco principal.

### Altura do hero

```css
.hero {
  min-height: 760px;
  height: 88vh;
  position: relative;
  overflow: hidden;
  background: #071429;
}

@media (max-width: 991px) {
  .hero {
    height: auto;
    min-height: auto;
    padding-top: 120px;
    padding-bottom: 56px;
  }
}
```

### Overlay padrão para imagem de fundo

```css
.hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      90deg,
      #071429 0%,
      rgba(7, 20, 41, 0.96) 30%,
      rgba(7, 20, 41, 0.68) 52%,
      rgba(7, 20, 41, 0.18) 100%
    );
  z-index: 1;
}
```

No mobile, o overlay deve ser mais forte para manter a leitura.

```css
@media (max-width: 767px) {
  .hero::before {
    background:
      linear-gradient(
        180deg,
        rgba(7, 20, 41, 0.98) 0%,
        rgba(7, 20, 41, 0.92) 48%,
        rgba(7, 20, 41, 0.98) 100%
      );
  }
}
```

---

## 6. Logo

Quando usada no hero ou cabeçalho:

```css
.logo {
  width: 240px;
  height: auto;
}

@media (max-width: 640px) {
  .logo {
    width: 170px;
  }
}
```

Regras:

- A logo deve ter respiro visual.
- Não colar nas bordas.
- Não aplicar sombra exagerada.
- Não repetir a logo excessivamente em seções internas.
- Na home, pode aparecer no topo do hero ou no header.

---

## 7. Tag / pill superior

Exemplo de texto:

```txt
EXCELÊNCIA • PRECISÃO • TECNOLOGIA
```

Estilo:

```css
.hero-tag,
.section-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: 9px 18px;
  border-radius: 999px;
  border: 1px solid rgba(0, 156, 255, 0.55);
  background: rgba(0, 156, 255, 0.06);
  color: #00A8FF;
  font-family: "Inter", sans-serif;
  font-size: 13px;
  line-height: 1;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

@media (max-width: 640px) {
  .hero-tag,
  .section-tag {
    font-size: 11px;
    letter-spacing: 0.12em;
    padding: 8px 14px;
  }
}
```

---

## 8. Headline principal

A headline principal deve ser grande, forte e premium.

### Desktop

```css
.hero-title {
  font-family: "Inter", sans-serif;
  font-size: 64px;
  line-height: 1.08;
  font-weight: 800;
  letter-spacing: -0.045em;
  color: #F5F7FB;
  max-width: 760px;
  margin: 0;
}
```

### Desktop menor

```css
@media (max-width: 1280px) {
  .hero-title {
    font-size: 56px;
  }
}
```

### Tablet

```css
@media (max-width: 991px) {
  .hero-title {
    font-size: 46px;
    line-height: 1.12;
  }
}
```

### Mobile

```css
@media (max-width: 640px) {
  .hero-title {
    font-size: clamp(34px, 9vw, 40px);
    line-height: 1.12;
    letter-spacing: -0.035em;
  }
}
```

### Destaque na headline

Trechos estratégicos podem ser destacados em azul/ciano.

```css
.hero-title .highlight,
.heading .highlight {
  color: #009CFF;
}
```

Exemplo:

```html
<h1 class="hero-title">
  Engenharia de integridade para ativos que sustentam
  <span class="highlight">grandes operações</span>
</h1>
```

---

## 9. Subtexto do hero

```css
.hero-text {
  font-family: "Inter", sans-serif;
  font-size: 20px;
  line-height: 1.55;
  font-weight: 400;
  color: #D7DEE9;
  max-width: 680px;
  margin: 0;
}

@media (max-width: 991px) {
  .hero-text {
    font-size: 18px;
  }
}

@media (max-width: 640px) {
  .hero-text {
    font-size: 16px;
    line-height: 1.55;
  }
}
```

O subtexto deve ser claro, técnico e confiável. Evitar frases genéricas demais.

---

## 10. Botões / CTAs

Os botões devem parecer robustos, corporativos e tecnológicos.

### Área dos botões

```css
.hero-actions,
.cta-actions {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

@media (max-width: 640px) {
  .hero-actions,
  .cta-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 14px;
  }
}
```

### Botão primário

```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 64px;
  padding: 0 30px;
  border-radius: 10px;
  border: 1px solid rgba(24, 183, 255, 0.35);
  background: linear-gradient(135deg, #009CFF 0%, #007BFF 100%);
  color: #FFFFFF;
  font-family: "Inter", sans-serif;
  font-size: 18px;
  line-height: 1;
  font-weight: 700;
  letter-spacing: -0.01em;
  text-decoration: none;
  box-shadow: 0 16px 40px rgba(0, 123, 255, 0.32);
  transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  background: linear-gradient(135deg, #18B7FF 0%, #007BFF 100%);
  box-shadow: 0 20px 48px rgba(0, 156, 255, 0.42);
}
```

### Botão secundário

```css
.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 64px;
  padding: 0 30px;
  border-radius: 10px;
  border: 1px solid rgba(0, 156, 255, 0.55);
  background: rgba(7, 20, 41, 0.45);
  color: #FFFFFF;
  font-family: "Inter", sans-serif;
  font-size: 18px;
  line-height: 1;
  font-weight: 600;
  letter-spacing: -0.01em;
  text-decoration: none;
  transition: background 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
}

.btn-secondary:hover {
  transform: translateY(-2px);
  background: rgba(0, 156, 255, 0.10);
  border-color: #009CFF;
}
```

### Mobile

```css
@media (max-width: 640px) {
  .btn-primary,
  .btn-secondary {
    width: 100%;
    height: 56px;
    font-size: 16px;
  }
}
```

---

## 11. Barra de diferenciais

A barra de diferenciais deve ficar abaixo do hero, com aparência premium e tecnológica.

### Container da barra

```css
.hero-features {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  width: 100%;
  padding: 32px 40px;
  border-radius: 22px;
  border: 1px solid rgba(0, 156, 255, 0.28);
  background: rgba(7, 20, 41, 0.82);
  backdrop-filter: blur(18px);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
}

@media (max-width: 991px) {
  .hero-features {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}

@media (max-width: 640px) {
  .hero-features {
    grid-template-columns: 1fr;
    padding: 24px;
    border-radius: 18px;
  }
}
```

### Item da barra

```css
.feature-item {
  display: flex;
  align-items: center;
  gap: 22px;
  padding: 0 28px;
  border-right: 1px solid rgba(143, 163, 188, 0.28);
}

.feature-item:first-child {
  padding-left: 0;
}

.feature-item:last-child {
  border-right: 0;
  padding-right: 0;
}

@media (max-width: 991px) {
  .feature-item {
    border-right: 0;
    padding: 0;
  }
}
```

### Ícones dos diferenciais

```css
.feature-icon {
  width: 54px;
  height: 54px;
  flex: 0 0 54px;
  color: #009CFF;
  stroke: #009CFF;
  stroke-width: 1.8px;
}
```

Usar ícones lineares, técnicos, modernos e simples. Não usar ícones preenchidos pesados, infantis ou estilo cartoon.

### Título dos diferenciais

```css
.feature-title {
  font-family: "Inter", sans-serif;
  font-size: 18px;
  line-height: 1.25;
  font-weight: 700;
  color: #FFFFFF;
  letter-spacing: -0.02em;
  margin: 0 0 8px 0;
}
```

### Texto dos diferenciais

```css
.feature-text {
  font-family: "Inter", sans-serif;
  font-size: 15.5px;
  line-height: 1.5;
  font-weight: 400;
  color: #C7D0DE;
  margin: 0;
}
```

---

## 12. Títulos de seções internas

### Tag de seção

Usar o mesmo padrão da hero tag, podendo variar o texto conforme a seção.

Exemplos:

- SOBRE A ENDCONTROL
- NOSSAS SOLUÇÕES
- ENGENHARIA DE INTEGRIDADE
- INSPEÇÃO E CONFIABILIDADE
- ATUAÇÃO NACIONAL

### H2

```css
.section-title {
  font-family: "Inter", sans-serif;
  font-size: 48px;
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: #F5F7FB;
  max-width: 820px;
  margin: 0;
}

@media (max-width: 991px) {
  .section-title {
    font-size: 40px;
  }
}

@media (max-width: 640px) {
  .section-title {
    font-size: clamp(32px, 8vw, 36px);
    line-height: 1.15;
  }
}
```

### H3

```css
.card-title,
.service-title {
  font-family: "Inter", sans-serif;
  font-size: 26px;
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: #FFFFFF;
  margin: 0;
}

@media (max-width: 640px) {
  .card-title,
  .service-title {
    font-size: 22px;
  }
}
```

### Texto comum

```css
.body-text,
.section-text {
  font-family: "Inter", sans-serif;
  font-size: 17px;
  line-height: 1.65;
  font-weight: 400;
  color: #C7D0DE;
  margin: 0;
}

@media (max-width: 640px) {
  .body-text,
  .section-text {
    font-size: 16px;
    line-height: 1.6;
  }
}
```

---

## 13. Cards gerais

Cards devem seguir a linguagem glass/dark premium, com borda azul sutil.

```css
.card {
  border-radius: 22px;
  border: 1px solid rgba(0, 156, 255, 0.25);
  background: rgba(7, 20, 41, 0.78);
  backdrop-filter: blur(18px);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.28);
  padding: 32px;
}

.card:hover {
  border-color: rgba(0, 156, 255, 0.48);
  background: rgba(10, 27, 51, 0.88);
}
```

### Cards de serviço

```css
.service-card {
  position: relative;
  overflow: hidden;
  min-height: 320px;
  border-radius: 22px;
  border: 1px solid rgba(0, 156, 255, 0.25);
  background: #0B1B31;
}

.service-card img {
  width: 100%;
  height: 220px;
  object-fit: cover;
  filter: contrast(1.04) saturate(1.03) brightness(0.88);
}

.service-card-content {
  padding: 28px;
}
```

---

## 14. Tratamento das imagens

Usar prioritariamente fotografias reais da EndControl.

As imagens devem ter:

- boa nitidez;
- contraste refinado;
- leve escurecimento para integração com o fundo;
- temperatura industrial/corporativa;
- realce moderado nos azuis;
- aparência realista;
- crop inteligente;
- foco em pessoas, inspeção, equipamentos, ativos industriais e operação técnica.

Não criar fotos falsas se houver fotos oficiais disponíveis.

### Filtro sugerido para imagens

```css
.image-industrial {
  filter: contrast(1.06) saturate(1.05) brightness(0.9);
}
```

### Overlay para fotos em cards ou backgrounds

```css
.image-overlay {
  background:
    linear-gradient(
      180deg,
      rgba(2, 11, 24, 0.05) 0%,
      rgba(2, 11, 24, 0.68) 72%,
      rgba(2, 11, 24, 0.92) 100%
    );
}
```

---

## 15. Elementos gráficos técnicos

Usar elementos discretos, como:

- linhas finas azuis;
- pontos em grid;
- circuitos técnicos;
- pequenos brilhos;
- bordas luminosas sutis;
- arcos de engenharia;
- linhas horizontais de interface;
- wireframes discretos.

Estilo:

```css
.tech-line,
.tech-grid,
.tech-element {
  color: #009CFF;
  opacity: 0.16;
  stroke-width: 1px;
  pointer-events: none;
}
```

Regras:

- Os elementos técnicos devem complementar a composição.
- Não podem competir com texto, foto ou CTA.
- Não exagerar no neon.
- Usar sempre com baixa opacidade.

---

## 16. Bordas, radius e sombras

### Radius

```css
:root {
  --radius-sm: 10px;
  --radius-md: 16px;
  --radius-lg: 22px;
  --radius-xl: 28px;
  --radius-pill: 999px;
}
```

Uso recomendado:

- Cards pequenos: 14px a 18px
- Cards grandes: 20px a 24px
- Botões: 10px a 12px
- Pills/tags: 999px
- Imagens grandes: 22px a 28px

### Bordas

```css
.border-blue {
  border: 1px solid rgba(0, 156, 255, 0.25);
}
```

### Sombras

```css
.shadow-card {
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
}

.shadow-blue {
  box-shadow: 0 18px 48px rgba(0, 156, 255, 0.25);
}
```

---

## 17. Composição visual

Sempre manter:

- muito espaço negativo;
- hierarquia visual clara;
- headline forte;
- texto de apoio menor e legível;
- cards bem alinhados;
- poucos elementos por seção;
- fotos reais bem posicionadas;
- contraste alto entre texto e fundo;
- visual sofisticado e limpo;
- respiro entre blocos;
- alinhamento consistente;
- sensação de engenharia premium.

Não poluir a tela.

---

## 18. Responsividade

No mobile:

- empilhar cards;
- empilhar botões;
- usar botões com largura total;
- reduzir elementos decorativos;
- preservar leitura;
- manter fotos reais com crop inteligente;
- usar headline entre 34px e 40px;
- usar padding lateral entre 20px e 24px;
- evitar textos pequenos demais;
- reduzir altura de imagens quando necessário;
- manter contraste forte.

A experiência mobile deve parecer feita especificamente para mobile, não apenas uma versão espremida do desktop.

---

## 19. O que evitar

Não usar:

- amarelo como cor principal;
- vermelho como cor secundária;
- fontes diferentes da Inter;
- ícones coloridos genéricos;
- gradientes exagerados;
- textos desalinhados;
- cards sem respiro;
- fotos aleatórias de banco de imagem quando houver fotos reais;
- excesso de efeitos neon;
- visual de template comum;
- botões muito arredondados em estilo aplicativo infantil;
- sombras pesadas demais;
- seções com aparência de PowerPoint antigo;
- excesso de logos;
- imagens falsas de trabalhadores se fotos reais já foram enviadas;
- backgrounds claros sem necessidade;
- layout poluído.

---

## 20. CSS base obrigatório

Aplicar estes tokens globais como base do projeto.

```css
:root {
  --font-primary: "Inter", sans-serif;

  --color-bg-primary: #071429;
  --color-bg-secondary: #0A1B33;
  --color-bg-deep: #020B18;

  --color-primary: #009CFF;
  --color-primary-strong: #007BFF;
  --color-primary-light: #18B7FF;
  --color-cyan: #00C2FF;

  --color-text-primary: #F5F7FB;
  --color-text-secondary: #C7D0DE;
  --color-text-muted: #8FA3BC;

  --color-border-blue: rgba(0, 156, 255, 0.35);
  --color-card-bg: rgba(7, 20, 41, 0.78);
  --color-card-bg-solid: #0B1B31;

  --radius-sm: 10px;
  --radius-md: 16px;
  --radius-lg: 22px;
  --radius-xl: 28px;
  --radius-pill: 999px;

  --shadow-card: 0 24px 80px rgba(0, 0, 0, 0.35);
  --shadow-blue: 0 18px 48px rgba(0, 156, 255, 0.25);

  --container-max: 1440px;
  --container-padding-desktop: 72px;
  --container-padding-tablet: 40px;
  --container-padding-mobile: 22px;
}

html {
  font-family: var(--font-primary);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  text-rendering: geometricPrecision;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  font-family: var(--font-primary);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
}

* {
  box-sizing: border-box;
}
```

---

## 21. Padrão de textos do hero

Usar como referência textual principal da home:

### Tag

```txt
EXCELÊNCIA • PRECISÃO • TECNOLOGIA
```

### Headline

```txt
Engenharia de integridade para ativos que sustentam grandes operações
```

### Subtexto

```txt
Combinamos conhecimento técnico, inspeções especializadas, ensaios não destrutivos e calibração de alta confiabilidade para proteger ativos críticos, pessoas e processos.
```

### CTAs

```txt
Fale com um especialista
Conheça nossas soluções
```

### Diferenciais

```txt
Inspeção especializada
Execução técnica com foco em precisão e segurança.

Cobertura nacional
Atuação em diferentes regiões e contextos industriais.

Segurança operacional
Apoio à continuidade e confiabilidade dos ativos.

Equipe qualificada
Profissionais preparados para demandas complexas.
```

---

## 22. Instrução final para o Antigravity

Recrie e/ou ajuste todo o site usando esta identidade como padrão global.

Aplicar estes tokens visuais em:

- Home;
- Sobre nós;
- páginas de serviço;
- cards;
- botões;
- formulários;
- cabeçalho;
- rodapé;
- menus;
- seções internas;
- banners hero;
- blocos institucionais;
- blocos de diferenciais;
- páginas comerciais.

O resultado final deve parecer um site premium de engenharia industrial, com estética tecnológica, forte presença de azul/ciano, fundo escuro sofisticado, tipografia Inter em todo o projeto e uso consistente das fotos reais da EndControl.

Preservar a linguagem visual da referência enviada e transformar ela em um sistema visual consistente para todas as páginas.
