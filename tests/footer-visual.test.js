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

test('testimonials section was removed from Home per user request', () => {
  assert.doesNotMatch(home, /<section class="testimonials-section-premium"/i);
});

test('opportunities and careers section was removed from Home per user request', () => {
  assert.doesNotMatch(home, /id="oportunidades"/i);
  assert.doesNotMatch(home, /class="oportunidades-section/i);
});
