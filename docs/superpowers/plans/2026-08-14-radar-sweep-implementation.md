# Radar Sweep Line — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task with verification checkpoints.

**Goal:** Reforçar o feixe rotativo do radar com cone ciano mais presente, núcleo branco-ciano, halo e rastro suave, preservando a animação e a composição existente.

**Architecture:** A mudança ficará concentrada na camada CSS `.radar-sweep` e nos seus pseudo-elementos. O JavaScript continuará responsável apenas por animar o `transform` do elemento; os arcos SVG, nós, labels e card não serão alterados.

**Tech Stack:** CSS nativo, Web Animations API já existente, Node `node:test`, PowerShell e preview local no navegador.

## Global Constraints

- Não alterar a geometria dos anéis, os arcos SVG, a ordem dos serviços ou a navegação.
- Não adicionar dependências, imagens ou estado JavaScript.
- Preservar `pointer-events: none`, `prefers-reduced-motion` e o layout responsivo.
- Não incluir no commit as alterações já existentes no working tree.

---

### Task 1: Add failing structural checks for the sweep layers

**Files:**
- Modify: `tests/site-integrity.ps1`
- Read: `src/css/solucoes.css`

**Interfaces:**
- Produces assertions that require the new sweep tokens and layered selectors before the CSS is changed.

- [ ] **Step 1: Add assertions for the intended sweep contract**

  Extend the existing CSS checks to require:

  ```powershell
  Assert-Contains $solucoesCss '--radar-sweep-core-opacity'
  Assert-Contains $solucoesCss '--radar-sweep-halo-opacity'
  Assert-Contains $solucoesCss '.radar-sweep::before'
  Assert-Contains $solucoesCss '.radar-sweep::after'
  Assert-Contains $solucoesCss 'filter: blur(3px)'
  ```

- [ ] **Step 2: Run the targeted integrity check and verify RED**

  Run:

  ```powershell
  powershell -ExecutionPolicy Bypass -File tests/site-integrity.ps1
  ```

  Expected: FAIL because the new sweep tokens and blur declaration are not present yet.

### Task 2: Implement the stronger sweep with CSS layers

**Files:**
- Modify: `src/css/solucoes.css:264-344`

**Interfaces:**
- Consumes: the existing `.radar-sweep` transform animation from `src/js/solucoes.js`.
- Produces: the same `.radar-sweep` DOM surface with a brighter rotating cone, crisp core and controlled glow.

- [ ] **Step 1: Add centralized sweep tokens**

  Add the following tokens beside the existing radar line variables:

  ```css
  --radar-sweep-core-opacity: 0.96;
  --radar-sweep-halo-opacity: 0.34;
  --radar-sweep-tail-opacity: 0.18;
  ```

- [ ] **Step 2: Expand the conic sweep without creating a permanent disk**

  Keep the circular mask and replace the discrete cone stops with a sharper leading edge plus a longer, fading tail. The strongest stop must remain near the leading edge, with transparency at both ends.

- [ ] **Step 3: Turn `::before` into the layered beam core**

  Use a 2px vertical gradient with a white-cyan center, `filter: blur(3px)` on the outer glow, and a separate crisp inset effect through `box-shadow` so the line stays legible while rotating.

- [ ] **Step 4: Keep `::after` as a restrained origin pulse**

  Preserve the center dot, increase its contrast slightly and keep its size small enough that it does not compete with the center logo.

- [ ] **Step 5: Preserve reduced-motion behavior**

  Keep the existing `prefers-reduced-motion` override and use the new opacity tokens so the effect becomes quieter without disappearing.

- [ ] **Step 6: Run the integrity check and verify GREEN**

  Run:

  ```powershell
  powershell -ExecutionPolicy Bypass -File tests/site-integrity.ps1
  ```

  Expected: PASS, including the new sweep assertions.

### Task 3: Run regression checks and visual validation

**Files:**
- Modify: `MD/changelog.md`
- Modify: `MD/features.md`
- Modify: `MD/notion.md`

**Interfaces:**
- Consumes: the completed CSS-only sweep refinement.
- Produces: verified behavior and local project memory entries.

- [ ] **Step 1: Run radar unit tests**

  ```powershell
  node --test tests/radar-progress.test.js
  ```

  Expected: PASS with all existing radar state and geometry tests.

- [ ] **Step 2: Run the full site integrity script**

  ```powershell
  powershell -ExecutionPolicy Bypass -File tests/site-integrity.ps1
  ```

  Expected: PASS.

- [ ] **Step 3: Check whitespace and inspect the diff**

  ```powershell
  git diff --check
  git diff -- src/css/solucoes.css tests/site-integrity.ps1 MD/changelog.md MD/features.md MD/notion.md
  ```

  Confirm that no unrelated existing changes are staged or rewritten.

- [ ] **Step 4: Verify the preview at desktop and mobile widths**

  Open the local preview and inspect 1440px, 1920px, 768px and 390px widths. Confirm that the sweep remains centered, its core is readable, the halo fades before obscuring labels, and no horizontal overflow appears.

- [ ] **Step 5: Update project memory**

  Add a dated entry describing the stronger CSS sweep, its three visual layers, and the validations executed. Do not record an external Notion sync unless explicitly requested.
