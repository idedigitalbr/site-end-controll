const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const solutionsSection = html.match(/<section class="solucoes-section[\s\S]*?<\/section>/)?.[0] || '';

test('removes the four indicators from the Soluções section', () => {
  assert.ok(solutionsSection, 'a seção de soluções precisa existir');
  assert.doesNotMatch(solutionsSection, /class="solucoes-stats-left"/);
  assert.doesNotMatch(solutionsSection, /\+18[\s\S]*?de experiência/);
  assert.doesNotMatch(solutionsSection, /\+300[\s\S]*?especialistas/);
  assert.doesNotMatch(solutionsSection, /100%[\s\S]*?território nacional/);
  assert.doesNotMatch(solutionsSection, /\+1\.250[\s\S]*?projetos entregues/);
});

test('removes the duplicated bottom statistics bar', () => {
  assert.doesNotMatch(html, /<div class="bottom-bar-stats" id="statsBar">/);
  assert.doesNotMatch(html, /<div class="bottom-bar-feed">/);
});

test('keeps the automatic radar advance on a fixed ten-second cadence', () => {
  const solucoes = fs.readFileSync(path.join(__dirname, '..', 'src', 'js', 'solucoes.js'), 'utf8');

  assert.match(solucoes, /autoAdvanceInterval:\s*10000/);
  assert.match(solucoes, /autoAdvanceInterval\s*-\s*RADAR_CONFIG\.transitionDuration/);
  assert.match(html, /src="\.\/src\/js\/solucoes\.js\?v=63\.0"/);
});
