/* ==========================================================================
   ENDCONTROL ENGENHARIA — INDEX2 INTERACTIVE FEATURES
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. HUB DE 12 SERVIÇOS INDUSTRIAIS - FILTRO E BUSCA
  const searchInput = document.getElementById('hubSearchInput');
  const filterPills = document.querySelectorAll('.filter-pill');
  const serviceCards = document.querySelectorAll('.service-card-v2');

  function filterServices() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const activePill = document.querySelector('.filter-pill.active');
    const selectedCategory = activePill ? activePill.dataset.filter : 'all';

    serviceCards.forEach(card => {
      const title = card.querySelector('.service-v2-title')?.textContent.toLowerCase() || '';
      const desc = card.querySelector('.service-v2-desc')?.textContent.toLowerCase() || '';
      const list = card.querySelector('.service-v2-list')?.textContent.toLowerCase() || '';
      const category = card.dataset.category || '';

      const matchesSearch = title.includes(query) || desc.includes(query) || list.includes(query);
      const matchesCategory = selectedCategory === 'all' || category === selectedCategory;

      if (matchesSearch && matchesCategory) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterServices);
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      filterServices();
    });
  });

  // 2. SIMULADOR DE COTAÇÃO TÉCNICA
  const simSetor = document.getElementById('simSetor');
  const simAtivo = document.getElementById('simAtivo');
  const simNorma = document.getElementById('simNorma');
  const simResultBox = document.getElementById('simResultBox');
  const simResultText = document.getElementById('simResultText');
  const btnSendSimWhatsapp = document.getElementById('btnSendSimWhatsapp');

  function updateSimulatorResult() {
    if (!simSetor || !simAtivo || !simNorma) return;
    const setor = simSetor.value;
    const ativo = simAtivo.value;
    const norma = simNorma.value;

    if (setor && ativo) {
      simResultBox.style.display = 'flex';
      const msg = `Resumo da Solicitação:\n- Setor: ${setor}\n- Ativo: ${ativo}\n- Escopo Normativo / Serviço: ${norma || 'Avaliação Técnica Geral'}`;
      simResultText.textContent = msg;

      const whatsappText = encodeURIComponent(
        `Olá! Vim pelo site da EndControl Engenharia e gostaria de uma cotação técnica:\n\n` +
        `• Setor Industrial: ${setor}\n` +
        `• Equipamento/Ativo: ${ativo}\n` +
        `• Norma/Serviço Solicitado: ${norma || 'Avaliação de Integridade'}\n\n` +
        `Poderiam me encaminhar um especialista?`
      );
      if (btnSendSimWhatsapp) {
        btnSendSimWhatsapp.href = `https://wa.me/5591984040710?text=${whatsappText}`;
      }
    } else {
      if (simResultBox) simResultBox.style.display = 'none';
    }
  }

  if (simSetor) simSetor.addEventListener('change', updateSimulatorResult);
  if (simAtivo) simAtivo.addEventListener('change', updateSimulatorResult);
  if (simNorma) simNorma.addEventListener('change', updateSimulatorResult);

  // 3. MODAL DA ÁREA DO CLIENTE
  const clientAreaTriggers = document.querySelectorAll('.trigger-client-area');
  const clientModal = document.getElementById('clientAreaModal');
  const closeModalBtn = document.getElementById('closeClientModal');

  clientAreaTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (clientModal) {
        clientModal.classList.add('active');
      }
    });
  });

  if (closeModalBtn && clientModal) {
    closeModalBtn.addEventListener('click', () => {
      clientModal.classList.remove('active');
    });

    clientModal.addEventListener('click', (e) => {
      if (e.target === clientModal) {
        clientModal.classList.remove('active');
      }
    });
  }

  // 4. PREENCHER FORMULÁRIO DE LOGIN DE TESTE DO CLIENTE
  const clientLoginForm = document.getElementById('clientLoginForm');
  if (clientLoginForm) {
    clientLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Portal do Cliente: Autenticando com certificado de segurança EndControl... Redirecionando para visualização de Laudos Rastreáveis.');
      clientModal.classList.remove('active');
    });
  }
});
