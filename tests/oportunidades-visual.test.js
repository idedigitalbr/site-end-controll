const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'src', 'css', 'sections.css'), 'utf8');

test('uses Lucide icons in the opportunities cards', () => {
  const section = home.match(/<section class="oportunidades-section[\s\S]*?<\/section>/i)?.[0] || '';

  assert.match(section, /class="oportunidades-card-icon-wrapper"[\s\S]*?data-lucide="file-text"/i);
  assert.match(section, /class="oportunidades-card-icon-wrapper"[\s\S]*?data-lucide="users"/i);
  assert.equal((section.match(/data-lucide="check-circle-2"/g) || []).length, 6);
  assert.equal((section.match(/data-lucide="arrow-right"/g) || []).length, 2);
  assert.doesNotMatch(section, /<div class="oportunidades-card-icon-wrapper">[\s\S]*?<svg/i);
  assert.doesNotMatch(section, /<svg[^>]*class="check-icon"/i);
});

test('reduces artificial glow and shadow effects in the opportunities section', () => {
  assert.match(styles, /\.oportunidades-bg-glow\s*\{[\s\S]*?display:\s*none\s*;/i);
  assert.match(styles, /\.oportunidades-radar-beam\s*\{[\s\S]*?display:\s*none\s*;/i);
  assert.match(styles, /\.oportunidades-scan-line\s*\{[\s\S]*?display:\s*none\s*;/i);
  assert.match(styles, /\.oportunidades-tech-line::after\s*\{[\s\S]*?box-shadow:\s*none\s*;/i);
  assert.match(styles, /\.oportunidades-card-icon-wrapper svg\s*\{[\s\S]*?filter:\s*none\s*;/i);
  assert.match(styles, /\.oportunidades-card-checklist li svg\.check-icon\s*\{[\s\S]*?filter:\s*none\s*;/i);
  assert.match(styles, /\.oportunidades-card:hover \.oportunidades-card-title\s*\{[\s\S]*?text-shadow:\s*none\s*;/i);
  assert.match(styles, /\.oportunidades-card-btn:hover\s*\{[\s\S]*?box-shadow:\s*0 4px 12px/i);
});
