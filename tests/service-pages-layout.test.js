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
  assert.match(standardStyles, /color:\s*#ffffff\s*!important;/i);
  assert.match(standardStyles, /border-radius:\s*999px;/i);
  assert.match(standardStyles, /padding:\s*6px\s+16px\s*!important;/i);
  assert.match(standardStyles, /font-size:\s*11px\s*!important;/i);
  assert.match(standardStyles, /font-weight:\s*700\s*!important;/i);
  assert.match(standardStyles, /letter-spacing:\s*0\.18em\s*!important;/i);
  assert.match(standardStyles, /\.sn-page-wrapper \.svc-solution-headline,[\s\S]*?font-size:\s*clamp\(2rem,\s*3\.2vw,\s*2\.85rem\);/i);
  assert.match(standardStyles, /\.sn-page-wrapper \.svc-solution-section \.svc-cyan-cta-btn,[\s\S]*?\.sn-page-wrapper \.svc-solution-section \.btn\.btn-primary\s*\{/i);
  assert.match(standardStyles, /background:\s*#ffffff\s*!important;/i);
  assert.match(standardStyles, /border:[^;]*#00215D\s*!important;/i);
  assert.match(standardStyles, /\.sn-page-wrapper \.svc-solution-section \.svc-cyan-cta-btn:hover,[\s\S]*?\.sn-page-wrapper \.svc-solution-section \.btn\.btn-primary:hover\s*\{/i);
  assert.match(standardStyles, /background:\s*#00215D\s*!important;/i);
  assert.match(standardStyles, /color:\s*#ffffff\s*!important;/i);
});

test('every service page places the standard CTA after the first-section copy', () => {
  for (const filename of servicePages) {
    const html = fs.readFileSync(path.join(root, filename), 'utf8');
    const section = html.match(/<section class="svc-solution-section[^>]*>[\s\S]*?<\/section>/i)?.[0] || '';

    assert.match(section, /(?:class="[^"]*btn btn-primary[^"]*"|class="[^"]*svc-cyan-cta-btn[^"]*")/i, `${filename} should have a first-section CTA`);
    assert.match(section, /Fale com um especialista/i, `${filename} should keep the standard CTA label`);
    const copyIndex = Math.max(section.indexOf('svc-solution-paragraphs'), section.indexOf('sn-history-description'));
    const ctaIndex = section.search(/(?:class="[^"]*btn btn-primary[^"]*"|class="[^"]*svc-cyan-cta-btn[^"]*")/i);
    assert.ok(copyIndex >= 0 && ctaIndex > copyIndex, `${filename} should place the CTA after the first-section copy`);
  }
});

test('uses navy for service-top blue copy and CTA arrows', () => {
  assert.match(
    standardStyles,
    /\.sn-page-wrapper \.svc-solution-section \.svc-solution-subtitle[\s\S]*?color:\s*#00215D\s*!important;/i
  );
  assert.match(
    standardStyles,
    /\.sn-page-wrapper \.svc-solution-section \.svc-cyan-cta-arrow[\s\S]*?color:\s*#00215D\s*!important;[\s\S]*?stroke:\s*#00215D\s*!important;/i
  );
});

test('keeps the service header readable after removing the dark hero', () => {
  assert.match(standardStyles, /\.sn-page-wrapper \.site-header\s*\{[\s\S]*?background:\s*#ffffff;[\s\S]*?color:\s*#00215D;/i);
  assert.match(standardStyles, /\.sn-page-wrapper \.site-header \.main-menu\s*\{[\s\S]*?color:\s*#00215D;/i);
  assert.match(standardStyles, /\.sn-page-wrapper \.site-header \.menu-toggle span\s*\{[\s\S]*?background:\s*#00215D;/i);
});

test('service pages override desktop constraints at mobile breakpoints', () => {
  const responsiveBlock = styles.slice(styles.lastIndexOf('RESPONSIVE SERVICE LAYOUT'));

  assert.match(responsiveBlock, /@media\s*\(max-width:\s*900px\)[\s\S]*?\.sn-page-wrapper \.svc-solution-section:has\(\.svc-duo-photo-wrapper\) \.svc-solution-main-grid[\s\S]*?grid-template-columns:\s*1fr\s*!important;/i);
  assert.match(responsiveBlock, /grid-template-areas:\s*"content"\s*"media"\s*!important;/i);
  assert.match(responsiveBlock, /\.sn-page-wrapper \.svc-solution-paragraphs\s+p,[\s\S]*?\.sn-page-wrapper \.sn-history-description[\s\S]*?text-align:\s*left\s*!important;[\s\S]*?text-justify:\s*auto;[\s\S]*?word-spacing:\s*normal;/i);
  assert.match(responsiveBlock, /\.sn-page-wrapper \.svc-solution-container,[\s\S]*?width:\s*min\(100%\s*-\s*32px,\s*680px\);/i);
  assert.match(responsiveBlock, /\.sn-page-wrapper \.bento-expanding-wrapper[\s\S]*?grid-template-columns:\s*1fr\s*!important;/i);
  assert.match(responsiveBlock, /@media\s*\(max-width:\s*600px\)[\s\S]*?\.sn-page-wrapper \.sn-process-track-zone[\s\S]*?grid-template-columns:\s*1fr\s*!important;/i);
  assert.match(responsiveBlock, /\.sn-page-wrapper \.endo-acc-full-wrapper[\s\S]*?max-width:\s*calc\(100%\s*-\s*32px\);/i);
});

test('methodology sections use the shared badge, headline, copy and card pattern', () => {
  assert.match(styles, /\.svc-methodology-eyebrow\s*\{[\s\S]*?font-size:\s*0\.72rem;[\s\S]*?font-weight:\s*700;[\s\S]*?letter-spacing:\s*0\.14em;[\s\S]*?padding:\s*8px\s+14px;/i);
  assert.match(styles, /\.svc-methodology-headline\s*\{[\s\S]*?font-size:\s*clamp\(1\.8rem,\s*3\.5vw,\s*2\.4rem\);[\s\S]*?font-weight:\s*800;[\s\S]*?line-height:\s*1\.2;[\s\S]*?margin-bottom:\s*14px;/i);
  assert.match(styles, /\.svc-methodology-headline\s+em\s*\{[\s\S]*?font-style:\s*italic;[\s\S]*?font-weight:\s*300;[\s\S]*?color:\s*#00215D;/i);
  assert.match(styles, /\.svc-method-desc\s*\{[\s\S]*?font-size:\s*1\.05rem;[\s\S]*?line-height:\s*1\.5;[\s\S]*?color:\s*#475569;[\s\S]*?text-align:\s*justify;/i);
  assert.match(styles, /\.svc-methodology-flow\s*\{[\s\S]*?display:\s*flex;[\s\S]*?gap:\s*18px;/i);
  assert.match(styles, /@media\s*\(max-width:\s*1100px\)[\s\S]*?\.svc-methodology-flow\s*\{[\s\S]*?flex-direction:\s*column;[\s\S]*?\.svc-method-arrow-connector\s*\{[\s\S]*?display:\s*none;/i);

  for (const filename of servicePages) {
    const html = fs.readFileSync(path.join(root, filename), 'utf8');
    const section = html.match(/<section class="svc-methodology-section"[\s\S]*?<\/section>/i)?.[0] || '';

    assert.ok(section, `${filename} should contain the methodology section`);
    assert.match(section, /class="svc-methodology-eyebrow">NOSSA METODOLOGIA<\/div>/i);
    assert.equal((section.match(/<h2 class="svc-methodology-headline">/g) || []).length, 1, `${filename} should have one methodology headline`);
    assert.equal((section.match(/<em class="methodology-highlight">/g) || []).length, 1, `${filename} should highlight one headline word`);
    assert.match(section, /\bem<br>/i, `${filename} should break the methodology headline after “em”`);
    assert.equal((section.match(/class="svc-method-card"/g) || []).length, 4, `${filename} should preserve four methodology cards`);
    assert.equal((section.match(/class="svc-method-badge"/g) || []).length, 0, `${filename} should not render numbered methodology badges`);
    assert.equal((section.match(/class="svc-method-desc"/g) || []).length, 4, `${filename} should preserve all methodology descriptions`);
  }
});

test('service top sections use the shared home typography pattern with one italic highlight', () => {
  assert.match(styles, /\.sn-page-wrapper \.section-badge,[\s\S]*?padding:\s*8px\s+14px\s*!important[\s\S]*?font-size:\s*0\.72rem\s*!important[\s\S]*?font-weight:\s*700\s*!important[\s\S]*?letter-spacing:\s*0\.14em\s*!important/i);
  assert.match(styles, /\.sn-page-wrapper \.section-headline,[\s\S]*?font-size:\s*clamp\(1\.8rem,\s*3\.5vw,\s*2\.4rem\)\s*!important[\s\S]*?font-weight:\s*800\s*!important[\s\S]*?line-height:\s*1\.2\s*!important[\s\S]*?margin:\s*0\s+0\s+14px\s*!important/i);
  assert.match(styles, /\.sn-page-wrapper \.service-top-highlight[\s\S]*?font-style:\s*italic;[\s\S]*?font-weight:\s*300;[\s\S]*?color:\s*#00215D\s*!important/i);
  assert.match(styles, /\.sn-page-wrapper \.section-description,[\s\S]*?font-size:\s*1\.05rem\s*!important[\s\S]*?line-height:\s*1\.5\s*!important/i);

  for (const filename of servicePages) {
    const html = fs.readFileSync(path.join(root, filename), 'utf8');
    const section = html.match(/<section class="svc-solution-section[^"]*"[\s\S]*?<\/section>/i)?.[0] || '';

    assert.ok(section, `${filename} should contain the top service section`);
    assert.match(section, /class="[^"]*(?:section-badge)[^"]*"[^>]*>SOBRE O SERVIÇO|class="[^"]*section-badge[^"]*"[^>]*>SOBRE O SERVIÇO/i);
    assert.match(section, /<h1 class="[^"]*(?:section-headline)[^"]*">/i);
    assert.equal((section.match(/class="service-top-highlight"/g) || []).length, 1, `${filename} should highlight one top headline word`);
  }
});
