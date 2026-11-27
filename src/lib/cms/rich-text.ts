export const ALLOWED_RICH_TEXT_TAGS = new Set([
  "strong",
  "b",
  "em",
  "i",
  "u",
  "br",
  "span",
]);

export const ALLOWED_RICH_TEXT_CLASSES = new Set([
  "faq-v2-highlight",
  "hero-title-highlight",
  "highlight",
  "highlight-blue-gradient",
  "highlight-cyan",
  "segmentos-highlight",
  "sn-commitment-line-1",
  "sn-commitment-line-2",
  "sn-highlight-blue",
  "ec-accent-primary",
  "ec-accent-cyan",
]);

export const MAX_RICH_TEXT_LENGTH = 12_000;

export function normalizeHexColor(raw: string): string | null {
  const value = raw.trim().toLowerCase();
  const hex6 = /^#([0-9a-f]{6})$/i.exec(value);
  if (hex6) return `#${hex6[1].toLowerCase()}`;

  const hex3 = /^#([0-9a-f]{3})$/i.exec(value);
  if (hex3) {
    const [r, g, b] = hex3[1];
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }

  const rgb = /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)$/i.exec(
    value,
  );
  if (rgb) {
    const toHex = (n: string) =>
      Math.max(0, Math.min(255, Number(n))).toString(16).padStart(2, "0");
    return `#${toHex(rgb[1])}${toHex(rgb[2])}${toHex(rgb[3])}`;
  }

  return null;
}

function decodeBasicEntities(text: string): string {
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&quot;/gi, '"')
    .replace(/&#0*39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&amp;/gi, "&");
}

function escapeHtmlText(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeHtmlAttr(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function parseAttributes(rawAttrs: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const attrRe = /([a-zA-Z_:][\w:.-]*)\s*(?:=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let match: RegExpExecArray | null;
  while ((match = attrRe.exec(rawAttrs)) !== null) {
    const name = match[1].toLowerCase();
    const val = match[2] ?? match[3] ?? match[4] ?? "";
    attrs[name] = decodeBasicEntities(val);
  }
  return attrs;
}

function extractColorFromStyle(styleRaw: string | undefined): string | null {
  if (!styleRaw) return null;
  for (const decl of styleRaw.split(";")) {
    const sep = decl.indexOf(":");
    if (sep < 1) continue;
    const prop = decl.slice(0, sep).trim().toLowerCase();
    const val = decl.slice(sep + 1).trim();
    if (prop === "color") {
      const normalized = normalizeHexColor(val);
      if (normalized) return normalized;
    }
  }
  return null;
}

type OpenTagFrame = {
  inputTag: string;
  outputTag: "strong" | "em" | "u" | "span" | null;
  attrs: string;
  isBlockBreak?: boolean;
};

const DROP_SUBTREE_RE = /<(script|style|iframe|svg|object|embed|template|noscript)\b[^>]*>[\s\S]*?<\/\1\s*>/gi;
const DROP_VOID_SUBTREE_RE = /<(script|style|iframe|svg|object|embed|template|noscript)\b[^>]*\/?>/gi;
const BLOCK_BREAK_TAGS = new Set(["div", "p", "li", "h1", "h2", "h3", "h4", "h5", "h6"]);

export function sanitizeRichTextHtml(raw: string): string {
  if (!raw) return "";
  const cleaned = raw
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(DROP_SUBTREE_RE, "")
    .replace(DROP_VOID_SUBTREE_RE, "");

  const tokenRe = /<\/?([a-zA-Z][a-zA-Z0-9:-]*)(\s+(?:[^"'<>]|"[^"]*"|'[^']*')*)?\s*\/?>/g;
  const stack: OpenTagFrame[] = [];
  let out = "";
  let lastIndex = 0;

  const appendBreakIfNeeded = () => {
    if (out.length > 0 && !out.endsWith("<br>")) {
      out += "<br>";
    }
  };

  let match: RegExpExecArray | null;
  while ((match = tokenRe.exec(cleaned)) !== null) {
    if (match.index > lastIndex) {
      const chunk = cleaned.slice(lastIndex, match.index);
      out += escapeHtmlText(decodeBasicEntities(chunk));
    }
    lastIndex = tokenRe.lastIndex;

    const full = match[0];
    const isClosing = full.startsWith("</");
    const rawTag = match[1].toLowerCase();
    const rawAttrs = match[2] ?? "";

    if (isClosing) {
      for (let i = stack.length - 1; i >= 0; i--) {
        const frame = stack[i];
        if (frame.inputTag === rawTag) {
          for (let j = stack.length - 1; j >= i; j--) {
            const popped = stack.pop()!;
            if (popped.outputTag) {
              out += `</${popped.outputTag}>`;
            } else if (popped.isBlockBreak) {
              appendBreakIfNeeded();
            }
          }
          break;
        }
      }
      continue;
    }

    if (rawTag === "br") {
      out += "<br>";
      continue;
    }

    if (rawTag === "strong" || rawTag === "b") {
      stack.push({ inputTag: rawTag, outputTag: "strong", attrs: "" });
      out += "<strong>";
      continue;
    }

    if (rawTag === "em" || rawTag === "i") {
      stack.push({ inputTag: rawTag, outputTag: "em", attrs: "" });
      out += "<em>";
      continue;
    }

    if (rawTag === "u") {
      stack.push({ inputTag: rawTag, outputTag: "u", attrs: "" });
      out += "<u>";
      continue;
    }

    if (rawTag === "span" || rawTag === "font") {
      const attrs = parseAttributes(rawAttrs);
      const classTokens =
        rawTag === "span" && attrs.class
          ? Array.from(
              new Set(
                attrs.class
                  .split(/\s+/)
                  .map((c) => c.trim())
                  .filter((c) => ALLOWED_RICH_TEXT_CLASSES.has(c)),
              ),
            )
          : [];
      const color =
        extractColorFromStyle(attrs.style) ??
        (rawTag === "font" && attrs.color ? normalizeHexColor(attrs.color) : null);

      const parts: string[] = [];
      if (classTokens.length > 0) {
        parts.push(`class="${escapeHtmlAttr(classTokens.join(" "))}"`);
      }
      if (color) {
        parts.push(`style="color: ${color}"`);
      }

      if (parts.length > 0) {
        const attrStr = ` ${parts.join(" ")}`;
        stack.push({ inputTag: rawTag, outputTag: "span", attrs: attrStr });
        out += `<span${attrStr}>`;
      } else {
        stack.push({ inputTag: rawTag, outputTag: null, attrs: "" });
      }
      continue;
    }

    if (full.endsWith("/>") || rawTag === "img" || rawTag === "hr" || rawTag === "input") {
      continue;
    }

    stack.push({
      inputTag: rawTag,
      outputTag: null,
      attrs: "",
      isBlockBreak: BLOCK_BREAK_TAGS.has(rawTag),
    });
  }

  if (lastIndex < cleaned.length) {
    out += escapeHtmlText(decodeBasicEntities(cleaned.slice(lastIndex)));
  }

  while (stack.length > 0) {
    const popped = stack.pop()!;
    if (popped.outputTag) {
      out += `</${popped.outputTag}>`;
    }
  }

  // Trim trailing <br> added from block wrapper close
  out = out.replace(/(?:<br>)+$/i, "");
  return out;
}

export function stripRichTextToPlain(html: string): string {
  return decodeBasicEntities(html.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "")).trim();
}
