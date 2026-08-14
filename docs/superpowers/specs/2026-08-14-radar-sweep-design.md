# Radar Sweep Line — Especificação de Design

## Objetivo

Reforçar visualmente o feixe rotativo do radar de soluções para aproximá-lo da referência aprovada: uma varredura ciano intensa, legível e tecnológica, com corpo luminoso, núcleo definido e halo suave. A navegação, os arcos de progresso, os nós, o card e a ordem dos serviços permanecem inalterados.

## Diagnóstico atual

O elemento `.radar-sweep` já é animado por Web Animations API em `src/js/solucoes.js`. Sua aparência atual é composta por um `conic-gradient` discreto, uma linha de 1px em `::before` e um ponto central em `::after`. Isso mantém a geometria correta, mas não produz contraste e profundidade suficientes durante a rotação.

## Direção aprovada

Manter a implementação CSS/WAAPI existente e reforçar somente a camada do sweep com três leituras visuais:

- faixa cônica translúcida mais ampla, com maior densidade próxima ao núcleo do feixe e desaparecimento gradual na cauda;
- núcleo branco-ciano mais espesso e nítido, acompanhado por um glow controlado;
- halo difuso e rastro suave que dão presença ao movimento sem encobrir os nós e os arcos SVG.

O centro do radar continua sendo o ponto de origem da linha. A rotação permanece controlada pelo `transform` do elemento existente, evitando novo estado ou nova animação em JavaScript.

## Arquitetura e limites

- Alterar `src/css/solucoes.css` na composição de `.radar-sweep` e seus pseudo-elementos.
- Não alterar a geometria dos anéis nem a camada `.radar-trail-svg`.
- Não alterar `src/js/solucoes.js`, exceto se a validação revelar necessidade comprovada de compatibilidade com a nova camada visual.
- Usar somente CSS nativo, sem dependências externas ou novas imagens.
- Preservar `pointer-events: none`, `prefers-reduced-motion` e a redução de opacidade em telas/usuários com movimento reduzido.

## Critérios de sucesso

1. O sweep é claramente visível em fundo escuro e permanece alinhado ao centro do radar.
2. O núcleo da linha se distingue da faixa difusa e apresenta brilho ciano/branco mais forte.
3. O cone e o halo desaparecem progressivamente, sem formar um disco azul permanente.
4. Nós, labels, arcos de progresso e card continuam legíveis e sem alteração funcional.
5. O efeito reduz sua intensidade com `prefers-reduced-motion` e não cria overflow horizontal.

## Validação

- Executar `node --test tests/radar-progress.test.js`.
- Executar `powershell -ExecutionPolicy Bypass -File tests/site-integrity.ps1`.
- Executar `git diff --check`.
- Conferir o preview local em desktop e mobile, observando contraste do núcleo, largura do halo e colisões com os elementos do radar.
