document.addEventListener('DOMContentLoaded', () => {
  const servicesData = [
    {
      id: 0,
      title: '1. Gerenciamento de Projetos',
      shortTitle: '1. Gerenciamento<br>de Projetos',
      ring: 'outer',
      angle: -90, // Top (12:00)
      desc: 'Gestão end-to-end de projetos complexos de engenharia, garantindo prazo, orçamento, qualidade e conformidade com normas.',
      topics: [
        'Planejamento e controle físico-financeiro',
        'Gestão de riscos e suprimentos',
        'Supervisão técnica de campo',
        'Garantia de qualidade (QA/QC)'
      ],
      image: './assets/Fotografias/editadas/operacional-discussao-engenheiros-tela-edit.webp',
      ctaText: 'Saiba Mais',
      iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>`
    },
    {
      id: 1,
      title: '2. Inspeção em Obras de Artes Especiais',
      shortTitle: '2. Inspeção em Obras<br>de Artes Especiais',
      ring: 'outer',
      angle: -30, // Upper Right Outer (2:00)
      desc: 'Avaliações técnicas especializadas em Obras de Arte Especiais (pontes, viadutos, passarelas), com foco em segurança e durabilidade.',
      topics: [
        'Inspeções visuais e instrumentadas',
        'Mapeamento de danos e anomalias',
        'Relatórios técnicos e pareceres',
        'Suporte à gestão de ativos'
      ],
      image: './assets/Fotografias/editadas/operacional-alpinismo-industrial-escada-tanque-edit.webp',
      ctaText: 'Saiba Mais',
      iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20h20"/><path d="M4 20v-4"/><path d="M8 20v-8"/><path d="M12 20V8"/><path d="M16 20v-8"/><path d="M20 20v-4"/><path d="M4 16l4-4 4 0 4 0 4 4"/><path d="M8 12l4-4 4 4"/></svg>`
    },
    {
      id: 2,
      title: '3. Ensaios Não Destrutivos (ENDs)',
      shortTitle: '3. Ensaios Não Destrutivos<br>(ENDs)',
      ring: 'outer',
      angle: 30, // Lower Right Outer (4:00)
      desc: 'Técnicas avançadas para detecção de descontinuidades em materiais e soldas, garantindo segurança operacional sem comprometer os componentes.',
      topics: [
        'Ultrassom convencional e Phased Array',
        'Partículas magnéticas e líquido penetrante',
        'Radiografia e gamagrafia industrial',
        'Emissão acústica e TOFD'
      ],
      image: './assets/Fotografias/editadas/operacional-ultrassom-solda-tubulacao-edit-final.webp',
      ctaText: 'Saiba Mais',
      iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="3" width="12" height="18" rx="2"/><circle cx="12" cy="15" r="2"/><path d="M9 8h6"/><path d="M9 5.5h6"/></svg>`
    },
    {
      id: 3,
      title: '4. Engenharia de Soldagem',
      shortTitle: '4. Engenharia<br>de Soldagem',
      ring: 'outer',
      angle: 90, // Bottom Outer (6:00)
      desc: 'Qualificação de procedimentos de soldagem (EPS/RQPS) e soldadores conforme normas ASME, AWS e ISO, com suporte de engenheiros especialistas.',
      topics: [
        'Elaboração de EPS, RQPS e RQS',
        'Supervisão e inspeção de soldagem (IE-N1/N2)',
        'Consultoria em metalurgia e soldabilidade',
        'Definição de consumíveis e tratamento térmico'
      ],
      image: './assets/Fotografias/editadas/operacional-phased-array-chapas-soldadas-edit.webp',
      ctaText: 'Saiba Mais',
      iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z"/></svg>`
    },
    {
      id: 4,
      title: '5. Engenharia de Integridade Estrutural',
      shortTitle: '5. Engenharia de<br>Integridade Estrutural',
      ring: 'outer',
      angle: 150, // Lower Left Outer (8:00)
      desc: 'Análise técnica de estruturas metálicas, civis e de concreto armado, com laudos e recomendações para manutenção preventiva e preditiva.',
      topics: [
        'Avaliação de vida útil remanescente',
        'Análise de corrosão e fadiga',
        'Laudos de integridade estrutural',
        'Monitoramento de deformações'
      ],
      image: './assets/Fotografias/editadas/operacional-alpinismo-inspecao-vaso-pressao-edit.webp',
      ctaText: 'Saiba Mais',
      iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`
    },
    {
      id: 5,
      title: '6. Soluções Tecnológicas Integradas',
      shortTitle: '6. Soluções Tecnológicas<br>Integradas',
      ring: 'outer',
      angle: 210, // Upper Left Outer (10:00)
      desc: 'Inovação aplicada em campo com tecnologias proprietárias como o RaptorScan, drones e softwares para gestão de integridade.',
      topics: [
        'RaptorScan — crawler de inspeção',
        'Drones para inspeção em altura',
        'Software de gestão de ativos',
        'Digitalização e modelagem 3D'
      ],
      image: './assets/Fotografias/editadas/ultrassom-raptor-scan-crawler-operacao-edit.webp',
      ctaText: 'Saiba Mais',
      iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`
    },
    {
      id: 6,
      title: '7. Inspeção e Adequação Normativa',
      shortTitle: '7. Inspeção e Adequação<br>Normativa',
      ring: 'inner',
      angle: -60, // Upper Right Inner (1:00)
      desc: 'Inspeção de segurança em vasos de pressão, caldeiras, tubulações e tanques conforme a NR-13 e normas internacionais aplicáveis.',
      topics: [
        'Inspeção inicial, periódica e extraordinária',
        'Elaboração de prontuários e PAR',
        'Cálculo de pressão máxima de trabalho (PMTA)',
        'Recomendações para adequação normativa'
      ],
      image: './assets/Fotografias/editadas/operacional-engenheiros-inspecao-bomba-edit.webp',
      ctaText: 'Saiba Mais',
      iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>`
    },
    {
      id: 7,
      title: '8. Calibração de Instrumentos',
      shortTitle: '8. Calibração de<br>Instrumentos',
      ring: 'inner',
      angle: 0, // Right Inner (3:00)
      desc: 'Serviços de calibração de manômetros, termômetros, blocos padrão e instrumentação industrial com rastreabilidade RBC/INMETRO.',
      topics: [
        'Calibração de instrumentos de pressão e temperatura',
        'Emissão de certificados rastreáveis RBC',
        'Ajuste e manutenção preventiva de medidores',
        'Atendimento in-loco e laboratório'
      ],
      image: './assets/Fotografias/editadas/laboratorio-analise-placa-eletronica-edit.webp',
      ctaText: 'Saiba Mais',
      iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 12l3-3"/><path d="M8 16a5 5 0 0 1 0-7"/></svg>`
    },
    {
      id: 8,
      title: '9. Trepanação (Hot Tapping)',
      shortTitle: '9. Trepanação<br>(Hot Tapping)',
      ring: 'inner',
      angle: 60, // Lower Right Inner (5:00)
      desc: 'Perfuração sob pressão em tubulações e dutos em operação, permitindo derivações e intervenções sem parada de produção.',
      topics: [
        'Perfuração em carga (Hot Tapping)',
        'Bloqueio temporário de tubulações (Line Stop)',
        'Soldagem de sapatas e trepanos',
        'Procedimentos operacionais de alta segurança'
      ],
      image: './assets/Fotografias/editadas/operacional-tecnico-refinaria-noite-edit.webp',
      ctaText: 'Saiba Mais',
      iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="3" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="21"/><line x1="3" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="21" y2="12"/></svg>`
    },
    {
      id: 9,
      title: '10. Certificação de Matéria-Prima',
      shortTitle: '10. Certificação de<br>Matéria-Prima',
      ring: 'inner',
      angle: 120, // Lower Left Inner (7:00)
      desc: 'Verificação e validação da conformidade de materiais metálicos e poliméricos por ensaios químicos, mecânicos e metalográficos.',
      topics: [
        'Análise química por espectrometria de emissão óptica',
        'Ensaios mecânicos de tração, impacto e dureza',
        'Análise metalográfica e caracterização de microestrutura',
        'Emissão de laudos de conformidade com normas'
      ],
      image: './assets/Fotografias/editadas/operacional-inspecao-ultrassom-casco-estrutura-edit.webp',
      ctaText: 'Saiba Mais',
      iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`
    },
    {
      id: 10,
      title: '11. Consultoria e Assessoria Técnica',
      shortTitle: '11. Consultoria e<br>Assessoria Técnica',
      ring: 'inner',
      angle: 180, // Left Inner (9:00)
      desc: 'Assessoria especializada para solução de problemas complexos de engenharia, falhas de componentes e otimização de processos.',
      topics: [
        'Análise de falhas de componentes e equipamentos',
        'Pareceres técnicos e perícias de engenharia',
        'Auditorias de processos e fornecedores',
        'Treinamentos e capacitação técnica'
      ],
      image: './assets/Fotografias/editadas/ultrassom-raptor-scan-tecnicos-reunidos-campo-edit.webp',
      ctaText: 'Saiba Mais',
      iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`
    },
    {
      id: 11,
      title: '12. Elaboração de Projetos Mecânicos',
      shortTitle: '12. Elaboração de<br>Projetos Mecânicos',
      ring: 'inner',
      angle: 240, // Upper Left Inner (11:00)
      desc: 'Desenvolvimento de projetos mecânicos, estruturais e de tubulação, com análises de elementos finitos e soluções customizadas.',
      topics: [
        'Projetos de tubulação e plantas industriais',
        'Análise por elementos finitos (FEA)',
        'Modelagem 3D e detalhamento técnico',
        'Projetos de modificação e retrofitting'
      ],
      image: './assets/Fotografias/editadas/operacional-discussao-engenheiros-tela-edit.webp',
      ctaText: 'Saiba Mais',
      iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`
    }
  ];

  const cardImage = document.getElementById('cardImage');
  const cardTitle = document.getElementById('cardTitle');
  const cardDesc = document.getElementById('cardDesc');
  const cardList = document.getElementById('cardList');
  const cardCta = document.getElementById('cardCta');
  const highlightCard = document.getElementById('highlightCard');
  const cardProgress = document.getElementById('cardProgress');
  const radarNodesLayer = document.getElementById('radarNodesLayer');
  const orbitalDiagram = document.getElementById('orbitalDiagram');

  if (!cardImage || !cardTitle || !cardDesc || !cardList || !cardCta || !highlightCard || !cardProgress || !orbitalDiagram) {
    return;
  }

  // Render 12 Service Nodes dynamically with exact polar coordinates
  const nodesContainer = radarNodesLayer || orbitalDiagram;
  nodesContainer.innerHTML = ''; // Clean slate

  servicesData.forEach((s, index) => {
    const nodeEl = document.createElement('div');
    // Outer radius 49.5%, Inner radius 30.5% (Wide icon separation & 19% ring-to-ring gap)
    const ringRadiusPercent = s.ring === 'outer' ? 49.5 : 30.5;
    const angleRad = (s.angle * Math.PI) / 180;
    const leftPercent = 50 + ringRadiusPercent * Math.cos(angleRad);
    const topPercent = 50 + ringRadiusPercent * Math.sin(angleRad);

    nodeEl.className = `service-node node-ring-${s.ring}`;
    nodeEl.id = `node-${index}`;
    nodeEl.dataset.index = index;
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

  // Build card progress dots
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

  // Default active index = 0 ("1. Gerenciamento de Projetos")
  let activeIndex = 0;
  const visitedIndices = new Set(); // Cumulative trail of items visited in current cycle

  let autoPlayInterval = null;
  let pauseTimeout = null;
  const AUTO_PLAY_MS = 5000;
  const PAUSE_RESUME_MS = 12000;
  let isTransitioning = false;

  function updateRadarStates() {
    serviceNodes.forEach((node, index) => {
      const isActive = index === activeIndex;
      const isVisited = visitedIndices.has(index) && !isActive;
      const isInactive = !isActive && !isVisited;

      node.classList.toggle('is-active', isActive);
      node.classList.toggle('service-node--active', isActive);

      node.classList.toggle('is-previous', isVisited);
      node.classList.toggle('is-visited', isVisited);
      node.classList.toggle('service-node--previous', isVisited);

      node.classList.toggle('is-inactive', isInactive);
      node.classList.toggle('service-node--inactive', isInactive);

      if (isActive) {
        node.setAttribute('aria-current', 'true');
      } else {
        node.removeAttribute('aria-current');
      }
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
        cardCta.href = '#';
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
      cardCta.href = '#';
    }
  }

  const visitedSequence = [0];

  function updateRadarTrail() {
    const trailPath = document.getElementById('radarTrailPath');
    if (!trailPath) return;

    if (visitedSequence.length <= 1) {
      trailPath.setAttribute('d', '');
      return;
    }

    let d = '';
    for (let k = 0; k < visitedSequence.length; k++) {
      const idx = visitedSequence[k];
      const s = servicesData[idx];
      const r = s.ring === 'outer' ? 49.5 : 30.5;
      const rad = (s.angle * Math.PI) / 180;
      const x = 250 + 5 * r * Math.cos(rad);
      const y = 250 + 5 * r * Math.sin(rad);

      if (k === 0) {
        d += `M ${x.toFixed(2)} ${y.toFixed(2)}`;
      } else {
        const prevIdx = visitedSequence[k - 1];
        const prevS = servicesData[prevIdx];
        const R_px = 5 * r;

        if (s.ring === prevS.ring) {
          const angleDiff = ((s.angle - prevS.angle + 540) % 360) - 180;
          const sweepFlag = angleDiff > 0 ? 1 : 0;
          d += ` A ${R_px.toFixed(2)} ${R_px.toFixed(2)} 0 0 ${sweepFlag} ${x.toFixed(2)} ${y.toFixed(2)}`;
        } else {
          d += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
        }
      }
    }
    trailPath.setAttribute('d', d);
  }

  function goToService(index) {
    if (index === activeIndex) return;

    if (index === 0) {
      // Reached Item 1: Reset cycle completely!
      visitedIndices.clear();
      visitedSequence.length = 0;
      visitedSequence.push(0);
    } else {
      visitedIndices.add(activeIndex);
      if (!visitedSequence.includes(index)) {
        visitedSequence.push(index);
      }
    }

    activeIndex = index;

    updateRadarStates();
    updatePagination(activeIndex);
    updateCard(activeIndex, true);
    updateRadarTrail();
  }

  const prevService = () => {
    const nextIdx = (activeIndex - 1 + servicesData.length) % servicesData.length;
    goToService(nextIdx);
    pauseAutoPlay();
  };

  const nextService = () => {
    const nextIdx = (activeIndex + 1) % servicesData.length;
    goToService(nextIdx);
    pauseAutoPlay();
  };

  document.getElementById('cardSidePrev')?.addEventListener('click', prevService);
  document.getElementById('cardSideNext')?.addEventListener('click', nextService);
  document.getElementById('cardFooterPrev')?.addEventListener('click', prevService);
  document.getElementById('cardFooterNext')?.addEventListener('click', nextService);

  window.goToService = goToService;

  document.addEventListener('click', (e) => {
    const serviceLink = e.target.closest('[data-service-id]');
    if (serviceLink) {
      const serviceId = parseInt(serviceLink.dataset.serviceId, 10);
      if (!isNaN(serviceId)) {
        goToService(serviceId);
        pauseAutoPlay();
      }
    }
  });

  function startAutoPlay() {
    stopAutoPlay();
    autoPlayInterval = setInterval(() => goToService((activeIndex + 1) % servicesData.length), AUTO_PLAY_MS);
  }
  function stopAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
  }
  function pauseAutoPlay() {
    stopAutoPlay();
    if (pauseTimeout) clearTimeout(pauseTimeout);
    pauseTimeout = setTimeout(() => startAutoPlay(), PAUSE_RESUME_MS);
  }

  serviceNodes.forEach(node => {
    node.addEventListener('click', () => {
      goToService(parseInt(node.dataset.index));
      pauseAutoPlay();
    });
    node.addEventListener('mouseenter', () => stopAutoPlay());
    node.addEventListener('mouseleave', () => {
      if (!autoPlayInterval) startAutoPlay();
    });
  });

  updateRadarStates();
  updatePagination(activeIndex);
  updateCard(activeIndex, false);
  updateRadarTrail();
  startAutoPlay();

  // CountUp animation for stats
  function animateCountUp(el) {
    const target = parseFloat(el.dataset.target),
      prefix = el.dataset.prefix || '',
      suffix = el.dataset.suffix || '',
      sep = el.dataset.separator || '',
      isDecimal = el.dataset.decimal === 'true';
    const duration = 2000,
      startTime = performance.now();
    function update(now) {
      const progress = Math.min((now - startTime) / duration, 1),
        eased = 1 - Math.pow(1 - progress, 3);
      let current = eased * target,
        formatted;
      if (isDecimal) formatted = current.toFixed(1).replace('.', ',');
      else {
        const r = Math.round(current);
        formatted = sep ? r.toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep) : r.toString();
      }
      el.textContent = `${prefix}${formatted}${suffix}`;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const statsBar = document.getElementById('statsBar');
  if (statsBar) {
    const statsObserver = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target
              .querySelectorAll('.bar-stat-value')
              .forEach((el, i) => setTimeout(() => animateCountUp(el), i * 200));
            statsObserver.unobserve(e.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    statsObserver.observe(statsBar);
  }

  servicesData.forEach(s => {
    const img = new Image();
    img.src = s.image;
  });
});
