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

test('all 12 service pages have distinct contextual Lucide icons for every accordion card', () => {
  for (let i = 1; i <= 12; i++) {
    const filename = fs.readdirSync(root).find(x => x.startsWith(i + '-solucao'));
    assert.ok(filename, `Solution page ${i} should exist`);
    const html = fs.readFileSync(path.join(root, filename), 'utf8');
    const panels = html.match(/<li class="endo-acc-panel[\s\S]*?<\/li>/g) || [];
    assert.equal(panels.length, 8, `${filename} should have exactly 8 accordion panels`);

    const icons = [];
    panels.forEach((panel, idx) => {
      const match = panel.match(/<i class="endo-acc-icon" data-lucide="([^"]+)"/);
      assert.ok(match, `${filename} panel ${idx} should have a Lucide icon with data-lucide`);
      assert.notEqual(match[1], 'check-circle-2', `${filename} panel ${idx} should not use generic check-circle-2`);
      assert.notEqual(match[1], 'circle-check', `${filename} panel ${idx} should not use generic circle-check`);
      icons.push(match[1]);
    });

    const uniqueIcons = new Set(icons);
    assert.ok(uniqueIcons.size >= 6, `${filename} should have rich icon variety (found ${uniqueIcons.size} unique out of 8)`);
  }
});
