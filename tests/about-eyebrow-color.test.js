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
  assert.match(rule[1], /color:\s*#ffffff\s*;/i);
  assert.match(rule[1], /background:\s*#00215D\s*;/i);
  assert.match(rule[1], /border-radius:\s*999px\s*;/i);
  assert.match(lineRule[1], /display:\s*none\s*;/i);
  assert.match(highlightRule[1], /color:\s*#00215D\s*;/i);
  assert.match(highlightRule[1], /background:\s*none\s*;/i);
  assert.match(home, /sections\.css\?v=53\.0/);
  assert.match(home, /<span class="highlight-blue-gradient">confiança<br>e resultado<\/span>/);
});

test('styles the Sobre a EndControl CTA with the requested navy treatment', () => {
  const buttonRule = styles.match(/\.btn-about-outline-premium\s*\{([\s\S]*?)\}/);
  const buttonHoverRule = styles.match(/\.btn-about-outline-premium:hover\s*\{([\s\S]*?)\}/);

  assert.ok(buttonRule, 'a regra do botão Sobre a EndControl precisa existir');
  assert.ok(buttonHoverRule, 'a regra de hover do botão Sobre a EndControl precisa existir');
  assert.match(buttonRule[1], /border:\s*1\.5px\s+solid\s+#00215D\s*;/i);
  assert.match(buttonRule[1], /color:\s+#00215D\s*;/i);
  assert.match(buttonHoverRule[1], /background:\s+#00215D\s*;/i);
  assert.match(buttonHoverRule[1], /border-color:\s+#00215D\s*;/i);
  assert.doesNotMatch(home, /<span class="btn-about-icon-circle">/i);
  assert.match(home, /<svg class="btn-about-arrow-right"/i);
  assert.match(home, /sections\.css\?v=53\.0/);
});

test('uses the project Lucide icon standard and navy hover treatment in the values banner', () => {
  const iconRule = styles.match(/\.about-value-icon-circle\s*\{([\s\S]*?)\}/);
  const iconHoverRule = styles.match(/\.about-value-item:hover \.about-value-icon-circle\s*\{([\s\S]*?)\}/);

  assert.ok(iconRule, 'a regra dos ícones dos valores precisa existir');
  assert.ok(iconHoverRule, 'a regra de hover dos ícones dos valores precisa existir');
  assert.match(iconRule[1], /border:\s*1\.5px\s+solid\s+#00215D\s*;/i);
  assert.match(iconRule[1], /color:\s+#00215D\s*;/i);
  assert.match(iconHoverRule[1], /background:\s+#00215D\s*;/i);
  assert.match(iconHoverRule[1], /border-color:\s+#00215D\s*;/i);
  assert.match(home, /unpkg\.com\/lucide@0\.321\.0/);
  assert.match(home, /class="about-value-lucide" data-lucide="shield"/);
  assert.match(home, /class="about-value-lucide" data-lucide="shield-check"/);
  assert.match(home, /class="about-value-lucide" data-lucide="activity"/);
  assert.match(home, /class="about-value-lucide" data-lucide="leaf"/);
  assert.match(home, /sections\.css\?v=53\.0/);
});
