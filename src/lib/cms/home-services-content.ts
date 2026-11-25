import { load } from "cheerio";

export const homeServiceItems = [
  { id: 0, title: "Gerenciamento de Projetos" },
  { id: 1, title: "Inspeção em Obras de Artes Especiais" },
  { id: 2, title: "Ensaios Não Destrutivos (ENDs)" },
  { id: 3, title: "Engenharia de Soldagem" },
  { id: 4, title: "Engenharia de Integridade Estrutural" },
  { id: 5, title: "Soluções Tecnológicas Integradas" },
  { id: 6, title: "Inspeção e Adequação Normativa" },
  { id: 7, title: "Calibração de Instrumentos" },
  { id: 8, title: "Trepanação (Hot Tapping)" },
  { id: 9, title: "Certificação de Matéria-Prima" },
  { id: 10, title: "Consultoria e Assessoria Técnica" },
  { id: 11, title: "Elaboração de Projetos Mecânicos" },
] as const;

export type HomeServiceOrder = number[];

export const defaultHomeServiceOrder: HomeServiceOrder = [4, 1, 2, 3, 0, 11, 5, 6, 7, 8, 9, 10];

export function normalizeHomeServiceOrder(value: unknown): HomeServiceOrder {
  const expected = homeServiceItems.map((service) => service.id);
  if (
    !Array.isArray(value)
    || value.length !== expected.length
    || !value.every((id): id is number => Number.isInteger(id) && expected.includes(id))
    || new Set(value).size !== expected.length
  ) {
    throw new Error("A ordem precisa incluir cada uma das 12 soluções uma única vez.");
  }
  return [...value];
}

export function appendHomeServiceOrder(markup: string, values: HomeServiceOrder | null) {
  if (!values) return markup;
  let order: HomeServiceOrder;
  try {
    order = normalizeHomeServiceOrder(values);
  } catch {
    return markup;
  }
  const $ = load(markup);
  $("#cms-home-service-order").remove();
  const script = $("<script>")
    .attr({ id: "cms-home-service-order", type: "application/json" })
    .text(JSON.stringify(order));
  const body = $("body");
  if (body.length) body.append(script);
  else $.root().append(script);
  return $.html();
}
