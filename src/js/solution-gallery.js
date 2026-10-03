/**
 * ============================================================================
 * ENDCONTROL ENGENHARIA — MOTOR DO CARROSSEL DE GALERIA EDITORIAL
 * Suporta múltiplos layouts por slide (single, double, triple, etc.),
 * quantidade flexível de imagens, autoplay inteligente e navegação touch/teclado.
 * ============================================================================
 */

(function () {
  'use strict';

  function initSolutionGallery(container) {
    if (!container || container.__ecGalleryInit) return;
    container.__ecGalleryInit = true;

    const track = container.querySelector('.ec-gallery-track');
    const slides = Array.from(container.querySelectorAll('.ec-gallery-slide'));
    const prevBtn = container.querySelector('.ec-gallery-prev');
    const nextBtn = container.querySelector('.ec-gallery-next');
    let dotsContainer = container.querySelector('.ec-gallery-dots');

    if (slides.length <= 1) {
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
      if (dotsContainer) dotsContainer.style.display = 'none';
      return;
    }

    const autoplayDelay = parseInt(container.getAttribute('data-autoplay') || '5500', 10);
    let currentIndex = 0;
    let autoplayTimer = null;
    let isHovered = false;
    let isTouchActive = false;

    // Localiza índice inicial ativo se marcado via HTML
    const initialActive = slides.findIndex(s => s.classList.contains('is-active'));
    if (initialActive >= 0) {
      currentIndex = initialActive;
    } else {
      slides[0].classList.add('is-active');
      currentIndex = 0;
    }

    // Inicialização / Criação de Dots Minimalistas
    if (!dotsContainer) {
      dotsContainer = document.createElement('div');
      dotsContainer.className = 'ec-gallery-dots';
      dotsContainer.setAttribute('role', 'tablist');
      dotsContainer.setAttribute('aria-label', 'Composições da galeria');
      container.appendChild(dotsContainer);
    } else {
      dotsContainer.innerHTML = '';
    }

    const dots = slides.map((slide, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'ec-gallery-dot' + (index === currentIndex ? ' is-active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-selected', index === currentIndex ? 'true' : 'false');
      dot.setAttribute('aria-label', `Ver composição visual ${index + 1} de ${slides.length}`);
      
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        goToSlide(index);
        restartAutoplay();
      });

      dotsContainer.appendChild(dot);
      return dot;
    });

    // Função de Troca de Slide com Animação Refinada
    function goToSlide(targetIndex, direction = 'next') {
      if (targetIndex === currentIndex) return;

      const currentSlide = slides[currentIndex];
      const nextSlide = slides[targetIndex];

      // Remove classes anteriores
      slides.forEach(s => {
        s.classList.remove('is-prev-leave');
      });

      if (currentSlide) {
        currentSlide.classList.remove('is-active');
        currentSlide.classList.add('is-prev-leave');
      }

      nextSlide.classList.add('is-active');

      // Atualiza Dots
      dots.forEach((dot, idx) => {
        const isActive = idx === targetIndex;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      currentIndex = targetIndex;
    }

    function nextSlide() {
      const nextIdx = (currentIndex + 1) % slides.length;
      goToSlide(nextIdx, 'next');
    }

    function prevSlide() {
      const prevIdx = (currentIndex - 1 + slides.length) % slides.length;
      goToSlide(prevIdx, 'prev');
    }

    // Autoplay Inteligente
    function startAutoplay() {
      stopAutoplay();
      if (autoplayDelay <= 0) return;
      autoplayTimer = setInterval(() => {
        if (!isHovered && !isTouchActive && !document.hidden) {
          nextSlide();
        }
      }, autoplayDelay);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    function restartAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    // Eventos dos Botões
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        nextSlide();
        restartAutoplay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        prevSlide();
        restartAutoplay();
      });
    }

    // Pausa suave no Hover
    container.addEventListener('mouseenter', () => {
      isHovered = true;
    });

    container.addEventListener('mouseleave', () => {
      isHovered = false;
      restartAutoplay();
    });

    // Pausa de Autoplay quando a aba do navegador fica inativa
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAutoplay();
      } else {
        restartAutoplay();
      }
    });

    // Navegação por Teclado (quando em foco)
    container.setAttribute('tabindex', '0');
    container.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextSlide();
        restartAutoplay();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
        restartAutoplay();
      }
    });

    // Suporte a Gesto Swipe no Touch (Mobile/Tablet)
    let touchStartX = 0;
    let touchStartY = 0;

    container.addEventListener('touchstart', (e) => {
      if (!e.touches || e.touches.length === 0) return;
      isTouchActive = true;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
      isTouchActive = false;
      if (!e.changedTouches || e.changedTouches.length === 0) return;
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      // Se o movimento for predominantemente horizontal e maior que 40px
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
        if (diffX < 0) {
          nextSlide();
        } else {
          prevSlide();
        }
        restartAutoplay();
      }
    }, { passive: true });

    // Inicia autoplay
    startAutoplay();
  }

  // Inicializa quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('.ec-gallery-container').forEach(initSolutionGallery);
    });
  } else {
    document.querySelectorAll('.ec-gallery-container').forEach(initSolutionGallery);
  }

  // Exporta globalmente para inicializações dinâmicas se necessário
  window.initSolutionGallery = initSolutionGallery;
})();
