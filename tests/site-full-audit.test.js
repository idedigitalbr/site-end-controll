const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');

const solutionPages = [
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
  '12-solucao-consultoria-e-assessoria-tecnica.html'
];

const mainPages = ['index.html', 'sobre-nos.html', ...solutionPages];

test('all 14 main HTML pages exist and contain valid DOCTYPE and HTML structure', () => {
  for (const page of mainPages) {
    const filePath = path.join(rootDir, page);
    assert.equal(fs.existsSync(filePath), true, `Page ${page} should exist on disk`);
    const content = fs.readFileSync(filePath, 'utf8');
    assert.match(content, /<!doctype\s+html>/i, `Page ${page} should have DOCTYPE html`);
    assert.match(content, /<html[\s>]/i, `Page ${page} should have html tag`);
    assert.match(content, /<head>/i, `Page ${page} should have head tag`);
    assert.match(content, /<body[\s>]/i, `Page ${page} should have body tag`);
  }
});

test('all 14 main pages have complete SEO tags: Title, Description, Canonical and OpenGraph', () => {
  for (const page of mainPages) {
    const content = fs.readFileSync(path.join(rootDir, page), 'utf8');
    assert.match(content, /<title>.+<\/title>/i, `Page ${page} should have a non-empty title`);
    assert.match(content, /<meta\s+name=["']description["']\s+content=["'].+["']/i, `Page ${page} should have a meta description`);
    assert.match(content, /<link\s+rel=["']canonical["']\s+href=["']https:\/\/endcontrol\.suporteide\.digital\/.+["']/i, `Page ${page} should have a canonical URL`);
    assert.match(content, /<meta\s+property=["']og:title["']\s+content=["'].+["']/i, `Page ${page} should have og:title`);
    assert.match(content, /<meta\s+property=["']og:image["']\s+content=["'].+["']/i, `Page ${page} should have og:image`);
  }
});

test('all local image assets referenced across all 14 pages exist on disk', () => {
  let totalImages = 0;
  for (const page of mainPages) {
    const content = fs.readFileSync(path.join(rootDir, page), 'utf8');
    const imgMatches = [...content.matchAll(/<img\s+[^>]*src=["']([^"']+)["']/gi)];
    for (const m of imgMatches) {
      let src = m[1].split('?')[0];
      if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) continue;
      if (src.startsWith('/')) src = '.' + src;
      const resolvedPath = path.resolve(rootDir, src);
      assert.equal(fs.existsSync(resolvedPath), true, `Image ${m[1]} referenced in ${page} does not exist at ${resolvedPath}`);
      totalImages++;
    }
  }
  assert.ok(totalImages > 100, `Expected over 100 images checked, found ${totalImages}`);
});

test('all local stylesheets and scripts referenced across all 14 pages exist on disk', () => {
  for (const page of mainPages) {
    const content = fs.readFileSync(path.join(rootDir, page), 'utf8');
    
    // CSS
    const cssMatches = [...content.matchAll(/<link\s+[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/gi)];
    for (const m of cssMatches) {
      let href = m[1].split('?')[0];
      if (href.startsWith('http://') || href.startsWith('https://')) continue;
      if (href.startsWith('/')) href = '.' + href;
      const resolvedPath = path.resolve(rootDir, href);
      assert.equal(fs.existsSync(resolvedPath), true, `CSS ${m[1]} referenced in ${page} does not exist at ${resolvedPath}`);
    }

    // JS
    const scriptMatches = [...content.matchAll(/<script\s+[^>]*src=["']([^"']+)["']/gi)];
    for (const m of scriptMatches) {
      let src = m[1].split('?')[0];
      if (src.startsWith('http://') || src.startsWith('https://')) continue;
      if (src.startsWith('/')) src = '.' + src;
      const resolvedPath = path.resolve(rootDir, src);
      assert.equal(fs.existsSync(resolvedPath), true, `Script ${m[1]} referenced in ${page} does not exist at ${resolvedPath}`);
    }
  }
});

test('all internal anchor links across all 14 pages resolve to existing target IDs', () => {
  for (const page of mainPages) {
    const content = fs.readFileSync(path.join(rootDir, page), 'utf8');
    const hashMatches = [...content.matchAll(/href=["'](?:([^"'#]*))?#([^"']+)["']/gi)];
    for (const m of hashMatches) {
      const targetFile = m[1] ? m[1] : page;
      const targetId = m[2];
      if (!targetId || targetId === '' || targetId === '!') continue;
      
      const targetFilePath = path.join(rootDir, targetFile);
      assert.equal(fs.existsSync(targetFilePath), true, `File ${targetFile} referenced by ${m[0]} in ${page} must exist`);
      
      const targetContent = fs.readFileSync(targetFilePath, 'utf8');
      const hasId = new RegExp(`id=["']${targetId}["']`, 'i').test(targetContent) || new RegExp(`name=["']${targetId}["']`, 'i').test(targetContent);
      assert.equal(hasId, true, `Anchor #${targetId} referenced in ${page} must exist in ${targetFile}`);
    }
  }
});

test('all 12 solution pages contain the complete solutions menu with active links 1 to 12', () => {
  for (const page of solutionPages) {
    const content = fs.readFileSync(path.join(rootDir, page), 'utf8');
    for (let i = 1; i <= 12; i++) {
      assert.match(content, new RegExp(`${i}-solucao-`), `Page ${page} must include link to solution ${i}`);
    }
  }
});

test('footer contact information and official WhatsApp number are uniform across all pages', () => {
  const officialPhone = '5591984040710';
  for (const page of mainPages) {
    const content = fs.readFileSync(path.join(rootDir, page), 'utf8');
    assert.match(content, new RegExp(officialPhone), `Page ${page} must use the official WhatsApp number ${officialPhone}`);
    assert.match(content, /contato@endcontrol\.com\.br/, `Page ${page} must use official email contato@endcontrol.com.br`);
  }
});
