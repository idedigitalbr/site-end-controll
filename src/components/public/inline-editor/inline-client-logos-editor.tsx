"use client";

import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Layers,
  Plus,
  Search,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";

import type { ClientLogoItem } from "@/lib/cms/inline-editor-types";
import { useInlineEditor } from "./inline-editor-context";
import { previewImageSrc, stripControlChars } from "./inline-editor-dom";

type MediaLibraryRecord = {
  id: string;
  url: string;
  originalName: string;
  altText: string;
  mimeType?: string;
};

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const HOVER_INTENT_MS = 320;

export function InlineClientLogosEditor() {
  const {
    bootstrap,
    isEditing,
    previewMode,
    isDevicePreviewFrame,
    fields,
    updateClientLogosField,
  } = useInlineEditor();

  const logosField = useMemo(
    () => fields.find((f) => f.kind === "clientLogos"),
    [fields],
  );

  const [portalHost, setPortalHost] = useState<HTMLElement | null>(null);
  const [scrollX, setScrollX] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [openGapIdx, setOpenGapIdx] = useState<number | null>(null);
  const [pickerInsertIdx, setPickerInsertIdx] = useState<number | null>(null);

  const [newAlt, setNewAlt] = useState("");
  const [addMode, setAddMode] = useState<"upload" | "library">("upload");
  const [mediaList, setMediaList] = useState<MediaLibraryRecord[]>([]);
  const [search, setSearch] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const hoverTimerRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputId = useId();

  const active =
    Boolean(logosField) &&
    isEditing &&
    !previewMode &&
    !isDevicePreviewFrame;

  useEffect(() => {
    if (!active || !logosField || logosField.value.length === 0) {
      setPortalHost(null);
      setPickerInsertIdx(null);
      setOpenGapIdx(null);
      return;
    }

    const container =
      document.querySelector<HTMLElement>("[data-ec-clients-key]") ??
      document.querySelector<HTMLElement>("#clientes .logo-marquee");
    if (!container) return;

    const host = document.createElement("div");
    host.className = "ec-ie-logos-portal ec-ie-ui";
    container.appendChild(host);
    container.dataset.ecPortalMounted = "true";
    setPortalHost(host);

    return () => {
      delete container.dataset.ecPortalMounted;
      const refreshLogos = (
        container as unknown as { __ecRefreshClientLogos?: () => void }
      ).__ecRefreshClientLogos;
      if (typeof refreshLogos === "function") {
        refreshLogos();
      }
      host.remove();
      setPortalHost(null);
    };
  }, [active, bootstrap.pageId, Boolean(logosField && logosField.value.length > 0)]);

  const recalcBounds = useCallback(() => {
    const vp = viewportRef.current;
    const strip = stripRef.current;
    if (!vp || !strip) return;
    const nextMax = Math.max(0, strip.scrollWidth - vp.clientWidth);
    setMaxScroll(nextMax);
    setScrollX((prev) => Math.max(0, Math.min(prev, nextMax)));
  }, []);

  useEffect(() => {
    if (!active || !portalHost) return;
    const raf = window.requestAnimationFrame(recalcBounds);
    const timer = window.setTimeout(recalcBounds, 180);
    window.addEventListener("resize", recalcBounds);

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => recalcBounds());
      if (viewportRef.current) ro.observe(viewportRef.current);
      if (stripRef.current) ro.observe(stripRef.current);
    }

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      window.removeEventListener("resize", recalcBounds);
      ro?.disconnect();
    };
  }, [active, portalHost, logosField?.value, openGapIdx, recalcBounds]);

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current !== null) {
        window.clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

  const fetchMediaLibrary = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/media", { cache: "no-store" });
      const json = await response.json().catch(() => null);
      if (response.ok && Array.isArray(json?.media)) {
        setMediaList(
          (json.media as MediaLibraryRecord[]).filter(
            (item) => !item.mimeType || item.mimeType.startsWith("image/"),
          ),
        );
      }
    } catch {
      // Ignore transient error
    }
  }, []);

  const insertLogoAt = useCallback(
    (insertIdx: number, src: string, alt: string) => {
      if (!logosField || logosField.kind !== "clientLogos") return;
      if (logosField.value.length >= 40) {
        setErrorMsg("Limite máximo de 40 logos atingido.");
        return;
      }
      const nextAlt = stripControlChars(alt).trim().slice(0, 255);
      const next: ClientLogoItem[] = [
        ...logosField.value.slice(0, insertIdx),
        { src, alt: nextAlt },
        ...logosField.value.slice(insertIdx),
      ];
      updateClientLogosField(logosField.key, next);
      setPickerInsertIdx(null);
      setNewAlt("");
      setSearch("");
      setErrorMsg(null);
    },
    [logosField, updateClientLogosField],
  );

  const uploadNewLogoFile = useCallback(
    async (file: File) => {
      if (pickerInsertIdx === null) return;
      setErrorMsg(null);
      if (!ALLOWED_TYPES.has(file.type.toLowerCase())) {
        setErrorMsg("Formato inválido. Use JPEG, PNG, WebP, GIF ou AVIF.");
        return;
      }
      if (file.size > MAX_UPLOAD_BYTES) {
        setErrorMsg("A imagem deve ter no máximo 10 MB.");
        return;
      }

      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("scope", "client-logo");
        formData.append("file", file);
        const companyLabel = stripControlChars(newAlt).trim() || file.name.replace(/\.[^.]+$/, "");
        if (companyLabel) {
          formData.append("altText", `Logo ${companyLabel}`.slice(0, 500));
        }

        const response = await fetch("/api/admin/media", {
          method: "POST",
          body: formData,
        });
        const json = await response.json().catch(() => null);
        if (!response.ok || !json?.media?.url) {
          throw new Error(json?.error || "Não foi possível enviar o logo.");
        }

        const created = json.media as MediaLibraryRecord;
        setMediaList((prev) => [created, ...prev]);
        insertLogoAt(pickerInsertIdx, created.url, created.altText || `Logo ${companyLabel}`);
      } catch (error) {
        setErrorMsg(error instanceof Error ? error.message : "Erro ao enviar logo.");
      } finally {
        setIsUploading(false);
      }
    },
    [insertLogoAt, newAlt, pickerInsertIdx],
  );

  useEffect(() => {
    if (pickerInsertIdx === null) return;
    void fetchMediaLibrary();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPickerInsertIdx(null);
    };
    const onPaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) {
            void uploadNewLogoFile(file);
            break;
          }
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("paste", onPaste);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("paste", onPaste);
    };
  }, [fetchMediaLibrary, pickerInsertIdx, uploadNewLogoFile]);

  if (!active || !portalHost || !logosField || logosField.kind !== "clientLogos") {
    return null;
  }

  const logos = logosField.value;
  const canAddMore = logos.length < 40;

  const moveLogo = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= logos.length) return;
    const next = [...logos];
    [next[index], next[target]] = [next[target], next[index]];
    updateClientLogosField(logosField.key, next);
  };

  const removeLogo = (index: number) => {
    if (logos.length <= 1) return;
    const next = logos.filter((_, i) => i !== index);
    updateClientLogosField(logosField.key, next);
  };

  const handleGapEnter = (gapIdx: number) => {
    if (!canAddMore) return;
    if (hoverTimerRef.current !== null) {
      window.clearTimeout(hoverTimerRef.current);
    }
    hoverTimerRef.current = window.setTimeout(() => {
      setOpenGapIdx(gapIdx);
      hoverTimerRef.current = null;
    }, HOVER_INTENT_MS);
  };

  const handleGapLeave = (gapIdx: number) => {
    if (hoverTimerRef.current !== null) {
      window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setOpenGapIdx((prev) => (prev === gapIdx ? null : prev));
  };

  const openInsertPicker = (insertIdx: number) => {
    setNewAlt("");
    setSearch("");
    setErrorMsg(null);
    setAddMode("upload");
    setOpenGapIdx(null);
    setPickerInsertIdx(insertIdx);
  };

  const filteredMedia = mediaList.filter((item) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      item.originalName.toLowerCase().includes(q) ||
      item.altText.toLowerCase().includes(q)
    );
  });

  const panBy = (delta: number) => {
    const vp = viewportRef.current;
    const strip = stripRef.current;
    const liveMax =
      vp && strip ? Math.max(0, strip.scrollWidth - vp.clientWidth) : maxScroll;
    const effectiveMax = Math.max(liveMax, maxScroll);
    if (effectiveMax !== maxScroll) {
      setMaxScroll(effectiveMax);
    }
    setScrollX((prev) => Math.max(0, Math.min(prev + delta, effectiveMax)));
  };

  return (
    <>
      {createPortal(
        <>
          <button
            type="button"
            className="ec-ie-logos-arrow is-prev"
            aria-label="Ver logos anteriores"
            disabled={scrollX <= 2}
            onClick={() => panBy(-280)}
          >
            <ChevronLeft size={16} />
          </button>

          <div
            ref={viewportRef}
            className="ec-ie-logos-viewport"
            onWheel={(e) => {
              if (Math.abs(e.deltaX) > 2 || e.shiftKey) {
                e.preventDefault();
                panBy(e.deltaX !== 0 ? e.deltaX : e.deltaY);
              }
            }}
          >
            <div
              ref={stripRef}
              className="ec-ie-logos-strip"
              style={{ transform: `translate3d(-${scrollX}px, 0, 0)` }}
            >
              {canAddMore ? (
                <div
                  className={`ec-ie-logo-gap ${openGapIdx === 0 ? "is-open" : ""}`}
                  onMouseEnter={() => handleGapEnter(0)}
                  onMouseLeave={() => handleGapLeave(0)}
                >
                  <button
                    type="button"
                    className="ec-ie-logo-add-btn"
                    title="Adicionar nova logo aqui"
                    aria-label="Adicionar nova logo no início"
                    onClick={() => openInsertPicker(0)}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              ) : null}

              {logos.map((logo, idx) => (
                <React.Fragment key={`logo-inline-${logo.src}-${idx}`}>
                  <div className="ec-ie-logo-card">
                    <div className="ec-ie-logo-actions" role="toolbar" aria-label={`Ações do logo ${idx + 1}`}>
                      <button
                        type="button"
                        className="ec-ie-logo-act-btn"
                        disabled={idx === 0}
                        title="Mover para esquerda"
                        aria-label="Mover logo para esquerda"
                        onClick={() => moveLogo(idx, -1)}
                      >
                        <ChevronLeft size={13} />
                      </button>
                      <button
                        type="button"
                        className="ec-ie-logo-act-btn"
                        disabled={idx === logos.length - 1}
                        title="Mover para direita"
                        aria-label="Mover logo para direita"
                        onClick={() => moveLogo(idx, 1)}
                      >
                        <ChevronRight size={13} />
                      </button>
                      <button
                        type="button"
                        className="ec-ie-logo-act-btn is-danger"
                        disabled={logos.length <= 1}
                        title="Remover logo"
                        aria-label="Remover logo"
                        onClick={() => removeLogo(idx)}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    <img
                      src={previewImageSrc(logo.src)}
                      alt={logo.alt || `Logo ${idx + 1}`}
                      loading="eager"
                      onLoad={recalcBounds}
                    />
                  </div>

                  {canAddMore ? (
                    <div
                      className={`ec-ie-logo-gap ${openGapIdx === idx + 1 ? "is-open" : ""}`}
                      onMouseEnter={() => handleGapEnter(idx + 1)}
                      onMouseLeave={() => handleGapLeave(idx + 1)}
                    >
                      <button
                        type="button"
                        className="ec-ie-logo-add-btn"
                        title="Adicionar nova logo aqui"
                        aria-label={`Adicionar nova logo após posição ${idx + 1}`}
                        onClick={() => openInsertPicker(idx + 1)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  ) : null}
                </React.Fragment>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="ec-ie-logos-arrow is-next"
            aria-label="Ver próximos logos"
            disabled={scrollX >= maxScroll - 2}
            onClick={() => panBy(280)}
          >
            <ChevronRight size={16} />
          </button>
        </>,
        portalHost,
      )}

      {pickerInsertIdx !== null ? (
        <div className="ec-ie-backdrop" onClick={() => setPickerInsertIdx(null)}>
          <div
            aria-modal="true"
            className="ec-ie-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            style={{ maxWidth: "620px" }}
          >
            <div className="ec-ie-modal-head">
              <div className="ec-ie-modal-title-wrap">
                <div className="ec-ie-modal-icon">
                  <Building2 size={16} />
                </div>
                <div>
                  <div className="ec-ie-modal-title">Adicionar Nova Logo de Cliente</div>
                  <div className="ec-ie-modal-sub">
                    Será inserida diretamente na posição selecionada ({pickerInsertIdx + 1}º lugar).
                  </div>
                </div>
              </div>

              <button
                aria-label="Fechar"
                className="ec-ie-icon-btn"
                onClick={() => setPickerInsertIdx(null)}
                type="button"
              >
                <X size={16} />
              </button>
            </div>

            <div className="ec-ie-tabs">
              <button
                className={`ec-ie-tab ${addMode === "upload" ? "is-active" : ""}`}
                onClick={() => setAddMode("upload")}
                type="button"
              >
                <UploadCloud size={14} />
                <span>Enviar Arquivo</span>
              </button>
              <button
                className={`ec-ie-tab ${addMode === "library" ? "is-active" : ""}`}
                onClick={() => setAddMode("library")}
                type="button"
              >
                <Layers size={14} />
                <span>Biblioteca ({mediaList.length})</span>
              </button>
            </div>

            <div className="ec-ie-modal-body">
              <div>
                <label className="ec-ie-field-label" htmlFor="ec-ie-new-client-alt">
                  Nome da empresa (opcional)
                </label>
                <input
                  className="ec-ie-input"
                  id="ec-ie-new-client-alt"
                  maxLength={200}
                  onChange={(e) => setNewAlt(e.target.value)}
                  placeholder="Ex: Logo Petrobras"
                  type="text"
                  value={newAlt}
                />
              </div>

              {addMode === "upload" ? (
                <div>
                  <input
                    accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                    hidden
                    id={fileInputId}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void uploadNewLogoFile(file);
                      e.target.value = "";
                    }}
                    ref={fileInputRef}
                    type="file"
                  />
                  <div
                    className={`ec-ie-dropzone ${isDragging ? "is-dragging" : ""}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragLeave={() => setIsDragging(false)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) void uploadNewLogoFile(file);
                    }}
                  >
                    <Plus size={22} color="#38bdf8" />
                    <div style={{ fontSize: "12.5px", fontWeight: 700, color: "#ffffff" }}>
                      {isUploading
                        ? "Enviando e inserindo logo..."
                        : "Clique, arraste ou cole (Ctrl+V) a logo do cliente"}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ position: "relative" }}>
                    <Search
                      size={14}
                      color="#71717a"
                      style={{ position: "absolute", left: "11px", top: "11px" }}
                    />
                    <input
                      className="ec-ie-input"
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Buscar imagem na biblioteca..."
                      style={{ paddingLeft: "32px" }}
                      type="text"
                      value={search}
                    />
                  </div>
                  <div className="ec-ie-media-grid" style={{ maxHeight: "230px", overflowY: "auto" }}>
                    {filteredMedia.map((item) => (
                      <button
                        className="ec-ie-media-card"
                        key={item.id}
                        onClick={() =>
                          insertLogoAt(
                            pickerInsertIdx,
                            item.url,
                            newAlt.trim() || item.altText || item.originalName,
                          )
                        }
                        title="Clique para inserir este logo nesta posição"
                        type="button"
                      >
                        <img
                          alt={item.altText || item.originalName}
                          className="ec-ie-media-thumb"
                          src={item.url}
                        />
                        <span className="ec-ie-media-name">+ {item.originalName}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {errorMsg ? <p className="ec-ie-error-text">{errorMsg}</p> : null}
            </div>

            <div className="ec-ie-modal-foot">
              <div style={{ fontSize: "11px", color: "#a1a1aa" }}>
                Apenas inserção: não substitui logos existentes.
              </div>
              <button
                className="ec-ie-btn-secondary"
                onClick={() => setPickerInsertIdx(null)}
                type="button"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
