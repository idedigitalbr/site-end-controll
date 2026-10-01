const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const styles = fs.readFileSync(path.join(root, 'src', 'css', 'solucoes.css'), 'utf8');
const solutionsScript = fs.readFileSync(path.join(root, 'src', 'js', 'solucoes.js'), 'utf8');
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

test('uses the standard navy in the Soluções section visual elements', () => {
  assert.match(styles, /\.solucoes-section-header\s*\{[\s\S]*?align-items:\s*center[\s\S]*?text-align:\s*center/i);
  assert.match(styles, /\.solucoes-main-content\s*\{[\s\S]*?grid-template-areas:\s*"center right"/i);
  assert.match(styles, /\.solucoes-badge\s*\{[\s\S]*?border-radius:\s*999px[\s\S]*?background:\s*(?:#00215d|var\(--brand-primary\))/i);
  assert.match(styles, /\.solucoes-badge-text\s*\{[\s\S]*?color:\s*#ffffff[\s\S]*?text-transform:\s*uppercase/i);
  assert.match(styles, /\.service-node-icon\s*\{[\s\S]*?border:\s*1\.5px\s+solid\s+(?:#00215D|var\(--brand-primary\))\s*;/i);
  assert.match(styles, /\.service-node\.is-active \.service-node-icon\s*\{[\s\S]*?background:\s+(?:#00215D|var\(--brand-primary\))\s*!important;/i);
  assert.match(styles, /\.radar-circle-outer\s*\{[\s\S]*?(?:rgba\(0,\s*33,\s*93|rgba\(var\(--brand-primary-rgb\))/i);
  assert.match(styles, /\.solucoes-section \.radar-sweep,[\s\S]*?display:\s*none\s*!important/i);
  assert.match(styles, /\.solucoes-section \.radar-circle-outer,[\s\S]*?\.solucoes-section \.radar-circle-inner\s*\{[\s\S]*?box-shadow:\s*none/i);
});

test('keeps the Soluções copy in the section header order', () => {
  assert.match(home, /<div class="solucoes-section-header">[\s\S]*?<div class="solucoes-badge">[\s\S]*?Soluções Integradas[\s\S]*?<h2 class="solucoes-heading">Soluções <em>integradas<\/em> para cada desafio industrial\.<\/h2>[\s\S]*?<p class="solucoes-description">Atuamos de forma completa e integrada para aumentar a confiabilidade, a segurança e a performance dos seus ativos industriais\.<\/p>[\s\S]*?<\/div>[\s\S]*?<div class="solucoes-main-content">/i);
  assert.match(styles, /\.solucoes-section-header\s*\{[\s\S]*?width:\s*min\(1280px/);
  assert.match(styles, /\.solucoes-heading\s*\{[\s\S]*?max-width:\s*1200px[\s\S]*?font-size:\s*clamp\(28px,\s*3\.8vw,\s*var\(--font-size-headline,\s*38px\)\)/);
  assert.match(styles, /\.solucoes-description\s*\{[\s\S]*?font-size:\s*var\(--font-size-body,\s*16px\)/);
  assert.doesNotMatch(home, /<div class="solucoes-main-content">[\s\S]*?class="solucoes-left-col"/i);
});

test('uses Lucide icons for the Soluções radar nodes', () => {
  assert.doesNotMatch(home, /class="stat-lucide"/);
  assert.match(solutionsScript, /data-lucide=\"\$\{s\.iconName\}\"/);
  assert.match(solutionsScript, /iconName:\s*\[[\s\S]*'shield'[\s\S]*'landmark'/);
  assert.match(solutionsScript, /ringRadiusPercent\s*=\s*s\.ringIndex\s*===\s*0\s*\?\s*45\s*:\s*26/);
  assert.match(solutionsScript, /dataset\.tooltip\s*=\s*s\.title/);
  assert.match(solutionsScript, /node\.addEventListener\('keydown'/);
  assert.match(styles, /\.solucoes-section \.service-node-label\s*\{[\s\S]*?display:\s*none/i);
  assert.match(styles, /\.service-node\[data-tooltip\]::after\s*\{[\s\S]*?content:\s*attr\(data-tooltip\)/i);
  assert.match(home, /unpkg\.com\/lucide@0\.321\.0/);
});

test('uses the standard navy across the solution card structure', () => {
  assert.doesNotMatch(home, /class="highlight-badge"/i);
  assert.match(styles, /\.highlight-card\s*\{[\s\S]*?border:\s*1px\s+solid\s+(?:#00215D|var\(--brand-primary\))\s*;/i);
  assert.match(styles, /\.highlight-card:hover\s*\{[\s\S]*?border-color:\s*(?:#00215D|var\(--brand-primary\))\s*;/i);
  assert.match(styles, /\.card-side-arrow\s*\{[\s\S]*?border:\s*1\.5px\s+solid\s+(?:#00215D|var\(--brand-primary\))\s*;[\s\S]*?color:\s*(?:#00215D|var\(--brand-primary\))\s*;/i);
  assert.match(styles, /\.card-side-arrow:hover\s*\{[\s\S]*?background:\s+(?:#00215D|var\(--brand-primary\))\s*;[\s\S]*?border-color:\s*(?:#00215D|var\(--brand-primary\))\s*;/i);
  assert.match(styles, /\.highlight-card-list li svg\s*\{[\s\S]*?color:\s*(?:#00215D|var\(--brand-primary\))\s*;/i);
  assert.match(styles, /\.highlight-card-cta\s*\{[\s\S]*?background:\s+(?:#00215D|var\(--brand-primary\))\s*;[\s\S]*?justify-content:\s*center/i);
  assert.match(styles, /\.highlight-card-body\s*\{[\s\S]*?justify-content:\s*flex-start/i);
  assert.match(styles, /\.highlight-card-cta\s*\{[\s\S]*?margin-top:\s*auto/i);
  assert.match(styles, /\.highlight-card-cta svg\s*\{[\s\S]*?position:\s*absolute[\s\S]*?right:\s*14px/i);
  assert.match(styles, /\.card-progress-dot\.active\s*\{[\s\S]*?(?:rgba\(0,\s*33,\s*93,\s*0\.18\)|rgba\(var\(--brand-primary-rgb\),\s*0\.18\))\s*;/i);
  assert.match(styles, /\.card-progress-dot\.active\s*\{[\s\S]*?background:\s*(?:#00215D|var\(--brand-primary\))/i);
  assert.doesNotMatch(styles, /card-auto-progress/);
  assert.match(styles, /\.card-progress\s*\{[\s\S]*?justify-content:\s*center/i);
  assert.match(solutionsScript, /autoAdvanceInterval:\s*5000/i);
  assert.doesNotMatch(solutionsScript, /is-auto-playing/);
  assert.match(styles, /\.card-footer-btn\s*\{[\s\S]*?border:\s*1px\s+solid\s+(?:#00215D|var\(--brand-primary\))\s*;/i);
});

test('keeps mobile radar rings aligned with the SVG connection geometry', () => {
  assert.match(styles, /@media \(max-width: 768px\)[\s\S]*?\.solucoes-center-area\s*\{[\s\S]*?--r-outer:\s*45%[\s\S]*?--r-inner:\s*26%/i);
  assert.match(styles, /@media \(max-width: 480px\)[\s\S]*?\.solucoes-center-area\s*\{[\s\S]*?--r-outer:\s*45%[\s\S]*?--r-inner:\s*26%/i);
});

test('justifies all dynamic solution card descriptions', () => {
  assert.match(styles, /\.highlight-card-desc\s*\{[\s\S]*?text-align:\s*justify[\s\S]*?text-justify:\s*inter-word[\s\S]*?hyphens:\s*auto/i);
  assert.match(home, /<p class="highlight-card-desc" id="cardDesc">/i);
});

test('centers the radar-card composition and renders a connector for the selected service', () => {
  assert.match(home, /<svg class="radar-card-connector" id="radarCardConnector"[\s\S]*?id="radarCardConnectorPath"/i);
  assert.equal((home.match(/class="radar-card-connector"/g) || []).length, 1);
  assert.doesNotMatch(home, /radar-card-connector-(?:point|line)/i);
  assert.match(styles, /\.solucoes-main-content\s*\{[\s\S]*?justify-content:\s*center/i);
  assert.match(styles, /\.radar-card-connector\s*\{[\s\S]*?position:\s*absolute[\s\S]*?pointer-events:\s*none/i);
  assert.match(styles, /\.radar-card-connector\.is-visible\s*\{[\s\S]*?opacity:\s*1/i);
  assert.match(styles, /\.radar-connection\.is-loading\s*\{[\s\S]*?stroke-width:\s*1\.8[\s\S]*?stroke-dasharray:\s*1[\s\S]*?animation:\s*radar-connection-load/i);
  assert.match(styles, /\.radar-connection\.is-current\s*\{[\s\S]*?stroke:\s*(?:#00215D|var\(--brand-primary\))\s*!important[\s\S]*?stroke-width:\s*1\.8/i);
  assert.match(styles, /@keyframes\s+radar-connection-load[\s\S]*?stroke-dashoffset:\s*0/i);
  assert.match(styles, /\.solucoes-section \.radar-trail-svg\s*\{[\s\S]*?display:\s*block/i);
  assert.match(solutionsScript, /function clearConnectionLoading\s*\(/i);
  assert.match(solutionsScript, /function setConnectionLoading\s*\(/i);
  assert.match(solutionsScript, /setNextConnectionLoading\s*\(/i);
  assert.match(solutionsScript, /connection\.isClosing\s*&&\s*connection\.fromStepIndex\s*===\s*activeIndex/i);
  assert.match(solutionsScript, /autoAdvanceInterval:\s*5000/i);
  assert.match(solutionsScript, /getSafeArcAngles\(from\.angle,\s*to\.angle,\s*\{\s*insetDegrees:\s*0\s*\}/i);
  assert.match(solutionsScript, /function updateRadarCardConnector\s*\(/);
  assert.match(solutionsScript, /querySelector\('\.radar-circle-outer'\)/);
  const connectorStart = solutionsScript.indexOf('function updateRadarCardConnector');
  const connectorEnd = solutionsScript.indexOf('\n  const labelPlacementClasses', connectorStart);
  const connectorFunction = solutionsScript.slice(connectorStart, connectorEnd);
  assert.match(connectorFunction, /const circlePointX = circleCenterX \+ circleRadius/);
  assert.match(connectorFunction, /const circlePointY = circleCenterY/);
  assert.doesNotMatch(connectorFunction, /servicesData\[index\]\.angle/);
  assert.match(solutionsScript, /radarCardConnectorPath\.setAttribute\(\s*'d',\s*`M[\s\S]*?L \$\{/);
});

test('prioritizes the solution card over the radar on desktop', () => {
  assert.match(styles, /@media \(min-width: 1441px\)\s*\{[\s\S]*?grid-template-columns:\s*minmax\(360px,\s*36%\)\s+minmax\(0,\s*1fr\)/i);
  assert.match(styles, /@media \(min-width: 1441px\)\s*\{[\s\S]*?\.solucoes-center-area\s*\{[\s\S]*?max-width:\s*490px/i);
  assert.match(styles, /@media \(min-width: 1441px\)\s*\{[\s\S]*?\.highlight-card(?:-wrapper)?\s*\{[\s\S]*?max-width:\s*1060px/i);
  assert.match(styles, /@media \((?:min-width: 1201px\) and \(max-width: 1440px|max-width: 1440px\) and \(min-width: 1201px)\)\s*\{[\s\S]*?grid-template-columns:\s*minmax\(330px,\s*36%\)\s+minmax\(0,\s*1fr\)/i);
  assert.match(styles, /@media \((?:min-width: 1201px\) and \(max-width: 1440px|max-width: 1440px\) and \(min-width: 1201px)\)\s*\{[\s\S]*?\.solucoes-center-area\s*\{[\s\S]*?max-width:\s*450px/i);
  assert.match(styles, /@media \(min-width: 992px\) and \(max-width: 1200px\)\s*\{[\s\S]*?grid-template-columns:\s*minmax\(290px,\s*34%\)\s+minmax\(0,\s*1fr\)/i);
  assert.match(styles, /@media \(min-width: 992px\) and \(max-width: 1200px\)\s*\{[\s\S]*?\.solucoes-center-area\s*\{[\s\S]*?max-width:\s*380px/i);
  assert.match(styles, /\.highlight-card-title\s*\{[\s\S]*?font-size:\s*clamp\(30px,\s*2\.2vw,\s*46px\)/i);
  assert.match(styles, /\.highlight-card-title\s*\{[\s\S]*?font-weight:\s*750/i);
  assert.match(styles, /\.highlight-card-desc\s*\{[\s\S]*?text-align:\s*justify/i);
  assert.match(styles, /\.highlight-card-cta\s*\{[\s\S]*?height:\s*56px/i);
  assert.match(styles, /\.highlight-card-grid\s*\{[\s\S]*?grid-template-columns:\s*48%\s+52%/i);
});

test('torna a navegação do card acessível por teclado e leitura assistiva', () => {
  assert.match(home, /<button type="button" class="card-side-arrow prev" id="cardSidePrev" aria-label="Solução anterior"/i);
  assert.match(home, /<button type="button" class="card-side-arrow next" id="cardSideNext" aria-label="Próxima solução"/i);
  assert.match(home, /<div class="highlight-card-body" id="cardBody" role="region" aria-live="polite"/i);
  assert.match(solutionsScript, /createElement\('button'\)/i);
  assert.match(solutionsScript, /setAttribute\('type',\s*'button'\)/i);
  assert.match(solutionsScript, /setAttribute\('aria-label',\s*`Selecionar solução \$\{i \+ 1\}`\)/i);
  assert.match(solutionsScript, /setAttribute\('aria-current',\s*'true'\)/i);
  assert.match(styles, /\.card-progress-dot:focus-visible\s*\{[\s\S]*?outline:/i);
});

test('previews the selected service immediately and keeps its tooltip visible', () => {
  assert.match(solutionsScript, /let selectedIndex\s*=\s*activeIndex/);
  assert.match(solutionsScript, /function previewService\s*\(/);
  assert.match(solutionsScript, /updateRadarStates\(index\)/);
  assert.match(solutionsScript, /updateCard\(index,\s*true\)/);
  assert.match(solutionsScript, /classList\.toggle\('is-selected'/);
  assert.match(styles, /\.service-node\.is-selected \.service-node-icon\s*\{[\s\S]*?background:\s*(?:#00215D|var\(--brand-primary\))\s*!important/i);
  assert.match(styles, /\.service-node\.is-active\[data-tooltip\]::after\s*\{/i);
  assert.doesNotMatch(styles, /\.service-node\.is-selected\[data-tooltip\]::after/i);
});

test('keeps the selected node synchronized after automatic card advances', () => {
  assert.match(solutionsScript, /function updateSelectedNode\(index\)[\s\S]*?classList\.toggle\('is-selected'/i);
  assert.match(solutionsScript, /function commitService\(index\)[\s\S]*?updateSelectedNode\(index\)/i);
});
