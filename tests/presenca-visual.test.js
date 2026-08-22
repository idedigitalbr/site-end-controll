const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const styles = fs.readFileSync(path.join(root, 'src', 'css', 'presenca-nacional.css'), 'utf8');
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

test('uses the standard navy across the national presence section accents', () => {
  assert.match(styles, /\.presenca-eyebrow\s*\{[\s\S]*?color:\s*#00215D\s*;/i);
  assert.match(styles, /\.presenca-heading \.highlight\s*\{[\s\S]*?color:\s*#00215D\s*;/i);
  assert.match(styles, /\.stat-mini-card \.stat-value\s*\{[\s\S]*?color:\s*#00215D\s*;/i);
  assert.match(styles, /\.panel-card-title\s*\{[\s\S]*?color:\s*#00215D\s*;/i);
  assert.match(styles, /\.panel-card-list li\.active strong\s*\{[\s\S]*?color:\s*#00215D\s*;/i);
  assert.match(styles, /\.region-marker\s*\{[\s\S]*?border:\s*1\.5px\s+solid\s+#00215D\s*;/i);
  assert.match(styles, /\.sector-icon-svg\s*\{[\s\S]*?stroke:\s*#00215D\s*;/i);
  assert.match(styles, /\.connection-line\.active\s*\{[\s\S]*?stroke:\s+#00215D\s*;/i);
  assert.match(home, /PRESENÇA NACIONAL/);
  assert.match(home, /<span class="highlight">indústria brasileira<\/span>/);
  assert.match(home, /presenca-nacional\.css\?v=34\.0/);
});

test('matches the Sobre a EndControl badge and headline typography', () => {
  assert.match(
    styles,
    /\.presenca-eyebrow\s*\{[\s\S]*?font-size:\s*0\.72rem\s*;[\s\S]*?font-weight:\s*700\s*;[\s\S]*?color:\s*#ffffff\s*;[\s\S]*?background:\s*#00215D\s*;[\s\S]*?border-radius:\s*999px\s*;[\s\S]*?padding:\s*8px\s+14px\s*;/i,
  );
  assert.match(
    styles,
    /\.presenca-heading\s*\{[\s\S]*?font-size:\s*clamp\(1\.8rem,\s*3\.5vw,\s*2\.4rem\)\s*;[\s\S]*?font-weight:\s*800\s*;[\s\S]*?line-height:\s*1\.2\s*;[\s\S]*?color:\s*#071429\s*;/i,
  );
});
