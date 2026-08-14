# Reorganização dos Serviços e Agrupador Projetos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reordenar os 12 serviços da ENDCONTROL no menu, radar, cards e navegação, com `Projetos` como agrupador dos itens 5 e 6.

**Architecture:** `src/js/solucoes.js` continuará sendo a fonte de dados e sequência do radar/cards. `index.html` manterá o menu rico estático, usando `data-service-id` para apontar para os índices da sequência compartilhada; `src/js/main.js` continuará controlando a abertura do agrupador. Os testes validarão a ordem dos dados e a ausência de um serviço extra para o agrupador.

**Tech Stack:** HTML, CSS existente, JavaScript no navegador, Node.js `node:test`, PowerShell.

## Global Constraints

- Trabalhar exclusivamente na branch `will/radar-sweep-endcontrol`.
- Manter exatamente os 12 serviços numerados na sequência aprovada.
- `Projetos` é somente agrupador de menu e não é um serviço do radar.
- Não alterar imagens, descrições ou estilos sem necessidade para a reordenação.
- Escrever o teste antes da implementação e observar a falha esperada.

---

### Task 1: Fixar a sequência aprovada em teste

**Files:**
- Modify: `tests/radar-progress.test.js`
- Test: `tests/radar-progress.test.js`

**Interfaces:**
- Consumes: `services` de teste já usado pelos testes de progresso.
- Produces: uma asserção explícita da sequência de títulos e do total de 12 serviços.

- [ ] **Step 1: Write the failing test**

Adicionar ao final de `tests/radar-progress.test.js`:

```js
test('keeps the approved service order for the radar sequence', () => {
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

  assert.deepEqual(services.map(service => service.title), approvedTitles);
  assert.equal(services.length, 12);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/radar-progress.test.js`

Expected: FAIL because the current fixture does not expose the approved title sequence.

- [ ] **Step 3: Write minimal implementation**

Atualizar o fixture `services` para incluir os títulos aprovados na ordem exata, preservando os metadados de dois anéis já usados pelos testes.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/radar-progress.test.js`

Expected: PASS for the new order test and all existing radar tests.

- [ ] **Step 5: Commit**

```bash
git add tests/radar-progress.test.js
git commit -m "test: define approved service order"
```

### Task 2: Reordenar a fonte de dados do radar e dos cards

**Files:**
- Modify: `src/js/solucoes.js:2-210`

**Interfaces:**
- Consumes: `servicesData` na sequência aprovada.
- Produces: 12 objetos com `id`/`stepIndex` sequenciais, seis posições externas e seis internas, consumidos por `goToService`, radar, dots, autoplay e card.

- [ ] **Step 1: Write the failing test**

Usar o teste da Task 1 como especificação executável da sequência; ele deverá falhar antes da troca da fonte de dados.

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/radar-progress.test.js`

Expected: FAIL na asserção da sequência atual.

- [ ] **Step 3: Write minimal implementation**

Reordenar os objetos existentes para a sequência:

```text
old 4, old 1, old 2, old 3, old 0, old 11, old 5, old 6, old 7, old 8, old 9, old 10
```

Renumerar `id`, `title` e `shortTitle`; manter as descrições, tópicos, imagens e ícones correspondentes a cada serviço. A lógica existente de `stepIndex`, `ringIndex` e `positionInRing` continuará determinando seis itens no anel externo e seis no interno.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/radar-progress.test.js`

Expected: PASS, incluindo a sequência e todas as transições de anel.

- [ ] **Step 5: Commit**

```bash
git add src/js/solucoes.js tests/radar-progress.test.js
git commit -m "feat: reorder solution services"
```

### Task 3: Transformar o item antigo em agrupador Projetos

**Files:**
- Modify: `index.html:183-267`
- Modify: `src/js/main.js:77-78`

**Interfaces:**
- Consumes: índices 0 a 11 da sequência nova em `servicesData`.
- Produces: menu com itens diretos 1-4, agrupador sem `data-service-id` e filhos 5/6 apontando para índices 4/5.

- [ ] **Step 1: Write the failing test**

Estender `tests/site-integrity.ps1` com verificações de texto para exigir `Projetos`, os filhos 5/6 e a ausência de `data-service-id` no trigger do agrupador.

- [ ] **Step 2: Run test to verify it fails**

Run: `powershell -ExecutionPolicy Bypass -File tests/site-integrity.ps1`

Expected: FAIL porque o menu atual ainda usa Gerenciamento como primeiro item e não contém o agrupador novo.

- [ ] **Step 3: Write minimal implementation**

No `index.html`, renderizar o agrupador neste formato sem criar novo serviço:

```html
<div class="item-with-submenu">
  <a class="dropdown-item-rich item-has-children" href="#solucoes" aria-expanded="false">
    <span class="dropdown-item-logo"><!-- ícone de projetos --></span>
    <span class="dropdown-item-text">Projetos</span>
    <svg class="sub-chevron" ...></svg>
  </a>
  <div class="submenuzinho">
    <a href="#solucoes" class="submenuzinho-item" data-service-id="4">5. Gerenciamento de Projetos</a>
    <a href="#solucoes" class="submenuzinho-item" data-service-id="5">6. Elaboração de Projetos Mecânicos</a>
  </div>
</div>
```

Reordenar os itens diretos e atualizar seus `data-service-id` conforme a nova sequência. Atualizar apenas o comentário do `src/js/main.js` para descrever o agrupador `Projetos`; o listener genérico de `.item-with-submenu` permanece inalterado.

- [ ] **Step 4: Run test to verify it passes**

Run: `powershell -ExecutionPolicy Bypass -File tests/site-integrity.ps1`

Expected: `site-integrity: PASS`.

- [ ] **Step 5: Commit**

```bash
git add index.html src/js/main.js tests/site-integrity.ps1
git commit -m "feat: group project services in menu"
```

### Task 4: Validar comportamento completo e memória

**Files:**
- Modify: `MD/changelog.md`
- Modify: `MD/features.md` quando a seção de soluções precisar refletir a ordem nova.

**Interfaces:**
- Consumes: sequência nova, menu e validações das Tasks 1-3.
- Produces: documentação atualizada e evidência de testes passantes na branch `will/radar-sweep-endcontrol`.

- [ ] **Step 1: Run all automated checks**

Run:

```powershell
node --test tests/radar-progress.test.js
powershell -ExecutionPolicy Bypass -File tests/site-integrity.ps1
```

Expected: todos os testes passam e a integridade retorna `site-integrity: PASS`.

- [ ] **Step 2: Inspect the rendered menu**

Abrir a página localmente e confirmar que `Projetos` aparece sem número, abre dois filhos e que cada filho leva ao card correto.

- [ ] **Step 3: Update project memory**

Adicionar ao topo de `MD/changelog.md` a reorganização da ordem e o agrupamento `Projetos`, sem alterar entradas históricas.

- [ ] **Step 4: Commit**

```bash
git add MD/changelog.md MD/features.md
git commit -m "docs: record approved service order"
```
