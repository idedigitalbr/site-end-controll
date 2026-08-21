const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const styles = fs.readFileSync(path.join(root, 'src', 'css', 'sections.css'), 'utf8');
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

test('uses the standard navy in the FAQ section accents and states', () => {
  assert.match(styles, /\.faq-v2-eyebrow\s*\{[\s\S]*?color:\s*#ffffff\s*;[\s\S]*?background:\s*#00215D\s*;[\s\S]*?border-radius:\s*999px\s*;/i);
  assert.match(styles, /\.faq-v2-highlight\s*\{[\s\S]*?color:\s*#00215D\s*;/i);
  assert.match(styles, /\.faq-v2-question:hover\s*\{[\s\S]*?color:\s*#00215D\s*;/i);
  assert.match(styles, /\.faq-v2-question::after\s*\{[\s\S]*?color:\s*#00215D\s*;/i);
  assert.match(styles, /\.faq-v2-item\.active \.faq-v2-question\s*\{[\s\S]*?color:\s*#00215D\s*;/i);
  assert.match(styles, /\.faq-v2-item\s*\{[\s\S]*?border:\s*1px\s+solid\s+rgba\(0,\s*33,\s*93/i);
  assert.match(home, /DÚVIDAS FREQUENTES/);
  assert.match(home, /<span class="faq-v2-highlight">principais dúvidas\.<\/span>/);
  assert.match(home, /sections\.css\?v=52\.0/);
});
