"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";

import type { IndicatorItem } from "@/lib/cms/inline-editor-types";
import { useInlineEditor } from "./inline-editor-context";
import { stripControlChars } from "./inline-editor-dom";

const GROUP_COLORS = ["#67A8B8", "#00ACE4"];

function sanitizeIndicatorText(raw: string): string {
  return stripControlChars(raw).replace(/[<>]/g, "");
}

function normalizeIndicators(items: IndicatorItem[]): IndicatorItem[] | null {
  if (items.length < 1 || items.length > 24) return null;
  const normalized = items.map((item) => ({
    value: item.value.trim(),
    label: item.label.trim(),
  }));
  const invalid = normalized.some(
    (item) => !item.value || item.value.length > 24 || !item.label || item.label.length > 80,
  );
  return invalid ? null : normalized;
}

export function InlineIndicatorsEditor() {
  const {
    bootstrap,
    isEditing,
    previewMode,
    isDevicePreviewFrame,
    fields,
    updateIndicatorsField,
  } = useInlineEditor();

  const indicatorsField = useMemo(
    () => fields.find((f) => f.kind === "indicators"),
    [fields],
  );

  const [portalHost, setPortalHost] = useState<HTMLElement | null>(null);
  const [localItems, setLocalItems] = useState<IndicatorItem[]>(
    () => indicatorsField?.value.map((item) => ({ ...item })) ?? [],
  );
  const [pageIndex, setPageIndex] = useState(0);

  const lastExternalJsonRef = useRef<string>("");
  const latestLocalRef = useRef<IndicatorItem[]>(localItems);
  const pendingFocusIdxRef = useRef<number | null>(null);
  const valueInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  latestLocalRef.current = localItems;

  const active =
    Boolean(indicatorsField) && isEditing && !previewMode && !isDevicePreviewFrame;

  // Sync from context only when external changes arrive (undo/redo/discard/restore)
  useEffect(() => {
    if (!indicatorsField || indicatorsField.kind !== "indicators") return;
    const serialized = JSON.stringify(indicatorsField.value);
    if (serialized !== lastExternalJsonRef.current) {
      lastExternalJsonRef.current = serialized;
      setLocalItems(indicatorsField.value.map((item) => ({ ...item })));
    }
  }, [indicatorsField]);

  // Clamp pageIndex when items are removed
  const totalPages = Math.max(1, Math.ceil(localItems.length / 4));
  useEffect(() => {
    if (pageIndex >= totalPages) {
      setPageIndex(Math.max(0, totalPages - 1));
    }
  }, [pageIndex, totalPages]);

  // Mount portal inside #heroBenefitsBar only while actively editing on desktop
  useEffect(() => {
    if (!active) {
      setPortalHost(null);
      return;
    }

    const container = document.querySelector<HTMLElement>("[data-ec-indicators-key]");
    if (!container) return;

    const host = document.createElement("div");
    host.className = "ec-ie-ind-portal ec-ie-ui";
    container.appendChild(host);
    container.dataset.ecPortalMounted = "true";
    setPortalHost(host);

    return () => {
      delete container.dataset.ecPortalMounted;
      const normalized = normalizeIndicators(latestLocalRef.current);
      if (normalized && JSON.stringify(normalized) !== lastExternalJsonRef.current && indicatorsField) {
        lastExternalJsonRef.current = JSON.stringify(normalized);
        updateIndicatorsField(indicatorsField.key, normalized);
      }
      const updater = (
        container as unknown as { __ecUpdateIndicators?: (items: IndicatorItem[]) => void }
      ).__ecUpdateIndicators;
      if (typeof updater === "function" && normalized) {
        updater(normalized);
      }
      host.remove();
      setPortalHost(null);
    };
    // Only re-create portal when active mode or page changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, bootstrap.pageId]);

  // Focus newly inserted indicator value input
  useEffect(() => {
    const focusIdx = pendingFocusIdxRef.current;
    if (focusIdx === null) return;
    const input = valueInputRefs.current[focusIdx];
    if (input) {
      pendingFocusIdxRef.current = null;
      input.focus();
      input.select();
    }
  }, [localItems, pageIndex]);

  if (!active || !portalHost || !indicatorsField || indicatorsField.kind !== "indicators") {
    return null;
  }

  const commitItems = (nextItems: IndicatorItem[]) => {
    const normalized = normalizeIndicators(nextItems);
    if (!normalized) return;
    const serialized = JSON.stringify(normalized);
    if (serialized === lastExternalJsonRef.current) return;
    lastExternalJsonRef.current = serialized;
    updateIndicatorsField(indicatorsField.key, normalized);
  };

  const handleFieldChange = (globalIdx: number, prop: "value" | "label", raw: string) => {
    const cleaned = sanitizeIndicatorText(raw);
    setLocalItems((prev) =>
      prev.map((item, idx) => (idx === globalIdx ? { ...item, [prop]: cleaned } : item)),
    );
  };

  const handleFieldBlur = (globalIdx: number, prop: "value" | "label") => {
    const item = latestLocalRef.current[globalIdx];
    if (!item) return;
    const fallback = indicatorsField.value[globalIdx]?.[prop] ?? (prop === "value" ? "+10" : "indicador");
    const fixedItems = latestLocalRef.current.map((entry, idx) => {
      if (idx !== globalIdx) return entry;
      const trimmedVal = entry.value.trim() || (prop === "value" ? fallback : entry.value);
      const trimmedLbl = entry.label.trim() || (prop === "label" ? fallback : entry.label);
      return { value: trimmedVal, label: trimmedLbl };
    });
    setLocalItems(fixedItems);
    commitItems(fixedItems);
  };

  const handleRemoveAt = (globalIdx: number) => {
    if (localItems.length <= 1) return;
    const next = localItems.filter((_, idx) => idx !== globalIdx);
    setLocalItems(next);
    commitItems(next);
  };

  const handleInsertAt = (insertIdx: number) => {
    if (localItems.length >= 24) return;
    const next = [
      ...localItems.slice(0, insertIdx),
      { value: "+10", label: "novo indicador" },
      ...localItems.slice(insertIdx),
    ];
    setLocalItems(next);
    commitItems(next);
    pendingFocusIdxRef.current = insertIdx;
    setPageIndex(Math.floor(insertIdx / 4));
  };

  const handleMove = (globalIdx: number, delta: -1 | 1) => {
    const target = globalIdx + delta;
    if (target < 0 || target >= localItems.length) return;
    const next = [...localItems];
    [next[globalIdx], next[target]] = [next[target], next[globalIdx]];
    setLocalItems(next);
    commitItems(next);
    setPageIndex(Math.floor(target / 4));
  };

  const pageStart = pageIndex * 4;
  const pageItems = localItems.slice(pageStart, pageStart + 4);
  const bgColor = GROUP_COLORS[pageIndex % GROUP_COLORS.length];
  const canAddMore = localItems.length < 24;

  return createPortal(
    <div
      className="ec-ie-ind-bar"
      style={{ backgroundColor: bgColor }}
      role="region"
      aria-label="Edição inline de indicadores"
    >
      <button
        type="button"
        className="ec-ie-ind-nav is-prev"
        aria-label="Grupo anterior de indicadores"
        disabled={totalPages <= 1}
        onClick={() => setPageIndex((prev) => (prev - 1 + totalPages) % totalPages)}
      >
        <ChevronLeft size={16} />
      </button>

      <div className="ec-ie-ind-track">
        {canAddMore ? (
          <div className="ec-ie-ind-gap">
            <button
              type="button"
              className="ec-ie-ind-add-btn"
              title="Adicionar novo indicador aqui"
              aria-label="Adicionar novo indicador no início"
              onClick={() => handleInsertAt(pageStart)}
            >
              <Plus size={14} />
            </button>
          </div>
        ) : null}

        {pageItems.map((item, localIdx) => {
          const globalIdx = pageStart + localIdx;
          const isLastOnPage = localIdx === pageItems.length - 1;
          return (
            <React.Fragment key={`ind-slot-${globalIdx}`}>
              <div className="ec-ie-ind-card">
                <div className="ec-ie-ind-actions" role="toolbar" aria-label={`Ações do indicador ${globalIdx + 1}`}>
                  <button
                    type="button"
                    className="ec-ie-ind-act-btn"
                    disabled={globalIdx === 0}
                    title="Mover para esquerda"
                    aria-label="Mover indicador para esquerda"
                    onClick={() => handleMove(globalIdx, -1)}
                  >
                    <ChevronLeft size={12} />
                  </button>
                  <button
                    type="button"
                    className="ec-ie-ind-act-btn"
                    disabled={globalIdx === localItems.length - 1}
                    title="Mover para direita"
                    aria-label="Mover indicador para direita"
                    onClick={() => handleMove(globalIdx, 1)}
                  >
                    <ChevronRight size={12} />
                  </button>
                  {localItems.length > 1 ? (
                    <button
                      type="button"
                      className="ec-ie-ind-del"
                      title="Apagar este indicador"
                      aria-label="Apagar indicador"
                      onClick={() => handleRemoveAt(globalIdx)}
                    >
                      <Trash2 size={12} />
                    </button>
                  ) : null}
                </div>

                <input
                  ref={(el) => {
                    valueInputRefs.current[globalIdx] = el;
                  }}
                  type="text"
                  className="ec-ie-ind-val-input"
                  value={item.value}
                  maxLength={24}
                  aria-label={`Valor do indicador ${globalIdx + 1}`}
                  placeholder="+10"
                  onChange={(e) => handleFieldChange(globalIdx, "value", e.target.value)}
                  onBlur={() => handleFieldBlur(globalIdx, "value")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      e.currentTarget.blur();
                    }
                  }}
                />

                <input
                  type="text"
                  className="ec-ie-ind-lbl-input"
                  value={item.label}
                  maxLength={80}
                  aria-label={`Descrição do indicador ${globalIdx + 1}`}
                  placeholder="descrição"
                  onChange={(e) => handleFieldChange(globalIdx, "label", e.target.value)}
                  onBlur={() => handleFieldBlur(globalIdx, "label")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      e.currentTarget.blur();
                    }
                  }}
                />
              </div>

              {canAddMore ? (
                <div className={`ec-ie-ind-gap ${!isLastOnPage ? "has-divider" : ""}`}>
                  <button
                    type="button"
                    className="ec-ie-ind-add-btn"
                    title="Adicionar novo indicador aqui"
                    aria-label={`Adicionar novo indicador após o item ${globalIdx + 1}`}
                    onClick={() => handleInsertAt(globalIdx + 1)}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              ) : !isLastOnPage ? (
                <div className="ec-ie-ind-gap has-divider" aria-hidden="true" />
              ) : null}
            </React.Fragment>
          );
        })}
      </div>

      <button
        type="button"
        className="ec-ie-ind-nav is-next"
        aria-label="Próximo grupo de indicadores"
        disabled={totalPages <= 1}
        onClick={() => setPageIndex((prev) => (prev + 1) % totalPages)}
      >
        <ChevronRight size={16} />
      </button>

      {totalPages > 1 ? (
        <div className="ec-ie-ind-dots" role="tablist" aria-label="Grupos de indicadores">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={`ind-dot-${idx}`}
              type="button"
              className={`ec-ie-ind-dot ${idx === pageIndex ? "is-active" : ""}`}
              aria-label={`Grupo ${idx + 1}`}
              onClick={() => setPageIndex(idx)}
            />
          ))}
        </div>
      ) : null}
    </div>,
    portalHost,
  );
}
