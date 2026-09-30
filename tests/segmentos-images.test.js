const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const assetRoot = path.join(root, 'assets', 'Paginas Imgs', 'HOME', 'CARDS-AREAS-ATUACAO', 'FORMATO');

const expectedImages = [
  ['0', 'Aeroespacial.png'],
  ['2', 'Ambiental.png'],
  ['3', 'Energia.png'],
  ['4', 'Ferroviario.png'],
  ['6', 'Naval.png'],
  ['7', 'Oleo-Gas.png'],
  ['8', 'Papel-Celulose.png'],
];

test('atualiza as imagens das áreas com os arquivos fornecidos em FORMATO', () => {
  for (const [index, filename] of expectedImages) {
    const panel = home.match(new RegExp(`<li class="endo-acc-panel[^>]*data-index="${index}"[\\s\\S]*?<\\/li>`, 'i'))?.[0] || '';

    assert.match(panel, new RegExp(`src="assets/Paginas Imgs/HOME/CARDS-AREAS-ATUACAO/FORMATO/${filename}"`, 'i'));
    assert.ok(fs.existsSync(path.join(assetRoot, filename)), `o asset ${filename} precisa existir`);
  }
});

test('utiliza a fotografia otimizada para Químico e Petroquímico', () => {
  const panel = home.match(/<li class="endo-acc-panel[^>]*data-index="9"[\s\S]*?<\/li>/i)?.[0] || '';
  assert.match(panel, /src="assets\/Fotografias\/Endcontrol-Fotos-Videos-Escolhidos\/otimizados\/fotos\/integridade-estrutural-planta-industrial-tanques-tubulacoes\.webp"/i);
  assert.ok(fs.existsSync(path.join(root, 'assets', 'Fotografias', 'Endcontrol-Fotos-Videos-Escolhidos', 'otimizados', 'fotos', 'integridade-estrutural-planta-industrial-tanques-tubulacoes.webp')));
});

test('mantém Alimentício e Mineração com as imagens originais sem correspondente no lote', () => {
  assert.match(home, /data-index="1"[\s\S]*?src="assets\/Paginas Imgs\/HOME\/CARDS-AREAS-ATUACAO\/Alimenticio\.webp"/i);
  assert.match(home, /data-index="5"[\s\S]*?src="assets\/Paginas Imgs\/HOME\/CARDS-AREAS-ATUACAO\/Mineracao\.webp"/i);
});
