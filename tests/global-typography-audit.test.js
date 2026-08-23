const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const cssDir = path.join(root, 'src', 'css');

const tokensCss = fs.readFileSync(path.join(cssDir, 'tokens.css'), 'utf8');
const heroCss = fs.readFileSync(path.join(cssDir, 'hero.css'), 'utf8');
const solucoesCss = fs.readFileSync(path.join(cssDir, 'solucoes.css'), 'utf8');
const sectionsCss = fs.readFileSync(path.join(cssDir, 'sections.css'), 'utf8');
const segmentosCss = fs.readFileSync(path.join(cssDir, 'segmentos.css'), 'utf8');
const presencaCss = fs.readFileSync(path.join(cssDir, 'presenca-nacional.css'), 'utf8');
const sobreNosCss = fs.readFileSync(path.join(cssDir, 'sobre-nos.css'), 'utf8');
const servicoCss = fs.readFileSync(path.join(cssDir, 'servico-integridade.css'), 'utf8');
const radarFfsCss = fs.readFileSync(path.join(cssDir, 'radar-ffs.css'), 'utf8');
const baseCss = fs.readFileSync(path.join(cssDir, 'base.css'), 'utf8');

const allPages = [
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
  '12-solucao-consultoria-e-assessoria-tecnica.html'
];

test('tokens.css defines the exact official typography scale', () => {
  assert.match(tokensCss, /--font-size-headline:\s*38px;/);
  assert.match(tokensCss, /--font-size-body:\s*16px;/);
  assert.match(tokensCss, /--font-size-icon-title:\s*18px;/);
  assert.match(tokensCss, /--font-size-icon-text:\s*16px;/);
  assert.match(tokensCss, /--font-size-eyebrow:\s*12px;/);
  assert.match(tokensCss, /--font-size-button:\s*15px;/);
});

test('all headlines (H1, H2) use 38px clamp with 800 weight across all sections and stylesheets', () => {
  const headlineClamp = /font-size:\s*clamp\(28px,\s*3\.8vw,\s*var\(--font-size-headline,\s*38px\)\)/;
  
  // Home headlines
  assert.match(heroCss.match(/\.hero-title-main\s*\{([\s\S]*?)\}/i)?.[1] || '', headlineClamp);
  assert.match(sectionsCss.match(/\.about-headline\s*\{([\s\S]*?)\}/i)?.[1] || '', headlineClamp);
  assert.match(solucoesCss.match(/\.solucoes-heading\s*\{([\s\S]*?)\}/i)?.[1] || '', headlineClamp);
  assert.match(segmentosCss.match(/\.segmentos-title\s*\{([\s\S]*?)\}/i)?.[1] || '', headlineClamp);
  assert.match(presencaCss.match(/\.presenca-heading\s*\{([\s\S]*?)\}/i)?.[1] || '', headlineClamp);
  assert.match(sectionsCss.match(/\.faq-v2-title\s*\{([\s\S]*?)\}/i)?.[1] || '', headlineClamp);

  // Sobre Nós headlines
  assert.match(sobreNosCss.match(/\.sn-history-headline\s*\{([\s\S]*?)\}/i)?.[1] || '', headlineClamp);
  assert.match(sobreNosCss.match(/\.sn-essence-headline\s*\{([\s\S]*?)\}/i)?.[1] || '', headlineClamp);
  assert.match(sobreNosCss.match(/\.sn-process-headline\s*\{([\s\S]*?)\}/i)?.[1] || '', headlineClamp);
  assert.match(sobreNosCss.match(/\.sn-commitment-headline\s*\{([\s\S]*?)\}/i)?.[1] || '', headlineClamp);

  // Service pages headlines
  assert.match(servicoCss.match(/\.sn-page-wrapper \.section-headline,[\s\S]*?\.sn-page-wrapper \.svc-solution-headline,[\s\S]*?\.sn-page-wrapper \.sn-history-headline\s*\{([\s\S]*?)\}/i)?.[1] || '', headlineClamp);
  assert.match(servicoCss.match(/\.sidebar-headline\s*\{([\s\S]*?)\}/i)?.[1] || '', /font-size:\s*clamp\(22px,\s*2\.4vw,\s*26px\)/);
  assert.match(servicoCss.match(/\.svc-methodology-headline\s*\{([\s\S]*?)\}/i)?.[1] || '', headlineClamp);
  assert.match(radarFfsCss.match(/\.ffs-heading\s*\{([\s\S]*?)\}/i)?.[1] || '', headlineClamp);
});

test('all icon, card, step, accordion, and pillar titles use 18px across all stylesheets', () => {
  // Soluções cards
  assert.match(solucoesCss, /\.highlight-card-title\s*\{[\s\S]*?font-size:\s*var\(--font-size-icon-title,\s*18px\)/i);
  
  // Áreas / Quando Aplicar accordion titles
  assert.match(segmentosCss, /\.endo-acc-card__title\s*\{[\s\S]*?font-size:\s*var\(--font-size-icon-title,\s*18px\)/i);
  assert.match(servicoCss, /\.sn-page-wrapper \.endo-acc-panel:hover \.endo-acc-card__title[\s\S]*?font-size:\s*var\(--font-size-icon-title,\s*18px\)/i);
  
  // Metodologia 4 passos titles
  assert.match(sobreNosCss, /\.sn-step-title\s*\{[\s\S]*?font-size:\s*var\(--font-size-icon-title,\s*18px\)/i);
  assert.match(servicoCss, /\.sn-page-wrapper \.sn-step-title\s*\{[\s\S]*?font-size:\s*var\(--font-size-icon-title,\s*18px\)/i);
  
  // Bento cards & sidebar pillars
  assert.match(servicoCss, /\.sidebar-pillar-title\s*\{[\s\S]*?font-size:\s*var\(--font-size-icon-title,\s*18px\)/i);
  assert.match(servicoCss, /\.ec-card-white-title\s*\{[\s\S]*?font-size:\s*var\(--font-size-icon-title,\s*18px\)/i);
  assert.match(servicoCss, /\.ec-card-dark-title\s*\{[\s\S]*?font-size:\s*var\(--font-size-icon-title,\s*18px\)/i);
  assert.match(servicoCss, /\.svc-method-title\s*\{[\s\S]*?font-size:\s*var\(--font-size-icon-title,\s*18px\)/i);

  // FAQ questions & Missão Visão Valores
  assert.match(sectionsCss, /\.faq-v2-question\s*\{[\s\S]*?font-size:\s*var\(--font-size-icon-title,\s*18px\)/i);
  assert.match(sobreNosCss, /\.sn-essence-card-title\s*\{[\s\S]*?font-size:\s*var\(--font-size-icon-title,\s*18px\)/i);
});

test('all body texts, subtitles, descriptions, checklists, and paragraphs use 16px across all stylesheets', () => {
  // Home descriptions
  assert.match(heroCss, /\.hero-lead-desc\s*\{[\s\S]*?font-size:\s*var\(--font-size-body,\s*16px\)/i);
  assert.match(sectionsCss, /\.about-paragraphs p\s*\{[\s\S]*?font-size:\s*var\(--font-size-body,\s*16px\)/i);
  assert.match(solucoesCss, /\.solucoes-description\s*\{[\s\S]*?font-size:\s*var\(--font-size-body,\s*16px\)/i);
  assert.match(segmentosCss, /\.segmentos-subtitle\s*\{[\s\S]*?font-size:\s*var\(--font-size-body,\s*16px\)/i);
  assert.match(segmentosCss, /\.endo-acc-card__desc\s*\{[\s\S]*?font-size:\s*var\(--font-size-icon-text,\s*16px\)/i);
  assert.match(presencaCss, /\.presenca-paragraph\s*\{[\s\S]*?font-size:\s*var\(--font-size-body,\s*16px\)/i);
  assert.match(sectionsCss, /\.faq-v2-answer-inner\s*\{[\s\S]*?font-size:\s*var\(--font-size-body,\s*16px\)/i);

  // Sobre Nós descriptions
  assert.match(sobreNosCss, /\.sn-history-description\s*\{[\s\S]*?font-size:\s*var\(--font-size-body,\s*16px\)/i);
  assert.match(sobreNosCss, /\.sn-essence-subheadline\s*\{[\s\S]*?font-size:\s*var\(--font-size-body,\s*16px\)/i);
  assert.match(sobreNosCss, /\.sn-essence-card-body\s*\{[\s\S]*?font-size:\s*var\(--font-size-icon-text,\s*16px\)[\s\S]*?text-align:\s*justify/i);
  assert.match(sobreNosCss, /\.sn-values-list li\s*\{[\s\S]*?font-size:\s*var\(--font-size-icon-text,\s*16px\)/i);
  assert.match(sobreNosCss, /\.sn-process-description\s*\{[\s\S]*?font-size:\s*var\(--font-size-body,\s*16px\)/i);
  assert.match(sobreNosCss, /\.sn-step-desc\s*\{[\s\S]*?font-size:\s*var\(--font-size-icon-text,\s*16px\)[\s\S]*?text-align:\s*justify/i);
  assert.match(sobreNosCss, /\.sn-commitment-desc\s*\{[\s\S]*?font-size:\s*var\(--font-size-body,\s*16px\)/i);

  // Service pages descriptions & checklists
  assert.match(servicoCss, /\.sn-page-wrapper \.section-description,[\s\S]*?font-size:\s*var\(--font-size-body,\s*16px\)/i);
  assert.match(servicoCss, /\.sn-page-wrapper \.sn-step-desc\s*\{[\s\S]*?font-size:\s*var\(--font-size-icon-text,\s*16px\)/i);
  assert.match(servicoCss, /\.sidebar-paragraph\s*\{[\s\S]*?font-size:\s*var\(--font-size-body,\s*16px\)/i);
  assert.match(servicoCss, /\.sidebar-pillar-desc\s*\{[\s\S]*?font-size:\s*var\(--font-size-icon-text,\s*16px\)/i);
  assert.match(servicoCss, /\.ec-card-white-checklist li\s*\{[\s\S]*?font-size:\s*var\(--font-size-icon-text,\s*16px\)/i);
  assert.match(servicoCss, /\.ec-card-dark-checklist li\s*\{[\s\S]*?font-size:\s*var\(--font-size-icon-text,\s*16px\)/i);
  assert.match(servicoCss, /\.svc-method-desc\s*\{[\s\S]*?font-size:\s*var\(--font-size-icon-text,\s*16px\)/i);
});

test('all badges and eyebrows use 12px with 700 weight and 0.14em spacing across all stylesheets', () => {
  assert.match(heroCss, /\.hero-badge-pill\s*\{[\s\S]*?font-size:\s*var\(--font-size-eyebrow,\s*12px\)/i);
  assert.match(sectionsCss, /\.about-eyebrow\s*\{[\s\S]*?font-size:\s*var\(--font-size-eyebrow,\s*12px\)/i);
  assert.match(solucoesCss, /\.solucoes-badge-text\s*\{[\s\S]*?font-size:\s*var\(--font-size-eyebrow,\s*12px\)/i);
  assert.match(segmentosCss, /\.segmentos-eyebrow\s*\{[\s\S]*?font-size:\s*var\(--font-size-eyebrow,\s*12px\)/i);
  assert.match(presencaCss, /\.presenca-eyebrow\s*\{[\s\S]*?font-size:\s*var\(--font-size-eyebrow,\s*12px\)/i);
  assert.match(sectionsCss, /\.faq-v2-eyebrow\s*\{[\s\S]*?font-size:\s*var\(--font-size-eyebrow,\s*12px\)/i);

  assert.match(sobreNosCss, /\.sn-history-badge-text\s*\{[\s\S]*?font-size:\s*var\(--font-size-eyebrow,\s*12px\)/i);
  assert.match(sobreNosCss, /\.sn-essence-badge-text\s*\{[\s\S]*?font-size:\s*var\(--font-size-eyebrow,\s*12px\)/i);
  assert.match(sobreNosCss, /\.sn-commitment-badge-text\s*\{[\s\S]*?font-size:\s*var\(--font-size-eyebrow,\s*12px\)/i);

  assert.match(servicoCss, /\.sn-page-wrapper \.section-badge,[\s\S]*?font-size:\s*var\(--font-size-eyebrow,\s*12px\)/i);
  assert.match(servicoCss, /\.sidebar-eyebrow\s*\{[\s\S]*?font-size:\s*var\(--font-size-eyebrow,\s*12px\)/i);
  assert.match(servicoCss, /\.svc-methodology-eyebrow\s*\{[\s\S]*?font-size:\s*var\(--font-size-eyebrow,\s*12px\)/i);
  assert.match(radarFfsCss, /\.ffs-badge-text\s*\{[\s\S]*?font-size:\s*var\(--font-size-eyebrow,\s*12px\)/i);
});

test('all CTA buttons use 15px with 700 weight across all stylesheets', () => {
  assert.match(baseCss, /\.btn-primary[\s\S]*?font-size:\s*15px\s*!important/i);
  assert.match(baseCss, /\.btn-secondary[\s\S]*?font-size:\s*15px\s*!important/i);
  assert.match(servicoCss, /\.sn-page-wrapper \.svc-solution-section \.svc-cyan-cta-btn[\s\S]*?font-size:\s*15px\s*!important/i);
  assert.match(sobreNosCss, /\.sn-commitment-wsp-float-btn\s*\{[\s\S]*?font-size:\s*var\(--font-size-button,\s*15px\)/i);
});

test('all 14 HTML pages contain standard heading and section classes', () => {
  for (const filename of allPages) {
    const html = fs.readFileSync(path.join(root, filename), 'utf8');
    
    // Every page has at least one H1
    const h1s = html.match(/<h1[^>]*>[\s\S]*?<\/h1>/gi) || [];
    assert.ok(h1s.length >= 1, `${filename} should have at least one H1`);

    // Every page has at least one H2
    const h2s = html.match(/<h2[^>]*>[\s\S]*?<\/h2>/gi) || [];
    assert.ok(h2s.length >= 1, `${filename} should have at least one H2`);
  }
});
