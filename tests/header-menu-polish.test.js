const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const mainJs = fs.readFileSync(path.join(root, 'src', 'js', 'main.js'), 'utf8');
const headerCss = fs.readFileSync(path.join(root, 'src', 'css', 'header.css'), 'utf8');
const responsiveCss = fs.readFileSync(path.join(root, 'src', 'css', 'responsive.css'), 'utf8');

test('uses a real chevron SVG instead of the broken text glyph', () => {
  assert.match(mainJs, /setAttribute\('class', 'menu-chevron'\)/);
  assert.match(mainJs, /setAttribute\('points', '6 9 12 15 18 9'\)/);
  assert.match(headerCss, /\.menu-chevron\s*\{[\s\S]*?color:\s*#00215D/i);
  assert.match(headerCss, /\.main-menu \.drop-link::after\s*\{[\s\S]*?content:\s*none/i);
});

test('keeps solution icons and their borders in the corporate navy', () => {
  assert.match(headerCss, /\.dropdown-rich-menu \.menu-service-item \.dropdown-item-logo\s*\{[\s\S]*?border:\s*1px solid #00215D[\s\S]*?color:\s*#00215D/i);
  assert.match(headerCss, /\.dropdown-rich-menu \.menu-service-item::before\s*\{[\s\S]*?display:\s*none\s*!important/i);
});

test('uses a white mobile menu with navy navigation text', () => {
  assert.match(responsiveCss, /\.main-menu\s*\{[\s\S]*?background:\s*#ffffff\s*!important/i);
  assert.match(responsiveCss, /\.main-menu \.dropdown-rich-menu\s*\{[\s\S]*?background:\s*#ffffff\s*!important/i);
  assert.match(responsiveCss, /\.main-menu \.dropdown > \.drop-link\s*\{[\s\S]*?color:\s*#00215D\s*!important/i);
});
