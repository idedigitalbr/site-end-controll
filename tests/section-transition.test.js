const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const sectionsCss = fs.readFileSync(path.join(root, 'src', 'css', 'sections.css'), 'utf8');
const presenceCss = fs.readFileSync(path.join(root, 'src', 'css', 'presenca-nacional.css'), 'utf8');

test('não renderiza uma barra vazia entre Soluções e Áreas de Atuação', () => {
  assert.doesNotMatch(
    home,
    /<div class="solucoes-bottom-bar">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/i,
    'a barra inferior vazia das Soluções cria uma linha entre as seções',
  );
});

test('mantém a seção escura acima da seção clara na transição seguinte', () => {
  assert.match(
    sectionsCss,
    /#segmentos-secao\s*\{[\s\S]*?z-index:\s*2\s*!important/i,
    'a seção escura precisa ter prioridade visual sobre a seção clara',
  );
  assert.match(
    sectionsCss,
    /#wf-main-content \+ \.presenca-nacional-light\s*\{[\s\S]*?margin-top:\s*-28px\s*!important[\s\S]*?z-index:\s*1/i,
    'a seção clara precisa continuar avançando sob a seção escura',
  );
  assert.match(
    presenceCss,
    /\.presenca-nacional-light\s*\{[\s\S]*?border-top:\s*none\s*!important/i,
    'a divisória superior da seção clara precisa ser removida',
  );
});
