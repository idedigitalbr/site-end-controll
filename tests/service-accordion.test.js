const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const runtime = fs.readFileSync(path.join(root, 'src', 'js', 'service-pages.js'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'src', 'css', 'servico-integridade.css'), 'utf8');

test('service accordion runtime supports selection, keyboard navigation and controls', () => {
  assert.match(runtime, /function initWhenApplyAccordion\(\)/);
  assert.match(runtime, /btnPrevAcc/);
  assert.match(runtime, /btnNextAcc/);
  assert.match(runtime, /accDotsIndex/);
  assert.match(runtime, /keydown/);
  assert.match(runtime, /scrollIntoView|scrollTo/);
  assert.match(runtime, /aria-expanded/);
  assert.match(runtime, /classList\.toggle\('is-active', index === activeIndex\)/);
});

test('service accordion has a touch-safe mobile mode without hover expansion', () => {
  const mobileBlock = styles.match(/\/\* SERVICE ACCORDION MOBILE INTERACTION \*\/[\s\S]*$/i)?.[0] || '';

  assert.match(mobileBlock, /@media\s*\(hover:\s*none\),\s*\(pointer:\s*coarse\)/i);
  assert.match(mobileBlock, /\.sn-page-wrapper \.endo-acc-row[\s\S]*?scroll-snap-type:\s*x\s+mandatory/i);
  assert.match(mobileBlock, /\.sn-page-wrapper \.endo-acc-panel:hover[\s\S]*?flex:\s*0\s+0\s+min\(/i);
  assert.match(mobileBlock, /\.sn-page-wrapper \.endo-acc-panel\.is-active[\s\S]*?flex-basis/i);
  assert.match(mobileBlock, /\.sn-page-wrapper \.endo-acc-nav:hover[\s\S]*?box-shadow:\s*none/i);
});
