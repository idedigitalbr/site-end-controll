/*
 * Shared presentation layer for the service pages.
 * Keeps service-specific copy and interactions intact while aligning
 * standard sections with the visual language used by the home page.
 */
(function () {
  'use strict';

  const operationalPhotoPool = [
    './assets/Fotografias/editadas/operacional-inspecao-ultrassom-casco-estrutura-edit.webp',
    './assets/Fotografias/editadas/operacional-ultrassom-solda-tubulacao-edit-final.webp',
    './assets/Fotografias/editadas/operacional-engenheiros-inspecao-bomba-edit.webp',
    './assets/Fotografias/editadas/operacional-alpinismo-inspecao-vaso-pressao-edit.webp',
    './assets/Fotografias/editadas/operacional-alpinismo-industrial-escada-tanque-edit.webp',
    './assets/Fotografias/editadas/ultrassom-raptor-scan-crawler-operacao-edit.webp',
    './assets/Fotografias/editadas/ultrassom-raptor-scan-tecnicos-reunidos-campo-edit.webp',
    './assets/Fotografias/editadas/operacional-discussao-engenheiros-tela-original.png'
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

  function createLucideIcons() {
    if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
    }
  }

  function init() {
    if (!document.body || !document.body.classList.contains('sn-page-wrapper')) return;

    applyOperationalPhotos();
    normalizeWhenApplyIcons();
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
