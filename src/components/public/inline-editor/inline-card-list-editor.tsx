"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  GripVertical,
  ImageUp,
  Move,
  Plus,
  Trash2,
} from "lucide-react";

import type { CardListItem, EditableCardListField } from "@/lib/cms/inline-editor-types";
import { useInlineEditor } from "./inline-editor-context";
import { collectLiveCardTextSlots, stripControlChars } from "./inline-editor-dom";

type CardHoverState = {
  fieldKey: string;
  index: number;
  cardEl: HTMLElement;
  rect: DOMRect;
  isVertical: boolean;
};

type SlotEntry = { slot: number; idx: number };

function parseCardSlotEntries(el: Element): SlotEntry[] {
  const raw = el.getAttribute("data-ec-card-slot-fields");
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is SlotEntry =>
        Boolean(item && typeof item.slot === "number" && typeof item.idx === "number"),
    );
  } catch {
    return [];
  }
}

function detectVerticalOrientation(cardEl: HTMLElement, itemSelector: string): boolean {
  const parent = cardEl.parentElement;
  if (!parent) return false;
  const siblings = Array.from(parent.children).filter((el): el is HTMLElement =>
    el.matches(itemSelector),
  );
  if (siblings.length < 2) return false;
  const firstRect = siblings[0].getBoundingClientRect();
  const secondRect = siblings[1].getBoundingClientRect();
  const dx = Math.abs(secondRect.left - firstRect.left);
  const dy = Math.abs(secondRect.top - firstRect.top);
  return dy > dx + 12;
}

function placeCaret(element: HTMLElement, selectAll = false) {
  const sel = window.getSelection();
  if (!sel) return;
  const range = document.createRange();
  range.selectNodeContents(element);
  if (!selectAll) range.collapse(false);
  sel.removeAllRanges();
  sel.addRange(range);
}

export function InlineCardListEditor() {
  const {
    bootstrap,
    isEditing,
    previewMode,
    isDevicePreviewFrame,
    fieldsByKey,
    updateCardListField,
    openMediaModal,
    setRepositionTarget,
  } = useInlineEditor();

  const active = isEditing && !previewMode && !isDevicePreviewFrame;

  const [hoveredCard, setHoveredCard] = useState<CardHoverState | null>(null);
  const [draggingState, setDraggingState] = useState<{
    fieldKey: string;
    fromIndex: number;
    overIndex: number | null;
  } | null>(null);

  const pendingFocusRef = useRef<{ fieldKey: string; itemId: string } | null>(null);
  const hoveredCardElRef = useRef<HTMLElement | null>(null);
  const activeSlotCleanupRef = useRef<((commit: boolean) => void) | null>(null);

  const syncHoveredRect = useCallback(() => {
    const cardEl = hoveredCardElRef.current;
    if (!cardEl || !cardEl.isConnected) {
      hoveredCardElRef.current = null;
      setHoveredCard(null);
      return;
    }
    const fieldKey = cardEl.getAttribute("data-ec-cardlist-owner") ?? "";
    const indexAttr = cardEl.getAttribute("data-ec-cardlist-index");
    const index = indexAttr !== null ? Number(indexAttr) : -1;
    const field = fieldsByKey.get(fieldKey);
    if (!field || field.kind !== "cardList" || index < 0 || index >= field.value.length) {
      hoveredCardElRef.current = null;
      setHoveredCard(null);
      return;
    }
    const rect = cardEl.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
      setHoveredCard(null);
      return;
    }
    setHoveredCard({
      fieldKey,
      index,
      cardEl,
      rect,
      isVertical: detectVerticalOrientation(cardEl, field.itemSelector),
    });
  }, [fieldsByKey]);

  const commitSlotText = useCallback(
    (fieldKey: string, cardIndex: number, slotIndex: number, nextText: string) => {
      const field = fieldsByKey.get(fieldKey);
      if (!field || field.kind !== "cardList") return;
      const item = field.value[cardIndex];
      if (!item || slotIndex < 0 || slotIndex >= item.texts.length) return;
      if (item.texts[slotIndex] === nextText) return;

      const nextItems = field.value.map((entry, idx) =>
        idx === cardIndex
          ? {
              ...entry,
              texts: entry.texts.map((t, tIdx) => (tIdx === slotIndex ? nextText : t)),
            }
          : entry,
      );
      updateCardListField(fieldKey, nextItems);
    },
    [fieldsByKey, updateCardListField],
  );

  const beginSlotInlineEdit = useCallback(
    (
      slotEl: HTMLElement,
      entry: SlotEntry,
      fieldKey: string,
      cardIndex: number,
      selectAll = false,
    ) => {
      if (slotEl.dataset.ecInlineActive === "true") return;
      if (slotEl.querySelector('[data-ec-inline-active="true"]')) return;
      activeSlotCleanupRef.current?.(true);

      const textNodes: Text[] = [];
      slotEl.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          textNodes.push(node as Text);
        }
      });
      const targetTextNode = textNodes[entry.idx];
      if (!targetTextNode) return;

      const isDirectElement =
        slotEl.children.length === 0 && slotEl.tagName !== "BUTTON" && slotEl.tagName !== "A";

      let editEl: HTMLElement;
      let tempWrapper: HTMLSpanElement | null = null;
      const originalText = targetTextNode.data;

      if (isDirectElement) {
        editEl = slotEl;
        editEl.dataset.ecInlineActive = "true";
        editEl.setAttribute("contenteditable", "true");
      } else {
        tempWrapper = document.createElement("span");
        tempWrapper.dataset.ecInlineActive = "true";
        tempWrapper.dataset.ecInlineTemp = "true";
        tempWrapper.setAttribute("contenteditable", "true");
        tempWrapper.textContent = originalText;
        slotEl.replaceChild(tempWrapper, targetTextNode);
        editEl = tempWrapper;
      }

      editEl.focus();
      placeCaret(editEl, selectAll);

      let finished = false;
      const finish = (commit: boolean) => {
        if (finished) return;
        finished = true;
        activeSlotCleanupRef.current = null;
        editEl.removeEventListener("blur", onBlur);
        editEl.removeEventListener("keydown", onKeyDown);
        editEl.removeEventListener("keyup", onKeyUp);
        editEl.removeEventListener("paste", onPaste);

        const raw = stripControlChars(editEl.textContent ?? "").slice(0, 4_000).trim();
        const finalText = commit && raw ? raw : originalText.trim();

        if (tempWrapper) {
          if (tempWrapper.parentNode === slotEl) {
            slotEl.replaceChild(document.createTextNode(finalText), tempWrapper);
          }
        } else {
          delete editEl.dataset.ecInlineActive;
          editEl.removeAttribute("contenteditable");
          editEl.textContent = finalText;
        }

        if (commit && raw && raw !== originalText.trim()) {
          commitSlotText(fieldKey, cardIndex, entry.slot, finalText);
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
        const node = document.createTextNode(plain.slice(0, 4_000));
        range.insertNode(node);
        range.setStartAfter(node);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      };

      const onBlur = () => finish(true);

      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          finish(false);
          return;
        }
        if (event.key === "Enter" && !event.shiftKey) {
          const isSingleLine = !["P", "BLOCKQUOTE", "FIGCAPTION"].includes(slotEl.tagName);
          if (isSingleLine || event.ctrlKey || event.metaKey) {
            event.preventDefault();
            event.stopPropagation();
            finish(true);
          }
          return;
        }
        if (event.key === " " && slotEl.tagName === "BUTTON") {
          event.preventDefault();
          event.stopPropagation();
          const sel = window.getSelection();
          if (sel && sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            range.deleteContents();
            const spaceNode = document.createTextNode(" ");
            range.insertNode(spaceNode);
            range.setStartAfter(spaceNode);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }
      };

      const onKeyUp = (event: KeyboardEvent) => {
        if (event.key === " " && slotEl.tagName === "BUTTON") {
          event.preventDefault();
          event.stopPropagation();
        }
      };

      activeSlotCleanupRef.current = finish;
      editEl.addEventListener("blur", onBlur);
      editEl.addEventListener("keydown", onKeyDown);
      editEl.addEventListener("keyup", onKeyUp);
      editEl.addEventListener("paste", onPaste);
    },
    [commitSlotText],
  );

  // Auto-focus first text slot of newly duplicated/added card
  useEffect(() => {
    const pending = pendingFocusRef.current;
    if (!pending || !active) return;
    const cardEl = document.querySelector<HTMLElement>(
      `[data-ec-cardlist-owner="${CSS.escape(pending.fieldKey)}"][data-ec-cardlist-item-id="${CSS.escape(pending.itemId)}"]`,
    );
    if (!cardEl) return;
    pendingFocusRef.current = null;
    const slots = collectLiveCardTextSlots(cardEl);
    const first = slots[0];
    if (!first) return;
    const indexAttr = cardEl.getAttribute("data-ec-cardlist-index");
    const cardIndex = indexAttr !== null ? Number(indexAttr) : 0;
    cardEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    beginSlotInlineEdit(
      first.parentElement,
      { slot: first.slotIndex, idx: first.textNodeIndex },
      pending.fieldKey,
      cardIndex,
      true,
    );
  }, [active, beginSlotInlineEdit, fieldsByKey]);

  useEffect(() => {
    if (!active) {
      hoveredCardElRef.current = null;
      setHoveredCard(null);
      setDraggingState(null);
      activeSlotCleanupRef.current?.(true);
      return;
    }

    const handleMouseOver = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      if (event.target.closest(".ec-ie-card-toolbar")) return;
      if (event.target.closest(".ec-ie-ui")) {
        hoveredCardElRef.current = null;
        setHoveredCard(null);
        return;
      }

      const cardEl = event.target.closest(
        "[data-ec-cardlist-owner][data-ec-cardlist-index]",
      ) as HTMLElement | null;
      if (cardEl === hoveredCardElRef.current) return;
      hoveredCardElRef.current = cardEl;
      syncHoveredRect();
    };

    const handleClickCapture = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      if (event.target.closest(".ec-ie-ui")) return;
      if (event.target.closest('[data-ec-inline-active="true"]')) return;

      const slotEl = event.target.closest("[data-ec-card-slot-fields]") as HTMLElement | null;
      if (slotEl) {
        const cardEl = slotEl.closest(
          "[data-ec-cardlist-owner][data-ec-cardlist-index]",
        ) as HTMLElement | null;
        if (cardEl) {
          const fieldKey = cardEl.getAttribute("data-ec-cardlist-owner") ?? "";
          const cardIdx = Number(cardEl.getAttribute("data-ec-cardlist-index") ?? "-1");
          const entries = parseCardSlotEntries(slotEl);
          if (fieldKey && cardIdx >= 0 && entries.length > 0) {
            event.preventDefault();
            event.stopPropagation();
            beginSlotInlineEdit(slotEl, entries[0], fieldKey, cardIdx);
            return;
          }
        }
      }

      const imgEl = event.target.closest(
        "img[data-ec-card-image-owner][data-ec-card-image-index]",
      ) as HTMLImageElement | null;
      if (imgEl) {
        const isLocked =
          !bootstrap.canEditMedia &&
          imgEl.getAttribute("data-ec-editor-photo-locked") === "true";
        if (isLocked) return;

        const fieldKey = imgEl.getAttribute("data-ec-card-image-owner") ?? "";
        const cardIdx = Number(imgEl.getAttribute("data-ec-card-image-index") ?? "-1");
        const field = fieldsByKey.get(fieldKey);
        if (field?.kind === "cardList" && cardIdx >= 0 && cardIdx < field.value.length) {
          const item = field.value[cardIdx];
          if (!item.image) return;
          event.preventDefault();
          event.stopPropagation();
          if (bootstrap.canEditMedia) {
            const origItem = field.originalValue[item.sourceIndex];
            openMediaModal({
              fieldKey: field.key,
              kind: "cardListImage",
              cardListItemIndex: cardIdx,
              currentValue: item.image.src,
              originalValue: origItem?.image?.src ?? item.image.src,
              altText: item.image.alt,
              label: `${field.label} · Card ${cardIdx + 1}`,
            });
          } else {
            setRepositionTarget({ key: field.key, el: imgEl, cardListItemIndex: cardIdx });
          }
        }
      }
    };

    const handleScrollOrResize = () => syncHoveredRect();

    document.addEventListener("mouseover", handleMouseOver, true);
    document.addEventListener("click", handleClickCapture, true);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("mouseover", handleMouseOver, true);
      document.removeEventListener("click", handleClickCapture, true);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [
    active,
    beginSlotInlineEdit,
    bootstrap.canEditMedia,
    fieldsByKey,
    openMediaModal,
    setRepositionTarget,
    syncHoveredRect,
  ]);

  // Highlight drop target card while dragging
  useEffect(() => {
    document.querySelectorAll(".ec-ie-card-drop-target").forEach((el) => {
      el.classList.remove("ec-ie-card-drop-target");
    });
    if (!draggingState || draggingState.overIndex === null) return;
    if (draggingState.overIndex === draggingState.fromIndex) return;
    const targetEl = document.querySelector<HTMLElement>(
      `[data-ec-cardlist-owner="${CSS.escape(draggingState.fieldKey)}"][data-ec-cardlist-index="${draggingState.overIndex}"]`,
    );
    targetEl?.classList.add("ec-ie-card-drop-target");
    return () => {
      targetEl?.classList.remove("ec-ie-card-drop-target");
    };
  }, [draggingState]);

  // Listen for dragover/drop on card containers while a card drag is active
  useEffect(() => {
    if (!draggingState) return;

    const onDragOver = (event: DragEvent) => {
      if (!(event.target instanceof Element)) return;
      const cardEl = event.target.closest(
        `[data-ec-cardlist-owner="${CSS.escape(draggingState.fieldKey)}"][data-ec-cardlist-index]`,
      ) as HTMLElement | null;
      if (!cardEl) return;
      event.preventDefault();
      const overIdx = Number(cardEl.getAttribute("data-ec-cardlist-index") ?? "-1");
      if (overIdx >= 0 && overIdx !== draggingState.overIndex) {
        setDraggingState((prev) => (prev ? { ...prev, overIndex: overIdx } : null));
      }
    };

    const onDrop = (event: DragEvent) => {
      event.preventDefault();
      const field = fieldsByKey.get(draggingState.fieldKey);
      const from = draggingState.fromIndex;
      const to = draggingState.overIndex;
      setDraggingState(null);
      if (!field || field.kind !== "cardList" || to === null || to === from) return;
      if (from < 0 || from >= field.value.length || to < 0 || to >= field.value.length) return;
      const next = [...field.value];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      updateCardListField(field.key, next);
    };

    const onDragEnd = () => setDraggingState(null);

    document.addEventListener("dragover", onDragOver, true);
    document.addEventListener("drop", onDrop, true);
    document.addEventListener("dragend", onDragEnd, true);
    return () => {
      document.removeEventListener("dragover", onDragOver, true);
      document.removeEventListener("drop", onDrop, true);
      document.removeEventListener("dragend", onDragEnd, true);
    };
  }, [draggingState, fieldsByKey, updateCardListField]);

  if (!active || !hoveredCard) return null;

  const field = fieldsByKey.get(hoveredCard.fieldKey) as EditableCardListField | undefined;
  if (!field || field.kind !== "cardList") return null;

  const items = field.value;
  const idx = hoveredCard.index;
  const item = items[idx];
  if (!item) return null;

  const canMovePrev = idx > 0;
  const canMoveNext = idx < items.length - 1;
  const canDuplicate = items.length < field.maxItems;
  const canDelete = items.length > field.minItems;

  const cardImgEl = hoveredCard.cardEl.querySelector<HTMLImageElement>(
    "img[data-ec-card-image-owner]",
  );
  const canAdjustImage =
    Boolean(cardImgEl && item.image) &&
    (bootstrap.canEditMedia || !field.editorPhotoLocked);

  const moveCard = (delta: -1 | 1) => {
    const target = idx + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[idx], next[target]] = [next[target], next[idx]];
    hoveredCardElRef.current = null;
    setHoveredCard(null);
    updateCardListField(field.key, next);
  };

  const duplicateCard = () => {
    if (!canDuplicate) return;
    const newId = `clone-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const cloned: CardListItem = {
      id: newId,
      sourceIndex: item.sourceIndex,
      texts: [...item.texts],
      ...(item.image ? { image: { ...item.image } } : {}),
    };
    const next = [...items.slice(0, idx + 1), cloned, ...items.slice(idx + 1)];
    pendingFocusRef.current = { fieldKey: field.key, itemId: newId };
    updateCardListField(field.key, next);
  };

  const deleteCard = () => {
    if (!canDelete) return;
    const next = items.filter((_, i) => i !== idx);
    hoveredCardElRef.current = null;
    setHoveredCard(null);
    updateCardListField(field.key, next);
  };

  const toolbarTop = Math.max(50, Math.min(hoveredCard.rect.top - 14, window.innerHeight - 48));
  const toolbarRight = Math.max(12, window.innerWidth - hoveredCard.rect.right + 4);

  return (
    <>
      <div
        aria-hidden="true"
        className="ec-ie-card-hover-ring"
        style={{
          top: `${hoveredCard.rect.top}px`,
          left: `${hoveredCard.rect.left}px`,
          width: `${hoveredCard.rect.width}px`,
          height: `${hoveredCard.rect.height}px`,
        }}
      />

      <div
        aria-label={`Controles do card ${idx + 1} em ${field.label}`}
        className="ec-ie-card-toolbar ec-ie-ui"
        role="toolbar"
        style={{
          top: `${toolbarTop}px`,
          right: `${toolbarRight}px`,
        }}
      >
        <span
          className="ec-ie-card-drag-handle"
          draggable
          onDragStart={(e) => {
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text/plain", item.id);
            setDraggingState({ fieldKey: field.key, fromIndex: idx, overIndex: idx });
          }}
          title="Arrastar card para reordenar"
        >
          <GripVertical size={13} />
        </span>

        <button
          aria-label={hoveredCard.isVertical ? "Mover card para cima" : "Mover card para esquerda"}
          className="ec-ie-card-tool-btn"
          disabled={!canMovePrev}
          onClick={() => moveCard(-1)}
          title={hoveredCard.isVertical ? "Mover para cima" : "Mover para esquerda"}
          type="button"
        >
          {hoveredCard.isVertical ? <ChevronUp size={13} /> : <ChevronLeft size={13} />}
        </button>

        <button
          aria-label={hoveredCard.isVertical ? "Mover card para baixo" : "Mover card para direita"}
          className="ec-ie-card-tool-btn"
          disabled={!canMoveNext}
          onClick={() => moveCard(1)}
          title={hoveredCard.isVertical ? "Mover para baixo" : "Mover para direita"}
          type="button"
        >
          {hoveredCard.isVertical ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
        </button>

        <button
          aria-label="Duplicar ou adicionar card após este"
          className="ec-ie-card-tool-btn"
          disabled={!canDuplicate}
          onClick={duplicateCard}
          title="Adicionar / duplicar card"
          type="button"
        >
          <Plus size={13} />
        </button>

        {canAdjustImage && cardImgEl ? (
          <>
            <button
              aria-label="Enquadrar fotografia do card"
              className="ec-ie-card-tool-btn"
              onClick={() =>
                setRepositionTarget({
                  key: field.key,
                  el: cardImgEl,
                  cardListItemIndex: idx,
                })
              }
              title="Enquadrar foto"
              type="button"
            >
              <Move size={13} />
            </button>
            {bootstrap.canEditMedia ? (
              <button
                aria-label="Trocar imagem do card"
                className="ec-ie-card-tool-btn"
                onClick={() => {
                  const origItem = field.originalValue[item.sourceIndex];
                  openMediaModal({
                    fieldKey: field.key,
                    kind: "cardListImage",
                    cardListItemIndex: idx,
                    currentValue: item.image?.src,
                    originalValue: origItem?.image?.src ?? item.image?.src,
                    altText: item.image?.alt,
                    label: `${field.label} · Card ${idx + 1}`,
                  });
                }}
                title="Trocar foto"
                type="button"
              >
                <ImageUp size={13} />
              </button>
            ) : null}
          </>
        ) : null}

        <button
          aria-label="Excluir card"
          className="ec-ie-card-tool-btn is-danger"
          disabled={!canDelete}
          onClick={deleteCard}
          title="Excluir card (Ctrl+Z desfaz)"
          type="button"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </>
  );
}
