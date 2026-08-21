/**
 * ============================================================================
 * ENDCONTROL ENGENHARIA — RADAR FITNESS-FOR-SERVICE (FFS) 8 MECANISMOS
 * Motor Standalone dedicado com arquitetura idêntica à Home (Print 2).
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const ffsServicesData = [
    {
      id: 0,
      title: '1. Perda Geral de Metal',
      shortTitle: '1. Perda Geral<br>de Metal',
      ring: 'outer',
      ringIndex: 0,
      positionInRing: 0,
      angle: -90, // Top (12:00)
      desc: 'Avaliação de corrosão uniforme e perda generalizada de espessura de parede em vasos, tanques e tubulações, calculando a espessura mínima exigida e vida remanescente.',
      topics: [
        'Mapeamento de espessura por ultrassom B-scan/C-scan',
        'Cálculo de espessura mínima requerida (tmin)',
        'Determinação da taxa de corrosão e vida útil residual',
        'Avaliação conforme API 579-1 / ASME FFS-1 Parte 4'
      ],
      image: './assets/Fotografias/Serviços - Banco de Imagens/01 - Engenharia de Integridade Estrutural/inspecao-corrosao-viga-metalica-eng-integridade.webp',
      ctaText: 'Falar com Especialista',
      iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="4" r="1.5"/><circle cx="12" cy="20" r="1.5"/><circle cx="4" cy="12" r="1.5"/><circle cx="20" cy="12" r="1.5"/><line x1="12" y1="5.5" x2="12" y2="9"/><line x1="12" y1="15" x2="12" y2="18.5"/><line x1="5.5" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="18.5" y2="12"/></svg>`
    },
    {
      id: 1,
      title: '2. Corrosão por Pite',
      shortTitle: '2. Corrosão<br>por Pite',
      ring: 'outer',
      ringIndex: 0,
      positionInRing: 1,
      angle: 0, // Right (3:00)
      desc: 'Análise quantitativa de danos por corrosão localizada e pites em superfícies metálicas pressurizadas, evitando furos e vazamentos inesperados.',
      topics: [
        'Mapeamento de densidade e profundidade de pites',
        'Determinação do fator de severidade e índice de pite',
        'Avaliação da integridade contra pressão interna',
        'Avaliação conforme API 579-1 / ASME FFS-1 Parte 6'
      ],
      image: './assets/Fotografias/originais-16-9/endcontrol-ensaios-nao-destrutivos-ultrassom-medicao-espessura-naval.webp',
      ctaText: 'Falar com Especialista',
      iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/><circle cx="12" cy="14" r="2"/></svg>`
    },
    {
      id: 2,
      title: '3. Danos por Hidrogênio',
      shortTitle: '3. Danos por<br>Hidrogênio (H₂)',
      ring: 'outer',
      ringIndex: 0,
      positionInRing: 2,
      angle: 90, // Bottom (6:00)
      desc: 'Diagnóstico de fragilização por hidrogênio, bolhas (H-blistering) e trincas induzidas por hidrogênio (HIC / SOHIC) em ambientes agressivos.',
      topics: [
        'Detecção e dimensionamento de bolhas e delaminações',
        'Avaliação de trincamento induzido por hidrogênio (HIC/SOHIC)',
        'Análise de fragilização em equipamentos sob alta pressão/H₂S',
        'Avaliação conforme API 579-1 / ASME FFS-1 Parte 7'
      ],
      image: './assets/Fotografias/originais-16-9/endcontrol-ultrassom-phased-array-inspecao-solda-dutos-tubulacoes.webp',
      ctaText: 'Falar com Especialista',
      iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6v12M12 6v12M6 12h6"/><path d="M17 14h3c.6 0 1 .4 1 1v1c0 .6-.4 1-1 1h-3v2h4"/></svg>`
    },
    {
      id: 3,
      title: '4. Trincas e Indicadores',
      shortTitle: '4. Trincas e<br>Indicadores',
      ring: 'outer',
      ringIndex: 0,
      positionInRing: 3,
      angle: 180, // Left (9:00)
      desc: 'Análise de integridade estrutural por Mecânica da Fratura Linear Elástica e Elasto-Plástica (CTOD / J-integral) para defeitos tipo trinca.',
      topics: [
        'Dimensionamento crítico de trincas por Phased Array / TOFD',
        'Análise por Diagrama de Avaliação de Falha (FAD Nível 1, 2 e 3)',
        'Cálculo de tensões residuais em juntas soldadas',
        'Avaliação conforme API 579-1 / ASME FFS-1 Parte 9'
      ],
      image: './assets/Fotografias/Serviços - Banco de Imagens/01 - Engenharia de Integridade Estrutural/ensaio-ultrassom-solda-coluna-estrutura-metalica.webp',
      ctaText: 'Falar com Especialista',
      iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 4L14 9l3 2-6 8"/><line x1="4" y1="20" x2="8" y2="16"/><line x1="14" y1="4" x2="16" y2="2"/></svg>`
    },
    {
      id: 4,
      title: '5. Creep (Fluência)',
      shortTitle: '5. Creep<br>(Fluência)',
      ring: 'inner',
      ringIndex: 1,
      positionInRing: 0,
      angle: -45, // Top-Right (1:30)
      desc: 'Avaliação de componentes operando em regime de alta temperatura sujeitos à deformação lenta e progressiva ao longo do tempo.',
      topics: [
        'Cálculo de fração de vida consumida por fluência (Larson-Miller)',
        'Réplicas metalográficas para análise de vazios e cavidades',
        'Monitoramento de taxas de deformação permanente',
        'Avaliação conforme API 579-1 / ASME FFS-1 Parte 10'
      ],
      image: './assets/Fotografias/originais-16-9/endcontrol-laboratorio-ensaio-dureza-digimess-certificacao-materiais.webp',
      ctaText: 'Falar com Especialista',
      iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><line x1="8" y1="15" x2="16" y2="15"/><path d="M9 12a3 3 0 0 1 6 0"/><line x1="12" y1="7" x2="12" y2="9"/></svg>`
    },
    {
      id: 5,
      title: '6. Fadiga Mecânica & Térmica',
      shortTitle: '6. Fadiga Mecânica<br>& Térmica',
      ring: 'inner',
      ringIndex: 1,
      positionInRing: 1,
      angle: 45, // Bottom-Right (4:30)
      desc: 'Análise de vida útil remanescente sob solicitações cíclicas de pressão, vibração mecânica e gradientes térmicos severos.',
      topics: [
        'Contagem e espectro de ciclos pelo método Rainflow',
        'Avaliação de dano cumulativo por curvas S-N (Regra de Miner)',
        'Análise de taxa de propagação de trincas por fadiga (Lei de Paris)',
        'Avaliação conforme API 579-1 / ASME FFS-1 Parte 14'
      ],
      image: './assets/Fotografias/originais-16-9/endcontrol-consultoria-tecnica-demonstracao-scanner-ultrassom-tubos.webp',
      ctaText: 'Falar com Especialista',
      iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h4l3-8 4 16 3-8h6"/></svg>`
    },
    {
      id: 6,
      title: '7. Amassamentos e Gouges',
      shortTitle: '7. Amassamentos<br>e Gouges',
      ring: 'inner',
      ringIndex: 1,
      positionInRing: 2,
      angle: 135, // Bottom-Left (7:30)
      desc: 'Avaliação de distorções geométricas, mossas, mossas combinadas com ranhuras e desalinhamentos de juntas em dutos e equipamentos.',
      topics: [
        'Modelagem 3D FEA de concentração de tensões na mossa',
        'Avaliação da restrição ao escoamento e fadiga cíclica',
        'Análise de severidade combinada mossa + perda de metal',
        'Avaliação conforme API 579-1 / ASME FFS-1 Parte 12'
      ],
      image: './assets/Fotografias/originais-16-9/endcontrol-inspecao-altura-nr35-escada-tanque-industrial.webp',
      ctaText: 'Falar com Especialista',
      iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M7 10c2.5 4 7.5 4 10 0"/></svg>`
    },
    {
      id: 7,
      title: '8. Danos por Fogo',
      shortTitle: '8. Danos<br>por Fogo',
      ring: 'inner',
      ringIndex: 1,
      positionInRing: 3,
      angle: 225, // Top-Left (10:30)
      desc: 'Inspeção e análise estrutural de ativos industriais expostos a incêndios e superaquecimento para liberação segura de retorno operacional.',
      topics: [
        'Zoneamento de temperatura de exposição e ensaios de dureza',
        'Avaliação de microestrutura e perda de propriedades mecânicas',
        'Inspeção dimensional de empenamentos e deformação plástica',
        'Avaliação conforme API 579-1 / ASME FFS-1 Parte 11'
      ],
      image: './assets/Fotografias/originais-16-9/endcontrol-calibracao-manometros-pressao-em-campo-nr13.webp',
      ctaText: 'Falar com Especialista',
      iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z"/></svg>`
    }
  ];

  const RING_SIZE = 4;
  const servicesData = ffsServicesData.map((s, stepIndex) => ({
    ...s,
    stepIndex,
    ringIndex: stepIndex < RING_SIZE ? 0 : 1,
    positionInRing: stepIndex % RING_SIZE
  }));

  const RADAR_CONFIG = Object.freeze({
    transitionDuration: 1400,
    autoAdvanceInterval: 2200,
    manualResumeDelay: 12000,
    approachStartRatio: 0.56,
    easing: 'cubic-bezier(0.45, 0, 0.2, 1)'
  });

  const cardImage = document.getElementById('cardImage');
  const cardTitle = document.getElementById('cardTitle');
  const cardDesc = document.getElementById('cardDesc');
  const cardList = document.getElementById('cardList');
  const cardCta = document.getElementById('cardCta');
  const highlightCard = document.getElementById('highlightCard');
  const cardProgress = document.getElementById('cardProgress');
  const radarNodesLayer = document.getElementById('radarNodesLayer');
  const radarConnectionsLayer = document.getElementById('radarConnectionsLayer');
  const orbitalDiagram = document.getElementById('orbitalDiagram');
  const orbitalCenterLogo = document.querySelector('.orbital-center-logo');
  const radarSweep = document.getElementById('radarSweep');
  const RadarProgress = window.RadarProgress;

  if (!cardImage || !cardTitle || !cardDesc || !cardList || !cardCta || !highlightCard || !cardProgress || !radarConnectionsLayer || !orbitalDiagram || !orbitalCenterLogo || !radarSweep || !RadarProgress) {
    return;
  }

  // Render 8 FFS Nodes dynamically with exact polar coordinates
  const nodesContainer = radarNodesLayer || orbitalDiagram;
  nodesContainer.innerHTML = '';

  servicesData.forEach((s, index) => {
    const nodeEl = document.createElement('div');
    const ringRadiusPercent = s.ringIndex === 0 ? 49.5 : 30.5;
    const angleRad = (s.angle * Math.PI) / 180;
    const leftPercent = 50 + ringRadiusPercent * Math.cos(angleRad);
    const topPercent = 50 + ringRadiusPercent * Math.sin(angleRad);

    const labelPlacement = RadarProgress.getLabelPlacement(s.angle);
    nodeEl.className = 'service-node node-ring-' + s.ring +
      ' label-pos-' + labelPlacement + ' label-ring-' + s.ring;
    nodeEl.id = `node-${index}`;
    nodeEl.dataset.index = index;
    nodeEl.dataset.step = String(index + 1);
    nodeEl.dataset.angle = String(s.angle);
    nodeEl.dataset.ring = s.ring;
    nodeEl.style.left = `${leftPercent}%`;
    nodeEl.style.top = `${topPercent}%`;

    const labelLines = s.shortTitle.split('<br>').map(line => `<span class="label-line">${line}</span>`).join('');

    nodeEl.innerHTML = `
      <div class="service-node-icon">
        ${s.iconSvg}
      </div>
      <span class="service-node-label">${labelLines}</span>
    `;

    nodesContainer.appendChild(nodeEl);
  });

  const serviceNodes = document.querySelectorAll('.service-node');

  const labelPlacementClasses = [
    'label-pos-left',
    'label-pos-right',
    'label-pos-top',
    'label-pos-bottom'
  ];

  function setLabelPlacement(node, placement) {
    labelPlacementClasses.forEach(className => node.classList.remove(className));
    node.classList.add('label-pos-' + placement);
  }

  function adjustLabelPlacements() {
    serviceNodes.forEach((node, index) => {
      const service = servicesData[index];
      const preferredPlacement = RadarProgress.getLabelPlacement(service.angle);
      setLabelPlacement(node, preferredPlacement);
    });
  }

  window.requestAnimationFrame(adjustLabelPlacements);

  let measuredAngles = servicesData.map(service => RadarProgress.normalizeAngle(service.angle + 90));

  function measureRadarAngles() {
    const centerRect = orbitalCenterLogo.getBoundingClientRect();
    const center = {
      x: centerRect.left + centerRect.width / 2,
      y: centerRect.top + centerRect.height / 2
    };

    measuredAngles = Array.from(serviceNodes, (node, index) => {
      const icon = node.querySelector('.service-node-icon');
      const iconRect = icon?.getBoundingClientRect() || node.getBoundingClientRect();
      const angle = RadarProgress.getDomAngle(center, {
        x: iconRect.left + iconRect.width / 2,
        y: iconRect.top + iconRect.height / 2
      });

      node.dataset.angle = angle.toFixed(2);
      servicesData[index].measuredAngle = angle;
      return angle;
    });

    return measuredAngles;
  }

  function polarPoint(service) {
    const radiusPercent = service.ringIndex === 0 ? 49.5 : 30.5;
    const radius = radiusPercent * 5;
    const angleRad = (service.angle * Math.PI) / 180;

    return {
      x: 250 + radius * Math.cos(angleRad),
      y: 250 + radius * Math.sin(angleRad),
      radius
    };
  }

  function polarPointAt(service, angle) {
    const point = polarPoint(service);
    const angleRad = (angle * Math.PI) / 180;

    return {
      x: 250 + point.radius * Math.cos(angleRad),
      y: 250 + point.radius * Math.sin(angleRad)
    };
  }

  function getConnectionInsetDegrees(service) {
    const point = polarPoint(service);
    const icon = serviceNodes[service.stepIndex]?.querySelector('.service-node-icon');
    const centerRect = orbitalDiagram.getBoundingClientRect();
    const iconDiameter = icon
      ? Math.max(icon.getBoundingClientRect().width, icon.getBoundingClientRect().height)
      : 46;
    const viewBoxScale = Math.max(centerRect.width, centerRect.height, 1) / 500;
    return RadarProgress.getConnectionInsetDegrees({
      iconDiameter,
      viewBoxScale,
      ringRadius: point.radius
    });
  }

  function getRadarArcGeometry(from, to) {
    const insetDegrees = getConnectionInsetDegrees(from);
    const angles = RadarProgress.getSafeArcAngles(from.angle, to.angle, {
      insetDegrees
    });
    const start = polarPointAt(from, angles.startAngle);
    const end = polarPointAt(to, angles.endAngle);
    const radius = polarPoint(from).radius.toFixed(2);

    return {
      d: `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${radius} ${radius} 0 0 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`,
      start,
      end
    };
  }

  const radarSvg = document.querySelector('.radar-trail-svg');
  const radarGradientDefs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  radarSvg?.prepend(radarGradientDefs);

  function createConnectionGradient(connection, state) {
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    const gradientId = 'radar-connection-gradient-' +
      connection.fromStepIndex + '-' + connection.toStepIndex;
    const existingGradient = document.getElementById(gradientId);
    if (existingGradient) return 'url(#' + gradientId + ')';

    const stops = RadarProgress.getConnectionGradientStops(0.82);
    const vector = RadarProgress.getConnectionGradientVector(
      connection.gradientStart,
      connection.gradientEnd
    );

    gradient.setAttribute('id', gradientId);
    gradient.setAttribute('x1', String(vector.x1));
    gradient.setAttribute('y1', String(vector.y1));
    gradient.setAttribute('x2', String(vector.x2));
    gradient.setAttribute('y2', String(vector.y2));
    gradient.setAttribute('gradientUnits', vector.gradientUnits);

    stops.forEach(([offset, opacity]) => {
      const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop.setAttribute('offset', offset);
      stop.setAttribute('stop-color', '#00215D');
      stop.setAttribute('stop-opacity', opacity);
      gradient.appendChild(stop);
    });

    radarGradientDefs?.appendChild(gradient);
    return 'url(#' + gradientId + ')';
  }

  const connectionDefinitions = RadarProgress.buildConnections(servicesData);
  const connectionElements = connectionDefinitions.map(connection => {
    const from = servicesData[connection.fromStepIndex];
    const to = servicesData[connection.toStepIndex];
    const geometry = getRadarArcGeometry(from, to);
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    path.setAttribute('class', 'radar-connection is-future');
    path.setAttribute('d', geometry.d);
    path.setAttribute('pathLength', '1');
    path.dataset.from = String(connection.fromStepIndex);
    path.dataset.to = String(connection.toStepIndex);
    path.dataset.ring = String(connection.ringIndex);
    path.dataset.closing = String(connection.isClosing);
    path.dataset.gradientId = 'radar-connection-gradient-' +
      connection.fromStepIndex + '-' + connection.toStepIndex;
    radarConnectionsLayer.appendChild(path);

    return {
      ...connection,
      path,
      gradientStart: geometry.start,
      gradientEnd: geometry.end
    };
  });

  // Build card progress dots (8 items)
  cardProgress.innerHTML = '';
  servicesData.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'card-progress-dot';
    dot.dataset.index = i;
    dot.addEventListener('click', () => { goToService(i); pauseAutoPlay(); });
    cardProgress.appendChild(dot);
  });
  const progressDots = document.querySelectorAll('.card-progress-dot');

  const checkSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
  const arrowSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;

  let activeIndex = 0;
  let cycleTimer = null;
  let resumeTimer = null;
  let approachTimer = null;
  let sweepAnimation = null;
  let sweepTargetIndex = null;
  let currentSweepAngle = measuredAngles[activeIndex];
  let autoPlayEnabled = true;
  let resizeFrame = null;
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let isTransitioning = false;

  function updateRadarStates() {
    const progressState = RadarProgress.getProgressState(servicesData, activeIndex);
    orbitalDiagram.dataset.currentStep = String(activeIndex + 1);

    serviceNodes.forEach((node, index) => {
      const state = progressState.nodes[index].state;

      node.classList.toggle('is-completed', state === 'completed');
      node.classList.toggle('is-active', state === 'active');
      node.classList.toggle('is-next', state === 'next');
      node.classList.toggle('is-inactive', state === 'inactive');

      if (state === 'active') {
        node.setAttribute('aria-current', 'true');
      } else {
        node.removeAttribute('aria-current');
      }
    });

    connectionElements.forEach((connection, index) => {
      const state = RadarProgress.getConnectionVisualState(
        progressState.connections[index],
        activeIndex
      );
      connection.path.classList.toggle('is-completed', state === 'completed');
      connection.path.classList.toggle('is-current', state === 'current');
      connection.path.classList.toggle('is-future', state === 'future');
      connection.path.setAttribute('stroke', createConnectionGradient(connection, state));
    });
  }

  function updatePagination(index) {
    progressDots.forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });
  }

  function updateCard(index, animate = true) {
    const data = servicesData[index];
    if (animate && !isTransitioning) {
      isTransitioning = true;
      highlightCard.classList.add('is-transitioning');
      cardImage.style.transition = 'opacity 0.2s ease';
      cardImage.style.opacity = '0.3';
      setTimeout(() => {
        cardImage.src = data.image;
        cardImage.alt = data.title;
        cardTitle.textContent = data.title;
        cardDesc.textContent = data.desc;
        cardList.innerHTML = data.topics.map(t => `<li>${checkSvg} ${t}</li>`).join('');
        cardCta.innerHTML = `${data.ctaText} ${arrowSvg}`;
        cardCta.href = 'https://api.whatsapp.com/send?phone=5591984040710';
        cardCta.target = '_blank';
        cardCta.rel = 'noopener';
        const onReady = () => {
          cardImage.style.opacity = '1';
          setTimeout(() => {
            highlightCard.classList.remove('is-transitioning');
            isTransitioning = false;
          }, 60);
        };
        cardImage.onload = onReady;
        if (cardImage.complete) onReady();
      }, 260);
    } else {
      cardImage.src = data.image;
      cardImage.alt = data.title;
      cardTitle.textContent = data.title;
      cardDesc.textContent = data.desc;
      cardList.innerHTML = data.topics.map(t => `<li>${checkSvg} ${t}</li>`).join('');
      cardCta.innerHTML = `${data.ctaText} ${arrowSvg}`;
      cardCta.href = 'https://api.whatsapp.com/send?phone=5591984040710';
      cardCta.target = '_blank';
      cardCta.rel = 'noopener';
    }
  }

  function clearTransientNodeStates() {
    serviceNodes.forEach(node => {
      node.classList.remove('is-departing', 'is-approaching');
    });
    delete orbitalDiagram.dataset.targetStep;
  }

  function setSweepAngle(angle) {
    currentSweepAngle = Number(angle) || 0;
    radarSweep.style.transform = `rotate(${currentSweepAngle}deg)`;
  }

  function readRenderedSweepAngle() {
    const transform = window.getComputedStyle(radarSweep).transform;
    if (!transform || transform === 'none') return currentSweepAngle;

    const matrix = new DOMMatrixReadOnly(transform);
    let renderedAngle = RadarProgress.normalizeAngle(Math.atan2(matrix.b, matrix.a) * 180 / Math.PI);

    while (renderedAngle - currentSweepAngle > 180) renderedAngle -= 360;
    while (renderedAngle - currentSweepAngle < -180) renderedAngle += 360;
    return renderedAngle;
  }

  function stopSweepAtCurrentPosition() {
    if (!sweepAnimation) return;

    const renderedAngle = readRenderedSweepAngle();
    const animationToCancel = sweepAnimation;
    sweepAnimation = null;
    animationToCancel.cancel();
    setSweepAngle(renderedAngle);
  }

  function commitService(index) {
    activeIndex = index;
    sweepTargetIndex = null;
    clearTimeout(approachTimer);
    clearTransientNodeStates();
    updateRadarStates();
    updatePagination(activeIndex);
    updateCard(activeIndex, true);

    if (autoPlayEnabled && !reducedMotionQuery.matches) {
      scheduleNextSweep();
    }
  }

  function moveSweepTo(index, direction = 'nearest') {
    if (!Number.isInteger(index) || index < 0 || index >= servicesData.length) return;
    if (index === activeIndex && sweepTargetIndex === null) return;
    if (index === sweepTargetIndex) return;

    clearTimeout(cycleTimer);
    clearTimeout(approachTimer);
    stopSweepAtCurrentPosition();
    clearTransientNodeStates();

    if (reducedMotionQuery.matches) {
      setSweepAngle(measuredAngles[index]);
      commitService(index);
      return;
    }

    sweepTargetIndex = index;
    orbitalDiagram.dataset.targetStep = String(index + 1);
    serviceNodes[activeIndex]?.classList.add('is-departing');

    const fromAngle = currentSweepAngle;
    const toAngle = direction === 'forward'
      ? RadarProgress.getForwardAngle(fromAngle, measuredAngles[index])
      : direction === 'backward'
        ? RadarProgress.getBackwardAngle(fromAngle, measuredAngles[index])
        : RadarProgress.getNearestAngle(fromAngle, measuredAngles[index]);

    approachTimer = window.setTimeout(() => {
      serviceNodes[index]?.classList.add('is-approaching');
    }, RADAR_CONFIG.transitionDuration * RADAR_CONFIG.approachStartRatio);

    sweepAnimation = radarSweep.animate(
      [
        { transform: `rotate(${fromAngle}deg)` },
        { transform: `rotate(${toAngle}deg)` }
      ],
      {
        duration: RADAR_CONFIG.transitionDuration,
        easing: RADAR_CONFIG.easing,
        fill: 'forwards'
      }
    );

    sweepAnimation.onfinish = () => {
      const finishedAnimation = sweepAnimation;
      sweepAnimation = null;
      setSweepAngle(toAngle);
      finishedAnimation?.cancel();
      commitService(index);
    };
  }

  function goToService(index) {
    moveSweepTo(index);
  }

  const prevService = () => {
    const nextIdx = (activeIndex - 1 + servicesData.length) % servicesData.length;
    moveSweepTo(nextIdx, 'backward');
    pauseAutoPlay();
  };

  const nextService = () => {
    const nextIdx = (activeIndex + 1) % servicesData.length;
    moveSweepTo(nextIdx, 'forward');
    pauseAutoPlay();
  };

  document.getElementById('cardSidePrev')?.addEventListener('click', prevService);
  document.getElementById('cardSideNext')?.addEventListener('click', nextService);

  window.goToService = goToService;

  function startAutoPlay() {
    stopAutoPlay();
    if (reducedMotionQuery.matches) return;

    autoPlayEnabled = true;
    scheduleNextSweep();
  }

  function scheduleNextSweep(
    delay = Math.max(0, RADAR_CONFIG.autoAdvanceInterval - RADAR_CONFIG.transitionDuration)
  ) {
    clearTimeout(cycleTimer);
    if (!autoPlayEnabled || reducedMotionQuery.matches || sweepAnimation) return;

    cycleTimer = window.setTimeout(() => {
      moveSweepTo((activeIndex + 1) % servicesData.length, 'forward');
    }, delay);
  }

  function stopAutoPlay() {
    autoPlayEnabled = false;
    clearTimeout(cycleTimer);
    cycleTimer = null;
  }

  function pauseAutoPlay() {
    stopAutoPlay();
    clearTimeout(resumeTimer);
    resumeTimer = window.setTimeout(startAutoPlay, RADAR_CONFIG.manualResumeDelay);
  }

  serviceNodes.forEach(node => {
    node.addEventListener('click', () => {
      goToService(parseInt(node.dataset.index));
      pauseAutoPlay();
    });
    node.addEventListener('mouseenter', () => stopAutoPlay());
    node.addEventListener('mouseleave', () => {
      startAutoPlay();
    });
  });

  function refreshRadarMeasurements() {
    const wasAutoPlaying = autoPlayEnabled;
    clearTimeout(cycleTimer);
    clearTimeout(approachTimer);
    stopSweepAtCurrentPosition();
    sweepTargetIndex = null;
    clearTransientNodeStates();
    adjustLabelPlacements();
    measureRadarAngles();
    setSweepAngle(measuredAngles[activeIndex]);

    if (wasAutoPlaying && !reducedMotionQuery.matches) {
      autoPlayEnabled = true;
      scheduleNextSweep();
    }
  }

  function scheduleRadarMeasurement() {
    if (resizeFrame) cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = null;
      refreshRadarMeasurements();
    });
  }

  const radarResizeObserver = new ResizeObserver(scheduleRadarMeasurement);
  radarResizeObserver.observe(orbitalDiagram);
  window.addEventListener('resize', scheduleRadarMeasurement, { passive: true });

  reducedMotionQuery.addEventListener('change', event => {
    if (event.matches) {
      stopAutoPlay();
      stopSweepAtCurrentPosition();
      clearTransientNodeStates();
      setSweepAngle(measuredAngles[activeIndex]);
      return;
    }
    startAutoPlay();
  });

  measureRadarAngles();
  setSweepAngle(measuredAngles[activeIndex]);
  updateRadarStates();
  updatePagination(activeIndex);
  updateCard(activeIndex, false);
  startAutoPlay();

  servicesData.forEach(s => {
    const img = new Image();
    img.src = s.image;
  });
});
