// Banco de dados oficial de Bases Operacionais e Unidades da ENDCONTROL Engenharia
// Contém informações de localização, áreas de atuação e dados de contato de cada base regional.

window.units = [
  {
    id: "matriz-belem",
    name: "Matriz & Centro de Inteligência Belém",
    shortName: "Matriz Belém",
    coords: [-1.450284, -48.479532],
    address: "Av. Alcindo Cacela, 2120 - Nazaré / Cremação, Belém - PA, CEP 66040-020",
    phone: "+55 (91) 3200-1000",
    email: "contato@endcontrol.com.br",
    googleMapsUrl: "https://maps.google.com/?q=-1.450284,-48.479532",
    rating: 4.9,
    reviewsCount: 185,
    hours: "Seg a Sex: 08h às 18h. Plantão 24/7 para emergências operacionais.",
    hoursDetail: {
      weekday: "08:00 - 18:00",
      saturday: "Plantão Emergencial",
      sunday: "Plantão Emergencial"
    },
    subbrands: ["integridade", "ativos", "ensaios", "normativa", "tecnologia"],
    services: [
      "Engenharia de Integridade Estrutural",
      "Inspeção NR-13 (Vasos, Caldeiras e Tubulações)",
      "Ensaios Não Destrutivos Avançados (Phased Array, TOFD, Ultrassom)",
      "Adequação NR-12 e Segurança Mecânica",
      "Consultoria RBI (Inspeção Baseada em Risco)",
      "Laboratório Técnico de Calibração"
    ],
    aboutText: "A Matriz Belém é o centro de inteligência e governança técnica da ENDCONTROL Engenharia no Norte do Brasil. Equipada com laboratório de ensaios avançados e centro de gestão de dados operacionais, coordena grandes contratos industriais na região amazônica e operações offshore/onshore.",
    images: {
      cover: "./assets/Paginas Imgs/HOME/S1 TOPO/topo-f (1).webp",
      album: [
        { title: "Centro Tecnológico e Operacional", url: "./assets/Paginas Imgs/HOME/S1 TOPO/topo-f (1).webp" },
        { title: "Equipe Técnica e Engenharia de Integridade", url: "./assets/Fotografias/editadas/operacional-engenheiros-inspecao-bomba-edit.webp" },
        { title: "Inspeção de Tubulações Críticas", url: "./assets/Fotografias/editadas/operacional-inspecao-ultrassom-casco-estrutura-edit.webp" }
      ]
    },
    googleReviews: [
      { author: "Gerência de SMS - Mineração", rating: 5, text: "Excelência técnica em laudos de integridade estrutural e cumprimento rigoroso das normas regulamentadoras.", date: "há 1 mês" },
      { author: "Engenharia de Manutenção - Óleo & Gás", rating: 5, text: "A aplicação da metodologia RBI e ENDs avançados reduziu drasticamente nosso tempo de parada não programada.", date: "há 2 meses" }
    ]
  },
  {
    id: "base-paragominas-carajas",
    name: "Base Operacional Paragominas & Carajás",
    shortName: "Base Paragominas/Carajás",
    coords: [-2.9961, -47.3533],
    address: "Distrito Industrial, Paragominas - PA / Canaã dos Carajás - PA",
    phone: "+55 (91) 98400-2000",
    email: "operacoes.pa@endcontrol.com.br",
    googleMapsUrl: "https://maps.google.com/?q=-2.9961,-47.3533",
    rating: 4.9,
    reviewsCount: 92,
    hours: "Operação Contínua em Planta Industrial 24/7.",
    hoursDetail: {
      weekday: "07:30 - 17:30 (Base) / 24h Campo",
      saturday: "24h Campo",
      sunday: "24h Campo"
    },
    subbrands: ["integridade", "ativos", "ensaios", "normativa"],
    services: [
      "Inspeção de Correias Transportadoras e Minerodutos",
      "Medição de Espessura por Ultrassom em Campo",
      "Análise de Vibração e Alinhamento a Laser",
      "Acesso por Cordas (Irata / Abendi)",
      "Laudos NR-11 para Pontes Rolantes e Encroadas"
    ],
    aboutText: "Base móvel e fixa especializada no atendimento direto aos grandes complexos minerários e de alumina no Pará (Hydro, Vale). Equipes especializadas prontas para atendimento imediato em paradas de fábrica e auditorias de segurança.",
    images: {
      cover: "./assets/Fotografias/editadas/operacional-alpinismo-industrial-escada-tanque-edit.webp",
      album: [
        { title: "Inspeção e Acesso em Mineração", url: "./assets/Fotografias/editadas/operacional-alpinismo-industrial-escada-tanque-edit.webp" },
        { title: "Ensaios em Minerodutos", url: "./assets/Fotografias/editadas/operacional-ultrassom-solda-tubulacao-edit-final.webp" }
      ]
    },
    googleReviews: [
      { author: "Coordenação de Integridade de Ativos", rating: 5, text: "Agilidade impressionante na mobilização de equipes de acesso por cordas e ensaios não destrutivos.", date: "há 3 semanas" }
    ]
  },
  {
    id: "unidade-sp",
    name: "Unidade de Negócios & Engenharia São Paulo",
    shortName: "Unidade São Paulo",
    coords: [-23.55052, -46.633308],
    address: "Av. Paulista / Santo André, São Paulo - SP",
    phone: "+55 (11) 4003-8890",
    email: "sp@endcontrol.com.br",
    googleMapsUrl: "https://maps.google.com/?q=-23.55052,-46.633308",
    rating: 5.0,
    reviewsCount: 140,
    hours: "Seg a Sex: 08h às 18h.",
    hoursDetail: {
      weekday: "08:00 - 18:00",
      saturday: "Plantão",
      sunday: "Plantão"
    },
    subbrands: ["integridade", "tecnologia", "normativa"],
    services: [
      "Consultoria de Integridade de Ativos Críticos",
      "Modelagem 3D & Simulação Numérica (FEA / CFD)",
      "Inteligência Artificial aplicada a diagnósticos industriais",
      "Gestão de Conformidade Regulatória em Nível Nacional"
    ],
    aboutText: "Representação estratégica e polo de inovação em São Paulo. Desenvolve algoritmos de IA e modelos de simulação computacional aplicados à previsão de vida útil de equipamentos e gestão de ativos de grandes indústrias químicas, alimentícias e energéticas.",
    images: {
      cover: "./assets/Fotografias/editadas/laboratorio-analise-placa-eletronica-edit.webp",
      album: [
        { title: "Hub Tecnológico e Simulação Computacional", url: "./assets/Fotografias/editadas/laboratorio-analise-placa-eletronica-edit.webp" }
      ]
    },
    googleReviews: [
      { author: "Diretoria de Operações Industriais", rating: 5, text: "Parceiro fundamental na implantação de diagnósticos preditivos e análise de elementos finitos.", date: "há 1 mês" }
    ]
  },
  {
    id: "unidade-rj",
    name: "Base Offshore & Industrial Rio de Janeiro",
    shortName: "Base Rio de Janeiro / Macaé",
    coords: [-22.9068, -43.1729],
    address: "Centro / Macaé, Rio de Janeiro - RJ",
    phone: "+55 (21) 3900-5500",
    email: "rj@endcontrol.com.br",
    googleMapsUrl: "https://maps.google.com/?q=-22.9068,-43.1729",
    rating: 4.9,
    reviewsCount: 110,
    hours: "Seg a Sex: 08h às 18h. Suporte Offshore 24h.",
    hoursDetail: {
      weekday: "08:00 - 18:00",
      saturday: "Suporte 24h",
      sunday: "Suporte 24h"
    },
    subbrands: ["integridade", "ativos", "ensaios"],
    services: [
      "Inspeção Onshore & Offshore (FPSO / Plat.),",
      "Ensaios Não Destrutivos por Partículas Magnéticas e Líquido Penetrante",
      "Inspeção de Caldeiras e Vasos sob Pressão (NR-13 Offshore)",
      "Vistorias de Rigging e Estruturas de Elevação"
    ],
    aboutText: "Especializada no setor de Óleo & Gás e Naval. Presta serviços de engenharia de confiabilidade e inspeção técnica para operadoras de E&P na Bacia de Campos e Santos.",
    images: {
      cover: "./assets/Fotografias/editadas/operacional-tecnico-refinaria-noite-edit.webp",
      album: [
        { title: "Inspeções em Plataformas e Navios", url: "./assets/Fotografias/editadas/operacional-tecnico-refinaria-noite-edit.webp" }
      ]
    },
    googleReviews: [
      { author: "Gerência Técnica Offshore - Petrobras / SBM", rating: 5, text: "Relatórios de conformidade e integridade com alto nível de precisão e aprovação rápida em auditorias.", date: "há 2 meses" }
    ]
  },
  {
    id: "unidade-ba",
    name: "Base Operacional Nordeste I — Salvador & Camaçari",
    shortName: "Base Salvador (BA)",
    coords: [-12.9777, -38.5016],
    address: "Polo Industrial de Camaçari / Salvador - BA",
    phone: "+55 (71) 3400-3300",
    email: "ba@endcontrol.com.br",
    googleMapsUrl: "https://maps.google.com/?q=-12.9777,-38.5016",
    rating: 4.9,
    reviewsCount: 78,
    hours: "Seg a Sex: 08h às 18h.",
    hoursDetail: {
      weekday: "08:00 - 18:00",
      saturday: "Plantão",
      sunday: "Plantão"
    },
    subbrands: ["integridade", "ativos", "ensaios", "normativa"],
    services: [
      "Inspeções em Reatores e Vasos Químicos",
      "Adequação Normativa NR-13 para Polo Petroquímico",
      "Termografia Infravermelha e Ultrassom Phased Array",
      "Testes Hidrostáticos e Ensaio Estanqueidade"
    ],
    aboutText: "Suporte especializado para indústrias petroquímicas, químicas e siderúrgicas no Polo de Camaçari e região metropolitana de Salvador.",
    images: {
      cover: "./assets/Fotografias/editadas/operacional-inspecao-ultrassom-casco-estrutura-edit.webp",
      album: [
        { title: "Inspeções no Polo Petroquímico", url: "./assets/Fotografias/editadas/operacional-inspecao-ultrassom-casco-estrutura-edit.webp" }
      ]
    },
    googleReviews: [
      { author: "Engenharia de Confiabilidade - Camaçari", rating: 5, text: "Excelente atendimento em testes de estanqueidade e ensaios de ultrassom.", date: "há 1 mês" }
    ]
  },
  {
    id: "unidade-ce",
    name: "Base Operacional Nordeste II — Fortaleza & Pecém",
    shortName: "Base Fortaleza (CE)",
    coords: [-3.7319, -38.5267],
    address: "Complexo Industrial e Portuário do Pecém / Fortaleza - CE",
    phone: "+55 (85) 3200-4400",
    email: "ce@endcontrol.com.br",
    googleMapsUrl: "https://maps.google.com/?q=-3.7319,-38.5267",
    rating: 4.8,
    reviewsCount: 64,
    hours: "Seg a Sex: 08h às 18h.",
    hoursDetail: {
      weekday: "08:00 - 18:00",
      saturday: "Plantão",
      sunday: "Plantão"
    },
    subbrands: ["integridade", "ativos", "ensaios"],
    services: [
      "Inspeção de Turbinas Eólicas e Pás de Alavanca",
      "Vistorias Portuárias e Equipamentos de Carga (NR-11)",
      "Ensaios Não Destrutivos por Correntes Parasitas"
    ],
    aboutText: "Atendimento focado em energia renovável (eólica/solar), infraestrutura portuária no Pecém e indústrias farmacêuticas e alimentícias no Ceará.",
    images: {
      cover: "./assets/Fotografias/editadas/ultrassom-raptor-scan-crawler-operacao-edit.webp",
      album: [
        { title: "Inspeção em Parques Eólicos e Estruturas", url: "./assets/Fotografias/editadas/ultrassom-raptor-scan-crawler-operacao-edit.webp" }
      ]
    },
    googleReviews: [
      { author: "Manutenção Eólica Ceará", rating: 5, text: "Profissionais qualificados e relatórios técnicos impecáveis.", date: "há 2 meses" }
    ]
  },
  {
    id: "unidade-ro-ac",
    name: "Base Operacional Norte II — Rondônia & Acre",
    shortName: "Base Porto Velho (RO) & Rio Branco (AC)",
    coords: [-8.7619, -63.9039],
    address: "Porto Velho - RO / Rio Branco - AC",
    phone: "+55 (69) 3200-7700",
    email: "norte2@endcontrol.com.br",
    googleMapsUrl: "https://maps.google.com/?q=-8.7619,-63.9039",
    rating: 5.0,
    reviewsCount: 52,
    hours: "Seg a Sex: 08h às 18h.",
    hoursDetail: {
      weekday: "08:00 - 18:00",
      saturday: "Plantão",
      sunday: "Plantão"
    },
    subbrands: ["integridade", "ativos", "normativa"],
    services: [
      "Inspeção de Tanques de Armazenamento de Combustíveis",
      "Laudos NR-13 para Termelétricas e Usinas Hidrelétricas",
      "Calibração de Válvulas de Segurança (PSV)"
    ],
    aboutText: "Base estratégica cobrindo o sudoeste da Amazônia, atendendo usinas hidrelétricas (Santo Antônio, Jirau), distribuidores de combustíveis e agroindústrias.",
    images: {
      cover: "./assets/Fotografias/editadas/operacional-engenheiros-inspecao-bomba-edit.webp",
      album: [
        { title: "Inspeção em Tanques e Hidrelétricas", url: "./assets/Fotografias/editadas/operacional-engenheiros-inspecao-bomba-edit.webp" }
      ]
    },
    googleReviews: [
      { author: "Supervisão de Manutenção Usinas RO", rating: 5, text: "Serviço de alta precisão em válvulas de segurança e tanques de armazenamento.", date: "há 1 mês" }
    ]
  }
];
