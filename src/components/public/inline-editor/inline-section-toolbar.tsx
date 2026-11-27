"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Layers } from "lucide-react";

import { useInlineEditor } from "./inline-editor-context";

type HoveredSectionState = {
  parentKey: string;
  sectionSelector: string;
  label: string;
  index: number;
  total: number;
  rect: DOMRect;
};

export function InlineSectionToolbar() {
  const { bootstrap, isEditing, previewMode, isDevicePreviewFrame, fieldsByKey, moveSection } =
    useInlineEditor();

  const active = isEditing && !previewMode && !isDevicePreviewFrame && bootstrap.canEditMedia;
  const [hoveredSection, setHoveredSection] = useState<HoveredSectionState | null>(null);
  const sectionElRef = useRef<HTMLElement | null>(null);

  const syncSectionRect = useCallback(() => {
    const secEl = sectionElRef.current;
    if (!secEl || !secEl.isConnected) {
      sectionElRef.current = null;
      setHoveredSection(null);
      return;
    }
    const parentEl = secEl.closest("[data-ec-section-parent]") as HTMLElement | null;
    const parentKey = parentEl?.getAttribute("data-ec-section-parent") ?? "";
    const sectionSelector = secEl.getAttribute("data-ec-section-item") ?? "";
    const field = fieldsByKey.get(parentKey);
    if (!field || field.kind !== "sectionOrder" || !sectionSelector) {
      setHoveredSection(null);
      return;
    }
    const index = field.value.indexOf(sectionSelector);
    if (index === -1) {
      setHoveredSection(null);
      return;
    }
    const rect = secEl.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
      setHoveredSection(null);
      return;
    }
    const rawLabel = secEl.getAttribute("data-ec-section-label") || "Seção";
    const label = rawLabel.length > 30 ? `${rawLabel.slice(0, 29)}…` : rawLabel;

    setHoveredSection({
      parentKey,
      sectionSelector,
      label,
      index,
      total: field.value.length,
      rect,
    });
  }, [fieldsByKey]);

  useEffect(() => {
    if (!active) {
      sectionElRef.current = null;
      setHoveredSection(null);
      return;
    }

    const handleMouseOver = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      if (event.target.closest(".ec-ie-section-bar")) return;
      if (event.target.closest(".ec-ie-ui")) return;

      const secEl = event.target.closest(
        "[data-ec-section-parent] > [data-ec-section-item]",
      ) as HTMLElement | null;
      if (secEl === sectionElRef.current) return;
      sectionElRef.current = secEl;
      syncSectionRect();
    };

    const handleScrollOrResize = () => syncSectionRect();

    document.addEventListener("mouseover", handleMouseOver, true);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      document.removeEventListener("mouseover", handleMouseOver, true);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [active, syncSectionRect]);

  if (!active || !hoveredSection || hoveredSection.total <= 1) return null;

  const barTop = Math.max(52, Math.min(hoveredSection.rect.top + 8, window.innerHeight - 46));
  const barLeft = Math.max(
    12,
    Math.min(hoveredSection.rect.left + hoveredSection.rect.width / 2, window.innerWidth - 180),
  );

  const handleMove = (direction: "up" | "down") => {
    const movedSelector = hoveredSection.sectionSelector;
    moveSection(hoveredSection.parentKey, movedSelector, direction);
    window.requestAnimationFrame(() => {
      const movedEl = document.querySelector<HTMLElement>(
        `[data-ec-section-item="${CSS.escape(movedSelector)}"]`,
      );
      movedEl?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      sectionElRef.current = movedEl;
      syncSectionRect();
    });
  };

  return (
    <div
      aria-label={`Ordem da seção ${hoveredSection.label}`}
      className="ec-ie-section-bar ec-ie-ui"
      role="toolbar"
      style={{
        top: `${barTop}px`,
        left: `${barLeft}px`,
      }}
    >
      <span className="ec-ie-section-tag">
        <Layers size={11} color="#38bdf8" />
        <span>
          Seção {hoveredSection.index + 1}/{hoveredSection.total} · {hoveredSection.label}
        </span>
      </span>

      <button
        aria-label="Mover seção para cima"
        className="ec-ie-card-tool-btn"
        disabled={hoveredSection.index === 0}
        onClick={() => handleMove("up")}
        title="Subir seção"
        type="button"
      >
        <ArrowUp size={13} />
      </button>

      <button
        aria-label="Mover seção para baixo"
        className="ec-ie-card-tool-btn"
        disabled={hoveredSection.index === hoveredSection.total - 1}
        onClick={() => handleMove("down")}
        title="Descer seção"
        type="button"
      >
        <ArrowDown size={13} />
      </button>
    </div>
  );
}
