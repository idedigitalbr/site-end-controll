const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'src', 'css', 'sections.css'), 'utf8');

test('removes opportunities section from index.html per user request', () => {
  assert.doesNotMatch(home, /id="oportunidades"/i);
  assert.doesNotMatch(home, /class="oportunidades-section/i);
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
