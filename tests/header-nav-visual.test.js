const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const styles = fs.readFileSync(path.join(root, 'src', 'css', 'header.css'), 'utf8');
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const menu = home.match(/<div class="dropdown-rich-menu"[\s\S]*?<\/div>\s*<\/div>/i)?.[0] || '';

test('uses a white grouped solutions menu with navy item hover and visible icons', () => {
  assert.match(styles, /\.dropdown-rich-menu\s*\{[\s\S]*?background:\s*#ffffff\s*!important/i);
  assert.match(styles, /\.dropdown-item-rich\s*\{[\s\S]*?color:\s*#00215d\s*!important/i);
  assert.match(styles, /\.dropdown-item-rich:hover\s*\{[\s\S]*?background:\s*#00215d\s*!important[\s\S]*?color:\s*#ffffff\s*!important/i);
  assert.match(styles, /\.dropdown-rich-menu \.menu-service-item \.dropdown-item-logo\s*\{[\s\S]*?display:\s*flex\s*!important/i);
  assert.match(styles, /\.solutions-menu-groups\s*\{[\s\S]*?grid-template-columns:\s*repeat\(3/i);
  assert.match(styles, /\.solutions-menu-aside\s*\{[\s\S]*?background:\s*#00215d/i);
  assert.doesNotMatch(menu, /dropdown-item-text">\s*\d+\./i);
});

test('uses white project subitems with navy hover', () => {
  assert.match(styles, /\.submenuzinho-item\s*\{[\s\S]*?background:\s*#ffffff\s*!important[\s\S]*?color:\s*#00215d\s*!important/i);
  assert.match(styles, /\.submenuzinho-item:hover\s*\{[\s\S]*?background:\s*#00215d\s*!important[\s\S]*?color:\s*#ffffff\s*!important/i);
});

test('keeps internal solution navigation text white on navy active and hover states', () => {
  assert.doesNotMatch(
    styles,
    /\.site-header--light-hero\s+\.drop-link\.active\s*\{[^}]*color:\s*#0066ff/i,
    'the active solutions link must not reintroduce the blue-on-navy contrast bug'
  );
  assert.match(
    styles,
    /\.site-header--light-hero\s+\.drop-link:hover\s*\{[^}]*color:\s*#ffffff\s*!important/i,
    'the internal solutions link hover must override legacy inline colors'
  );
});

test('adds Vagas and turns Fale com Especialista into a direct WhatsApp link', () => {
  assert.match(home, /<a href="index\.html#oportunidades">Vagas<\/a>/i);
  assert.match(home, /<a class="btn-contacts-menu" href="https:\/\/wa\.me\/5591984040710"[^>]*>Fale com Especialista<\/a>/i);
  assert.doesNotMatch(home, /contacts-dropdown/i);
});

test('removes the blue glow from the Home contact button hover', () => {
  assert.match(
    styles,
    /(?:^|\r?\n)\.main-menu \.btn-contacts-menu\s*\{[^}]*?box-shadow:\s*none\s*!important;/i
  );
  assert.match(
    styles,
    /(?:^|\r?\n)\.main-menu \.btn-contacts-menu:hover\s*\{[^}]*?box-shadow:\s*none\s*!important;/i
  );
});
