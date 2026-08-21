const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const styles = fs.readFileSync(path.join(root, 'src', 'css', 'sections.css'), 'utf8');
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

test('uses the requested navy color for the Sobre a EndControl eyebrow', () => {
  const rule = styles.match(/\.about-eyebrow\s*\{([\s\S]*?)\}/);
  const lineRule = styles.match(/\.about-eyebrow::after\s*\{([\s\S]*?)\}/);
  const highlightRule = styles.match(/\.about-premium-section \.highlight-blue-gradient\s*\{([\s\S]*?)\}/);

  assert.ok(rule, 'a regra .about-eyebrow precisa existir');
  assert.ok(lineRule, 'a linha decorativa do eyebrow precisa existir');
  assert.ok(highlightRule, 'a regra do destaque azul precisa existir');
  assert.match(rule[1], /color:\s*#00215D\s*;/i);
  assert.match(lineRule[1], /background:\s*#00215D\s*;/i);
  assert.match(lineRule[1], /opacity:\s*1\s*;/i);
  assert.match(highlightRule[1], /color:\s*#00215D\s*;/i);
  assert.match(highlightRule[1], /background:\s*none\s*;/i);
  assert.match(home, /sections\.css\?v=40\.0/);
  assert.match(home, /<span class="highlight-blue-gradient">confiança<br>e resultado<\/span>/);
});
