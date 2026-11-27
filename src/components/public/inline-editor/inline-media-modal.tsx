"use client";

import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  Check,
  Image as ImageIcon,
  Layers,
  RotateCcw,
  Search,
  UploadCloud,
  X,
} from "lucide-react";

import { useInlineEditor } from "./inline-editor-context";
import { previewImageSrc } from "./inline-editor-dom";

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

export function InlineMediaModal() {
  const {
    fields,
    mediaModalState,
    closeMediaModal,
    updateImageField,
    updateBackgroundField,
    updateHomeSolutionCard,
    updateCardListField,
  } = useInlineEditor();
  const [activeTab, setActiveTab] = useState<"upload" | "library">("upload");
  const [mediaList, setMediaList] = useState<MediaLibraryRecord[]>([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedUrl, setSelectedUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputId = useId();

  const fetchMediaLibrary = useCallback(async () => {
    setLoadingLibrary(true);
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
      // Keep existing list on network error
    } finally {
      setLoadingLibrary(false);
    }
  }, []);

  useEffect(() => {
    if (!mediaModalState.isOpen) return;
    setSelectedUrl(mediaModalState.currentValue ?? "");
    setAltText(mediaModalState.altText ?? "");
    setErrorMsg(null);
    setSearch("");
    void fetchMediaLibrary();
  }, [
    fetchMediaLibrary,
    mediaModalState.altText,
    mediaModalState.currentValue,
    mediaModalState.isOpen,
  ]);

  const uploadFile = useCallback(
    async (file: File) => {
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
        formData.append("file", file);
        if (altText.trim()) {
          formData.append("altText", altText.trim().slice(0, 500));
        }
        const response = await fetch("/api/admin/media", {
          method: "POST",
          body: formData,
        });
        const json = await response.json().catch(() => null);
        if (!response.ok || !json?.media?.url) {
          throw new Error(json?.error || "Não foi possível enviar a imagem.");
        }

        const created = json.media as MediaLibraryRecord;
        setMediaList((prev) => [created, ...prev]);
        setSelectedUrl(created.url);
        if (!altText && created.altText) setAltText(created.altText);
        setActiveTab("library");
      } catch (error) {
        setErrorMsg(error instanceof Error ? error.message : "Erro ao enviar imagem.");
      } finally {
        setIsUploading(false);
      }
    },
    [altText],
  );

  // Support Ctrl+V image paste and Escape key inside modal
  useEffect(() => {
    if (!mediaModalState.isOpen) return;
    const onPaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) {
            void uploadFile(file);
            break;
          }
        }
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMediaModal();
    };
    window.addEventListener("paste", onPaste);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("paste", onPaste);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [closeMediaModal, mediaModalState.isOpen, uploadFile]);

  if (!mediaModalState.isOpen || !mediaModalState.fieldKey) return null;

  const isImageField = mediaModalState.kind !== "backgroundImage";
  const filteredMedia = mediaList.filter((item) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      item.originalName.toLowerCase().includes(q) ||
      item.altText.toLowerCase().includes(q) ||
      item.url.toLowerCase().includes(q)
    );
  });

  const handleApply = () => {
    if (!mediaModalState.fieldKey || !selectedUrl) return;
    if (mediaModalState.kind === "homeSolutionImage" && mediaModalState.solutionRoutePath) {
      updateHomeSolutionCard(mediaModalState.solutionRoutePath, (item) => ({
        ...item,
        image: selectedUrl,
        imageAlt: altText.slice(0, 255) || item.title,
      }));
    } else if (
      mediaModalState.kind === "cardListImage" &&
      mediaModalState.cardListItemIndex !== undefined
    ) {
      const cardField = fields.find(
        (f) => f.key === mediaModalState.fieldKey && f.kind === "cardList",
      );
      if (cardField?.kind === "cardList") {
        const targetIdx = mediaModalState.cardListItemIndex;
        const nextItems = cardField.value.map((item, idx) => {
          if (idx !== targetIdx || !item.image) return item;
          return {
            ...item,
            image: {
              ...item.image,
              src: selectedUrl,
              alt: altText.slice(0, 255) || item.image.alt,
            },
          };
        });
        updateCardListField(cardField.key, nextItems);
      }
    } else if (isImageField) {
      updateImageField(mediaModalState.fieldKey, selectedUrl, altText.slice(0, 255));
    } else {
      updateBackgroundField(mediaModalState.fieldKey, selectedUrl);
    }
    closeMediaModal();
  };

  const handleRestoreOriginal = () => {
    if (!mediaModalState.originalValue) return;
    setSelectedUrl(mediaModalState.originalValue);
  };

  return (
    <div className="ec-ie-backdrop" onClick={closeMediaModal}>
      <div
        aria-modal="true"
        className="ec-ie-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        <div className="ec-ie-modal-head">
          <div className="ec-ie-modal-title-wrap">
            <div className="ec-ie-modal-icon">
              <ImageIcon size={16} />
            </div>
            <div>
              <div className="ec-ie-modal-title">
                {isImageField ? "Selecionar ou Enviar Imagem" : "Imagem de Fundo da Seção"}
              </div>
              <div className="ec-ie-modal-sub">
                {mediaModalState.label || "Biblioteca de mídia do EndControl"}
              </div>
            </div>
          </div>

          <button
            aria-label="Fechar"
            className="ec-ie-icon-btn"
            onClick={closeMediaModal}
            type="button"
          >
            <X size={16} />
          </button>
        </div>

        <div className="ec-ie-tabs">
          <button
            className={`ec-ie-tab ${activeTab === "upload" ? "is-active" : ""}`}
            onClick={() => setActiveTab("upload")}
            type="button"
          >
            <UploadCloud size={14} />
            <span>Enviar Nova Imagem</span>
          </button>
          <button
            className={`ec-ie-tab ${activeTab === "library" ? "is-active" : ""}`}
            onClick={() => setActiveTab("library")}
            type="button"
          >
            <Layers size={14} />
            <span>Biblioteca ({mediaList.length})</span>
          </button>
        </div>

        <div className="ec-ie-modal-body">
          {selectedUrl ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 12px",
                borderRadius: "12px",
                border: "1px solid #27272a",
                background: "#14171c",
              }}
            >
              <img
                alt={altText || "Preview"}
                src={previewImageSrc(selectedUrl)}
                style={{
                  width: "76px",
                  height: "52px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  background: "#090b0e",
                  flexShrink: 0,
                }}
              />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: "11px", color: "#a1a1aa", marginBottom: "2px" }}>
                  Imagem selecionada
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#ffffff",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {selectedUrl}
                </div>
              </div>
              {mediaModalState.originalValue &&
              selectedUrl !== mediaModalState.originalValue ? (
                <button
                  className="ec-ie-btn-secondary"
                  onClick={handleRestoreOriginal}
                  title="Voltar para a imagem original do template"
                  type="button"
                >
                  <RotateCcw size={13} />
                  <span>Original</span>
                </button>
              ) : null}
            </div>
          ) : null}

          {activeTab === "upload" ? (
            <div>
              <input
                accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                hidden
                id={fileInputId}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void uploadFile(file);
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
                  if (file) void uploadFile(file);
                }}
              >
                <UploadCloud size={28} color="#38bdf8" />
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#ffffff" }}>
                  {isUploading
                    ? "Enviando imagem..."
                    : "Clique para escolher, arraste aqui ou cole com Ctrl+V"}
                </div>
                <div style={{ fontSize: "11.5px", color: "#a1a1aa" }}>
                  JPEG, PNG, WebP, GIF ou AVIF (máx. 10 MB) · Salvo direto na biblioteca do CMS
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ position: "relative" }}>
                <Search
                  size={14}
                  color="#71717a"
                  style={{ position: "absolute", left: "11px", top: "11px" }}
                />
                <input
                  className="ec-ie-input"
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por nome do arquivo ou texto alternativo..."
                  style={{ paddingLeft: "32px" }}
                  type="text"
                  value={search}
                />
              </div>

              {loadingLibrary && mediaList.length === 0 ? (
                <div style={{ padding: "24px", textAlign: "center", fontSize: "12px", color: "#a1a1aa" }}>
                  Carregando biblioteca de mídia...
                </div>
              ) : filteredMedia.length === 0 ? (
                <div style={{ padding: "24px", textAlign: "center", fontSize: "12px", color: "#a1a1aa" }}>
                  Nenhuma imagem encontrada. Envie uma imagem na aba anterior.
                </div>
              ) : (
                <div className="ec-ie-media-grid">
                  {filteredMedia.map((item) => {
                    const isSelected = selectedUrl === item.url;
                    return (
                      <button
                        className={`ec-ie-media-card ${isSelected ? "is-selected" : ""}`}
                        key={item.id}
                        onClick={() => {
                          setSelectedUrl(item.url);
                          if (isImageField && item.altText && !altText) {
                            setAltText(item.altText);
                          }
                        }}
                        type="button"
                      >
                        <img
                          alt={item.altText || item.originalName}
                          className="ec-ie-media-thumb"
                          src={item.url}
                        />
                        <span className="ec-ie-media-name" title={item.originalName}>
                          {item.originalName}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {isImageField ? (
            <div>
              <label className="ec-ie-field-label" htmlFor="ec-ie-alt-input">
                Texto Alternativo (Alt / SEO)
              </label>
              <input
                className="ec-ie-input"
                id="ec-ie-alt-input"
                maxLength={255}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Descreva a imagem para acessibilidade e SEO"
                type="text"
                value={altText}
              />
            </div>
          ) : null}

          {errorMsg ? <p className="ec-ie-error-text">{errorMsg}</p> : null}
        </div>

        <div className="ec-ie-modal-foot">
          <div style={{ fontSize: "11px", color: "#a1a1aa" }}>
            As alterações só vão ao ar quando você clicar em Publicar.
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button className="ec-ie-btn-secondary" onClick={closeMediaModal} type="button">
              Cancelar
            </button>
            <button
              className="ec-ie-btn-primary"
              disabled={!selectedUrl || isUploading}
              onClick={handleApply}
              type="button"
            >
              <Check size={14} />
              <span>Aplicar Imagem</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
