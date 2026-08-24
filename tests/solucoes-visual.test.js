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
  assert.match(styles, /\.solucoes-badge\s*\{[\s\S]*?border-radius:\s*999px[\s\S]*?background:\s*#00215d/i);
  assert.match(styles, /\.solucoes-badge-text\s*\{[\s\S]*?color:\s*#ffffff[\s\S]*?text-transform:\s*uppercase/i);
  assert.match(styles, /\.service-node-icon\s*\{[\s\S]*?border:\s*1\.5px\s+solid\s+#00215D\s*;/i);
  assert.match(styles, /\.service-node\.is-active \.service-node-icon\s*\{[\s\S]*?background:\s+#00215D\s*!important;/i);
  assert.match(styles, /\.radar-circle-outer\s*\{[\s\S]*?rgba\(0,\s*33,\s*93/i);
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
  assert.match(styles, /\.highlight-card\s*\{[\s\S]*?border:\s*1px\s+solid\s+#00215D\s*;/i);
  assert.match(styles, /\.highlight-card:hover\s*\{[\s\S]*?border-color:\s*#00215D\s*;/i);
  assert.match(styles, /\.card-side-arrow\s*\{[\s\S]*?border:\s*1\.5px\s+solid\s+#00215D\s*;[\s\S]*?color:\s+#00215D\s*;/i);
  assert.match(styles, /\.card-side-arrow:hover\s*\{[\s\S]*?background:\s+#00215D\s*;[\s\S]*?border-color:\s+#00215D\s*;/i);
  assert.match(styles, /\.highlight-card-list li svg\s*\{[\s\S]*?color:\s+#00215D\s*;/i);
  assert.match(styles, /\.highlight-card-cta\s*\{[\s\S]*?background:\s+#00215D\s*;[\s\S]*?justify-content:\s*center/i);
  assert.match(styles, /\.highlight-card-body\s*\{[\s\S]*?justify-content:\s*flex-start/i);
  assert.match(styles, /\.highlight-card-cta\s*\{[\s\S]*?margin-top:\s*auto/i);
  assert.match(styles, /\.highlight-card-cta svg\s*\{[\s\S]*?position:\s*absolute[\s\S]*?right:\s*14px/i);
  assert.match(styles, /\.card-progress-dot\.active\s*\{[\s\S]*?background:\s*rgba\(0,\s*33,\s*93,\s*0\.18\)\s*;/i);
  assert.match(styles, /\.card-progress-dot\.active::after\s*\{[\s\S]*?transform-origin:\s*left center/i);
  assert.match(styles, /#cardProgress\.is-auto-playing \.card-progress-dot\.active::after\s*\{[\s\S]*?animation:\s*card-auto-progress/i);
  assert.match(styles, /\.card-progress\s*\{[\s\S]*?justify-content:\s*center/i);
  assert.match(solutionsScript, /cardProgress\.style\.setProperty\([\s\S]*?--card-auto-duration/i);
  assert.match(solutionsScript, /autoAdvanceInterval:\s*5000/i);
  assert.match(solutionsScript, /cardProgress\.classList\.add\('is-auto-playing'\)/i);
  assert.match(solutionsScript, /cardProgress\.classList\.remove\('is-auto-playing'\)/i);
  assert.match(styles, /\.card-footer-btn\s*\{[\s\S]*?border:\s*1px\s+solid\s+#00215D\s*;/i);
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
  assert.match(styles, /\.solucoes-section \.radar-trail-svg,\s*\.solucoes-section \.radar-connection\s*\{[\s\S]*?display:\s*none\s*!important/i);
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

test('prioritizes the radar over the solution card on desktop', () => {
  assert.match(styles, /@media \(min-width: 1441px\)\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0,\s*860px\)\s+340px[\s\S]*?gap:\s*32px[\s\S]*?\}/i);
  assert.match(styles, /@media \(min-width: 1441px\)\s*\{[\s\S]*?\.solucoes-center-area\s*\{[\s\S]*?max-width:\s*min\(860px,\s*82vh\)[\s\S]*?\}/i);
  assert.match(styles, /@media \(min-width: 1441px\)\s*\{[\s\S]*?\.highlight-card(?:-wrapper)?\s*\{[\s\S]*?max-width:\s*300px[\s\S]*?\}/i);
  assert.match(styles, /@media \(min-width: 1201px\) and \(max-width: 1440px\)\s*\{[\s\S]*?\.highlight-card(?:-wrapper)?\s*\{[\s\S]*?max-width:\s*280px[\s\S]*?\}/i);
  assert.match(styles, /@media \(min-width: 992px\) and \(max-width: 1200px\)\s*\{[\s\S]*?\.highlight-card(?:-wrapper)?\s*\{[\s\S]*?max-width:\s*260px[\s\S]*?\}/i);
  assert.match(styles, /@media \(min-width: 992px\)\s*\{[\s\S]*?\.highlight-card-image\s*\{[\s\S]*?height:\s*145px[\s\S]*?\}[\s\S]*?\.highlight-card-title\s*\{[\s\S]*?font-size:\s*15px[\s\S]*?\}/i);
  assert.match(styles, /@media \(min-width: 992px\)\s*\{[\s\S]*?\.highlight-card\s*\{[\s\S]*?height:\s*500px[\s\S]*?display:\s*flex/i);
  assert.match(styles, /@media \(min-width: 992px\)\s*\{[\s\S]*?\.highlight-card-title\s*\{[\s\S]*?min-height:\s*38px/i);
  assert.match(styles, /@media \(min-width: 992px\)\s*\{[\s\S]*?\.highlight-card-desc\s*\{[\s\S]*?min-height:\s*65px/i);
  assert.match(styles, /@media \(min-width: 992px\)\s*\{[\s\S]*?\.highlight-card-desc\s*\{[\s\S]*?margin-bottom:\s*4px/i);
  assert.match(styles, /@media \(min-width: 992px\)\s*\{[\s\S]*?\.highlight-card-list\s*\{[\s\S]*?min-height:\s*120px/i);
  assert.match(styles, /@media \(min-width: 992px\)\s*\{[\s\S]*?\.highlight-card-list\s*\{[\s\S]*?margin:\s*8px\s+0\s+22px/i);
  assert.match(styles, /@media \(min-width: 992px\)\s*\{[\s\S]*?\.highlight-card-list li\s*\{[\s\S]*?line-height:\s*1\.35/i);
  assert.match(styles, /@media \(min-width: 992px\)\s*\{[\s\S]*?\.highlight-card-body\s*\{[\s\S]*?padding:\s*13px\s+28px\s+14px/i);
  assert.match(styles, /\.highlight-card-desc\s*\{[\s\S]*?font-size:\s*12px/i);
  assert.match(styles, /\.highlight-card-list li\s*\{[\s\S]*?font-size:\s*10px/i);
  assert.match(styles, /\.highlight-card-cta\s*\{[\s\S]*?font-size:\s*12px/i);
  assert.match(styles, /@media \(min-width: 1201px\) and \(max-width: 1440px\)\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0,\s*740px\)\s+320px[\s\S]*?\}/i);
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
  assert.match(styles, /\.service-node\.is-selected \.service-node-icon\s*\{[\s\S]*?background:\s*#00215D\s*!important/i);
  assert.match(styles, /\.service-node\.is-active\[data-tooltip\]::after\s*\{/i);
  assert.doesNotMatch(styles, /\.service-node\.is-selected\[data-tooltip\]::after/i);
});

test('keeps the selected node synchronized after automatic card advances', () => {
  assert.match(solutionsScript, /function updateSelectedNode\(index\)[\s\S]*?classList\.toggle\('is-selected'/i);
  assert.match(solutionsScript, /function commitService\(index\)[\s\S]*?updateSelectedNode\(index\)/i);
});
