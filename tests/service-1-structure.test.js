const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const service1Html = fs.readFileSync(path.join(root, '1-solucao-engenharia-de-integridade-estrutural.html'), 'utf8');

test('service 1 page follows the approved sequential section order', () => {
  const sectionSequence = [
    'class="site-header"',
    'class="sn-hero-section"',
    'class="svc-solution-section"',
    'class="ffs-section',
    'class="svc-methodology-section"',
    'class="section segmentos-secao',
    'class="sn-process-section"',
    'class="sn-commitment-section"',
    'class="footer-minimal-glow-section"'
  ];

  let lastIndex = -1;
  for (const marker of sectionSequence) {
    const idx = service1Html.indexOf(marker);
    assert.ok(idx > -1, `Expected section marker "${marker}" was not found`);
    assert.ok(idx > lastIndex, `Section marker "${marker}" is out of order`);
    lastIndex = idx;
  }
});

test('1. Top of page matches Sobre Nós hero structure', () => {
  assert.ok(service1Html.includes('class="sn-hero-section" id="hero-sobre"'));
  assert.ok(service1Html.includes('class="sn-hero-overlay"'));
  assert.ok(!service1Html.includes('svc-topo-inox-logo'));
});

test('2. S2 Headline has Engenharia de Integridade Estrutural as main H1', () => {
  assert.ok(service1Html.includes('Engenharia de Integridade Estrutural'));
  assert.ok(service1Html.includes('Avaliações Fitness-For-Service (FFS) e decisões seguras sobre ativos críticos.'));
});

test('3. S2 Image is a single large framed photo (no mosaic)', () => {
  assert.ok(service1Html.includes('class="svc-single-photo-wrapper"'));
  assert.ok(!service1Html.includes('class="svc-collage-wrapper"'));
});

test('4. S2 uses standard primary button pattern (.btn.btn-primary)', () => {
  assert.ok(service1Html.includes('class="btn btn-primary"'));
  assert.ok(service1Html.includes('Fale com um especialista'));
});

test('5. S3 (Radar FFS) contains required texts, single sweep and radar container', () => {
  assert.ok(service1Html.includes('Abordagem FFS'));
  assert.ok(service1Html.includes('Mecanismos de dano avaliados na abordagem'));
  assert.ok(service1Html.includes('Fitness-For-Service'));
  assert.ok(service1Html.includes('id="ffsRadarWrapper"'));
  assert.ok(service1Html.includes('id="ffsRadarSweep"'));
  assert.ok(service1Html.includes('id="ffsCenterCore"'));
});

test('6. S5 (Quando Aplicar) uses the full-width Accordion widget from Home / Print 2', () => {
  assert.ok(service1Html.includes('class="endo-acc-full-wrapper"'));
  assert.ok(service1Html.includes('id="accTrackIndex"'));
  assert.ok(service1Html.includes('class="endo-acc-panel is-active"'));
  assert.ok(service1Html.includes('Perda de espessura'));
  assert.ok(service1Html.includes('Trincas'));
  assert.ok(service1Html.includes('Distorções'));
  assert.ok(service1Html.includes('Corrosão'));
  assert.ok(service1Html.includes('Danos térmicos'));
  assert.ok(service1Html.includes('Hidrogênio'));
  assert.ok(service1Html.includes('Fadiga'));
  assert.ok(service1Html.includes('Continuidade operacional'));
});

test('7. Section Nosso Compromisso contains the 4 pillars (Segurança, Confiabilidade, Eficiência, Parceria)', () => {
  assert.ok(service1Html.includes('class="sn-commitment-section"'));
  assert.ok(service1Html.includes('NOSSO COMPROMISSO'));
  assert.ok(service1Html.includes('Excelência técnica começa'));
  assert.ok(service1Html.includes('responsabilidade.'));
  assert.ok(service1Html.includes('Segurança'));
  assert.ok(service1Html.includes('Confiabilidade'));
  assert.ok(service1Html.includes('Eficiência'));
  assert.ok(service1Html.includes('Parceria'));
});

test('8. Standalone backup-secao-cta-final.html exists and contains the complete CTA final markup', () => {
  const backupPath = path.join(root, 'backup-secao-cta-final.html');
  assert.ok(fs.existsSync(backupPath), 'backup-secao-cta-final.html must exist');
  const backupHtml = fs.readFileSync(backupPath, 'utf8');
  assert.ok(backupHtml.includes('class="sn-cta-section"'));
  assert.ok(backupHtml.includes('SOLUÇÕES QUE GERAM CONFIANÇA'));
  assert.ok(backupHtml.includes('Grandes operações exigem'));
  assert.ok(backupHtml.includes('confiar.'));
  assert.ok(backupHtml.includes('Conheça nossas soluções'));
  assert.ok(backupHtml.includes('Fale com um especialista'));
});

test('all local image assets referenced in service 1 page exist on disk', () => {
  const imgMatches = service1Html.matchAll(/(?:src|poster)="(\.\/assets\/[^"]+)"/g);
  for (const match of imgMatches) {
    const relativePath = match[1].replace(/^\.\//, '');
    const fullPath = path.join(root, relativePath);
    assert.ok(fs.existsSync(fullPath), `Referenced asset does not exist: ${relativePath}`);
  }
});
