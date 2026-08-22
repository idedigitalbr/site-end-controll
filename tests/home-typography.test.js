const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const heroStyles = fs.readFileSync(path.join(root, 'src', 'css', 'hero.css'), 'utf8');
const solutionStyles = fs.readFileSync(path.join(root, 'src', 'css', 'solucoes.css'), 'utf8');
const sectionStyles = fs.readFileSync(path.join(root, 'src', 'css', 'sections.css'), 'utf8');
const segmentsStyles = fs.readFileSync(path.join(root, 'src', 'css', 'segmentos.css'), 'utf8');
const presenceStyles = fs.readFileSync(path.join(root, 'src', 'css', 'presenca-nacional.css'), 'utf8');

const headlinePattern = /font-size:\s*clamp\(1\.8rem,\s*3\.5vw,\s*2\.4rem\)[\s\S]*?font-weight:\s*800[\s\S]*?line-height:\s*1\.2/i;
const italicPattern = /(?=[\s\S]*font-style:\s*italic\s*;)(?=[\s\S]*font-weight:\s*300\s*;)(?=[\s\S]*color:\s*#00215D\s*;)/i;
const descriptionPattern = /(?=[\s\S]*font-size:\s*1\.05rem\s*;)(?=[\s\S]*line-height:\s*1\.5\s*;)(?=[\s\S]*color:\s*#475569\s*;)/i;
const badgePattern = (selector) => new RegExp(`${selector}\\s*\\{(?=[^}]*font-size:\\s*0\\.72rem)(?=[^}]*letter-spacing:\\s*0\\.14em)(?=[^}]*padding:\\s*8px 1?4px)[^}]*\\}`, 'i');

test('reapplies the shared badge, headline, italic highlight and description pattern across Home sections', () => {
  assert.match(home, /Engenharia de\s*<span class="hero-title-highlight">integridade<\/span>/i);
  assert.match(home, /<em class="hero-title-highlight">grandes operações<\/em>/i);
  assert.match(home, /Soluções <em>integradas<\/em> para cada desafio industrial\./i);
  assert.match(home, /Principais <span class="segmentos-highlight">Áreas<\/span> de Atuação/i);
  assert.match(home, /<span class="highlight">indústria brasileira<\/span>/i);
  assert.match(home, /<span class="highlight-blue-gradient">confiança<br>e resultado<\/span>/i);
  assert.match(home, /<span class="faq-v2-highlight">principais dúvidas\.<\/span>/i);

  assert.match(heroStyles, /\.hero-badge-pill\s*\{(?=[^}]*font-size:\s*0\.72rem)(?=[^}]*letter-spacing:\s*0\.14em)(?=[^}]*padding:\s*8px 14px)[^}]*\}/i);
  assert.match(heroStyles, /\.hero-title-main\s*\{[\s\S]*?color:\s*#071429\s*;/i);
  assert.match(heroStyles, headlinePattern);
  assert.match(heroStyles.match(/\.hero-title-main \.hero-title-highlight\s*\{([\s\S]*?)\}/i)?.[1] || '', italicPattern);
  assert.match(heroStyles.match(/\.hero-lead-desc\s*\{([\s\S]*?)\}/i)?.[1] || '', descriptionPattern);

  assert.match(sectionStyles, badgePattern('\\.about-eyebrow'));
  assert.match(sectionStyles.match(/\.about-headline\s*\{([\s\S]*?)\}/i)?.[1] || '', headlinePattern);
  assert.match(sectionStyles.match(/\.about-premium-section \.highlight-blue-gradient\s*\{([\s\S]*?)\}/i)?.[1] || '', italicPattern);
  assert.match(sectionStyles.match(/\.about-paragraphs p\s*\{([\s\S]*?)\}/i)?.[1] || '', descriptionPattern);
  assert.match(sectionStyles.match(/\.about-paragraphs p\s*\{([\s\S]*?)\}/i)?.[1] || '', /text-align:\s*justify\s*;/i);

  assert.match(solutionStyles, /\.solucoes-badge-text\s*\{(?=[^}]*font-size:\s*0\.72rem)(?=[^}]*letter-spacing:\s*0\.14em)[^}]*\}/i);
  assert.match(solutionStyles, /\.solucoes-badge\s*\{[\s\S]*?padding:\s*8px 14px/i);
  assert.match(solutionStyles, /\.solucoes-badge-text\s*\{[\s\S]*?text-transform:\s*uppercase/i);
  assert.match(solutionStyles.match(/\.solucoes-heading\s*\{([\s\S]*?)\}/i)?.[1] || '', headlinePattern);
  assert.match(solutionStyles.match(/\.solucoes-heading em\s*\{([\s\S]*?)\}/i)?.[1] || '', italicPattern);
  assert.match(solutionStyles.match(/\.solucoes-description\s*\{([\s\S]*?)\}/i)?.[1] || '', descriptionPattern);

  assert.match(segmentsStyles, badgePattern('\\.segmentos-eyebrow'));
  assert.match(segmentsStyles.match(/\.segmentos-title\s*\{([\s\S]*?)\}/i)?.[1] || '', headlinePattern);
  assert.match(segmentsStyles.match(/\.segmentos-title\s*\{([\s\S]*?)\}/i)?.[1] || '', /color:\s*#071429\s*;/i);
  assert.match(segmentsStyles.match(/\.segmentos-highlight\s*\{([\s\S]*?)\}/i)?.[1] || '', italicPattern);
  assert.match(segmentsStyles.match(/\.segmentos-subtitle\s*\{([\s\S]*?)\}/i)?.[1] || '', descriptionPattern);

  assert.match(presenceStyles, badgePattern('\\.presenca-eyebrow'));
  assert.match(presenceStyles.match(/\.presenca-heading\s*\{([\s\S]*?)\}/i)?.[1] || '', headlinePattern);
  assert.match(presenceStyles.match(/\.presenca-heading\s*\{([\s\S]*?)\}/i)?.[1] || '', /color:\s*#071429\s*;/i);
  assert.match(presenceStyles.match(/\.presenca-heading \.highlight\s*\{([\s\S]*?)\}/i)?.[1] || '', italicPattern);
  assert.match(presenceStyles.match(/\.presenca-paragraph\s*\{([\s\S]*?)\}/i)?.[1] || '', descriptionPattern);

  assert.match(sectionStyles, badgePattern('\\.faq-v2-eyebrow'));
  assert.match(sectionStyles.match(/\.faq-v2-title\s*\{([\s\S]*?)\}/i)?.[1] || '', headlinePattern);
  assert.match(sectionStyles.match(/\.faq-v2-title\s*\{([\s\S]*?)\}/i)?.[1] || '', /color:\s*#071429\s*;/i);
  assert.match(sectionStyles.match(/\.faq-v2-highlight\s*\{([\s\S]*?)\}/i)?.[1] || '', italicPattern);
});
