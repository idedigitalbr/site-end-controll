import { createElement, type Attributes, type CSSProperties, type ElementType, type ReactNode } from "react";
import { load } from "cheerio";
import { LegacyScriptBootstrap } from "@/components/public/legacy-script-bootstrap";
import type { LegacyScriptDescriptor } from "@/components/public/legacy-script-policy";

type HtmlNode = {
  type: string;
  name?: string;
  data?: string;
  attribs?: Record<string, string>;
  children?: HtmlNode[];
};

export type LegacyPageMetadata = {
  title: string | null;
  description: string | null;
  canonicalUrl: string | null;
  robots: string | null;
  openGraph: {
    title: string | null;
    description: string | null;
    url: string | null;
    siteName: string | null;
    type: string | null;
    locale: string | null;
    images: Array<{ url: string; alt: string | null; width: string | null; height: string | null }>;
  };
  twitter: {
    card: string | null;
    title: string | null;
    description: string | null;
    site: string | null;
    creator: string | null;
    images: string[];
  };
  icons: Array<{ href: string; type: string | null; sizes: string | null; rel: string }>;
};

export type PreparedLegacyPageTemplate = {
  lang: string;
  bodyClassName: string;
  metadata: LegacyPageMetadata;
  headElements: ReactNode[];
  jsonLd: string[];
  scripts: LegacyScriptDescriptor[];
  bodyElements: ReactNode[];
};

const voidElements = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr",
]);

const booleanAttributes = new Set([
  "allowfullscreen", "async", "autofocus", "autoplay", "checked", "controls", "default", "defer", "disabled",
  "formnovalidate", "hidden", "inert", "ismap", "loop", "multiple", "muted", "nomodule", "novalidate", "open",
  "playsinline", "readonly", "required", "reversed", "selected",
]);

const staticValueInputTypes = new Set(["button", "checkbox", "hidden", "image", "radio", "reset", "submit"]);

const attributeNames: Record<string, string> = {
  acceptcharset: "acceptCharset",
  allowfullscreen: "allowFullScreen",
  autofocus: "autoFocus",
  autoplay: "autoPlay",
  class: "className",
  crossorigin: "crossOrigin",
  datetime: "dateTime",
  for: "htmlFor",
  formnovalidate: "formNoValidate",
  "http-equiv": "httpEquiv",
  inputmode: "inputMode",
  ismap: "isMap",
  maxlength: "maxLength",
  minlength: "minLength",
  nomodule: "noModule",
  novalidate: "noValidate",
  playsinline: "playsInline",
  readonly: "readOnly",
  tabindex: "tabIndex",
  usemap: "useMap",
  viewbox: "viewBox",
  preserveaspectratio: "preserveAspectRatio",
  "fill-rule": "fillRule",
  "clip-rule": "clipRule",
  "stroke-dasharray": "strokeDasharray",
  "stroke-dashoffset": "strokeDashoffset",
  "stroke-linecap": "strokeLinecap",
  "stroke-linejoin": "strokeLinejoin",
  "stroke-miterlimit": "strokeMiterlimit",
  "stroke-width": "strokeWidth",
  "xlink:href": "xlinkHref",
  "xml:space": "xmlSpace",
};

function toCssPropertyName(name: string) {
  if (name.startsWith("--")) return name;
  return name.replace(/-([a-z])/g, (_match, letter: string) => letter.toUpperCase());
}

function rootRelativeUrl(source: string) {
  const value = source.trim();
  if (!value || value.startsWith("#") || value.startsWith("//") || /^[a-z][a-z\d+.-]*:/i.test(value)) return source;
  try {
    const resolved = new URL(value, "https://endcontrol.invalid/");
    return `${resolved.pathname}${resolved.search}${resolved.hash}`;
  } catch {
    return source;
  }
}

function parseInlineStyle(source: string, rootRelativeUrls = false): CSSProperties {
  const style: Record<string, string> = {};
  for (const declaration of source.split(";")) {
    const separator = declaration.indexOf(":");
    if (separator < 1) continue;
    const property = declaration.slice(0, separator).trim();
    const value = declaration.slice(separator + 1).trim();
    if (!property || !value) continue;
    const normalizedValue = rootRelativeUrls
      ? value.replace(/url\(\s*(['"]?)(.*?)\1\s*\)/gi, (_match, quote: string, url: string) => `url(${quote}${rootRelativeUrl(url)}${quote})`)
      : value;
    style[toCssPropertyName(property)] = normalizedValue;
  }
  return style as CSSProperties;
}

function readReactAttributes(node: HtmlNode, key: string, rootRelativeUrls: boolean) {
  const props: Record<string, unknown> = { key };
  const tagName = node.name?.toLowerCase() ?? "";
  const inputType = tagName === "input" ? (node.attribs?.type?.trim().toLowerCase() || "text") : "";

  for (const [sourceName, sourceValue] of Object.entries(node.attribs ?? {})) {
    const normalizedName = sourceName.toLowerCase();
    if (normalizedName.startsWith("on")) continue;
    if (normalizedName === "src" && sourceValue.trim() === "") continue;

    if (normalizedName === "checked" && tagName === "input") {
      props.defaultChecked = true;
      continue;
    }

    if (
      normalizedName === "value"
      && (tagName === "textarea" || tagName === "select" || (tagName === "input" && !staticValueInputTypes.has(inputType)))
    ) {
      props.defaultValue = sourceValue;
      continue;
    }

    const name = attributeNames[normalizedName] ?? sourceName;
    if (normalizedName === "style") {
      props.style = parseInlineStyle(sourceValue, rootRelativeUrls);
    } else if (booleanAttributes.has(normalizedName)) {
      props[name] = true;
    } else {
      const urlAttribute = new Set(["action", "data", "formaction", "href", "poster", "src", "xlink:href"]);
      props[name] = rootRelativeUrls && urlAttribute.has(normalizedName)
        ? rootRelativeUrl(sourceValue)
        : sourceValue;
    }
  }

  if (node.name === "link" && node.attribs?.rel?.toLowerCase() === "stylesheet") {
    props.precedence = "default";
  }

  return props as Attributes & Record<string, unknown>;
}

function rawText(node: HtmlNode) {
  return (node.children ?? [])
    .filter((child) => child.type === "text")
    .map((child) => child.data ?? "")
    .join("");
}

function scriptType(node: HtmlNode) {
  return node.attribs?.type?.split(";", 1)[0].trim().toLowerCase() ?? "";
}

function isScriptElement(node: HtmlNode) {
  return (node.type === "tag" || node.type === "script") && node.name === "script";
}

function isExecutableScript(node: HtmlNode) {
  if (!isScriptElement(node)) return false;
  const type = scriptType(node);
  return !type || type === "module" || [
    "application/ecmascript",
    "application/javascript",
    "text/ecmascript",
    "text/javascript",
  ].includes(type);
}

function scriptDescriptor(node: HtmlNode, rootRelativeUrls: boolean): LegacyScriptDescriptor {
  const attributes = { ...(node.attribs ?? {}) };
  if (rootRelativeUrls && attributes.src) attributes.src = rootRelativeUrl(attributes.src);
  return { attributes, content: rawText(node) };
}

function renderHtmlNode(
  node: HtmlNode,
  key: string,
  rootRelativeUrls: boolean,
  scripts: LegacyScriptDescriptor[],
): ReactNode {
  if (node.type === "text") return node.data ?? "";
  if (node.type === "comment" || node.type === "directive") return null;

  if (node.type === "root" || node.type === "document") {
    return (node.children ?? []).map((child, index) => renderHtmlNode(child, `${key}-${index}`, rootRelativeUrls, scripts));
  }

  if (node.type !== "tag" && node.type !== "script" && node.type !== "style") return null;
  if (!node.name || node.name === "html" || node.name === "head" || node.name === "body") {
    return (node.children ?? []).map((child, index) =>
      renderHtmlNode(child, `${key}-${index}`, rootRelativeUrls, scripts),
    );
  }

  const tag = node.name;
  if (tag === "script" && isExecutableScript(node)) {
    scripts.push(scriptDescriptor(node, rootRelativeUrls));
    return null;
  }

  const props = readReactAttributes(node, key, rootRelativeUrls);

  if (tag === "script" || tag === "style") {
    const text = rawText(node);
    return createElement(tag as ElementType, {
      ...props,
      dangerouslySetInnerHTML: { __html: text },
    });
  }

  if (voidElements.has(tag)) {
    return createElement(tag as ElementType, props);
  }

  const children = (node.children ?? []).map((child, index) =>
    renderHtmlNode(child, `${key}-${index}`, rootRelativeUrls, scripts),
  );
  return createElement(tag as ElementType, props, ...children);
}

function hasGeneratedMetadata(node: HtmlNode) {
  if (node.type !== "tag" || !node.name) return false;
  if (node.name === "title") return true;

  if (node.name === "meta") {
    const name = node.attribs?.name?.toLowerCase() ?? "";
    const property = node.attribs?.property?.toLowerCase() ?? "";
    return name === "description"
      || name === "robots"
      || name.startsWith("twitter:")
      || property.startsWith("og:")
      || node.attribs?.charset !== undefined
      || name === "viewport";
  }

  if (node.name === "link") {
    const rel = node.attribs?.rel?.toLowerCase() ?? "";
    return rel === "canonical"
      || rel === "icon"
      || rel === "shortcut icon"
      || rel === "apple-touch-icon";
  }

  return false;
}

function metaContent($: ReturnType<typeof load>, selector: string) {
  return $(selector).first().attr("content")?.trim() || null;
}

function allMetaContent($: ReturnType<typeof load>, selector: string) {
  const values: string[] = [];
  $(selector).each((_index, element) => {
    const value = $(element).attr("content")?.trim();
    if (value) values.push(value);
  });
  return values;
}

function readMetadata($: ReturnType<typeof load>): LegacyPageMetadata {
  const imageUrls = allMetaContent($, "head meta[property='og:image']");
  const imageAlts = allMetaContent($, "head meta[property='og:image:alt']");
  const imageWidths = allMetaContent($, "head meta[property='og:image:width']");
  const imageHeights = allMetaContent($, "head meta[property='og:image:height']");
  const images = imageUrls.map((url, index) => ({
    url,
    alt: imageAlts[index] ?? null,
    width: imageWidths[index] ?? null,
    height: imageHeights[index] ?? null,
  }));

  const icons = $("head link[rel='icon'], head link[rel='shortcut icon'], head link[rel='apple-touch-icon']")
    .toArray()
    .flatMap((element) => {
      const href = $(element).attr("href")?.trim();
      if (!href) return [];
      return [{
        href,
        rel: $(element).attr("rel")?.trim() || "icon",
        type: $(element).attr("type")?.trim() || null,
        sizes: $(element).attr("sizes")?.trim() || null,
      }];
    });

  return {
    title: $("head title").first().text().trim() || null,
    description: metaContent($, "head meta[name='description']"),
    canonicalUrl: $("head link[rel='canonical']").first().attr("href")?.trim() || null,
    robots: metaContent($, "head meta[name='robots']"),
    openGraph: {
      title: metaContent($, "head meta[property='og:title']"),
      description: metaContent($, "head meta[property='og:description']"),
      url: metaContent($, "head meta[property='og:url']"),
      siteName: metaContent($, "head meta[property='og:site_name']"),
      type: metaContent($, "head meta[property='og:type']"),
      locale: metaContent($, "head meta[property='og:locale']"),
      images,
    },
    twitter: {
      card: metaContent($, "head meta[name='twitter:card']"),
      title: metaContent($, "head meta[name='twitter:title']"),
      description: metaContent($, "head meta[name='twitter:description']"),
      site: metaContent($, "head meta[name='twitter:site']"),
      creator: metaContent($, "head meta[name='twitter:creator']"),
      images: allMetaContent($, "head meta[name='twitter:image']"),
    },
    icons,
  };
}

export function prepareLegacyHtmlTemplate(
  markup: string,
  options: { rootRelativeUrls?: boolean } = {},
): PreparedLegacyPageTemplate {
  const rootRelativeUrls = options.rootRelativeUrls ?? false;
  const normalizedMarkup = markup.startsWith("\uFEFF") ? markup.slice(1) : markup;
  const $ = load(normalizedMarkup);
  const head = $("head").first();
  const body = $("body").first();
  const headElements: ReactNode[] = [];
  const jsonLd: string[] = [];
  const scripts: LegacyScriptDescriptor[] = [];

  head.contents().toArray().forEach((candidate, index) => {
    const node = candidate as unknown as HtmlNode;
    if (hasGeneratedMetadata(node)) return;

    if (isScriptElement(node) && scriptType(node) === "application/ld+json") {
      const value = rawText(node).trim();
      if (value) jsonLd.push(value);
      return;
    }

    // Public templates are allowlisted originals; CMS content patches never supply executable markup.
    if (isExecutableScript(node)) {
      scripts.push(scriptDescriptor(node, rootRelativeUrls));
      return;
    }

    headElements.push(renderHtmlNode(node, `head-${index}`, rootRelativeUrls, scripts));
  });

  const bodyElements = body.contents().toArray().map((candidate, index) =>
    renderHtmlNode(candidate as unknown as HtmlNode, `body-${index}`, rootRelativeUrls, scripts),
  );

  return {
    lang: $("html").first().attr("lang")?.trim() || "pt-BR",
    bodyClassName: body.attr("class")?.trim() || "",
    metadata: readMetadata($),
    headElements,
    jsonLd,
    scripts,
    bodyElements,
  };
}

export function LegacyReactTemplate({
  template,
  pageJsonLd,
  scriptKey,
}: {
  template: PreparedLegacyPageTemplate;
  pageJsonLd?: string | null;
  scriptKey: string;
}) {
  const jsonLd = pageJsonLd ? [...template.jsonLd, pageJsonLd] : template.jsonLd;

  return (
    <>
      {template.headElements}
      {jsonLd.map((json, index) => (
        <script
          key={`json-ld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: json }}
        />
      ))}
      {template.bodyElements}
      <LegacyScriptBootstrap pageKey={scriptKey} scripts={template.scripts} />
    </>
  );
}
