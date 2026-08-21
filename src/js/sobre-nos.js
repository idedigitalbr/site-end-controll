/**
 * ==========================================================================
 * ENDCONTROL ENGENHARIA — SOBRE NÓS JAVASCRIPT
 * Interatividades, Lightbox de Galeria, Modal de Vídeo e Animações
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', function () {
  function initCanonicalSolutionsMenu() {
    document.querySelectorAll('.dropdown-rich-menu .dropdown-item-text, .dropdown-rich-menu .submenuzinho-item span:not(.submenuzinho-bullet)').forEach(function (label) {
      label.textContent = label.textContent.replace(/^\s*\d+\.\s*/, '');
    });
  }

  initCanonicalSolutionsMenu();

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

  // 2. PLAYER DE VÍDEO INSTITUCIONAL CUSTOMIZADO (INLINE COM CONTROLES & AUTO-HIDE)
  const videoBox = document.getElementById('snVideoBox');
  const inlinePlayer = document.getElementById('snInlineVideoPlayer');
  const btnPlayPause = document.getElementById('snBtnPlayPause');
  const btnMute = document.getElementById('snBtnMute');
  const btnFullscreen = document.getElementById('snBtnFullscreen');
  const timeDisplay = document.getElementById('snTimeDisplay');
  const progressContainer = document.getElementById('snProgressContainer');
  const progressBar = document.getElementById('snProgressBar');

  let idleTimer = null;

  // Formatar segundos em mm:ss
  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
  }

  // Atualizar botões de Play / Pause
  function updatePlayPauseIcons() {
    if (!inlinePlayer || !btnPlayPause) return;
    const iconPause = btnPlayPause.querySelector('.icon-pause');
    const iconPlay = btnPlayPause.querySelector('.icon-play');
    if (inlinePlayer.paused) {
      if (iconPause) iconPause.style.display = 'none';
      if (iconPlay) iconPlay.style.display = 'block';
    } else {
      if (iconPause) iconPause.style.display = 'block';
      if (iconPlay) iconPlay.style.display = 'none';
    }
  }

  // Atualizar botões de Mute / Unmute
  function updateMuteIcons() {
    if (!inlinePlayer || !btnMute) return;
    const iconMuted = btnMute.querySelector('.icon-muted');
    const iconUnmuted = btnMute.querySelector('.icon-unmuted');
    if (inlinePlayer.muted || inlinePlayer.volume === 0) {
      if (iconMuted) iconMuted.style.display = 'block';
      if (iconUnmuted) iconUnmuted.style.display = 'none';
    } else {
      if (iconMuted) iconMuted.style.display = 'none';
      if (iconUnmuted) iconUnmuted.style.display = 'block';
    }
  }

  // Gerenciador de Inatividade (Esconde os controles após 2.5 segundos sem movimento)
  function showControlsTemporarily() {
    if (!videoBox) return;
    videoBox.classList.remove('sn-player-idle');
    clearTimeout(idleTimer);

    // Se o vídeo estiver pausado, mantém os controles visíveis
    if (inlinePlayer && inlinePlayer.paused) return;

    idleTimer = setTimeout(function () {
      videoBox.classList.add('sn-player-idle');
    }, 2500);
  }

  if (inlinePlayer && videoBox) {
    // 1. Iniciar autoplay seguro com mute e mostrar controles iniciais
    inlinePlayer.play().then(function() {
      updatePlayPauseIcons();
      showControlsTemporarily();
    }).catch(function() {
      updatePlayPauseIcons();
    });

    // 2. Movimentação do mouse e toque para exibir/ocultar barra
    videoBox.addEventListener('mousemove', showControlsTemporarily);
    videoBox.addEventListener('mouseenter', showControlsTemporarily);
    videoBox.addEventListener('touchstart', showControlsTemporarily, { passive: true });
    videoBox.addEventListener('mouseleave', function () {
      if (inlinePlayer && !inlinePlayer.paused) {
        videoBox.classList.add('sn-player-idle');
      }
    });

    // 3. Clique no player para alternar Play/Pause
    btnPlayPause.addEventListener('click', function (e) {
      e.stopPropagation();
      if (inlinePlayer.paused) {
        inlinePlayer.play();
      } else {
        inlinePlayer.pause();
      }
      updatePlayPauseIcons();
      showControlsTemporarily();
    });

    // Clique direto no corpo do vídeo
    inlinePlayer.addEventListener('click', function () {
      if (inlinePlayer.paused) {
        inlinePlayer.play();
      } else {
        inlinePlayer.pause();
      }
      updatePlayPauseIcons();
      showControlsTemporarily();
    });

    inlinePlayer.addEventListener('play', updatePlayPauseIcons);
    inlinePlayer.addEventListener('pause', updatePlayPauseIcons);

    // 4. Mute / Unmute
    btnMute.addEventListener('click', function (e) {
      e.stopPropagation();
      inlinePlayer.muted = !inlinePlayer.muted;
      if (!inlinePlayer.muted && inlinePlayer.volume === 0) {
        inlinePlayer.volume = 1;
      }
      updateMuteIcons();
      showControlsTemporarily();
    });

    // 5. Atualização da Barra de Progresso e Tempo
    inlinePlayer.addEventListener('timeupdate', function () {
      if (!isNaN(inlinePlayer.duration) && inlinePlayer.duration > 0) {
        const percent = (inlinePlayer.currentTime / inlinePlayer.duration) * 100;
        if (progressBar) progressBar.style.width = percent + '%';
        if (timeDisplay) {
          timeDisplay.textContent = formatTime(inlinePlayer.currentTime) + ' / ' + formatTime(inlinePlayer.duration);
        }
      }
    });

    inlinePlayer.addEventListener('loadedmetadata', function () {
      if (timeDisplay && inlinePlayer.duration) {
        timeDisplay.textContent = formatTime(inlinePlayer.currentTime) + ' / ' + formatTime(inlinePlayer.duration);
      }
    });

    // 6. Clique na barra de progresso para avançar / retroceder
    if (progressContainer) {
      progressContainer.addEventListener('click', function (e) {
        e.stopPropagation();
        const rect = progressContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        if (width > 0 && !isNaN(inlinePlayer.duration)) {
          const seekTime = (clickX / width) * inlinePlayer.duration;
          inlinePlayer.currentTime = seekTime;
          showControlsTemporarily();
        }
      });
    }

    // 7. Fullscreen nativo no container do player
    if (btnFullscreen) {
      btnFullscreen.addEventListener('click', function (e) {
        e.stopPropagation();
        if (!document.fullscreenElement) {
          if (videoBox.requestFullscreen) {
            videoBox.requestFullscreen();
          } else if (videoBox.webkitRequestFullscreen) {
            videoBox.webkitRequestFullscreen();
          } else if (inlinePlayer.webkitEnterFullscreen) {
            inlinePlayer.webkitEnterFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          }
        }
        showControlsTemporarily();
      });
    }
  }

  // 3. INTERATIVIDADE DA TIMELINE (CLIQUE NOS NÓS)
  const timelineItems = document.querySelectorAll('.sn-timeline-item');
  timelineItems.forEach(function (item) {
    item.addEventListener('click', function () {
      timelineItems.forEach(function (i) { i.classList.remove('active'); });
      item.classList.add('active');
    });
  });

  // 4. ANIMAÇÕES SUAVES DE ENTRADA (INTERSECTION OBSERVER)
  if ('IntersectionObserver' in window) {
    const revealElements = document.querySelectorAll(
      '.sn-essence-card, .sn-indicator-item, .sn-process-step-item, .sn-commitment-card'
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
