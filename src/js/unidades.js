/* ==========================================================================
   Interactive Units Map & Search Engine — ENDCONTROL Engenharia
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
  // --- Elementos do DOM ---
  const teaserSection = document.getElementById('store-locator-teaser');
  
  // Elementos do Localizador (na própria página principal)
  const modalSearchInput = document.getElementById('teaser-search-input');
  const modalClearSearchBtn = document.getElementById('teaser-clear-search-btn');
  const modalStoresListContainer = document.getElementById('teaser-stores-list-container');
  const modalResultsInfo = document.getElementById('teaser-results-info');
  const modalDetailView = document.getElementById('teaser-panel-detail-view');
  const modalListView = document.getElementById('teaser-panel-list-view');
  const modalDetailCardContent = document.getElementById('teaser-detail-card-content');
  const modalBackToListBtn = document.getElementById('teaser-back-to-list-btn');

  // Lightbox
  const lightbox = document.getElementById('album-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  // --- Estado da Aplicação ---
  let mapTeaser = null;
  let markersModal = {};
  let activeFilters = []; // E.g. ['integridade', 'ativos', 'ensaios', 'normativa', 'tecnologia']
  let searchQuery = '';
  let activeUnitId = null;
  let currentAlbumImages = [];
  let currentAlbumIndex = 0;

  // Logo padrão para pins do mapa
  const defaultPinLogo = './assets/Logos/icon-endcontrol.webp';

  // --- Ícone Customizado do Mapa ---
  function createCustomIcon(unit) {
    return L.divIcon({
      className: `custom-map-pin-container pin-${unit.id}`,
      html: `
        <div class="custom-pin-wrapper" title="${unit.name}">
          <svg class="custom-pin-svg" viewBox="0 0 36 46" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 0C8.06 0 0 8.06 0 18c0 12.42 16.2 26.78 16.88 27.38a1.5 1.5 0 0 0 2.24 0C19.8 44.78 36 30.42 36 18 36 8.06 27.94 0 18 0z" fill="#00215D" />
            <circle cx="18" cy="18" r="12" fill="#080c14" stroke="#00215D" stroke-width="1.5" />
          </svg>
          <div class="pin-logo-container" style="top:7px; left:7px; width:22px; height:22px; position:absolute; display:flex; align-items:center; justify-content:center;">
            <img src="${defaultPinLogo}" alt="${unit.name}" style="max-width:18px; max-height:18px; object-fit:contain;" />
          </div>
        </div>
      `,
      iconSize: [36, 46],
      iconAnchor: [18, 46],
      popupAnchor: [0, -42]
    });
  }

  // --- Filtragem de Unidades ---
  function getFilteredUnits() {
    if (!window.units) return [];
    return window.units.filter(unit => {
      // Filtro por sub-marcas / divisões
      if (activeFilters.length > 0) {
        const hasAllSubbrands = activeFilters.every(filter => unit.subbrands && unit.subbrands.includes(filter));
        if (!hasAllSubbrands) return false;
      }

      // Filtro de Busca por Texto
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const matchName = unit.name.toLowerCase().includes(query) || unit.shortName.toLowerCase().includes(query);
        const matchAddress = unit.address.toLowerCase().includes(query);
        const matchServices = unit.services && unit.services.some(s => s.toLowerCase().includes(query));
        if (!matchName && !matchAddress && !matchServices) return false;
      }

      return true;
    });
  }

  // --- Renderização dos Marcadores no Mapa ---
  function updateMapMarkers() {
    if (!mapTeaser) return;

    // Limpar marcadores existentes
    Object.values(markersModal).forEach(marker => mapTeaser.removeLayer(marker));
    markersModal = {};

    const filtered = getFilteredUnits();

    filtered.forEach(unit => {
      const icon = createCustomIcon(unit);
      const marker = L.marker(unit.coords, { icon: icon }).addTo(mapTeaser);

      // Popup simples
      const popupContent = `
        <div class="map-popup-card">
          <strong style="color:#00215D; font-size:14px;">${unit.shortName}</strong>
          <p style="margin:4px 0; font-size:12px; color:#ccc;">${unit.address}</p>
          <a href="javascript:void(0)" onclick="window.selectUnitFromMap('${unit.id}')" style="color:#00215D; font-size:12px; text-decoration:underline; font-weight:bold;">Ver Detalhes da Base &rarr;</a>
        </div>
      `;
      marker.bindPopup(popupContent);

      marker.on('click', () => {
        selectUnit(unit.id);
      });

      markersModal[unit.id] = marker;
    });
  }

  // Expor seleção global via popup
  window.selectUnitFromMap = function(unitId) {
    selectUnit(unitId);
  };

  // --- Renderizar Lista de Unidades ---
  function renderUnitsList() {
    if (!modalStoresListContainer) return;

    const filtered = getFilteredUnits();

    if (modalResultsInfo) {
      modalResultsInfo.textContent = `${filtered.length} ${filtered.length === 1 ? 'base operacional encontrada' : 'bases operacionais encontradas'}`;
    }

    if (filtered.length === 0) {
      modalStoresListContainer.innerHTML = `
        <div class="no-results-box" style="padding:24px; text-align:center; color:#888;">
          <p>Nenhuma base operacional encontrada para a busca realizada.</p>
        </div>
      `;
      return;
    }

    let html = '';
    filtered.forEach(unit => {
      const isSelected = activeUnitId === unit.id;
      html += `
        <div class="teaser-store-card ${isSelected ? 'active' : ''}" data-id="${unit.id}">
          <div class="store-card-header">
            <h4 class="store-title">${unit.name}</h4>
            <span class="store-rating"><svg width="12" height="12" viewBox="0 0 24 24" fill="#00215D"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> ${unit.rating}</span>
          </div>
          <p class="store-address">${unit.address}</p>
          <div class="store-contact-row">
            <span class="store-phone">${unit.phone}</span>
          </div>
          <div class="store-actions">
            <button class="btn-detail" onclick="window.selectUnitFromMap('${unit.id}')">Ver Detalhes & Engenharia</button>
          </div>
        </div>
      `;
    });

    modalStoresListContainer.innerHTML = html;

    // Eventos de clique nos cards
    const cards = modalStoresListContainer.querySelectorAll('.teaser-store-card');
    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.tagName.toLowerCase() === 'button') return;
        const id = card.getAttribute('data-id');
        selectUnit(id);
      });
    });
  }

  // --- Selecionar Unidade para Exibir Detalhes ---
  function selectUnit(id) {
    const unit = window.units.find(u => u.id === id);
    if (!unit) return;

    activeUnitId = id;

    // Atualizar classe ativa na lista
    if (modalStoresListContainer) {
      const cards = modalStoresListContainer.querySelectorAll('.teaser-store-card');
      cards.forEach(c => {
        if (c.getAttribute('data-id') === id) {
          c.classList.add('active');
        } else {
          c.classList.remove('active');
        }
      });
    }

    // Centralizar no Mapa
    if (mapTeaser && unit.coords) {
      mapTeaser.flyTo(unit.coords, 10, { animate: true, duration: 1.2 });
      if (markersModal[id]) {
        markersModal[id].openPopup();
      }
    }

    // Renderizar painel de detalhes se existir
    if (modalDetailCardContent) {
      renderUnitDetailContent(unit);
    }
  }

  function renderUnitDetailContent(unit) {
    let servicesHTML = '';
    if (unit.services) {
      servicesHTML = unit.services.map(s => `<li style="font-size:12px; margin-bottom:4px; color:#ccc;">✓ ${s}</li>`).join('');
    }

    let albumHTML = '';
    if (unit.images && unit.images.album) {
      albumHTML = unit.images.album.map((img, idx) => `
        <div class="album-thumb" onclick="window.openAlbumLightbox('${unit.id}', ${idx})" style="cursor:pointer; position:relative; border-radius:6px; overflow:hidden; border:1px solid rgba(0, 33, 93, 0.2);">
          <img src="${img.url}" alt="${img.title}" style="width:100%; height:70px; object-fit:cover; display:block;" />
          <span style="position:absolute; bottom:0; left:0; right:0; background:rgba(0,0,0,0.7); font-size:10px; padding:2px 4px; color:#fff; text-align:center;">${img.title}</span>
        </div>
      `).join('');
    }

    modalDetailCardContent.innerHTML = `
      <div class="unit-detail-wrapper" style="padding:16px; color:#fff;">
        <h3 style="color:#00215D; font-size:18px; margin-bottom:8px;">${unit.name}</h3>
        <p style="font-size:13px; color:#aaa; margin-bottom:12px;">${unit.address}</p>
        <p style="font-size:13px; line-height:1.5; color:#ddd; margin-bottom:16px;">${unit.aboutText}</p>

        <h4 style="font-size:14px; color:#00215D; margin-bottom:8px; text-transform:uppercase; letter-spacing:0.05em;">Capacidades Técnicas & Serviços</h4>
        <ul style="list-style:none; padding:0; margin-bottom:16px;">
          ${servicesHTML}
        </ul>

        ${albumHTML ? `
          <h4 style="font-size:14px; color:#00215D; margin-bottom:8px; text-transform:uppercase; letter-spacing:0.05em;">Registros de Operações & Inspeções</h4>
          <div class="unit-album-grid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(100px, 1fr)); gap:8px; margin-bottom:16px;">
            ${albumHTML}
          </div>
        ` : ''}

        <div class="unit-contact-box" style="background:rgba(22,31,44,0.8); padding:12px; border-radius:8px; border:1px solid rgba(0, 33, 93, 0.2);">
          <p style="font-size:13px; margin:0 0 6px 0;"><strong>Contato Operacional:</strong> ${unit.phone}</p>
          <p style="font-size:13px; margin:0 0 8px 0;"><strong>E-mail:</strong> ${unit.email}</p>
          <a href="${unit.googleMapsUrl}" target="_blank" rel="noopener" style="display:inline-block; background:#00215D; color:#080c14; padding:6px 12px; border-radius:4px; font-weight:bold; font-size:12px; text-decoration:none;">Abrir no Google Maps &rarr;</a>
        </div>
      </div>
    `;

    if (modalListView) modalListView.style.display = 'none';
    if (modalDetailView) modalDetailView.style.display = 'block';
  }

  // Botão de voltar para a lista
  if (modalBackToListBtn) {
    modalBackToListBtn.addEventListener('click', () => {
      if (modalDetailView) modalDetailView.style.display = 'none';
      if (modalListView) modalListView.style.display = 'block';
    });
  }

  // --- Lightbox para fotos de operações ---
  window.openAlbumLightbox = function(unitId, index) {
    const unit = window.units.find(u => u.id === unitId);
    if (!unit || !unit.images || !unit.images.album) return;

    currentAlbumImages = unit.images.album;
    currentAlbumIndex = index;

    updateLightboxImage();
    if (lightbox) lightbox.style.display = 'flex';
  };

  function updateLightboxImage() {
    if (!currentAlbumImages[currentAlbumIndex]) return;
    const item = currentAlbumImages[currentAlbumIndex];
    if (lightboxImg) lightboxImg.src = item.url;
    if (lightboxCaption) lightboxCaption.textContent = item.title;
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      if (lightbox) lightbox.style.display = 'none';
    });
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', () => {
      if (currentAlbumImages.length === 0) return;
      currentAlbumIndex = (currentAlbumIndex - 1 + currentAlbumImages.length) % currentAlbumImages.length;
      updateLightboxImage();
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', () => {
      if (currentAlbumImages.length === 0) return;
      currentAlbumIndex = (currentAlbumIndex + 1) % currentAlbumImages.length;
      updateLightboxImage();
    });
  }

  // --- Inicialização do Mapa Leaflet ---
  function initMap() {
    const mapElement = document.getElementById('teaser-map-container');
    if (!mapElement || typeof L === 'undefined') return;

    // Centro inicial do mapa (Brasil)
    mapTeaser = L.map('teaser-map-container', {
      center: [-15.7801, -47.9292],
      zoom: 4,
      scrollWheelZoom: false
    });

    // Dark Tile Layer (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
      maxZoom: 18
    }).addTo(mapTeaser);

    updateMapMarkers();
    renderUnitsList();
  }

  // Eventos de Busca
  if (modalSearchInput) {
    modalSearchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      if (modalClearSearchBtn) {
        modalClearSearchBtn.style.display = searchQuery.length > 0 ? 'block' : 'none';
      }
      updateMapMarkers();
      renderUnitsList();
    });
  }

  if (modalClearSearchBtn) {
    modalClearSearchBtn.addEventListener('click', () => {
      searchQuery = '';
      if (modalSearchInput) modalSearchInput.value = '';
      modalClearSearchBtn.style.display = 'none';
      updateMapMarkers();
      renderUnitsList();
    });
  }

  // Inicializar se o elemento existir
  initMap();
});
