/*
 * Shared presentation layer for the service pages.
 * Keeps service-specific copy and interactions intact while aligning
 * standard sections with the visual language used by the home page.
 */
(function () {
  'use strict';

  if (typeof window !== 'undefined') window.__serviceWhenApplyAccordion = true;

  const operationalPhotoPool = [
    './assets/Fotografias/originais-16-9/endcontrol-integridade-estrutural-aquisicao-dados-planta-industrial.webp',
    './assets/Fotografias/originais-16-9/endcontrol-ultrassom-phased-array-inspecao-solda-dutos-tubulacoes.webp',
    './assets/Fotografias/originais-16-9/endcontrol-inspecao-altura-nr35-escada-tanque-industrial.webp',
    './assets/Fotografias/originais-16-9/endcontrol-ensaios-nao-destrutivos-ultrassom-medicao-espessura-naval.webp',
    './assets/Fotografias/originais-16-9/endcontrol-calibracao-manometros-pressao-em-campo-nr13.webp',
    './assets/Fotografias/originais-16-9/endcontrol-engenharia-soldagem-qualificacao-soldadores-eps-rqps.webp',
    './assets/Fotografias/originais-16-9/endcontrol-inspecao-integridade-dutos-adutoras-sensores-campo.webp',
    './assets/Fotografias/originais-16-9/endcontrol-consultoria-tecnica-demonstracao-scanner-ultrassom-tubos.webp',
    './assets/Fotografias/originais-16-9/endcontrol-laboratorio-ensaio-dureza-digimess-certificacao-materiais.webp',
    './assets/Fotografias/originais-16-9/endcontrol-calibracao-medicao-vazao-ultrassonica-duto-industrial.webp',
    './assets/Fotografias/originais-16-9/endcontrol-equipe-escritorio-projetos-mecanicos-engenharia.webp',
    './assets/Fotografias/originais-16-9/endcontrol-institucional-lideranca-gestao-projetos-escritorio.webp'
  ];

  const iconByTitle = [
    [/corros|fissur|trinca|descontinu/i, 'shield-alert'],
    [/espessura|dimens|geometr|recalque|desalinh/i, 'scan-line'],
    [/dano|ambient|térmic|termic|fadiga|carga/i, 'activity'],
    [/hidrog|armadur|apoio|soldad|qualifica/i, 'flame'],
    [/continuidade|disponib|operação|operacional/i, 'refresh-cw'],
    [/dreno|água|agua|vazamento|pressão|pressao/i, 'droplets'],
    [/projeto|desenho|document|relatório|relatorio/i, 'file-check-2'],
    [/auditoria|conform|norma|regul|certifica/i, 'badge-check'],
    [/telemetria|iot|dados|digital|plataforma|software/i, 'monitor'],
    [/intelig|predit|simula|laser|3d/i, 'scan-search'],
    [/reparo|revest|cladding|manutenção|manutencao|tapping/i, 'wrench'],
    [/parceria|cliente|consult|assess/i, 'users']
  ];

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
    return entry ? entry[1] : 'check-circle-2';
  }

  function normalizeWhenApplyIcons() {
    document.querySelectorAll('#quando-aplicar .endo-acc-panel').forEach(function (panel) {
      const title = panel.querySelector('.endo-acc-card__title');
      const svg = panel.querySelector('.endo-acc-icon');
      if (svg) replaceSvgWithLucide(svg, iconForTitle(title && title.textContent), 'endo-acc-icon');
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

  function applyOperationalPhotos() {
    document.querySelectorAll('#quando-aplicar .endo-acc-card__img').forEach(function (image, index) {
      const source = operationalPhotoPool[index % operationalPhotoPool.length];
      if (!source) return;

      image.dataset.originalSrc = image.getAttribute('src') || '';
      image.src = source;
      image.removeAttribute('srcset');
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

    applyOperationalPhotos();
    normalizeWhenApplyIcons();
    initWhenApplyAccordion();
    normalizeProcessIcons();
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
