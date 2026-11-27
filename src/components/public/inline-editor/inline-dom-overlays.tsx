"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Bold,
  Check,
  ImageUp,
  Italic,
  Link2,
  Move,
  PaintBucket,
  Palette,
  Plus,
  RemoveFormatting,
  RotateCcw,
  Sparkles,
  Trash2,
  Underline,
  X,
} from "lucide-react";

import { HOME_SOLUTIONS_FIELD_KEY } from "@/lib/cms/home-solutions-defaults";
import type { HomeSolutionCardItem } from "@/lib/cms/inline-editor-types";
import { normalizeHexColor, sanitizeRichTextHtml, stripRichTextToPlain } from "@/lib/cms/rich-text";
import { useInlineEditor } from "./inline-editor-context";
import { parseTextFieldEntries, stripControlChars } from "./inline-editor-dom";

type BoxRect = {
  top: number;
  left: number;
  width: number;
  height: number;
  right: number;
  bottom: number;
};

type GlobalLinkKey = "whatsapp" | "instagram" | "linkedin";

type GlobalLinkPopoverState = {
  key: GlobalLinkKey;
  anchorRect: { top: number; left: number; width: number; bottom: number };
};

type ActiveRichEditState = {
  key: string;
  el: HTMLElement;
  originalHtml: string;
  rect: BoxRect;
};

type ActiveCtaLinkState = {
  linkKey: string;
  rect: BoxRect;
};

type FormatToolbarState = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  accentPrimary: boolean;
};

const RICH_COLOR_PRESETS = [
  { hex: "#67a8b8", label: "Azul Petróleo (Marca)" },
  { hex: "#00ace4", label: "Ciano EndControl" },
  { hex: "#ffffff", label: "Branco" },
  { hex: "#0b1e36", label: "Azul Escuro" },
];

const ACCENT_WRAPPER_SELECTOR =
  "em, .ec-accent-primary, .ec-accent-cyan, .highlight, .segmentos-highlight, .faq-v2-highlight, .hero-title-highlight, .sn-highlight-blue";

function sameBoxRect(a: BoxRect | null | undefined, b: BoxRect | null | undefined): boolean {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return (
    Math.round(a.top) === Math.round(b.top) &&
    Math.round(a.left) === Math.round(b.left) &&
    Math.round(a.width) === Math.round(b.width) &&
    Math.round(a.height) === Math.round(b.height)
  );
}

type HoveredTargets = {
  imageEl: HTMLImageElement | null;
  bgEl: HTMLElement | null;
  topicRowEl: HTMLElement | null;
};

function readRect(el: Element | null): BoxRect | null {
  if (!el || !el.isConnected) return null;
  const r = el.getBoundingClientRect();
  if (r.width === 0 && r.height === 0) return null;
  return {
    top: r.top,
    left: r.left,
    width: r.width,
    height: r.height,
    right: r.right,
    bottom: r.bottom,
  };
}

function isEditorUiTarget(target: EventTarget | null): boolean {
  return target instanceof Element && Boolean(target.closest(".ec-ie-ui, .ec-ie-rich-toolbar, .ec-ie-cta-pill"));
}

function parseObjectPositionToken(token: string, axis: "x" | "y"): number {
  const lower = token.trim().toLowerCase();
  if (lower === "center") return 50;
  if (axis === "x") {
    if (lower === "left") return 0;
    if (lower === "right") return 100;
  } else {
    if (lower === "top") return 0;
    if (lower === "bottom") return 100;
  }
  const pct = /^(-?\d+(?:\.\d+)?)%$/.exec(lower);
  if (pct) return Math.max(0, Math.min(100, Math.round(Number(pct[1]))));
  return 50;
}

function getInitialObjectPosition(
  el: HTMLImageElement,
  savedPos?: string,
): { x: number; y: number; text: string } {
  const raw = savedPos && savedPos.trim() ? savedPos.trim() : window.getComputedStyle(el).objectPosition;
  const parts = (raw || "50% 50%").trim().split(/\s+/);
  const x = parseObjectPositionToken(parts[0] ?? "50%", "x");
  const y = parseObjectPositionToken(parts[1] ?? parts[0] ?? "50%", "y");
  return { x, y, text: `${x}% ${y}%` };
}

function unwrapElement(el: HTMLElement) {
  const parent = el.parentNode;
  if (!parent) return;
  while (el.firstChild) {
    parent.insertBefore(el.firstChild, el);
  }
  parent.removeChild(el);
}

function placeCaretAtEnd(element: HTMLElement) {
  const selection = window.getSelection();
  if (!selection) return;
  const range = document.createRange();
  range.selectNodeContents(element);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

export function InlineDomOverlays() {
  const {
    bootstrap,
    isEditing,
    previewMode,
    viewport,
    fieldsByKey,
    globalValues,
    updateTextField,
    updateRichTextField,
    updateImageField,
    updateImagePositionField,
    updateGlobalValue,
    updateCardListField,
    updateHomeSolutionCard,
    repositionTarget,
    setRepositionTarget,
    openMediaModal,
    openLinkModal,
  } = useInlineEditor();

  const targetsRef = useRef<HoveredTargets>({
    imageEl: null,
    bgEl: null,
    topicRowEl: null,
  });
  const rafIdRef = useRef<number | null>(null);
  const dragSessionRef = useRef<{
    startClientX: number;
    startClientY: number;
    startX: number;
    startY: number;
    width: number;
    height: number;
    currentPos: string;
  } | null>(null);
  const latestPosRef = useRef<string>("50% 50%");
  const justFinishedDragRef = useRef<number>(0);

  const activeRichEditRef = useRef<ActiveRichEditState | null>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const toolbarInteractingRef = useRef(false);
  const richCleanupRef = useRef<((commit: boolean) => void) | null>(null);
  const ctaCleanupRef = useRef<((commit: boolean) => void) | null>(null);

  const [imageBox, setImageBox] = useState<{
    el: HTMLImageElement;
    key: string;
    linkKey?: string;
    solutionRoutePath?: string;
    rect: BoxRect;
  } | null>(null);
  const [bgBox, setBgBox] = useState<{ key: string; rect: BoxRect } | null>(null);
  const [topicRowBox, setTopicRowBox] = useState<{
    idx: number;
    routePath: string;
    rect: BoxRect;
  } | null>(null);

  const [repositionBox, setRepositionBox] = useState<BoxRect | null>(null);
  const [livePosText, setLivePosText] = useState<string>("50% 50%");
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);

  const [activeRichEdit, setActiveRichEdit] = useState<ActiveRichEditState | null>(null);
  const [formatState, setFormatState] = useState<FormatToolbarState>({
    bold: false,
    italic: false,
    underline: false,
    accentPrimary: false,
  });
  const [activeCtaLink, setActiveCtaLink] = useState<ActiveCtaLinkState | null>(null);

  const [activeSolutionRoute, setActiveSolutionRoute] = useState<string>("");
  const [topicsPortalHost, setTopicsPortalHost] = useState<HTMLElement | null>(null);
  const pendingNewTopicFocusRef = useRef<{ routePath: string; idx: number } | null>(null);

  const [globalLinkPopover, setGlobalLinkPopover] = useState<GlobalLinkPopoverState | null>(null);
  const [globalLinkInput, setGlobalLinkInput] = useState("");
  const [globalLinkError, setGlobalLinkError] = useState<string | null>(null);

  activeRichEditRef.current = activeRichEdit;

  const homeSolutionsField = fieldsByKey.get(HOME_SOLUTIONS_FIELD_KEY);
  const activeSolutionCard: HomeSolutionCardItem | undefined = useMemo(() => {
    if (homeSolutionsField?.kind !== "homeSolutions") return undefined;
    return (
      homeSolutionsField.value.find((item) => item.routePath === activeSolutionRoute) ??
      homeSolutionsField.value[0]
    );
  }, [activeSolutionRoute, homeSolutionsField]);

  const originalSolutionCard: HomeSolutionCardItem | undefined = useMemo(() => {
    if (homeSolutionsField?.kind !== "homeSolutions" || !activeSolutionCard) return undefined;
    return homeSolutionsField.originalValue.find(
      (item) => item.routePath === activeSolutionCard.routePath,
    );
  }, [activeSolutionCard, homeSolutionsField]);

  // Sync active solution route from #highlightCard and radar slide change events
  useEffect(() => {
    if (!isEditing || previewMode || viewport !== "desktop") {
      setTopicsPortalHost(null);
      return;
    }

    const card = document.getElementById("highlightCard");
    if (!card || !card.hasAttribute("data-ec-solutions-key")) return;

    const currentRoute = card.getAttribute("data-active-solution-route") || "";
    if (currentRoute) setActiveSolutionRoute(currentRoute);

    const cardList = document.getElementById("cardList");
    let host: HTMLDivElement | null = null;
    if (cardList && cardList.parentElement) {
      host = document.createElement("div");
      host.className = "ec-ie-sol-topics-controls ec-ie-ui";
      cardList.insertAdjacentElement("afterend", host);
      setTopicsPortalHost(host);
    }

    const onSlideChange = (event: Event) => {
      const detail = (event as CustomEvent<{ routePath?: string }>).detail;
      if (detail?.routePath) {
        setActiveSolutionRoute(detail.routePath);
      }
      if (repositionTarget?.solutionRoutePath) {
        setRepositionTarget(null);
      }
    };

    window.addEventListener("ec-solucoes-slide-change", onSlideChange);
    return () => {
      window.removeEventListener("ec-solucoes-slide-change", onSlideChange);
      if (host) host.remove();
      setTopicsPortalHost(null);
    };
  }, [isEditing, previewMode, repositionTarget?.solutionRoutePath, setRepositionTarget, viewport]);

  // Reposition target lifecycle + dataset.ecRepositioning lock
  useEffect(() => {
    if (!repositionTarget) {
      setRepositionBox(null);
      setIsDraggingPhoto(false);
      return;
    }

    const el = repositionTarget.el;
    el.dataset.ecRepositioning = "true";

    let savedPos: string | undefined;
    if (repositionTarget.solutionRoutePath && homeSolutionsField?.kind === "homeSolutions") {
      const card = homeSolutionsField.value.find(
        (item) => item.routePath === repositionTarget.solutionRoutePath,
      );
      savedPos = card?.objectPosition;
    } else if (repositionTarget.cardListItemIndex !== undefined) {
      const field = fieldsByKey.get(repositionTarget.key);
      if (field?.kind === "cardList") {
        savedPos = field.value[repositionTarget.cardListItemIndex]?.image?.objectPosition;
      }
    } else {
      const field = fieldsByKey.get(repositionTarget.key);
      savedPos = field?.kind === "image" ? field.objectPosition : undefined;
    }

    const initial = getInitialObjectPosition(el, savedPos);
    latestPosRef.current = initial.text;
    setLivePosText(initial.text);
    setRepositionBox(readRect(el));

    return () => {
      delete el.dataset.ecRepositioning;
    };
  }, [fieldsByKey, homeSolutionsField, repositionTarget]);

  const syncOverlayBoxes = useCallback(() => {
    const { imageEl, bgEl, topicRowEl } = targetsRef.current;

    if (!repositionTarget && imageEl && imageEl.isConnected) {
      const solRoute = imageEl.getAttribute("data-ec-sol-image") || undefined;
      const key = solRoute ? HOME_SOLUTIONS_FIELD_KEY : (imageEl.getAttribute("data-ec-image-key") ?? "");
      const rect = readRect(imageEl);
      const linkKey = solRoute
        ? undefined
        : (imageEl.closest("a[data-ec-link-key]")?.getAttribute("data-ec-link-key") ?? undefined);
      setImageBox((prev) => {
        if (!key || !rect) return prev ? null : prev;
        if (
          prev &&
          prev.el === imageEl &&
          prev.key === key &&
          prev.linkKey === linkKey &&
          prev.solutionRoutePath === solRoute &&
          sameBoxRect(prev.rect, rect)
        ) {
          return prev;
        }
        return { el: imageEl, key, linkKey, solutionRoutePath: solRoute, rect };
      });
    } else {
      setImageBox((prev) => (prev ? null : prev));
    }

    if (bootstrap.canEditMedia && bgEl && bgEl.isConnected) {
      const key = bgEl.getAttribute("data-ec-bg-key") ?? "";
      const rect = readRect(bgEl);
      setBgBox((prev) => {
        if (!key || !rect) return prev ? null : prev;
        if (prev && prev.key === key && sameBoxRect(prev.rect, rect)) return prev;
        return { key, rect };
      });
    } else {
      setBgBox((prev) => (prev ? null : prev));
    }

    if (topicRowEl && topicRowEl.isConnected && !topicRowEl.querySelector('[data-ec-inline-active="true"]')) {
      const idxAttr = topicRowEl.getAttribute("data-ec-sol-topic-row");
      const card = topicRowEl.closest("#highlightCard");
      const routePath = card?.getAttribute("data-active-solution-route") || "";
      const idx = idxAttr !== null ? Number(idxAttr) : Number.NaN;
      const rect = readRect(topicRowEl);
      setTopicRowBox((prev) => {
        if (!Number.isInteger(idx) || !routePath || !rect) return prev ? null : prev;
        if (prev && prev.idx === idx && prev.routePath === routePath && sameBoxRect(prev.rect, rect)) {
          return prev;
        }
        return { idx, routePath, rect };
      });
    } else {
      setTopicRowBox((prev) => (prev ? null : prev));
    }

    if (activeRichEditRef.current) {
      const r = readRect(activeRichEditRef.current.el);
      if (r) {
        setActiveRichEdit((prev) => (prev && !sameBoxRect(prev.rect, r) ? { ...prev, rect: r } : prev));
      }
    }

    if (repositionTarget) {
      if (!repositionTarget.el.isConnected) {
        setRepositionTarget(null);
      } else {
        const rect = readRect(repositionTarget.el);
        const computed = window.getComputedStyle(repositionTarget.el);
        if (
          !rect ||
          computed.opacity === "0" ||
          computed.visibility === "hidden" ||
          computed.display === "none"
        ) {
          setRepositionTarget(null);
        } else {
          setRepositionBox(rect);
        }
      }
    }
  }, [bootstrap.canEditMedia, repositionTarget, setRepositionTarget]);

  const refreshRichSelectionState = useCallback(() => {
    const active = activeRichEditRef.current;
    if (!active) return;
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (active.el.contains(range.commonAncestorContainer)) {
        savedRangeRef.current = range.cloneRange();
      }
    }

    let accentPrimary = false;
    const anchorNode = sel?.anchorNode;
    const anchorEl =
      anchorNode instanceof Element ? anchorNode : anchorNode?.parentElement ?? null;
    if (anchorEl && active.el.contains(anchorEl)) {
      const matched = anchorEl.closest(ACCENT_WRAPPER_SELECTOR);
      accentPrimary = Boolean(matched && active.el.contains(matched));
    }

    let bold = false;
    let italic = false;
    let underline = false;
    try {
      bold = document.queryCommandState("bold");
      italic = document.queryCommandState("italic");
      underline = document.queryCommandState("underline");
    } catch {
      // Ignore unsupported command query
    }

    setFormatState({ bold, italic, underline, accentPrimary });
  }, []);

  useEffect(() => {
    if (!activeRichEdit) return;
    const onSelectionChange = () => refreshRichSelectionState();
    document.addEventListener("selectionchange", onSelectionChange);
    return () => document.removeEventListener("selectionchange", onSelectionChange);
  }, [activeRichEdit, refreshRichSelectionState]);

  const restoreRichSelection = useCallback((): Range | null => {
    const active = activeRichEditRef.current;
    if (!active) return null;
    active.el.focus({ preventScroll: true });
    const sel = window.getSelection();
    if (!sel) return null;
    if (savedRangeRef.current && active.el.contains(savedRangeRef.current.commonAncestorContainer)) {
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
      return savedRangeRef.current;
    }
    const fallback = document.createRange();
    fallback.selectNodeContents(active.el);
    sel.removeAllRanges();
    sel.addRange(fallback);
    savedRangeRef.current = fallback.cloneRange();
    return fallback;
  }, []);

  const applyExecCommand = useCallback(
    (command: "bold" | "italic" | "underline") => {
      const range = restoreRichSelection();
      if (!range) return;
      document.execCommand(command, false);
      refreshRichSelectionState();
    },
    [refreshRichSelectionState, restoreRichSelection],
  );

  const applySpanFormatting = useCallback(
    (kind: "accent" | "color", colorHex?: string) => {
      const active = activeRichEditRef.current;
      const range = restoreRichSelection();
      if (!active || !range) return;

      if (kind === "accent") {
        const anchorEl =
          range.commonAncestorContainer instanceof Element
            ? range.commonAncestorContainer
            : range.commonAncestorContainer.parentElement;
        const existingAccent = anchorEl?.closest(ACCENT_WRAPPER_SELECTOR) as HTMLElement | null;
        if (existingAccent && active.el.contains(existingAccent)) {
          unwrapElement(existingAccent);
          refreshRichSelectionState();
          return;
        }
      }

      if (range.collapsed) return;

      const span = document.createElement("span");
      if (kind === "accent") {
        span.className = "ec-accent-primary";
      } else if (colorHex) {
        const normalized = normalizeHexColor(colorHex);
        if (!normalized) return;
        span.style.color = normalized;
      }

      const fragment = range.extractContents();
      if (kind === "color") {
        fragment.querySelectorAll("span").forEach((child) => {
          if (child.style.color) {
            child.style.removeProperty("color");
            if (!child.getAttribute("class") && !child.getAttribute("style")?.trim()) {
              unwrapElement(child);
            }
          }
        });
      }
      span.appendChild(fragment);
      range.insertNode(span);

      const sel = window.getSelection();
      if (sel) {
        const nextRange = document.createRange();
        nextRange.selectNodeContents(span);
        sel.removeAllRanges();
        sel.addRange(nextRange);
        savedRangeRef.current = nextRange.cloneRange();
      }
      refreshRichSelectionState();
    },
    [refreshRichSelectionState, restoreRichSelection],
  );

  const clearRichFormatting = useCallback(() => {
    const active = activeRichEditRef.current;
    const range = restoreRichSelection();
    if (!active || !range) return;

    if (range.collapsed) {
      const plain = stripRichTextToPlain(active.el.innerHTML);
      active.el.textContent = plain;
      placeCaretAtEnd(active.el);
      refreshRichSelectionState();
      return;
    }

    try {
      document.execCommand("removeFormat", false);
    } catch {
      //
    }

    const walker = document.createTreeWalker(active.el, NodeFilter.SHOW_ELEMENT);
    const toUnwrap: HTMLElement[] = [];
    let current = walker.nextNode();
    while (current) {
      const el = current as HTMLElement;
      if (range.intersectsNode(el) && el !== active.el) {
        if (["STRONG", "B", "EM", "I", "U", "SPAN", "FONT"].includes(el.tagName)) {
          toUnwrap.push(el);
        }
      }
      current = walker.nextNode();
    }
    for (const el of toUnwrap) {
      unwrapElement(el);
    }
    refreshRichSelectionState();
  }, [refreshRichSelectionState, restoreRichSelection]);

  const beginDirectInlineTextEdit = useCallback(
    (
      element: HTMLElement,
      onCommit: (nextText: string) => void,
      options?: { emailValidate?: boolean; selectAll?: boolean; onCleanup?: () => void },
    ) => {
      if (element.dataset.ecInlineActive === "true") return;
      const originalValue = element.textContent ?? "";
      element.dataset.ecInlineActive = "true";
      element.setAttribute("contenteditable", "true");
      element.focus();

      const selection = window.getSelection();
      if (selection) {
        const range = document.createRange();
        range.selectNodeContents(element);
        if (!options?.selectAll) range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }

      const cleanup = () => {
        delete element.dataset.ecInlineActive;
        element.removeAttribute("contenteditable");
        element.removeEventListener("blur", onBlur);
        element.removeEventListener("keydown", onKeyDown);
        element.removeEventListener("paste", onPaste);
        options?.onCleanup?.();
      };

      const onPaste = (event: ClipboardEvent) => {
        event.preventDefault();
        const plain = stripControlChars(event.clipboardData?.getData("text/plain") ?? "");
        if (!plain) return;
        const currentLen = (element.textContent ?? "").length;
        const allowedSlice = plain.slice(0, Math.max(0, 8000 - currentLen));
        if (!allowedSlice) return;
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return;
        const range = sel.getRangeAt(0);
        range.deleteContents();
        const textNode = document.createTextNode(allowedSlice);
        range.insertNode(textNode);
        range.setStartAfter(textNode);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      };

      const onBlur = () => {
        const nextText = stripControlChars(element.textContent ?? "").slice(0, 8000).trim();
        if (options?.emailValidate && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextText)) {
          element.textContent = originalValue;
          cleanup();
          return;
        }
        if (!nextText) {
          element.textContent = originalValue;
          cleanup();
          return;
        }
        if (nextText !== element.textContent) {
          element.textContent = nextText;
        }
        cleanup();
        onCommit(nextText);
      };

      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          event.preventDefault();
          element.textContent = originalValue;
          cleanup();
          element.blur();
          return;
        }
        if (event.key === "Enter" && !event.shiftKey) {
          const isSingleLine = !["P", "BLOCKQUOTE", "FIGCAPTION"].includes(element.tagName);
          if (isSingleLine || event.ctrlKey || event.metaKey) {
            event.preventDefault();
            element.blur();
          }
        }
      };

      element.addEventListener("blur", onBlur);
      element.addEventListener("keydown", onKeyDown);
      element.addEventListener("paste", onPaste);
    },
    [],
  );

  const beginCtaInlineTextEdit = useCallback(
    (anchorEl: HTMLElement, textFieldKey: string, textNodeIndex: number, linkKey: string) => {
      ctaCleanupRef.current?.(true);
      const textNodes: Text[] = [];
      anchorEl.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          textNodes.push(node as Text);
        }
      });
      const targetNode = textNodes[textNodeIndex];
      if (!targetNode) return;

      const originalText = targetNode.data;
      const wrapper = document.createElement("span");
      wrapper.dataset.ecInlineActive = "true";
      wrapper.dataset.ecInlineTemp = "true";
      wrapper.setAttribute("contenteditable", "true");
      wrapper.textContent = originalText;
      anchorEl.replaceChild(wrapper, targetNode);

      const rect = readRect(anchorEl);
      if (rect) setActiveCtaLink({ linkKey, rect });

      wrapper.focus();
      placeCaretAtEnd(wrapper);

      let finished = false;
      const finish = (commit: boolean) => {
        if (finished) return;
        finished = true;
        ctaCleanupRef.current = null;
        wrapper.removeEventListener("blur", onBlur);
        wrapper.removeEventListener("keydown", onKeyDown);
        wrapper.removeEventListener("paste", onPaste);

        const raw = stripControlChars(wrapper.textContent ?? "").slice(0, 8000).trim();
        const finalValue = commit && raw ? raw : originalText;
        if (wrapper.parentNode === anchorEl) {
          anchorEl.replaceChild(document.createTextNode(finalValue), wrapper);
        }
        setActiveCtaLink(null);
        if (commit && raw && raw !== originalText.trim()) {
          updateTextField(textFieldKey, finalValue);
        }
      };

      const onPaste = (event: ClipboardEvent) => {
        event.preventDefault();
        const plain = stripControlChars(event.clipboardData?.getData("text/plain") ?? "");
        if (!plain) return;
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return;
        const range = sel.getRangeAt(0);
        range.deleteContents();
        const node = document.createTextNode(plain);
        range.insertNode(node);
        range.setStartAfter(node);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      };

      const onBlur = (event: FocusEvent) => {
        const nextFocus = event.relatedTarget as Element | null;
        if (nextFocus?.closest(".ec-ie-cta-pill")) return;
        finish(true);
      };

      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          event.preventDefault();
          finish(false);
        } else if (event.key === "Enter") {
          event.preventDefault();
          finish(true);
        }
      };

      ctaCleanupRef.current = finish;
      wrapper.addEventListener("blur", onBlur);
      wrapper.addEventListener("keydown", onKeyDown);
      wrapper.addEventListener("paste", onPaste);
    },
    [updateTextField],
  );

  const beginRichTextInlineEdit = useCallback(
    (element: HTMLElement, fieldKey: string) => {
      if (element.dataset.ecInlineActive === "true") return;
      richCleanupRef.current?.(true);
      ctaCleanupRef.current?.(true);

      const originalHtml = sanitizeRichTextHtml(element.innerHTML);
      element.dataset.ecInlineActive = "true";
      element.setAttribute("contenteditable", "true");
      element.focus();
      placeCaretAtEnd(element);

      const rect = readRect(element) ?? {
        top: 80,
        left: 20,
        width: 300,
        height: 40,
        right: 320,
        bottom: 120,
      };
      setActiveRichEdit({ key: fieldKey, el: element, originalHtml, rect });
      refreshRichSelectionState();

      let finished = false;
      const finish = (commit: boolean) => {
        if (finished) return;
        finished = true;
        richCleanupRef.current = null;
        delete element.dataset.ecInlineActive;
        element.removeAttribute("contenteditable");
        element.removeEventListener("blur", onBlur);
        element.removeEventListener("keydown", onKeyDown);
        element.removeEventListener("paste", onPaste);
        element.removeEventListener("mouseup", refreshRichSelectionState);
        element.removeEventListener("keyup", refreshRichSelectionState);
        savedRangeRef.current = null;
        setActiveRichEdit(null);

        if (!commit) {
          element.innerHTML = originalHtml;
          return;
        }

        const sanitized = sanitizeRichTextHtml(element.innerHTML);
        if (!stripRichTextToPlain(sanitized)) {
          element.innerHTML = originalHtml;
          return;
        }
        if (element.innerHTML !== sanitized) {
          element.innerHTML = sanitized;
        }
        updateRichTextField(fieldKey, sanitized);
      };

      const onPaste = (event: ClipboardEvent) => {
        event.preventDefault();
        const plain = stripControlChars(event.clipboardData?.getData("text/plain") ?? "");
        if (!plain) return;
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return;
        const range = sel.getRangeAt(0);
        range.deleteContents();
        const textNode = document.createTextNode(plain);
        range.insertNode(textNode);
        range.setStartAfter(textNode);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      };

      const onBlur = (event: FocusEvent) => {
        const nextTarget = event.relatedTarget as Element | null;
        if (toolbarInteractingRef.current || nextTarget?.closest(".ec-ie-rich-toolbar")) {
          return;
        }
        window.setTimeout(() => {
          if (finished) return;
          if (
            toolbarInteractingRef.current ||
            document.activeElement?.closest(".ec-ie-rich-toolbar") ||
            document.activeElement === element
          ) {
            return;
          }
          finish(true);
        }, 10);
      };

      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          event.preventDefault();
          finish(false);
          element.blur();
          return;
        }
        if (event.key === "Enter" && !event.shiftKey) {
          const isHeading = /^H[1-6]$/.test(element.tagName);
          if (isHeading || event.ctrlKey || event.metaKey) {
            event.preventDefault();
            finish(true);
            element.blur();
          }
        }
      };

      richCleanupRef.current = finish;
      element.addEventListener("blur", onBlur);
      element.addEventListener("keydown", onKeyDown);
      element.addEventListener("paste", onPaste);
      element.addEventListener("mouseup", refreshRichSelectionState);
      element.addEventListener("keyup", refreshRichSelectionState);
    },
    [refreshRichSelectionState, updateRichTextField],
  );

  // Focus newly added Home Solution topic item once solucoes.js re-renders #cardList
  useEffect(() => {
    const pending = pendingNewTopicFocusRef.current;
    if (!pending || pending.routePath !== activeSolutionRoute) return;
    const topicEl = document.querySelector<HTMLElement>(
      `#highlightCard [data-ec-sol-topic-idx="${pending.idx}"]`,
    );
    if (!topicEl) return;
    pendingNewTopicFocusRef.current = null;
    const idx = pending.idx;
    const route = pending.routePath;
    beginDirectInlineTextEdit(
      topicEl,
      (nextText) => {
        updateHomeSolutionCard(route, (item) => ({
          ...item,
          topics: item.topics.map((t, i) => (i === idx ? nextText : t)),
        }));
      },
      { selectAll: true },
    );
  }, [activeSolutionCard?.topics.length, activeSolutionRoute, beginDirectInlineTextEdit, updateHomeSolutionCard]);

  useEffect(() => {
    if (!isEditing || previewMode) {
      targetsRef.current = {
        imageEl: null,
        bgEl: null,
        topicRowEl: null,
      };
      setImageBox(null);
      setBgBox(null);
      setTopicRowBox(null);
      setGlobalLinkPopover(null);
      richCleanupRef.current?.(true);
      ctaCleanupRef.current?.(true);
      return;
    }

    const handleMouseOver = (event: MouseEvent) => {
      if (isEditorUiTarget(event.target)) return;
      if (!(event.target instanceof Element)) return;
      const el = event.target;

      const overText = Boolean(
        el.closest("[data-ec-richtext-key], [data-ec-text-fields], [data-ec-sol-field], [data-ec-card-slot-fields]"),
      );
      const rawImg = overText
        ? null
        : (el.closest("img[data-ec-image-key], img[data-ec-sol-image]") as HTMLImageElement | null);
      const isLockedForRole =
        !bootstrap.canEditMedia &&
        rawImg?.getAttribute("data-ec-editor-photo-locked") === "true";
      const img = isLockedForRole ? null : rawImg;

      const bg = bootstrap.canEditMedia
        ? (el.closest("[data-ec-bg-key]") as HTMLElement | null)
        : null;

      const topicRowEl = el.closest("#cardList li[data-ec-sol-topic-row]") as HTMLElement | null;

      const prev = targetsRef.current;
      if (
        img === prev.imageEl &&
        bg === prev.bgEl &&
        topicRowEl === prev.topicRowEl
      ) {
        return;
      }

      targetsRef.current = {
        imageEl: img,
        bgEl: bg,
        topicRowEl,
      };
      syncOverlayBoxes();
    };

    const handleClickCapture = (event: MouseEvent) => {
      if (isEditorUiTarget(event.target)) return;
      if (!(event.target instanceof Element)) return;
      const targetEl = event.target;

      // Ignore synthetic click right after pointerup on drag-to-reposition overlay
      if (repositionTarget) {
        if (Date.now() - justFinishedDragRef.current < 320) {
          return;
        }
        setRepositionTarget(null);
      }

      // Always prevent accidental navigation while editing
      const anchor = targetEl.closest("a");
      if (anchor) {
        event.preventDefault();
      }

      // Allow interaction inside an already active inline contentEditable
      if (targetEl.closest('[data-ec-inline-active="true"]')) {
        return;
      }

      // Close any active rich/CTA editor before handling next click
      if (activeRichEditRef.current && !activeRichEditRef.current.el.contains(targetEl)) {
        richCleanupRef.current?.(true);
      }

      // Allow interaction inside native inline portals (indicators, client logos, director cards, cardList, inline nav, solutions add-item bar)
      if (
        targetEl.closest("[data-ec-indicators-key]") ||
        targetEl.closest("[data-ec-clients-key]") ||
        targetEl.closest("[data-ec-directors-key]") ||
        targetEl.closest("[data-ec-cardlist-key]") ||
        targetEl.closest('header[data-ec-nav-inline="true"]') ||
        targetEl.closest("[data-ec-managed]") ||
        targetEl.closest(".ec-ie-sol-topics-controls")
      ) {
        return;
      }

      // Inline global footer texts (both Editor and Superadmin)
      const globalTextEl = targetEl.closest("[data-ec-global-text]") as HTMLElement | null;
      if (globalTextEl) {
        const globalKey = globalTextEl.getAttribute("data-ec-global-text");
        if (globalKey) {
          event.preventDefault();
          event.stopPropagation();
          setGlobalLinkPopover(null);
          beginDirectInlineTextEdit(
            globalTextEl,
            (nextText) => updateGlobalValue(globalKey, nextText),
            { emailValidate: globalKey === "email" },
          );
          return;
        }
      }

      // Inline global footer social/WhatsApp link popover (both Editor and Superadmin)
      const globalLinkEl = targetEl.closest("[data-ec-global-link]") as HTMLElement | null;
      if (globalLinkEl) {
        const globalLinkKey = globalLinkEl.getAttribute("data-ec-global-link") as GlobalLinkKey | null;
        if (
          globalLinkKey === "whatsapp" ||
          globalLinkKey === "instagram" ||
          globalLinkKey === "linkedin"
        ) {
          event.preventDefault();
          event.stopPropagation();
          const rect = globalLinkEl.getBoundingClientRect();
          setGlobalLinkInput(globalValues[globalLinkKey] ?? "");
          setGlobalLinkError(null);
          setGlobalLinkPopover({
            key: globalLinkKey,
            anchorRect: {
              top: rect.top,
              left: rect.left,
              width: rect.width,
              bottom: rect.bottom,
            },
          });
          return;
        }
      }

      // Home Solutions showcase card inline editing (all 12 slides + bullet topics!)
      const solEl = targetEl.closest("[data-ec-sol-field]") as HTMLElement | null;
      if (solEl) {
        const solField = solEl.getAttribute("data-ec-sol-field");
        const card = solEl.closest("#highlightCard");
        const routePath = card?.getAttribute("data-active-solution-route") || "";
        if (solField && routePath) {
          event.preventDefault();
          event.stopPropagation();
          setGlobalLinkPopover(null);
          const topicIdxAttr = solEl.getAttribute("data-ec-sol-topic-idx");
          beginDirectInlineTextEdit(solEl, (nextText) => {
            updateHomeSolutionCard(routePath, (item) => {
              if (solField === "tag") return { ...item, tag: nextText.slice(0, 40) };
              if (solField === "category") return { ...item, category: nextText.slice(0, 120) };
              if (solField === "title") return { ...item, title: nextText.slice(0, 160) };
              if (solField === "desc") return { ...item, desc: nextText.slice(0, 600) };
              if (solField === "ctaText") return { ...item, ctaText: nextText.slice(0, 60) };
              if (solField === "topic" && topicIdxAttr !== null) {
                const idx = Number(topicIdxAttr);
                if (Number.isInteger(idx) && idx >= 0 && idx < item.topics.length) {
                  return {
                    ...item,
                    topics: item.topics.map((t, i) => (i === idx ? nextText.slice(0, 160) : t)),
                  };
                }
              }
              return item;
            });
          });
          return;
        }
      }

      // Elementor-style inline rich-text editing (headings, paragraphs, captions, quotes)
      const richEl = targetEl.closest("[data-ec-richtext-key]") as HTMLElement | null;
      if (richEl) {
        const richKey = richEl.getAttribute("data-ec-richtext-key");
        if (richKey && fieldsByKey.get(richKey)?.kind === "richText") {
          event.preventDefault();
          event.stopPropagation();
          setGlobalLinkPopover(null);
          beginRichTextInlineEdit(richEl, richKey);
          return;
        }
      }

      // Generic inline text / CTA anchor editing (never opens dark popup!)
      const textEl = targetEl.closest("[data-ec-text-fields]") as HTMLElement | null;
      if (textEl) {
        const entries = parseTextFieldEntries(textEl);
        if (entries.length > 0) {
          event.preventDefault();
          event.stopPropagation();
          setGlobalLinkPopover(null);
          const linkAncestor = textEl.closest("a[data-ec-link-key]") as HTMLElement | null;
          const linkKey = linkAncestor?.getAttribute("data-ec-link-key") ?? undefined;

          if (linkKey && textEl.children.length > 0) {
            beginCtaInlineTextEdit(textEl, entries[0].key, entries[0].idx, linkKey);
          } else if (textEl.children.length === 0) {
            beginDirectInlineTextEdit(
              textEl,
              (nextText) => updateTextField(entries[0].key, nextText),
              linkKey ? { onCleanup: () => setActiveCtaLink(null) } : undefined,
            );
            if (linkKey) {
              const r = readRect(linkAncestor);
              if (r) setActiveCtaLink({ linkKey, rect: r });
            }
          } else {
            beginCtaInlineTextEdit(textEl, entries[0].key, entries[0].idx, linkKey ?? "");
          }
          return;
        }
      }

      // Image click (Home Solutions showcase or standard image)
      const imageEl = targetEl.closest("img[data-ec-image-key], img[data-ec-sol-image]") as HTMLImageElement | null;
      if (imageEl) {
        const solRoute = imageEl.getAttribute("data-ec-sol-image");
        if (solRoute && homeSolutionsField?.kind === "homeSolutions") {
          const cardItem = homeSolutionsField.value.find((it) => it.routePath === solRoute);
          const origItem = homeSolutionsField.originalValue.find((it) => it.routePath === solRoute);
          if (cardItem) {
            event.preventDefault();
            event.stopPropagation();
            if (bootstrap.canEditMedia) {
              openMediaModal({
                fieldKey: HOME_SOLUTIONS_FIELD_KEY,
                kind: "homeSolutionImage",
                solutionRoutePath: solRoute,
                currentValue: cardItem.image,
                originalValue: origItem?.image ?? cardItem.image,
                altText: cardItem.imageAlt,
                label: `Solução na Home · ${cardItem.title}`,
              });
            } else {
              setRepositionTarget({
                key: HOME_SOLUTIONS_FIELD_KEY,
                el: imageEl,
                solutionRoutePath: solRoute,
              });
            }
            return;
          }
        }

        const isLockedForRole =
          !bootstrap.canEditMedia &&
          imageEl.getAttribute("data-ec-editor-photo-locked") === "true";
        if (isLockedForRole) return;

        const key = imageEl.getAttribute("data-ec-image-key");
        const field = key ? fieldsByKey.get(key) : undefined;
        if (field?.kind === "image") {
          event.preventDefault();
          event.stopPropagation();
          if (bootstrap.canEditMedia) {
            openMediaModal({
              fieldKey: field.key,
              kind: "image",
              currentValue: field.value,
              originalValue: field.originalValue,
              altText: field.altText,
              label: field.label,
            });
          } else {
            setRepositionTarget({ key: field.key, el: imageEl });
          }
          return;
        }
      }

      const linkEl = targetEl.closest("a[data-ec-link-key]") as HTMLAnchorElement | null;
      if (linkEl) {
        const key = linkEl.getAttribute("data-ec-link-key");
        const field = key ? fieldsByKey.get(key) : undefined;
        if (field?.kind === "link") {
          event.preventDefault();
          event.stopPropagation();
          openLinkModal({
            fieldKey: field.key,
            currentValue: field.value,
            originalValue: field.originalValue,
            label: field.label,
          });
        }
      }
    };

    const handleViewportUpdate = () => {
      if (rafIdRef.current !== null) return;
      rafIdRef.current = window.requestAnimationFrame(() => {
        rafIdRef.current = null;
        syncOverlayBoxes();
      });
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (repositionTarget) setRepositionTarget(null);
        if (globalLinkPopover) setGlobalLinkPopover(null);
      }
    };

    document.addEventListener("mouseover", handleMouseOver, true);
    document.addEventListener("click", handleClickCapture, true);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("scroll", handleViewportUpdate, true);
    window.addEventListener("resize", handleViewportUpdate);

    return () => {
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      document.removeEventListener("mouseover", handleMouseOver, true);
      document.removeEventListener("click", handleClickCapture, true);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("scroll", handleViewportUpdate, true);
      window.removeEventListener("resize", handleViewportUpdate);
    };
  }, [
    beginCtaInlineTextEdit,
    beginDirectInlineTextEdit,
    beginRichTextInlineEdit,
    bootstrap.canEditMedia,
    fieldsByKey,
    globalLinkPopover,
    globalValues,
    homeSolutionsField,
    isEditing,
    openLinkModal,
    openMediaModal,
    previewMode,
    repositionTarget,
    setRepositionTarget,
    syncOverlayBoxes,
    updateGlobalValue,
    updateHomeSolutionCard,
    updateTextField,
  ]);

  if (!isEditing || previewMode) return null;

  const isSolImage = Boolean(imageBox?.solutionRoutePath);
  const solCardForImage =
    isSolImage && homeSolutionsField?.kind === "homeSolutions"
      ? homeSolutionsField.value.find((it) => it.routePath === imageBox?.solutionRoutePath)
      : undefined;
  const origSolCardForImage =
    isSolImage && homeSolutionsField?.kind === "homeSolutions"
      ? homeSolutionsField.originalValue.find((it) => it.routePath === imageBox?.solutionRoutePath)
      : undefined;

  const currentImageField = !isSolImage && imageBox ? fieldsByKey.get(imageBox.key) : undefined;
  const currentLinkField = imageBox?.linkKey ? fieldsByKey.get(imageBox.linkKey) : undefined;
  const currentBgField = bgBox ? fieldsByKey.get(bgBox.key) : undefined;
  const hasActiveImageLink = Boolean(
    currentLinkField?.kind === "link" &&
      currentLinkField.value.trim() !== "" &&
      currentLinkField.value !== "#",
  );
  const canRestoreCurrentImage = Boolean(
    bootstrap.canEditMedia &&
      ((isSolImage &&
        solCardForImage &&
        origSolCardForImage &&
        (solCardForImage.image !== origSolCardForImage.image ||
          (solCardForImage.objectPosition ?? "") !== (origSolCardForImage.objectPosition ?? ""))) ||
        (!isSolImage &&
          currentImageField?.kind === "image" &&
          (currentImageField.value !== currentImageField.originalValue ||
            (currentImageField.objectPosition ?? "") !==
              (currentImageField.originalObjectPosition ?? "")))),
  );

  const commitRepositionValue = (nextPos: string) => {
    if (!repositionTarget) return;
    if (repositionTarget.solutionRoutePath) {
      const route = repositionTarget.solutionRoutePath;
      updateHomeSolutionCard(route, (item) => ({ ...item, objectPosition: nextPos }));
    } else if (repositionTarget.cardListItemIndex !== undefined) {
      const field = fieldsByKey.get(repositionTarget.key);
      if (field?.kind === "cardList") {
        const targetIdx = repositionTarget.cardListItemIndex;
        const nextItems = field.value.map((item, idx) =>
          idx === targetIdx && item.image
            ? { ...item, image: { ...item.image, objectPosition: nextPos } }
            : item,
        );
        updateCardListField(field.key, nextItems);
      }
    } else {
      updateImagePositionField(repositionTarget.key, nextPos);
    }
  };

  const richToolbarTop = activeRichEdit
    ? activeRichEdit.rect.top >= 108
      ? activeRichEdit.rect.top - 50
      : Math.min(activeRichEdit.rect.bottom + 8, window.innerHeight - 58)
    : 60;
  const richToolbarLeft = activeRichEdit
    ? Math.min(Math.max(activeRichEdit.rect.left, 12), Math.max(12, window.innerWidth - 460))
    : 20;

  const ctaPillTop = activeCtaLink
    ? Math.max(52, activeCtaLink.rect.top - 42)
    : 60;
  const ctaPillLeft = activeCtaLink
    ? Math.min(Math.max(activeCtaLink.rect.left, 12), Math.max(12, window.innerWidth - 240))
    : 20;

  const globalPopoverTop = globalLinkPopover
    ? Math.max(56, Math.min(globalLinkPopover.anchorRect.top - 150, window.innerHeight - 220))
    : 80;
  const globalPopoverLeft = globalLinkPopover
    ? Math.min(Math.max(globalLinkPopover.anchorRect.left - 80, 12), window.innerWidth - 396)
    : 20;

  const saveGlobalLink = () => {
    if (!globalLinkPopover) return;
    const trimmed = globalLinkInput.trim();
    if (globalLinkPopover.key === "whatsapp") {
      const digits = trimmed.replace(/\D/g, "");
      if (!/^\d{10,15}$/.test(digits)) {
        setGlobalLinkError("Informe o WhatsApp com país e DDD (10 a 15 números, ex: 5591984040710).");
        return;
      }
      updateGlobalValue("whatsapp", digits);
      setGlobalLinkPopover(null);
      return;
    }

    try {
      const url = new URL(trimmed);
      if (url.protocol !== "https:" || url.username || url.password) {
        setGlobalLinkError("Use um link HTTPS válido.");
        return;
      }
    } catch {
      setGlobalLinkError("Use um link HTTPS válido.");
      return;
    }

    updateGlobalValue(globalLinkPopover.key, trimmed);
    setGlobalLinkPopover(null);
  };

  return (
    <>
      {/* 1. Background Image Pill (Superadmin only) */}
      {bootstrap.canEditMedia && bgBox && currentBgField?.kind === "backgroundImage" ? (
        <button
          className="ec-ie-bg-pill"
          onClick={() =>
            openMediaModal({
              fieldKey: currentBgField.key,
              kind: "backgroundImage",
              currentValue: currentBgField.value,
              originalValue: currentBgField.originalValue,
              label: currentBgField.label,
            })
          }
          style={{
            top: `${Math.max(52, bgBox.rect.top + 10)}px`,
            left: `${Math.max(12, bgBox.rect.left + 12)}px`,
          }}
          title="Alterar imagem de fundo desta seção"
          type="button"
        >
          <PaintBucket size={13} color="#38bdf8" />
          <span>Trocar Fundo</span>
        </button>
      ) : null}

      {/* 2. Image Hover Overlay (Standard Images + Home Solution Showcase Card Image) */}
      {!repositionTarget && imageBox && (isSolImage ? solCardForImage : currentImageField?.kind === "image") ? (
        <div
          className="ec-ie-image-overlay"
          style={{
            top: `${imageBox.rect.top}px`,
            left: `${imageBox.rect.left}px`,
            width: `${imageBox.rect.width}px`,
            height: `${imageBox.rect.height}px`,
          }}
        >
          <div className="ec-ie-floating-pill">
            <button
              aria-label="Mover e enquadrar fotografia"
              className="ec-ie-overlay-btn"
              onClick={() =>
                setRepositionTarget({
                  key: imageBox.key,
                  el: imageBox.el,
                  solutionRoutePath: imageBox.solutionRoutePath,
                })
              }
              title="Arrastar enquadramento da fotografia"
              type="button"
            >
              <Move size={15} />
              <span>Mover Foto</span>
            </button>

            {bootstrap.canEditMedia ? (
              <button
                aria-label="Trocar imagem"
                className="ec-ie-overlay-btn"
                onClick={() => {
                  if (isSolImage && solCardForImage && imageBox.solutionRoutePath) {
                    openMediaModal({
                      fieldKey: HOME_SOLUTIONS_FIELD_KEY,
                      kind: "homeSolutionImage",
                      solutionRoutePath: imageBox.solutionRoutePath,
                      currentValue: solCardForImage.image,
                      originalValue: origSolCardForImage?.image ?? solCardForImage.image,
                      altText: solCardForImage.imageAlt,
                      label: `Solução na Home · ${solCardForImage.title}`,
                    });
                  } else if (currentImageField?.kind === "image") {
                    openMediaModal({
                      fieldKey: currentImageField.key,
                      kind: "image",
                      currentValue: currentImageField.value,
                      originalValue: currentImageField.originalValue,
                      altText: currentImageField.altText,
                      label: currentImageField.label,
                    });
                  }
                }}
                title="Trocar Foto"
                type="button"
              >
                <ImageUp size={15} />
                <span>Trocar Foto</span>
              </button>
            ) : null}

            {canRestoreCurrentImage ? (
              <button
                aria-label="Restaurar imagem original"
                className="ec-ie-overlay-btn"
                onClick={() => {
                  if (isSolImage && origSolCardForImage && imageBox.solutionRoutePath) {
                    const route = imageBox.solutionRoutePath;
                    updateHomeSolutionCard(route, (item) => ({
                      ...item,
                      image: origSolCardForImage.image,
                      imageAlt: origSolCardForImage.imageAlt,
                      objectPosition: origSolCardForImage.objectPosition ?? "",
                    }));
                  } else if (currentImageField?.kind === "image") {
                    updateImageField(
                      currentImageField.key,
                      currentImageField.originalValue,
                      "",
                      currentImageField.originalObjectPosition ?? "",
                    );
                  }
                }}
                title="Remover alteração e restaurar original"
                type="button"
              >
                <RotateCcw size={14} />
                <span>Restaurar</span>
              </button>
            ) : null}

            {currentLinkField?.kind === "link" ? (
              <button
                aria-label="Configurar link"
                className="ec-ie-overlay-btn"
                onClick={() =>
                  openLinkModal({
                    fieldKey: currentLinkField.key,
                    currentValue: currentLinkField.value,
                    originalValue: currentLinkField.originalValue,
                    label: currentLinkField.label,
                  })
                }
                title="Configurar Link"
                type="button"
              >
                <Link2 size={15} />
                <span>Link</span>
                {hasActiveImageLink ? <span className="ec-ie-active-dot" /> : null}
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* 4. Interactive Drag-to-Reposition Overlay (race-free pointer tracking) */}
      {repositionTarget && repositionBox ? (
        <div
          className={`ec-ie-reposition-overlay ${isDraggingPhoto ? "is-dragging" : ""}`}
          onPointerDown={(e) => {
            if ((e.target as Element).closest(".ec-ie-reposition-bar")) return;
            e.preventDefault();
            e.stopPropagation();
            const parsed = getInitialObjectPosition(repositionTarget.el, latestPosRef.current);
            dragSessionRef.current = {
              startClientX: e.clientX,
              startClientY: e.clientY,
              startX: parsed.x,
              startY: parsed.y,
              width: Math.max(80, repositionBox.width),
              height: Math.max(80, repositionBox.height),
              currentPos: parsed.text,
            };
            setIsDraggingPhoto(true);
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            const session = dragSessionRef.current;
            if (!session) return;
            const dx = e.clientX - session.startClientX;
            const dy = e.clientY - session.startClientY;
            const nextX = Math.round(
              Math.max(0, Math.min(100, session.startX - (dx / session.width) * 100)),
            );
            const nextY = Math.round(
              Math.max(0, Math.min(100, session.startY - (dy / session.height) * 100)),
            );
            const nextPos = `${nextX}% ${nextY}%`;
            session.currentPos = nextPos;
            latestPosRef.current = nextPos;
            setLivePosText(nextPos);
            repositionTarget.el.style.objectPosition = nextPos;
          }}
          onPointerUp={(e) => {
            const session = dragSessionRef.current;
            if (!session) return;
            const finalPos = session.currentPos;
            dragSessionRef.current = null;
            setIsDraggingPhoto(false);
            justFinishedDragRef.current = Date.now();
            if (e.currentTarget.hasPointerCapture(e.pointerId)) {
              e.currentTarget.releasePointerCapture(e.pointerId);
            }
            latestPosRef.current = finalPos;
            commitRepositionValue(finalPos);
          }}
          onPointerCancel={(e) => {
            const session = dragSessionRef.current;
            if (!session) return;
            const finalPos = session.currentPos;
            dragSessionRef.current = null;
            setIsDraggingPhoto(false);
            justFinishedDragRef.current = Date.now();
            if (e.currentTarget.hasPointerCapture(e.pointerId)) {
              e.currentTarget.releasePointerCapture(e.pointerId);
            }
            latestPosRef.current = finalPos;
            commitRepositionValue(finalPos);
          }}
          style={{
            top: `${repositionBox.top}px`,
            left: `${repositionBox.left}px`,
            width: `${repositionBox.width}px`,
            height: `${repositionBox.height}px`,
          }}
        >
          <div className="ec-ie-reposition-bar" onClick={(e) => e.stopPropagation()}>
            <span>Arraste para enquadrar</span>
            <span className="ec-ie-reposition-coords">{livePosText}</span>
            <button
              className="ec-ie-btn-secondary"
              onClick={() => {
                latestPosRef.current = "50% 50%";
                setLivePosText("50% 50%");
                repositionTarget.el.style.objectPosition = "50% 50%";
                commitRepositionValue("50% 50%");
              }}
              style={{ padding: "3px 8px", fontSize: "11px" }}
              type="button"
            >
              Centralizar
            </button>
            <button
              className="ec-ie-btn-primary"
              onClick={() => {
                commitRepositionValue(latestPosRef.current);
                setRepositionTarget(null);
              }}
              style={{ padding: "3px 10px", fontSize: "11px" }}
              type="button"
            >
              <Check size={12} />
              <span>Concluir</span>
            </button>
          </div>
        </div>
      ) : null}

      {/* 5. Elementor-Style Floating Rich-Text Formatting Toolbar */}
      {activeRichEdit ? (
        <div
          aria-label="Barra de formatação de texto"
          className="ec-ie-rich-toolbar"
          onMouseDown={(e) => {
            if ((e.target as Element).closest('input[type="color"]')) {
              toolbarInteractingRef.current = true;
              return;
            }
            e.preventDefault();
          }}
          role="toolbar"
          style={{ top: `${richToolbarTop}px`, left: `${richToolbarLeft}px` }}
        >
          <button
            aria-label="Negrito"
            className={`ec-ie-rt-btn ${formatState.bold ? "is-active" : ""}`}
            onClick={() => applyExecCommand("bold")}
            title="Negrito (Ctrl+B)"
            type="button"
          >
            <Bold size={14} />
          </button>
          <button
            aria-label="Itálico"
            className={`ec-ie-rt-btn ${formatState.italic ? "is-active" : ""}`}
            onClick={() => applyExecCommand("italic")}
            title="Itálico (Ctrl+I)"
            type="button"
          >
            <Italic size={14} />
          </button>
          <button
            aria-label="Sublinhado"
            className={`ec-ie-rt-btn ${formatState.underline ? "is-active" : ""}`}
            onClick={() => applyExecCommand("underline")}
            title="Sublinhado (Ctrl+U)"
            type="button"
          >
            <Underline size={14} />
          </button>

          <span className="ec-ie-rt-sep" />

          <button
            aria-label="Destaque da marca"
            className={`ec-ie-rt-btn is-accent ${formatState.accentPrimary ? "is-active" : ""}`}
            onClick={() => applySpanFormatting("accent")}
            title="Destaque da marca (itálico + cor primária)"
            type="button"
          >
            <Sparkles size={13} />
            <span>Destaque</span>
          </button>

          <span className="ec-ie-rt-sep" />

          {RICH_COLOR_PRESETS.map((preset) => (
            <button
              aria-label={`Cor ${preset.label}`}
              className="ec-ie-rt-swatch"
              key={preset.hex}
              onClick={() => applySpanFormatting("color", preset.hex)}
              style={{ backgroundColor: preset.hex }}
              title={preset.label}
              type="button"
            />
          ))}

          <label
            className="ec-ie-rt-color-wrap"
            onPointerDown={() => {
              toolbarInteractingRef.current = true;
              const sel = window.getSelection();
              if (sel && sel.rangeCount > 0 && activeRichEdit.el.contains(sel.getRangeAt(0).commonAncestorContainer)) {
                savedRangeRef.current = sel.getRangeAt(0).cloneRange();
              }
            }}
            title="Escolher outra cor"
          >
            <Palette size={13} />
            <input
              aria-label="Cor personalizada"
              className="ec-ie-rt-color-input"
              defaultValue="#00ace4"
              onBlur={() => {
                window.setTimeout(() => {
                  toolbarInteractingRef.current = false;
                }, 40);
              }}
              onChange={(e) => {
                toolbarInteractingRef.current = false;
                applySpanFormatting("color", e.target.value);
              }}
              type="color"
            />
          </label>

          <button
            aria-label="Limpar formatação"
            className="ec-ie-rt-btn"
            onClick={clearRichFormatting}
            title="Limpar formatação do trecho"
            type="button"
          >
            <RemoveFormatting size={14} />
          </button>

          <span className="ec-ie-rt-sep" />

          <button
            className="ec-ie-rt-done"
            onClick={() => {
              richCleanupRef.current?.(true);
              activeRichEdit.el.blur();
            }}
            type="button"
          >
            <Check size={13} />
            <span>Concluir</span>
          </button>
        </div>
      ) : null}

      {/* 6. Compact CTA Pill while editing CTA button text inline */}
      {activeCtaLink && activeCtaLink.linkKey ? (
        <div
          className="ec-ie-cta-pill"
          onMouseDown={(e) => e.preventDefault()}
          style={{ top: `${ctaPillTop}px`, left: `${ctaPillLeft}px` }}
        >
          <button
            className="ec-ie-btn-secondary"
            onClick={() => {
              const linkField = fieldsByKey.get(activeCtaLink.linkKey);
              ctaCleanupRef.current?.(true);
              if (linkField?.kind === "link") {
                openLinkModal({
                  fieldKey: linkField.key,
                  currentValue: linkField.value,
                  originalValue: linkField.originalValue,
                  label: linkField.label,
                });
              }
            }}
            style={{ padding: "4px 9px", fontSize: "11px" }}
            type="button"
          >
            <Link2 size={12} />
            <span>Editar Link</span>
          </button>
          <button
            className="ec-ie-btn-primary"
            onClick={() => ctaCleanupRef.current?.(true)}
            style={{ padding: "4px 9px", fontSize: "11px" }}
            type="button"
          >
            <Check size={12} />
            <span>Concluir</span>
          </button>
        </div>
      ) : null}

      {/* 7. Home Solutions Topic Row Delete Button (hover over #cardList li) */}
      {topicRowBox &&
      activeSolutionCard &&
      activeSolutionCard.routePath === topicRowBox.routePath &&
      activeSolutionCard.topics.length > 1 ? (
        <button
          aria-label="Remover item da lista"
          className="ec-ie-sol-topic-del"
          onClick={() => {
            const targetIdx = topicRowBox.idx;
            const route = topicRowBox.routePath;
            setTopicRowBox(null);
            updateHomeSolutionCard(route, (item) => {
              if (item.topics.length <= 1) return item;
              return {
                ...item,
                topics: item.topics.filter((_, idx) => idx !== targetIdx),
              };
            });
          }}
          style={{
            top: `${topicRowBox.rect.top + topicRowBox.rect.height / 2 - 12}px`,
            left: `${Math.min(topicRowBox.rect.right - 26, window.innerWidth - 36)}px`,
          }}
          title="Remover este item"
          type="button"
        >
          <Trash2 size={12} />
        </button>
      ) : null}

      {/* 8. Home Solutions Topics Add-Item Bar (portal right under #cardList) */}
      {topicsPortalHost && activeSolutionCard && activeSolutionCard.topics.length < 8
        ? createPortal(
            <button
              className="ec-ie-sol-add-topic-btn"
              onClick={() => {
                const route = activeSolutionCard.routePath;
                const nextIdx = activeSolutionCard.topics.length;
                pendingNewTopicFocusRef.current = { routePath: route, idx: nextIdx };
                updateHomeSolutionCard(route, (item) => {
                  if (item.topics.length >= 8) return item;
                  return {
                    ...item,
                    topics: [...item.topics, "Novo destaque técnico"],
                  };
                });
              }}
              type="button"
            >
              <Plus size={13} />
              <span>Adicionar item com ícone ({activeSolutionCard.topics.length}/8)</span>
            </button>,
            topicsPortalHost,
          )
        : null}

      {/* 9. Inline Footer Social / WhatsApp Link Popover (Editor & Superadmin) */}
      {globalLinkPopover ? (
        <div
          className="ec-ie-popover"
          style={{ top: `${globalPopoverTop}px`, left: `${globalPopoverLeft}px` }}
        >
          <div className="ec-ie-popover-head">
            <span className="ec-ie-popover-title">
              {globalLinkPopover.key === "whatsapp"
                ? "Número WhatsApp do Rodapé"
                : globalLinkPopover.key === "instagram"
                  ? "Link do Instagram"
                  : "Link do LinkedIn"}
            </span>
            <button
              aria-label="Fechar"
              className="ec-ie-icon-btn"
              onClick={() => setGlobalLinkPopover(null)}
              type="button"
            >
              <X size={14} />
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div>
              <label className="ec-ie-field-label" htmlFor="ec-ie-global-link-input">
                {globalLinkPopover.key === "whatsapp"
                  ? "Somente números com código do país e DDD"
                  : "URL HTTPS completa"}
              </label>
              <input
                autoFocus
                className="ec-ie-input"
                id="ec-ie-global-link-input"
                maxLength={500}
                onChange={(e) => {
                  setGlobalLinkInput(e.target.value);
                  setGlobalLinkError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveGlobalLink();
                  if (e.key === "Escape") setGlobalLinkPopover(null);
                }}
                placeholder={
                  globalLinkPopover.key === "whatsapp"
                    ? "5591984040710"
                    : "https://..."
                }
                type="text"
                value={globalLinkInput}
              />
              {globalLinkError ? (
                <p className="ec-ie-error-text" style={{ marginTop: "6px" }}>
                  {globalLinkError}
                </p>
              ) : null}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button
                className="ec-ie-btn-secondary"
                onClick={() => setGlobalLinkPopover(null)}
                type="button"
              >
                Cancelar
              </button>
              <button className="ec-ie-btn-primary" onClick={saveGlobalLink} type="button">
                <Check size={13} />
                <span>Aplicar</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
