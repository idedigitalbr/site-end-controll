---
version: 1.0.0
name: endcontrol-design-system
description: Sistema oficial de design e especificação visual para a ENDCONTROL Engenharia Industrial. Estruturado para alta confiabilidade operacional, precisão técnica e conformidade normativa (NR-13, NR-12, NR-11, ASME, API). Baseado em canvas corporativo limpo (#FFFFFF e #F0F5F7), contraste escuro de alta legibilidade (#071429), tipografia técnica Inter e Roboto Condensed, com a energia institucional do Azul Cinza Oficial (#67A8B8) e o Azul Claro Tecnológico (#00ACE4) para ações estratégicas, pílulas, CTAs e destaques.

colors:
  primary: "#67A8B8"               # Azul Cinza Oficial (Identidade Principal)
  primary-hover: "#538E9C"         # Estado hover do primário
  primary-active: "#457884"        # Estado pressed / active
  primary-disabled: "#C5E0E7"      # Controles e botões inativos
  primary-light: "#EAF3F6"         # Fundos suaves de ícones e badges sutis
  primary-rgb: "103, 168, 184"     # Canal RGB para transparências e sombras dinâmicas
  
  secondary: "#00ACE4"             # Azul Claro Tecnológico (Destaque e Inovação)
  secondary-hover: "#0093C4"       # Hover do secundário
  secondary-light: "#E5F7FD"       # Fundo suave de destaque
  secondary-rgb: "0, 172, 228"     # Canal RGB para efeitos de brilho
  
  # Cores de Apoio Institucional
  slate: "#9AC3CD"                 # Slate Médio / Cinza Forte
  slate-light: "#CCE6ED"           # Cinza Fraco
  industrial-copper: "#994E35"     # Tom industrial de apoio
  industrial-orange: "#C57049"     # Destaques industriais
  
  # Neutros e Tipografia
  ink: "#071429"                   # Títulos principais, H1-H3, corpo de alto contraste
  body: "#334155"                  # Parágrafos corridos e descrições
  muted: "#64748B"                 # Labels secundários, legendas e metadados
  muted-soft: "#8FA3BC"            # Textos atenuados
  
  # Superfícies e Linhas
  canvas: "#FFFFFF"                # Fundo base do site (Tema Claro Oficial)
  surface-soft: "#F0F5F7"          # Fundo de seções alternadas e cards suaves
  surface-card: "#FFFFFF"          # Fundo de cards em elevação
  surface-strong: "#E2E8F0"        # Fundos de placeholders e bordas divisórias
  surface-dark: "#071429"          # Fundo de seções técnicas escuras e rodapé profundo
  surface-dark-card: "#0A1B33"     # Cards sobre fundos escuros
  
  hairline: "rgba(103, 168, 184, 0.2)" # Divisores de 1px e bordas padrão
  hairline-soft: "#E2E8F0"         # Separadores sutis de tabelas
  border-strong: "#67A8B8"         # Bordas de destaque e botões outline
  
  # Semânticos e Status
  on-primary: "#FFFFFF"            # Texto sobre botões e badges primários
  on-dark: "#FFFFFF"               # Texto sobre fundos escuros
  success: "#10B981"               # Conformidade, NR aprovada, status ativo
  success-bg: "#ECFDF5"            # Fundo suave de sucesso
  warning: "#F59E0B"               # Inspeção preventiva, atenção
  warning-bg: "#FFFBEB"            # Fundo suave de aviso
  error: "#EF4444"                 # Não conformidade crítica
  star-rating: "#F59E0B"           # Avaliações e estrelas de reputação
  scrim: "rgba(7, 20, 41, 0.6)"    # Modais e backdrops

typography:
  fontPrimary: "'Inter', sans-serif"
  fontDisplay: "'Roboto Condensed', 'Inter', sans-serif"
  fontMono: "'JetBrains Mono', Consolas, monospace"
  
  weights:
    light: 300
    regular: 400
    medium: 500
    semibold: 600
    bold: 700
    extrabold: 800
    black: 900
    
  scale:
    display-hero:
      fontSize: "clamp(34px, 4.5vw, 48px)"
      fontWeight: 800
      lineHeight: "1.15"
      letterSpacing: "-0.02em"
    headline-h2:
      fontSize: "clamp(26px, 3.8vw, 38px)"
      fontWeight: 800
      lineHeight: "1.18"
      letterSpacing: "-0.02em"
      color: "#071429"
      highlightColor: "#67A8B8"
    title-h3:
      fontSize: "20px"
      fontWeight: 700
      lineHeight: "1.3"
      letterSpacing: "-0.01em"
    title-card:
      fontSize: "18px"
      fontWeight: 700
      lineHeight: "1.35"
    subtitle-lead:
      fontSize: "16px"
      fontWeight: 400
      lineHeight: "1.6"
      color: "#334155"
    body:
      fontSize: "15px"
      fontWeight: 400
      lineHeight: "1.5"
      color: "#334155"
    body-sm:
      fontSize: "14px"
      fontWeight: 400
      lineHeight: "1.5"
    caption:
      fontSize: "13px"
      fontWeight: 500
      lineHeight: "1.4"
      color: "#64748B"
    eyebrow:
      fontSize: "12px"
      fontWeight: 700
      lineHeight: "16px"
      letterSpacing: "0.14em"
      textTransform: "uppercase"
      color: "#FFFFFF"
      background: "#67A8B8"
    button:
      fontSize: "15px"
      fontWeight: 700
      lineHeight: "1.25"
      letterSpacing: "0.02em"

rounded:
  none: "0px"
  xs: "4px"
  sm: "10px"
  md: "16px"
  lg: "22px"
  xl: "28px"
  full: "9999px"

spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  base: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  section: "80px"
  section-desktop: "96px"

shadows:
  subtle: "0 2px 8px rgba(7, 20, 41, 0.04)"
  card: "0 10px 30px rgba(7, 20, 41, 0.06)"
  elevated: "0 20px 48px rgba(7, 20, 41, 0.1)"
  primary: "0 8px 24px rgba(103, 168, 184, 0.35)"
  secondary: "0 8px 24px rgba(0, 172, 228, 0.35)"
---

# ENDCONTROL Engenharia Industrial — Design System Specification

Este documento define o **Contrato Oficial do Design System** da ENDCONTROL Engenharia, servindo como Fonte Única de Verdade (*Single Source of Truth*) para componentes visuais, paleta cromática, tipografia e diretrizes de interface.

---

## 1. Princípios de Design

1. **Rigor Técnico e Precisão:** Cada elemento visual reflete a engenharia de alta confiabilidade, segurança e integridade operacional.
2. **Clareza e Legibilidade:** Alto contraste entre os textos e os fundos, garantindo leitura sem esforço em laudos, especificações e telas institucionais.
3. **Identidade Visual Canônica:**
   - **Cor Primária:** Azul Cinza (`#67A8B8`), aplicado nas pílulas de seção (*eyebrows*), botões principais e barra de métricas.
   - **Cor Secundária:** Azul Claro (`#00ACE4`), utilizado em pontos de inovação, dados, ícones e gradientes complementares.
4. **Padronização Centralizada:** Nenhuma cor deve ser chumbada (*hardcoded*). Todas as regras CSS e páginas HTML devem consumir exclusivamente as variáveis de `src/css/tokens.css`.

---

## 2. Padrão de Eyebrow / Badges (Pílulas Oficiais)
As pílulas que antecedem os títulos de seção são a assinatura visual do projeto:
```css
.segmentos-eyebrow,
.sn-process-eyebrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-eyebrow, 12px);
  font-weight: 700;
  letter-spacing: 0.14em;
  color: #FFFFFF;
  background: var(--brand-primary); /* #67A8B8 */
  border-radius: 9999px;
  padding: 8px 14px;
  text-transform: uppercase;
}
```
Exemplos canônicos:
- `NOSSAS ÁREAS DE ATUAÇÃO`
- `ENGENHARIA - INSPEÇÃO - INTEGRIDADE`
- `NOSSO COMPROMISSO`
- `QUANDO APLICAR`

---

## 3. Padrão de Botões e CTAs
- **CTA Primário (Header / Ação Principal):** Fundo `var(--brand-primary)` (`#67A8B8`), texto `#FFFFFF`, bordas arredondadas `9999px` ou `12px`.
- **CTA WhatsApp Oficial:** Fundo `var(--brand-primary)`, ícone oficial do WhatsApp, sombra com canal RGB `rgba(var(--brand-primary-rgb), 0.35)`.
- **CTA Outline Secundário:** Fundo `#FFFFFF`, borda `1.5px solid var(--brand-primary)`, texto `var(--brand-primary)`. No hover, preenchimento total.
- **CTA Tecnológico:** Fundo `var(--brand-secondary)` (`#00ACE4`), texto `#FFFFFF`.

---

## 4. Barra de Métricas Corporativas (Hero)
Container contínuo com `background: var(--brand-primary)`, cantos `18px`, exibindo os indicadores fundamentais de autoridade da empresa:
- `+18 anos de experiência`
- `+300 especialistas`
- `100% de atuação em todo o território nacional`
- `+1.250 projetos entregues`

---

## 5. Iconografia Oficial
Todos os ícones devem seguir a geometria técnica linear nativa:
- `stroke="currentColor"`
- `stroke-width="2"` ou `1.75`
- `viewBox="0 0 24 24"`
- Família recomendada: **Lucide Icons** ou SVGs industriais padronizados.
