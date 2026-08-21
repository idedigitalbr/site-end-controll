const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const styles = fs.readFileSync(path.join(root, 'src', 'css', 'segmentos.css'), 'utf8');
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

test('uses the standard navy in the areas of activity headings', () => {
  assert.match(styles, /\.segmentos-eyebrow\s*\{[\s\S]*?color:\s*#ffffff\s*;[\s\S]*?background:\s*#00215D\s*;[\s\S]*?border-radius:\s*999px\s*;/i);
  assert.match(styles, /\.segmentos-title\s*\{[\s\S]*?color:\s*#00215D\s*;/i);
  assert.match(styles, /\.segmentos-highlight\s*\{[\s\S]*?color:\s*#00215D\s*;/i);
  assert.match(home, /NOSSAS ÁREAS DE ATUAÇÃO/);
  assert.match(home, /Principais <span class="segmentos-highlight">Áreas de Atuação<\/span>/);
});

test('uses Lucide icons without generated inline SVGs or icon shadows', () => {
  const iconNames = ['plane', 'utensils', 'leaf', 'zap', 'train', 'shovel', 'ship', 'flame', 'file-text', 'flask-conical'];

  assert.equal((home.match(/class="endo-acc-icon" data-lucide=/g) || []).length, 10);
  iconNames.forEach((iconName) => {
    assert.match(home, new RegExp(`class="endo-acc-icon" data-lucide="${iconName}"`));
  });
  assert.doesNotMatch(home, /<svg class="endo-acc-icon"/i);
  assert.match(styles, /\.endo-acc-icon\s*\{[\s\S]*?filter:\s*none\s*;/i);
  assert.doesNotMatch(styles, /\.endo-acc-panel:hover \.endo-acc-icon[\s\S]*?filter:\s*drop-shadow/i);
  assert.doesNotMatch(styles, /\.endo-acc-row:hover \.endo-acc-panel\.is-active[^}]*\.endo-acc-icon[\s\S]*?filter:\s*drop-shadow/i);
  assert.match(home, /unpkg\.com\/lucide@0\.321\.0/);
});
