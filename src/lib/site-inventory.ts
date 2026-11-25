export type SitePageKind = "Institucional" | "Solução";

export type SitePage = {
  title: string;
  routePath: string;
  kind: SitePageKind;
};

export const sitePages: SitePage[] = [
  { title: "Página inicial", routePath: "/", kind: "Institucional" },
  { title: "Sobre nós", routePath: "/sobre-nos.html", kind: "Institucional" },
  { title: "Política de privacidade", routePath: "/politica-de-privacidade.html", kind: "Institucional" },
  { title: "Engenharia de Integridade Estrutural", routePath: "/1-solucao-engenharia-de-integridade-estrutural.html", kind: "Solução" },
  { title: "Inspeção em Obras de Artes Especiais", routePath: "/2-solucao-inspecao-em-obras-de-artes-especiais.html", kind: "Solução" },
  { title: "Ensaios Não Destrutivos (ENDs)", routePath: "/3-solucao-ensaios-nao-destrutivos-ends.html", kind: "Solução" },
  { title: "Engenharia de Soldagem", routePath: "/4-solucao-engenharia-de-soldagem.html", kind: "Solução" },
  { title: "Gerenciamento de Projetos", routePath: "/5-solucao-gerenciamento-de-projetos.html", kind: "Solução" },
  { title: "Elaboração de Projetos Mecânicos", routePath: "/6-solucao-elaboracao-de-projetos-mecanicos.html", kind: "Solução" },
  { title: "Soluções Tecnológicas Integradas", routePath: "/7-solucao-solucoes-tecnologicas-integradas.html", kind: "Solução" },
  { title: "Inspeção e Adequação Normativa", routePath: "/8-solucao-inspecao-e-adequacao-normativa.html", kind: "Solução" },
  { title: "Calibração de Instrumentos", routePath: "/9-solucao-calibracao-de-instrumentos.html", kind: "Solução" },
  { title: "Trepanação (Hot Tapping)", routePath: "/10-solucao-trepanacao-hot-tapping.html", kind: "Solução" },
  { title: "Certificação de Matéria-Prima", routePath: "/11-solucao-certificacao-de-materia-prima.html", kind: "Solução" },
  { title: "Consultoria e Assessoria Técnica", routePath: "/12-solucao-consultoria-e-assessoria-tecnica.html", kind: "Solução" },
];

export const siteInventory = {
  publicPages: sitePages.length,
  services: sitePages.filter((page) => page.kind === "Solução").length,
  ffsMechanisms: 12,
  mediaFiles: 361,
};
