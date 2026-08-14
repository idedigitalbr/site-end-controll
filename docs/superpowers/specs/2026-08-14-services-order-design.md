# Reorganização dos Serviços e Agrupador Projetos

## Objetivo

Reordenar os 12 serviços da ENDCONTROL de forma idêntica no menu, radar, cards e controles de navegação, criando um agrupador visual chamado `Projetos` no menu.

## Ordem aprovada

1. Engenharia de Integridade Estrutural
2. Inspeção em Obras de Artes Especiais
3. Ensaios Não Destrutivos (ENDs)
4. Engenharia de Soldagem

Projetos

5. Gerenciamento de Projetos
6. Elaboração de Projetos Mecânicos

7. Soluções Tecnológicas Integradas
8. Inspeção e Adequação Normativa
9. Calibração de Instrumentos
10. Trepanação (Hot Tapping)
11. Certificação de Matéria-Prima
12. Consultoria e Assessoria Técnica

## Comportamento

- O menu deve exibir os itens 1 a 4 diretamente.
- `Projetos` não terá numeração nem `data-service-id`; será um agrupador expansível.
- Ao abrir `Projetos`, o submenu exibirá apenas os itens 5 e 6.
- Os serviços no radar e nos cards seguirão a ordem numérica acima.
- A navegação por setas, dots, autoplay e links do menu continuará usando o índice compartilhado dos 12 serviços.
- O agrupador não criará um décimo terceiro serviço e não aparecerá como nó no radar.

## Implementação

- Reordenar `servicesData` em `src/js/solucoes.js`, renumerar títulos e ajustar anéis/ângulos conforme a nova posição.
- Substituir o submenu atual de Gerenciamento por `Projetos` e seus dois filhos em `index.html`.
- Preservar o comportamento genérico de abertura de `.item-with-submenu` em `src/js/main.js`, atualizando apenas o comentário contextual.
- Adicionar testes de ordem dos títulos e de correspondência dos IDs do agrupador.

## Critérios de aceite

- A ordem visível dos serviços é idêntica no menu, radar e card.
- O menu contém exatamente um agrupador `Projetos`, sem numeração, com dois filhos: 5 e 6.
- O primeiro serviço exibido no carregamento é o item 1: Engenharia de Integridade Estrutural.
- Todos os 12 testes/validações existentes continuam passando.
