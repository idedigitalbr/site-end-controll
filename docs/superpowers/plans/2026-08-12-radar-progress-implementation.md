# Radar Progress Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task with verification checkpoints.

**Goal:** Replace the global visited SVG trail with explicit clockwise progress segments per ring, with predictable `completed`, `active`, `next` and `inactive` states.

**Architecture:** Keep service content and the existing desktop composition, but add a small pure `RadarProgress` module for state and connection rules. `solucoes.js` will render a stable SVG segment layer and synchronize the card/autoplay with `activeStep`; CSS will animate classes without rebuilding the radar.

**Tech Stack:** Vanilla JavaScript, SVG paths, CSS transitions/keyframes, Node 24 built-in `node:test`, PowerShell integrity checks, Codex in-app browser for desktop verification.

## Global Constraints

- Work only in `G:\Meu Drive\.PROJETOS\Sites Institucionais\site-end-controll`.
- Keep the focus on desktop behavior; do not redesign tablet/mobile layout in this pass.
- Preserve the existing visual language, card, arrows, dots, autoplay and counter behavior.
- Never generate a connection between different `ringIndex` values.
- Never use a radial/diagonal connection through the radar center for progress.
- Do not add external dependencies.
- Do not stage or commit the unrelated changes already present in the working tree.

---

### Task 1: Add failing unit tests for the progress rules

**Files:**
- Create: `tests/radar-progress.test.js`
- Read: `docs/superpowers/specs/2026-08-12-radar-progress-design.md`

**Interfaces:**
- The tests will consume `require('../src/js/radar-progress.js')`.
- The module must export `canConnect`, `buildConnections` and `getProgressState`.

- [ ] **Step 1: Write the failing tests**

Create a twelve-step fixture with steps 0–5 in `ringIndex: 0` and steps 6–11 in `ringIndex: 1`. Assert the user-visible rules:

```js
const assert = require('node:assert/strict');
const test = require('node:test');
const {
  buildConnections,
  canConnect,
  getProgressState
} = require('../src/js/radar-progress.js');

const services = Array.from({ length: 12 }, (_, stepIndex) => ({
  stepIndex,
  ringIndex: stepIndex < 6 ? 0 : 1,
  positionInRing: stepIndex % 6,
  angle: stepIndex < 6 ? -90 + stepIndex * 60 : -60 + (stepIndex - 6) * 60
}));

test('selecting item 2 activates only the 1 to 2 segment and marks item 3 as next', () => {
  const state = getProgressState(services, 1);

  assert.deepEqual(state.nodes.map(node => node.state).slice(0, 4), [
    'completed', 'active', 'next', 'inactive'
  ]);

  const active = state.connections
    .filter(connection => connection.state === 'active')
    .map(connection => [connection.fromStepIndex, connection.toStepIndex]);

  assert.deepEqual(active, [[0, 1]]);
});

test('jumping directly to item 6 activates every preceding segment in ring 1', () => {
  const state = getProgressState(services, 5);
  const active = state.connections
    .filter(connection => connection.state === 'active' && !connection.isClosing)
    .map(connection => [connection.fromStepIndex, connection.toStepIndex]);

  assert.deepEqual(active, [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]]);
  assert.equal(state.nodes[5].state, 'active');
  assert.equal(state.nodes[6].state, 'next');
});

test('returning from item 6 to item 2 removes later progress', () => {
  const state = getProgressState(services, 1);
  const active = state.connections
    .filter(connection => connection.state === 'active')
    .map(connection => [connection.fromStepIndex, connection.toStepIndex]);

  assert.deepEqual(active, [[0, 1]]);
  assert.equal(state.nodes[2].state, 'next');
  assert.equal(state.nodes[5].state, 'inactive');
});

test('item 6 and item 7 never produce a cross-ring connection', () => {
  const connections = buildConnections(services);

  assert.equal(connections.some(connection =>
    connection.fromStepIndex === 5 && connection.toStepIndex === 6
  ), false);

  assert.equal(connections.every(connection => {
    const from = services[connection.fromStepIndex];
    const to = services[connection.toStepIndex];
    return from.ringIndex === to.ringIndex;
  }), true);
});

test('selecting item 7 keeps ring 1 complete and starts ring 2 independently', () => {
  const state = getProgressState(services, 6);

  assert.ok(state.nodes.slice(0, 6).every(node => node.state === 'completed'));
  assert.equal(state.nodes[6].state, 'active');
  assert.equal(state.nodes[7].state, 'next');
  assert.equal(state.connections.some(connection =>
    connection.fromStepIndex === 5 && connection.toStepIndex === 6
  ), false);
});

test('only the last item of a ring can activate its explicit closing segment', () => {
  const stateAtSix = getProgressState(services, 5);
  const stateAtSeven = getProgressState(services, 6);

  const ringOneClosure = connection =>
    connection.isClosing && connection.fromStepIndex === 5 && connection.toStepIndex === 0;

  assert.equal(stateAtSix.connections.some(connection =>
    ringOneClosure(connection) && connection.state === 'active'
  ), true);
  assert.equal(stateAtSeven.connections.some(connection =>
    ringOneClosure(connection) && connection.state === 'active'
  ), true);
});

test('canConnect accepts only consecutive positions within one ring', () => {
  assert.equal(canConnect(services[0], services[1]), true);
  assert.equal(canConnect(services[0], services[2]), false);
  assert.equal(canConnect(services[5], services[6]), false);
});
```

- [ ] **Step 2: Run the new test and verify the expected failure**

Run:

```powershell
node --test tests/radar-progress.test.js
```

Expected result: the test runner fails because `src/js/radar-progress.js` does not exist yet. This is the intended RED state.

### Task 2: Implement the pure progress model

**Files:**
- Create: `src/js/radar-progress.js`
- Test: `tests/radar-progress.test.js`

**Interfaces:**
- `canConnect(from, to) -> boolean`
- `buildConnections(services) -> Array<{fromStepIndex, toStepIndex, ringIndex, isClosing, ringLastStepIndex}>`
- `getNodeState(stepIndex, activeStep, totalSteps) -> 'completed'|'active'|'next'|'inactive'`
- `getConnectionState(connection, activeStep) -> 'active'|'inactive'`
- `getProgressState(services, activeStep) -> {activeStep, nextStep, nodes, connections}`

- [ ] **Step 1: Implement the smallest UMD-compatible module**

Use a browser global (`window.RadarProgress`) and CommonJS export for Node tests. `buildConnections` must group services by `ringIndex`, sort by `positionInRing`, create only consecutive non-closing edges, and then add one explicit last-to-first closing edge per ring. It must never inspect adjacent global array indexes as a connection shortcut.

`getProgressState` must derive node states from `activeStep`. Regular connections are active when `toStepIndex <= activeStep`; closing connections are active when `activeStep >= ringLastStepIndex`.

- [ ] **Step 2: Run the focused tests**

Run:

```powershell
node --test tests/radar-progress.test.js
```

Expected result: PASS for all progress and connection tests.

### Task 3: Replace the generic SVG trail with stable per-segment rendering

**Files:**
- Modify: `index.html:670-672`
- Modify: `index.html:1597`
- Modify: `index.html:204-267`
- Modify: `src/js/solucoes.js:223-464`
- Test: `tests/radar-progress.test.js`

**Interfaces:**
- `window.RadarProgress` is loaded before `solucoes.js`.
- `solucoes.js` consumes `getProgressState` and renders each connection without recreating the SVG layer on selection.

- [ ] **Step 1: Replace the single path placeholder**

In the existing radar SVG, replace:

```html
<path id="radarTrailPath" d="" />
```

with:

```html
<g id="radarConnectionsLayer" aria-hidden="true"></g>
```

Load `src/js/radar-progress.js` immediately before `src/js/solucoes.js`.

- [ ] **Step 2: Add explicit step metadata to the service records**

Keep the existing service content and angles, but add `stepIndex`, `ringIndex` and `positionInRing` for all twelve records. The first six use the outer radius and positions 0–5; the remaining six use the inner radius and positions 0–5.

- [ ] **Step 3: Render one clockwise arc per valid connection**

Create a `describeRadarArc(from, to)` helper in `solucoes.js` that converts the two service angles to the existing 500×500 SVG viewBox and returns only an `M ... A ...` path. Use the same ring radius for both endpoints and `sweepFlag=1` so the arc follows the clockwise sequence.

For each connection from `RadarProgress.buildConnections(servicesData)`, append one SVG path to `radarConnectionsLayer` and store its element beside the connection metadata. Do not append a segment for different rings, and do not use `L` for progress connections.

- [ ] **Step 4: Derive node and connection classes from activeStep**

Replace `visitedIndices`, `visitedSequence`, `updateRadarTrail` and their mutation in `goToService`. Keep `activeIndex` as the selected step value or rename it to `activeStep` consistently.

On each selection:

```js
const progressState = RadarProgress.getProgressState(servicesData, activeStep);
```

Toggle exactly one node class among `is-completed`, `is-active`, `is-next` and `is-inactive`. Toggle each connection between `is-active` and `is-inactive`. Keep `aria-current="true"` only on the active node.

- [ ] **Step 5: Preserve existing card, autoplay and navigation behavior**

Keep the current card transition, progress dots, side arrows, hover pause and five-second autoplay. The autoplay must call the same `goToService` path so 6→7 and 12→1 obey the connection rules.

- [ ] **Step 6: Normalize the menu service IDs**

Set the “Nossas Soluções” menu items to use IDs 0 through 11 in displayed order. Preserve the current labels and links; only correct the `data-service-id` values so menu selection matches the radar sequence.

### Task 4: Add four visual states and subtle next-step animation

**Files:**
- Modify: `src/css/solucoes.css:462-600`
- Modify: `src/css/solucoes.css:263-281`

**Interfaces:**
- Node classes come from `solucoes.js`.
- Connection classes come from `solucoes.js`.

- [ ] **Step 1: Replace the old three-state/visited CSS block**

Remove selectors for `is-previous`, `is-visited` and `service-node--previous`. Define the four requested states with the current cyan palette:

```css
.service-node.is-completed { ... }
.service-node.is-active { ... }
.service-node.is-next { ... }
.service-node.is-inactive { ... }
```

`active` keeps the strongest current glow; `completed` keeps a readable intermediate glow; `next` stays visible but softer; `inactive` remains subdued.

- [ ] **Step 2: Add stable connection styles**

Define `.radar-connection` with a low-opacity inactive stroke and transitions for `opacity`, `stroke`, `filter` and `stroke-width`. Define `.radar-connection.is-active` with the cyan glow. Keep the SVG layer below the node layer.

- [ ] **Step 3: Add the next-step pulse and reduced-motion behavior**

Use a slow CSS keyframe on `.service-node.is-next .service-node-icon` with small scale/glow variation. Add a `@media (prefers-reduced-motion: reduce)` override that disables the pulse and shortens transitions.

- [ ] **Step 4: Remove duplicate inactive-hover declarations**

Keep one final hover rule for inactive nodes, without overriding itself later in the file.

### Task 5: Extend project checks for the radar structure

**Files:**
- Modify: `tests/site-integrity.ps1`

- [ ] **Step 1: Add static invariants**

Add assertions that:

- `index.html` contains `radarConnectionsLayer`.
- `index.html` no longer contains `radarTrailPath`.
- `index.html` loads `radar-progress.js` before `solucoes.js`.
- `src/js/solucoes.js` no longer contains `visitedSequence`, `visitedIndices` or `updateRadarTrail`.
- `src/js/solucoes.js` contains `ringIndex` and `positionInRing`.

- [ ] **Step 2: Run the project integrity check**

Run:

```powershell
pwsh -NoProfile -File tests/site-integrity.ps1
```

Expected result: `site-integrity: PASS`.

### Task 6: Verify the desktop interaction scenarios

**Files:**
- Verify: `index.html`, `src/js/radar-progress.js`, `src/js/solucoes.js`, `src/css/solucoes.css`
- Run: `tests/radar-progress.test.js`, `tests/site-integrity.ps1`

- [ ] **Step 1: Run all automated checks**

```powershell
node --test tests/radar-progress.test.js
pwsh -NoProfile -File tests/site-integrity.ps1
```

- [ ] **Step 2: Open the local site at 1440×900**

Use the existing local server on port 4173 when available, or start `python -m http.server 4173` from the project root. Open `http://127.0.0.1:4173/index.html` in the Codex in-app browser at a 1440×900 viewport.

- [ ] **Step 3: Verify item 1 and item 2**

Confirm item 1 starts active, item 2 is the only `next` item, and selecting item 2 activates only the segment 1→2.

- [ ] **Step 4: Verify the jump and return in ring 1**

Select item 6 directly and confirm segments 1→2 through 5→6 are active. Select item 2 and confirm later segments fade inactive and item 3 becomes the only `next` item.

- [ ] **Step 5: Verify the ring boundary**

Select item 7 after item 6. Confirm items 1–6 remain completed, item 7 is active, item 8 is next, and no SVG path or computed connection references 5→6 as a cross-ring edge.

- [ ] **Step 6: Verify ring 2 and reverse navigation**

Advance through items 8–12, then return to an item in ring 1. Confirm only same-ring neighbor segments exist, no active path crosses the center, and later progress is removed according to `activeStep`.

- [ ] **Step 7: Verify motion and card synchronization**

Confirm only the next item pulses, transitions are smooth, the card content follows the active item, and the section remains stable while autoplay advances.

### Task 7: Review the diff and commit only the radar refactor

**Files:**
- Review: `index.html`, `src/js/radar-progress.js`, `src/js/solucoes.js`, `src/css/solucoes.css`, `tests/radar-progress.test.js`, `tests/site-integrity.ps1`

- [ ] **Step 1: Inspect the scoped diff**

Run:

```powershell
git diff -- index.html src/js/radar-progress.js src/js/solucoes.js src/css/solucoes.css tests/radar-progress.test.js tests/site-integrity.ps1
```

Confirm unrelated existing modifications are not included in the staged set.

- [ ] **Step 2: Stage only the radar files**

```powershell
git add -- index.html src/js/radar-progress.js src/js/solucoes.js src/css/solucoes.css tests/radar-progress.test.js tests/site-integrity.ps1
```

- [ ] **Step 3: Commit the verified refactor**

```powershell
git commit -m "refactor: make radar progress ring-aware"
```
