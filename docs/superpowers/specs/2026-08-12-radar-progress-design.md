# Radar de Progresso por Anéis — Especificação de Design

**Data:** 2026-08-12  
**Escopo:** seção desktop “Soluções Integradas” do site-end-controll  
**Status:** aprovado pelo usuário para implementação

## Objetivo

Transformar o radar atual, que acumula conexões em um único caminho SVG, em um circuito de progresso previsível e legível. O usuário deve identificar imediatamente a etapa atual, as etapas concluídas, o próximo passo e as etapas ainda inativas.

A solução deve preservar o visual ciano/azul, a composição atual de dois anéis, o card de serviço, a navegação automática e o layout desktop. A mudança principal será estrutural: estados e conexões passarão a ser derivados de uma sequência de etapas, com segmentos explícitos por anel.

## Diagnóstico da implementação atual

Os serviços são renderizados dinamicamente em `src/js/solucoes.js`, mas o modelo atual usa apenas `id`, `ring` e `angle`. O estado visual é controlado por `activeIndex`, `visitedIndices` e `visitedSequence`.

O path `#radarTrailPath`, definido em `index.html`, é recalculado por `updateRadarTrail()`. Quando dois itens consecutivos registrados estão no mesmo anel, o código gera um arco; quando estão em anéis diferentes, gera uma linha reta. Como a sequência é global, uma troca entre anéis pode produzir uma ligação direta entre os dois pontos.

Além disso, a sequência de visitados não representa progresso contínuo: um salto direto para um item posterior adiciona somente os pontos visitados, e uma volta para um item anterior não trunca os pontos que ficaram para trás. Isso permite caminhos longos, diagonais ou desatualizados.

O CSS também mantém regras duplicadas para o hover dos itens inativos. Essa duplicação não cria as linhas, mas torna a intensidade visual menos previsível e será consolidada durante a refatoração.

## Arquitetura escolhida

### Modelo explícito de etapas

Cada serviço terá metadados de progressão:

```js
{
  stepIndex: 0,
  ringIndex: 0,
  positionInRing: 0,
  angle: -90,
  ...serviceContent
}
```

O cadastro seguirá a ordem visual e lógica:

- Anel 1: itens 1–6, `ringIndex: 0`, `positionInRing: 0..5`.
- Anel 2: itens 7–12, `ringIndex: 1`, `positionInRing: 0..5`.

`activeStep` será o único estado de seleção necessário para derivar os estados dos nós e das conexões. O modelo não usará mais `visitedIndices` nem `visitedSequence`.

### Regra de conexão

Uma conexão de progressão só será criada quando os dois serviços forem vizinhos no mesmo anel:

```js
function canConnect(a, b) {
  return a.ringIndex === b.ringIndex &&
    b.positionInRing === a.positionInRing + 1;
}
```

O fechamento geométrico de cada anel será tratado como uma regra explícita e independente:

- `6 → 1` pertence exclusivamente ao anel 1.
- `12 → 7` pertence exclusivamente ao anel 2.

Não haverá regra de fechamento entre anéis. Em particular, `6 → 7` e `12 → 1` nunca serão gerados.

### Segmentos SVG estáveis

O path único `#radarTrailPath` será substituído por uma camada SVG `#radarConnectionsLayer`. Essa camada será preenchida uma vez com um segmento por conexão válida.

Cada segmento será um arco circular entre dois pontos do mesmo raio. Não serão usados comandos de linha radial (`L`) para o progresso. Os segmentos ficarão associados aos seus serviços de origem, destino e anel por `data-*` e classes.

A geometria será mantida no DOM durante a interação. Mudanças de progresso atualizarão apenas classes e propriedades visuais, evitando reconstrução do componente e morphing de um `d` global.

## Regras de estado dos nós

Para um `activeStep` selecionado:

- `completed`: `stepIndex < activeStep`.
- `active`: `stepIndex === activeStep`.
- `next`: `stepIndex === activeStep + 1`, exceto quando o atual for o último item.
- `inactive`: todos os demais itens futuros.

Exemplos:

### Item 2 ativo

- Item 1: `completed`.
- Item 2: `active`.
- Item 3: `next`.
- Itens 4–12: `inactive`.

### Item 6 ativo

- Itens 1–5: `completed`.
- Item 6: `active`.
- Item 7: `next`.
- Itens 8–12: `inactive`.

### Item 7 ativo

- Itens 1–6: permanecem `completed` no primeiro anel.
- Item 7: `active` no segundo anel.
- Item 8: `next`.
- Não existe conexão visual entre 6 e 7.

### Item 12 ativo

Os itens 1–11 estarão concluídos e o item 12 ativo. Não haverá `next` visual conectado; o ciclo automático poderá reiniciar no item 1, mas sem criar a conexão 12→1.

## Regras de estado das conexões

Uma conexão de progressão entre `a` e `b` será `active` quando `b.stepIndex <= activeStep`. Caso contrário, será `inactive`.

Consequentemente:

- Com o item 2 ativo, apenas `1 → 2` fica ativa.
- Com o item 6 ativo, ficam ativas `1 → 2 → 3 → 4 → 5 → 6`.
- Ao voltar do item 6 para o item 2, os segmentos depois de `2` são desativados.
- Ao chegar ao item 7, o anel 1 permanece completo e o anel 2 começa sem segmento ativo.
- Não há segmento que possa representar `6 → 7`.

O arco de fechamento de um anel poderá receber o brilho ativo quando o último item daquele anel estiver selecionado ou quando o anel já estiver concluído. Ele não será usado como ponte para o próximo anel.

## Visual e animações

### Nós

- `completed`: brilho intermediário, mantendo leitura de caminho percorrido.
- `active`: brilho ciano principal, maior contraste e escala atual.
- `next`: brilho discreto, borda mais visível e pulse lento.
- `inactive`: baixa intensidade, sem destaque.

O estado `next` usará uma animação CSS lenta, elegante e de baixa amplitude, aproximadamente entre 2,6 e 3 segundos. O pulse será removido automaticamente quando o item deixar de ser o próximo. Será incluída uma regra `prefers-reduced-motion` para reduzir ou desligar a animação.

### Conexões

As transições ocorrerão por classes estáveis usando `opacity`, `stroke`, `filter`, `box-shadow` e, quando útil, `stroke-dashoffset`. O avanço poderá acender o segmento no sentido do caminho; o retorno apagará os segmentos posteriores suavemente.

Nenhuma transição deverá reconstruir todos os nós ou todos os paths.

## Arquivos envolvidos

### `index.html`

- Substituir `#radarTrailPath` por `#radarConnectionsLayer`.
- Preservar círculos, eixos, pontos decorativos e logo central.
- Alinhar os `data-service-id` do menu “Nossas Soluções” com a sequência correta 1–12, pois os valores atuais estão deslocados em vários itens.

### `src/js/solucoes.js`

- Adicionar `stepIndex`, `ringIndex` e `positionInRing` aos dados.
- Criar a construção explícita dos segmentos de cada anel.
- Remover `visitedIndices`, `visitedSequence` e `updateRadarTrail()`.
- Derivar estados dos nós a partir de `activeStep`.
- Atualizar estados dos segmentos sem recriar o DOM.
- Preservar card, setas, dots, autoplay, preload de imagens e contadores.

### `src/css/solucoes.css`

- Consolidar o bloco atual de estados em `completed`, `active`, `next` e `inactive`.
- Adicionar estilos de conexão inativa/ativa.
- Adicionar pulse sutil para `next`.
- Remover regras duplicadas de hover.
- Adicionar suporte a movimento reduzido.

### `tests/site-integrity.ps1`

O teste existente continuará sendo executado para preservar as validações do projeto. A validação específica do radar será feita no navegador em viewport desktop, observando classes dos nós, paths SVG e transições. Se necessário durante a implementação, serão acrescentadas verificações estáticas pequenas para garantir que o path antigo e a lógica de sequência global não retornem.

## Critérios de aceitação

No desktop, os seguintes cenários devem ser verdadeiros:

1. Selecionar 1 deixa o item 1 ativo e o item 2 como próximo.
2. Selecionar 2 ativa somente o segmento 1→2.
3. Ir de 2 diretamente para 6 ativa todos os segmentos 1→2, 2→3, 3→4, 4→5 e 5→6.
4. Voltar de 6 para 2 desativa os segmentos após 2 e deixa o item 3 como próximo.
5. Ir de 6 para 7 mantém o primeiro anel concluído, ativa o item 7 e não cria qualquer path 6→7.
6. Avançar dentro do segundo anel ativa apenas segmentos entre vizinhos do segundo anel.
7. Voltar para o primeiro anel remove o progresso posterior conforme `activeStep`.
8. Somente o próximo item possui pulse.
9. Nenhuma conexão ativa ou inativa atravessa o centro.
10. Nenhum segmento liga serviços de `ringIndex` diferentes.
11. O autoplay respeita as mesmas regras ao avançar de 6 para 7 e de 12 para 1.
12. O card continua sincronizado com o item ativo.

## Restrições

- Foco inicial somente no desktop.
- Preservar o estilo visual atual sempre que possível.
- Não alterar backups, Obsidian, VPS, Notion ou outras pastas.
- Não criar conexão visual entre anéis.
- Não incluir dependências externas novas.
- Não misturar as alterações do radar com as alterações não relacionadas que já estão pendentes no working tree.
