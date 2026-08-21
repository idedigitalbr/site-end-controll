const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const segmentosStyles = fs.readFileSync(path.join(root, 'src', 'css', 'segmentos.css'), 'utf8');
const sectionStyles = fs.readFileSync(path.join(root, 'src', 'css', 'sections.css'), 'utf8');

test('reduces the vertical space after segments before the FAQ', () => {
  assert.match(segmentosStyles, /\.segmentos-secao\s*\{[\s\S]*?padding:\s*120px\s+0\s+72px\s+0;/);
  assert.match(segmentosStyles, /@media \(max-width:\s*1024px\)[\s\S]*?\.segmentos-secao\s*\{[\s\S]*?padding:\s*95px\s+0\s+56px\s+0;/);
  assert.match(segmentosStyles, /@media \(max-width:\s*860px\)[\s\S]*?\.segmentos-secao\s*\{[\s\S]*?padding:\s*85px\s+0\s+48px\s+0;/);
  assert.match(segmentosStyles, /@media \(max-width:\s*768px\)[\s\S]*?\.segmentos-secao\s*\{[\s\S]*?padding:\s*75px\s+0\s+42px\s+0;/);
  assert.match(segmentosStyles, /@media \(max-width:\s*480px\)[\s\S]*?\.segmentos-secao\s*\{[\s\S]*?padding:\s*65px\s+0\s+36px\s+0;/);
});

test('reduces the FAQ top padding across desktop and responsive breakpoints', () => {
  assert.match(sectionStyles, /#oportunidades \+ #faq-secao,[\s\S]*?padding-top:\s*72px\s*!important;/);
  assert.match(sectionStyles, /@media \(max-width:\s*1024px\)[\s\S]*?#oportunidades \+ #faq-secao,[\s\S]*?padding-top:\s*64px\s*!important;/);
  assert.match(sectionStyles, /@media \(max-width:\s*576px\)[\s\S]*?#oportunidades \+ #faq-secao,[\s\S]*?padding-top:\s*52px\s*!important;/);
  assert.match(sectionStyles, /@media \(max-width:\s*768px\)[\s\S]*?\.faq-v2\s*\{[\s\S]*?padding:\s*68px\s+0\s+56px;/);
});
