document.addEventListener('DOMContentLoaded', () => {
  const servicesData = [
    { id:0, title:'Integridade Estrutural', desc:'Análise técnica de estruturas metálicas, civis e de concreto armado, com laudos e recomendações para manutenção preventiva e preditiva.', topics:['Avaliação de vida útil remanescente','Análise de corrosão e fadiga','Laudos de integridade estrutural','Monitoramento de deformações'], image:'./assets/Fotografias/editadas/operacional-alpinismo-inspecao-vaso-pressao-edit.webp', ctaText:'Saiba mais sobre Integridade' },
    { id:1, title:'Inspeção em OAE', desc:'Avaliações técnicas especializadas em Obras de Arte Especiais, com foco em segurança, durabilidade e conformidade normativa.', topics:['Inspeções visuais e instrumentadas','Mapeamento de danos e anomalias','Relatórios técnicos e pareceres','Suporte à gestão de ativos'], image:'./assets/Fotografias/editadas/operacional-alpinismo-industrial-escada-tanque-edit.webp', ctaText:'Saiba mais sobre Inspeção em OAE' },
    { id:2, title:'ENDs — Ensaios Não Destrutivos', desc:'Técnicas avançadas para detecção de descontinuidades em materiais e soldas, garantindo segurança operacional sem comprometer os componentes.', topics:['Ultrassom convencional e Phased Array','Partículas magnéticas e líquido penetrante','Radiografia e gamagrafia industrial','Emissão acústica e TOFD'], image:'./assets/Fotografias/editadas/operacional-ultrassom-solda-tubulacao-edit-final.webp', ctaText:'Saiba mais sobre ENDs' },
    { id:3, title:'Soldagem e Qualificação', desc:'Qualificação de procedimentos e soldadores conforme normas internacionais, com laboratório próprio de ensaios mecânicos.', topics:['Qualificação de EPS e RQPS','Qualificação de soldadores e operadores','Ensaios mecânicos em corpos de prova','Consultoria em processos de soldagem'], image:'./assets/Fotografias/editadas/operacional-phased-array-chapas-soldadas-edit.webp', ctaText:'Saiba mais sobre Soldagem' },
    { id:4, title:'Projetos de Engenharia', desc:'Desenvolvimento de projetos mecânicos, estruturais e de tubulação, com análises de elementos finitos e soluções customizadas.', topics:['Projetos mecânicos e estruturais','Análise por elementos finitos (FEA)','Adequação a NRs e normas técnicas','Projetos de vasos de pressão'], image:'./assets/Fotografias/editadas/operacional-discussao-engenheiros-tela-edit.webp', ctaText:'Saiba mais sobre Projetos' },
    { id:5, title:'Soluções Tecnológicas', desc:'Inovação aplicada em campo com tecnologias proprietárias como o RaptorScan, drones e softwares para gestão de integridade.', topics:['RaptorScan — crawler de inspeção','Drones para inspeção em altura','Software de gestão de ativos','Digitalização e modelagem 3D'], image:'./assets/Fotografias/editadas/ultrassom-raptor-scan-crawler-operacao-edit.webp', ctaText:'Saiba mais sobre Tecnologia' }
  ];

  const cardImage = document.getElementById('cardImage');
  const cardTitle = document.getElementById('cardTitle');
  const cardDesc = document.getElementById('cardDesc');
  const cardList = document.getElementById('cardList');
  const cardCta = document.getElementById('cardCta');
  const highlightCard = document.getElementById('highlightCard');
  const cardProgress = document.getElementById('cardProgress');
  const serviceNodes = document.querySelectorAll('.service-node');
  const radarSweep = document.getElementById('radarSweep');

  if (!cardImage || !cardTitle || !cardDesc || !cardList || !cardCta || !highlightCard || !cardProgress || !radarSweep) {
    return;
  }

  servicesData.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'card-progress-dot'; dot.dataset.index = i;
    dot.addEventListener('click', () => { goToService(i); pauseAutoPlay(); });
    cardProgress.appendChild(dot);
  });
  const progressDots = document.querySelectorAll('.card-progress-dot');

  const checkSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
  const arrowSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;

  let currentIndex = 1;
  let autoPlayInterval = null;
  let pauseTimeout = null;
  const AUTO_PLAY_MS = 5000;
  const PAUSE_RESUME_MS = 12000;
  let isTransitioning = false;

  function updateCard(index, animate = true) {
    const data = servicesData[index];
    if (animate && !isTransitioning) {
      isTransitioning = true;
      highlightCard.classList.add('is-transitioning');
      cardImage.style.transition = 'opacity 0.2s ease'; cardImage.style.opacity = '0.3';
      setTimeout(() => {
        cardImage.src = data.image; cardImage.alt = data.title;
        cardTitle.textContent = data.title; cardDesc.textContent = data.desc;
        cardList.innerHTML = data.topics.map(t => `<li>${checkSvg} ${t}</li>`).join('');
        cardCta.innerHTML = `${data.ctaText} ${arrowSvg}`; cardCta.href = '#';
        const onReady = () => { cardImage.style.opacity = '1'; setTimeout(() => { highlightCard.classList.remove('is-transitioning'); isTransitioning = false; }, 60); };
        cardImage.onload = onReady; if (cardImage.complete) onReady();
      }, 260);
    } else {
      cardImage.src = data.image; cardImage.alt = data.title;
      cardTitle.textContent = data.title; cardDesc.textContent = data.desc;
      cardList.innerHTML = data.topics.map(t => `<li>${checkSvg} ${t}</li>`).join('');
      cardCta.innerHTML = `${data.ctaText} ${arrowSvg}`; cardCta.href = '#';
    }
  }

  function setActiveNode(index) {
    serviceNodes.forEach(n => n.classList.remove('service-node--active'));
    document.getElementById(`node-${index}`)?.classList.add('service-node--active');
    progressDots.forEach(d => d.classList.remove('active'));
    progressDots[index]?.classList.add('active');
  }

  function goToService(index) {
    if (index === currentIndex && !isTransitioning) return;
    currentIndex = index; setActiveNode(index); updateCard(index, true);
  }

  function startAutoPlay() {
    stopAutoPlay(); radarSweep.classList.remove('paused');
    autoPlayInterval = setInterval(() => goToService((currentIndex + 1) % servicesData.length), AUTO_PLAY_MS);
  }
  function stopAutoPlay() { if (autoPlayInterval) { clearInterval(autoPlayInterval); autoPlayInterval = null; } }
  function pauseAutoPlay() {
    stopAutoPlay(); radarSweep.classList.add('paused');
    if (pauseTimeout) clearTimeout(pauseTimeout);
    pauseTimeout = setTimeout(() => startAutoPlay(), PAUSE_RESUME_MS);
  }

  serviceNodes.forEach(node => {
    node.addEventListener('click', () => { goToService(parseInt(node.dataset.index)); pauseAutoPlay(); });
    node.addEventListener('mouseenter', () => radarSweep.classList.add('paused'));
    node.addEventListener('mouseleave', () => { if (autoPlayInterval) radarSweep.classList.remove('paused'); });
  });

  setActiveNode(currentIndex); updateCard(currentIndex, false); startAutoPlay();

  // CountUp
  function animateCountUp(el) {
    const target = parseFloat(el.dataset.target), prefix = el.dataset.prefix||'', suffix = el.dataset.suffix||'', sep = el.dataset.separator||'', isDecimal = el.dataset.decimal==='true';
    const duration = 2000, startTime = performance.now();
    function update(now) {
      const progress = Math.min((now-startTime)/duration, 1), eased = 1-Math.pow(1-progress, 3);
      let current = eased*target, formatted;
      if(isDecimal) formatted = current.toFixed(1).replace('.',',');
      else { const r = Math.round(current); formatted = sep ? r.toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep) : r.toString(); }
      el.textContent = `${prefix}${formatted}${suffix}`;
      if(progress<1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }
  
  const statsBar = document.getElementById('statsBar');
  if (statsBar) {
    const statsObserver = new IntersectionObserver(entries => {
      entries.forEach(e => { if(e.isIntersecting) { e.target.querySelectorAll('.bar-stat-value').forEach((el,i) => setTimeout(() => animateCountUp(el), i*200)); statsObserver.unobserve(e.target); } });
    }, {threshold:0.3});
    statsObserver.observe(statsBar);
  }

  servicesData.forEach(s => { const img=new Image(); img.src=s.image; });
});
