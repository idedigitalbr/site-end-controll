# Refinamento Visual do Radar de Soluções — Especificação de Design

## Objetivo

Refinar a implementação atual do radar orbital sem alterar sua estrutura geral, identidade visual, ordem dos 12 serviços ou navegação existente. O resultado deve controlar melhor o brilho da linha, criar variação de intensidade ao longo de cada trecho, interromper visualmente a linha na área dos ícones e distribuir os labels de forma contextual por quadrante.

## Diagnóstico da implementação atual

- src/js/solucoes.js renderiza os 12 nós por coordenadas polares em dois anéis e cria um path SVG por conexão válida.
- src/js/radar-progress.js já separa conexões por anel e determina os estados dos nós e conexões.
- src/css/solucoes.css aplica um estilo uniforme ao path ativo, com opacity 0.96, stroke-width 2.5px e dois drop-shadows amplos.
- Cada arco atualmente liga o centro geométrico de um ícone ao centro do seguinte; por isso a linha fica visualmente sob a área dos ícones.
- Os labels são renderizados sempre abaixo do ícone, centralizados, e não recebem classes de posição por lado/quadrante.

## Decisões de design

### Linha e estados

Manter a camada SVG existente, mas gerar cada conexão com um pequeno recuo angular nas duas extremidades. O recuo será calculado a partir do raio visual seguro do ícone, garantindo uma lacuna física antes da entrada e depois da saída do nó.

Cada conexão receberá uma classe semântica derivada do estado atual:

- is-completed: trecho já percorrido, visível e sutil;
- is-current: trecho que chega ao item ativo, com destaque moderado;
- is-future: trecho ainda não percorrido, apagado.

Os paths utilizarão um gradiente SVG orientado no sentido do arco, com intensidade fraca nas extremidades e maior no centro. O gradiente deve funcionar em paths regulares e nos arcos de fechamento de cada anel.

### Hierarquia visual

Os valores de brilho serão centralizados em variáveis CSS. O trecho atual será mais legível que os trechos concluídos, mas sem reproduzir o glow intenso atual. Nós ativos continuam sendo o ponto de maior destaque da composição.

### Labels

O ícone continuará ancorado na coordenada polar existente. O label passará a ser posicionado por classes contextuais:

- lado direito: label à direita do ícone, alinhado à esquerda;
- lado esquerdo: label à esquerda do ícone, alinhado à direita;
- topo: label abaixo do ícone e centralizado;
- base: label acima do ícone e centralizado.

O posicionamento deve considerar o anel e preservar uma distância mínima do círculo correspondente, do ícone e das colunas laterais. Em telas estreitas, as regras retornam ao empilhamento vertical seguro quando a orientação lateral não comportar o texto.

### Compatibilidade

Preservar autoplay, navegação por setas, dots, seleção direta, card de destaque, acessibilidade dos nós e as regras ring-aware existentes. Não criar conexões entre anéis diferentes.

## Fluxo de dados

1. RadarProgress.getProgressState() continua sendo a fonte de verdade para nós e conexões.
2. solucoes.js transforma cada conexão em um path SVG com geometria recuada e classe semântica.
3. O CSS controla opacidade, espessura e glow por estado.
4. O mesmo renderizador atribui ao nó uma classe de quadrante/anel para o label.

## Tratamento de bordas

- Arcos de fechamento devem respeitar o mesmo recuo angular dos demais trechos.
- A menor dimensão do radar deve limitar o recuo para que os segmentos não desapareçam em telas pequenas.
- Se um label lateral exceder a área útil, usar a orientação vertical correspondente ao topo/base.
- prefers-reduced-motion deve continuar reduzindo transições sem remover a legibilidade dos estados.

## Testes e validação

- Acrescentar testes unitários para o cálculo do arco seguro e para a classificação visual das conexões.
- Preservar todos os testes existentes de conexões por anel e estados de progresso.
- Validar tests/site-integrity.ps1.
- Fazer inspeção visual em desktop 1440px, desktop amplo, tablet e mobile; confirmar que nenhum label cruza os anéis ou colide com outro elemento.

## Fora de escopo

- Recriar o radar do zero.
- Alterar raios, ordem, ícones, conteúdo dos serviços ou layout geral da seção.
- Alterar o card de destaque ou a barra inferior de status.
