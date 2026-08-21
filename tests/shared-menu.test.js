const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const internalPages = [
  'sobre-nos.html',
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

test('internal pages use the same light header class as Home', () => {
  for (const filename of internalPages) {
    const html = fs.readFileSync(path.join(root, filename), 'utf8');
    assert.match(
      html,
      /<header class="site-header site-header--light-hero" id="topo">/,
      `${filename} must use the Home header class`
    );
  }
});

test('shared menu scripts normalize solution labels to the Home pattern', () => {
  const mainJs = fs.readFileSync(path.join(root, 'src/js/main.js'), 'utf8');
  const aboutJs = fs.readFileSync(path.join(root, 'src/js/sobre-nos.js'), 'utf8');

  for (const [filename, source] of [['src/js/main.js', mainJs], ['src/js/sobre-nos.js', aboutJs]]) {
    assert.match(source, /function initCanonicalSolutionsMenu\(\)/, `${filename} must normalize the shared menu`);
    assert.match(source, /submenuzinho-item span:not\(\.submenuzinho-bullet\)/, `${filename} must normalize project submenu labels`);
    assert.match(source, /textContent\.replace\([^)]*\\d\+/, `${filename} must remove menu numbering`);
  }
});

test('Home header styling is explicitly shared by internal pages', () => {
  const headerCss = fs.readFileSync(path.join(root, 'src/css/header.css'), 'utf8');
  const serviceCss = fs.readFileSync(path.join(root, 'src/css/servico-integridade.css'), 'utf8');
  const aboutHtml = fs.readFileSync(path.join(root, 'sobre-nos.html'), 'utf8');
  assert.match(headerCss, /\.site-header--light-hero \.drop-link\.active/);
  assert.match(headerCss, /\.site-header--light-hero \.main-menu > a\.active/);
  assert.match(headerCss, /\.site-header--light-hero \.drop-link\.active[\s\S]{0,220}color: #ffffff !important/);
  assert.match(headerCss, /\.site-header--light-hero \.dropdown-rich-menu \.dropdown-item-text/);
  assert.match(headerCss, /\.site-header--light-hero \.main-menu \.btn-contacts-menu/);
  assert.match(serviceCss, /\.sn-page-wrapper \.site-header \.drop-link\.active[\s\S]{0,220}color: #ffffff !important/);
  assert.match(aboutHtml, /<a href="sobre-nos\.html" class="active">Sobre Nós<\/a>/);
});
