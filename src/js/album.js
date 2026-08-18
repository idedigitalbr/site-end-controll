/* ==========================================================================
   LÓGICA DO ÁLBUM DE FOTOS - ENDCONTROL ENGENHARIA
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Banco de dados de fotos da ENDCONTROL Engenharia
    const albumPhotos = [
        // Integridade Estrutural & Projetos
        {
            "name": "Inspeção em Estruturas de Mineração",
            "role": "Análise visual e dimensional de componentes mecânicos e suporte de carga.",
            "category": "integridade",
            "subcategory": "Estruturas",
            "photo": "./assets/Fotografias/editadas/operacional-engenheiros-inspecao-bomba-edit.webp"
        },
        {
            "name": "Engenharia de Integridade em Plantas Industriais",
            "role": "Avaliação técnica de integridade mecânica em tubulações e dutos.",
            "category": "integridade",
            "subcategory": "Tubulações",
            "photo": "./assets/Fotografias/editadas/operacional-inspecao-ultrassom-casco-estrutura-edit.webp"
        },

        // Inspeção de Ativos Críticos
        {
            "name": "Inspeção de Vasos sob Pressão (NR-13)",
            "role": "Medição de espessura por ultrassom e verificação de taxas de corrosão em campo.",
            "category": "ativos",
            "subcategory": "Vasos de Pressão",
            "photo": "./assets/Fotografias/editadas/operacional-alpinismo-industrial-escada-tanque-edit.webp"
        },
        {
            "name": "Inspeção Interna de Tanques de Armazenamento",
            "role": "Vistoria técnica detalhada para identificação de deformações e desgaste.",
            "category": "ativos",
            "subcategory": "Tanques",
            "photo": "./assets/Fotografias/editadas/operacional-ultrassom-solda-tubulacao-edit-final.webp"
        },

        // Ensaios Não Destrutivos (ENDs)
        {
            "name": "Ensaio de Ultrassom Phased Array (PAUT)",
            "role": "Mapeamento volumétrico de soldas de alta responsabilidade.",
            "category": "ensaios",
            "subcategory": "Ultrassom Avançado",
            "photo": "./assets/Fotografias/editadas/laboratorio-analise-placa-eletronica-edit.webp"
        },
        {
            "name": "Partículas Magnéticas & Líquido Penetrante",
            "role": "Detecção de trincas e descontinuidades superficiais em juntas soldadas.",
            "category": "ensaios",
            "subcategory": "Superficiais",
            "photo": "./assets/Fotografias/editadas/operacional-tecnico-refinaria-noite-edit.webp"
        },

        // Adequação Normativa (NRs)
        {
            "name": "Adequação NR-12 em Maquinário Pesado",
            "role": "Laudo técnico de conformidade e implementação de proteções físicas e lógicas.",
            "category": "normativa",
            "subcategory": "NR-12",
            "photo": "./assets/Fotografias/editadas/operacional-inspecao-ultrassom-casco-estrutura-edit.webp"
        },
        {
            "name": "Inspeção de Válvulas de Segurança (PSVs)",
            "role": "Teste de abertura, calibração e estanqueidade de válvulas de alívio.",
            "category": "normativa",
            "subcategory": "NR-13",
            "photo": "./assets/Fotografias/editadas/ultrassom-raptor-scan-crawler-operacao-edit.webp"
        },

        // Tecnologia & Consultoria
        {
            "name": "Centro de Análise de Dados & Inteligência Artificial",
            "role": "Algoritmos preditivos para gestão do ciclo de vida dos ativos industriais.",
            "category": "tecnologia",
            "subcategory": "Consultoria Preditiva",
            "photo": "./assets/Paginas Imgs/HOME/S1 TOPO/topo-f (1).webp"
        }
    ];

    const categoryNames = {
        'all': 'Todas as Divisões',
        'integridade': 'Integridade Estrutural',
        'ativos': 'Inspeção de Ativos',
        'ensaios': 'Ensaios Não Destrutivos (ENDs)',
        'normativa': 'Adequação Normativa (NRs)',
        'tecnologia': 'Tecnologia & Consultoria'
    };

    let currentFilter = 'all';

    // Elementos DOM
    const photoGrid = document.querySelector('.album-photo-grid');
    const filterButtonsContainer = document.querySelector('.album-filter-buttons');

    if (!photoGrid) return;

    function renderPhotos(photos) {
        photoGrid.innerHTML = '';

        if (photos.length === 0) {
            photoGrid.innerHTML = `
                <div class="no-photos-message" style="grid-column: 1/-1; text-align: center; padding: 40px; color: #888;">
                    <p>Nenhuma imagem encontrada para esta categoria.</p>
                </div>
            `;
            return;
        }

        photos.forEach((item) => {
            const card = document.createElement('div');
            card.className = 'album-card';
            card.innerHTML = `
                <div class="album-card-image-wrapper">
                    <img src="${item.photo}" alt="${item.name}" loading="lazy">
                    <span class="album-card-badge">${categoryNames[item.category] || item.category}</span>
                </div>
                <div class="album-card-body">
                    <h4 class="album-card-title">${item.name}</h4>
                    <p class="album-card-desc">${item.role}</p>
                </div>
            `;

            // Clique para abrir no lightbox se existir
            card.addEventListener('click', () => {
                if (window.openAlbumLightbox) {
                    const idx = albumPhotos.indexOf(item);
                    window.openAlbumLightbox('matriz-belem', idx >= 0 ? idx : 0);
                }
            });

            photoGrid.appendChild(card);
        });
    }

    function filterPhotos(category) {
        currentFilter = category;
        const filtered = category === 'all' 
            ? albumPhotos 
            : albumPhotos.filter(p => p.category === category);
        
        renderPhotos(filtered);

        // Atualizar classe ativa dos botões
        if (filterButtonsContainer) {
            const btns = filterButtonsContainer.querySelectorAll('button');
            btns.forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-category') === category);
            });
        }
    }

    function initFilterButtons() {
        if (!filterButtonsContainer) return;

        filterButtonsContainer.innerHTML = '';

        Object.keys(categoryNames).forEach(key => {
            const btn = document.createElement('button');
            btn.className = `btn-album-filter ${key === 'all' ? 'active' : ''}`;
            btn.setAttribute('data-category', key);
            btn.textContent = categoryNames[key];
            btn.addEventListener('click', () => filterPhotos(key));
            filterButtonsContainer.appendChild(btn);
        });
    }

    initFilterButtons();
    renderPhotos(albumPhotos);
});
