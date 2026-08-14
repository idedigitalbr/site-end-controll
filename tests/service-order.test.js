const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const solutionsScript = fs.readFileSync(path.join(root, 'src/js/solucoes.js'), 'utf8');
const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

const approvedTitles = [
  '1. Engenharia de Integridade Estrutural',
  '2. Inspeção em Obras de Artes Especiais',
  '3. Ensaios Não Destrutivos (ENDs)',
  '4. Engenharia de Soldagem',
  '5. Gerenciamento de Projetos',
  '6. Elaboração de Projetos Mecânicos',
  '7. Soluções Tecnológicas Integradas',
  '8. Inspeção e Adequação Normativa',
  '9. Calibração de Instrumentos',
  '10. Trepanação (Hot Tapping)',
  '11. Certificação de Matéria-Prima',
  '12. Consultoria e Assessoria Técnica'
];

test('keeps the approved service order in the radar data', () => {
  const expectedSourceIndexes = [4, 1, 2, 3, 0, 11, 5, 6, 7, 8, 9, 10];
  const orderMatch = solutionsScript.match(/const serviceOrder = \[([\s\S]*?)\];/);

  assert.ok(orderMatch, 'solucoes.js precisa declarar a ordem compartilhada dos serviços');
  assert.deepEqual(
    orderMatch[1].match(/\d+/g).map(Number),
    expectedSourceIndexes
  );
  assert.match(solutionsScript, /const servicesData = serviceOrder\.map/);
  const approvedNames = approvedTitles.map(title => title.replace(/^\d+\.\s*/, ''));
  assert.ok(approvedNames.every(title => solutionsScript.includes(title)));
});

test('renders Projetos as an unnumbered menu group for services 5 and 6', () => {
  const projectsGroup = indexHtml.match(
    /<div class="item-with-submenu">[\s\S]*?<span class="dropdown-item-text">Projetos<\/span>[\s\S]*?<\/div>\s*<\/div>/
  );

  assert.ok(projectsGroup, 'menu precisa conter o agrupador Projetos');
  const trigger = projectsGroup[0].match(
    /<a class="dropdown-item-rich item-has-children"[\s\S]*?<\/a>/
  );

  assert.ok(trigger, 'Projetos precisa ter um gatilho expansível');
  assert.doesNotMatch(trigger[0], /data-service-id="\d+"/);
  assert.match(projectsGroup[0], /data-service-id="4"[\s\S]*?5\. Gerenciamento de Projetos/);
  assert.match(projectsGroup[0], /data-service-id="5"[\s\S]*?6\. Elaboração de Projetos Mecânicos/);
});

test('keeps the approved order in the visible menu', () => {
  const menuOrder = [
    ...approvedTitles.slice(0, 4),
    'Projetos',
    ...approvedTitles.slice(4)
  ];
  const positions = menuOrder.map(title => indexHtml.indexOf(title));

  assert.ok(positions.every(position => position >= 0));
  assert.deepEqual([...positions].sort((a, b) => a - b), positions);
});
