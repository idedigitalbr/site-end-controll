import { load } from "cheerio";

type DomNode = {
  type: string;
  name?: string;
  data?: string;
  attribs?: Record<string, string>;
  parent?: DomNode | null;
  children?: DomNode[];
};

export type EditableTextField = {
  key: string;
  kind: "text";
  managedBy?: "navigation" | "global" | "ffs";
  selector: string;
  textNodeIndex: number;
  value: string;
  label: string;
  /** Tag name of the element holding the text (h1, p, span…). */
  tag?: string;
  /** Human name of the outermost section that contains the text. */
  section?: string;
};

export type EditableImageField = {
  key: string;
  kind: "image";
  selector: string;
  value: string;
  originalValue: string;
  altText: string;
  label: string;
};

export type EditableLinkField = {
  key: string;
  kind: "link";
  selector: string;
  value: string;
  originalValue: string;
  label: string;
};

export type EditableBackgroundImageField = {
  key: string;
  kind: "backgroundImage";
  selector: string;
  value: string;
  originalValue: string;
  styleProperty: "background" | "background-image";
  styleValue: string;
  label: string;
};

export type EditableSectionOrderField = {
  key: string;
  kind: "sectionOrder";
  parentSelector: string;
  value: string[];
  items: Array<{ selector: string; label: string }>;
  label: string;
};

export type EditablePageField =
  | EditableTextField
  | EditableImageField
  | EditableLinkField
  | EditableBackgroundImageField
  | EditableSectionOrderField;

export type PageContentPatch =
  | { key: string; kind: "text"; value: string }
  | { key: string; kind: "image"; value: string; altText: string }
  | { key: string; kind: "link"; value: string }
  | { key: string; kind: "backgroundImage"; value: string }
  | { key: string; kind: "sectionOrder"; value: string[] };

export type PublishedPageMetadata = {
  title: string;
  summary: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl?: string;
};

export type PublicSiteTheme = {
  brandPrimary?: string;
  brandSecondary?: string;
  backgroundPage?: string;
  backgroundPrimary?: string;
  backgroundSecondary?: string;
  backgroundDeep?: string;
  textPrimary?: string;
  textSecondary?: string;
  textMuted?: string;
};

export type PublicSolutionOverride = {
  title: string;
  summary: string | null;
  imageUrl?: string;
  imageAltText?: string;
};

const editableTextContainers = new Set([
  "h1", "h2", "h3", "h4", "h5", "h6", "p", "a", "button", "li", "label", "figcaption",
]);
const ignoredElements = new Set(["script", "style", "noscript", "svg", "template"]);
const solutionCardImageKey = "cms:solution-card-image";
const allowedImageUrl = /^\/media\/[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(?:jpe?g|png|webp|gif|avif)$/i;
const cssBackgroundImageDefinitions = [
  {
    selector: ".svc-techniques-section",
    styleProperty: "background" as const,
    styleValue: "#071324 url('../../assets/Paginas Imgs/SOBRE NOS/REF-SOBRE-NOS/bgs/bg-inox-v1-optimized.webp') center / cover no-repeat",
    label: "Fundo · Técnicas e métodos",
  },
];
const solutionCardImageByRoute: Record<string, string> = {
  "/5-solucao-gerenciamento-de-projetos.html": "./assets/Paginas/SOLUCOES/05-gerenciamento-de-projetos/S2 CARD/endcontrol-institucional-lideranca-gestao-projetos-escritorio.webp",
  "/2-solucao-inspecao-em-obras-de-artes-especiais.html": "./assets/Paginas/SOLUCOES/02-obras-artes-especiais/S2 CARD/obras_arte_especiais_06.webp",
  "/3-solucao-ensaios-nao-destrutivos-ends.html": "./assets/Paginas/SOLUCOES/03-ensaios-nao-destrutivos/S2 CARD/endcontrol-ensaios-nao-destrutivos-ultrassom-medicao-espessura-naval.webp",
  "/4-solucao-engenharia-de-soldagem.html": "./assets/Paginas/SOLUCOES/04-engenharia-de-soldagem/S2 CARD/endcontrol-engenharia-soldagem-qualificacao-soldadores-eps-rqps.webp",
  "/1-solucao-engenharia-de-integridade-estrutural.html": "./assets/Paginas/SOLUCOES/01-integridade-estrutural/S2 CARD/endcontrol-integridade-estrutural-aquisicao-dados-planta-industrial.webp",
  "/7-solucao-solucoes-tecnologicas-integradas.html": "./assets/Paginas/SOLUCOES/07-solucoes-tecnologicas/S2 CARD/endcontrol-consultoria-tecnica-demonstracao-scanner-ultrassom-tubos.webp",
  "/8-solucao-inspecao-e-adequacao-normativa.html": "./assets/Paginas/SOLUCOES/08-adequacao-normativa/S2 CARD/endcontrol-inspecao-altura-nr35-escada-tanque-industrial.webp",
  "/9-solucao-calibracao-de-instrumentos.html": "./assets/Paginas/SOLUCOES/09-calibracao-instrumentos/S2 CARD/endcontrol-calibracao-manometros-pressao-em-campo-nr13.webp",
  "/10-solucao-trepanacao-hot-tapping.html": "./assets/Paginas/SOLUCOES/10-hot-tapping/S2 CARD/trepanacao-hot-tapping-valvula-bloqueio.webp",
  "/11-solucao-certificacao-materia-prima.html": "./assets/Paginas/SOLUCOES/11-certificacao-materia-prima/S2 CARD/endcontrol-laboratorio-ensaio-dureza-digimess-certificacao-materiais.webp",
  "/12-solucao-consultoria-e-assessoria-tecnica.html": "./assets/Paginas/SOLUCOES/12-consultoria-assessoria/S2 CARD/endcontrol-consultoria-tecnica-demonstracao-scanner-ultrassom-tubos.webp",
  "/6-solucao-elaboracao-de-projetos-mecanicos.html": "./assets/Paginas/SOLUCOES/06-projetos-mecanicos/S2 CARD/endcontrol-equipe-escritorio-projetos-mecanicos-engenharia.webp",
};

export function resolveCmsTemplatePath(
  templatePath: string | null | undefined,
  allowedTemplatePaths: readonly string[],
  fallbackPath?: string,
) {
  const rawPath = templatePath ?? fallbackPath;
  if (!rawPath || typeof rawPath !== "string") return null;

  const trimmedPath = rawPath.trim();
  const candidate = trimmedPath === "index.html" ? "/" : trimmedPath;
  if (
    !candidate.startsWith("/") ||
    candidate.includes("\\") ||
    candidate.includes("?") ||
    candidate.includes("#") ||
    candidate.split("/").includes("..")
  ) return null;

  return allowedTemplatePaths.includes(candidate) ? candidate : null;
}

export function routePathFromLegacyRequest(requestedPath: string) {
  const normalized = requestedPath.replaceAll("\\", "/").replace(/^\/+/, "");
  if (!normalized || normalized === "index.html") return "/";
  if (
    normalized.includes("/") ||
    normalized.includes("..") ||
    normalized.includes("?") ||
    normalized.includes("#") ||
    normalized.includes(":") ||
    !normalized.toLowerCase().endsWith(".html")
  ) return null;
  return `/${normalized}`;
}

export function normalizePageSlug(value: string) {
  const trimmed = value.trim();
  if (!trimmed || /[\\/?#:]/.test(trimmed)) return null;

  const slug = trimmed
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!slug || slug.length > 220) return null;
  return `/${slug}.html`;
}

function colorToRgb(value: string) {
  const hex = value.slice(1);
  const red = Number.parseInt(hex.slice(0, 2), 16);
  const green = Number.parseInt(hex.slice(2, 4), 16);
  const blue = Number.parseInt(hex.slice(4, 6), 16);
  return `${red}, ${green}, ${blue}`;
}

export function appendThemeOverrides(css: string, theme: PublicSiteTheme | null) {
  if (!theme) return css;

  const tokenMap: Array<[keyof PublicSiteTheme, string]> = [
    ["brandPrimary", "--brand-primary"],
    ["brandSecondary", "--brand-secondary"],
    ["backgroundPage", "--color-bg-page"],
    ["backgroundPrimary", "--color-bg-primary"],
    ["backgroundSecondary", "--color-bg-secondary"],
    ["backgroundDeep", "--color-bg-deep"],
    ["textPrimary", "--color-text-primary"],
    ["textSecondary", "--color-text-secondary"],
    ["textMuted", "--color-text-muted"],
  ];
  const declarations: string[] = [];

  for (const [field, token] of tokenMap) {
    const value = theme[field];
    if (value === undefined) continue;
    if (typeof value !== "string" || !/^#[0-9a-f]{6}$/i.test(value)) {
      throw new Error(`A cor ${field} é inválida.`);
    }
    declarations.push(`${token}: ${value};`);
    if (field === "brandPrimary") declarations.push(`--brand-primary-rgb: ${colorToRgb(value)};`);
    if (field === "brandSecondary") declarations.push(`--brand-secondary-rgb: ${colorToRgb(value)};`);
  }

  if (declarations.length === 0) return css;
  return `${css}${css.endsWith("\n") || css.length === 0 ? "" : "\n"}:root {\n  ${declarations.join("\n  ")}\n}\n`;
}

function asDomNode(value: unknown): DomNode | null {
  return value && typeof value === "object" ? (value as DomNode) : null;
}

function getSelector(node: DomNode) {
  const segments: string[] = [];
  let current: DomNode | null | undefined = node;

  while (current && current.type !== "root" && current.type !== "document") {
    if (current.type === "tag" && current.name) {
      const currentName = current.name;
      const peers = current.parent?.children?.filter(
        (child) => child.type === "tag" && child.name === currentName,
      ) ?? [];
      const position = peers.indexOf(current) + 1;
      if (position < 1) return "";
      segments.unshift(`${current.name}:nth-of-type(${position})`);
    }
    current = current.parent;
  }

  return segments.join(" > ");
}

export function appendPublicSolutionOverrides(
  markup: string,
  overrides: Record<string, PublicSolutionOverride>,
) {
  if (Object.keys(overrides).length === 0) return markup;

  const json = JSON.stringify(overrides).replaceAll("<", "\\u003c");
  const payload = `<script type="application/json" id="cms-public-solutions">${json}</script>`;
  const closingBody = /<\/body\s*>/i;
  return closingBody.test(markup)
    ? markup.replace(closingBody, `${payload}</body>`)
    : `${markup}${payload}`;
}

function normalizedExcerpt(value: string) {
  return value.replace(/\s+/g, " ").trim().slice(0, 120);
}

function fieldLabel($: ReturnType<typeof load>, element: DomNode, kind: "text" | "image") {
  if (kind === "image") {
    const alt = element.attribs?.alt?.trim();
    const src = element.attribs?.src?.trim().split(/[?#]/, 1)[0];
    const fileName = src?.split("/").pop();
    return `Imagem · ${normalizedExcerpt(alt || fileName || "sem descrição")}`;
  }

  let current: DomNode | null | undefined = element;
  while (current && current.type === "tag") {
    if (hasClass(current, "ffs-mechanism-card")) return "ffs";
    if (current.name && editableTextContainers.has(current.name)) {
      const preview = normalizedExcerpt($(getSelector(current)).text());
      return `${current.name.toUpperCase()} · ${preview || "Texto sem conteúdo"}`;
    }
    current = current.parent;
  }

  return `${element.name?.toUpperCase() ?? "TEXTO"} · ${normalizedExcerpt($(getSelector(element)).text())}`;
}

function isInsidePageChrome(node: DomNode) {
  let current: DomNode | null | undefined = node;
  while (current && current.type === "tag") {
    if (current.name === "header" || current.name === "footer" || current.name === "nav") return true;
    current = current.parent;
  }
  return false;
}

function hasClass(node: DomNode, className: string) {
  return node.attribs?.class?.split(/\s+/).includes(className) ?? false;
}

function humanizeIdentifier(value: string) {
  const text = value.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
}

const sectionContainers = new Set(["section", "header", "footer", "aside", "article"]);

function sectionNameFor(node: DomNode): string {
  let name = "";
  let current: DomNode | null | undefined = node;
  while (current && current.type === "tag") {
    if (current.name && sectionContainers.has(current.name)) {
      const attribs = current.attribs ?? {};
      const candidate = attribs["aria-label"]?.trim()
        || humanizeIdentifier(attribs.id ?? "")
        || humanizeIdentifier((attribs.class ?? "").split(/\s+/).find(Boolean) ?? "");
      if (candidate) name = candidate.slice(0, 70);
    }
    current = current.parent;
  }
  return name;
}

function managedTextSetting(node: DomNode): EditableTextField["managedBy"] {
  let current: DomNode | null | undefined = node;
  while (current && current.type === "tag") {
    if (current.name === "nav" || hasClass(current, "main-menu")) return "navigation";
    if (["footer-location-details", "footer-phone-number", "copyright-left", "footer-email-row"].some((className) => hasClass(current!, className))) {
      return "global";
    }
    current = current.parent;
  }
  return undefined;
}

function backgroundDeclaration(node: DomNode) {
  const style = node.attribs?.style;
  if (!style) return null;

  const declarations = style.split(";").flatMap((declaration) => {
    const separator = declaration.indexOf(":");
    if (separator < 0) return [];
    const property = declaration.slice(0, separator).trim().toLowerCase();
    const value = declaration.slice(separator + 1).trim();
    if ((property !== "background" && property !== "background-image") || !/url\s*\(/i.test(value)) return [];
    const urls = [...value.matchAll(/url\(\s*(?:(['"])(.*?)\1|([^)]*))\s*\)/gi)];
    const lastUrl = urls.at(-1);
    const imageUrl = (lastUrl?.[2] ?? lastUrl?.[3] ?? "").trim();
    if (!lastUrl || !imageUrl || /^data:/i.test(imageUrl)) return [];
    return [{ styleProperty: property as "background" | "background-image", styleValue: value, imageUrl }];
  });

  return declarations.find((declaration) => declaration.styleProperty === "background-image") ?? declarations[0] ?? null;
}

function cssImageUrl(value: string) {
  const urls = [...value.matchAll(/url\(\s*(?:['"](.*?)['"]|([^)]*))\s*\)/gi)];
  const lastUrl = urls.at(-1);
  return (lastUrl?.[1] ?? lastUrl?.[2] ?? "").trim();
}

function cssUrl(value: string) {
  return `url("${value.replaceAll("\\", "\\\\").replaceAll('"', "\\\"")}")`;
}

function replaceLastCssUrl(styleValue: string, imageUrl: string) {
  const urls = [...styleValue.matchAll(/url\(\s*(?:(['"])(.*?)\1|([^)]*))\s*\)/gi)];
  const lastUrl = urls.at(-1);
  if (!lastUrl || lastUrl.index === undefined) throw new Error("A imagem de fundo não existe mais no template.");
  return `${styleValue.slice(0, lastUrl.index)}${cssUrl(imageUrl)}${styleValue.slice(lastUrl.index + lastUrl[0].length)}`;
}

function isSafeEditableLink(value: string) {
  if (value.length > 2_048 || /[\u0000-\u001f\u007f<>\\]/.test(value)) return false;
  if (!value) return true;
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

function isHiddenOrIgnored(node: DomNode) {
  let current: DomNode | null | undefined = node;
  while (current && current.type === "tag") {
    if (
      (current.name && ignoredElements.has(current.name)) ||
      current.attribs?.hidden !== undefined ||
      current.attribs?.["aria-hidden"] === "true"
    ) return true;
    current = current.parent;
  }
  return false;
}

export function extractEditableFields(markup: string): EditablePageField[] {
  const $ = load(markup.replace(/^\uFEFF/, ""));
  const containers = $("body").toArray();
  const roots = containers.length > 0 ? containers : $("main").toArray();
  const fields: EditablePageField[] = [];
  const seen = new Set<string>();

  function visit(node: DomNode) {
    if (node.type !== "tag" || !node.name || isHiddenOrIgnored(node)) return;

    const selector = getSelector(node);
    if (!selector) return;

    if (node.name === "img") {
      const key = `image:${selector}`;
      if (!seen.has(key)) {
        seen.add(key);
        fields.push({
          key,
          kind: "image",
          selector,
          value: node.attribs?.src ?? "",
        originalValue: node.attribs?.src ?? "",
          altText: node.attribs?.alt ?? "",
          label: fieldLabel($, node, "image"),
        });
      }
      return;
    }

    if (node.name === "a" && node.attribs?.href !== undefined && !isInsidePageChrome(node)) {
      const key = `link:${selector}`;
      if (!seen.has(key)) {
        seen.add(key);
        fields.push({
          key,
          kind: "link",
          selector,
          value: node.attribs.href,
          originalValue: node.attribs.href,
          label: fieldLabel($, node, "text"),
        });
      }
    }

    const background = backgroundDeclaration(node);
    if (background) {
      const key = `backgroundImage:${selector}`;
      if (!seen.has(key)) {
        seen.add(key);
        fields.push({
          key,
          kind: "backgroundImage",
          selector,
          value: background.imageUrl,
          originalValue: background.imageUrl,
          styleProperty: background.styleProperty,
          styleValue: background.styleValue,
          label: `Fundo · ${normalizedExcerpt($(selector).text()) || node.name}`,
        });
      }
    }

    if (node.name === "main") {
      const childSections = (node.children ?? []).filter(
        (child) => child.type === "tag" && child.name === "section" && !isHiddenOrIgnored(child),
      ) as DomNode[];
      const items = childSections.map((section) => ({
        selector: getSelector(section),
        label: normalizedExcerpt($(getSelector(section)).text()) || "Seção sem texto",
      }));
      const itemSelectors = items.map((item) => item.selector);
      const orderKey = `sectionOrder:${selector}`;
      if (items.length > 1 && itemSelectors.every(Boolean) && new Set(itemSelectors).size === itemSelectors.length && !seen.has(orderKey)) {
        seen.add(orderKey);
        fields.push({
          key: orderKey,
          kind: "sectionOrder",
          parentSelector: selector,
          value: itemSelectors,
          items,
          label: "Ordem das seções principais",
        });
      }
    }

    let textNodeIndex = 0;
    for (const child of node.children ?? []) {
      if (child.type === "text") {
        const value = child.data ?? "";
        if (value.trim()) {
          const key = `text:${selector}:${textNodeIndex}`;
          if (!seen.has(key)) {
            seen.add(key);
            fields.push({
              key,
              kind: "text",
            managedBy: managedTextSetting(node),
              selector,
              textNodeIndex,
              value,
              label: fieldLabel($, node, "text"),
              tag: node.name,
              section: sectionNameFor(node) || undefined,
            });
          }
        }
        textNodeIndex += 1;
      } else {
        const childNode = asDomNode(child);
        if (childNode) visit(childNode);
      }
    }
  }

  for (const root of roots) {
    const rootNode = asDomNode(root);
    if (rootNode) visit(rootNode);
  }

  for (const definition of cssBackgroundImageDefinitions) {
    const elements = $(definition.selector).toArray();
    if (elements.length !== 1) continue;
    const node = asDomNode(elements[0]);
    if (!node || isHiddenOrIgnored(node)) continue;
    const selector = getSelector(node);
    const key = `backgroundImage:${selector}`;
    const value = cssImageUrl(definition.styleValue);
    if (!selector || !value || seen.has(key)) continue;
    seen.add(key);
    fields.push({
      key,
      kind: "backgroundImage",
      selector,
      value,
      originalValue: value,
      styleProperty: definition.styleProperty,
      styleValue: definition.styleValue,
      label: definition.label,
    });
  }

  return fields;
}

export function editableFieldsForRoute(markup: string, routePath: string): EditablePageField[] {
  const fields = extractEditableFields(markup);
  const originalImage = solutionCardImageByRoute[routePath];
  if (!originalImage) return fields;

  return [
    ...fields,
    {
      key: solutionCardImageKey,
      kind: "image",
      selector: "",
      value: originalImage,
      originalValue: originalImage,
      altText: "",
      label: "Imagem do cartão de solução na Home",
    },
  ];
}

export function getSolutionCardImageOverride(rawPatches: unknown) {
  if (!Array.isArray(rawPatches)) return undefined;
  const patch = rawPatches.find((item) =>
    item && typeof item === "object" && (item as Record<string, unknown>).key === solutionCardImageKey,
  ) as Record<string, unknown> | undefined;

  return typeof patch?.value === "string" && allowedImageUrl.test(patch.value)
    ? patch.value
    : undefined;
}

export function getSolutionCardImageAltOverride(rawPatches: unknown) {
  if (!Array.isArray(rawPatches)) return undefined;
  const patch = rawPatches.find((item) =>
    item && typeof item === "object" && (item as Record<string, unknown>).key === solutionCardImageKey,
  ) as Record<string, unknown> | undefined;

  return typeof patch?.altText === "string" && patch.altText.length <= 255
    ? patch.altText
    : undefined;
}

export function normalizePageContentPatches(raw: unknown, fields: EditablePageField[]): PageContentPatch[] {
  if (!Array.isArray(raw) || raw.length > 500) {
    throw new Error("A lista de campos da página é inválida.");
  }

  const fieldsByKey = new Map(fields.map((field) => [field.key, field]));
  const seen = new Set<string>();
  const patches: PageContentPatch[] = [];

  for (const item of raw) {
    if (!item || typeof item !== "object") throw new Error("Um campo da página é inválido.");
    const candidate = item as Record<string, unknown>;
    const key = typeof candidate.key === "string" ? candidate.key : "";
    const field = fieldsByKey.get(key);
    if (!field || candidate.kind !== field.kind || seen.has(key)) {
      throw new Error("Um campo da página é inválido ou inexistente no template.");
    }
    seen.add(key);

    if (field.kind === "text") {
      if (typeof candidate.value !== "string" || candidate.value.length > 8_000) {
        throw new Error("O texto excede o limite de 8000 caracteres.");
      }
      patches.push({ key, kind: "text", value: candidate.value });
      continue;
    }

    if (field.kind === "sectionOrder") {
      if (
        !Array.isArray(candidate.value) ||
        candidate.value.length !== field.value.length ||
        candidate.value.some((value) => typeof value !== "string") ||
        new Set(candidate.value as string[]).size !== field.value.length ||
        field.value.some((value) => !(candidate.value as string[]).includes(value))
      ) {
        throw new Error("A ordem das seções é inválida para este template.");
      }
      patches.push({ key, kind: "sectionOrder", value: [...candidate.value] as string[] });
      continue;
    }

    if (field.kind === "link") {
      if (typeof candidate.value !== "string" || candidate.value.length > 2_048) {
        throw new Error("O endereço do link é inválido.");
      }
      const value = candidate.value.trim();
      if (value !== field.originalValue && !isSafeEditableLink(value)) {
        throw new Error("Use um link relativo, http/https, e-mail ou telefone válido.");
      }
      patches.push({ key, kind: "link", value });
      continue;
    }

    if (typeof candidate.value !== "string" || candidate.value.length > 2_048) {
      throw new Error("O endereço da imagem é inválido.");
    }
    const originalValue = field.value;
    if (candidate.value !== originalValue && !allowedImageUrl.test(candidate.value)) {
      throw new Error("Selecione uma imagem da biblioteca de mídia ou dos arquivos originais.");
    }
    if (field.kind === "image") {
      if (typeof candidate.altText !== "string" || candidate.altText.length > 255) {
        throw new Error("O texto alternativo da imagem excede 255 caracteres.");
      }
      patches.push({ key, kind: "image", value: candidate.value, altText: candidate.altText });
      continue;
    }
    patches.push({ key, kind: "backgroundImage", value: candidate.value });
  }

  return patches;
}

export function hydrateEditableFields(markup: string, rawPatches: unknown, routePath?: string): EditablePageField[] {
  const fields = routePath ? editableFieldsForRoute(markup, routePath) : extractEditableFields(markup);
  if (!Array.isArray(rawPatches) || rawPatches.length === 0) return fields;

  const patches = normalizePageContentPatches(rawPatches, fields);
  const patchesByKey = new Map(patches.map((patch) => [patch.key, patch]));

  return fields.map((field) => {
    const patch = patchesByKey.get(field.key);
    if (!patch) return field;
    if (field.kind === "text" && patch.kind === "text") return { ...field, value: patch.value };
    if (field.kind === "image" && patch.kind === "image") {
      return { ...field, value: patch.value, altText: patch.altText };
    }
    if ((field.kind === "link" || field.kind === "backgroundImage") && patch.kind === field.kind) {
      return { ...field, value: patch.value };
    }
    if (field.kind === "sectionOrder" && patch.kind === "sectionOrder") {
      return { ...field, value: patch.value };
    }
    return field;
  });
}

export function applyContentPatches(markup: string, rawPatches: unknown, routePath?: string): string {
  if (!Array.isArray(rawPatches) || rawPatches.length === 0) return markup;

  const fields = routePath ? editableFieldsForRoute(markup, routePath) : extractEditableFields(markup);
  const patches = normalizePageContentPatches(rawPatches, fields);
  const htmlPatches = patches.filter((patch) => patch.key !== solutionCardImageKey);
  if (htmlPatches.length === 0) return markup;
  const fieldsByKey = new Map(fields.map((field) => [field.key, field]));
  const $ = load(markup.replace(/^\uFEFF/, ""));

  for (const patch of htmlPatches.filter((candidate) => candidate.kind !== "sectionOrder")) {
    const field = fieldsByKey.get(patch.key);
    if (!field || field.kind === "sectionOrder") throw new Error("Um campo da página não existe no template.");
    const element = $(field.selector).first();
    if (element.length !== 1) throw new Error("Um campo da página não aponta para um elemento único.");

    if (patch.kind === "text" && field.kind === "text") {
      const textNodes = element.contents().toArray().filter((node) => node.type === "text");
      const textNode = textNodes[ field.textNodeIndex ] as unknown as { data?: string } | undefined;
      if (!textNode || typeof textNode.data !== "string") {
        throw new Error("Um campo de texto não existe mais no template.");
      }
      textNode.data = patch.value;
    } else if (patch.kind === "image" && field.kind === "image") {
      element.attr("src", patch.value);
      element.attr("alt", patch.altText);
    } else if (patch.kind === "link" && field.kind === "link") {
      if (patch.value) element.attr("href", patch.value);
      else element.removeAttr("href");
    } else if (patch.kind === "backgroundImage" && field.kind === "backgroundImage") {
      element.css(field.styleProperty, replaceLastCssUrl(field.styleValue, patch.value));
    }
  }

  for (const patch of htmlPatches.filter((candidate) => candidate.kind === "sectionOrder")) {
    const field = fieldsByKey.get(patch.key);
    if (!field || field.kind !== "sectionOrder" || patch.kind !== "sectionOrder") {
      throw new Error("A ordem das seções não existe mais no template.");
    }
    const parent = $(field.parentSelector).first();
    if (parent.length !== 1) throw new Error("O grupo de seções não existe mais no template.");
    const parentNode = parent.get(0);
    if (!parentNode) throw new Error("O grupo de seções não existe mais no template.");

    const selectorSet = new Set(field.value);
    const currentChildren = parent.contents().toArray();
    const sectionSlots = currentChildren.flatMap((child, index) => {
      const node = asDomNode(child);
      if (!node || node.name !== "section") return [];
      const childSelector = getSelector(node);
      return selectorSet.has(childSelector) ? [index] : [];
    });
    if (sectionSlots.length !== field.value.length) throw new Error("As seções não são mais irmãs diretas no template.");

    const reorderedSections = patch.value.map((selector) => {
      const section = $(selector).first();
      if (section.length !== 1 || section.parent().get(0) !== parentNode) {
        throw new Error("A seção não pertence ao grupo autorizado do template.");
      }
      const node = section.get(0);
      if (!node) throw new Error("Uma seção não existe mais no template.");
      return node;
    });
    const nextChildren = [...currentChildren];
    sectionSlots.forEach((slot, index) => { nextChildren[slot] = reorderedSections[index]; });
    parent.empty();
    for (const child of nextChildren) parent.append(child);
  }

  return $.html();
}

export function applyPageMetadata(markup: string, metadata: PublishedPageMetadata): string {
  const $ = load(markup.replace(/^\uFEFF/, ""));
  const head = $("head").first();
  const seoTitle = metadata.seoTitle?.trim() || metadata.title;
  const seoDescription = metadata.seoDescription?.trim() || metadata.summary;

  if ($("title").length > 0) {
    $("title").first().text(seoTitle);
  } else {
    head.append($("<title>").text(seoTitle));
  }

  if (seoDescription) {
    const description = $("meta[name='description']").first();
    if (description.length > 0) description.attr("content", seoDescription);
    else head.append($("<meta>").attr("name", "description").attr("content", seoDescription));

    const ogDescription = $("meta[property='og:description']").first();
    if (ogDescription.length > 0) ogDescription.attr("content", seoDescription);
    else head.append($("<meta>").attr("property", "og:description").attr("content", seoDescription));
  }

  const ogTitle = $("meta[property='og:title']").first();
  if (ogTitle.length > 0) ogTitle.attr("content", seoTitle);
  else head.append($("<meta>").attr("property", "og:title").attr("content", seoTitle));

  if (metadata.canonicalUrl) {
    const canonical = $("link[rel='canonical']").first();
    if (canonical.length > 0) canonical.attr("href", metadata.canonicalUrl);
    else head.append($("<link>").attr("rel", "canonical").attr("href", metadata.canonicalUrl));

    const ogUrl = $("meta[property='og:url']").first();
    if (ogUrl.length > 0) ogUrl.attr("content", metadata.canonicalUrl);
    else head.append($("<meta>").attr("property", "og:url").attr("content", metadata.canonicalUrl));
  }

  return $.html();
}
