const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const segmentosStyles = fs.readFileSync(path.join(root, 'src', 'css', 'segmentos.css'), 'utf8');
const sectionStyles = fs.readFileSync(path.join(root, 'src', 'css', 'sections.css'), 'utf8');
const solucoesStyles = fs.readFileSync(path.join(root, 'src', 'css', 'solucoes.css'), 'utf8');

test('uses one compact spacing scale between the radar and areas sections', () => {
  assert.match(sectionStyles, /#wf-main-content\s*\{[\s\S]*?--section-space-desktop:\s*64px;[\s\S]*?--section-space-tablet:\s*52px;[\s\S]*?--section-space-mobile:\s*40px;/);
  assert.match(segmentosStyles, /\.segmentos-secao\s*\{[\s\S]*?padding:\s*var\(--section-space-desktop\)\s+0\s+var\(--section-space-desktop\);/);
  assert.match(segmentosStyles, /@media \(max-width:\s*1024px\)[\s\S]*?\.segmentos-secao\s*\{[\s\S]*?padding:\s*var\(--section-space-tablet\)\s+0\s+var\(--section-space-tablet\);/);
  assert.match(segmentosStyles, /@media \(max-width:\s*768px\)[\s\S]*?\.segmentos-secao\s*\{[\s\S]*?padding:\s*var\(--section-space-mobile\)\s+0\s+var\(--section-space-mobile\);/);
  assert.match(solucoesStyles, /\.solucoes-main-content\s*\{[\s\S]*?padding:\s*12px\s+0\s+var\(--section-space-desktop\)\s+0;/);
});

test('reduces the FAQ top padding across desktop and responsive breakpoints', () => {
  assert.match(sectionStyles, /#oportunidades \+ #faq-secao,[\s\S]*?padding-top:\s*var\(--section-space-desktop\)\s*!important;/);
  assert.match(sectionStyles, /@media \(max-width:\s*1024px\)[\s\S]*?#oportunidades \+ #faq-secao,[\s\S]*?padding-top:\s*var\(--section-space-tablet\)\s*!important;/);
  assert.match(sectionStyles, /@media \(max-width:\s*576px\)[\s\S]*?#oportunidades \+ #faq-secao,[\s\S]*?padding-top:\s*var\(--section-space-mobile\)\s*!important;/);
  assert.match(sectionStyles, /@media \(max-width:\s*768px\)[\s\S]*?\.faq-v2\s*\{[\s\S]*?padding:\s*68px\s+0\s+56px;/);
});
