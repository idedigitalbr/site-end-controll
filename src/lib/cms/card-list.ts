import { load } from "cheerio";
import {
  isValidObjectPosition,
  type CardListItem,
  type EditableCardListField,
} from "@/lib/cms/inline-editor-types";

type DomNode = {
  type: string;
  name?: string;
  data?: string;
  attribs?: Record<string, string>;
  parent?: DomNode | null;
  children?: DomNode[];
};

export type CardListDefinition = {
  containerSelector: string;
  itemSelector: string;
  connectorSelector?: string;
  label: string;
  minItems: number;
  maxItems: number;
  editorPhotoLocked?: boolean;
};

export const CARD_LIST_DEFINITIONS: readonly CardListDefinition[] = [
  {
    containerSelector: ".ffs-mechanisms-grid",
    itemSelector: "article.ffs-mechanism-card",
    label: "Mecanismos FFS",
    minItems: 1,
    maxItems: 24,
  },
  {
    containerSelector: ".bento-expanding-wrapper .bento-row",
    itemSelector: "article.ec-card-white",
    label: "Cards de Escopo Técnico",
    minItems: 1,
    maxItems: 12,
  },
  {
    containerSelector: ".sidebar-pillars-list",
    itemSelector: ".sidebar-pillar-item",
    label: "Pilares Técnicos",
    minItems: 1,
    maxItems: 10,
  },
  {
    containerSelector: ".svc-methodology-flow",
    itemSelector: ".svc-method-card",
    connectorSelector: ".svc-method-arrow-connector",
    label: "Etapas da Metodologia",
    minItems: 1,
    maxItems: 8,
  },
  {
    containerSelector: ".sn-process-track-zone",
    itemSelector: ".sn-step-unit",
    connectorSelector: ".sn-step-arrow, .sn-step-line-connector",
    label: "Etapas do Processo",
    minItems: 1,
    maxItems: 8,
  },
  {
    containerSelector: ".faq-v2-grid",
    itemSelector: ".faq-v2-item",
    label: "Perguntas Frequentes (FAQ)",
    minItems: 1,
    maxItems: 24,
  },
  {
    containerSelector: ".sn-essence-grid",
    itemSelector: ".sn-essence-card",
    label: "Essência (Missão, Visão e Valores)",
    minItems: 1,
    maxItems: 8,
  },
  {
    containerSelector: ".about-values-banner",
    itemSelector: ".about-value-item",
    label: "Valores e Diferenciais",
    minItems: 1,
    maxItems: 10,
  },
  {
    containerSelector: ".presenca-stats-container",
    itemSelector: ".stat-mini-card",
    label: "Indicadores de Presença",
    minItems: 1,
    maxItems: 8,
  },
  {
    containerSelector: ".sn-indicators-card",
    itemSelector: ".sn-indicator-item",
    label: "Indicadores da Solução",
    minItems: 1,
    maxItems: 10,
  },
  {
    containerSelector: ".legal-content-container",
    itemSelector: ".legal-block",
    label: "Blocos de Privacidade",
    minItems: 1,
    maxItems: 24,
  },
  {
    containerSelector: "ul.endo-acc-row",
    itemSelector: "li.endo-acc-panel",
    label: "Cards de Segmentos / Aplicações",
    minItems: 1,
    maxItems: 16,
    editorPhotoLocked: true,
  },
];

const IGNORED_CARD_TAGS = new Set(["script", "style", "noscript", "svg", "template"]);

function asDomNode(value: unknown): DomNode | null {
  return value && typeof value === "object" ? (value as DomNode) : null;
}

function isIgnoredCardSubtree(node: DomNode): boolean {
  if (node.type !== "tag") return false;
  if (node.name && IGNORED_CARD_TAGS.has(node.name)) return true;
  if (node.attribs?.hidden !== undefined) return true;
  if (node.attribs?.["aria-hidden"] === "true") return true;
  return false;
}

export type CardTextSlotRef = {
  textNode: DomNode;
  parentElement: DomNode;
  textNodeIndex: number;
  slotIndex: number;
  text: string;
};

export function collectCardTextNodes(cardNode: DomNode): CardTextSlotRef[] {
  const slots: CardTextSlotRef[] = [];

  function walk(node: DomNode) {
    if (isIgnoredCardSubtree(node)) return;
    let textNodeIndex = 0;
    for (const child of node.children ?? []) {
      if (child.type === "text") {
        const raw = child.data ?? "";
        const normalized = raw.replace(/\s+/g, " ").trim();
        if (normalized.length > 0) {
          slots.push({
            textNode: child,
            parentElement: node,
            textNodeIndex,
            slotIndex: slots.length,
            text: normalized,
          });
        }
        textNodeIndex += 1;
      } else if (child.type === "tag") {
        walk(child);
      }
    }
  }

  walk(cardNode);
  return slots;
}

function extractInlineObjectPosition(styleAttr: string | undefined): string | undefined {
  if (!styleAttr) return undefined;
  const match = /(?:^|;)\s*object-position\s*:\s*([^;]+)/i.exec(styleAttr);
  if (!match) return undefined;
  const val = match[1].trim();
  return isValidObjectPosition(val) ? val : undefined;
}

function findFirstVisibleCardImage($: ReturnType<typeof load>, cardEl: DomNode) {
  const imgs = $(cardEl as Parameters<typeof $>[0]).find("img").toArray();
  for (const img of imgs) {
    const node = asDomNode(img);
    if (!node) continue;
    let hidden = false;
    let cur: DomNode | null | undefined = node;
    while (cur && cur !== cardEl) {
      if (isIgnoredCardSubtree(cur)) {
        hidden = true;
        break;
      }
      cur = cur.parent;
    }
    if (hidden) continue;
    const $img = $(img);
    const src = $img.attr("src")?.trim() ?? "";
    if (!src) continue;
    const alt = $img.attr("alt") ?? "";
    const objectPosition = extractInlineObjectPosition($img.attr("style"));
    return {
      $img,
      image: {
        src,
        alt,
        ...(objectPosition !== undefined ? { objectPosition } : {}),
      },
    };
  }
  return null;
}

export function cloneCardListItems(items: CardListItem[]): CardListItem[] {
  return items.map((item) => ({
    id: item.id,
    sourceIndex: item.sourceIndex,
    texts: [...item.texts],
    ...(item.image ? { image: { ...item.image } } : {}),
  }));
}

export function sameCardListItems(a: CardListItem[], b: CardListItem[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((item, idx) => {
    const other = b[idx];
    if (!other) return false;
    if (item.id !== other.id || item.sourceIndex !== other.sourceIndex) return false;
    if (item.texts.length !== other.texts.length) return false;
    if (item.texts.some((t, tIdx) => t !== other.texts[tIdx])) return false;
    const imgA = item.image;
    const imgB = other.image;
    if (!imgA && !imgB) return true;
    if (!imgA || !imgB) return false;
    return (
      imgA.src === imgB.src &&
      imgA.alt === imgB.alt &&
      (imgA.objectPosition ?? "") === (imgB.objectPosition ?? "")
    );
  });
}

export type CardPrototypeMap = Record<string, { items: string[]; connector?: string }>;

export function extractCardListFields(
  $: ReturnType<typeof load>,
  getSelector: (node: DomNode) => string,
): { fields: EditableCardListField[]; prototypes: CardPrototypeMap } {
  const fields: EditableCardListField[] = [];
  const prototypes: CardPrototypeMap = {};
  const seenKeys = new Set<string>();

  for (const def of CARD_LIST_DEFINITIONS) {
    const containers = $(def.containerSelector).toArray();
    containers.forEach((containerEl, containerIdx) => {
      const containerNode = asDomNode(containerEl);
      if (!containerNode) return;
      const selector = getSelector(containerNode);
      if (!selector) return;

      const key = `cardList:${selector}`;
      if (seenKeys.has(key)) return;

      const itemEls = $(containerEl).children(def.itemSelector).toArray();
      if (itemEls.length < 1) return;

      const items: CardListItem[] = [];
      const itemHtmls: string[] = [];

      itemEls.forEach((itemEl, itemIdx) => {
        const itemNode = asDomNode(itemEl);
        if (!itemNode) return;
        const slots = collectCardTextNodes(itemNode);
        const imgFound = findFirstVisibleCardImage($, itemNode);
        if (slots.length === 0 && !imgFound) return;

        const cleanCardHtml = $.html(itemEl) ?? "";
        itemHtmls.push(cleanCardHtml);
        items.push({
          id: `orig-${itemIdx}`,
          sourceIndex: itemIdx,
          texts: slots.map((s) => s.text),
          ...(imgFound ? { image: imgFound.image } : {}),
        });
      });

      if (items.length === 0 || itemHtmls.length !== itemEls.length) return;

      let connectorHtml: string | undefined;
      if (def.connectorSelector) {
        const firstConnector = $(containerEl).children(def.connectorSelector).first();
        if (firstConnector.length === 1) {
          connectorHtml = $.html(firstConnector) ?? undefined;
        }
      }

      seenKeys.add(key);
      const label =
        containers.length > 1 ? `${def.label} (Linha ${containerIdx + 1})` : def.label;
      const field: EditableCardListField = {
        key,
        kind: "cardList",
        selector,
        itemSelector: def.itemSelector,
        ...(def.connectorSelector ? { connectorSelector: def.connectorSelector } : {}),
        label,
        minItems: def.minItems,
        maxItems: def.maxItems,
        originalCount: items.length,
        ...(def.editorPhotoLocked ? { editorPhotoLocked: true } : {}),
        value: cloneCardListItems(items),
        originalValue: cloneCardListItems(items),
      };

      fields.push(field);
      prototypes[key] = {
        items: itemHtmls,
        ...(connectorHtml ? { connector: connectorHtml } : {}),
      };
    });
  }

  return { fields, prototypes };
}

export function normalizeCardListItems(
  rawValue: unknown,
  field: EditableCardListField,
  allowedMediaUrlRe: RegExp,
): CardListItem[] {
  if (
    !Array.isArray(rawValue) ||
    rawValue.length < field.minItems ||
    rawValue.length > field.maxItems
  ) {
    throw new Error(
      `A lista "${field.label}" precisa ter entre ${field.minItems} e ${field.maxItems} cards.`,
    );
  }

  const allowedOriginalSrcs = new Set(
    field.originalValue.flatMap((orig) => (orig.image?.src ? [orig.image.src] : [])),
  );
  const seenIds = new Set<string>();

  return rawValue.map((entry, idx) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      throw new Error(`O card ${idx + 1} de "${field.label}" é inválido.`);
    }
    const raw = entry as Record<string, unknown>;
    const rawId = typeof raw.id === "string" ? raw.id.trim() : "";
    if (
      !rawId ||
      rawId.length > 64 ||
      !/^[a-zA-Z0-9_-]+$/.test(rawId) ||
      seenIds.has(rawId)
    ) {
      throw new Error(`O identificador do card ${idx + 1} de "${field.label}" é inválido.`);
    }
    seenIds.add(rawId);

    const sourceIndex = raw.sourceIndex;
    if (
      typeof sourceIndex !== "number" ||
      !Number.isInteger(sourceIndex) ||
      sourceIndex < 0 ||
      sourceIndex >= field.originalCount
    ) {
      throw new Error(`A referência de modelo do card ${idx + 1} de "${field.label}" é inválida.`);
    }

    const prototype = field.originalValue[sourceIndex];
    if (!prototype) {
      throw new Error(`O modelo do card ${idx + 1} de "${field.label}" não existe.`);
    }

    if (!Array.isArray(raw.texts) || raw.texts.length !== prototype.texts.length) {
      throw new Error(
        `Os campos de texto do card ${idx + 1} de "${field.label}" não correspondem ao template.`,
      );
    }

    const texts = raw.texts.map((t, tIdx) => {
      if (typeof t !== "string") {
        throw new Error(`O texto ${tIdx + 1} do card ${idx + 1} é inválido.`);
      }
      const cleaned = t.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim();
      if (!cleaned || cleaned.length > 4_000) {
        throw new Error(
          `O texto ${tIdx + 1} do card ${idx + 1} de "${field.label}" deve ter entre 1 e 4000 caracteres.`,
        );
      }
      return cleaned;
    });

    let image: CardListItem["image"];
    if (prototype.image) {
      if (!raw.image || typeof raw.image !== "object" || Array.isArray(raw.image)) {
        throw new Error(`A imagem do card ${idx + 1} de "${field.label}" está ausente.`);
      }
      const rawImg = raw.image as Record<string, unknown>;
      const src = typeof rawImg.src === "string" ? rawImg.src.trim() : "";
      if (
        !src ||
        src.length > 2_048 ||
        (!allowedOriginalSrcs.has(src) && !allowedMediaUrlRe.test(src))
      ) {
        throw new Error(
          `A imagem do card ${idx + 1} de "${field.label}" não pertence à biblioteca de mídia ou aos arquivos originais.`,
        );
      }
      const alt =
        typeof rawImg.alt === "string"
          ? rawImg.alt.replace(/[\u0000-\u001f\u007f]/g, "").slice(0, 255)
          : prototype.image.alt;

      let objectPosition: string | undefined;
      if (rawImg.objectPosition !== undefined) {
        if (
          typeof rawImg.objectPosition !== "string" ||
          !isValidObjectPosition(rawImg.objectPosition.trim())
        ) {
          throw new Error(`O enquadramento da imagem do card ${idx + 1} é inválido.`);
        }
        const trimmedPos = rawImg.objectPosition.trim();
        if (trimmedPos) objectPosition = trimmedPos;
      }

      image = {
        src,
        alt,
        ...(objectPosition ? { objectPosition } : {}),
      };
    }

    return {
      id: rawId,
      sourceIndex,
      texts,
      ...(image ? { image } : {}),
    };
  });
}

function applyItemDataToCheerioCard(
  $: ReturnType<typeof load>,
  cardEl: ReturnType<ReturnType<typeof load>>,
  item: CardListItem,
  index: number,
) {
  const cardNode = asDomNode(cardEl.get(0));
  if (!cardNode) return;

  if (cardEl.attr("data-index") !== undefined) {
    cardEl.attr("data-index", String(index));
  }

  const slots = collectCardTextNodes(cardNode);
  slots.forEach((slot, sIdx) => {
    const nextText = item.texts[sIdx];
    if (typeof nextText === "string") {
      slot.textNode.data = nextText;
    }
  });

  if (item.image) {
    const found = findFirstVisibleCardImage($, cardNode);
    if (found) {
      found.$img.attr("src", item.image.src);
      found.$img.attr("alt", item.image.alt);
      if (item.image.objectPosition) {
        found.$img.css("object-position", item.image.objectPosition);
      } else {
        found.$img.css("object-position", "");
      }
    }
  }
}

export function applyCardListPatchToCheerio(
  $: ReturnType<typeof load>,
  field: EditableCardListField,
  patchValue: CardListItem[],
) {
  if (sameCardListItems(patchValue, field.originalValue)) return;

  const container = $(field.selector).first();
  if (container.length !== 1) {
    throw new Error(`O container "${field.label}" não existe mais no template.`);
  }

  const originalItemEls = container.children(field.itemSelector).toArray();
  if (originalItemEls.length === 0) {
    throw new Error(`Os cards de "${field.label}" não existem mais no template.`);
  }

  const prototypeHtmls = originalItemEls.map((el) => $.html(el) ?? "");
  let connectorHtml: string | null = null;
  if (field.connectorSelector) {
    const conn = container.children(field.connectorSelector).first();
    if (conn.length === 1) {
      connectorHtml = $.html(conn) ?? null;
    }
  }

  // Preserve non-item, non-connector siblings (e.g., .legal-back-row in politica-de-privacidade.html)
  const children = container.children().toArray();
  let firstItemDomIndex = children.length;
  const trailingPreserved: ReturnType<ReturnType<typeof load>>[] = [];
  const leadingPreserved: ReturnType<ReturnType<typeof load>>[] = [];

  children.forEach((child, idx) => {
    const $child = $(child);
    const isItem = $child.is(field.itemSelector);
    const isConnector = field.connectorSelector ? $child.is(field.connectorSelector) : false;
    if (isItem || isConnector) {
      if (idx < firstItemDomIndex) firstItemDomIndex = idx;
    } else {
      if (idx < firstItemDomIndex) leadingPreserved.push($child);
      else trailingPreserved.push($child);
    }
  });

  container.empty();
  for (const node of leadingPreserved) {
    container.append(node);
  }

  patchValue.forEach((item, idx) => {
    const protoHtml = prototypeHtmls[item.sourceIndex] ?? prototypeHtmls[0];
    const clonedCard = $(protoHtml);
    applyItemDataToCheerioCard($, clonedCard, item, idx);
    container.append(clonedCard);
    if (connectorHtml && idx < patchValue.length - 1) {
      container.append($(connectorHtml));
    }
  });

  for (const node of trailingPreserved) {
    container.append(node);
  }

  container.attr("data-cms-cardlist-custom", "true");
}

export function annotateCardListDom(
  $: ReturnType<typeof load>,
  field: EditableCardListField,
  items: CardListItem[],
) {
  const container = $(field.selector).first();
  if (container.length !== 1) return;

  container.attr("data-ec-cardlist-key", field.key);

  const cardEls = container.children(field.itemSelector).toArray();
  cardEls.forEach((cardEl, index) => {
    const $card = $(cardEl);
    const cardNode = asDomNode(cardEl);
    if (!cardNode) return;

    $card.attr("data-ec-cardlist-owner", field.key);
    $card.attr("data-ec-cardlist-index", String(index));
    $card.attr("data-ec-cardlist-item-id", items[index]?.id ?? `orig-${index}`);

    const slots = collectCardTextNodes(cardNode);
    const slotsByParent = new Map<DomNode, Array<{ slot: number; idx: number }>>();
    for (const s of slots) {
      const list = slotsByParent.get(s.parentElement) ?? [];
      list.push({ slot: s.slotIndex, idx: s.textNodeIndex });
      slotsByParent.set(s.parentElement, list);
    }

    for (const [parentNode, entries] of slotsByParent.entries()) {
      $(parentNode as Parameters<typeof $>[0]).attr("data-ec-card-slot-fields", JSON.stringify(entries));
    }

    const foundImg = findFirstVisibleCardImage($, cardNode);
    if (foundImg) {
      foundImg.$img.attr("data-ec-card-image-owner", field.key);
      foundImg.$img.attr("data-ec-card-image-index", String(index));
      if (field.editorPhotoLocked) {
        foundImg.$img.attr("data-ec-editor-photo-locked", "true");
      }
    }
  });
}

export function hasCustomFfsCardListPatch(
  rawPatches: unknown,
  ffsField?: EditableCardListField,
): boolean {
  if (!Array.isArray(rawPatches) || !ffsField) return false;
  const patch = rawPatches.find(
    (entry) =>
      entry &&
      typeof entry === "object" &&
      (entry as Record<string, unknown>).kind === "cardList" &&
      (entry as Record<string, unknown>).key === ffsField.key,
  ) as { value?: unknown } | undefined;
  if (!patch || !Array.isArray(patch.value)) return false;
  try {
    return !sameCardListItems(patch.value as CardListItem[], ffsField.originalValue);
  } catch {
    return false;
  }
}
