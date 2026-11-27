import { load } from "cheerio";
import {
  annotateCardListDom,
  applyCardListPatchToCheerio,
  cloneCardListItems,
  extractCardListFields,
  normalizeCardListItems,
  type CardPrototypeMap,
} from "@/lib/cms/card-list";
import {
  HOME_SOLUTIONS_FIELD_KEY,
  defaultHomeSolutionCards,
} from "@/lib/cms/home-solutions-defaults";
import {
  isSafeEditableLink,
  isValidObjectPosition,
  replaceLastCssUrl,
  type CardListItem,
  type ClientLogoItem,
  type DirectorCardItem,
  type EditableBackgroundImageField,
  type EditableCardListField,
  type EditableClientLogosField,
  type EditableDirectorCardsField,
  type EditableHomeSolutionsField,
  type EditableImageField,
  type EditableIndicatorsField,
  type EditableLinkField,
  type EditablePageField,
  type EditableRichTextField,
  type EditableSectionOrderField,
  type EditableTextField,
  type HomeSolutionCardItem,
  type IndicatorItem,
  type PageContentPatch,
} from "@/lib/cms/inline-editor-types";
import {
  MAX_RICH_TEXT_LENGTH,
  sanitizeRichTextHtml,
  stripRichTextToPlain,
} from "@/lib/cms/rich-text";

export {
  HOME_SOLUTIONS_FIELD_KEY,
  defaultHomeSolutionCards,
  isSafeEditableLink,
  replaceLastCssUrl,
  sanitizeRichTextHtml,
  type CardListItem,
  type ClientLogoItem,
  type DirectorCardItem,
  type EditableBackgroundImageField,
  type EditableCardListField,
  type EditableClientLogosField,
  type EditableDirectorCardsField,
  type EditableHomeSolutionsField,
  type EditableImageField,
  type EditableIndicatorsField,
  type EditableLinkField,
  type EditablePageField,
  type EditableRichTextField,
  type EditableSectionOrderField,
  type EditableTextField,
  type HomeSolutionCardItem,
  type IndicatorItem,
  type PageContentPatch,
};

type DomNode = {
  type: string;
  name?: string;
  data?: string;
  attribs?: Record<string, string>;
  parent?: DomNode | null;
  children?: DomNode[];
};

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
const richTextContainers = new Set([
  "h1", "h2", "h3", "h4", "h5", "h6", "p", "figcaption", "blockquote",
]);
const richTextInlineTags = new Set(["strong", "b", "em", "i", "u", "br", "span"]);
const ignoredElements = new Set(["script", "style", "noscript", "svg", "template"]);
const solutionCardImageKey = "cms:solution-card-image";
const homeIndicatorsKey = "cms:home-indicators";
const homeClientLogosKey = "cms:home-client-logos";
const aboutDirectorCardsKey = "cms:about-director-cards";
export const defaultHomeIndicators: IndicatorItem[] = [
  { value: "+18", label: "anos de experiência" },
  { value: "+27", label: "estados alcançados" },
  { value: "96%", label: "índice de satisfação" },
  { value: "24h", label: "monitoramento contínuo" },
  { value: "100%", label: "atuação em todo o Brasil" },
  { value: "+1.250", label: "projetos entregues" },
  { value: "+120", label: "grandes clientes atendidos" },
  { value: "0%", label: "paradas não programadas" },
];
const allowedImageUrl = /^\/media\/[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(?:jpe?g|png|webp|gif|avif)$/i;
const allowedVideoUrl = /^\/media\/[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(?:mp4|webm|mov)$/i;
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
    if (["footer-location-details", "footer-phone-number", "copyright-left", "footer-email-row", "legal-preview"].some((className) => hasClass(current!, className))) {
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

function extractInlineObjectPosition(styleAttr: string | undefined): string | undefined {
  if (!styleAttr) return undefined;
  const match = /(?:^|;)\s*object-position\s*:\s*([^;]+)/i.exec(styleAttr);
  if (!match) return undefined;
  const val = match[1].trim();
  return isValidObjectPosition(val) ? val : undefined;
}

function isInsideRichTextForbiddenAncestor(node: DomNode) {
  let current: DomNode | null | undefined = node;
  while (current && current.type === "tag") {
    const id = current.attribs?.id;
    if (id === "heroBenefitsBar" || id === "highlightCard" || id === "clientes") return true;
    if (hasClass(current, "ffs-mechanisms-grid")) return true;
    current = current.parent;
  }
  return false;
}

function hasOnlyRichTextInlineDescendants(node: DomNode): boolean {
  for (const child of node.children ?? []) {
    if (child.type === "text") continue;
    if (child.type === "comment" || child.type === "directive") continue;
    if (child.type !== "tag" || !child.name) return false;
    if (!richTextInlineTags.has(child.name)) return false;
    if (!hasOnlyRichTextInlineDescendants(child)) return false;
  }
  return true;
}

function isEligibleRichTextNode(node: DomNode): boolean {
  if (node.type !== "tag" || !node.name || !richTextContainers.has(node.name)) return false;
  if (isInsidePageChrome(node) || managedTextSetting(node) || isInsideRichTextForbiddenAncestor(node)) {
    return false;
  }
  return hasOnlyRichTextInlineDescendants(node);
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
        const objectPosition = extractInlineObjectPosition(node.attribs?.style);
        const editorPhotoLocked = $(selector).first().closest(".endo-acc-full-wrapper, .endo-acc-panel").length > 0;
        fields.push({
          key,
          kind: "image",
          selector,
          value: node.attribs?.src ?? "",
          originalValue: node.attribs?.src ?? "",
          altText: node.attribs?.alt ?? "",
          ...(objectPosition !== undefined
            ? { objectPosition, originalObjectPosition: objectPosition }
            : {}),
          ...(editorPhotoLocked ? { editorPhotoLocked: true } : {}),
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

    if (isEligibleRichTextNode(node)) {
      const richKey = `richText:${selector}`;
      if (!seen.has(richKey)) {
        const cleanHtml = sanitizeRichTextHtml($(selector).first().html() ?? "");
        if (stripRichTextToPlain(cleanHtml).length > 0) {
          seen.add(richKey);
          fields.push({
            key: richKey,
            kind: "richText",
            selector,
            value: cleanHtml,
            originalValue: cleanHtml,
            label: fieldLabel($, node, "text"),
            tag: node.name,
            section: sectionNameFor(node) || undefined,
          });
        }
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
  const $ = load(markup.replace(/^\uFEFF/, ""));
  const { fields: cardListFields } = extractCardListFields($, getSelector);
  fields.push(...cardListFields);

  if (routePath === "/") {
    if ($("#heroBenefitsBar").length === 1) {
      fields.push({
        key: homeIndicatorsKey,
        kind: "indicators",
        selector: "#heroBenefitsBar",
        value: defaultHomeIndicators.map((item) => ({ ...item })),
        originalValue: defaultHomeIndicators.map((item) => ({ ...item })),
        label: "Indicadores de performance (faixa azul)",
      });
    }

    const logoItems = $("#clientes .logo-marquee .logo-marquee__track")
      .first()
      .find("img")
      .toArray()
      .flatMap((img) => {
        const src = $(img).attr("src")?.trim() ?? "";
        if (!src) return [];
        const alt = ($(img).attr("alt") ?? "").trim();
        return [{ src, alt }];
      });

    if (logoItems.length > 0) {
      fields.push({
        key: homeClientLogosKey,
        kind: "clientLogos",
        selector: "#clientes .logo-marquee",
        value: logoItems.map((item) => ({ ...item })),
        originalValue: logoItems.map((item) => ({ ...item })),
        label: "Logos de clientes (Confiam em Nós)",
      });
    }

    if ($("#highlightCard").length === 1) {
      const cloneSolutions = () =>
        defaultHomeSolutionCards.map((item) => ({ ...item, topics: [...item.topics] }));
      fields.push({
        key: HOME_SOLUTIONS_FIELD_KEY,
        kind: "homeSolutions",
        selector: "#highlightCard",
        value: cloneSolutions(),
        originalValue: cloneSolutions(),
        label: "Soluções em destaque na Home",
      });
    }
  }

  const dualContainer = $("#sobre-2 .about-media-dual-videos").first();
  if (dualContainer.length === 1) {
    const directorCards: DirectorCardItem[] = dualContainer
      .children(".dep-video-card")
      .toArray()
      .flatMap<DirectorCardItem>((cardEl) => {
        const card = $(cardEl);
        const name = card.find(".dep-tag-name").first().text().trim();
        const role = card.find(".dep-tag-role").first().text().trim();
        const video = card.find("video.dep-video").first();
        if (video.length === 1) {
          const src = video.attr("src")?.trim() ?? "";
          if (!src) return [];
          const poster = video.attr("poster")?.trim() || undefined;
          const duration = card.find(".dep-tag-duration").first().text().trim() || undefined;
          return [{
            mediaType: "video" as const,
            src,
            ...(poster ? { poster } : {}),
            name: name || "Diretoria",
            role,
            ...(duration ? { duration } : {}),
          }];
        }
        const image = card.find("img.dep-card-image").first();
        if (image.length === 1) {
          const src = image.attr("src")?.trim() ?? "";
          if (!src) return [];
          return [{
            mediaType: "image" as const,
            src,
            name: name || "Diretoria",
            role,
          }];
        }
        return [];
      });

    if (directorCards.length > 0) {
      fields.push({
        key: aboutDirectorCardsKey,
        kind: "directorCards",
        selector: "#sobre-2 .about-media-dual-videos",
        value: directorCards.map((item) => ({ ...item })),
        originalValue: directorCards.map((item) => ({ ...item })),
        label: "Mídia dos Sócios-Diretores (vídeos e fotos)",
      });
    }
  }

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
  if (!Array.isArray(raw) || raw.length > 1_200) {
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

    if (field.kind === "richText") {
      if (typeof candidate.value !== "string" || candidate.value.length > MAX_RICH_TEXT_LENGTH) {
        throw new Error("O conteúdo formatado excede o limite permitido.");
      }
      const sanitized = sanitizeRichTextHtml(candidate.value);
      if (sanitized.length > MAX_RICH_TEXT_LENGTH || stripRichTextToPlain(sanitized).length === 0) {
        throw new Error("O conteúdo do texto formatado é inválido ou está vazio.");
      }
      patches.push({ key, kind: "richText", value: sanitized });
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

    if (field.kind === "indicators") {
      if (!Array.isArray(candidate.value) || candidate.value.length < 1 || candidate.value.length > 24) {
        throw new Error("A faixa de indicadores precisa ter entre 1 e 24 itens.");
      }
      const normalizedItems: IndicatorItem[] = candidate.value.map((entry, idx) => {
        if (!entry || typeof entry !== "object") {
          throw new Error(`O indicador ${idx + 1} é inválido.`);
        }
        const item = entry as Record<string, unknown>;
        const value = typeof item.value === "string" ? item.value.trim() : "";
        const label = typeof item.label === "string" ? item.label.trim() : "";
        if (
          !value ||
          value.length > 24 ||
          !label ||
          label.length > 80 ||
          /[\u0000-\u001f\u007f<>]/.test(value) ||
          /[\u0000-\u001f\u007f<>]/.test(label)
        ) {
          throw new Error(`O indicador ${idx + 1} tem valor ou descrição inválida.`);
        }
        return { value, label };
      });
      patches.push({ key, kind: "indicators", value: normalizedItems });
      continue;
    }

    if (field.kind === "clientLogos") {
      if (!Array.isArray(candidate.value) || candidate.value.length < 1 || candidate.value.length > 40) {
        throw new Error("A seção de clientes precisa ter entre 1 e 40 logos.");
      }
      const allowedOriginalSrcs = new Set(field.originalValue.map((item) => item.src));
      const normalizedLogos: ClientLogoItem[] = candidate.value.map((entry, idx) => {
        if (!entry || typeof entry !== "object") {
          throw new Error(`O logo ${idx + 1} é inválido.`);
        }
        const item = entry as Record<string, unknown>;
        const src = typeof item.src === "string" ? item.src.trim() : "";
        const alt = typeof item.alt === "string" ? item.alt.trim() : "";
        if (!src || src.length > 2_048 || (!allowedOriginalSrcs.has(src) && !allowedImageUrl.test(src))) {
          throw new Error(`A imagem do logo ${idx + 1} não pertence à biblioteca de mídia ou aos arquivos originais.`);
        }
        if (alt.length > 255 || /[\u0000-\u001f\u007f]/.test(alt)) {
          throw new Error(`A descrição do logo ${idx + 1} é inválida.`);
        }
        return { src, alt };
      });
      patches.push({ key, kind: "clientLogos", value: normalizedLogos });
      continue;
    }

    if (field.kind === "directorCards") {
      if (!Array.isArray(candidate.value) || candidate.value.length < 1 || candidate.value.length > 8) {
        throw new Error("A seção de mídia dos sócios-diretores precisa ter entre 1 e 8 itens.");
      }
      const allowedOriginalVideos = new Set(
        field.originalValue.filter((item) => item.mediaType === "video").map((item) => item.src),
      );
      const allowedOriginalImages = new Set(
        field.originalValue.flatMap((item) => {
          const urls: string[] = [];
          if (item.mediaType === "image" && item.src) urls.push(item.src);
          if (item.poster) urls.push(item.poster);
          return urls;
        }),
      );
      const normalizedCards: DirectorCardItem[] = candidate.value.map((entry, idx) => {
        if (!entry || typeof entry !== "object") {
          throw new Error(`O cartão ${idx + 1} dos sócios-diretores é inválido.`);
        }
        const item = entry as Record<string, unknown>;
        const mediaType = item.mediaType === "video" || item.mediaType === "image" ? item.mediaType : null;
        if (!mediaType) {
          throw new Error(`O tipo de mídia do cartão ${idx + 1} é inválido.`);
        }
        const src = typeof item.src === "string" ? item.src.trim() : "";
        const name = typeof item.name === "string" ? item.name.trim() : "";
        const role = typeof item.role === "string" ? item.role.trim() : "";
        if (
          !name ||
          name.length > 80 ||
          /[\u0000-\u001f\u007f<>]/.test(name)
        ) {
          throw new Error(`O nome do cartão ${idx + 1} é inválido.`);
        }
        if (role.length > 100 || /[\u0000-\u001f\u007f<>]/.test(role)) {
          throw new Error(`O cargo do cartão ${idx + 1} é inválido.`);
        }

        if (mediaType === "video") {
          if (!src || src.length > 2_048 || (!allowedOriginalVideos.has(src) && !allowedVideoUrl.test(src))) {
            throw new Error(`O vídeo do cartão ${idx + 1} não pertence à biblioteca de mídia ou aos arquivos originais.`);
          }
          const rawPoster = typeof item.poster === "string" ? item.poster.trim() : "";
          if (rawPoster && (rawPoster.length > 2_048 || (!allowedOriginalImages.has(rawPoster) && !allowedImageUrl.test(rawPoster)))) {
            throw new Error(`A imagem de capa do cartão ${idx + 1} não pertence à biblioteca de mídia ou aos arquivos originais.`);
          }
          const rawDuration = typeof item.duration === "string" ? item.duration.trim() : "";
          if (rawDuration.length > 16 || /[\u0000-\u001f\u007f<>]/.test(rawDuration)) {
            throw new Error(`A duração do cartão ${idx + 1} é inválida.`);
          }
          return {
            mediaType: "video",
            src,
            ...(rawPoster ? { poster: rawPoster } : {}),
            name,
            role,
            ...(rawDuration ? { duration: rawDuration } : {}),
          };
        }

        if (!src || src.length > 2_048 || (!allowedOriginalImages.has(src) && !allowedImageUrl.test(src))) {
          throw new Error(`A imagem do cartão ${idx + 1} não pertence à biblioteca de mídia ou aos arquivos originais.`);
        }
        return {
          mediaType: "image",
          src,
          name,
          role,
        };
      });
      patches.push({ key, kind: "directorCards", value: normalizedCards });
      continue;
    }

    if (field.kind === "homeSolutions") {
      if (!Array.isArray(candidate.value) || candidate.value.length < 1 || candidate.value.length > 12) {
        throw new Error("A seção de soluções da Home precisa ter entre 1 e 12 itens.");
      }
      const originalByRoute = new Map(field.originalValue.map((orig) => [orig.routePath, orig]));
      const seenRoutes = new Set<string>();
      const sanitizeInlineText = (rawVal: unknown, maxLen: number) => {
        if (typeof rawVal !== "string" || /[\u0000-\u001f\u007f<>]/.test(rawVal)) return null;
        const trimmed = rawVal.trim();
        if (!trimmed || trimmed.length > maxLen) return null;
        return trimmed;
      };

      const normalizedCards: HomeSolutionCardItem[] = candidate.value.map((entry, idx) => {
        if (!entry || typeof entry !== "object") {
          throw new Error(`A solução ${idx + 1} é inválida.`);
        }
        const rawCard = entry as Record<string, unknown>;
        const routePath = typeof rawCard.routePath === "string" ? rawCard.routePath.trim() : "";
        const orig = originalByRoute.get(routePath);
        if (!orig || seenRoutes.has(routePath)) {
          throw new Error(`A solução ${idx + 1} possui rota inválida ou duplicada.`);
        }
        seenRoutes.add(routePath);

        const tag = sanitizeInlineText(rawCard.tag, 40);
        const category = sanitizeInlineText(rawCard.category, 120);
        const title = sanitizeInlineText(rawCard.title, 160);
        const desc = sanitizeInlineText(rawCard.desc, 600);
        const ctaText = sanitizeInlineText(rawCard.ctaText, 60);
        if (!tag || !category || !title || !desc || !ctaText) {
          throw new Error(`Preencha todos os campos de texto da solução ${idx + 1} com valores válidos.`);
        }

        if (!Array.isArray(rawCard.topics) || rawCard.topics.length < 1 || rawCard.topics.length > 8) {
          throw new Error(`A solução ${idx + 1} precisa ter entre 1 e 8 tópicos.`);
        }
        const topics = rawCard.topics.map((t, tIdx) => {
          const cleanTopic = sanitizeInlineText(t, 160);
          if (!cleanTopic) {
            throw new Error(`O item ${tIdx + 1} da solução ${idx + 1} é inválido.`);
          }
          return cleanTopic;
        });

        const image = typeof rawCard.image === "string" ? rawCard.image.trim() : "";
        if (!image || image.length > 2_048 || (image !== orig.image && !allowedImageUrl.test(image))) {
          throw new Error(`A imagem da solução ${idx + 1} não pertence à biblioteca de mídia.`);
        }
        const imageAlt =
          typeof rawCard.imageAlt === "string" && rawCard.imageAlt.length <= 255 && !/[\u0000-\u001f\u007f]/.test(rawCard.imageAlt)
            ? rawCard.imageAlt
            : title;

        let objectPosition: string | undefined;
        if (rawCard.objectPosition !== undefined) {
          if (typeof rawCard.objectPosition !== "string" || !isValidObjectPosition(rawCard.objectPosition.trim())) {
            throw new Error(`O enquadramento da imagem da solução ${idx + 1} é inválido.`);
          }
          const trimmedPos = rawCard.objectPosition.trim();
          if (trimmedPos) objectPosition = trimmedPos;
        }

        return {
          routePath,
          tag,
          category,
          title,
          desc,
          topics,
          ctaText,
          image,
          imageAlt,
          ...(objectPosition ? { objectPosition } : {}),
        };
      });

      patches.push({ key, kind: "homeSolutions", value: normalizedCards });
      continue;
    }

    if (field.kind === "cardList") {
      patches.push({
        key,
        kind: "cardList",
        value: normalizeCardListItems(candidate.value, field, allowedImageUrl),
      });
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
      let objectPosition: string | undefined;
      if (candidate.objectPosition !== undefined) {
        if (typeof candidate.objectPosition !== "string" || !isValidObjectPosition(candidate.objectPosition.trim())) {
          throw new Error("A posição de enquadramento da imagem é inválida.");
        }
        const trimmedPos = candidate.objectPosition.trim();
        if (trimmedPos) objectPosition = trimmedPos;
      }
      patches.push({
        key,
        kind: "image",
        value: candidate.value,
        altText: candidate.altText,
        ...(objectPosition ? { objectPosition } : {}),
      });
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
  const $ = load(markup.replace(/^\uFEFF/, ""));

  return fields.map((field) => {
    const patch = patchesByKey.get(field.key);
    if (!patch) return field;
    if (field.kind === "text" && patch.kind === "text") {
      if (patch.value.trim() === "Preview Design System" && $(field.selector).first().hasClass("legal-preview")) {
        return field;
      }
      return { ...field, value: patch.value };
    }
    if (field.kind === "richText" && patch.kind === "richText") {
      return { ...field, value: patch.value };
    }
    if (field.kind === "image" && patch.kind === "image") {
      return {
        ...field,
        value: patch.value,
        altText: patch.altText,
        objectPosition: patch.objectPosition ?? field.originalObjectPosition,
      };
    }
    if ((field.kind === "link" || field.kind === "backgroundImage") && patch.kind === field.kind) {
      if (field.kind === "link" && patch.value.trim() === "preview-design-system.html" && $(field.selector).first().hasClass("legal-preview")) {
        return field;
      }
      return { ...field, value: patch.value };
    }
    if (field.kind === "sectionOrder" && patch.kind === "sectionOrder") {
      return { ...field, value: patch.value };
    }
    if (field.kind === "indicators" && patch.kind === "indicators") {
      return { ...field, value: patch.value };
    }
    if (field.kind === "clientLogos" && patch.kind === "clientLogos") {
      return { ...field, value: patch.value };
    }
    if (field.kind === "homeSolutions" && patch.kind === "homeSolutions") {
      return {
        ...field,
        value: patch.value.map((item) => ({ ...item, topics: [...item.topics] })),
      };
    }
    if (field.kind === "directorCards" && patch.kind === "directorCards") {
      return {
        ...field,
        value: patch.value.map((item) => ({ ...item })),
      };
    }
    if (field.kind === "cardList" && patch.kind === "cardList") {
      return {
        ...field,
        value: cloneCardListItems(patch.value),
      };
    }
    return field;
  });
}

function sameDirectorCards(a: DirectorCardItem[], b: DirectorCardItem[]): boolean {
  if (a.length !== b.length) return false;
  return a.every(
    (item, idx) =>
      item.mediaType === b[idx]?.mediaType &&
      item.src === b[idx]?.src &&
      (item.poster ?? "") === (b[idx]?.poster ?? "") &&
      item.name === b[idx]?.name &&
      item.role === b[idx]?.role &&
      (item.duration ?? "") === (b[idx]?.duration ?? ""),
  );
}

function buildDirectorCardCheerio($: ReturnType<typeof load>, card: DirectorCardItem) {
  const cardEl = $('<div class="dep-video-card"></div>');
  if (card.mediaType === "image") {
    cardEl.addClass("dep-image-card");
  }
  const inner = $('<div class="dep-video-inner"></div>');

  if (card.mediaType === "image") {
    inner.append(
      $("<img />")
        .addClass("dep-card-image")
        .attr("src", card.src)
        .attr("alt", card.name || "Diretoria")
        .attr("style", "object-fit:cover;width:100%;height:100%;"),
    );
  } else {
    const video = $("<video></video>")
      .addClass("dep-video")
      .attr("src", card.src)
      .attr("preload", "metadata")
      .attr("style", "object-fit:cover;width:100%;height:100%;")
      .attr("playsinline", "");
    if (card.poster) video.attr("poster", card.poster);
    inner.append(video);

    const playBtn = $(
      '<button class="dep-play-btn"><svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="30" r="28" stroke="#00D5FF" stroke-width="3" fill="rgba(6,11,30,0.6)"/><polygon points="24,18 44,30 24,42" fill="#FFFFFF"/></svg></button>',
    );
    playBtn.attr("aria-label", `Reproduzir depoimento de ${card.name}`);
    inner.append(playBtn);
  }

  const tag = $('<div class="dep-card-tag"></div>');
  const stack = $('<div class="dep-tag-left-stack"><span class="dep-tag-line-red"></span></div>');
  stack.append($('<p class="dep-tag-name"></p>').text(card.name));
  stack.append($('<p class="dep-tag-role"></p>').text(card.role));
  tag.append(stack);
  if (card.mediaType === "video" && card.duration) {
    tag.append($('<span class="dep-tag-duration"></span>').text(card.duration));
  }
  inner.append(tag);

  if (card.mediaType === "video") {
    inner.append(
      '<div class="dep-custom-controls"><div class="dep-controls-timeline-wrapper"><div class="dep-controls-timeline-bar"><div class="dep-controls-timeline-progress"></div></div></div><div class="dep-controls-buttons-row"><div class="dep-controls-left-buttons"><button class="dep-ctrl-btn dep-play-pause-btn" aria-label="Reproduzir/Pausar"><svg class="icon-play" viewBox="0 0 24 24" width="16" height="16"><polygon points="5 3 19 12 5 21 5 3" fill="var(--brand-primary)"/></svg><svg class="icon-pause" viewBox="0 0 24 24" width="16" height="16" style="display:none;"><rect x="6" y="4" width="4" height="16" fill="var(--brand-primary)"/><rect x="14" y="4" width="4" height="16" fill="var(--brand-primary)"/></svg></button><button class="dep-ctrl-btn dep-rewind-btn" aria-label="Voltar 10 segundos"><svg viewBox="0 0 24 24" width="14" height="14"><path d="M12 5V1L7 6l5 5V7c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6H4c0 4.4 3.6 8 8 8s8-3.6 8-8-3.6-8-8-8zm-1 5.5h-1v5h1v-5zm3 0h-2v5h2v-5z" fill="var(--brand-primary)"/></svg></button><button class="dep-ctrl-btn dep-forward-btn" aria-label="Avançar 10 segundos"><svg viewBox="0 0 24 24" width="14" height="14"><path d="M12 5V1l5 5-5 5V7c-3.3 0-6 2.7-6 6s-2.7 6 6 6 6-2.7 6-6h2c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8zm-1 5.5h-1v5h1v-5zm3 0h-2v5h2v-5z" fill="var(--brand-primary)"/></svg></button><span class="dep-ctrl-time">00:00 / 00:00</span></div><div class="dep-controls-right-buttons"><div class="dep-volume-control-wrapper"><button class="dep-ctrl-btn dep-volume-btn" aria-label="Volume"><svg class="icon-volume-on" viewBox="0 0 24 24" width="16" height="16"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" fill="var(--brand-primary)"/></svg><svg class="icon-volume-off" viewBox="0 0 24 24" width="16" height="16" style="display:none;"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.21.05-.42.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71z" fill="var(--brand-primary)"/></svg></button><input type="range" class="dep-volume-slider" min="0" max="1" step="0.05" value="1" aria-label="Ajustar Volume"></div><button class="dep-ctrl-btn dep-fullscreen-btn" aria-label="Tela Cheia"><svg viewBox="0 0 24 24" width="16" height="16"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" fill="var(--brand-primary)"/></svg></button></div></div></div>',
    );
  }

  cardEl.append(inner);
  return cardEl;
}

function applyFieldPatchesToCheerio(
  $: ReturnType<typeof load>,
  fieldsByKey: Map<string, EditablePageField>,
  htmlPatches: PageContentPatch[],
) {
  const orderedPatches = [
    ...htmlPatches.filter(
      (candidate) =>
        candidate.kind !== "sectionOrder" &&
        candidate.kind !== "richText" &&
        candidate.kind !== "directorCards" &&
        candidate.kind !== "cardList",
    ),
    ...htmlPatches.filter((candidate) => candidate.kind === "richText" || candidate.kind === "directorCards"),
    ...htmlPatches.filter((candidate) => candidate.kind === "cardList"),
  ];

  for (const patch of orderedPatches) {
    const field = fieldsByKey.get(patch.key);
    if (!field || field.kind === "sectionOrder") throw new Error("Um campo da página não existe no template.");
    const element = $(field.selector).first();
    if (element.length !== 1) throw new Error("Um campo da página não aponta para um elemento único.");

    if (patch.kind === "text" && field.kind === "text") {
      if (element.hasClass("legal-preview") && patch.value.trim() === "Preview Design System") {
        continue;
      }
      const textNodes = element.contents().toArray().filter((node) => node.type === "text");
      const textNode = textNodes[field.textNodeIndex] as unknown as { data?: string } | undefined;
      if (!textNode || typeof textNode.data !== "string") {
        throw new Error("Um campo de texto não existe mais no template.");
      }
      textNode.data = patch.value;
    } else if (patch.kind === "richText" && field.kind === "richText") {
      if (patch.value !== field.originalValue) {
        element.html(sanitizeRichTextHtml(patch.value));
      }
    } else if (patch.kind === "image" && field.kind === "image") {
      element.attr("src", patch.value);
      element.attr("alt", patch.altText);
      if (patch.objectPosition) {
        element.css("object-position", patch.objectPosition);
      }
    } else if (patch.kind === "link" && field.kind === "link") {
      if (element.hasClass("legal-preview") && patch.value.trim() === "preview-design-system.html") {
        continue;
      }
      if (patch.value) element.attr("href", patch.value);
      else element.removeAttr("href");
    } else if (patch.kind === "backgroundImage" && field.kind === "backgroundImage") {
      element.css(field.styleProperty, replaceLastCssUrl(field.styleValue, patch.value));
    } else if (patch.kind === "indicators" && field.kind === "indicators") {
      element.attr("data-cms-indicators", JSON.stringify(patch.value));
    } else if (patch.kind === "homeSolutions" && field.kind === "homeSolutions") {
      if (JSON.stringify(patch.value) !== JSON.stringify(field.originalValue)) {
        element.attr("data-cms-solutions-cards", JSON.stringify(patch.value));
      }
    } else if (patch.kind === "clientLogos" && field.kind === "clientLogos") {
      const sameAsOriginal =
        patch.value.length === field.originalValue.length &&
        patch.value.every(
          (item, idx) =>
            item.src === field.originalValue[idx]?.src &&
            item.alt === field.originalValue[idx]?.alt,
        );
      if (sameAsOriginal) continue;

      const buildTrack = (isMirror: boolean) => {
        const track = $('<div class="logo-marquee__track"></div>');
        if (isMirror) track.attr("aria-hidden", "true");
        for (const logo of patch.value) {
          const itemDiv = $('<div class="logo-marquee__item"></div>');
          const imgEl = $("<img />")
            .attr("src", logo.src)
            .attr("alt", isMirror ? "" : logo.alt)
            .attr("width", "900")
            .attr("height", "225")
            .attr("loading", "lazy");
          itemDiv.append(imgEl);
          track.append(itemDiv);
        }
        return track;
      };

      element.empty();
      element.append(buildTrack(false));
      element.append(buildTrack(true));
    } else if (patch.kind === "directorCards" && field.kind === "directorCards") {
      if (sameDirectorCards(patch.value, field.originalValue)) continue;
      element.attr("data-card-count", String(patch.value.length));
      if (patch.value.length > 2) {
        element.attr("data-card-count-multi", "true");
      } else {
        element.removeAttr("data-card-count-multi");
      }
      element.empty();
      for (const card of patch.value) {
        element.append(buildDirectorCardCheerio($, card));
      }
    } else if (patch.kind === "cardList" && field.kind === "cardList") {
      applyCardListPatchToCheerio($, field, patch.value);
    }
  }
}

function applySectionOrderPatchesToCheerio(
  $: ReturnType<typeof load>,
  fieldsByKey: Map<string, EditablePageField>,
  htmlPatches: PageContentPatch[],
) {
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
}

function annotateInlineEditableDom(
  $: ReturnType<typeof load>,
  fields: EditablePageField[],
) {
  const textFieldsBySelector = new Map<string, Array<{ key: string; idx: number }>>();

  for (const field of fields) {
    if (field.kind === "cardList") {
      annotateCardListDom($, field, field.value);
    }
  }

  for (const field of fields) {
    if (field.kind === "cardList") continue;

    if (field.kind === "richText") {
      const element = $(field.selector).first();
      if (
        element.length === 1 &&
        element.closest("#heroBenefitsBar, #highlightCard, #clientes, #sobre-2 .about-media-dual-videos, [data-ec-cardlist-key]").length === 0
      ) {
        element.attr("data-ec-richtext-key", field.key);
      }
      continue;
    }

    if (field.kind === "homeSolutions") {
      const element = $(field.selector).first();
      if (element.length === 1) {
        element.attr("data-ec-solutions-key", field.key);
      }
      continue;
    }

    if (field.kind === "directorCards") {
      const element = $(field.selector).first();
      if (element.length === 1) {
        element.attr("data-ec-directors-key", field.key);
      }
      continue;
    }

    if (field.kind === "text") {
      const element = $(field.selector).first();
      if (
        element.length === 1 &&
        element.closest("#heroBenefitsBar, #highlightCard, #sobre-2 .about-media-dual-videos, [data-ec-cardlist-key]").length > 0
      ) {
        continue;
      }
      if (field.managedBy) {
        if (element.length === 1 && !element.attr("data-ec-managed")) {
          element.attr("data-ec-managed", field.managedBy);
        }
        continue;
      }
      const list = textFieldsBySelector.get(field.selector) ?? [];
      list.push({ key: field.key, idx: field.textNodeIndex });
      textFieldsBySelector.set(field.selector, list);
      continue;
    }

    if (field.kind === "image") {
      if (!field.selector) continue;
      const element = $(field.selector).first();
      if (
        element.length === 1 &&
        element.closest("#clientes .logo-marquee, #highlightCard, #sobre-2 .about-media-dual-videos, [data-ec-cardlist-key]").length === 0
      ) {
        element.attr("data-ec-image-key", field.key);
        if (field.editorPhotoLocked) {
          element.attr("data-ec-editor-photo-locked", "true");
        }
      }
      continue;
    }

    if (field.kind === "indicators") {
      const element = $(field.selector).first();
      if (element.length === 1) {
        element.attr("data-ec-indicators-key", field.key);
      }
      continue;
    }

    if (field.kind === "clientLogos") {
      const element = $(field.selector).first();
      if (element.length === 1) {
        element.attr("data-ec-clients-key", field.key);
      }
      continue;
    }

    if (field.kind === "link") {
      const element = $(field.selector).first();
      if (element.length === 1 && element.closest("#highlightCard, [data-ec-cardlist-key]").length === 0) {
        element.attr("data-ec-link-key", field.key);
      }
      continue;
    }

    if (field.kind === "backgroundImage") {
      const element = $(field.selector).first();
      if (element.length === 1) {
        element.attr("data-ec-bg-key", field.key);
      }
      continue;
    }

    if (field.kind === "sectionOrder") {
      const parent = $(field.parentSelector).first();
      if (parent.length === 1) {
        parent.attr("data-ec-section-parent", field.key);
      }
      for (const item of field.items) {
        const sectionEl = $(item.selector).first();
        if (sectionEl.length === 1) {
          sectionEl.attr("data-ec-section-item", item.selector);
          sectionEl.attr("data-ec-section-label", item.label);
        }
      }
    }
  }

  for (const [selector, textEntries] of textFieldsBySelector.entries()) {
    const element = $(selector).first();
    if (element.length === 1) {
      if (element.parents("[data-ec-richtext-key]").length > 0) {
        continue;
      }
      element.attr("data-ec-text-fields", JSON.stringify(textEntries));
    }
  }

  const headerEl = $("header.site-header").first();
  if (headerEl.length === 1) {
    headerEl.removeAttr("data-ec-shortcut");
    headerEl.attr("data-ec-nav-inline", "true");
  }

  const footerEl = $("footer").first();
  if (footerEl.length === 1) {
    footerEl.removeAttr("data-ec-shortcut");
    footerEl.removeAttr("data-ec-managed");
    footerEl.find("[data-ec-managed='global']").removeAttr("data-ec-managed");
    const globalKeys = ["address1", "address2", "address3", "postalCode"];
    globalKeys.forEach((key, index) => {
      const p = footerEl.find(".footer-location-details p").eq(index);
      if (p.length === 1) p.attr("data-ec-global-text", key);
    });
    const phoneEl = footerEl.find(".footer-phone-number").first();
    if (phoneEl.length === 1) phoneEl.attr("data-ec-global-text", "phoneLabel");
    const emailEl = footerEl.find(".footer-email-row span").first();
    if (emailEl.length === 1) emailEl.attr("data-ec-global-text", "email");
    const copyrightEl = footerEl.find(".copyright-left").first();
    if (copyrightEl.length === 1) copyrightEl.attr("data-ec-global-text", "copyright");
    const whatsappLink = footerEl.find("a.footer-whatsapp-row").first();
    if (whatsappLink.length === 1) whatsappLink.attr("data-ec-global-link", "whatsapp");
    const instaLink = footerEl.find('a[aria-label="Instagram"]').first();
    if (instaLink.length === 1) instaLink.attr("data-ec-global-link", "instagram");
    const linkedinLink = footerEl.find('a[aria-label="LinkedIn"]').first();
    if (linkedinLink.length === 1) linkedinLink.attr("data-ec-global-link", "linkedin");
  }
}

export function applyContentPatches(markup: string, rawPatches: unknown, routePath?: string): string {
  if (!Array.isArray(rawPatches) || rawPatches.length === 0) return markup;

  const fields = routePath ? editableFieldsForRoute(markup, routePath) : extractEditableFields(markup);
  const patches = normalizePageContentPatches(rawPatches, fields);
  const htmlPatches = patches.filter((patch) => patch.key !== solutionCardImageKey);
  if (htmlPatches.length === 0) return markup;
  const fieldsByKey = new Map(fields.map((field) => [field.key, field]));
  const $ = load(markup.replace(/^\uFEFF/, ""));

  applyFieldPatchesToCheerio($, fieldsByKey, htmlPatches);
  applySectionOrderPatchesToCheerio($, fieldsByKey, htmlPatches);

  return $.html();
}

export function applyContentPatchesWithInlineAnnotations(
  markup: string,
  rawPatches: unknown,
  routePath?: string,
): { markup: string; fields: EditablePageField[]; cardPrototypes: CardPrototypeMap } {
  const normalizedSource = markup.replace(/^\uFEFF/, "");
  const fields = routePath ? editableFieldsForRoute(normalizedSource, routePath) : extractEditableFields(normalizedSource);
  const hasPatches = Array.isArray(rawPatches) && rawPatches.length > 0;
  const patches = hasPatches ? normalizePageContentPatches(rawPatches, fields) : [];
  const hydratedFields = hasPatches ? hydrateEditableFields(normalizedSource, patches, routePath) : fields;
  const htmlPatches = patches.filter((patch) => patch.key !== solutionCardImageKey);
  const fieldsByKey = new Map(fields.map((field) => [field.key, field]));
  const $ = load(normalizedSource);
  const { prototypes: cardPrototypes } = extractCardListFields($, getSelector);

  if (htmlPatches.length > 0) {
    applyFieldPatchesToCheerio($, fieldsByKey, htmlPatches);
  }

  annotateInlineEditableDom($, hydratedFields);

  if (htmlPatches.length > 0) {
    applySectionOrderPatchesToCheerio($, fieldsByKey, htmlPatches);
  }

  return {
    markup: $.html(),
    fields: hydratedFields,
    cardPrototypes,
  };
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
