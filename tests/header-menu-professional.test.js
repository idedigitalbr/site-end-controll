const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const mainJs = fs.readFileSync(path.join(root, 'src', 'js', 'main.js'), 'utf8');
const headerCss = fs.readFileSync(path.join(root, 'src', 'css', 'header.css'), 'utf8');
const responsiveCss = fs.readFileSync(path.join(root, 'src', 'css', 'responsive.css'), 'utf8');

test('professional solutions menu keeps all services and creates grouped navigation', () => {
  assert.match(mainJs, /function enhanceSolutionsMenu\(\)/);
  assert.match(mainJs, /solutions-menu-groups/);
  assert.match(mainJs, /Engenharia e Integridade/);
  assert.match(mainJs, /Inspeção e Conformidade/);
  assert.match(mainJs, /Projetos e Tecnologia/);
  assert.match(mainJs, /Fale com um especialista/);
  assert.match(home, /data-service-id="12"/);
});

test('solutions menu uses an accessible button trigger and keyboard dismissal', () => {
  assert.match(mainJs, /aria-controls.*solutions-menu/);
  assert.match(mainJs, /Escape/);
  assert.match(mainJs, /document\.addEventListener\('click'/);
  assert.match(headerCss, /\.drop-link:focus-visible/);
  assert.match(headerCss, /\.dropdown-rich-menu \.dropdown-item-logo[\s\S]*?display:\s*flex/);
});

test('mobile solutions menu is collapsed by default and expands by category', () => {
  assert.match(responsiveCss, /\.solutions-menu-groups/);
  assert.match(responsiveCss, /\.menu-group-items/);
  assert.match(responsiveCss, /max-height:\s*0/);
  assert.match(responsiveCss, /\.menu-group\.is-expanded \.menu-group-items/);
});
