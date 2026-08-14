# Features — ENDCONTROL Engenharia

## Autoplay do radar com cadência fixa

- Status: Concluída
- Data: 2026-08-14
- O radar avança automaticamente de um serviço para o próximo a cada 2 segundos.
- A transição permanece em 1.600 ms e o código calcula os 400 ms restantes para completar cada intervalo de 2 segundos.
- Validação: teste de cadência, testes automatizados completos, integridade estrutural e `git diff --check` aprovados.

## Remoção de foto não utilizada

- Status: Concluída
- Data: 2026-08-14
- Removida a foto de inspeção por alpinismo em vaso de pressão e eliminadas suas referências ativas.
- Conteúdos que dependiam dela passaram a utilizar uma foto existente de inspeção por ultrassom.

## Radar Sweep com feixe reforcado

- Status: Concluida
- Data: 2026-08-14
- O feixe rotativo passou a usar tres camadas visuais: cone ciano com cauda gradual, nucleo branco-ciano e halo difuso com blur.
- Preservados a animacao WAAPI, o centro do radar, os arcos de progresso, a navegacao e o suporte a `prefers-reduced-motion`.
- Validacao: 18 testes do radar, integridade estrutural do site e verificacao de whitespace aprovados.

## Curadoria das fotos do HERO

- Status: Concluída
- Data: 2026-08-14
- Removidas do carrossel do topo as fotos de ultrassom em solda de tubulação e do técnico em refinaria noturna, conforme aprovação visual.
- Os arquivos físicos foram preservados porque continuam sendo usados em outras seções do site.

## Ordem compartilhada de serviços e agrupador Projetos

- Status: Concluída
- Data: 2026-08-14
- Menu, radar e cards seguem a mesma sequência de 12 serviços.
- `Projetos` funciona como agrupador sem numeração para Gerenciamento de Projetos e Elaboração de Projetos Mecânicos.
- Navegação por menu, radar, autoplay, setas e dots permanece sincronizada.
- Validação: testes da ordem, testes do radar e integridade estrutural aprovados.

## Logo do credito do rodape

- Status: Concluida
- Data: 2026-08-14
- Substituida a logo SVG embutida do credito "Desenvolvido por" pela imagem oficial `assets/Logos/logo-dev-idedigital.png`.
- Mantidos o link para o site da ide digital, o texto alternativo, o hover e a responsividade.

## Radar Sweep sincronizado

- Status: Concluida
- Data: 2026-08-13
- Feixe de varredura real com linha frontal, setor gradual e glow controlado.
- Sequencia temporizada 1 a 12 vinculada aos angulos reais dos icones medidos no DOM.
- Estados futuro, percorrido, atual, saindo e aproximando sincronizados com o card de destaque.
- Responsividade recalculada em resize e suporte a `prefers-reduced-motion`.
- Arquivos principais: index.html, src/css/solucoes.css, src/js/solucoes.js e src/js/radar-progress.js.
- Validacao: ciclo completo, quatro viewports, console do radar e testes automatizados aprovados.

## Refinamento visual do accordion de areas

- Status: Concluida
- Data: 2026-08-13
- Altura desktop reduzida para 360px e tablet para 340px, deixando os paineis mais quadrados.
- Mobile mantido em 360px para preservar leitura e navegacao por swipe.

## Accordion de Áreas de Atuação

- Status: Concluída
- Data: 2026-08-13
- Escopo: redução proporcional da altura dos painéis para 3/4 do tamanho anterior.
- Resultado: 435px no desktop, 390px em tablet e 360px em telas menores, preservando recorte, expansão e responsividade.
- Navegação mobile: swipe, setas, dots e toque sincronizam o card ativo; o painel centralizado abre automaticamente.
- Arquivos principais: index.html e src/css/segmentos.css.

## Radar orbital de soluções

- Status: Concluída
- Data: 2026-08-13
- Escopo: refinamento da linha de progresso, estados visuais e posicionamento contextual dos labels.
- Correção adicional: labels laterais permanecem sempre no lado externo correspondente ao ícone.
- Ajuste adicional: labels dos itens 2, 3, 9 e 10 ficam abaixo dos ícones.
- Alinhamento aprovado: itens 2, 3, 7, 8 e 11 à direita; itens 4, 9, 10 e 12 abaixo; itens 5 e 6 à esquerda.
- Quebras de linha das legendas ajustadas conforme o mapa visual aprovado.
- Revisão visual: as pontas das conexões agora desaparecem em 0% de opacidade antes dos ícones, sem máscaras sobre os nós.
- Ajuste final: ícones ganharam fundo opaco e as conexões passaram a manter uma lacuna angular maior ao redor deles, sem fundo adicional nos títulos.
- Estado inativo refinado: círculo e preenchimento permanecem com opacidade total; apenas o símbolo SVG interno usa opacidade reduzida.
- Posicionamento complementar: texto do item 7 abaixo do ícone e texto do item 8 à esquerda do ícone.
- Gradientes dos arcos agora acompanham o vetor real de cada trecho, mantendo o centro iluminado inclusive entre 2→3 e 5→6.
- Arquivos principais: index.html, src/js/radar-progress.js, src/js/solucoes.js, src/css/solucoes.css.
- Validação: testes unitários do radar e integridade estrutural do site aprovados.
