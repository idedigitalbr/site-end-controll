const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const solucoes = fs.readFileSync(path.join(root, 'src', 'js', 'solucoes.js'), 'utf8');
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

test('removes service numbering from radar labels and the initial card', () => {
  assert.match(solucoes, /\btitle,\s*\r?\n\s*shortTitle,/);
  assert.doesNotMatch(solucoes, /title:\s*`\$\{stepIndex \+ 1\}\./);
  assert.doesNotMatch(solucoes, /shortTitle:\s*`\$\{stepIndex \+ 1\}\./);
  assert.match(home, /alt="Engenharia de Integridade Estrutural"/);
  assert.match(home, /<h3 class="highlight-card-title" id="cardTitle">Engenharia de Integridade Estrutural<\/h3>/);
});

test('calculates card arrow navigation from the pending or selected service', () => {
  assert.match(solucoes, /const navigationIndex = sweepTargetIndex \?\? selectedIndex \?\? activeIndex;/);
  assert.match(solucoes, /navigationIndex - 1 \+ servicesData\.length/);
  assert.match(solucoes, /navigationIndex \+ 1\) % servicesData\.length/);
});

test('stops an in-progress automatic sweep when the card is hovered', () => {
  assert.match(solucoes, /function handleHoverEnter\(\) \{[^}]*stopAutoPlay\(\);[^}]*clearResumeTimer\(\);[^}]*stopSweepAtCurrentPosition\(\);/);
  assert.match(solucoes, /function handleHoverEnter\(\) \{[^}]*sweepTargetIndex = null;/);
});
