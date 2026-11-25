import { load } from "cheerio";

export const navigationPrimaryIds = ["home", "about", "solutions", "contact"] as const;
export type NavigationPrimaryId = (typeof navigationPrimaryIds)[number];

export const navigationGroupIds = ["engineering", "inspection", "projects"] as const;
export type NavigationGroupId = (typeof navigationGroupIds)[number];

export type NavigationPrimaryItem = {
  id: NavigationPrimaryId;
  label: string;
  href: string | null;
};

export type NavigationServiceItem = {
  id: string;
  label: string;
  href: string;
};

export type NavigationGroup = {
  id: NavigationGroupId;
  title: string;
  description: string;
  services: NavigationServiceItem[];
};

export type NavigationContent = {
  primary: NavigationPrimaryItem[];
  groups: NavigationGroup[];
};

export const defaultNavigationContent: NavigationContent = {
  primary: [
    { id: "home", label: "Home", href: "index.html#home" },
    { id: "about", label: "Sobre Nós", href: "sobre-nos.html" },
    { id: "solutions", label: "Nossas Soluções", href: null },
    { id: "contact", label: "Fale com Especialista", href: "https://wa.me/5591984040710" },
  ],
  groups: [
    {
      id: "engineering",
      title: "Engenharia e Integridade",
      description: "Confiabilidade para ativos críticos e operações industriais.",
      services: [
        { id: "0", label: "Engenharia de Integridade Estrutural", href: "1-solucao-engenharia-de-integridade-estrutural.html" },
        { id: "3", label: "Engenharia de Soldagem", href: "4-solucao-engenharia-de-soldagem.html" },
        { id: "10", label: "Trepanação (Hot Tapping)", href: "10-solucao-trepanacao-hot-tapping.html" },
      ],
    },
    {
      id: "inspection",
      title: "Inspeção e Conformidade",
      description: "Controle técnico, segurança e adequação às normas.",
      services: [
        { id: "1", label: "Inspeção em Obras de Artes Especiais", href: "2-solucao-inspecao-em-obras-de-artes-especiais.html" },
        { id: "2", label: "Ensaios Não Destrutivos (ENDs)", href: "3-solucao-ensaios-nao-destrutivos-ends.html" },
        { id: "8", label: "Inspeção e Adequação Normativa", href: "8-solucao-inspecao-e-adequacao-normativa.html" },
        { id: "9", label: "Calibração de Instrumentos", href: "9-solucao-calibracao-de-instrumentos.html" },
      ],
    },
    {
      id: "projects",
      title: "Projetos e Tecnologia",
      description: "Soluções sob medida para cada desafio de engenharia.",
      services: [
        { id: "4", label: "Gerenciamento de Projetos", href: "5-solucao-gerenciamento-de-projetos.html" },
        { id: "5", label: "Elaboração de Projetos Mecânicos", href: "6-solucao-elaboracao-de-projetos-mecanicos.html" },
        { id: "6", label: "Soluções Tecnológicas Integradas", href: "7-solucao-solucoes-tecnologicas-integradas.html" },
        { id: "11", label: "Certificação de Matéria-Prima", href: "11-solucao-certificacao-de-materia-prima.html" },
        { id: "12", label: "Consultoria e Assessoria Técnica", href: "12-solucao-consultoria-e-assessoria-tecnica.html" },
      ],
    },
  ],
};

const serviceIdsByGroup: Record<NavigationGroupId, string[]> = {
  engineering: ["0", "3", "10"],
  inspection: ["1", "2", "8", "9"],
  projects: ["4", "5", "6", "11", "12"],
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function safeLink(value: unknown): value is string {
  if (typeof value !== "string" || !value.trim() || value.length > 2_048 || /[\u0000-\u001f\u007f<>\\]/.test(value)) return false;
  if (/^https?:\/\//i.test(value)) {
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }
  if (/^(?:mailto:|tel:)/i.test(value)) return true;
  if (value.startsWith("//") || /^[a-z][a-z\d+.-]*:/i.test(value)) return false;
  return true;
}

function boundedText(value: unknown, max: number): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= max;
}

function isExactPermutation<T extends string>(values: unknown, expected: readonly T[]): values is T[] {
  return Array.isArray(values)
    && values.length === expected.length
    && values.every((value): value is T => typeof value === "string" && expected.includes(value as T))
    && new Set(values).size === expected.length;
}

export function normalizeNavigationContent(value: unknown): NavigationContent {
  if (!isRecord(value) || !Array.isArray(value.primary) || !Array.isArray(value.groups)) {
    throw new Error("Confira os itens do menu.");
  }
  if (value.primary.length !== navigationPrimaryIds.length || !value.primary.every(isRecord)) {
    throw new Error("O menu principal precisa manter os quatro itens originais.");
  }
  const primaryIds = value.primary.map((item) => item.id);
  if (!isExactPermutation(primaryIds, navigationPrimaryIds)) throw new Error("A ordem do menu principal está inválida.");

  const primary = value.primary.map((rawItem): NavigationPrimaryItem => {
    if (!isRecord(rawItem) || typeof rawItem.id !== "string" || !navigationPrimaryIds.includes(rawItem.id as NavigationPrimaryId)) {
      throw new Error("Um item do menu principal é inválido.");
    }
    const id = rawItem.id as NavigationPrimaryId;
    if (!boundedText(rawItem.label, 100)) throw new Error("Os rótulos do menu precisam ter até 100 caracteres.");
    const label = rawItem.label.trim();
    if (id === "solutions") {
      return { id, label, href: null };
    }
    if (!safeLink(rawItem.href)) throw new Error("Um dos links do menu não é válido.");
    return { id, label, href: rawItem.href };
  });

  if (value.groups.length !== navigationGroupIds.length || !value.groups.every(isRecord)) {
    throw new Error("O submenu precisa manter os três grupos originais.");
  }
  const groupIds = value.groups.map((group) => group.id);
  if (!isExactPermutation(groupIds, navigationGroupIds)) throw new Error("A ordem dos grupos do submenu está inválida.");

  const groups = value.groups.map((rawGroup): NavigationGroup => {
    if (!isRecord(rawGroup) || typeof rawGroup.id !== "string" || !navigationGroupIds.includes(rawGroup.id as NavigationGroupId)) {
      throw new Error("Um grupo do submenu é inválido.");
    }
    if (!boundedText(rawGroup.title, 100) || !boundedText(rawGroup.description, 240)) {
      throw new Error("Confira os títulos e descrições dos grupos do submenu.");
    }
    const groupId = rawGroup.id as NavigationGroupId;
    if (!Array.isArray(rawGroup.services) || rawGroup.services.length !== serviceIdsByGroup[groupId].length || !rawGroup.services.every(isRecord)) {
      throw new Error("Um grupo do submenu está incompleto.");
    }
    const rawServices = rawGroup.services as Array<Record<string, unknown>>;
    const serviceIds = rawServices.map((service) => service.id);
    if (!isExactPermutation(serviceIds, serviceIdsByGroup[groupId])) throw new Error("A ordem dos serviços do submenu está inválida.");
    const services = rawServices.map((service): NavigationServiceItem => {
      if (!boundedText(service.label, 140) || !safeLink(service.href)) {
        throw new Error("Confira os rótulos e links dos serviços no menu.");
      }
      return { id: service.id as string, label: service.label.trim(), href: service.href };
    });
    return { id: groupId, title: rawGroup.title.trim(), description: rawGroup.description.trim(), services };
  });

  return { primary, groups };
}

function scriptJson(value: unknown) {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}

function appendJsonPayload(markup: string, id: string, value: unknown) {
  const source = markup.charCodeAt(0) === 0xfeff ? markup.slice(1) : markup;
  const $ = load(source);
  $(`#${id}`).remove();
  const script = $("<script>").attr({ id, type: "application/json" }).text(scriptJson(value));
  const body = $("body");
  if (body.length) body.append(script);
  else $.root().append(script);
  return $.html();
}

export function applyNavigationContent(markup: string, values: NavigationContent | null) {
  if (!values) return markup;
  let content: NavigationContent;
  try {
    content = normalizeNavigationContent(values);
  } catch {
    return markup;
  }

  const source = markup.charCodeAt(0) === 0xfeff ? markup.slice(1) : markup;
  const $ = load(source);
  const nav = $("nav.main-menu").first();
  if (nav.length) {
    const primaryNodes: Record<NavigationPrimaryId, ReturnType<typeof nav.children>[number] | undefined> = {
      home: undefined,
      about: undefined,
      solutions: undefined,
      contact: undefined,
    };
    const home = nav.children("a").not(".btn-contacts-menu, #menu-link-sobre").first();
    const about = nav.children("#menu-link-sobre").first();
    const solutions = nav.children(".dropdown").first();
    const contact = nav.children(".btn-contacts-menu").first();
    if (home.length) primaryNodes.home = home[0];
    if (about.length) primaryNodes.about = about[0];
    if (solutions.length) primaryNodes.solutions = solutions[0];
    if (contact.length) primaryNodes.contact = contact[0];

    for (const item of content.primary) {
      const node = primaryNodes[item.id];
      if (!node) continue;
      const $node = $(node);
      $node.attr("data-cms-nav-item", item.id);
      const retainsDefaultContactLink = item.id === "contact"
        && item.href === defaultNavigationContent.primary.find((candidate) => candidate.id === "contact")?.href;
      if (item.href !== null && !retainsDefaultContactLink) $node.attr("href", item.href);
      if (item.id === "solutions") $node.find(".drop-link").first().empty().text(item.label);
      else $node.empty().text(item.label);
    }
    const orderedNodes = content.primary.map((item) => primaryNodes[item.id]).filter((node) => node !== undefined);
    for (const node of orderedNodes) nav.append(node);
  }

  for (const group of content.groups) {
    for (const service of group.services) {
      const item = $(`[data-service-id="${service.id}"]`).first();
      if (!item.length) continue;
      item.attr({ href: service.href, "data-cms-nav-service": service.id });
      const primaryLabel = item.find(".dropdown-item-text").first();
      if (primaryLabel.length) primaryLabel.text(service.label);
      else item.children("span").not(".submenuzinho-bullet").first().text(service.label);
    }
  }

  return appendJsonPayload($.html(), "cms-navigation-content", {
    groups: content.groups.map((group) => ({
      id: group.id,
      title: group.title,
      description: group.description,
      serviceIds: group.services.map((service) => service.id),
    })),
  });
}
