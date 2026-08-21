const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

test('all pages load the same cache-busted shared menu runtime', () => {
  const pages = fs.readdirSync(root)
    .filter((filename) => filename.endsWith('.html'))
    .map((filename) => ({ filename, html: fs.readFileSync(path.join(root, filename), 'utf8') }))
    .filter(({ html }) => html.includes('src/js/main.js?v='));

  const versions = pages.map(({ filename, html }) => {
    const match = html.match(/src\/js\/main\.js\?v=([^"'\s]+)/);
    assert.ok(match, `${filename} should expose a versioned shared menu runtime`);
    return match[1];
  });

  assert.deepEqual([...new Set(versions)], ['32.0']);
});
