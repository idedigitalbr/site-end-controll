const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const styles = fs.readFileSync(path.join(root, 'src', 'css', 'hero.css'), 'utf8');
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

test('uses Lucide icons for navigation and CTAs while keeping indicators text-only', () => {
  assert.match(home, /class="hero-arrow-icon" data-lucide="chevron-left"/);
  assert.match(home, /class="hero-arrow-icon" data-lucide="chevron-right"/);
  assert.equal((home.match(/class="hero-cta-icon" data-lucide="arrow-right"/g) || []).length, 1);
  assert.doesNotMatch(home, /benefit-icon-box|benefit-svg-icon/i);
  assert.match(home, /unpkg\.com\/lucide@0\.321\.0/);
});

test('keeps only the primary Hero CTA', () => {
  const heroActions = home.match(/<div class="hero-actions-container">([\s\S]*?)<\/div>/i)?.[1] || '';
  assert.match(heroActions, /Fale com um especialista/);
  assert.equal((heroActions.match(/<a\b/g) || []).length, 1);
  assert.doesNotMatch(heroActions, /Conheça nossas soluções/i);
});

test('removes excessive neon glow and shadow effects from the hero banner', () => {
  assert.match(styles, /\.hero-title-main \.hero-title-highlight\s*\{[\s\S]*?color:\s*#00215d[\s\S]*?font-style:\s*italic\s*;[\s\S]*?font-weight:\s*300\s*;/i);
  assert.match(styles, /\.hero-arrow-btn:hover\s*\{[\s\S]*?filter:\s*none\s*;/i);
  assert.match(styles, /\.hud-circuit-svg\s*\{[\s\S]*?filter:\s*none\s*;[\s\S]*?animation:\s*none\s*;/i);
  assert.match(styles, /\.hud-blur-glow\s*\{[\s\S]*?display:\s*none\s*;/i);
  assert.doesNotMatch(home, /hero-separator-glow/i);
  assert.match(styles, /\.benefits-accent-light\s*\{[\s\S]*?display:\s*none\s*;/i);
  assert.match(styles, /\.hero-benefits-bar\s*\{[\s\S]*?box-shadow:\s*0 8px 20px[\s\S]*?backdrop-filter:\s*none\s*;/i);
});

test('mantém as setas do banner principal em azul-marinho no hover', () => {
  const arrowHoverRule = styles.match(/\.hero-arrow-btn:hover\s*\{([\s\S]*?)\}/i);

  assert.ok(arrowHoverRule, 'a regra de hover das setas do banner precisa existir');
  assert.match(arrowHoverRule[1], /color:\s*#00215D\s*;/i);
  assert.match(arrowHoverRule[1], /border-color:\s*#00215D\s*;/i);
});

test('uses the light navy hero reference and the requested indicator copy', () => {
  assert.match(home, /Engenharia - Inspeção - Integridade/);
  assert.doesNotMatch(home, /EXCELÊNCIA\s*[\s\S]*?PRECISÃO\s*[\s\S]*?TECNOLOGIA/i);
  assert.match(home, />\+18 anos<\/h3>/i);
  assert.match(home, />de experiência<\/p>/i);
  assert.match(home, />\+300<\/h3>/i);
  assert.match(home, />especialistas<\/p>/i);
  assert.match(home, />100%<\/h3>/i);
  assert.match(home, />de atuação em todo o território nacional<\/p>/i);
  assert.match(home, />\+1\.250<\/h3>/i);
  assert.match(home, />projetos entregues<\/p>/i);
  assert.match(styles, /\.hero-static-container\s*\{[\s\S]*?background:\s*#f4f9fc\s*;/i);
  assert.match(styles, /\.hero-title-main\s*\{[\s\S]*?color:\s*#071429\s*;/i);
  assert.match(styles, /\.hero-lead-desc\s*\{[\s\S]*?color:\s*#475569\s*;/i);
  assert.match(styles, /\.hero-overlay-blue-tint\s*\{[\s\S]*?display:\s*none\s*;/i);
  assert.match(styles, /\.hero-benefits-bar\s*\{[\s\S]*?background:\s*#00215d\s*;/i);
});

test('uses a navy background and white copy in the Hero badge', () => {
  assert.match(styles, /\.hero-badge-pill\s*\{[\s\S]*?background:\s*#00215d\s*;[\s\S]*?color:\s*#ffffff\s*;/i);
  assert.match(home, /<div class="hero-badge-pill">Engenharia - Inspeção - Integridade<\/div>/i);
});

test('breaks the Hero headline after the italic integridade highlight', () => {
  assert.match(home, /Engenharia de\s*<span class="hero-title-highlight">integridade<\/span>\s*<br>\s*para ativos que sustentam\s*<br>/i);
  assert.match(styles, /\.hero-title-main \.hero-title-highlight\s*\{[\s\S]*?font-style:\s*italic\s*;[\s\S]*?font-weight:\s*300\s*;/i);
});

test('uses the shared semantic italic highlight for grandes operações', () => {
  assert.match(home, /<em class="hero-title-highlight">grandes operações<\/em>/i);
  assert.match(styles, /\.hero-title-main \.hero-title-highlight\s*\{[\s\S]*?color:\s*#00215d\s*;[\s\S]*?font-style:\s*italic\s*;[\s\S]*?font-weight:\s*300\s*;/i);
});

test('adds breathing room before the primary Hero CTA', () => {
  assert.match(styles, /\.hero-actions-container\s*\{[\s\S]*?margin-top:\s*28px/i);
});

test('fits the desktop Hero below the fixed header', () => {
  assert.match(styles, /\.hero-static-container\s*\{[\s\S]*?height:\s*calc\(100vh - 96px\)[\s\S]*?min-height:\s*calc\(100vh - 96px\)/i);
});

test('shifts Hero photography right of the text gradient', () => {
  assert.match(styles, /\.hero-bg-photo\s*\{[\s\S]*?object-position:\s*35%\s+top\s*;/i);
});

test('uses the navy indicator band, white copy and inverted primary CTA', () => {
  assert.match(styles, /\.hero-benefits-bar\s*\{[\s\S]*?background:\s*#00215d\s*;/i);
  assert.match(styles, /\.benefit-title\s*\{[\s\S]*?font-size:\s*1\.95rem[\s\S]*?color:\s*#ffffff\s*;/i);
  assert.match(styles, /\.benefit-desc\s*\{[\s\S]*?color:\s*#ffffff\s*;/i);
  assert.match(styles, /\.hero-actions-container \.btn\.primary\s*\{[\s\S]*?background:\s*#ffffff\s*!important[\s\S]*?border-color:\s*#00215d\s*!important[\s\S]*?color:\s*#00215d\s*!important/i);
  assert.match(styles, /\.hero-actions-container \.btn\.primary:hover\s*\{[\s\S]*?background:\s*#00215d\s*!important[\s\S]*?color:\s*#ffffff\s*!important/i);
});

test('keeps the four indicators compact, aligned and centered without icons', () => {
  assert.match(styles, /\.hero-benefits-bar\s*\{[\s\S]*?position:\s*relative[\s\S]*?left:\s*auto[\s\S]*?right:\s*auto[\s\S]*?width:\s*calc\(100% - 80px\)[\s\S]*?max-width:\s*1200px[\s\S]*?margin:\s*-32px auto 32px[\s\S]*?padding:\s*14px 8px/i);
  assert.match(styles, /\.benefit-item\s*\{[\s\S]*?justify-content:\s*center[\s\S]*?text-align:\s*center[\s\S]*?position:\s*relative/i);
  assert.match(styles, /\.benefit-item:not\(:last-child\)::after\s*\{[\s\S]*?right:\s*0[\s\S]*?top:\s*15%[\s\S]*?height:\s*70%[\s\S]*?width:\s*1px[\s\S]*?background:\s*rgba\(255,\s*255,\s*255,\s*0\.15\)/i);
  assert.match(styles, /\.benefit-text-box\s*\{[\s\S]*?align-items:\s*center[\s\S]*?text-align:\s*center/i);
  assert.doesNotMatch(home, /benefit-icon-box|benefit-svg-icon/i);
});

test('hides indicator separators when the Home banner stacks on narrow screens', () => {
  assert.match(styles, /@media\s*\(max-width:\s*768px\)[\s\S]*?\.benefit-item:not\(:last-child\)::after\s*\{[\s\S]*?display:\s*none\s*!important/i);
});

test('keeps the light hero header readable without relying on white navigation', () => {
  assert.match(home, /class="site-header site-header--light-hero"/i);
  assert.match(home, /src="\.\/assets\/Logos\/logo-principal-original-horizontal-endcontrol\.png"/i);
  assert.match(styles, /\.hero-static-container\s*\{[\s\S]*?padding-top:/i);
  const headerStyles = fs.readFileSync(path.join(root, 'src', 'css', 'header.css'), 'utf8');
  assert.match(headerStyles, /\.site-header--light-hero\s*\{[\s\S]*?background:\s*#ffffff\s*;/i);
  assert.match(headerStyles, /\.site-header--light-hero\s+\.main-menu\s*\{[\s\S]*?color:\s*#00215d\s*;/i);
});

test('uses a rounded navy hover and white sticky state for the light Hero header', () => {
  const headerStyles = fs.readFileSync(path.join(root, 'src', 'css', 'header.css'), 'utf8');
  assert.match(headerStyles, /\.site-header--light-hero \.main-menu > a:hover,[\s\S]*?background:\s*#00215d\s*(?:!important\s*)?;[\s\S]*?color:\s*#ffffff\s*(?:!important\s*)?;[\s\S]*?border-radius:\s*999px/i);
  assert.match(headerStyles, /\.site-header\.site-header--light-hero\.scrolled\s*\{[\s\S]*?background:\s*#ffffff\s*;[\s\S]*?backdrop-filter:\s*none\s*;/i);
  assert.match(headerStyles, /\.site-header--light-hero \.main-menu \.btn-contacts-menu:hover\s*\{[\s\S]*?background:\s*#00215d\s*!important[\s\S]*?color:\s*#ffffff\s*!important/i);
});

test('separates the hero copy from the photo and keeps the benefits bar restrained', () => {
  assert.match(styles, /\.hero-overlay-dark\s*\{[\s\S]*?#f4f9fc\s+0%[\s\S]*?#f4f9fc\s+36%[\s\S]*?rgba\(244,\s*249,\s*252,\s*0\.88\)\s+40%[\s\S]*?rgba\(244,\s*249,\s*252,\s*0\)\s+64%/i);
  assert.match(styles, /\.hero-overlay-bottom\s*\{[\s\S]*?display:\s*none\s*;/i);
  assert.match(styles, /\.hero-hud-layer\s*\{[\s\S]*?opacity:\s*0\.08\s*;/i);
  assert.match(styles, /\.hero-badge-pill\s*\{[\s\S]*?backdrop-filter:\s*none\s*;/i);
  assert.match(styles, /\.hero-benefits-bar\s*\{[\s\S]*?position:\s*relative[\s\S]*?margin:\s*-32px auto 32px[\s\S]*?padding:\s*14px 8px[\s\S]*?box-shadow:\s*0 8px 20px/i);
});

test('places the indicator band between the Hero and Sobre section', () => {
  const heroStart = home.indexOf('<section class="hero-static-container"');
  const heroEnd = home.indexOf('</section>', heroStart);
  const benefitsStart = home.indexOf('<div class="hero-benefits-bar">');
  const aboutStart = home.indexOf('<section class="section about-premium-section', heroEnd);

  assert.ok(heroStart >= 0 && heroEnd > heroStart);
  assert.ok(benefitsStart > heroEnd && benefitsStart < aboutStart);
  assert.match(styles, /\.hero-benefits-bar\s*\{[\s\S]*?position:\s*relative[\s\S]*?margin:\s*-32px auto 32px/i);
});
