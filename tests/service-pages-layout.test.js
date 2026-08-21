const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const styles = fs.readFileSync(path.join(root, 'src', 'css', 'servico-integridade.css'), 'utf8');
const standardStyles = styles.slice(styles.lastIndexOf('PADRÃO ÚNICO'));
const servicePages = [
  '1-solucao-engenharia-de-integridade-estrutural.html',
  '2-solucao-inspecao-em-obras-de-artes-especiais.html',
  '3-solucao-ensaios-nao-destrutivos-ends.html',
  '4-solucao-engenharia-de-soldagem.html',
  '5-solucao-gerenciamento-de-projetos.html',
  '6-solucao-elaboracao-de-projetos-mecanicos.html',
  '7-solucao-solucoes-tecnologicas-integradas.html',
  '8-solucao-inspecao-e-adequacao-normativa.html',
  '9-solucao-calibracao-de-instrumentos.html',
  '10-solucao-trepanacao-hot-tapping.html',
  '11-solucao-certificacao-de-materia-prima.html',
  '12-solucao-consultoria-e-assessoria-tecnica.html'
];

test('service pages hide the metallic hero and use a two-column solution section', () => {
  assert.match(standardStyles, /\.sn-page-wrapper \.sn-hero-section\s*\{[\s\S]*?display:\s*none\s*!important;/i);
  assert.match(standardStyles, /\.sn-page-wrapper \.svc-solution-main-grid\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\)\s+minmax\(0,\s*1fr\);/i);
  assert.match(standardStyles, /\.sn-page-wrapper \.svc-solution-section > \.sn-history-container\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\)\s+minmax\(0,\s*1fr\);/i);

  for (const filename of servicePages) {
    const html = fs.readFileSync(path.join(root, filename), 'utf8');
    assert.match(html, /class="sn-hero-section"/, `${filename} should keep the hero hook for scoped hiding`);
    assert.match(html, /class="svc-solution-section[^"]*"/, `${filename} should contain the solution section`);
    assert.match(html, /(?:svc-single-photo-wrapper|svc-duo-photo-wrapper|svc-trio-photo-grid)/, `${filename} should keep media in the solution section`);
  }
});

test('service solution copy follows the home visual standard', () => {
  assert.match(standardStyles, /\.sn-page-wrapper \.svc-solution-eyebrow,\s*[\s\S]*?\.sn-page-wrapper \.sn-eyebrow-line\.light-mode\s*\{/i);
  assert.match(standardStyles, /background:\s*#00215D;/i);
  assert.match(standardStyles, /color:\s*#ffffff;/i);
  assert.match(standardStyles, /border-radius:\s*999px;/i);
  assert.match(standardStyles, /\.sn-page-wrapper \.svc-solution-headline,[\s\S]*?font-size:\s*clamp\(2rem,\s*3\.2vw,\s*2\.85rem\);/i);
  assert.match(standardStyles, /\.sn-page-wrapper \.svc-solution-paragraphs\s+p,[\s\S]*?text-align:\s*justify;/i);
  assert.match(standardStyles, /\.sn-page-wrapper \.svc-solution-section \.svc-cyan-cta-btn,[\s\S]*?\.sn-page-wrapper \.sn-commitment-btn\s*\{/i);
  assert.match(standardStyles, /background:\s*#ffffff\s*!important;/i);
  assert.match(standardStyles, /border:[^;]*#00215D\s*!important;/i);
  assert.match(standardStyles, /\.sn-page-wrapper \.svc-solution-section \.svc-cyan-cta-btn:hover,[\s\S]*?\.sn-page-wrapper \.sn-commitment-btn:hover\s*\{/i);
  assert.match(standardStyles, /background:\s*#00215D\s*!important;/i);
  assert.match(standardStyles, /color:\s*#ffffff\s*!important;/i);
});

test('keeps the service header readable after removing the dark hero', () => {
  assert.match(standardStyles, /\.sn-page-wrapper \.site-header\s*\{[\s\S]*?background:\s*#ffffff;[\s\S]*?color:\s*#00215D;/i);
  assert.match(standardStyles, /\.sn-page-wrapper \.site-header \.main-menu\s*\{[\s\S]*?color:\s*#00215D;/i);
  assert.match(standardStyles, /\.sn-page-wrapper \.site-header \.menu-toggle span\s*\{[\s\S]*?background:\s*#00215D;/i);
});
