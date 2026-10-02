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
  assert.doesNotMatch(mainJs, /solutions-menu-cta/);
  assert.match(home, /data-service-id="12"/);
});

test('solutions menu category titles use the dark brand color', () => {
  assert.match(headerCss, /\.menu-group-title\s*\{[\s\S]*?color:\s*#071429;/);
  assert.match(headerCss, /\.menu-group-chevron\s*\{[\s\S]*?color:\s*#071429;/);
  assert.match(responsiveCss, /\.menu-group-title\s*\{[\s\S]*?color:\s*#071429;/);
  assert.match(responsiveCss, /\.menu-group-chevron\s*\{[\s\S]*?color:\s*#071429;/);
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

test('desktop solutions menu is positioned to the right of the header container and does not overflow screens', () => {
  assert.match(headerCss, /@media\s*\(min-width:\s*981px\)\s*\{[\s\S]*?\.site-header\s+\.dropdown\s*\{[\s\S]*?position:\s*static/);
  assert.match(headerCss, /@media\s*\(min-width:\s*981px\)\s*\{[\s\S]*?\.site-header\s+\.drop-panel\.dropdown-rich-menu\s*\{[\s\S]*?right:\s*max\(/);
  assert.match(headerCss, /@media\s*\(min-width:\s*981px\)\s*\{[\s\S]*?transform:\s*translateY\(10px\)/);
  assert.match(headerCss, /\.dropdown-rich-menu\s*\{[\s\S]*?max-width:\s*calc\(100vw\s*-\s*32px\)/);
});

test('category title does not have a border line separating it from the description text', () => {
  assert.match(headerCss, /\.menu-group-title\s*\{[\s\S]*?border-bottom:\s*0;/);
  assert.doesNotMatch(headerCss, /\.menu-group-title\s*\{[^}]*?border-bottom:\s*1px/);
});

test('solutions menu item fills the icon container with brand color and turns icon white on hover', () => {
  assert.match(headerCss, /\.dropdown-rich-menu \.menu-service-item:hover \.dropdown-item-logo[\s\S]*?background:\s*var\(--brand-primary\)\s*!important/);
  assert.match(headerCss, /\.dropdown-rich-menu \.menu-service-item:hover \.dropdown-item-logo[\s\S]*?color:\s*#ffffff\s*!important/);
  assert.match(headerCss, /\.dropdown-rich-menu \.menu-service-item:hover \.dropdown-item-logo svg[\s\S]*?stroke:\s*#ffffff\s*!important/);
  assert.match(responsiveCss, /\.dropdown-rich-menu \.menu-service-item:hover \.dropdown-item-logo[\s\S]*?background:\s*var\(--brand-primary\)\s*!important/);
});


