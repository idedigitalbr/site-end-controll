const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const styles = fs.readFileSync(path.join(root, 'src', 'css', 'work-units-footer.css'), 'utf8');
const sectionStyles = fs.readFileSync(path.join(root, 'src', 'css', 'sections.css'), 'utf8');
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const footer = home.match(/<footer\b[\s\S]*?<\/footer>/i)?.[0] || '';

test('uses white text and icons throughout the minimal footer accents', () => {
  assert.match(footer, /class="footer-header-icon"[^>]*stroke="#ffffff"/i);
  assert.match(footer, /class="footer-whatsapp-icon"[\s\S]*?stroke="#ffffff"[\s\S]*?fill="#ffffff"/i);
  assert.match(footer, /class="footer-email-icon"[^>]*stroke="#ffffff"/i);
  assert.doesNotMatch(footer, /#00c2ff/i);
  assert.match(styles, /\.footer-header-title\s*\{[\s\S]*?color:\s*#ffffff\s*;/i);
  assert.match(styles, /\.footer-phone-number\s*\{[\s\S]*?color:\s*#ffffff\s*;/i);
  assert.match(styles, /\.footer-wsp-button\s*\{[\s\S]*?border:\s*1px solid rgba\(255,\s*255,\s*255,\s*0\.7\)[\s\S]*?color:\s*#ffffff\s*;/i);
});

test('removes the presidency testimonials section from the rendered Home', () => {
  assert.match(home, /<section class="testimonials-section-premium"[^>]*\bhidden\b/i);
  assert.match(sectionStyles, /\.testimonials-section-premium\[hidden\]\s*\{[\s\S]*?display:\s*none\s*!important\s*;/i);
});

test('removes the opportunities and careers section from the rendered Home', () => {
  assert.match(home, /<section class="oportunidades-section[^>]*\bhidden\b/i);
  assert.match(sectionStyles, /\.oportunidades-section\[hidden\]\s*\{[\s\S]*?display:\s*none\s*!important\s*;/i);
});
