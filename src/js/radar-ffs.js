/**
 * ============================================================================
 * RADAR FFS STANDALONE (FITNESS-FOR-SERVICE)
 * - Ciclo automático contínuo: a linha de radar varre e acende o ícone na chegada
 * - Ativação no clique: mover a linha e ativar o ícone clicado
 * - Hover: apenas efeito visual de brilho 100% no ícone, sem alterar o radar ativo
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const ffsRadarWrapper = document.getElementById('ffsRadarWrapper');
  if (!ffsRadarWrapper) return;

  const ffsNodesLayer = document.getElementById('ffsNodesLayer');
  const ffsConnectionsLayer = document.getElementById('ffsConnectionsLayer');
  const ffsRadarSweep = document.getElementById('ffsRadarSweep');

  const ffsMechanisms = [
    {
      id: 'brittle-fracture',
      label: 'Brittle<br>Fracture',
      angle: -90,      // 12:00
      sweepAngle: 0,
      labelPos: 'top',
      iconSvg: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2v6l3 2-4 4 3 2-2 6" />
          <path d="M5 8l4 2-1 4" />
          <path d="M19 14l-4-1 1-3" />
        </svg>
      `
    },
    {
      id: 'general-metal-loss',
      label: 'General<br>Metal Loss',
      angle: -60,      // 1:00
      sweepAngle: 30,
      labelPos: 'top-right',
      iconSvg: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="2" fill="currentColor"/>
          <circle cx="12" cy="6" r="1.5" fill="currentColor"/>
          <circle cx="12" cy="18" r="1.5" fill="currentColor"/>
          <circle cx="6" cy="12" r="1.5" fill="currentColor"/>
          <circle cx="18" cy="12" r="1.5" fill="currentColor"/>
          <circle cx="7.75" cy="7.75" r="1.2" fill="currentColor"/>
          <circle cx="16.25" cy="7.75" r="1.2" fill="currentColor"/>
          <circle cx="7.75" cy="16.25" r="1.2" fill="currentColor"/>
          <circle cx="16.25" cy="16.25" r="1.2" fill="currentColor"/>
        </svg>
      `
    },
    {
      id: 'local-metal-loss',
      label: 'Local<br>Metal Loss',
      angle: -30,      // 2:00
      sweepAngle: 60,
      labelPos: 'right',
      iconSvg: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 6h18" />
          <path d="M3 18h18" />
          <path d="M3 12h5c1.5 0 2 4 4 4s2.5-4 4-4h5" />
        </svg>
      `
    },
    {
      id: 'pitting-corrosion',
      label: 'Pitting<br>Corrosion',
      angle: 0,        // 3:00
      sweepAngle: 90,
      labelPos: 'right',
      iconSvg: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          <path d="M15 13a3 3 0 1 1-6 0" />
        </svg>
      `
    },
    {
      id: 'hydrogen-damage',
      label: 'Hydrogen Blisters<br>& Damages',
      angle: 30,       // 4:00
      sweepAngle: 120,
      labelPos: 'right',
      iconSvg: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 6v12M12 6v12M4 12h8" />
          <path d="M17 14.5c.8-.7 1.5-1.2 2-1.5.5-.3 1-.3 1.5 0 .5.3.7.8.7 1.4 0 .8-.5 1.5-1.2 2.1L16 20h6" stroke-width="1.8" />
        </svg>
      `
    },
    {
      id: 'weld-misalignment',
      label: 'Weld (Misalignment<br>& Distortion)',
      angle: 60,       // 5:00
      sweepAngle: 150,
      labelPos: 'bottom-right',
      iconSvg: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 8h7v8h11" />
          <path d="M3 16h5" />
          <path d="M16 8h5" />
          <path d="M10 6v12" stroke-dasharray="2 2" />
        </svg>
      `
    },
    {
      id: 'crack-like-flaws',
      label: 'Crack-like<br>Flaws',
      angle: 90,       // 6:00
      sweepAngle: 180,
      labelPos: 'bottom',
      iconSvg: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 3l-3 7 5 3-4 8" />
          <path d="M14 13l5-2 2 3" />
          <path d="M9 10l-5-2-1 4" />
        </svg>
      `
    },
    {
      id: 'creep',
      label: 'Creep',
      angle: 120,      // 7:00
      sweepAngle: 210,
      labelPos: 'bottom-left',
      iconSvg: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 19c4 1.5 12 1.5 16 0" />
          <path d="M8 15c-1-3 1-5 0-8" />
          <path d="M12 15c-1-3 1-5 0-8" />
          <path d="M16 15c-1-3 1-5 0-8" />
        </svg>
      `
    },
    {
      id: 'fire-damage',
      label: 'Fire<br>Damage',
      angle: 150,      // 8:00
      sweepAngle: 240,
      labelPos: 'left',
      iconSvg: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z" />
        </svg>
      `
    },
    {
      id: 'dents-gouges',
      label: 'Dents and<br>Gouges',
      angle: 180,      // 9:00
      sweepAngle: 270,
      labelPos: 'left',
      iconSvg: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 8h4c2 0 3 8 5 8s3-8 5-8h4" />
        </svg>
      `
    },
    {
      id: 'lamination-damage',
      label: 'Lamination<br>Damage',
      angle: 210,      // 10:00
      sweepAngle: 300,
      labelPos: 'left',
      iconSvg: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 6h18M3 12h18M3 18h18" />
          <path d="M8 9l3 3-3 3" stroke-width="1.5" />
        </svg>
      `
    },
    {
      id: 'fatigue-damage',
      label: 'Fatigue<br>Damage',
      angle: 240,      // 11:00
      sweepAngle: 330,
      labelPos: 'top-left',
      iconSvg: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M2 12h4l2.5-6 4 12 3.5-9 2 4 2-1h2" />
        </svg>
      `
    }
  ];

  function normalizeAngle(angle) {
    const numericAngle = Number(angle) || 0;
    return ((numericAngle % 360) + 360) % 360;
  }

  function getForwardAngle(fromAngle, targetAngle) {
    const start = Number(fromAngle) || 0;
    let target = normalizeAngle(targetAngle);
    while (target <= start + 0.001) {
      target += 360;
    }
    return target;
  }

  function getBackwardAngle(fromAngle, targetAngle) {
    const start = Number(fromAngle) || 0;
    let target = normalizeAngle(targetAngle);
    while (target >= start - 0.001) {
      target -= 360;
    }
    return target;
  }

  function getNearestAngle(fromAngle, targetAngle) {
    const start = Number(fromAngle) || 0;
    const target = normalizeAngle(targetAngle);
    return target + Math.round((start - target) / 360) * 360;
  }

  let activeIndex = 0;
  let currentSweepAngle = 0;
  let sweepAnimation = null;
  let autoCycleTimer = null;
  let clickPauseTimer = null;

  const nodesElements = [];
  const linesElements = [];
  const arcElements = [];

  function pauseAutoPlay(ms = 6000) {
    clearTimeout(autoCycleTimer);
    clearTimeout(clickPauseTimer);
    clickPauseTimer = setTimeout(() => {
      scheduleNextSweep();
    }, ms);
  }

  function setSweepAngle(angle) {
    currentSweepAngle = Number(angle) || 0;
    if (ffsRadarSweep) {
      ffsRadarSweep.style.transform = `rotate(${currentSweepAngle}deg)`;
    }
  }

  function readRenderedSweepAngle() {
    if (!ffsRadarSweep) return currentSweepAngle;
    const transform = window.getComputedStyle(ffsRadarSweep).transform;
    if (!transform || transform === 'none') return currentSweepAngle;

    try {
      const matrix = new DOMMatrixReadOnly(transform);
      let angle = Math.atan2(matrix.b, matrix.a) * 180 / Math.PI;
      if (angle < 0) angle += 360;

      let normalized = angle;
      while (normalized - (currentSweepAngle % 360) > 180) normalized -= 360;
      while (normalized - (currentSweepAngle % 360) < -180) normalized += 360;
      return currentSweepAngle + (normalized - (currentSweepAngle % 360));
    } catch (e) {
      return currentSweepAngle;
    }
  }

  function stopSweepAtCurrentPosition() {
    if (!sweepAnimation) return;
    const renderedAngle = readRenderedSweepAngle();
    const animToCancel = sweepAnimation;
    sweepAnimation = null;
    animToCancel.cancel();
    setSweepAngle(renderedAngle);
  }

  function updateVisualStates(targetIndex) {
    activeIndex = (targetIndex + ffsMechanisms.length) % ffsMechanisms.length;

    // 1. Atualiza Nós
    nodesElements.forEach((node, idx) => {
      node.classList.remove('is-active', 'is-completed', 'is-inactive');

      if (idx === activeIndex) {
        node.classList.add('is-active');
        node.setAttribute('aria-current', 'true');
      } else if (idx < activeIndex) {
        node.classList.add('is-completed');
        node.removeAttribute('aria-current');
      } else {
        node.classList.add('is-inactive');
        node.removeAttribute('aria-current');
      }
    });

    // 2. Atualiza Linhas Radiais
    linesElements.forEach((line, idx) => {
      line.classList.remove('is-active', 'is-completed', 'is-inactive');

      if (idx === activeIndex) {
        line.classList.add('is-active');
      } else if (idx < activeIndex) {
        line.classList.add('is-completed');
      } else {
        line.classList.add('is-inactive');
      }
    });

    // 3. Atualiza Arcos Orbitais
    arcElements.forEach((arc, idx) => {
      arc.classList.remove('is-active', 'is-completed', 'is-inactive');

      if (idx === activeIndex) {
        arc.classList.add('is-active');
      } else if (idx < activeIndex) {
        arc.classList.add('is-completed');
      } else {
        arc.classList.add('is-inactive');
      }
    });
  }

  function commitNode(index) {
    updateVisualStates(index);
    scheduleNextSweep();
  }

  function scheduleNextSweep() {
    clearTimeout(autoCycleTimer);
    autoCycleTimer = setTimeout(() => {
      const nextIndex = (activeIndex + 1) % ffsMechanisms.length;
      moveSweepTo(nextIndex, 'forward');
    }, 2200); // 2.2s de leitura no nó ativo
  }

  function moveSweepTo(targetIndex, direction = 'forward') {
    if (targetIndex < 0 || targetIndex >= ffsMechanisms.length) return;

    clearTimeout(autoCycleTimer);
    stopSweepAtCurrentPosition();

    const targetSweepAngle = ffsMechanisms[targetIndex].sweepAngle;
    const fromAngle = currentSweepAngle;
    let toAngle;

    if (direction === 'forward') {
      toAngle = getForwardAngle(fromAngle, targetSweepAngle);
    } else if (direction === 'backward') {
      toAngle = getBackwardAngle(fromAngle, targetSweepAngle);
    } else {
      toAngle = getNearestAngle(fromAngle, targetSweepAngle);
    }

    if (!ffsRadarSweep) {
      setSweepAngle(toAngle);
      commitNode(targetIndex);
      return;
    }

    const angleDistance = Math.abs(toAngle - fromAngle);
    const duration = Math.max(350, Math.min(850, angleDistance * 8.5));

    sweepAnimation = ffsRadarSweep.animate(
      [
        { transform: `rotate(${fromAngle}deg)` },
        { transform: `rotate(${toAngle}deg)` }
      ],
      {
        duration: duration,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
        fill: 'forwards'
      }
    );

    sweepAnimation.onfinish = () => {
      const finishedAnim = sweepAnimation;
      sweepAnimation = null;
      setSweepAngle(toAngle);
      finishedAnim?.cancel();
      // NO MOMENTO EXATO QUE A LINHA CHEGA NO ÍCONE, ELE ACENDE!
      commitNode(targetIndex);
    };
  }

  function buildFFSRadar() {
    if (!ffsNodesLayer || !ffsConnectionsLayer) return;

    ffsNodesLayer.innerHTML = '';
    ffsConnectionsLayer.innerHTML = '';
    nodesElements.length = 0;
    linesElements.length = 0;
    arcElements.length = 0;

    const width = ffsRadarWrapper.clientWidth || 560;
    const height = ffsRadarWrapper.clientHeight || 560;
    const centerX = width / 2;
    const centerY = height / 2;

    let orbitRadius = 240;
    if (width <= 480) {
      orbitRadius = 170;
    } else if (width <= 600) {
      orbitRadius = 210;
    }

    const svgCanvas = document.getElementById('ffsRadarCanvas');
    if (svgCanvas) {
      svgCanvas.setAttribute('viewBox', `0 0 ${width} ${height}`);
    }

    const nodeCoords = ffsMechanisms.map(item => {
      const rad = (item.angle * Math.PI) / 180;
      return {
        id: item.id,
        x: centerX + orbitRadius * Math.cos(rad),
        y: centerY + orbitRadius * Math.sin(rad),
        angle: item.angle
      };
    });

    // 1. Cria arcos orbitais
    for (let i = 0; i < nodeCoords.length; i++) {
      const nextIdx = (i + 1) % nodeCoords.length;
      const startAngleRad = (nodeCoords[i].angle * Math.PI) / 180;
      const endAngleRad = (nodeCoords[nextIdx].angle * Math.PI) / 180;

      const p1X = centerX + orbitRadius * Math.cos(startAngleRad);
      const p1Y = centerY + orbitRadius * Math.sin(startAngleRad);
      const p2X = centerX + orbitRadius * Math.cos(endAngleRad);
      const p2Y = centerY + orbitRadius * Math.sin(endAngleRad);

      const arc = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const d = `M ${p1X} ${p1Y} A ${orbitRadius} ${orbitRadius} 0 0 1 ${p2X} ${p2Y}`;
      arc.setAttribute('d', d);
      arc.setAttribute('class', 'ffs-orbit-arc is-inactive');
      arc.setAttribute('id', `ffs-arc-${i}`);
      ffsConnectionsLayer.appendChild(arc);
      arcElements.push(arc);
    }

    // 2. Cria pontos de conexão e nós
    ffsMechanisms.forEach((item, index) => {
      const coord = nodeCoords[index];

      // Ponto de conexão na órbita
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', coord.x);
      dot.setAttribute('cy', coord.y);
      dot.setAttribute('r', '2.5');
      dot.setAttribute('fill', '#00C2FF');
      dot.setAttribute('filter', 'drop-shadow(0 0 3px #00C2FF)');
      dot.setAttribute('opacity', '0.7');
      ffsConnectionsLayer.appendChild(dot);

      // Elemento do Nó
      const nodeElem = document.createElement('div');
      nodeElem.className = `ffs-radar-node is-inactive ffs-label-pos-${item.labelPos}`;
      nodeElem.setAttribute('data-id', item.id);
      nodeElem.setAttribute('data-index', index);
      nodeElem.style.left = `${coord.x}px`;
      nodeElem.style.top = `${coord.y}px`;
      nodeElem.setAttribute('tabindex', '0');
      nodeElem.setAttribute('role', 'button');
      nodeElem.setAttribute('aria-label', item.label.replace(/<br>/g, ' '));

      nodeElem.innerHTML = `
        <div class="ffs-node-circle">
          ${item.iconSvg}
        </div>
        <span class="ffs-node-label">${item.label}</span>
      `;

      // Evento de Clique: O radar move a linha diretamente para o ícone clicado e ativa
      nodeElem.addEventListener('click', () => {
        pauseAutoPlay(6000);
        moveSweepTo(index, 'nearest');
      });

      // Evento de teclado (Enter / Space)
      nodeElem.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          pauseAutoPlay(6000);
          moveSweepTo(index, 'nearest');
        }
      });

      ffsNodesLayer.appendChild(nodeElem);
      nodesElements.push(nodeElem);
    });

    // Estado inicial
    setSweepAngle(ffsMechanisms[0].sweepAngle);
    commitNode(0);
  }

  // Render inicial
  buildFFSRadar();

  // ResizeObserver para manter conexões e nós alinhados em resize
  let resizeTimer;
  const ro = new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      buildFFSRadar();
    }, 100);
  });
  ro.observe(ffsRadarWrapper);
});
