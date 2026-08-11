/* ==========================================================================
   Interatividade do Mapa e Painel de Presença Nacional — ENDCONTROL
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar Lucide se existir
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  const regions = {
    norte: true,
    nordeste: true,
    "centro-oeste": true,
    sudeste: true,
    sul: true
  };

  const regionsOrder = ["norte", "nordeste", "centro-oeste", "sudeste", "sul"];
  let currentIndex = 0;
  let rotationInterval = null;
  let resumeTimeout = null;
  let isPaused = false;

  const regionItems = document.querySelectorAll('.panel-card-list li[data-region]');

  // --- Função: Ativar uma Região ---
  function activateRegion(regionKey) {
    if (!regionKey || !regions[regionKey]) return;

    // Resetar todos os itens da lista
    regionItems.forEach(item => {
      item.classList.remove('active');
      item.setAttribute('aria-expanded', 'false');
    });

    // Ativar o item de menu correspondente
    const activeItem = document.querySelector(`.panel-card-list li[data-region="${regionKey}"]`);
    if (activeItem) {
      activeItem.classList.add('active');
      activeItem.setAttribute('aria-expanded', 'true');
    }

    // Atualizar classe ativa nas linhas de conexão
    document.querySelectorAll('.connection-line').forEach(line => {
      line.classList.remove('active');
    });
    const activeLine = document.getElementById(`line-${regionKey}`);
    if (activeLine) {
      activeLine.classList.add('active');
    }

    // Atualizar classe ativa nas âncoras do mapa
    document.querySelectorAll('.map-anchor').forEach(anchor => {
      anchor.classList.remove('active');
    });
    const activeAnchor = document.getElementById(`anchor-${regionKey}`);
    if (activeAnchor) {
      activeAnchor.classList.add('active');
    }

    // Atualizar os overlays de spotlight e glow no mapa
    const mapWrapper = document.querySelector('.map-wrapper-light');
    const glowOverlay = document.querySelector('.map-glow-overlay');
    
    if (activeAnchor && mapWrapper && glowOverlay) {
      const topPct = activeAnchor.style.top;
      const leftPct = activeAnchor.style.left;
      
      mapWrapper.style.setProperty('--spotlight-x', leftPct);
      mapWrapper.style.setProperty('--spotlight-y', topPct);
      glowOverlay.style.setProperty('--spotlight-x', leftPct);
      glowOverlay.style.setProperty('--spotlight-y', topPct);
      
      mapWrapper.classList.add('has-active-region');
      glowOverlay.classList.add('active');
    } else if (mapWrapper && glowOverlay) {
      mapWrapper.classList.remove('has-active-region');
      glowOverlay.classList.remove('active');
    }

    // Atualizar index de rotação
    currentIndex = regionsOrder.indexOf(regionKey);

    // Reposicionar as curvas
    setTimeout(updateConnectionLines, 50);
  }

  // --- Função: Rotação Automática ---
  function startRotation() {
    if (isPaused) return;
    clearInterval(rotationInterval);
    
    rotationInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % regionsOrder.length;
      const nextRegion = regionsOrder[currentIndex];
      activateRegion(nextRegion);
    }, 5000);
  }

  function pauseRotation() {
    isPaused = true;
    clearInterval(rotationInterval);
    clearTimeout(resumeTimeout);
    
    // Retomar rotação após 15 segundos sem interações
    resumeTimeout = setTimeout(() => {
      isPaused = false;
      startRotation();
    }, 15000);
  }

  // --- Ouvintes de Eventos: Cliques e Hover nos Itens de Região ---
  regionItems.forEach(item => {
    const region = item.getAttribute('data-region');
    
    item.addEventListener('click', () => {
      activateRegion(region);
      pauseRotation();
    });

    item.addEventListener('mouseenter', () => {
      activateRegion(region);
      pauseRotation();
    });
  });

  // --- Ouvintes de Eventos: Cliques e Hover nas Âncoras do Mapa ---
  const mapAnchors = document.querySelectorAll('.map-anchor');
  mapAnchors.forEach(anchor => {
    const region = anchor.getAttribute('data-region') || anchor.id.replace('anchor-', '');
    
    anchor.addEventListener('click', () => {
      activateRegion(region);
      pauseRotation();
    });
    
    anchor.addEventListener('mouseenter', () => {
      activateRegion(region);
      pauseRotation();
    });
  });

  // --- Funções Auxiliares: Linhas de Conexão ---
  const connectionLinesSvg = document.querySelector('.connection-lines-svg');

  function updateConnectionLines() {
    if (!connectionLinesSvg || window.innerWidth < 992) {
      if (connectionLinesSvg) connectionLinesSvg.style.display = 'none';
      return;
    } else {
      connectionLinesSvg.style.display = 'block';
    }

    const grid = document.querySelector('.presenca-light-grid');
    if (!grid) return;
    const containerRect = grid.getBoundingClientRect();

    const regionDotSources = {
      norte: '#anchor-norte',
      nordeste: '#anchor-nordeste',
      "centro-oeste": '#anchor-centro-oeste',
      sudeste: '#anchor-sudeste',
      sul: '#anchor-sul'
    };

    Object.entries(regionDotSources).forEach(([regionKey, selector]) => {
      const line = document.getElementById(`line-${regionKey}`);
      if (!line) return;

      const listItem = document.querySelector(`.panel-card-list li[data-region="${regionKey}"]`);
      if (!listItem) return;

      const marker = listItem.querySelector('.region-marker');
      if (!marker) return;

      const startEl = document.querySelector(selector);
      if (!startEl) return;

      // Calcular coordenadas relativas ao grid
      const startPoint = getElementCenterRelativeTo(startEl, containerRect);
      const endPoint = getElementLeftEdgeRelativeTo(marker, containerRect);

      const startX = startPoint.x;
      const startY = startPoint.y;
      const endX = endPoint.x;
      const endY = endPoint.y;

      const dx = endX - startX;
      // Desenhar curva Bezier cúbica (curva S horizontal)
      const cp1x = startX + dx * 0.45;
      const cp1y = startY;
      const cp2x = startX + dx * 0.55;
      const cp2y = endY;

      const d = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;
      line.setAttribute('d', d);
    });
  }

  function getElementCenterRelativeTo(element, containerRect) {
    const rect = element.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2 - containerRect.left,
      y: rect.top + rect.height / 2 - containerRect.top
    };
  }

  // Retorna a borda esquerda do marcador de rádio para conectar a linha
  function getElementLeftEdgeRelativeTo(element, containerRect) {
    const rect = element.getBoundingClientRect();
    return {
      x: rect.left - containerRect.left,
      y: rect.top + rect.height / 2 - containerRect.top
    };
  }

  // --- Ouvinte de Redimensionamento ---
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateConnectionLines, 100);
  });

  // --- Inicialização ---
  // Ativar primeira região padrão (norte)
  activateRegion("norte");
  
  // Iniciar ciclo de rotação
  startRotation();

  // Primeira renderização das curvas de conexão
  setTimeout(updateConnectionLines, 200);
});
