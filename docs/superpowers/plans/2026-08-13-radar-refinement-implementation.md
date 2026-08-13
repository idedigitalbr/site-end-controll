# Refinamento Visual do Radar de Soluções — Implementation Plan

> For agentic workers: Use superpowers:executing-plans to implement this plan task-by-task with checkpoints.

Goal: Refinar o brilho, a geometria das conexões e o posicionamento contextual dos labels do radar existente, preservando sua arquitetura ring-aware e a navegação atual.

Architecture: radar-progress.js continuará responsável apenas pelo estado semântico de nós e conexões. solucoes.js ganhará helpers puros para recuo angular, classificação de label e estado visual; solucoes.css concentrará tokens de intensidade, estilos por estado e regras por quadrante. O SVG continuará sendo a camada de conexão abaixo dos nós.

Tech Stack: JavaScript ES5-compatible no navegador, SVG, CSS, Node node:test, PowerShell integrity checks.

## Global Constraints

- Trabalhar sobre a implementação atual; não recriar o radar.
- Não criar conexões entre anéis diferentes.
- Preservar autoplay, navegação, card, dots e acessibilidade.
- Manter o fundo escuro, a paleta ciano e a geometria geral existentes.
- Linha: fraca nas extremidades, moderada no centro e interrompida na área dos ícones.
- Labels: adaptativos por lado/quadrante e sem sobreposição com anéis, ícones ou colunas.

---

### Task 1: Cobrir a geometria segura e os estados visuais com testes

Files:
- Modify: tests/radar-progress.test.js
- Modify: src/js/radar-progress.js

Interfaces:
- Produces getConnectionVisualState(connection, activeStep) returning completed, current or future.
- Produces getSafeArcAngles(from, to, options) returning startAngle, endAngle and sweep.

- [ ] Write tests for the current segment, completed/future distinction and a 7-degree sixty-degree arc inset.
- [ ] Run node --test tests/radar-progress.test.js and confirm failure because the helpers are missing.
- [ ] Implement the two pure helpers in src/js/radar-progress.js and export them.
- [ ] Run node --test tests/radar-progress.test.js and confirm all tests pass.
- [ ] Commit with git commit -m "test: cover radar visual states and safe arcs".

### Task 2: Render recuado, gradients and semantic connection classes

Files:
- Modify: src/js/solucoes.js
- Modify: index.html
- Modify: tests/site-integrity.ps1

Interfaces:
- Consumes RadarProgress.getSafeArcAngles() and getConnectionVisualState().
- Produces one SVG gradient per connection and paths whose geometry stops before icon bounds.

- [ ] Add integrity checks for radar-connection-gradient, is-current and getSafeArcAngles.
- [ ] Run tests/site-integrity.ps1 and confirm the new checks fail.
- [ ] Add an SVG defs element inside radar-trail-svg, create one gradient per connection, compute an icon-size-based inset clamped to 4..10 degrees, build safe M/A paths, and assign is-completed, is-current or is-future.
- [ ] Keep data-from, data-to, data-ring and data-closing unchanged.
- [ ] Run node --test tests/radar-progress.test.js and the integrity script.
- [ ] Commit with git commit -m "feat: soften radar connections with safe gradient arcs".

### Task 3: Centralize restrained glow tokens and state styling

Files:
- Modify: src/css/solucoes.css
- Modify: tests/site-integrity.ps1

Interfaces:
- Consumes the semantic connection classes and gradient strokes from Task 2.
- Produces restrained state-based rendering with no glow behind icon bounds.

- [ ] Add integrity assertions for --radar-line-current-opacity, --radar-line-completed-opacity, .radar-connection.is-current and removal of the old is-active rule.
- [ ] Run the integrity script and confirm the new checks fail.
- [ ] Add CSS tokens for future opacity 0.12, completed opacity 0.42, current opacity 0.68, completed glow 0 0 3px rgba(0,194,255,0.24), current glow 0 0 5px rgba(0,194,255,0.38).
- [ ] Style future, completed and current paths with restrained opacity, width and filter; keep pointer-events none and the SVG below the node layer.
- [ ] Run the integrity script and confirm PASS.
- [ ] Commit with git commit -m "style: reduce radar progress glow".

### Task 4: Add contextual label placement

Files:
- Modify: src/js/radar-progress.js
- Modify: src/js/solucoes.js
- Modify: src/css/solucoes.css
- Modify: tests/radar-progress.test.js
- Modify: tests/site-integrity.ps1

Interfaces:
- Produces node classes label-pos-left, label-pos-right, label-pos-top, label-pos-bottom and label-ring-inner or label-ring-outer.

- [ ] Add failing tests for getLabelPlacement(-90)=top, getLabelPlacement(0)=right, getLabelPlacement(90)=bottom and getLabelPlacement(180)=left.
- [ ] Run node --test tests/radar-progress.test.js and confirm failure because getLabelPlacement is missing.
- [ ] Implement getLabelPlacement using normalized degrees and four quadrant sectors; export it.
- [ ] Apply the placement and ring classes while rendering nodes without changing polar left/top coordinates.
- [ ] Add safe side offsets and text alignment in CSS; add top/bottom offsets; at max-width 768px use a compact vertical stack.
- [ ] Run node --test tests/radar-progress.test.js and tests/site-integrity.ps1.
- [ ] Commit with git commit -m "feat: position radar labels by quadrant".

### Task 5: Visual regression validation and memory synchronization

Files:
- Modify: MD/changelog.md
- Modify: MD/features.md if present; otherwise record the completed feature in MD/contexto_e_plano.md
- Modify: MD/notion.md if present; otherwise record the sync note in MD/changelog.md

- [ ] Run node --test tests/radar-progress.test.js and tests/site-integrity.ps1; require zero failures and site-integrity: PASS.
- [ ] Inspect the local preview at 1440x1000, 1920x1080, 768x1024 and 390x844; confirm restrained active segment, icon gaps and non-overlapping labels.
- [ ] Add a dated changelog entry describing gradient arcs, safe icon gaps, semantic states and quadrant-aware labels.
- [ ] Run git diff --check and git status --short --branch; only intended radar, tests, docs and memory files may be changed.
