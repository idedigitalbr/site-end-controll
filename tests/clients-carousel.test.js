const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const rootDir = path.resolve(__dirname, '..');
const indexPath = path.join(rootDir, 'index.html');
const cssPath = path.join(rootDir, 'src', 'css', 'clients-carousel.css');
const logosDir = path.join(rootDir, 'assets', 'Logos Clientes');

test('deve existir o arquivo src/css/clients-carousel.css', () => {
  assert.ok(fs.existsSync(cssPath), 'Arquivo clients-carousel.css deve existir');
});

test('deve existir a pasta assets/Logos Clientes com 15 logos', () => {
  assert.ok(fs.existsSync(logosDir), 'Pasta Logos Clientes deve existir');
  const files = fs.readdirSync(logosDir).filter(f => f.endsWith('.png'));
  assert.strictEqual(files.length, 15, 'Devem existir exatamente 15 logos PNG');
});

test('index.html deve incluir o link para clients-carousel.css no head', () => {
  const html = fs.readFileSync(indexPath, 'utf-8');
  assert.ok(
    html.includes('src/css/clients-carousel.css'),
    'index.html deve importar clients-carousel.css'
  );
});

test('index.html deve conter a seção #clientes com o título CONFIAM EM NÓS', () => {
  const html = fs.readFileSync(indexPath, 'utf-8');
  assert.ok(html.includes('id="clientes"'), 'Deve conter o id="clientes"');
  assert.ok(
    html.includes('CONFIAM EM NÓS'),
    'Deve conter o título CONFIAM EM NÓS'
  );
});

test('deve conter dois tracks no marquee com aria-hidden no espelho', () => {
  const html = fs.readFileSync(indexPath, 'utf-8');
  const trackMatches = html.match(/class="logo-marquee__track"/g) || [];
  const ariaHiddenTrack = html.includes('class="logo-marquee__track" aria-hidden="true"');
  
  assert.strictEqual(trackMatches.length, 2, 'Devem existir exatamente 2 tracks para loop infinito');
  assert.ok(ariaHiddenTrack, 'O track duplicado deve possuir aria-hidden="true" para acessibilidade');
});

test('todos os 15 logos devem estar referenciados em ambos os tracks e existir em disco', () => {
  const html = fs.readFileSync(indexPath, 'utf-8');
  for (let i = 1; i <= 15; i++) {
    const regex = new RegExp(`assets/Logos Clientes/${i}\\.[a-z0-9-]+\\.png`, 'i');
    assert.ok(
      regex.test(html),
      `Logo de índice ${i} deve estar referenciada no HTML`
    );
  }
});

test('clients-carousel.css deve conter máscara gradual, animação e pausa no hover', () => {
  const css = fs.readFileSync(cssPath, 'utf-8');
  assert.ok(css.includes('mask-image'), 'CSS deve ter mask-image');
  assert.ok(css.includes('-webkit-mask-image'), 'CSS deve ter -webkit-mask-image');
  assert.ok(css.includes('animation-play-state: paused'), 'Deve pausar no hover');
  assert.ok(css.includes('prefers-reduced-motion'), 'Deve suportar prefers-reduced-motion');
  assert.ok(css.includes('@keyframes logoMarqueeScroll'), 'Deve ter @keyframes para scroll contínuo');
  assert.ok(css.includes('grayscale(100%)'), 'Deve ter filtro monocromático');
  assert.ok(css.includes('grayscale(0%)'), 'Deve ter transição colorida no hover');
});
