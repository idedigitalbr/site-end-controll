const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

test('seção legada de depoimentos foi removida da Home conforme solicitação do cliente', () => {
  assert.doesNotMatch(home, /<section class="testimonials-section-premium" id="depoimentos"/i);
  assert.doesNotMatch(home, /class="testimonial-badge-kicker"[\s\S]*?DEPOIMENTOS/i);
  assert.doesNotMatch(home, /id="dep-track"/i);
});

test('seção de oportunidades e vagas foi removida da Home conforme solicitação do cliente', () => {
  assert.doesNotMatch(home, /id="oportunidades"/i);
  assert.doesNotMatch(home, /class="oportunidades-section/i);
  assert.doesNotMatch(home, /<a[^>]*href="index\.html#oportunidades"/i);
});

test('FAQ da Home reflete o escopo de integridade mecânica sem citações a elétrica ou SPDA', () => {
  const faqSection = home.match(/<section class="section faq-v2[\s\S]*?<\/section>/i)?.[0] || '';
  assert.doesNotMatch(faqSection, /engenharia elétrica/i);
  assert.doesNotMatch(faqSection, /\bSPDA\b/i);
  assert.doesNotMatch(faqSection, /baixa tensão/i);
  assert.doesNotMatch(faqSection, /NR-10/i);
  assert.match(faqSection, /integridade industrial/i);
  assert.match(faqSection, /NR-13/i);
  assert.match(faqSection, /Ensaios Não Destrutivos/i);
});

test('arquivos de infraestrutura robots.txt e sitemap.xml existem e contêm URLs válidas', () => {
  const robots = fs.readFileSync(path.join(root, 'robots.txt'), 'utf8');
  const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');

  assert.match(robots, /Sitemap:\s*https:\/\/endcontrol\.suporteide\.digital\/sitemap\.xml/i);
  assert.match(sitemap, /<loc>https:\/\/endcontrol\.suporteide\.digital\/index\.html<\/loc>/i);
  assert.match(sitemap, /<loc>https:\/\/endcontrol\.suporteide\.digital\/politica-de-privacidade\.html<\/loc>/i);
});

test('página politica-de-privacidade.html existe com DOCTYPE, meta tags e rodapé oficial', () => {
  const privacy = fs.readFileSync(path.join(root, 'politica-de-privacidade.html'), 'utf8');
  assert.match(privacy, /<!doctype html>/i);
  assert.match(privacy, /Termos de Uso e Política de Privacidade/i);
  assert.match(privacy, /LGPD/i);
  assert.match(privacy, /footer-minimal-glow-section/i);
});

test('página 404.html existe com DOCTYPE e link para a Home', () => {
  const notFound = fs.readFileSync(path.join(root, '404.html'), 'utf8');
  assert.match(notFound, /<!doctype html>/i);
  assert.match(notFound, /404/);
  assert.match(notFound, /Desvio de rota operacional/i);
  assert.match(notFound, /href="index\.html"/i);
});

test('todas as páginas principais apontam o rodapé para politica-de-privacidade.html', () => {
  const pages = [
    'index.html',
    'sobre-nos.html',
    '1-solucao-engenharia-de-integridade-estrutural.html',
    '2-solucao-inspecao-em-obras-de-artes-especiais.html',
    '3-solucao-ensaios-nao-destrutivos-ends.html',
    '4-solucao-engenharia-de-soldagem.html',
    '5-solucao-gerenciamento-de-projetos.html',
    '6-solucao-elaboracao-de-projetos-mecanicos.html',
    '7-solucao-solucoes-tecnologicas-integradas.html',
    '8-solucao-inspecao-e-adequacao-normativa.html',
    '9-solucao-calibracao-de-instrumentos.html',
    '10-solucao-trepanacao-hot-tapping.html',
    '11-solucao-certificacao-de-materia-prima.html',
    '12-solucao-consultoria-e-assessoria-tecnica.html',
    'politica-de-privacidade.html',
    '404.html'
  ];

  for (const page of pages) {
    const content = fs.readFileSync(path.join(root, page), 'utf8');
    assert.match(
      content,
      /<a href="politica-de-privacidade\.html" class="legal-center">Termos & Privacidade<\/a>/i,
      `${page} não possui o link ativo para politica-de-privacidade.html no rodapé`
    );
  }
});

test('elimina risco de scroll duplo prevenindo overflow-y auto em html, body e wf-main-content', () => {
  const sectionsCss = fs.readFileSync(path.join(root, 'src', 'css', 'sections.css'), 'utf8');
  const baseCss = fs.readFileSync(path.join(root, 'src', 'css', 'base.css'), 'utf8');
  const responsiveCss = fs.readFileSync(path.join(root, 'src', 'css', 'responsive.css'), 'utf8');

  // #wf-main-content não pode ter overflow-x: hidden (que promove overflow-y: auto)
  assert.match(sectionsCss, /#wf-main-content\s*\{[\s\S]*?overflow-x:\s*clip;/i);
  assert.doesNotMatch(sectionsCss, /#wf-main-content\s*\{[\s\S]*?overflow-x:\s*hidden;/i);

  // html não pode ter overflow-x: clip ou overflow-y: auto no base.css
  assert.doesNotMatch(baseCss, /html\s*\{[^}]*overflow-x:\s*clip/i);
  assert.doesNotMatch(baseCss, /html\s*\{[^}]*overflow-y:\s*auto/i);

  // index.html não pode importar links.css (que tinha html { overflow-y: auto })
  assert.doesNotMatch(home, /href="[^"]*links\.css[^"]*"/i);

  // responsive.css não deve ter html { overflow-x: hidden }
  assert.doesNotMatch(responsiveCss, /html\s*,\s*body\s*\{[\s\S]*?overflow-x:\s*hidden/i);
});

