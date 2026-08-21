const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const pages = [
  'index.html',
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
  '12-solucao-consultoria-e-assessoria-tecnica.html',
];

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function getFooter(file) {
  const footer = read(file).match(/<footer\b[\s\S]*?<\/footer>/i)?.[0];
  assert.ok(footer, `${file} precisa conter um rodapé`);
  return footer;
}

test('todas as páginas usam a estrutura de rodapé da Home', () => {
  const markers = [
    'footer-minimal-glow-section',
    'footer-minimal-container',
    'footer-minimal-top-grid',
    'footer-col-location',
    'footer-col-center',
    'footer-col-contact',
    'footer-minimal-bottom-bar',
  ];

  for (const page of pages) {
    const footer = getFooter(page);
    for (const marker of markers) {
      assert.match(footer, new RegExp(marker), `${page} não possui ${marker}`);
    }
  }
});

test('os ícones do rodapé seguem o tratamento branco da Home', () => {
  for (const page of pages) {
    const footer = getFooter(page);
    assert.doesNotMatch(
      footer,
      /stroke="#00c2ff"|fill="#00c2ff"/i,
      `${page} ainda possui ícone ciano no rodapé`,
    );
  }
});

test('o CSS comum normaliza os ícones dos rodapés internos', () => {
  const css = read('src/css/work-units-footer.css');
  assert.match(
    css,
    /\.sn-page-wrapper \.footer-minimal-glow-section \.footer-header-icon[\s\S]*?stroke:\s*#ffffff\s*!important/i,
  );
  assert.match(
    css,
    /\.sn-page-wrapper \.footer-minimal-glow-section \.footer-whatsapp-icon path[\s\S]*?stroke:\s*#ffffff\s*!important[\s\S]*?fill:\s*#ffffff\s*!important/i,
  );
  assert.match(
    css,
    /\.sn-page-wrapper \.footer-minimal-glow-section \.footer-email-icon[\s\S]*?stroke:\s*#ffffff\s*!important/i,
  );
  assert.doesNotMatch(
    css,
    /\.footer-whatsapp-icon path\s*\{[\s\S]*?fill:\s*#ffffff\s*!important/i,
    'a regra do WhatsApp não pode preencher o contorno externo',
  );
  assert.match(
    css,
    /\.footer-whatsapp-icon path:first-child\s*\{[\s\S]*?fill:\s*none\s*!important/i,
  );
  assert.match(
    css,
    /\.footer-whatsapp-icon path:last-child\s*\{[\s\S]*?fill:\s*#ffffff\s*!important/i,
  );
});
