const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'src', 'css', 'sections.css'), 'utf8');
const originalImage = './assets/Fotografias/originais-16-9/endcontrol-equipe-escritorio-projetos-mecanicos-engenharia.webp';
const aboutStart = html.indexOf('<section class="section about-premium-section');
const aboutEnd = html.indexOf('</section>', aboutStart) + '</section>'.length;
const aboutSection = html.slice(aboutStart, aboutEnd);

test('about section uses one original pointing image instead of the three-image grid', () => {
  assert.doesNotMatch(aboutSection, /about-media-grid/);
  assert.match(aboutSection, new RegExp(`class="about-media-single"[\\s\\S]*?src="${originalImage.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`));
  assert.equal((aboutSection.match(/<img\b/g) || []).length, 1);
  assert.ok(fs.existsSync(path.join(root, originalImage.replace('./', ''))), 'the original image asset should exist');
});

test('about single image keeps the framed media treatment on desktop and mobile', () => {
  assert.match(styles, /\.about-media-single\s*\{[\s\S]*?min-height:\s*380px;[\s\S]*?overflow:\s*hidden;/);
  assert.match(styles, /\.about-media-single img\s*\{[\s\S]*?width:\s*100%;[\s\S]*?height:\s*100%;[\s\S]*?object-fit:\s*cover;/);
  assert.match(styles, /\.about-media-single\s*\{[\s\S]*?height:\s*280px;/);
});
