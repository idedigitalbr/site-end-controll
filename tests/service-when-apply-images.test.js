const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const imageRoot = path.join(root, 'assets', 'Paginas Imgs', 'SOLUCOES', 'QUANDO APLICAR');
const runtime = fs.readFileSync(path.join(root, 'src', 'js', 'service-pages.js'), 'utf8');

const services = [
  {
    page: '1-solucao-engenharia-de-integridade-estrutural.html',
    slug: '01-integridade-estrutural',
    files: ['01.jpeg', '02.jpeg', '03.jpg', '04.png', '05.jpg', '06.jpeg', '07.jpg', '08.jpeg'],
  },
  {
    page: '2-solucao-inspecao-em-obras-de-artes-especiais.html',
    slug: '02-obras-artes-especiais',
    files: ['01.jpeg', '02.jpg', '03.jpeg', '04.jpeg', '05.jpeg', '06.jpeg', '07.jpg', '08.jpeg'],
  },
  {
    page: '3-solucao-ensaios-nao-destrutivos-ends.html',
    slug: '03-ensaios-nao-destrutivos',
    files: ['01.jpeg', '02.jpeg', '03.jpeg', '04.jpg', '05.jpeg', '06.jpg', '07.jpeg', '08.jpeg'],
  },
  {
    page: '4-solucao-engenharia-de-soldagem.html',
    slug: '04-engenharia-de-soldagem',
    files: ['01.jpeg', '02.jpeg', '03.jpeg', '04.jpeg', '05.jpeg', '06.jpg', '07.jpeg', '08.jpeg'],
  },
  {
    page: '5-solucao-gerenciamento-de-projetos.html',
    slug: '05-gerenciamento-de-projetos',
    files: ['01.jpeg', '02.jpeg', '03.jpeg', '04.jpeg', '05.jpeg', '06.jpeg', '07.jpeg', '08.png'],
  },
  {
    page: '6-solucao-elaboracao-de-projetos-mecanicos.html',
    slug: '06-projetos-mecanicos',
    files: ['01.jpeg', '02.jpeg', '03.jpeg', '04.jpeg', '05.jpeg', '06.jpeg', '07.jpeg', '08.jpeg'],
  },
  {
    page: '7-solucao-solucoes-tecnologicas-integradas.html',
    slug: '07-solucoes-tecnologicas',
    files: ['01.jpeg', '02.jpeg', '03.jpeg', '04.jpeg', '05.jpeg', '06.jpeg', '07.jpeg', '08.jpeg'],
  },
  {
    page: '8-solucao-inspecao-e-adequacao-normativa.html',
    slug: '08-adequacao-normativa',
    files: ['01.jpeg', '02.png', '03.jpeg', '04.jpeg', '05.jpeg', '06.jpeg', '07.jpeg', '08.jpeg'],
  },
  {
    page: '9-solucao-calibracao-de-instrumentos.html',
    slug: '09-calibracao-instrumentos',
    files: ['01.jpeg', '02.jpeg', '03.jpeg', '04.jpeg', '05.jpeg', '06.jpeg', '07.jpeg', '08.jpeg'],
  },
  {
    page: '10-solucao-trepanacao-hot-tapping.html',
    slug: '10-hot-tapping',
    files: ['01.jpg', '02.jpeg', '03.jpeg', '04.png', '05.jpeg', '06.jpeg', '07.jpeg', '08.jpeg'],
  },
  {
    page: '11-solucao-certificacao-de-materia-prima.html',
    slug: '11-certificacao-materia-prima',
    files: ['01.jpeg', '02.jpeg', '03.jpeg', '04.jpeg', '05.jpeg', '06.jpeg', '07.jpeg', '08.jpeg'],
  },
  {
    page: '12-solucao-consultoria-e-assessoria-tecnica.html',
    slug: '12-consultoria-assessoria',
    files: ['01.jpeg', '02.jpeg', '03.jpeg', '04.jpeg', '05.jpg', '06.jpg', '07.jpeg', '08.jpeg'],
  },
];

test('cada página de serviço aponta para seu conjunto de imagens Quando Aplicar', () => {
  for (const service of services) {
    const html = fs.readFileSync(path.join(root, service.page), 'utf8');
    assert.match(
      html,
      new RegExp(`id="quando-aplicar"[^>]*data-when-apply-image-set="${service.slug}"`),
      `${service.page} precisa apontar para ${service.slug}`,
    );
  }
});

test('cada conjunto tem oito arquivos locais e está registrado no runtime', () => {
  assert.match(runtime, /function normalizeWhenApplyImages\(\)/);
  assert.match(runtime, /image\.loading = index === 0 \? 'eager' : 'lazy'/);

  for (const service of services) {
    const sourceFolder = path.join(imageRoot, service.slug);
    assert.ok(fs.existsSync(sourceFolder), `${service.slug} precisa existir`);
    assert.equal(fs.readdirSync(sourceFolder).length, 8, `${service.slug} precisa ter oito imagens`);

    for (const filename of service.files) {
      assert.ok(
        fs.existsSync(path.join(sourceFolder, filename)),
        `${service.slug}/${filename} precisa existir`,
      );
      assert.match(runtime, new RegExp(`'${filename.replace('.', '\\.')}'`));
    }
  }
});
