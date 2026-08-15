/**
 * ==========================================================================
 * ENDCONTROL ENGENHARIA — SOBRE NÓS JAVASCRIPT
 * Interatividades, Lightbox de Galeria, Modal de Vídeo e Animações
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', function () {
  // 1. HEADER SCROLL & MOBILE MENU
  const siteHeader = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const mainMenu = document.querySelector('.main-menu');

  if (siteHeader) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  if (menuToggle && mainMenu) {
    menuToggle.addEventListener('click', function () {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      mainMenu.classList.toggle('is-open');
    });
  }

  // 2. MODAL DE VÍDEO INSTITUCIONAL
  const videoBox = document.getElementById('snVideoBox');
  const videoModal = document.getElementById('snVideoModal');
  const videoModalClose = document.getElementById('snVideoModalClose');
  const modalVideoElement = document.getElementById('snModalVideoElement');
  const modalOverlay = document.getElementById('wf-modal-overlay');

  if (videoBox && videoModal) {
    videoBox.addEventListener('click', function () {
      videoModal.classList.add('open');
      if (modalOverlay) modalOverlay.classList.add('open');
      document.body.classList.add('modal-open');

      // Se houver vídeo, tentar iniciar reprodução
      if (modalVideoElement && modalVideoElement.src) {
        modalVideoElement.currentTime = 0;
        modalVideoElement.play().catch(function () {});
      }
    });

    const closeVideoModal = function () {
      videoModal.classList.remove('open');
      if (modalOverlay) modalOverlay.classList.remove('open');
      document.body.classList.remove('modal-open');
      if (modalVideoElement) {
        modalVideoElement.pause();
      }
    };

    if (videoModalClose) {
      videoModalClose.addEventListener('click', closeVideoModal);
    }
    if (modalOverlay) {
      modalOverlay.addEventListener('click', closeVideoModal);
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && videoModal.classList.contains('open')) {
        closeVideoModal();
      }
    });
  }

  // 3. LIGHTBOX DA GALERIA 3X3 DE FOTOS
  const galleryCards = document.querySelectorAll('.sn-gallery-card');
  const lightbox = document.getElementById('snLightbox');
  const lightboxImg = document.getElementById('snLightboxImg');
  const lightboxCaption = document.getElementById('snLightboxCaption');
  const lightboxClose = document.getElementById('snLightboxClose');
  const lightboxPrev = document.getElementById('snLightboxPrev');
  const lightboxNext = document.getElementById('snLightboxNext');

  let currentGalleryIndex = 0;
  const galleryData = [];

  galleryCards.forEach(function (card, index) {
    const img = card.querySelector('.sn-gallery-img');
    const caption = card.querySelector('.sn-gallery-caption');
    const src = img ? img.getAttribute('src') : '';
    const text = caption ? caption.textContent.trim() : '';

    galleryData.push({ src: src, caption: text });

    card.addEventListener('click', function () {
      openLightbox(index);
    });
  });

  function openLightbox(index) {
    if (!lightbox || !galleryData[index]) return;
    currentGalleryIndex = index;
    updateLightboxContent();
    lightbox.classList.add('open');
    document.body.classList.add('modal-open');
  }

  function updateLightboxContent() {
    const data = galleryData[currentGalleryIndex];
    if (!data) return;
    if (lightboxImg) lightboxImg.src = data.src;
    if (lightboxCaption) lightboxCaption.textContent = data.caption;
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.classList.remove('modal-open');
  }

  function nextLightbox() {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryData.length;
    updateLightboxContent();
  }

  function prevLightbox() {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryData.length) % galleryData.length;
    updateLightboxContent();
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', nextLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevLightbox);

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', function (e) {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextLightbox();
    if (e.key === 'ArrowLeft') prevLightbox();
  });

  // 4. INTERATIVIDADE DA TIMELINE (CLIQUE NOS NÓS)
  const timelineItems = document.querySelectorAll('.sn-timeline-item');
  timelineItems.forEach(function (item) {
    item.addEventListener('click', function () {
      timelineItems.forEach(function (i) { i.classList.remove('active'); });
      item.classList.add('active');
    });
  });

  // 5. ANIMAÇÕES SUAVES DE ENTRADA (INTERSECTION OBSERVER)
  if ('IntersectionObserver' in window) {
    const revealElements = document.querySelectorAll(
      '.sn-essence-card, .sn-indicator-item, .sn-process-step-item, .sn-gallery-card, .sn-commitment-card'
    );

    const observer = new IntersectionObserver(
      function (entries, observerInstance) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observerInstance.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      observer.observe(el);
    });
  }

  // 6. INICIALIZAR ÍCONES LUCIDE
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});
