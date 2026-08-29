/*
 * Shared presentation layer for the service pages.
 * Keeps service-specific copy and interactions intact while aligning
 * standard sections with the visual language used by the home page.
 */
(function () {
  'use strict';

  if (typeof window !== 'undefined') window.__serviceWhenApplyAccordion = true;

  const iconByTitle = [
    [/tie-in|derivaç|conexão|ramal/i, 'git-merge'],
    [/bypass|desvio/i, 'corner-down-right'],
    [/sensor|poço|manômetro|termométr|vacuômetro/i, 'thermometer'],
    [/lucro|cessante|economia|custo|financeir/i, 'coins'],
    [/fluido|água|agua|vapor|dreno|vazamento|estanqueidade/i, 'droplets'],
    [/máquina|maquina|locação|equipamento/i, 'cog'],
    [/in-service|solda|soldad|soldag|pwht|térmic|termic|fogo|calor/i, 'flame'],
    [/supervisão|supervisao|especialista|art|crea/i, 'user-check'],
    [/drone|aéreo|aereo/i, 'plane'],
    [/laser|nuvem|scan|varredura/i, 'scan'],
    [/inteligência|ia|machine|neural/i, 'brain'],
    [/rpa|robô|robo|automação|automacao/i, 'bot'],
    [/iot|telemetria|rádio|radio/i, 'radio'],
    [/tour|virtual|360/i, 'view'],
    [/dashboard|plataforma|gestão|gestao/i, 'layout-dashboard'],
    [/nr-?13|vaso|caldeira/i, 'gauge'],
    [/nr-?12|risco|proteção|protecao/i, 'shield-alert'],
    [/nr-?11|ponte|talha|içamento|icamento|guindaste/i, 'anchor'],
    [/nr-?20|inflamável|inflamavel|explosiv/i, 'flame'],
    [/nr-?35|linha de vida|ancoragem|altura/i, 'link'],
    [/nr-?34|naval|estaleiro/i, 'ship'],
    [/nr-?29|portuário|portuario|terminal/i, 'container'],
    [/capacitação|capacitacao|treinamento|formação|formacao/i, 'graduation-cap'],
    [/psv|alívio|alivio/i, 'shield'],
    [/quebra-vácuo|respiro/i, 'wind'],
    [/pressostato/i, 'toggle-right'],
    [/corros|fissur|trinca|descontinu|alerta|pop|emergência/i, 'shield-alert'],
    [/espessura|dimens|geometr|recalque|desalinh|tração|tracao/i, 'move-horizontal'],
    [/dano|ambient|chuva|intempérie/i, 'cloud-rain'],
    [/fadiga|repet|ciclo|dinâmic/i, 'repeat'],
    [/hidrog|átomo|atomo/i, 'atom'],
    [/charpy|impacto/i, 'hammer'],
    [/dureza|brinell|rockwell|vickers/i, 'shield'],
    [/metalografia|grão|grao|fase|microscópio/i, 'microscope'],
    [/química|quimica|pmi|xrf|espectro/i, 'flask-conical'],
    [/3\.1|3\.2|laudo|parecer|assinatura/i, 'file-badge-2'],
    [/rca|forense|causa-raiz/i, 'search-check'],
    [/hazop|apr|fmea/i, 'alert-triangle'],
    [/rbi|risco|alvo/i, 'target'],
    [/perícia|pericia|sinistro|judicial/i, 'scale'],
    [/pmp|rcm|cronograma|parada/i, 'calendar-check'],
    [/internacional|código|codigo|norma|globo/i, 'globe'],
    [/due diligence|capex|empreendimento|planta/i, 'building-2'],
    [/retro|revamp|reengenharia/i, 'refresh-cw'],
    [/as-built|desenho|compasso/i, 'drafting-compass'],
    [/fea|simulação|simulacao|numéric/i, 'cpu'],
    [/isométrico|isometrico|tubulação|tubulacao/i, 'git-commit'],
    [/processo|parâmetro|parametro/i, 'settings-2'],
    [/layout|espaço|espaco|arranjo/i, 'layout-grid'],
    [/kpi|produtividade|indicador/i, 'trending-up'],
    [/document|prontuário|prontuario|data book/i, 'folder-check'],
    [/qualifica|auditoria|pit|conform/i, 'badge-check'],
    [/mão de obra|residente|equipe|inspetor/i, 'users'],
    [/reparo|revest|cladding|manutenção|manutencao/i, 'wrench'],
    [/continuidade|disponib|operação|operacional|segurança/i, 'shield-check']
  ];

  const whenApplyImageSets = {
    '01-integridade-estrutural': ['01.jpeg', '02.jpeg', '03.jpg', '04.png', '05.jpg', '06.jpeg', '07.jpg', '08.jpeg'],
    '02-obras-artes-especiais': ['01.jpeg', '02.jpg', '03.jpeg', '04.jpeg', '05.jpeg', '06.jpeg', '07.jpg', '08.jpeg'],
    '03-ensaios-nao-destrutivos': ['01.jpeg', '02.jpeg', '03.jpeg', '04.jpg', '05.jpeg', '06.jpg', '07.jpeg', '08.jpeg'],
    '04-engenharia-de-soldagem': ['01.jpeg', '02.jpeg', '03.jpeg', '04.jpeg', '05.jpeg', '06.jpg', '07.jpeg', '08.jpeg'],
    '05-gerenciamento-de-projetos': ['01.jpeg', '02.jpeg', '03.jpeg', '04.jpeg', '05.jpeg', '06.jpeg', '07.jpeg', '08.png'],
    '06-projetos-mecanicos': ['01.jpeg', '02.jpeg', '03.jpeg', '04.jpeg', '05.jpeg', '06.jpeg', '07.jpeg', '08.jpeg'],
    '07-solucoes-tecnologicas': ['01.jpeg', '02.jpeg', '03.jpeg', '04.jpeg', '05.jpeg', '06.jpeg', '07.jpeg', '08.jpeg'],
    '08-adequacao-normativa': ['01.jpeg', '02.png', '03.jpeg', '04.jpeg', '05.jpeg', '06.jpeg', '07.jpeg', '08.jpeg'],
    '09-calibracao-instrumentos': ['01.jpeg', '02.jpeg', '03.jpeg', '04.jpeg', '05.jpeg', '06.jpeg', '07.jpeg', '08.jpeg'],
    '10-hot-tapping': ['01.jpg', '02.jpeg', '03.jpeg', '04.png', '05.jpeg', '06.jpeg', '07.jpeg', '08.jpeg'],
    '11-certificacao-materia-prima': ['01.jpeg', '02.jpeg', '03.jpeg', '04.jpeg', '05.jpeg', '06.jpeg', '07.jpeg', '08.jpeg'],
    '12-consultoria-assessoria': ['01.jpeg', '02.jpeg', '03.jpeg', '04.jpeg', '05.jpg', '06.jpg', '07.jpeg', '08.jpeg']
  };

  function normalizeWhenApplyImages() {
    const imageRoot = './assets/Paginas Imgs/SOLUCOES/QUANDO APLICAR/';

    document.querySelectorAll('#quando-aplicar[data-when-apply-image-set]').forEach(function (section) {
      const imageSet = whenApplyImageSets[section.dataset.whenApplyImageSet];
      if (!imageSet) return;

      section.querySelectorAll('.endo-acc-panel').forEach(function (panel, index) {
        const image = panel.querySelector('.endo-acc-card__img');
        const filename = imageSet[index];
        if (!image || !filename) return;

        image.src = imageRoot + section.dataset.whenApplyImageSet + '/' + filename;
        image.loading = index === 0 ? 'eager' : 'lazy';
      });
    });
  }

  function replaceSvgWithLucide(svg, name, className) {
    if (!svg || !name) return;

    const icon = document.createElement('i');
    icon.setAttribute('data-lucide', name);
    icon.setAttribute('aria-hidden', 'true');
    if (className) icon.className = className;
    svg.replaceWith(icon);
  }

  function iconForTitle(title) {
    const text = (title || '').trim();
    const entry = iconByTitle.find(function (item) { return item[0].test(text); });
    return entry ? entry[1] : 'shield-check';
  }

  function normalizeWhenApplyIcons() {
    document.querySelectorAll('#quando-aplicar .endo-acc-panel').forEach(function (panel) {
      const title = panel.querySelector('.endo-acc-card__title');
      const iconEl = panel.querySelector('.endo-acc-icon');
      if (!iconEl) return;
      if (iconEl.tagName && iconEl.tagName.toLowerCase() === 'svg') {
        replaceSvgWithLucide(iconEl, iconForTitle(title && title.textContent), 'endo-acc-icon');
      }
    });
  }

  function normalizeProcessIcons() {
    const stepIcons = ['clipboard-list', 'search-check', 'wrench', 'file-check-2'];
    document.querySelectorAll('.sn-step-unit').forEach(function (step, index) {
      const svg = step.querySelector('.sn-step-node svg');
      if (svg) replaceSvgWithLucide(svg, stepIcons[index] || 'check-circle-2');
    });

    document.querySelectorAll('.sn-step-line-connector svg, .sn-step-arrow svg').forEach(function (svg) {
      replaceSvgWithLucide(svg, 'chevron-right', 'sn-connector-head');
    });
  }

  function initProcessInteractions() {
    document.querySelectorAll('.sn-process-track-zone').forEach(function (track) {
      const units = Array.prototype.slice.call(track.querySelectorAll('.sn-step-unit'));
      if (!units.length) return;

      const firstUnit = units[0];
      const firstNode = firstUnit.querySelector('.sn-step-node');
      let resetTimer = null;
      const RESET_DELAY = 1600; // Retorna suavemente para o passo 01 após 1.6s

      function clearResetTimer() {
        if (resetTimer) {
          clearTimeout(resetTimer);
          resetTimer = null;
        }
      }

      function scheduleReset() {
        clearResetTimer();
        resetTimer = setTimeout(function () {
          units.forEach(function (u) {
            u.classList.remove('is-active');
          });
          track.classList.remove('has-other-hover');
          if (firstNode) firstNode.classList.add('sn-step-node-filled');
        }, RESET_DELAY);
      }

      function activateUnit(index) {
        clearResetTimer();
        units.forEach(function (u, i) {
          if (i === index) {
            u.classList.add('is-active');
          } else {
            u.classList.remove('is-active');
          }
        });

        if (index > 0) {
          track.classList.add('has-other-hover');
          if (firstNode) firstNode.classList.remove('sn-step-node-filled');
        } else {
          track.classList.remove('has-other-hover');
          if (firstNode) firstNode.classList.add('sn-step-node-filled');
        }
      }

      units.forEach(function (unit, index) {
        unit.addEventListener('mouseenter', function () {
          activateUnit(index);
        });

        unit.addEventListener('focusin', function () {
          activateUnit(index);
        });

        unit.addEventListener('mouseleave', function () {
          scheduleReset();
        });

        unit.addEventListener('focusout', function () {
          scheduleReset();
        });
      });

      track.addEventListener('mouseleave', function () {
        scheduleReset();
      });
    });
  }

  function normalizeMethodologyIcons() {
    const stepIcons = ['database', 'settings-2', 'file-text', 'clipboard-check'];

    document.querySelectorAll('.svc-methodology-section .svc-method-card').forEach(function (card, index) {
      const svg = card.querySelector('.svc-method-icon-box svg');
      if (svg) replaceSvgWithLucide(svg, stepIcons[index] || 'check-circle-2', 'svc-method-lucide');
    });

    document.querySelectorAll('.svc-methodology-section .svc-method-arrow-connector svg').forEach(function (svg) {
      replaceSvgWithLucide(svg, 'chevron-right', 'svc-method-connector-lucide');
    });
  }

  function normalizeCommitmentIcons() {
    document.querySelectorAll('.sn-commitment-card').forEach(function (card) {
      const title = card.querySelector('.sn-commitment-card-title');
      const svg = card.querySelector('.sn-commitment-icon svg');
      if (svg) replaceSvgWithLucide(svg, iconForTitle(title && title.textContent));
    });
  }

  function normalizeCtaIcons() {
    document.querySelectorAll(
      '.sn-page-wrapper .svc-cyan-cta-btn svg, .sn-page-wrapper .svc-solution-section .btn.btn-primary svg, .sn-page-wrapper .sn-commitment-btn svg'
    ).forEach(function (svg) {
      replaceSvgWithLucide(svg, 'arrow-right');
    });
  }

  function initBentoCardOrdering() {
    document.querySelectorAll('.bento-expanding-wrapper').forEach(function (wrapper) {
      const cards = Array.prototype.slice.call(
        wrapper.querySelectorAll(':scope > article, :scope > .bento-row > article')
      );

      const target = wrapper.querySelector('.bento-row') || wrapper;

      cards
        .map(function (card, index) {
          const title = card.querySelector('.ec-card-white-title');
          const details = card.querySelector('.ec-card-white-checklist, .ec-card-white-text');
          const content = [title && title.textContent, details && details.textContent]
            .filter(Boolean)
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim();

          return { card: card, index: index, score: content.length };
        })
        .sort(function (left, right) {
          return right.score - left.score || left.index - right.index;
        })
        .forEach(function (entry, index) {
          target.appendChild(entry.card);
          entry.card.style.order = String(index + 1);
          entry.card.dataset.contentOrder = String(index + 1);
        });
    });
  }

  function initWhenApplyAccordion() {
    document.querySelectorAll('#quando-aplicar').forEach(function (section) {
      const row = section.querySelector('.endo-acc-row');
      const panels = Array.prototype.slice.call(section.querySelectorAll('.endo-acc-panel'));
      const previousButton = section.querySelector('#btnPrevAcc');
      const nextButton = section.querySelector('#btnNextAcc');
      const dotsHost = section.querySelector('#accDotsIndex');

      if (!row || !panels.length || row.dataset.accordionReady === 'true') return;

      row.dataset.accordionReady = 'true';

      let activeIndex = panels.findIndex(function (panel) {
        return panel.classList.contains('is-active');
      });

      if (activeIndex < 0) activeIndex = 0;

      function panelLabel(panel, index) {
        const title = panel.querySelector('.endo-acc-card__title');
        return (title && title.textContent.trim()) || ('item ' + (index + 1));
      }

      function scrollToPanel(panel) {
        const isNarrowViewport = typeof window !== 'undefined'
          && typeof window.matchMedia === 'function'
          && window.matchMedia('(max-width: 860px)').matches;

        if (!isNarrowViewport || !panel || typeof panel.scrollIntoView !== 'function') return;

        panel.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }

      function updateDots() {
        if (!dotsHost) return;

        dotsHost.innerHTML = '';

        panels.forEach(function (panel, index) {
          const dot = document.createElement('button');
          dot.type = 'button';
          dot.className = 'endo-acc-dot';
          dot.setAttribute('aria-label', 'Ir para ' + panelLabel(panel, index));
          dot.classList.toggle('is-active', index === activeIndex);
          dot.setAttribute('aria-current', index === activeIndex ? 'true' : 'false');
          dot.addEventListener('click', function () {
            setActive(index, true);
          });
          dotsHost.appendChild(dot);
        });
      }

      function setActive(index, shouldScroll) {
        activeIndex = (index + panels.length) % panels.length;

        panels.forEach(function (panel, panelIndex) {
          const isActive = panelIndex === activeIndex;
          panel.classList.toggle('is-active', isActive);
          panel.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        });

        row.dataset.activeIndex = String(activeIndex);

        if (dotsHost) {
          dotsHost.querySelectorAll('.endo-acc-dot').forEach(function (dot, dotIndex) {
            dot.classList.toggle('is-active', dotIndex === activeIndex);
            dot.setAttribute('aria-current', dotIndex === activeIndex ? 'true' : 'false');
          });
        }

        if (shouldScroll) scrollToPanel(panels[activeIndex]);
      }

      function moveActive(delta) {
        setActive(activeIndex + delta, true);
      }

      panels.forEach(function (panel, index) {
        panel.setAttribute('role', 'button');
        panel.setAttribute('aria-expanded', index === activeIndex ? 'true' : 'false');

        panel.addEventListener('click', function () {
          setActive(index, true);
        });

        panel.addEventListener('keydown', function (event) {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setActive(index, true);
            return;
          }

          if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
            event.preventDefault();
            moveActive(1);
          }

          if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
            event.preventDefault();
            moveActive(-1);
          }

          if (event.key === 'Home') {
            event.preventDefault();
            setActive(0, true);
          }

          if (event.key === 'End') {
            event.preventDefault();
            setActive(panels.length - 1, true);
          }
        });
      });

      if (previousButton) {
        previousButton.addEventListener('click', function () {
          moveActive(-1);
        });
      }

      if (nextButton) {
        nextButton.addEventListener('click', function () {
          moveActive(1);
        });
      }

      updateDots();
      setActive(activeIndex, false);
    });
  }

  function createLucideIcons() {
    if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
    }
  }

  function init() {
    if (!document.body || !document.body.classList.contains('sn-page-wrapper')) return;

    initBentoCardOrdering();
    normalizeWhenApplyImages();
    normalizeWhenApplyIcons();
    initWhenApplyAccordion();
    normalizeProcessIcons();
    initProcessInteractions();
    normalizeMethodologyIcons();
    normalizeCommitmentIcons();
    normalizeCtaIcons();
    createLucideIcons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
