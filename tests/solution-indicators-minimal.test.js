const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

test('styles .sn-indicators-card with the minimalist dark navy layout in sobre-nos.css', () => {
  const css = fs.readFileSync(path.join(root, 'src', 'css', 'sobre-nos.css'), 'utf8');

  // Background and border
  assert.match(css, /\.sn-indicators-card\s*\{[\s\S]*?background:\s*#00215d\s*;/i);
  assert.match(css, /\.sn-indicators-card\s*\{[\s\S]*?border:\s*1px solid rgba\(255,\s*255,\s*255,\s*0\.12\)\s*;/i);
  assert.match(css, /\.sn-indicators-card\s*\{[\s\S]*?border-radius:\s*18px\s*;/i);

  // Icon box hidden
  assert.match(css, /\.sn-indicator-icon-box\s*\{[\s\S]*?display:\s*none/i);

  // Values and labels styling
  assert.match(css, /\.sn-indicator-value\s*\{[\s\S]*?color:\s*#ffffff\s*;/i);
  assert.match(css, /\.sn-indicator-label\s*\{[\s\S]*?color:\s*#ffffff\s*;/i);

  // Item dividers
  assert.match(css, /\.sn-indicator-item:not\(:last-child\)::after\s*\{[\s\S]*?background:\s*rgba\(255,\s*255,\s*255,\s*0\.15\)\s*;/i);
});

const solutionPages = [
  {
    file: '3-solucao-ensaios-nao-destrutivos-ends.html',
    values: ['+18 anos', '+300', '+1.250', '100%', '+120']
  },
  {
    file: '6-solucao-elaboracao-de-projetos-mecanicos.html',
    values: ['+18 anos', '+300', '+1.250', '100%', '+120']
  },
  {
    file: '8-solucao-inspecao-e-adequacao-normativa.html',
    values: ['+18 anos', '+300', '+1.250', '100%', '+120']
  },
  {
    file: '10-solucao-trepanacao-hot-tapping.html',
    values: ['+18 anos', 'Até 6"', '0%', '100%', '+120']
  },
  {
    file: '12-solucao-consultoria-e-assessoria-tecnica.html',
    values: ['+18 anos', '+500', '+350', '100%', '+120']
  }
];

for (const { file, values } of solutionPages) {
  test(`validates minimalist text-only indicators banner in ${file}`, () => {
    const html = fs.readFileSync(path.join(root, file), 'utf8');

    // Indicators card must exist
    const cardMatch = html.match(/<div class="sn-indicators-card">([\s\S]*?)<\/div>\s*<\/div>\s*<\/section>/i);
    assert.ok(cardMatch, `Card de indicadores precisa existir na primeira dobra de ${file}`);

    const cardContent = cardMatch[1];

    // Must NOT contain any icon boxes or SVG tags
    assert.doesNotMatch(cardContent, /sn-indicator-icon-box/i, `Não deve conter sn-indicator-icon-box em ${file}`);
    assert.doesNotMatch(cardContent, /<svg|<i\b/i, `Não deve conter tags de ícone <svg> ou <i> em ${file}`);

    // Must contain 5 indicator items
    const items = cardContent.match(/class="sn-indicator-item"/g) || [];
    assert.equal(items.length, 5, `Deve conter exatamente 5 itens de indicadores em ${file}`);

    // Must contain expected values
    for (const val of values) {
      assert.ok(cardContent.includes(val), `Deve conter o valor "${val}" em ${file}`);
    }
  });
}
