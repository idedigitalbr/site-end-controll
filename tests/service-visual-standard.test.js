const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const serviceRuntimePath = path.join(root, 'src', 'js', 'service-pages.js');
const serviceRuntime = fs.existsSync(serviceRuntimePath) ? fs.readFileSync(serviceRuntimePath, 'utf8') : '';
const serviceStyles = fs.readFileSync(path.join(root, 'src', 'css', 'servico-integridade.css'), 'utf8');
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
const bentoServicePages = servicePages.filter((filename) => filename !== '1-solucao-engenharia-de-integridade-estrutural.html');

test('all service pages load the shared Lucide runtime', () => {
  for (const filename of servicePages) {
    const html = fs.readFileSync(path.join(root, filename), 'utf8');

    assert.match(html, /unpkg\.com\/lucide@0\.321\.0/, `${filename} should load Lucide`);
    assert.match(html, /src\/js\/service-pages\.js\?v=/, `${filename} should load the shared service runtime`);
  }
});

test('the shared service runtime normalizes icons and operational imagery', () => {
  assert.match(serviceRuntime, /lucide\.createIcons\(\)/);
  assert.match(serviceRuntime, /endo-acc-icon/);
  assert.match(serviceRuntime, /sn-step-node/);
  assert.match(serviceRuntime, /sn-commitment-icon/);
  assert.match(serviceRuntime, /assets\/Fotografias\/originais-16-9/);
  assert.match(serviceRuntime, /endcontrol-/);
  assert.doesNotMatch(serviceRuntime, /circle-check/);
  assert.doesNotMatch(serviceRuntime, /monitor-cog/);
});

test('service sections use restrained home-aligned visual tokens', () => {
  assert.match(serviceStyles, /\.sn-page-wrapper \.sn-process-section\s*\{[\s\S]*?box-shadow:\s*0\s+12px\s+28px\s+rgba\(0,\s*33,\s*93,\s*0\.06\)/i);
  assert.match(serviceStyles, /\.sn-page-wrapper \.sn-commitment-grid\s*\{[\s\S]*?grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\)/i);
  assert.match(serviceStyles, /\.sn-page-wrapper \.sn-commitment-icon\s+svg[\s\S]*?max-width:\s*24px/i);
  assert.match(serviceStyles, /\.sn-page-wrapper \.segmentos-secao[\s\S]*?box-shadow:\s*0\s+12px\s+28px\s+rgba\(0,\s*33,\s*93,\s*0\.06\)/i);
});

test('service headings and badges share the home typography pattern', () => {
  assert.match(serviceStyles, /\.sn-page-wrapper \.segmentos-secao \.segmentos-eyebrow[\s\S]*?border-radius:\s*999px[\s\S]*?background:\s*#00215D[\s\S]*?color:\s*#ffffff/i);
  assert.match(serviceStyles, /\.sn-page-wrapper \.segmentos-secao \.segmentos-title[\s\S]*?font-size:\s*clamp\(1\.8rem,\s*3\.5vw,\s*2\.4rem\)/i);
  assert.match(serviceStyles, /\.sn-page-wrapper \.segmentos-secao \.segmentos-subtitle[\s\S]*?font-size:\s*1\.05rem[\s\S]*?line-height:\s*1\.6/i);
  assert.match(serviceStyles, /\.sn-page-wrapper \.sn-process-eyebrow[\s\S]*?border-radius:\s*999px[\s\S]*?background:\s*#00215D[\s\S]*?color:\s*#ffffff/i);
  assert.match(serviceStyles, /\.sn-page-wrapper \.sn-process-headline[\s\S]*?font-size:\s*clamp\(2rem,\s*3\.2vw,\s*2\.65rem\)/i);
  assert.match(serviceStyles, /\.sn-page-wrapper \.sn-process-description[\s\S]*?font-size:\s*1\.02rem[\s\S]*?line-height:\s*1\.6/i);
});

test('methodology icon hover uses the dark navy interaction state', () => {
  assert.match(serviceStyles, /\.sn-page-wrapper \.svc-method-card:hover \.svc-method-icon-box[\s\S]*?background:\s*#00215D[\s\S]*?border-color:\s*#00215D[\s\S]*?color:\s*#ffffff/i);
  assert.match(serviceStyles, /\.sn-page-wrapper \.sn-step-unit:hover \.sn-step-node[\s\S]*?background:\s*#00215D[\s\S]*?border-color:\s*#00215D[\s\S]*?color:\s*#ffffff/i);
  assert.match(serviceStyles, /\.sn-page-wrapper \.sn-step-unit:hover \.sn-step-node \.lucide[\s\S]*?stroke:\s*#ffffff/i);
});

test('service commitment markup remains content-driven and preserves four pillars', () => {
  for (const filename of servicePages) {
    const html = fs.readFileSync(path.join(root, filename), 'utf8');
    const section = html.match(/<section class="sn-commitment-section"[\s\S]*?<\/section>/i)?.[0] || '';

    assert.ok(section, `${filename} should contain the commitment section`);
    assert.equal((section.match(/class="sn-commitment-card"/g) || []).length, 4, `${filename} should preserve four commitment cards`);
    assert.equal((section.match(/class="sn-commitment-icon"/g) || []).length, 4, `${filename} should preserve four commitment icons`);
  }
});

test('bento service grids use four fixed columns without expansion effects', () => {
  assert.match(serviceStyles, /\.svc-bento-section\s*\{[\s\S]*?background-color:\s*#ffffff/i);
  assert.match(serviceStyles, /\.svc-bento-section\s*\{[\s\S]*?background-image:\s*none/i);
  assert.match(serviceStyles, /\.bento-expanding-wrapper\s*\{[\s\S]*?display:\s*grid[\s\S]*?grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\)/i);
  assert.match(serviceStyles, /\.bento-row\s*\{[\s\S]*?display:\s*contents/i);
  assert.match(serviceStyles, /\.bento-stack-vertical\s*\{[\s\S]*?display:\s*contents/i);
  assert.match(serviceStyles, /\.bento-flex-card\s*\{[\s\S]*?transition:\s*none/i);
  assert.doesNotMatch(serviceStyles, /@media\s*\(hover:\s*hover\)[\s\S]*?\.bento-row--top:hover/i);
  assert.match(serviceStyles, /\.ec-card-white\s*\{[\s\S]*?background:\s*#ffffff[\s\S]*?box-shadow:\s*none/i);
  assert.match(serviceStyles, /\.ec-card-white:hover(?:,\s*\.ec-card-white:focus-visible)?\s*\{[\s\S]*?background:\s*#00215B[\s\S]*?color:\s*#ffffff/i);
});

test('bento service cards use white surfaces without logos, images, icons or numbering', () => {
  for (const filename of bentoServicePages) {
    const html = fs.readFileSync(path.join(root, filename), 'utf8');
    const cards = html.match(/<article class="(?:ec-card-dark|ec-card-white)[\s\S]*?<\/article>/gi) || [];

    assert.ok(cards.length >= 4, `${filename} should contain the bento cards`);
    assert.doesNotMatch(html, /class="sidebar-brand-(?:wrap|logo)"/i, `${filename} should not render the sidebar logo`);
    assert.doesNotMatch(html, /class="ec-card-dark(?:\s|"|\-)/i, `${filename} should not render dark cards`);
    assert.doesNotMatch(html, /class="ec-card-(?:dark|white)-bg-img"/i, `${filename} should not render card images`);
    assert.doesNotMatch(html, /class="ec-card-(?:dark|white)-icon-wrapper"/i, `${filename} should not render card icons`);
    assert.doesNotMatch(html, /class="sidebar-pillar-icon"/i, `${filename} should not render sidebar pillar icons`);
    assert.doesNotMatch(html, /class="check-icon"/i, `${filename} should not render checklist icons`);
    assert.doesNotMatch(html, /class="ec-card-(?:dark|white)-title"[^>]*>\s*\d+\./i, `${filename} should not number card titles`);
  }
});

test('bento sidebars use white rounded category badges', () => {
  const sidebarEyebrowBlock = serviceStyles.match(/\.sidebar-eyebrow\s*\{[^}]*\}/i)?.[0] || '';
  assert.match(sidebarEyebrowBlock, /background:\s*#ffffff/i);
  assert.match(sidebarEyebrowBlock, /color:\s*#00215D/i);
  assert.match(sidebarEyebrowBlock, /border-radius:\s*999px/i);

  for (const filename of bentoServicePages) {
    const html = fs.readFileSync(path.join(root, filename), 'utf8');
    const sidebar = html.match(/<aside class="ec-bento-sidebar"[\s\S]*?<\/aside>/i)?.[0] || '';

    assert.match(sidebar, /<span class="sidebar-eyebrow">[^<]+<\/span>/i, `${filename} should render a sidebar category badge`);
  }
});
