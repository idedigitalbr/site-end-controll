const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const styles = fs.readFileSync(path.join(root, 'src', 'css', 'header.css'), 'utf8');
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const menu = home.match(/<div class="dropdown-rich-menu"[\s\S]*?<\/div>\s*<\/div>/i)?.[0] || '';

test('uses a white solutions menu with navy item hover and no visible icons', () => {
  assert.match(styles, /\.dropdown-rich-menu\s*\{[\s\S]*?background:\s*#ffffff\s*!important/i);
  assert.match(styles, /\.dropdown-item-rich\s*\{[\s\S]*?color:\s*#00215d\s*!important/i);
  assert.match(styles, /\.dropdown-item-rich:hover\s*\{[\s\S]*?background:\s*#00215d\s*!important[\s\S]*?color:\s*#ffffff\s*!important/i);
  assert.match(styles, /\.dropdown-rich-menu \.dropdown-item-logo,[\s\S]*?display:\s*none\s*!important/i);
  assert.match(styles, /\.dropdown-rich-menu \.sub-chevron,[\s\S]*?display:\s*none\s*!important/i);
  assert.match(styles, /\.dropdown-rich-menu \.submenuzinho-bullet\s*\{[\s\S]*?display:\s*none\s*!important/i);
  assert.doesNotMatch(menu, /dropdown-item-text">\s*\d+\./i);
});

test('uses white project subitems with navy hover', () => {
  assert.match(styles, /\.submenuzinho-item\s*\{[\s\S]*?background:\s*#ffffff\s*!important[\s\S]*?color:\s*#00215d\s*!important/i);
  assert.match(styles, /\.submenuzinho-item:hover\s*\{[\s\S]*?background:\s*#00215d\s*!important[\s\S]*?color:\s*#ffffff\s*!important/i);
});

test('adds Vagas and turns Fale com Especialista into a direct WhatsApp link', () => {
  assert.match(home, /<a href="index\.html#oportunidades">Vagas<\/a>/i);
  assert.match(home, /<a class="btn-contacts-menu" href="https:\/\/wa\.me\/5591984040710"[^>]*>Fale com Especialista<\/a>/i);
  assert.doesNotMatch(home, /contacts-dropdown/i);
});
