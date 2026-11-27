import {
  isSafeEditableLink,
  isValidObjectPosition,
  replaceLastCssUrl,
  type CardListItem,
  type ClientLogoItem,
  type DirectorCardItem,
  type EditableCardListField,
  type EditablePageField,
  type HomeSolutionCardItem,
  type IndicatorItem,
  type InlineNavigationContent,
  type PageContentPatch,
} from "@/lib/cms/inline-editor-types";
import {
  MAX_RICH_TEXT_LENGTH,
  sanitizeRichTextHtml,
  stripRichTextToPlain,
} from "@/lib/cms/rich-text";

export const ALLOWED_MEDIA_URL_RE =
  /^\/media\/[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(?:jpe?g|png|webp|gif|avif)$/i;
export const ALLOWED_VIDEO_URL_RE =
  /^\/media\/[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(?:mp4|webm|mov)$/i;

export function stripControlChars(value: string): string {
  return value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "");
}

export type DraftOverrideEntry = {
  value:
    | string
    | string[]
    | IndicatorItem[]
    | ClientLogoItem[]
    | HomeSolutionCardItem[]
    | DirectorCardItem[]
    | CardListItem[];
  altText?: string;
  objectPosition?: string;
};

export function extractDraftDiffs(
  baseFields: EditablePageField[],
  currentFields: EditablePageField[],
): Record<string, DraftOverrideEntry> {
  const currentByKey = new Map(currentFields.map((field) => [field.key, field]));
  const diffs: Record<string, DraftOverrideEntry> = {};

  for (const base of baseFields) {
    const current = currentByKey.get(base.key);
    if (!current || current.kind !== base.kind) continue;

    if (base.kind === "image" && current.kind === "image") {
      if (
        current.value !== base.value ||
        current.altText !== base.altText ||
        (current.objectPosition ?? "") !== (base.objectPosition ?? "")
      ) {
        diffs[base.key] = {
          value: current.value,
          altText: current.altText,
          ...(current.objectPosition !== undefined ? { objectPosition: current.objectPosition } : {}),
        };
      }
      continue;
    }

    if (base.kind === "sectionOrder" && current.kind === "sectionOrder") {
      const changed =
        current.value.length !== base.value.length ||
        current.value.some((sel, idx) => sel !== base.value[idx]);
      if (changed) {
        diffs[base.key] = { value: current.value };
      }
      continue;
    }

    if (
      (base.kind === "indicators" && current.kind === "indicators") ||
      (base.kind === "clientLogos" && current.kind === "clientLogos") ||
      (base.kind === "homeSolutions" && current.kind === "homeSolutions") ||
      (base.kind === "directorCards" && current.kind === "directorCards") ||
      (base.kind === "cardList" && current.kind === "cardList")
    ) {
      if (JSON.stringify(current.value) !== JSON.stringify(base.value)) {
        diffs[base.key] = { value: current.value };
      }
      continue;
    }

    if (current.value !== base.value) {
      diffs[base.key] = { value: current.value as string };
    }
  }

  return diffs;
}

export function hydrateDraftOverrides(
  baseFields: EditablePageField[],
  rawDraft: unknown,
): { fields: EditablePageField[]; appliedCount: number } {
  if (!rawDraft || typeof rawDraft !== "object" || Array.isArray(rawDraft)) {
    return { fields: baseFields, appliedCount: 0 };
  }

  const record = rawDraft as Record<string, unknown>;
  let appliedCount = 0;

  const fields = baseFields.map((base) => {
    if (!Object.prototype.hasOwnProperty.call(record, base.key)) return base;
    const candidate = record[base.key];
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) return base;
    const entry = candidate as Record<string, unknown>;

    if (base.kind === "text") {
      if (typeof entry.value !== "string" || entry.value.length > 8_000) return base;
      const sanitized = stripControlChars(entry.value);
      if (sanitized !== base.value) appliedCount += 1;
      return { ...base, value: sanitized };
    }

    if (base.kind === "richText") {
      if (typeof entry.value !== "string" || entry.value.length > MAX_RICH_TEXT_LENGTH) return base;
      const sanitized = sanitizeRichTextHtml(entry.value);
      if (sanitized.length > MAX_RICH_TEXT_LENGTH || !stripRichTextToPlain(sanitized)) return base;
      if (sanitized !== base.value) appliedCount += 1;
      return { ...base, value: sanitized };
    }

    if (base.kind === "image") {
      if (typeof entry.value !== "string" || entry.value.length > 2_048) return base;
      const isAllowedUrl =
        entry.value === base.originalValue || ALLOWED_MEDIA_URL_RE.test(entry.value);
      if (!isAllowedUrl) return base;
      const altText =
        typeof entry.altText === "string" && entry.altText.length <= 255
          ? stripControlChars(entry.altText)
          : base.altText;
      const objectPosition =
        typeof entry.objectPosition === "string" && isValidObjectPosition(entry.objectPosition.trim())
          ? entry.objectPosition.trim()
          : base.objectPosition;
      if (
        entry.value !== base.value ||
        altText !== base.altText ||
        (objectPosition ?? "") !== (base.objectPosition ?? "")
      ) {
        appliedCount += 1;
      }
      return { ...base, value: entry.value, altText, ...(objectPosition !== undefined ? { objectPosition } : {}) };
    }

    if (base.kind === "backgroundImage") {
      if (typeof entry.value !== "string" || entry.value.length > 2_048) return base;
      const isAllowedUrl =
        entry.value === base.originalValue || ALLOWED_MEDIA_URL_RE.test(entry.value);
      if (!isAllowedUrl) return base;
      if (entry.value !== base.value) appliedCount += 1;
      return { ...base, value: entry.value };
    }

    if (base.kind === "link") {
      if (typeof entry.value !== "string" || entry.value.length > 2_048) return base;
      const trimmed = stripControlChars(entry.value).trim();
      if (trimmed !== base.originalValue && !isSafeEditableLink(trimmed)) return base;
      if (trimmed !== base.value) appliedCount += 1;
      return { ...base, value: trimmed };
    }

    if (base.kind === "sectionOrder") {
      if (
        !Array.isArray(entry.value) ||
        entry.value.length !== base.value.length ||
        entry.value.some((v) => typeof v !== "string") ||
        new Set(entry.value as string[]).size !== base.value.length ||
        base.value.some((v) => !(entry.value as string[]).includes(v))
      ) {
        return base;
      }
      const nextOrder = [...(entry.value as string[])];
      if (nextOrder.some((v, idx) => v !== base.value[idx])) appliedCount += 1;
      return { ...base, value: nextOrder };
    }

    if (base.kind === "indicators") {
      if (!Array.isArray(entry.value) || entry.value.length < 1 || entry.value.length > 24) {
        return base;
      }
      const validated: IndicatorItem[] = [];
      for (const rawItem of entry.value) {
        if (!rawItem || typeof rawItem !== "object") return base;
        const item = rawItem as Record<string, unknown>;
        const value =
          typeof item.value === "string" ? stripControlChars(item.value).replace(/[<>]/g, "").trim() : "";
        const label =
          typeof item.label === "string" ? stripControlChars(item.label).replace(/[<>]/g, "").trim() : "";
        if (!value || value.length > 24 || !label || label.length > 80) return base;
        validated.push({ value, label });
      }
      if (JSON.stringify(validated) !== JSON.stringify(base.value)) appliedCount += 1;
      return { ...base, value: validated };
    }

    if (base.kind === "clientLogos") {
      if (!Array.isArray(entry.value) || entry.value.length < 1 || entry.value.length > 40) {
        return base;
      }
      const allowedOriginalSrcs = new Set(base.originalValue.map((item) => item.src));
      const validated: ClientLogoItem[] = [];
      for (const rawItem of entry.value) {
        if (!rawItem || typeof rawItem !== "object") return base;
        const item = rawItem as Record<string, unknown>;
        const src = typeof item.src === "string" ? item.src.trim() : "";
        const alt =
          typeof item.alt === "string" ? stripControlChars(item.alt).trim().slice(0, 255) : "";
        if (!src || src.length > 2_048 || (!allowedOriginalSrcs.has(src) && !ALLOWED_MEDIA_URL_RE.test(src))) {
          return base;
        }
        validated.push({ src, alt });
      }
      if (JSON.stringify(validated) !== JSON.stringify(base.value)) appliedCount += 1;
      return { ...base, value: validated };
    }

    if (base.kind === "homeSolutions") {
      if (!Array.isArray(entry.value) || entry.value.length < 1 || entry.value.length > 12) {
        return base;
      }
      const origByRoute = new Map(base.originalValue.map((item) => [item.routePath, item]));
      const seenRoutes = new Set<string>();
      const cleanText = (v: unknown, maxLen: number) =>
        typeof v === "string" ? stripControlChars(v).replace(/[<>]/g, "").trim().slice(0, maxLen) : "";

      const validated: HomeSolutionCardItem[] = [];
      for (const rawItem of entry.value) {
        if (!rawItem || typeof rawItem !== "object") return base;
        const item = rawItem as Record<string, unknown>;
        const routePath = typeof item.routePath === "string" ? item.routePath.trim() : "";
        const orig = origByRoute.get(routePath);
        if (!orig || seenRoutes.has(routePath)) return base;
        seenRoutes.add(routePath);

        const tag = cleanText(item.tag, 40);
        const category = cleanText(item.category, 120);
        const title = cleanText(item.title, 160);
        const desc = cleanText(item.desc, 600);
        const ctaText = cleanText(item.ctaText, 60);
        if (!tag || !category || !title || !desc || !ctaText) return base;

        if (!Array.isArray(item.topics) || item.topics.length < 1 || item.topics.length > 8) {
          return base;
        }
        const topics: string[] = [];
        for (const t of item.topics) {
          const cleanT = cleanText(t, 160);
          if (!cleanT) return base;
          topics.push(cleanT);
        }

        const image = typeof item.image === "string" ? item.image.trim() : "";
        if (!image || image.length > 2_048 || (image !== orig.image && !ALLOWED_MEDIA_URL_RE.test(image))) {
          return base;
        }
        const imageAlt =
          typeof item.imageAlt === "string" && item.imageAlt.length <= 255
            ? stripControlChars(item.imageAlt)
            : title;
        const objectPosition =
          typeof item.objectPosition === "string" && isValidObjectPosition(item.objectPosition.trim())
            ? item.objectPosition.trim()
            : orig.objectPosition;

        validated.push({
          routePath,
          tag,
          category,
          title,
          desc,
          topics,
          ctaText,
          image,
          imageAlt,
          ...(objectPosition !== undefined ? { objectPosition } : {}),
        });
      }

      if (JSON.stringify(validated) !== JSON.stringify(base.value)) appliedCount += 1;
      return { ...base, value: validated };
    }

    if (base.kind === "directorCards") {
      if (!Array.isArray(entry.value) || entry.value.length < 1 || entry.value.length > 8) {
        return base;
      }
      const allowedOriginalVideos = new Set(
        base.originalValue.filter((item) => item.mediaType === "video").map((item) => item.src),
      );
      const allowedOriginalImages = new Set(
        base.originalValue.flatMap((item) => {
          const urls: string[] = [];
          if (item.mediaType === "image" && item.src) urls.push(item.src);
          if (item.poster) urls.push(item.poster);
          return urls;
        }),
      );
      const validated: DirectorCardItem[] = [];
      for (const rawItem of entry.value) {
        if (!rawItem || typeof rawItem !== "object") return base;
        const item = rawItem as Record<string, unknown>;
        const mediaType = item.mediaType === "video" || item.mediaType === "image" ? item.mediaType : null;
        if (!mediaType) return base;
        const src = typeof item.src === "string" ? item.src.trim() : "";
        const name =
          typeof item.name === "string"
            ? stripControlChars(item.name).replace(/[<>]/g, "").trim()
            : "";
        const role =
          typeof item.role === "string"
            ? stripControlChars(item.role).replace(/[<>]/g, "").trim()
            : "";
        if (!name || name.length > 80 || role.length > 100) return base;

        if (mediaType === "video") {
          if (!src || src.length > 2_048 || (!allowedOriginalVideos.has(src) && !ALLOWED_VIDEO_URL_RE.test(src))) {
            return base;
          }
          const rawPoster = typeof item.poster === "string" ? item.poster.trim() : "";
          if (
            rawPoster &&
            (rawPoster.length > 2_048 || (!allowedOriginalImages.has(rawPoster) && !ALLOWED_MEDIA_URL_RE.test(rawPoster)))
          ) {
            return base;
          }
          const rawDuration =
            typeof item.duration === "string"
              ? stripControlChars(item.duration).replace(/[<>]/g, "").trim()
              : "";
          if (rawDuration.length > 16) return base;
          validated.push({
            mediaType: "video",
            src,
            ...(rawPoster ? { poster: rawPoster } : {}),
            name,
            role,
            ...(rawDuration ? { duration: rawDuration } : {}),
          });
        } else {
          if (!src || src.length > 2_048 || (!allowedOriginalImages.has(src) && !ALLOWED_MEDIA_URL_RE.test(src))) {
            return base;
          }
          validated.push({
            mediaType: "image",
            src,
            name,
            role,
          });
        }
      }
      if (JSON.stringify(validated) !== JSON.stringify(base.value)) appliedCount += 1;
      return { ...base, value: validated };
    }

    if (base.kind === "cardList") {
      if (
        !Array.isArray(entry.value) ||
        entry.value.length < base.minItems ||
        entry.value.length > base.maxItems
      ) {
        return base;
      }
      const allowedOriginalSrcs = new Set(
        base.originalValue.flatMap((orig) => (orig.image?.src ? [orig.image.src] : [])),
      );
      const seenIds = new Set<string>();
      const validated: CardListItem[] = [];

      for (const rawItem of entry.value) {
        if (!rawItem || typeof rawItem !== "object" || Array.isArray(rawItem)) return base;
        const item = rawItem as Record<string, unknown>;
        const id = typeof item.id === "string" ? item.id.trim() : "";
        if (!id || id.length > 64 || !/^[a-zA-Z0-9_-]+$/.test(id) || seenIds.has(id)) {
          return base;
        }
        seenIds.add(id);

        const sourceIndex = item.sourceIndex;
        if (
          typeof sourceIndex !== "number" ||
          !Number.isInteger(sourceIndex) ||
          sourceIndex < 0 ||
          sourceIndex >= base.originalCount
        ) {
          return base;
        }
        const proto = base.originalValue[sourceIndex];
        if (!proto) return base;

        if (!Array.isArray(item.texts) || item.texts.length !== proto.texts.length) return base;
        const texts: string[] = [];
        for (const rawT of item.texts) {
          if (typeof rawT !== "string") return base;
          const cleaned = stripControlChars(rawT).trim().slice(0, 4_000);
          if (!cleaned) return base;
          texts.push(cleaned);
        }

        let image: CardListItem["image"];
        if (proto.image) {
          if (!item.image || typeof item.image !== "object" || Array.isArray(item.image)) {
            return base;
          }
          const rawImg = item.image as Record<string, unknown>;
          const src = typeof rawImg.src === "string" ? rawImg.src.trim() : "";
          if (
            !src ||
            src.length > 2_048 ||
            (!allowedOriginalSrcs.has(src) && !ALLOWED_MEDIA_URL_RE.test(src))
          ) {
            return base;
          }
          const alt =
            typeof rawImg.alt === "string"
              ? stripControlChars(rawImg.alt).slice(0, 255)
              : proto.image.alt;
          const objectPosition =
            typeof rawImg.objectPosition === "string" &&
            isValidObjectPosition(rawImg.objectPosition.trim())
              ? rawImg.objectPosition.trim()
              : undefined;
          image = {
            src,
            alt,
            ...(objectPosition ? { objectPosition } : {}),
          };
        }

        validated.push({
          id,
          sourceIndex,
          texts,
          ...(image ? { image } : {}),
        });
      }

      if (JSON.stringify(validated) !== JSON.stringify(base.value)) appliedCount += 1;
      return { ...base, value: validated };
    }

    return base;
  });

  return { fields, appliedCount };
}

export type AnnotatedTextEntry = {
  key: string;
  idx: number;
};

export function serializeEditableFields(fields: EditablePageField[]): PageContentPatch[] {
  return fields.map((field) => {
    if (field.kind === "text") return { key: field.key, kind: "text", value: field.value };
    if (field.kind === "richText") return { key: field.key, kind: "richText", value: field.value };
    if (field.kind === "image") {
      return {
        key: field.key,
        kind: "image",
        value: field.value,
        altText: field.altText,
        ...(field.objectPosition ? { objectPosition: field.objectPosition } : {}),
      };
    }
    if (field.kind === "link") return { key: field.key, kind: "link", value: field.value };
    if (field.kind === "backgroundImage") {
      return { key: field.key, kind: "backgroundImage", value: field.value };
    }
    if (field.kind === "indicators") {
      return { key: field.key, kind: "indicators", value: field.value };
    }
    if (field.kind === "clientLogos") {
      return { key: field.key, kind: "clientLogos", value: field.value };
    }
    if (field.kind === "homeSolutions") {
      return { key: field.key, kind: "homeSolutions", value: field.value };
    }
    if (field.kind === "directorCards") {
      return { key: field.key, kind: "directorCards", value: field.value };
    }
    if (field.kind === "cardList") {
      return { key: field.key, kind: "cardList", value: field.value };
    }
    return { key: field.key, kind: "sectionOrder", value: field.value };
  });
}

export function previewImageSrc(value: string): string {
  if (!value) return "";
  if (value.startsWith("/") || /^https?:\/\//i.test(value)) return value;
  return `/${value.replace(/^(?:\.\/)+/, "")}`;
}

export function parseTextFieldEntries(element: Element): AnnotatedTextEntry[] {
  const raw = element.getAttribute("data-ec-text-fields");
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is AnnotatedTextEntry =>
        Boolean(item && typeof item.key === "string" && typeof item.idx === "number"),
    );
  } catch {
    return [];
  }
}

const IGNORED_LIVE_CARD_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "SVG", "TEMPLATE"]);

type LiveCardSlotRef = {
  textNode: Text;
  parentElement: HTMLElement;
  textNodeIndex: number;
  slotIndex: number;
  text: string;
};

function isIgnoredLiveCardNode(el: Element): boolean {
  if (IGNORED_LIVE_CARD_TAGS.has(el.tagName)) return true;
  if (el.hasAttribute("hidden")) return true;
  if (el.getAttribute("aria-hidden") === "true") return true;
  return false;
}

export function collectLiveCardTextSlots(cardEl: HTMLElement): LiveCardSlotRef[] {
  const slots: LiveCardSlotRef[] = [];

  function walk(el: HTMLElement) {
    if (isIgnoredLiveCardNode(el)) return;
    let textNodeIndex = 0;
    for (const child of Array.from(el.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) {
        const textNode = child as Text;
        const normalized = (textNode.data ?? "").replace(/\s+/g, " ").trim();
        if (normalized.length > 0) {
          slots.push({
            textNode,
            parentElement: el,
            textNodeIndex,
            slotIndex: slots.length,
            text: normalized,
          });
        }
        textNodeIndex += 1;
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        walk(child as HTMLElement);
      }
    }
  }

  walk(cardEl);
  return slots;
}

function findVisibleLiveCardImage(cardEl: HTMLElement): HTMLImageElement | null {
  const imgs = Array.from(cardEl.querySelectorAll<HTMLImageElement>("img"));
  for (const img of imgs) {
    let cur: Element | null = img;
    let hidden = false;
    while (cur && cur !== cardEl) {
      if (isIgnoredLiveCardNode(cur)) {
        hidden = true;
        break;
      }
      cur = cur.parentElement;
    }
    if (!hidden && img.getAttribute("src")) return img;
  }
  return null;
}

function liveDomMatchesCardList(container: HTMLElement, field: EditableCardListField): boolean {
  const cardEls = Array.from(container.children).filter((el): el is HTMLElement =>
    el.matches(field.itemSelector),
  );
  if (cardEls.length !== field.value.length) return false;
  return cardEls.every((cardEl, idx) => {
    const expected = field.value[idx];
    if (!expected) return false;
    if ((cardEl.getAttribute("data-ec-cardlist-item-id") ?? "") !== expected.id) return false;
    const slots = collectLiveCardTextSlots(cardEl);
    if (slots.length !== expected.texts.length) return false;
    if (slots.some((s, sIdx) => s.text !== expected.texts[sIdx])) return false;
    const imgEl = findVisibleLiveCardImage(cardEl);
    if (expected.image) {
      if (!imgEl) return false;
      if ((imgEl.getAttribute("src") ?? "") !== expected.image.src) return false;
      if ((imgEl.getAttribute("alt") ?? "") !== expected.image.alt) return false;
      if ((imgEl.style.objectPosition || "") !== (expected.image.objectPosition || "")) {
        return false;
      }
    }
    return true;
  });
}

function htmlToElement(html: string): HTMLElement | null {
  const tpl = document.createElement("template");
  tpl.innerHTML = html.trim();
  return tpl.content.firstElementChild as HTMLElement | null;
}

export function applyFieldsToLiveDom(
  fields: EditablePageField[],
  cardPrototypes?: Record<string, { items: string[]; connector?: string }>,
) {
  if (typeof document === "undefined") return;

  const fieldsByKey = new Map(fields.map((field) => [field.key, field]));

  document.querySelectorAll<HTMLElement>("[data-ec-text-fields]").forEach((element) => {
    if (element.dataset.ecInlineActive === "true") return;
    const richAncestor = element.closest<HTMLElement>("[data-ec-richtext-key]");
    if (richAncestor) {
      const richKey = richAncestor.getAttribute("data-ec-richtext-key");
      const richField = richKey ? fieldsByKey.get(richKey) : undefined;
      if (richField?.kind === "richText" && richField.value !== richField.originalValue) {
        return;
      }
    }
    const entries = parseTextFieldEntries(element);
    if (entries.length === 0) return;

    const textNodes: Text[] = [];
    element.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        textNodes.push(node as Text);
      }
    });

    for (const entry of entries) {
      const field = fieldsByKey.get(entry.key);
      const targetNode = textNodes[entry.idx];
      if (field?.kind === "text" && targetNode && targetNode.data !== field.value) {
        targetNode.data = field.value;
      }
    }
  });

  document.querySelectorAll<HTMLElement>("[data-ec-richtext-key]").forEach((element) => {
    if (element.dataset.ecInlineActive === "true") return;
    const key = element.getAttribute("data-ec-richtext-key");
    if (!key) return;
    const field = fieldsByKey.get(key);
    if (field?.kind !== "richText") return;
    const isModified = field.value !== field.originalValue;
    if (isModified || element.dataset.ecRichtextDirty === "true") {
      const sanitized = sanitizeRichTextHtml(field.value);
      if (element.innerHTML !== sanitized) {
        element.innerHTML = sanitized;
      }
      if (isModified) element.dataset.ecRichtextDirty = "true";
      else delete element.dataset.ecRichtextDirty;
    }
  });

  document.querySelectorAll<HTMLImageElement>("img[data-ec-image-key]").forEach((img) => {
    const key = img.getAttribute("data-ec-image-key");
    if (!key) return;
    const field = fieldsByKey.get(key);
    if (field?.kind !== "image") return;
    const currentSrc = img.getAttribute("src") ?? "";
    if (currentSrc !== field.value) {
      img.setAttribute("src", field.value);
    }
    if ((img.getAttribute("alt") ?? "") !== field.altText) {
      img.setAttribute("alt", field.altText);
    }
    if (img.dataset.ecRepositioning === "true") return;
    if (field.objectPosition) {
      if (img.style.objectPosition !== field.objectPosition) {
        img.style.objectPosition = field.objectPosition;
      }
    } else if (field.objectPosition === "" || img.style.objectPosition) {
      img.style.removeProperty("object-position");
    }
  });

  document.querySelectorAll<HTMLAnchorElement>("a[data-ec-link-key]").forEach((anchor) => {
    const key = anchor.getAttribute("data-ec-link-key");
    if (!key) return;
    const field = fieldsByKey.get(key);
    if (field?.kind !== "link") return;
    const currentHref = anchor.getAttribute("href");
    if (field.value) {
      if (currentHref !== field.value) anchor.setAttribute("href", field.value);
    } else if (currentHref !== null) {
      anchor.removeAttribute("href");
    }
  });

  document.querySelectorAll<HTMLElement>("[data-ec-bg-key]").forEach((element) => {
    const key = element.getAttribute("data-ec-bg-key");
    if (!key) return;
    const field = fieldsByKey.get(key);
    if (field?.kind !== "backgroundImage") return;
    try {
      const nextCss = replaceLastCssUrl(field.styleValue, field.value);
      if (field.styleProperty === "background") {
        element.style.background = nextCss;
      } else {
        element.style.backgroundImage = nextCss;
      }
    } catch {
      // Ignore invalid css background fallback
    }
  });

  document.querySelectorAll<HTMLElement>("[data-ec-section-parent]").forEach((parent) => {
    const key = parent.getAttribute("data-ec-section-parent");
    if (!key) return;
    const field = fieldsByKey.get(key);
    if (field?.kind !== "sectionOrder") return;

    const currentChildren = Array.from(parent.childNodes);
    const allowedSet = new Set(field.items.map((item) => item.selector));
    const slots: number[] = [];
    const bySelector = new Map<string, Element>();

    currentChildren.forEach((child, index) => {
      if (child.nodeType !== Node.ELEMENT_NODE) return;
      const el = child as Element;
      const itemSelector = el.getAttribute("data-ec-section-item");
      if (itemSelector && allowedSet.has(itemSelector)) {
        slots.push(index);
        bySelector.set(itemSelector, el);
      }
    });

    if (slots.length !== field.value.length) return;

    const needsReorder = slots.some((slotIndex, i) => {
      const targetEl = bySelector.get(field.value[i]);
      return targetEl !== currentChildren[slotIndex];
    });
    if (!needsReorder) return;

    const nextNodes = [...currentChildren];
    slots.forEach((slotIndex, idx) => {
      const sectionEl = bySelector.get(field.value[idx]);
      if (sectionEl) nextNodes[slotIndex] = sectionEl;
    });

    const frag = document.createDocumentFragment();
    for (const node of nextNodes) {
      frag.appendChild(node);
    }
    parent.appendChild(frag);
  });

  document.querySelectorAll<HTMLElement>("[data-ec-indicators-key]").forEach((element) => {
    const key = element.getAttribute("data-ec-indicators-key");
    if (!key) return;
    const field = fieldsByKey.get(key);
    if (field?.kind !== "indicators") return;
    const nextJson = JSON.stringify(field.value);
    if (element.getAttribute("data-cms-indicators") !== nextJson) {
      element.setAttribute("data-cms-indicators", nextJson);
      const updater = (element as unknown as { __ecUpdateIndicators?: (items: IndicatorItem[]) => void })
        .__ecUpdateIndicators;
      if (typeof updater === "function") {
        updater(field.value);
      }
    }
  });

  document.querySelectorAll<HTMLElement>("[data-ec-clients-key]").forEach((element) => {
    const key = element.getAttribute("data-ec-clients-key");
    if (!key) return;
    const field = fieldsByKey.get(key);
    if (field?.kind !== "clientLogos") return;

    const existingImgs = Array.from(
      element.querySelectorAll<HTMLImageElement>(".logo-marquee__track:first-child img"),
    );
    const sameLogos =
      existingImgs.length === field.value.length &&
      existingImgs.every(
        (img, idx) =>
          (img.getAttribute("src") ?? "") === field.value[idx]?.src &&
          (img.getAttribute("alt") ?? "") === field.value[idx]?.alt,
      );
    if (sameLogos) return;

    const buildTrack = (isMirror: boolean) => {
      const track = document.createElement("div");
      track.className = "logo-marquee__track";
      if (isMirror) track.setAttribute("aria-hidden", "true");
      for (const logo of field.value) {
        const itemDiv = document.createElement("div");
        itemDiv.className = "logo-marquee__item";
        const imgEl = document.createElement("img");
        imgEl.setAttribute("src", logo.src);
        imgEl.setAttribute("alt", isMirror ? "" : logo.alt);
        imgEl.setAttribute("width", "900");
        imgEl.setAttribute("height", "225");
        imgEl.setAttribute("loading", "lazy");
        itemDiv.appendChild(imgEl);
        track.appendChild(itemDiv);
      }
      return track;
    };

    element.querySelectorAll(":scope > .logo-marquee__track").forEach((node) => node.remove());
    const firstNonTrack = element.firstChild;
    element.insertBefore(buildTrack(false), firstNonTrack);
    element.insertBefore(buildTrack(true), firstNonTrack);

    const refreshLogos = (element as unknown as { __ecRefreshClientLogos?: () => void })
      .__ecRefreshClientLogos;
    if (typeof refreshLogos === "function") {
      refreshLogos();
    }
  });

  document.querySelectorAll<HTMLElement>("[data-ec-solutions-key]").forEach((element) => {
    const key = element.getAttribute("data-ec-solutions-key");
    if (!key) return;
    const field = fieldsByKey.get(key);
    if (field?.kind !== "homeSolutions") return;
    const nextJson = JSON.stringify(field.value);
    if (element.getAttribute("data-cms-solutions-cards") !== nextJson) {
      element.setAttribute("data-cms-solutions-cards", nextJson);
      const updater = (
        element as unknown as { __ecUpdateSolutionCards?: (items: HomeSolutionCardItem[]) => void }
      ).__ecUpdateSolutionCards;
      if (typeof updater === "function") {
        updater(field.value);
      }
    }
  });

  document.querySelectorAll<HTMLElement>("[data-ec-directors-key]").forEach((element) => {
    const key = element.getAttribute("data-ec-directors-key");
    if (!key) return;
    const field = fieldsByKey.get(key);
    if (field?.kind !== "directorCards") return;

    const nextSig = JSON.stringify(field.value);
    const currentSig = element.getAttribute("data-ec-directors-sig");
    const origSig = JSON.stringify(field.originalValue);
    if (!currentSig && nextSig === origSig) {
      element.setAttribute("data-ec-directors-sig", nextSig);
      return;
    }
    if (currentSig === nextSig) return;

    element.setAttribute("data-ec-directors-sig", nextSig);
    element.setAttribute("data-card-count", String(field.value.length));
    if (field.value.length > 2) {
      element.setAttribute("data-card-count-multi", "true");
    } else {
      element.removeAttribute("data-card-count-multi");
    }

    const portal = element.querySelector(":scope > .ec-ie-directors-portal");
    element.querySelectorAll(":scope > .dep-video-card").forEach((node) => node.remove());

    for (const card of field.value) {
      const cardEl = document.createElement("div");
      cardEl.className = card.mediaType === "image" ? "dep-video-card dep-image-card" : "dep-video-card";

      const innerEl = document.createElement("div");
      innerEl.className = "dep-video-inner";

      if (card.mediaType === "video") {
        const videoEl = document.createElement("video");
        videoEl.setAttribute("src", card.src);
        if (card.poster) videoEl.setAttribute("poster", card.poster);
        videoEl.setAttribute("preload", "metadata");
        videoEl.className = "dep-video";
        videoEl.style.objectFit = "cover";
        videoEl.style.width = "100%";
        videoEl.style.height = "100%";
        videoEl.setAttribute("playsinline", "");
        innerEl.appendChild(videoEl);

        const playBtn = document.createElement("button");
        playBtn.className = "dep-play-btn";
        playBtn.setAttribute("aria-label", `Reproduzir depoimento de ${card.name}`);
        playBtn.innerHTML =
          '<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="30" r="28" stroke="#00D5FF" stroke-width="3" fill="rgba(6,11,30,0.6)"/><polygon points="24,18 44,30 24,42" fill="#FFFFFF"/></svg>';
        innerEl.appendChild(playBtn);
      } else {
        const imgEl = document.createElement("img");
        imgEl.className = "dep-card-image";
        imgEl.setAttribute("src", card.src);
        imgEl.setAttribute("alt", card.role ? `${card.name} — ${card.role}` : card.name);
        imgEl.setAttribute("loading", "lazy");
        innerEl.appendChild(imgEl);
      }

      const tagEl = document.createElement("div");
      tagEl.className = "dep-card-tag";
      const stackEl = document.createElement("div");
      stackEl.className = "dep-tag-left-stack";
      const lineSpan = document.createElement("span");
      lineSpan.className = "dep-tag-line-red";
      const nameP = document.createElement("p");
      nameP.className = "dep-tag-name";
      nameP.textContent = card.name;
      const roleP = document.createElement("p");
      roleP.className = "dep-tag-role";
      roleP.textContent = card.role;
      stackEl.append(lineSpan, nameP, roleP);
      tagEl.appendChild(stackEl);
      if (card.mediaType === "video" && card.duration) {
        const durSpan = document.createElement("span");
        durSpan.className = "dep-tag-duration";
        durSpan.textContent = card.duration;
        tagEl.appendChild(durSpan);
      }
      innerEl.appendChild(tagEl);

      if (card.mediaType === "video") {
        const controlsWrap = document.createElement("div");
        controlsWrap.className = "dep-custom-controls";
        controlsWrap.innerHTML = `
          <div class="dep-controls-timeline-wrapper">
            <div class="dep-controls-timeline-bar">
              <div class="dep-controls-timeline-progress"></div>
            </div>
          </div>
          <div class="dep-controls-buttons-row">
            <div class="dep-controls-left-buttons">
              <button class="dep-ctrl-btn dep-play-pause-btn" aria-label="Reproduzir/Pausar">
                <svg class="icon-play" viewBox="0 0 24 24" width="16" height="16"><polygon points="5 3 19 12 5 21 5 3" fill="var(--brand-primary)"/></svg>
                <svg class="icon-pause" viewBox="0 0 24 24" width="16" height="16" style="display:none;"><rect x="6" y="4" width="4" height="16" fill="var(--brand-primary)"/><rect x="14" y="4" width="4" height="16" fill="var(--brand-primary)"/></svg>
              </button>
              <button class="dep-ctrl-btn dep-rewind-btn" aria-label="Voltar 10 segundos">
                <svg viewBox="0 0 24 24" width="14" height="14"><path d="M12 5V1L7 6l5 5V7c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6H4c0 4.4 3.6 8 8 8s8-3.6 8-8-3.6-8-8-8zm-1 5.5h-1v5h1v-5zm3 0h-2v5h2v-5z" fill="var(--brand-primary)"/></svg>
              </button>
              <button class="dep-ctrl-btn dep-forward-btn" aria-label="Avançar 10 segundos">
                <svg viewBox="0 0 24 24" width="14" height="14"><path d="M12 5V1l5 5-5 5V7c-3.3 0-6 2.7-6 6s-2.7 6 6 6 6-2.7 6-6h2c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8zm-1 5.5h-1v5h1v-5zm3 0h-2v5h2v-5z" fill="var(--brand-primary)"/></svg>
              </button>
              <span class="dep-ctrl-time">00:00 / 00:00</span>
            </div>
            <div class="dep-controls-right-buttons">
              <div class="dep-volume-control-wrapper">
                <button class="dep-ctrl-btn dep-volume-btn" aria-label="Volume">
                  <svg class="icon-volume-on" viewBox="0 0 24 24" width="16" height="16"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" fill="var(--brand-primary)"/></svg>
                  <svg class="icon-volume-off" viewBox="0 0 24 24" width="16" height="16" style="display:none;"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.21.05-.42.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71z" fill="var(--brand-primary)"/></svg>
                </button>
                <input type="range" class="dep-volume-slider" min="0" max="1" step="0.05" value="1" aria-label="Ajustar Volume" />
              </div>
              <button class="dep-ctrl-btn dep-fullscreen-btn" aria-label="Tela Cheia">
                <svg viewBox="0 0 24 24" width="16" height="16"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" fill="var(--brand-primary)"/></svg>
              </button>
            </div>
          </div>`;
        innerEl.appendChild(controlsWrap);
      }

      cardEl.appendChild(innerEl);
      if (portal) {
        element.insertBefore(cardEl, portal);
      } else {
        element.appendChild(cardEl);
      }
    }

    const refreshDirectors = (
      element as unknown as { __ecRefreshDirectorCards?: () => void }
    ).__ecRefreshDirectorCards;
    if (typeof refreshDirectors === "function") {
      refreshDirectors();
    }
  });

  document.querySelectorAll<HTMLElement>("[data-ec-cardlist-key]").forEach((container) => {
    const key = container.getAttribute("data-ec-cardlist-key");
    if (!key) return;
    const field = fieldsByKey.get(key);
    if (field?.kind !== "cardList") return;
    if (container.querySelector('[data-ec-inline-active="true"]')) return;

    const nextSig = JSON.stringify(field.value);
    const currentSig = container.getAttribute("data-ec-cardlist-sig");
    if (currentSig === nextSig) return;
    if (!currentSig && liveDomMatchesCardList(container, field)) {
      container.setAttribute("data-ec-cardlist-sig", nextSig);
      return;
    }

    const protoEntry = cardPrototypes?.[key];
    const fallbackProtos = Array.from(container.children)
      .filter((el): el is HTMLElement => el.matches(field.itemSelector))
      .map((el) => el.outerHTML);
    const protoItems = protoEntry?.items?.length ? protoEntry.items : fallbackProtos;
    if (protoItems.length === 0) return;

    let connectorHtml = protoEntry?.connector;
    if (!connectorHtml && field.connectorSelector) {
      const existingConn = Array.from(container.children).find((el) =>
        el.matches(field.connectorSelector!),
      );
      if (existingConn) connectorHtml = existingConn.outerHTML;
    }

    const children = Array.from(container.children);
    let firstItemIdx = children.length;
    const leadingPreserved: Element[] = [];
    const trailingPreserved: Element[] = [];

    children.forEach((child, idx) => {
      const isItem = child.matches(field.itemSelector);
      const isConn = field.connectorSelector ? child.matches(field.connectorSelector) : false;
      if (isItem || isConn) {
        if (idx < firstItemIdx) firstItemIdx = idx;
      } else if (idx < firstItemIdx) {
        leadingPreserved.push(child);
      } else {
        trailingPreserved.push(child);
      }
    });

    const frag = document.createDocumentFragment();
    for (const node of leadingPreserved) frag.appendChild(node);

    field.value.forEach((item, index) => {
      const protoHtml = protoItems[item.sourceIndex] ?? protoItems[0];
      const cardEl = htmlToElement(protoHtml);
      if (!cardEl) return;

      cardEl.setAttribute("data-ec-cardlist-owner", field.key);
      cardEl.setAttribute("data-ec-cardlist-index", String(index));
      cardEl.setAttribute("data-ec-cardlist-item-id", item.id);
      if (cardEl.hasAttribute("data-index")) {
        cardEl.setAttribute("data-index", String(index));
      }

      const slots = collectLiveCardTextSlots(cardEl);
      const slotsByParent = new Map<HTMLElement, Array<{ slot: number; idx: number }>>();
      slots.forEach((slot, sIdx) => {
        const nextText = item.texts[sIdx];
        if (typeof nextText === "string") {
          slot.textNode.data = nextText;
        }
        const list = slotsByParent.get(slot.parentElement) ?? [];
        list.push({ slot: slot.slotIndex, idx: slot.textNodeIndex });
        slotsByParent.set(slot.parentElement, list);
      });
      for (const [parentEl, entries] of slotsByParent.entries()) {
        parentEl.setAttribute("data-ec-card-slot-fields", JSON.stringify(entries));
      }

      const imgEl = findVisibleLiveCardImage(cardEl);
      if (imgEl && item.image) {
        imgEl.setAttribute("src", item.image.src);
        imgEl.setAttribute("alt", item.image.alt);
        if (item.image.objectPosition) {
          imgEl.style.objectPosition = item.image.objectPosition;
        } else {
          imgEl.style.removeProperty("object-position");
        }
        imgEl.setAttribute("data-ec-card-image-owner", field.key);
        imgEl.setAttribute("data-ec-card-image-index", String(index));
        if (field.editorPhotoLocked) {
          imgEl.setAttribute("data-ec-editor-photo-locked", "true");
        }
      }

      frag.appendChild(cardEl);
      if (connectorHtml && index < field.value.length - 1) {
        const connEl = htmlToElement(connectorHtml);
        if (connEl) frag.appendChild(connEl);
      }
    });

    for (const node of trailingPreserved) frag.appendChild(node);

    container.textContent = "";
    container.appendChild(frag);
    container.setAttribute("data-ec-cardlist-sig", nextSig);
    container.setAttribute("data-cms-cardlist-custom", "true");

    if (container.querySelector("[data-lucide]")) {
      const lucideGlobal = (window as unknown as { lucide?: { createIcons?: () => void } }).lucide;
      lucideGlobal?.createIcons?.();
    }
  });
}

export function applyNavigationContentToLiveDom(nav: InlineNavigationContent) {
  if (typeof document === "undefined") return;

  const headerNav = document.querySelector<HTMLElement>("header.site-header nav.main-menu");
  if (headerNav) {
    const primaryNodes: Record<string, HTMLElement | null> = {
      home:
        headerNav.querySelector<HTMLElement>('[data-ec-nav-primary-id="home"], [data-cms-nav-item="home"]') ??
        headerNav.querySelector<HTMLElement>(":scope > a:not(.btn-contacts-menu):not(#menu-link-sobre)"),
      about:
        headerNav.querySelector<HTMLElement>('[data-ec-nav-primary-id="about"], [data-cms-nav-item="about"], #menu-link-sobre'),
      solutions:
        headerNav.querySelector<HTMLElement>('[data-ec-nav-primary-id="solutions"], [data-cms-nav-item="solutions"], .dropdown'),
      contact:
        headerNav.querySelector<HTMLElement>('[data-ec-nav-primary-id="contact"], [data-cms-nav-item="contact"], .btn-contacts-menu'),
    };

    const orderedEls: HTMLElement[] = [];
    for (const item of nav.primary) {
      const node = primaryNodes[item.id];
      if (!node) continue;
      node.setAttribute("data-ec-nav-primary-id", item.id);
      orderedEls.push(node);

      if (item.id === "solutions") {
        const trigger = node.querySelector<HTMLElement>(".drop-link");
        if (trigger && trigger.dataset.ecInlineActive !== "true") {
          const textNode = Array.from(trigger.childNodes).find(
            (n): n is Text => n.nodeType === Node.TEXT_NODE && Boolean((n as Text).data.trim()),
          );
          if (textNode) {
            if (textNode.data !== item.label) textNode.data = item.label;
          } else {
            const firstSvg = trigger.querySelector("svg");
            if (firstSvg) {
              trigger.insertBefore(document.createTextNode(item.label), firstSvg);
            } else {
              trigger.textContent = item.label;
            }
          }
        }
      } else {
        if (node.dataset.ecInlineActive !== "true" && node.textContent !== item.label) {
          node.textContent = item.label;
        }
        if (item.href !== null && node.getAttribute("href") !== item.href) {
          node.setAttribute("href", item.href);
        }
      }
    }

    const currentPrimaryOrder = Array.from(headerNav.children).filter((el) =>
      orderedEls.includes(el as HTMLElement),
    );
    const needsReorder =
      currentPrimaryOrder.length === orderedEls.length &&
      orderedEls.some((el, idx) => currentPrimaryOrder[idx] !== el);
    if (needsReorder) {
      for (const el of orderedEls) headerNav.appendChild(el);
    }
  }

  const groupsWrapper = document.querySelector<HTMLElement>("#solutions-menu .solutions-menu-groups");
  if (groupsWrapper) {
    const groupEls = Array.from(groupsWrapper.querySelectorAll<HTMLElement>(":scope > .menu-group"));
    const groupById = new Map<string, HTMLElement>();

    for (const gEl of groupEls) {
      const taggedId = gEl.getAttribute("data-ec-nav-group-id");
      if (taggedId) {
        groupById.set(taggedId, gEl);
        continue;
      }
      const firstSvcId = gEl
        .querySelector<HTMLElement>(".menu-service-item[data-service-id]")
        ?.getAttribute("data-service-id");
      const matched = nav.groups.find((g) => g.services.some((s) => s.id === firstSvcId));
      if (matched) {
        gEl.setAttribute("data-ec-nav-group-id", matched.id);
        groupById.set(matched.id, gEl);
      }
    }

    const orderedGroupEls: HTMLElement[] = [];
    for (const group of nav.groups) {
      const gEl = groupById.get(group.id);
      if (!gEl) continue;
      orderedGroupEls.push(gEl);

      const titleSpan = gEl.querySelector<HTMLElement>(".menu-group-title > span");
      if (titleSpan && titleSpan.dataset.ecInlineActive !== "true" && titleSpan.textContent !== group.title) {
        titleSpan.textContent = group.title;
      }
      const descEl = gEl.querySelector<HTMLElement>(".menu-group-description");
      if (descEl && descEl.dataset.ecInlineActive !== "true" && descEl.textContent !== group.description) {
        descEl.textContent = group.description;
      }

      const itemsContainer = gEl.querySelector<HTMLElement>(".menu-group-items");
      if (itemsContainer) {
        const svcNodes = Array.from(
          itemsContainer.querySelectorAll<HTMLElement>(".menu-service-item[data-service-id]"),
        );
        const bySvcId = new Map(svcNodes.map((n) => [n.getAttribute("data-service-id") ?? "", n]));
        const orderedSvcs: HTMLElement[] = [];
        for (const svc of group.services) {
          const svcEl = bySvcId.get(svc.id);
          if (!svcEl) continue;
          orderedSvcs.push(svcEl);
          if (svcEl.getAttribute("href") !== svc.href) {
            svcEl.setAttribute("href", svc.href);
          }
          const labelEl =
            svcEl.querySelector<HTMLElement>(".dropdown-item-text") ??
            svcEl.querySelector<HTMLElement>("span:not(.submenuzinho-bullet):not(.dropdown-item-logo)");
          if (labelEl && labelEl.dataset.ecInlineActive !== "true" && labelEl.textContent !== svc.label) {
            labelEl.textContent = svc.label;
          }
        }
        const curSvcs = Array.from(itemsContainer.children);
        if (
          orderedSvcs.length === curSvcs.length &&
          orderedSvcs.some((el, idx) => curSvcs[idx] !== el)
        ) {
          for (const el of orderedSvcs) itemsContainer.appendChild(el);
        }
      }
    }

    const curGroups = Array.from(groupsWrapper.children);
    if (
      orderedGroupEls.length === curGroups.length &&
      orderedGroupEls.some((el, idx) => curGroups[idx] !== el)
    ) {
      for (const el of orderedGroupEls) groupsWrapper.appendChild(el);
    }
  }
}

export function applyGlobalContentToLiveDom(values: Record<string, string>) {
  if (typeof document === "undefined") return;

  document.querySelectorAll<HTMLElement>("[data-ec-global-text]").forEach((element) => {
    if (element.dataset.ecInlineActive === "true") return;
    const key = element.getAttribute("data-ec-global-text");
    if (!key) return;
    const val = values[key];
    if (typeof val === "string" && element.textContent !== val) {
      element.textContent = val;
    }
  });

  if (typeof values.email === "string" && values.email.trim()) {
    document
      .querySelectorAll<HTMLAnchorElement>('footer a.footer-email-row, footer a[href^="mailto:"]')
      .forEach((anchor) => {
        const expected = `mailto:${values.email.trim()}`;
        if (anchor.getAttribute("href") !== expected) {
          anchor.setAttribute("href", expected);
        }
      });
  }

  if (typeof values.whatsapp === "string" && /^\d{10,15}$/.test(values.whatsapp.trim())) {
    document
      .querySelectorAll<HTMLAnchorElement>('footer a[data-ec-global-link="whatsapp"]')
      .forEach((anchor) => {
        try {
          const currentHref = anchor.getAttribute("href") || "https://api.whatsapp.com/send";
          const url = new URL(currentHref, window.location.origin);
          url.searchParams.set("phone", values.whatsapp.trim());
          anchor.setAttribute("href", url.toString());
        } catch {
          anchor.setAttribute("href", `https://api.whatsapp.com/send?phone=${values.whatsapp.trim()}`);
        }
      });
  }

  if (typeof values.instagram === "string" && /^https:\/\//i.test(values.instagram.trim())) {
    document
      .querySelectorAll<HTMLAnchorElement>('footer a[data-ec-global-link="instagram"]')
      .forEach((anchor) => {
        if (anchor.getAttribute("href") !== values.instagram.trim()) {
          anchor.setAttribute("href", values.instagram.trim());
        }
      });
  }

  if (typeof values.linkedin === "string" && /^https:\/\//i.test(values.linkedin.trim())) {
    document
      .querySelectorAll<HTMLAnchorElement>('footer a[data-ec-global-link="linkedin"]')
      .forEach((anchor) => {
        if (anchor.getAttribute("href") !== values.linkedin.trim()) {
          anchor.setAttribute("href", values.linkedin.trim());
        }
      });
  }
}
