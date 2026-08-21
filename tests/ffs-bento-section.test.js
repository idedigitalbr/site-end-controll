const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const pagePath = path.join(root, '1-solucao-engenharia-de-integridade-estrutural.html');
const pageHtml = fs.readFileSync(pagePath, 'utf8');

const mechanisms = [
  ['Fratura Frágil', 'Avaliação da suscetibilidade à fratura súbita em condições críticas de operação.'],
  ['Perda Geral de Metal', 'Análise da redução uniforme de espessura causada por corrosão ou erosão.'],
  ['Perda Local de Metal', 'Verificação de regiões localizadas com perda de espessura e concentração de tensões.'],
  ['Corrosão por Pites', 'Avaliação de cavidades localizadas que podem acelerar a falha do componente.'],
  ['Danos por Hidrogênio', 'Identificação de empolamentos, trincas e demais danos associados à presença de hidrogênio.'],
  ['Desalinhamento e Distorção de Solda', 'Análise dos efeitos geométricos de juntas soldadas sobre tensões e desempenho estrutural.'],
  ['Descontinuidades Similares a Trincas', 'Caracterização de indicações com potencial de crescimento e comprometimento da integridade.'],
  ['Fluência', 'Avaliação de deformação progressiva em materiais submetidos a temperatura e tensão elevadas.'],
  ['Danos por Incêndio', 'Análise dos efeitos térmicos sobre resistência, propriedades e estabilidade do ativo.'],
  ['Mossas e Sulcos', 'Avaliação de deformações mecânicas e seus impactos na capacidade de operação segura.'],
  ['Delaminação', 'Verificação de separações internas e descontinuidades entre camadas do material.'],
  ['Danos por Fadiga', 'Análise de solicitações cíclicas e do risco de iniciação ou propagação de trincas.']
];

test('a seção FFS usa o padrão bento com sidebar e cards descritivos', () => {
  const section = pageHtml.match(/<section class="svc-bento-section ffs-bento-section"[\s\S]*?<\/section>/i)?.[0] || '';

  assert.ok(section, 'A seção FFS deve usar o layout Bento compartilhado');
  assert.match(section, /<aside class="ec-bento-sidebar">/i);
  assert.match(section, /<span class="sidebar-eyebrow">ABORDAGEM FFS<\/span>/i);
  assert.match(section, /class="bento-expanding-wrapper(?:\s|\")/i);
  assert.equal((section.match(/<article class="ec-card-white ffs-mechanism-card(?:\s|\")/gi) || []).length, mechanisms.length);

  for (const [title, description] of mechanisms) {
    assert.match(section, new RegExp(`<h3 class="ec-card-white-title">${title}</h3>`, 'i'));
    assert.match(section, new RegExp(`<p class="ec-card-white-text">${description}</p>`, 'i'));
  }
});

test('a seção FFS não depende mais do radar orbital', () => {
  const section = pageHtml.match(/<section class="svc-bento-section ffs-bento-section"[\s\S]*?<\/section>/i)?.[0] || '';

  assert.doesNotMatch(section, /ffs-radar|ffs-nodes-layer|ffsRadarWrapper|ffsCenterCore/i);
  assert.doesNotMatch(pageHtml, /radar-ffs\.css|radar-ffs\.js/i);
});
