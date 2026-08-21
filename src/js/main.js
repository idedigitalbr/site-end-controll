(function () {
  /* Debounce helper for high-performance resize listeners */
  function debounce(func, wait) {
    var timeout;
    return function () {
      var context = this;
      var args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        func.apply(context, args);
      }, wait);
    };
  }
  /* ===================================================================
     Menu Mobile + Dropdown Inteligente
     =================================================================== */
  function initMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('#main-menu');
    const allDropdowns = document.querySelectorAll('.dropdown');

    function closeAllDropdowns(except) {
      allDropdowns.forEach(function (d) {
        if (d !== except) {
          d.classList.remove('is-open');
        }
      });
    }

    if (menuToggle && menu) {
      menuToggle.addEventListener('click', function () {
        const isOpen = menu.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
      });
      menu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function (e) {
          if (link.classList.contains('drop-link')) {
            if (window.innerWidth <= 980) {
              e.preventDefault();
              return;
            }
          }
          if (link.classList.contains('item-has-children')) {
            return;
          }
          menu.classList.remove('open');
          menuToggle.setAttribute('aria-expanded', 'false');
        });
      });
    }

    allDropdowns.forEach(function (dropdown) {
      let dropdownTimer;
      dropdown.addEventListener('mouseenter', function () {
        clearTimeout(dropdownTimer);
        closeAllDropdowns(dropdown);
        dropdown.classList.add('is-open');
      });
      dropdown.addEventListener('mouseleave', function () {
        dropdownTimer = setTimeout(function () {
          dropdown.classList.remove('is-open');
        }, 200);
      });
      dropdown.addEventListener('focusin', function () {
        clearTimeout(dropdownTimer);
        closeAllDropdowns(dropdown);
        dropdown.classList.add('is-open');
      });
      dropdown.addEventListener('focusout', function (e) {
        if (dropdown.contains(e.relatedTarget)) return;
        dropdownTimer = setTimeout(function () {
          dropdown.classList.remove('is-open');
        }, 200);
      });
    });

    // Toggle para o agrupador Projetos (Gerenciamento e Elaboração de Projetos Mecânicos)
    const itemsWithSubmenu = document.querySelectorAll('.item-with-submenu');
    itemsWithSubmenu.forEach(function (itemWithSubmenu) {
      const trigger = itemWithSubmenu.querySelector('.item-has-children');
      if (trigger) {
        trigger.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          const isOpen = itemWithSubmenu.classList.toggle('is-open');
          trigger.setAttribute('aria-expanded', String(isOpen));
        });
      }
    });
  }

  /* ===================================================================
     Header Scroll Inteligente
     =================================================================== */
  function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    let lastScrollY = window.scrollY;
    function checkScroll() {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      if (currentScrollY > 150) {
        if (currentScrollY > lastScrollY) {
          header.classList.add('hidden');
        } else {
          header.classList.remove('hidden');
        }
      } else {
        header.classList.remove('hidden');
      }
      lastScrollY = currentScrollY;
    }
    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
  }

  /* ===================================================================
     Cursor Glow Amarelo Premium (Otimizado)
     =================================================================== */
  function initCursorGlow() {
    if (window.matchMedia('(hover: none)').matches) return;
    const glow = document.createElement('div');
    glow.id = 'cursor-glow';
    glow.style.cssText = 'position:fixed;pointer-events:none;z-index:99999;width:340px;height:340px;border-radius:50%;background:radial-gradient(circle, rgba(255,196,0,0.13) 0%, rgba(255,196,0,0.055) 40%, rgba(255,196,0,0) 70%);transform:translate3d(-999px,-999px,0) translate(-50%,-50%);transition:opacity 0.5s ease;opacity:0;mix-blend-mode:screen;will-change:transform;';
    document.body.appendChild(glow);
    let targetX = -999, targetY = -999, currentX = -999, currentY = -999;
    let animationFrameId = null;

    document.addEventListener('mousemove', function (e) {
      targetX = e.clientX;
      targetY = e.clientY;
      glow.style.opacity = '1';
      
      // Acorda o loop de animação se estiver inativo
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(animate);
      }
    });

    document.addEventListener('mouseleave', function () {
      glow.style.opacity = '0';
    });

    function animate() {
      currentX += (targetX - currentX) * 0.10;
      currentY += (targetY - currentY) * 0.10;
      glow.style.transform = 'translate3d(' + currentX + 'px,' + currentY + 'px,0) translate(-50%,-50%)';
      
      // Se a diferença for muito pequena, para o loop para economizar CPU
      const diffX = Math.abs(targetX - currentX);
      const diffY = Math.abs(targetY - currentY);
      
      if (diffX > 0.1 || diffY > 0.1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        animationFrameId = null;
      }
    }
  }

  /* ===================================================================
     Efeito de Ponto de Luz de Fundo (Mouse Spotlight Global)
     =================================================================== */
  function initSectionSpotlights() {
    if (window.matchMedia('(hover: none)').matches) return;
    
    const targetSections = document.querySelectorAll('.about-premium-dark-section, .brands-black-block, .diretrizes-neon-section, .footer, .dark-slice');
    
    targetSections.forEach(function (section) {
      if (window.getComputedStyle(section).position === 'static') {
        section.style.position = 'relative';
      }
      section.style.overflow = 'hidden';
      
      let spotlight = section.querySelector('.mouse-spotlight, .about-mouse-spotlight');
      if (!spotlight) {
        spotlight = document.createElement('div');
        spotlight.className = 'mouse-spotlight';
        section.appendChild(spotlight);
      }
      
      let rect = null;
      function updateRect() {
        rect = section.getBoundingClientRect();
      }
      section.addEventListener('mouseenter', updateRect);
      window.addEventListener('resize', updateRect);
      window.addEventListener('scroll', updateRect, { passive: true });
      
      let ticking = false;
      section.addEventListener('mousemove', function (e) {
        if (!rect) updateRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (!ticking) {
          window.requestAnimationFrame(function () {
            spotlight.style.setProperty('--mouse-x', x + 'px');
            spotlight.style.setProperty('--mouse-y', y + 'px');
            ticking = false;
          });
          ticking = true;
        }
      });
    });
  }

  /* ===================================================================
     FAQ Accordion
     =================================================================== */
  function initFAQ() {
    // FAQ v2 — grid 2 colunas
    const faqV2Questions = document.querySelectorAll('.faq-v2-question');
    faqV2Questions.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const item = btn.parentElement;
        const answer = item.querySelector('.faq-v2-answer');
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-v2-item').forEach(function (el) {
          el.classList.remove('active');
          el.querySelector('.faq-v2-answer').style.maxHeight = null;
        });
        if (!isActive) {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });

    // FAQ legado — accordion simples
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const item = btn.parentElement;
        const answer = btn.nextElementSibling;
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(function (el) {
          el.classList.remove('active');
          el.querySelector('.faq-answer').style.maxHeight = null;
        });
        if (!isActive) {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }

  /* ===================================================================
     Formulario de Lead
     =================================================================== */
  function initLeadForm() {
    const form = document.querySelector('#lead-form');
    const feedback = document.querySelector('.form-feedback');
    if (!form || !feedback) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      feedback.style.display = 'none';
      feedback.className = 'form-feedback';
      const nome = form.querySelector('#nome').value.trim();
      const email = form.querySelector('#email').value.trim();
      const msg = form.querySelector('#mensagem').value.trim();
      if (!nome || !email || !msg) {
        feedback.innerText = 'Por favor, preencha todos os campos obrigatorios.';
        feedback.classList.add('error');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        feedback.innerText = 'Por favor, insira um e-mail valido.';
        feedback.classList.add('error');
        return;
      }
      feedback.innerText = 'Obrigado! Seu interesse foi registrado. Nossa equipe entrara em contato em breve.';
      feedback.classList.add('success');
      form.reset();
    });
  }

  /* ===================================================================
     Animacao de Reveal por IntersectionObserver
     =================================================================== */
  function initRevealAnimation() {
    const revealItems = document.querySelectorAll('.reveal');
    if (!revealItems.length) return;
    document.body.classList.add('animations-ready');
    if (!('IntersectionObserver' in window)) {
      revealItems.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    revealItems.forEach(function (el) { observer.observe(el); });
  }

  /* ===================================================================
     Controle de Modais e Formulários de Contato
     =================================================================== */
  function initModals() {
    const overlay = document.getElementById('wf-modal-overlay');
    const modals = document.querySelectorAll('.wf-modal');
    let previousFocusedElement = null;
    
    function openModal(modalId) {
      const modal = document.getElementById(modalId);
      if (!modal || modal.classList.contains('open')) return;
      
      previousFocusedElement = document.activeElement;
      modals.forEach(function (m) { m.classList.remove('open'); });
      
      if (overlay) overlay.classList.add('open');
      modal.classList.add('open');
      document.body.classList.add('modal-open');
      document.documentElement.classList.add('modal-open');

      // Move focus inside the modal
      const closeBtn = modal.querySelector('.wf-modal-close');
      if (closeBtn) {
        closeBtn.focus();
      } else {
        modal.setAttribute('tabindex', '-1');
        modal.focus();
      }

      document.addEventListener('keydown', handleEscapeKey);
      modal.addEventListener('keydown', trapFocus);
    }
    
    function closeModal() {
      modals.forEach(function (m) { 
        m.classList.remove('open'); 
        m.removeEventListener('keydown', trapFocus);
        // Pause any video inside modal when closing
        const video = m.querySelector('video');
        if (video) {
          video.pause();
          video.src = "";
        }
      });
      if (overlay) overlay.classList.remove('open');
      document.body.classList.remove('modal-open');
      document.documentElement.classList.remove('modal-open');
      
      document.removeEventListener('keydown', handleEscapeKey);

      if (previousFocusedElement && previousFocusedElement.focus) {
        previousFocusedElement.focus();
      }
    }

    // Expose functions globally for external control
    window.openModal = openModal;
    window.closeModal = closeModal;

    function handleEscapeKey(e) {
      if (e.key === 'Escape') {
        closeModal();
      }
    }

    function trapFocus(e) {
      if (e.key !== 'Tab') return;
      const modal = e.currentTarget;
      const focusables = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          last.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    }
    
    if (overlay) {
      overlay.addEventListener('click', closeModal);
      overlay.addEventListener('touchmove', function (e) {
        e.preventDefault();
      }, { passive: false });
    }
    
    document.querySelectorAll('.wf-modal-close').forEach(function (btn) {
      btn.addEventListener('click', closeModal);
    });
    
    const triggerMap = {
      'menu-link-links': 'modal-redes-sociais'
    };
    
    Object.keys(triggerMap).forEach(function (id) {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('click', function (e) {
          e.preventDefault();
          openModal(triggerMap[id]);
        });
      }
    });

    // Capturar cliques em links de âncora específicos para abrir modais
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === '#links') {
        link.addEventListener('click', function (e) {
          e.preventDefault();
          openModal('modal-redes-sociais');
        });
      }
    });

    // Verificar hash ao carregar para suportar links externos
    const checkHash = function () {
      const hash = window.location.hash;
      if (hash === '#links') {
        openModal('modal-redes-sociais');
      }
    };
    
    window.addEventListener('hashchange', checkHash);
    setTimeout(checkHash, 300);


  }

  /* ===================================================================
     Seção Palavra da Nossa Presidência (vídeos lado a lado + play inline)
     =================================================================== */
  function initTestimonialsCarousel() {
    const track = document.getElementById('dep-track') || document.querySelector('.testimonials-carousel-track');
    const cards = track ? track.querySelectorAll('.dep-video-card') : document.querySelectorAll('.dep-video-card');

    if (!cards || cards.length === 0) return;

    /* ---- inline video play on card click ---- */
    const fsModal = document.getElementById('dep-fullscreen-modal');
    const fsVideo = document.getElementById('dep-fs-video');

    function openCellularFullscreen(origVideo) {
      if (!fsModal || !fsVideo) return;
      origVideo.pause();
      
      fsVideo.src = origVideo.getAttribute('src');
      
      // Copiar atributos de limites de reprodução
      if (origVideo.hasAttribute('data-start')) {
        fsVideo.setAttribute('data-start', origVideo.getAttribute('data-start'));
      } else {
        fsVideo.removeAttribute('data-start');
      }
      if (origVideo.hasAttribute('data-end')) {
        fsVideo.setAttribute('data-end', origVideo.getAttribute('data-end'));
      } else {
        fsVideo.removeAttribute('data-end');
      }
      
      fsVideo.currentTime = origVideo.currentTime;
      fsVideo.muted = origVideo.muted;
      
      // Copia a tag de informações do card para o modal
      const cardContainer = origVideo.closest('.dep-video-card');
      if (cardContainer) {
        const origTag = cardContainer.querySelector('.dep-card-tag');
        const fsTag = fsModal.querySelector('#dep-fs-tag');
        if (origTag && fsTag) {
          fsTag.innerHTML = origTag.innerHTML;
          const durationEl = fsTag.querySelector('.dep-tag-duration');
          if (durationEl) durationEl.style.display = 'none';
        }
      }
      
      // Atualiza o estado dos botões do modal ao carregar
      const playPauseBtn = fsModal.querySelector('.dep-play-pause-btn');
      if (playPauseBtn) {
        const iconPlay = playPauseBtn.querySelector('.icon-play');
        const iconPause = playPauseBtn.querySelector('.icon-pause');
        if (origVideo.paused) {
          if (iconPlay) iconPlay.style.display = 'block';
          if (iconPause) iconPause.style.display = 'none';
        } else {
          if (iconPlay) iconPlay.style.display = 'none';
          if (iconPause) iconPause.style.display = 'block';
        }
      }

      // Sincroniza o ícone de volume do modal com o estado do vídeo de origem
      const volumeBtn = fsModal.querySelector('.dep-volume-btn');
      if (volumeBtn) {
        const iconVolOn = volumeBtn.querySelector('.icon-volume-on');
        const iconVolOff = volumeBtn.querySelector('.icon-volume-off');
        if (origVideo.muted) {
          if (iconVolOn) iconVolOn.style.display = 'none';
          if (iconVolOff) iconVolOff.style.display = 'block';
        } else {
          if (iconVolOn) iconVolOn.style.display = 'block';
          if (iconVolOff) iconVolOff.style.display = 'none';
        }
      }
      
      // Sincroniza o slider de volume do modal com o estado do vídeo de origem
      const volumeSlider = fsModal.querySelector('.dep-volume-slider');
      if (volumeSlider) {
        volumeSlider.value = origVideo.muted ? 0 : origVideo.volume;
      }

      fsModal.classList.add('active');
      document.body.classList.add('modal-open');
      document.documentElement.classList.add('modal-open');
      fsVideo.play().catch(() => {});
      fsModal.activeOriginalVideo = origVideo;
    }

    function closeCellularFullscreen() {
      if (!fsModal || !fsVideo) return;
      fsVideo.pause();
      fsModal.classList.remove('active');
      document.body.classList.remove('modal-open');
      document.documentElement.classList.remove('modal-open');
      
      const origVideo = fsModal.activeOriginalVideo;
      if (origVideo) {
        origVideo.currentTime = fsVideo.currentTime;
        origVideo.muted = fsVideo.muted; // Copia estado de mute de volta
        origVideo.volume = fsVideo.volume; // Copia volume também
        
        // Sincroniza o ícone de volume do card original
        const cardContainer = origVideo.closest('.dep-video-card');
        if (cardContainer) {
          const origVolumeBtn = cardContainer.querySelector('.dep-volume-btn');
          const origVolumeSlider = cardContainer.querySelector('.dep-volume-slider');
          if (origVolumeBtn) {
            const iconVolOn = origVolumeBtn.querySelector('.icon-volume-on');
            const iconVolOff = origVolumeBtn.querySelector('.icon-volume-off');
            if (fsVideo.muted) {
              if (iconVolOn) iconVolOn.style.display = 'none';
              if (iconVolOff) iconVolOff.style.display = 'block';
            } else {
              if (iconVolOn) iconVolOn.style.display = 'block';
              if (iconVolOff) iconVolOff.style.display = 'none';
            }
          }
          if (origVolumeSlider) {
            origVolumeSlider.value = fsVideo.muted ? 0 : fsVideo.volume;
          }
        }
        
        origVideo.play().catch(() => {});
      }
    }

    if (fsModal && fsVideo) {
      const closeBtn = fsModal.querySelector('.dep-fs-close-btn');
      const backdrop = fsModal.querySelector('.dep-fs-backdrop');
      if (closeBtn) closeBtn.addEventListener('click', closeCellularFullscreen);
      if (backdrop) backdrop.addEventListener('click', closeCellularFullscreen);
      
      const phoneFrame = fsModal.querySelector('.dep-fs-phone-frame');
      
      fsVideo.addEventListener('play', () => {
        if (phoneFrame) phoneFrame.classList.add('playing');
      });
      
      fsVideo.addEventListener('pause', () => {
        if (phoneFrame) {
          phoneFrame.classList.remove('playing');
          phoneFrame.classList.remove('touch-active');
        }
      });
      
      fsVideo.addEventListener('ended', () => {
        if (phoneFrame) {
          phoneFrame.classList.remove('playing');
          phoneFrame.classList.remove('touch-active');
        }
        const startVal = fsVideo.getAttribute('data-start') ? parseFloat(fsVideo.getAttribute('data-start')) : 0;
        fsVideo.currentTime = startVal;
      });
      
      const triggerFsPlay = (e) => {
        e.stopPropagation();
        if (fsVideo.paused) {
          fsVideo.play().catch(() => {});
        } else {
          fsVideo.pause();
        }
      };

      if (phoneFrame) {
        phoneFrame.addEventListener('click', (e) => {
          if (phoneFrame.classList.contains('playing') && e.pointerType === 'touch') {
            e.stopPropagation();
            e.preventDefault();
            if (!phoneFrame.classList.contains('touch-active')) {
              phoneFrame.classList.add('touch-active');
              clearTimeout(phoneFrame.touchTimeout);
              phoneFrame.touchTimeout = setTimeout(() => {
                phoneFrame.classList.remove('touch-active');
              }, 3000);
            } else {
              phoneFrame.classList.remove('touch-active');
              triggerFsPlay(e);
            }
          } else if (e.target === fsVideo) {
            triggerFsPlay(e);
          }
        });
      }
      
      // Conecta controles customizados do modal
      setupCustomControls(fsModal, fsVideo);
    }

    // Função modular para inicializar os controles customizados
    function setupCustomControls(container, video) {
      const controls = container.querySelector('.dep-custom-controls');
      if (!controls) return;

      controls.addEventListener('click', (e) => {
        e.stopPropagation();
      });

      const playPauseBtn = controls.querySelector('.dep-play-pause-btn');
      const rewindBtn    = controls.querySelector('.dep-rewind-btn');
      const forwardBtn   = controls.querySelector('.dep-forward-btn');
      const volumeBtn    = controls.querySelector('.dep-volume-btn');
      const volumeSlider = controls.querySelector('.dep-volume-slider');
      const fullscreenBtn = controls.querySelector('.dep-fullscreen-btn');
      const timeline     = controls.querySelector('.dep-controls-timeline-wrapper');
      const progress     = controls.querySelector('.dep-controls-timeline-progress');
      const timeText     = controls.querySelector('.dep-ctrl-time');

      if (!playPauseBtn) return;

      const iconPlay = playPauseBtn.querySelector('.icon-play');
      const iconPause = playPauseBtn.querySelector('.icon-pause');

      playPauseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (video.paused) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });

      if (rewindBtn) {
        rewindBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const startVal = video.getAttribute('data-start') ? parseFloat(video.getAttribute('data-start')) : 0;
          video.currentTime = Math.max(startVal, video.currentTime - 10);
        });
      }

      if (forwardBtn) {
        forwardBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const endVal = video.getAttribute('data-end') ? parseFloat(video.getAttribute('data-end')) : (video.duration || 0);
          video.currentTime = Math.min(endVal, video.currentTime + 10);
        });
      }

      if (volumeBtn) {
        const iconVolOn = volumeBtn.querySelector('.icon-volume-on');
        const iconVolOff = volumeBtn.querySelector('.icon-volume-off');
        volumeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          video.muted = !video.muted;
          if (video.muted) {
            if (iconVolOn) iconVolOn.style.display = 'none';
            if (iconVolOff) iconVolOff.style.display = 'block';
            if (volumeSlider) volumeSlider.value = 0;
          } else {
            if (iconVolOn) iconVolOn.style.display = 'block';
            if (iconVolOff) iconVolOff.style.display = 'none';
            if (volumeSlider) volumeSlider.value = video.volume || 1;
          }
        });
      }

      if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
          e.stopPropagation();
          const val = parseFloat(e.target.value);
          video.volume = val;
          if (val === 0) {
            video.muted = true;
          } else {
            video.muted = false;
          }
          if (volumeBtn) {
            const iconVolOn = volumeBtn.querySelector('.icon-volume-on');
            const iconVolOff = volumeBtn.querySelector('.icon-volume-off');
            if (video.muted) {
              if (iconVolOn) iconVolOn.style.display = 'none';
              if (iconVolOff) iconVolOff.style.display = 'block';
            } else {
              if (iconVolOn) iconVolOn.style.display = 'block';
              if (iconVolOff) iconVolOff.style.display = 'none';
            }
          }
        });
      }

      if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          openCellularFullscreen(video);
        });
      }

      function formatTime(secs) {
        if (isNaN(secs)) return '00:00';
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = Math.floor(secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
      }

      video.addEventListener('timeupdate', () => {
        const startVal = video.getAttribute('data-start') ? parseFloat(video.getAttribute('data-start')) : 0;
        const endVal = video.getAttribute('data-end') ? parseFloat(video.getAttribute('data-end')) : null;

        // Limitar o fim do vídeo (carlos eduardo para em 6s)
        if (endVal !== null && video.currentTime >= endVal) {
          video.pause();
          video.currentTime = endVal;
          video.dispatchEvent(new Event('ended'));
          return;
        }

        // Evitar que o cursor de tempo volte para trás do tempo inicial (se definido)
        if (video.currentTime < startVal) {
          video.currentTime = startVal;
        }

        const duration = endVal !== null ? endVal : video.duration;
        if (duration) {
          const effectiveDuration = duration - startVal;
          const effectiveCurrent = Math.max(0, video.currentTime - startVal);
          const pct = (effectiveCurrent / effectiveDuration) * 100;
          if (progress) progress.style.width = `${Math.min(100, Math.max(0, pct))}%`;
          if (timeText) {
            timeText.textContent = `${formatTime(effectiveCurrent)} / ${formatTime(effectiveDuration)}`;
          }
        }
      });

      if (timeline) {
        timeline.addEventListener('click', (e) => {
          e.stopPropagation();
          const rect = timeline.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const width = rect.width;
          const startVal = video.getAttribute('data-start') ? parseFloat(video.getAttribute('data-start')) : 0;
          const endVal = video.getAttribute('data-end') ? parseFloat(video.getAttribute('data-end')) : video.duration;
          if (endVal) {
            const pct = clickX / width;
            video.currentTime = startVal + pct * (endVal - startVal);
          }
        });
      }

      video.addEventListener('play', () => {
        if (iconPlay) iconPlay.style.display = 'none';
        if (iconPause) iconPause.style.display = 'block';
      });
      video.addEventListener('pause', () => {
        if (iconPlay) iconPlay.style.display = 'block';
        if (iconPause) iconPause.style.display = 'none';
      });
    }

    cards.forEach(card => {
      const video   = card.querySelector('.dep-video');
      const playBtn = card.querySelector('.dep-play-btn');

      if (!video) return;

      // Inicializa os controles customizados para este card
      setupCustomControls(card, video);

      // Evento de reprodução nativo do vídeo: sincroniza o visual e pausa outros
      video.addEventListener('play', () => {
        cards.forEach(c => {
          if (c !== card) {
            const v = c.querySelector('.dep-video');
            if (v) v.pause();
          }
        });
        card.classList.add('playing');
      });

      // Evento de pausa nativo do vídeo: restaura botão play customizado e tag glass
      video.addEventListener('pause', () => {
        card.classList.remove('playing');
        card.classList.remove('touch-active');
      });

      // Evento de término do vídeo: limpa estados e retorna ao fragmento da thumbnail
      video.addEventListener('ended', () => {
        card.classList.remove('playing');
        card.classList.remove('touch-active');
        card.removeAttribute('data-started');
        
        // Retornar para o frame inicial
        const startVal = video.getAttribute('data-start') ? parseFloat(video.getAttribute('data-start')) : 0;
        video.currentTime = startVal;
      });

      // Interceptação de Fullscreen Nativo do elemento de vídeo do card
      video.addEventListener('webkitbeginfullscreen', (e) => {
        e.preventDefault();
        video.webkitExitFullscreen();
        openCellularFullscreen(video);
      });
      video.addEventListener('fullscreenchange', (e) => {
        if (document.fullscreenElement === video) {
          document.exitFullscreen().then(() => {
            openCellularFullscreen(video);
          });
        }
      });

      // Função de controle de reprodução
      function triggerPlay(e) {
        e.stopPropagation();
        if (video.paused) {
          if (!card.hasAttribute('data-started')) {
            const startVal = video.getAttribute('data-start') ? parseFloat(video.getAttribute('data-start')) : 0;
            video.currentTime = startVal;
            card.setAttribute('data-started', 'true');
          }
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }

      if (playBtn) playBtn.addEventListener('click', triggerPlay);
      
      // Permite alternar play/pause ao clicar em qualquer lugar do card (fora dos controles)
      card.addEventListener('click', function(e) {
        if (card.classList.contains('playing') && e.pointerType === 'touch') {
          e.stopPropagation();
          e.preventDefault();
          if (!card.classList.contains('touch-active')) {
            card.classList.add('touch-active');
            // Remove a classe após 3 segundos
            clearTimeout(card.touchTimeout);
            card.touchTimeout = setTimeout(() => {
              card.classList.remove('touch-active');
            }, 3000);
          } else {
            card.classList.remove('touch-active');
            triggerPlay(e);
          }
        } else {
          triggerPlay(e);
        }
      });
    });

    /* ---- touch swipe (somente quando o módulo de navegação estiver disponível) ---- */
    const wrapper = document.querySelector('.testimonials-carousel-track-wrapper');
    const hasCarouselNavigation = typeof goTo === 'function' &&
      typeof updateCardWidth === 'function' &&
      typeof updateDots === 'function' &&
      typeof currentIndex !== 'undefined';

    if (wrapper && hasCarouselNavigation) {
      let startX = 0;
      wrapper.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
      wrapper.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 50) goTo(currentIndex + (dx < 0 ? 1 : -1));
      }, { passive: true });

      wrapper.setAttribute('tabindex', '0');
      wrapper.setAttribute('role', 'region');
      wrapper.setAttribute('aria-label', 'Depoimentos de clientes e parceiros');
      wrapper.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(currentIndex - 1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); goTo(currentIndex + 1); }
      });
    }

    /* ---- resize recalc ---- */
    if (hasCarouselNavigation) {
      window.addEventListener('resize', debounce(() => {
        updateCardWidth();
        updateDots();
        goTo(currentIndex);
      }, 150));

      /* ---- init ---- */
      updateDots();
      setTimeout(() => goTo(0), 300);
    }
  }


  /* ===================================================================
     Linha do Tempo Interativa "Nossa Trajetória"
     =================================================================== */
  function initTrajetoriaTimeline() {
    var data = [
      {
        year: "2015",
        title: "Fundação da ENDCONTROL Engenharia",
        desc: "Fundação em Belém (PA), focada em integridade mecânica, ensaios não destrutivos (ENDs) e inspeções de vasos sob pressão e caldeiras (NR-13).",
        img: "./assets/Fotografias/editadas/operacional-engenheiros-inspecao-bomba-edit.webp"
      },
      {
        year: "2017",
        title: "Expansão para Mineração & Siderurgia",
        desc: "Parcerias estratégicas e consolidação em grandes complexos minerários e de alumina no Pará (Marabá, Paragominas e Carajás).",
        img: "./assets/Fotografias/editadas/ultrassom-raptor-scan-tecnicos-reunidos-campo-edit.webp"
      },
      {
        year: "2019",
        title: "Pioneirismo em RBI e Acesso por Cordas",
        desc: "Implementação da metodologia de Inspeção Baseada em Risco (RBI) e certificação em Acesso por Cordas para auditorias em estruturas de grande altura.",
        img: "./assets/Fotografias/editadas/operacional-alpinismo-inspecao-vaso-pressao-edit.webp"
      },
      {
        year: "2021",
        title: "Consolidação Offshore & Petroquímica",
        desc: "Expansão da atuação para o setor de Óleo & Gás na Bacia de Campos (RJ) e indústrias petroquímicas no Polo de Camaçari (BA).",
        img: "./assets/Fotografias/editadas/operacional-inspecao-ultrassom-casco-estrutura-edit.webp"
      },
      {
        year: "2024",
        title: "Inteligência Artificial & Diagnósticos Preditivos",
        desc: "Integração de modelos de IA e simulação 3D para previsibilidade de integridade, ultrapassando 1.300 equipamentos inspecionados e 800+ projetos concluídos.",
        img: "./assets/Fotografias/editadas/ultrassom-raptor-scan-crawler-operacao-edit.webp"
      }
    ];

    var timelineSec = document.getElementById('linha-tempo');
    if (!timelineSec) return;

    var imgEl = document.getElementById('trajetoria-active-img');
    var yearEl = document.getElementById('trajetoria-active-year');
    var titleEl = document.getElementById('trajetoria-active-title');
    var descEl = document.getElementById('trajetoria-active-desc');
    var nextBtn = document.getElementById('trajetoria-next-arrow-btn');
    var prevBtn = document.getElementById('trajetoria-prev-arrow-btn');
    var progressBar = document.getElementById('trajetoria-track-progress-bar');
    var nodes = document.querySelectorAll('.trajetoria-node');
    var scrollContainer = document.querySelector('.trajetoria-scroll-container');

    if (!imgEl || !yearEl || !titleEl || !descEl || nodes.length === 0) return;

    var currentIndex = 0;

    function updateArrowStates() {
      if (prevBtn) {
        if (currentIndex === 0) {
          prevBtn.classList.add('is-disabled');
        } else {
          prevBtn.classList.remove('is-disabled');
        }
      }
      if (nextBtn) {
        if (currentIndex === data.length - 1) {
          nextBtn.classList.add('is-disabled');
        } else {
          nextBtn.classList.remove('is-disabled');
        }
      }
    }

    function updateTimeline(index, animate) {
      if (index < 0 || index >= data.length) return;
      currentIndex = index;

      var item = data[index];

      // Atualiza nós ativos e completados
      nodes.forEach(function (node, i) {
        if (i === index) {
          node.classList.add('active');
          node.classList.remove('completed');
        } else if (i < index) {
          node.classList.add('completed');
          node.classList.remove('active');
        } else {
          node.classList.remove('active');
          node.classList.remove('completed');
        }
      });

      // Atualiza barra de progresso
      var percentage = (index / (data.length - 1)) * 100;
      if (progressBar) {
        progressBar.style.width = percentage + '%';
      }

      // Atualiza estado visual das setas
      updateArrowStates();

      // Animação de transição
      if (animate) {
        imgEl.classList.add('fade-out');
        yearEl.classList.add('fade-out');
        var detailsContainer = document.querySelector('.trajetoria-event-details');
        if (detailsContainer) {
          detailsContainer.classList.add('fade-out');
        }

        setTimeout(function () {
          imgEl.src = item.img;
          imgEl.alt = item.title;
          yearEl.textContent = item.year;
          titleEl.textContent = item.title;
          descEl.textContent = item.desc;

          imgEl.classList.remove('fade-out');
          yearEl.classList.remove('fade-out');
          if (detailsContainer) {
            detailsContainer.classList.remove('fade-out');
          }
        }, 300);
      } else {
        imgEl.src = item.img;
        imgEl.alt = item.title;
        yearEl.textContent = item.year;
        titleEl.textContent = item.title;
        descEl.textContent = item.desc;
      }

      // Scroll mobile para centralizar nó ativo
      if (window.innerWidth <= 768 && scrollContainer) {
        var activeNode = nodes[index];
        if (activeNode) {
          var containerWidth = scrollContainer.offsetWidth;
          var nodeLeft = activeNode.offsetLeft;
          var nodeWidth = activeNode.offsetWidth;
          scrollContainer.scrollTo({
            left: nodeLeft - (containerWidth / 2) + (nodeWidth / 2),
            behavior: 'smooth'
          });
        }
      }
    }

    // Clique nos nós da timeline
    nodes.forEach(function (node, i) {
      node.addEventListener('click', function () {
        if (currentIndex !== i) {
          updateTimeline(i, true);
        }
      });
    });

    // Botão avançar (Next) - não é carrossel infinito
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        var nextIndex = currentIndex + 1;
        if (nextIndex < data.length) {
          updateTimeline(nextIndex, true);
        }
      });
    }

    // Botão voltar (Prev) - não é carrossel infinito
    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        var prevIndex = currentIndex - 1;
        if (prevIndex >= 0) {
          updateTimeline(prevIndex, true);
        }
      });
    }

    // Gestos Swipe para navegar na timeline pelo mobile (arrastando a seção)
    var contentWrapper = document.querySelector('.trajetoria-content-wrapper');
    if (contentWrapper) {
      var touchStartX = 0;
      var touchStartY = 0;

      contentWrapper.addEventListener('touchstart', function (e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }, { passive: true });

      contentWrapper.addEventListener('touchend', function (e) {
        if (!touchStartX) return;
        var dx = e.changedTouches[0].clientX - touchStartX;
        var dy = e.changedTouches[0].clientY - touchStartY;

        // Verifica se o movimento foi predominantemente horizontal e longo o suficiente
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
          if (dx < 0) {
            // Swipe esquerda -> avançar ano
            var nextIndex = currentIndex + 1;
            if (nextIndex < data.length) {
              updateTimeline(nextIndex, true);
            }
          } else {
            // Swipe direita -> voltar ano
            var prevIndex = currentIndex - 1;
            if (prevIndex >= 0) {
              updateTimeline(prevIndex, true);
            }
          }
        }
        touchStartX = 0;
        touchStartY = 0;
      }, { passive: true });
    }

    updateTimeline(0, false);
  }

  /* ===================================================================
     High-Performance Scroll Highlights Handler (Values + Metrics + Neon Cards)
     =================================================================== */
  function initMobileScrollHighlights() {
    var isMobile = window.innerWidth <= 680;

    // 1. Value blocks (Mobile only) - IntersectionObserver
    var valueBlocks = document.querySelectorAll('.about-premium-dark-section .value-block');
    if (valueBlocks.length > 0 && isMobile) {
      var valueObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          entry.target.classList.toggle('active', entry.isIntersecting);
        });
      }, {
        rootMargin: '0px 0px -40% 0px' // Threshold at 60% of viewport
      });
      valueBlocks.forEach(function (block) {
        valueObserver.observe(block);
      });
    }

    // 2. Metric cards (Desktop & Mobile) - IntersectionObserver
    var metricCards = document.querySelectorAll('.about-metrics-grid .metric-card');
    if (metricCards.length > 0) {
      var metricObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          entry.target.classList.toggle('active', entry.isIntersecting);
        });
      }, {
        rootMargin: '0px 0px -30% 0px' // Threshold at 70% of viewport
      });
      metricCards.forEach(function (card) {
        metricObserver.observe(card);
      });
    }

    // 3. Neon cards (Missão, Visão, Valores) - Gated Scroll on Mobile / Observer on Desktop
    var neonCards = document.querySelectorAll('#diretrizes .neon-card');
    var diretrizesSection = document.getElementById('diretrizes');

    if (neonCards.length > 0 && diretrizesSection) {
      if (isMobile) {
        var isSectionVisible = false;
        var ticking = false;

        function handleNeonScroll() {
          var viewportHeight = window.innerHeight;
          var closestCard = null;
          var minDistance = Infinity;
          var viewportCenter = viewportHeight * 0.50;

          neonCards.forEach(function (card) {
            var rect = card.getBoundingClientRect();
            var cardCenter = rect.top + rect.height / 2;
            var distance = Math.abs(cardCenter - viewportCenter);

            if (rect.bottom > 0 && rect.top < viewportHeight) {
              if (distance < minDistance) {
                minDistance = distance;
                closestCard = card;
              }
            }
          });

          neonCards.forEach(function (card) {
            if (card === closestCard) {
              card.classList.add('active');
            } else {
              card.classList.remove('active');
            }
          });
        }

        function onScrollTick() {
          if (!ticking) {
            window.requestAnimationFrame(function () {
              handleNeonScroll();
              ticking = false;
            });
            ticking = true;
          }
        }

        var sectionObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              if (!isSectionVisible) {
                isSectionVisible = true;
                window.addEventListener('scroll', onScrollTick, { passive: true });
                handleNeonScroll();
              }
            } else {
              if (isSectionVisible) {
                isSectionVisible = false;
                window.removeEventListener('scroll', onScrollTick);
                neonCards.forEach(function (card) {
                  card.classList.remove('active');
                });
              }
            }
          });
        }, {
          rootMargin: '100px 0px 100px 0px'
        });

        sectionObserver.observe(diretrizesSection);
      } else {
        var neonObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            entry.target.classList.toggle('active', entry.isIntersecting);
          });
        }, {
          rootMargin: '0px 0px -25% 0px'
        });
        neonCards.forEach(function (card) {
          neonObserver.observe(card);
        });
      }
    }
  }

  /* ===================================================================
     Hero Background Photo Slideshow (Arrow Navigation + Auto-Play)
     =================================================================== */
  function initHeroSlider() {
    var sliderContainer = document.querySelector('.hero-bg-slider');
    if (!sliderContainer) return;

    var photos = sliderContainer.querySelectorAll('.hero-bg-photo');
    if (photos.length < 2) return;

    var prevBtn = document.getElementById('heroArrowPrev');
    var nextBtn = document.getElementById('heroArrowNext');

    var currentIndex = 0;
    var slideInterval = null;
    var transitionTimeout = null;
    var INTERVAL_TIME = 5000; // 5 segundos por fotografia

    // Pre-carregar imagens para transição fluida
    photos.forEach(function (img) {
      if (img.src) {
        var temp = new Image();
        temp.src = img.src;
      }
    });

    function goToSlide(index) {
      if (index === currentIndex) return;
      var prevPhoto = photos[currentIndex];
      currentIndex = (index + photos.length) % photos.length;
      var nextPhoto = photos[currentIndex];

      if (transitionTimeout) {
        clearTimeout(transitionTimeout);
      }

      // Garante limpeza prévia de prev-active
      photos.forEach(function (p) {
        p.classList.remove('prev-active');
      });

      // Foto anterior mantida visível por baixo durante a transição
      prevPhoto.classList.remove('active');
      prevPhoto.classList.add('prev-active');

      // Nova foto entra por cima com fade suave
      nextPhoto.classList.add('active');

      // Remove prev-active após a transição de 1.6s
      transitionTimeout = setTimeout(function () {
        prevPhoto.classList.remove('prev-active');
      }, 1600);
    }

    function nextSlide() {
      goToSlide(currentIndex + 1);
    }

    function prevSlide() {
      goToSlide(currentIndex - 1);
    }

    function startTimer() {
      stopTimer();
      slideInterval = setInterval(nextSlide, INTERVAL_TIME);
    }

    function stopTimer() {
      if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
      }
    }

    function resetTimer() {
      startTimer();
    }

    // Eventos Exclusivos dos Botões de Seta
    if (prevBtn) {
      prevBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        prevSlide();
        resetTimer();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        nextSlide();
        resetTimer();
      });
    }

    // Pausar transição quando a aba estiver em segundo plano para economia de memória
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        stopTimer();
      } else {
        startTimer();
      }
    });

    startTimer();
  }

  /* ===================================================================
     Navegação Manual por Setas (Setores que Atendemos)
     =================================================================== */
  function initSectorsMarquee() {
    const track = document.querySelector('.sectors-marquee-track');
    const btnUp = document.getElementById('sectorsNavUp');
    const btnDown = document.getElementById('sectorsNavDown');
    const cardPanel = document.querySelector('.info-card-panel--marquee');

    if (!track) return;

    function getCurrentY() {
      const style = window.getComputedStyle(track);
      const matrix = new WebKitCSSMatrix(style.transform);
      return matrix.m42 || 0;
    }

    if (btnUp) {
      btnUp.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const currentY = getCurrentY();
        track.style.animation = 'none';
        let newY = currentY + 34;
        if (newY > 0) newY = -(track.scrollHeight / 2);
        track.style.transform = `translateY(${newY}px)`;
      });
    }

    if (btnDown) {
      btnDown.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const currentY = getCurrentY();
        track.style.animation = 'none';
        let newY = currentY - 34;
        if (Math.abs(newY) >= track.scrollHeight / 2) newY = 0;
        track.style.transform = `translateY(${newY}px)`;
      });
    }

    if (cardPanel) {
      cardPanel.addEventListener('mouseleave', function () {
        if (track.style.animation === 'none') {
          track.style.animation = 'sectorsScrollUp 24s linear infinite';
        }
      });
    }
  }

  /* ===================================================================
     Bootstrap
     =================================================================== */
  document.addEventListener('DOMContentLoaded', function () {
    initMenu();
    initHeaderScroll();
    initCursorGlow();
    initSectionSpotlights();
    initFAQ();
    initLeadForm();
    initRevealAnimation();
    initModals();
    initTestimonialsCarousel();
    initTrajetoriaTimeline();
    initMobileScrollHighlights();
    initHeroSlider();
    initSectorsMarquee();
  });
})();
