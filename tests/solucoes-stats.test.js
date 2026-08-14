const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

test('shows national coverage and projects in the left statistics block', () => {
  const stats = html.match(/<div class="solucoes-stats-left">([\s\S]*?)<!--[\s\S]*?COL CENTRAL/);

  assert.ok(stats, 'o bloco de estatísticas da seção de soluções precisa existir');
  assert.match(stats[0], /100%[\s\S]*?território nacional/);
  assert.match(stats[0], /\+1\.250[\s\S]*?projetos entregues/);
});

test('removes the duplicated bottom statistics bar', () => {
  assert.doesNotMatch(html, /<div class="bottom-bar-stats" id="statsBar">/);
  assert.doesNotMatch(html, /<div class="bottom-bar-feed">/);
});
