const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const styles = fs.readFileSync(path.join(root, 'src', 'css', 'sections.css'), 'utf8');
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

test('uses the requested navy color for the Sobre a EndControl eyebrow', () => {
  const rule = styles.match(/\.about-eyebrow\s*\{([\s\S]*?)\}/);

  assert.ok(rule, 'a regra .about-eyebrow precisa existir');
  assert.match(rule[1], /color:\s*#00215D\s*;/i);
  assert.match(home, /sections\.css\?v=40\.0/);
});
