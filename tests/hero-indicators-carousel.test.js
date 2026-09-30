const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const homeHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const heroCss = fs.readFileSync(path.join(root, 'src', 'css', 'hero.css'), 'utf8');
const mainJs = fs.readFileSync(path.join(root, 'src', 'js', 'main.js'), 'utf8');

test('Home index.html contains the native hero benefits carousel markup', () => {
  assert.match(homeHtml, /class="hero-benefits-bar theme-color-a"\s+id="heroBenefitsBar"/);
  assert.match(homeHtml, /id="heroIndPrevBtn"[\s\S]*?aria-label="Indicador anterior"/);
  assert.match(homeHtml, /id="heroIndNextBtn"[\s\S]*?aria-label="Próximo indicador"/);
  assert.match(homeHtml, /class="hero-ind-viewport"\s+id="heroIndViewport"/);
  assert.match(homeHtml, /class="hero-ind-stage"\s+id="heroIndStage"/);
  assert.match(homeHtml, /class="hero-ind-dots"\s+id="heroIndDots"\s+role="tablist"/);

  // Group 0 pre-rendered
  assert.match(homeHtml, /data-group="0"/);
  assert.match(homeHtml, /\+18 anos/);
  assert.match(homeHtml, /de experiência/);
  assert.match(homeHtml, /\+300/);
  assert.match(homeHtml, /especialistas técnicos/);
  assert.match(homeHtml, /100%/);
  assert.match(homeHtml, /atuação em todo o Brasil/);
  assert.match(homeHtml, /\+1\.250/);
  assert.match(homeHtml, /projetos entregues/);

  // Focus zones and mini-progress
  assert.match(homeHtml, /class="hero-focus-zone focus-zone"/);
  assert.match(homeHtml, /class="hero-mini-progress"/);
});

test('hero.css implements alternating background colors, compact height, and fine progress bar', () => {
  // Height and compact layout
  assert.match(heroCss, /\.hero-benefits-bar\s*\{[\s\S]*?height:\s*86px[\s\S]*?border-radius:\s*16px/);
  assert.match(heroCss, /\.hero-benefits-bar\.theme-color-a\s*\{[\s\S]*?background-color:\s*var\(--brand-primary\)/);
  assert.match(heroCss, /\.hero-benefits-bar\.theme-color-b\s*\{[\s\S]*?background-color:\s*var\(--brand-secondary\)/);
  assert.match(heroCss, /transition:\s*background-color\s+0\.85s/);

  // Fine mini progress bar
  assert.match(heroCss, /\.hero-mini-progress\s*\{[\s\S]*?height:\s*2\.5px/);
  assert.match(heroCss, /\.hero-stat\.active \.hero-mini-progress/);

  // Focus zone subtle hover
  assert.match(heroCss, /\.hero-focus-zone:hover/);
  assert.match(heroCss, /\.hero-focus-zone::before/);

  // Dots at bottom without increasing height
  assert.match(heroCss, /\.hero-ind-dots\s*\{[\s\S]*?position:\s*absolute[\s\S]*?bottom:\s*(?:3|4)px/);
  assert.match(heroCss, /\.hero-ind-dots button\.active\s*\{[\s\S]*?width:\s*18px/);
});

test('hero.css implements 2 indicators visible simultaneously on mobile with swipe and snap', () => {
  // Mobile breakpoint
  assert.match(heroCss, /@media\s*\(max-width:\s*640px\)\s*\{[\s\S]*?\.hero-ind-viewport\s*\{[\s\S]*?overflow-x:\s*auto[\s\S]*?scroll-snap-type:\s*x mandatory/);
  assert.match(heroCss, /@media\s*\(max-width:\s*640px\)\s*\{[\s\S]*?\.hero-ind-row\s*\{[\s\S]*?width:\s*200%[\s\S]*?min-width:\s*200%/);
  assert.match(heroCss, /@media\s*\(max-width:\s*640px\)\s*\{[\s\S]*?flex:\s*0 0 25%[\s\S]*?scroll-snap-align:\s*center/);
  assert.match(heroCss, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
});

test('main.js configures the 3 groups of 4 indicators and interactions', () => {
  // GROUPS array with all 12 items
  assert.match(mainJs, /18[\s\S]*?de experiência/);
  assert.match(mainJs, /300[\s\S]*?especialistas técnicos/);
  assert.match(mainJs, /100[\s\S]*?atuação em todo o Brasil/);
  assert.match(mainJs, /1250[\s\S]*?projetos entregues/);
  assert.match(mainJs, /120[\s\S]*?grandes clientes atendidos/);
  assert.match(mainJs, /0[\s\S]*?paradas não programadas/);
  assert.match(mainJs, /50[\s\S]*?horas de inspeção e ensaios/);
  assert.match(mainJs, /100[\s\S]*?conformidade com NRs e ASME/);
  assert.match(mainJs, /500[\s\S]*?laudos e perícias emitidos/);
  assert.match(mainJs, /'24\/7'[\s\S]*?prontidão operacional/);
  assert.match(mainJs, /'ISO 9001'[\s\S]*?qualidade e rigor certificados/);
  assert.match(mainJs, /15000[\s\S]*?ativos industriais avaliados/);

  // Functions and behaviors
  assert.match(mainJs, /function\s+setTheme/);
  assert.match(mainJs, /function\s+renderDots/);
  assert.match(mainJs, /function\s+runProgress/);
  assert.match(mainJs, /function\s+goToGroup/);
  assert.match(mainJs, /function\s+step\(/);
  assert.match(mainJs, /function\s+syncToNearestMobileCard/);
  assert.match(mainJs, /IntersectionObserver/);
  assert.match(mainJs, /visibilitychange/);
});
