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

test('normalizes every mega menu service icon through the shared Lucide map', () => {
  const expectedIcons = {
    0: 'shield-check',
    1: 'landmark',
    2: 'scan-line',
    3: 'flame',
    4: 'clipboard-check',
    5: 'box',
    6: 'share-2',
    8: 'file-check-2',
    9: 'clock-3',
    10: 'circle-dot',
    11: 'award',
    12: 'message-square'
  };

  for (const [id, icon] of Object.entries(expectedIcons)) {
    assert.match(
      mainJs,
      new RegExp(`[\\\"']${id}[\\\"']:\\s*'[^']*data-lucide=\\\"${icon}\\\"`),
      `service ${id} should have a deterministic Lucide icon`
    );
  }
});

test('keeps the active desktop solutions chevron visible in white', () => {
  assert.match(headerCss, /\.site-header--light-hero \.main-menu \.dropdown\.is-open > \.drop-link \.menu-chevron[\s\S]*?\{[\s\S]*?color:\s*#ffffff\s*!important/i);
  assert.match(responsiveCss, /\.main-menu \.dropdown\.is-open > \.drop-link \.menu-chevron\s*\{[\s\S]*?color:\s*#00215D\s*!important/i);
});
