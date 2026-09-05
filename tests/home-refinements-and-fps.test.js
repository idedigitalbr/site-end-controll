const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const rootDir = path.resolve(__dirname, '..');
const indexPath = path.join(rootDir, 'index.html');
const headerCssPath = path.join(rootDir, 'src', 'css', 'header.css');
const responsiveCssPath = path.join(rootDir, 'src', 'css', 'responsive.css');
const clientsCssPath = path.join(rootDir, 'src', 'css', 'clients-carousel.css');
const solucoesCssPath = path.join(rootDir, 'src', 'css', 'solucoes.css');
const sectionsCssPath = path.join(rootDir, 'src', 'css', 'sections.css');
const sobreNosCssPath = path.join(rootDir, 'src', 'css', 'sobre-nos.css');
const mainJsPath = path.join(rootDir, 'src', 'js', 'main.js');
const solucoesJsPath = path.join(rootDir, 'src', 'js', 'solucoes.js');
const presencaJsPath = path.join(rootDir, 'src', 'js', 'presenca-nacional.js');

test('a logo principal do header preserva o tamanho original aprovado', () => {
  const headerCss = fs.readFileSync(headerCssPath, 'utf8');
  const responsiveCss = fs.readFileSync(responsiveCssPath, 'utf8');

  // Desktop original
  assert.match(headerCss, /\.brand-main\s*\{[\s\S]*?height:\s*30px;/);
  // Mobile original
  assert.match(responsiveCss, /@media\s*\(max-width:\s*620px\)\s*\{[\s\S]*?\.brand-main\s*\{[\s\S]*?height:\s*24px;/);
});

test('a ordem das seções na Home segue Clientes -> Radar (#solucoes) -> Soluções Integradas (#sobre) sem #sobre-2 e sem #depoimentos', () => {
  const html = fs.readFileSync(indexPath, 'utf8');
  const sobreNosHtml = fs.readFileSync(path.join(rootDir, 'sobre-nos.html'), 'utf8');

  const idxClientes = html.indexOf('id="clientes"');
  const idxSolucoes = html.indexOf('id="solucoes"');
  const idxSobre = html.indexOf('id="sobre"');
  const idxSobre2 = html.indexOf('id="sobre-2"');

  assert.ok(idxClientes > 0, '#clientes deve existir');
  assert.ok(idxSolucoes > 0, '#solucoes deve existir');
  assert.ok(idxSobre > 0, '#sobre deve existir');
  assert.equal(idxSobre2, -1, '#sobre-2 foi movido para a página sobre-nos.html');
  assert.doesNotMatch(html, /id="depoimentos"/, '#depoimentos foi removido conforme solicitação');

  assert.ok(idxClientes < idxSolucoes, 'Clientes deve vir antes do Radar');
  assert.ok(idxSolucoes < idxSobre, 'Radar deve vir antes de Soluções Integradas (#sobre)');

  assert.ok(sobreNosHtml.includes('id="sobre-2"'), 'sobre-nos.html deve conter a seção #sobre-2');
  assert.ok(sobreNosHtml.includes('depoimento-carlos-eduardo-socio.mp4'), 'vídeo do Carlos Eduardo atualizado em sobre-nos.html');
  assert.ok(sobreNosHtml.includes('depoimento-marcus-oliveira-socio.mp4'), 'vídeo do Marcus Oliveira atualizado em sobre-nos.html');
});

test('as transições CSS entre as seções reposicionadas estão configuradas', () => {
  const clientsCss = fs.readFileSync(clientsCssPath, 'utf8');
  const sectionsCss = fs.readFileSync(sectionsCssPath, 'utf8');

  assert.match(clientsCss, /#clientes\.clients-carousel-section\s*\+\s*#solucoes\.solucoes-section/);
  assert.match(sectionsCss, /#solucoes\s*\+\s*#sobre\.about-premium-section/);
  assert.match(sectionsCss, /#sobre\.about-premium-section\s*\+\s*#depoimentos\.testimonials-section-premium/);
});

test('as animações contínuas de scanlines utilizam aceleração por GPU (transform translateY) sem provocar layout reflow', () => {
  const solucoesCss = fs.readFileSync(solucoesCssPath, 'utf8');
  const sectionsCss = fs.readFileSync(sectionsCssPath, 'utf8');
  const sobreNosCss = fs.readFileSync(sobreNosCssPath, 'utf8');

  assert.match(solucoesCss, /@keyframes scanDown\s*\{[\s\S]*?transform:\s*translateY/);
  assert.doesNotMatch(solucoesCss, /@keyframes scanDown\s*\{[^}]*top:\s*-2%/);

  assert.match(sectionsCss, /@keyframes scanLineMove\s*\{[\s\S]*?transform:\s*translateY/);
  assert.doesNotMatch(sectionsCss, /@keyframes scanLineMove\s*\{[^}]*top:\s*20px;/);

  assert.match(sobreNosCss, /@keyframes snCommitmentScanMove\s*\{[\s\S]*?transform:\s*translateY/);
  assert.doesNotMatch(sobreNosCss, /@keyframes snCommitmentScanMove\s*\{[^}]*top:\s*15px;/);
});

test('os timers contínuos de animação são suspensos fora do viewport via IntersectionObserver', () => {
  const mainJs = fs.readFileSync(mainJsPath, 'utf8');
  const solucoesJs = fs.readFileSync(solucoesJsPath, 'utf8');
  const presencaJs = fs.readFileSync(presencaJsPath, 'utf8');

  // Hero Slider
  assert.match(mainJs, /heroObserver\s*=\s*new\s*IntersectionObserver/);
  assert.match(mainJs, /isHeroVisible\s*=\s*entry\.isIntersecting/);

  // Radar Orbital
  assert.match(solucoesJs, /radarObserver\s*=\s*new\s*IntersectionObserver/);
  assert.match(solucoesJs, /isRadarVisible\s*=\s*entry\.isIntersecting/);

  // Mapa Presença Nacional
  assert.match(presencaJs, /mapObserver\s*=\s*new\s*IntersectionObserver/);
  assert.match(presencaJs, /isMapVisible\s*=\s*entry\.isIntersecting/);
});

test('o scroll do header utiliza throttling com requestAnimationFrame para estabilidade de FPS', () => {
  const mainJs = fs.readFileSync(mainJsPath, 'utf8');
  assert.match(mainJs, /function initHeaderScroll\(\)[\s\S]*?window\.requestAnimationFrame\(checkScroll\)/);
});

test('a faixa de valores da Home (#sobre) no mobile fica em 1 linha única horizontal com deslizamento touch', () => {
  const sectionsCss = fs.readFileSync(sectionsCssPath, 'utf8');
  assert.match(sectionsCss, /@media\s*\(max-width:\s*768px\)[\s\S]*?\.about-values-banner\s*\{[\s\S]*?display:\s*flex;[\s\S]*?flex-direction:\s*row;[\s\S]*?overflow-x:\s*auto;[\s\S]*?scroll-snap-type:\s*x mandatory;/);
  assert.match(sectionsCss, /@media\s*\(max-width:\s*768px\)[\s\S]*?\.about-value-item\s*\{[\s\S]*?scroll-snap-align:\s*start;[\s\S]*?flex-shrink:\s*0;/);
});

