const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

test('renders Presença Nacional before the FAQ section', () => {
  const presenceIndex = home.indexOf('<section class="presenca-nacional-light" id="presenca-nacional-rodapé">');
  const faqIndex = home.indexOf('<section class="section faq-v2 wf-section section-full-width" id="faq-secao"');

  assert.ok(presenceIndex >= 0, 'a seção de Presença Nacional precisa existir');
  assert.ok(faqIndex >= 0, 'a seção FAQ precisa existir');
  assert.ok(presenceIndex < faqIndex, 'Presença Nacional deve aparecer antes do FAQ');
});
