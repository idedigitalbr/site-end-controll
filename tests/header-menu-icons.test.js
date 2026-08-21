const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const mainJs = fs.readFileSync(path.join(root, 'src', 'js', 'main.js'), 'utf8');
const headerCss = fs.readFileSync(path.join(root, 'src', 'css', 'header.css'), 'utf8');
const responsiveCss = fs.readFileSync(path.join(root, 'src', 'css', 'responsive.css'), 'utf8');

test('uses Lucide icons for ENDs and both project services', () => {
  assert.match(mainJs, /const serviceIcons = \{/);
  assert.match(mainJs, /['"]2['"]:\s*'[^']*data-lucide="scan-line"/);
  assert.match(mainJs, /['"]4['"]:\s*'[^']*data-lucide="clipboard-check"/);
  assert.match(mainJs, /['"]5['"]:\s*'[^']*data-lucide="box"/);
  assert.match(mainJs, /querySelectorAll\('\.menu-service-item'\)/);
  assert.match(mainJs, /item\.dataset\.serviceId/);
  assert.match(mainJs, /lucide\.createIcons\(\)/);
  assert.doesNotMatch(mainJs, /serviceIcons[\s\S]{0,180}•/);
});

test('keeps the active desktop solutions chevron visible in white', () => {
  assert.match(headerCss, /\.site-header--light-hero \.main-menu \.dropdown\.is-open > \.drop-link \.menu-chevron[\s\S]*?\{[\s\S]*?color:\s*#ffffff\s*!important/i);
  assert.match(responsiveCss, /\.main-menu \.dropdown\.is-open > \.drop-link \.menu-chevron\s*\{[\s\S]*?color:\s*#00215D\s*!important/i);
});
