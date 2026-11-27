"use client";

import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Film,
  Image as ImageIcon,
  Layers,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";

import type { DirectorCardItem } from "@/lib/cms/inline-editor-types";
import { useInlineEditor } from "./inline-editor-context";
import { previewImageSrc, stripControlChars } from "./inline-editor-dom";

type MediaLibraryRecord = {
  id: string;
  url: string;
  originalName: string;
  altText: string;
  mimeType?: string;
};

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);
const ALLOWED_VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

function sanitizeCardText(raw: string): string {
  return stripControlChars(raw).replace(/[<>]/g, "");
}

function formatVideoDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "";
  const total = Math.round(seconds);
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function detectVideoDuration(src: string): Promise<string> {
  return new Promise((resolve) => {
    if (typeof document === "undefined" || !src) {
      resolve("");
      return;
    }
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    const cleanup = () => {
      video.removeAttribute("src");
      video.load();
    };
    const timer = window.setTimeout(() => {
      cleanup();
      resolve("");
    }, 4500);
    video.onloadedmetadata = () => {
      window.clearTimeout(timer);
      const formatted = formatVideoDuration(video.duration);
      cleanup();
      resolve(formatted);
    };
    video.onerror = () => {
      window.clearTimeout(timer);
      cleanup();
      resolve("");
    };
    video.src = previewImageSrc(src);
  });
}

export function InlineDirectorCardsEditor() {
  const {
    bootstrap,
    isEditing,
    previewMode,
    isDevicePreviewFrame,
    fields,
    updateDirectorCardsField,
  } = useInlineEditor();

  const directorsField = useMemo(
    () => fields.find((f) => f.kind === "directorCards"),
    [fields],
  );

  const [portalHost, setPortalHost] = useState<HTMLElement | null>(null);
  const [localCards, setLocalCards] = useState<DirectorCardItem[]>(
    () => directorsField?.value.map((item) => ({ ...item })) ?? [],
  );
  const lastExternalJsonRef = useRef<string>("");
  const latestLocalRef = useRef<DirectorCardItem[]>(localCards);
  latestLocalRef.current = localCards;

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [editingTarget, setEditingTarget] = useState<number | "new" | null>(null);

  // Modal state
  const [draftType, setDraftType] = useState<"video" | "image">("video");
  const [draftSrc, setDraftSrc] = useState("");
  const [draftPoster, setDraftPoster] = useState("");
  const [draftName, setDraftName] = useState("");
  const [draftRole, setDraftRole] = useState("");
  const [draftDuration, setDraftDuration] = useState("");
  const [mediaTab, setMediaTab] = useState<"upload" | "library">("upload");
  const [posterPickerOpen, setPosterPickerOpen] = useState(false);

  const [mediaList, setMediaList] = useState<MediaLibraryRecord[]>([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [search, setSearch] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingPoster, setIsUploadingPoster] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mainFileInputRef = useRef<HTMLInputElement | null>(null);
  const posterFileInputRef = useRef<HTMLInputElement | null>(null);
  const mainFileInputId = useId();
  const posterFileInputId = useId();

  const active =
    Boolean(directorsField) && isEditing && !previewMode && !isDevicePreviewFrame;

  // Sync local card drafts when context updates externally (undo/redo/discard/restore)
  useEffect(() => {
    if (!directorsField || directorsField.kind !== "directorCards") return;
    const serialized = JSON.stringify(directorsField.value);
    if (serialized !== lastExternalJsonRef.current) {
      lastExternalJsonRef.current = serialized;
      setLocalCards(directorsField.value.map((item) => ({ ...item })));
    }
  }, [directorsField]);

  // Mount portal inside #sobre-2 .about-media-dual-videos while editing on desktop
  useEffect(() => {
    if (!active || !directorsField || directorsField.value.length === 0) {
      setPortalHost(null);
      setEditingTarget(null);
      return;
    }

    const container =
      document.querySelector<HTMLElement>("[data-ec-directors-key]") ??
      document.querySelector<HTMLElement>("#sobre-2 .about-media-dual-videos");
    if (!container) return;

    const host = document.createElement("div");
    host.className = "ec-ie-directors-portal ec-ie-ui";
    container.appendChild(host);
    container.dataset.ecPortalMounted = "true";
    setPortalHost(host);

    return () => {
      delete container.dataset.ecPortalMounted;
      host.remove();
      setPortalHost(null);
      const refreshDirectors = (
        container as unknown as { __ecRefreshDirectorCards?: () => void }
      ).__ecRefreshDirectorCards;
      if (typeof refreshDirectors === "function") {
        refreshDirectors();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, bootstrap.pageId, Boolean(directorsField && directorsField.value.length > 0)]);

  const fetchMediaLibrary = useCallback(async () => {
    setLoadingLibrary(true);
    try {
      const response = await fetch("/api/admin/media", { cache: "no-store" });
      const json = await response.json().catch(() => null);
      if (response.ok && Array.isArray(json?.media)) {
        setMediaList(json.media as MediaLibraryRecord[]);
      }
    } catch {
      // Ignore transient error
    } finally {
      setLoadingLibrary(false);
    }
  }, []);

  const commitCards = useCallback(
    (nextCards: DirectorCardItem[]) => {
      if (!directorsField || directorsField.kind !== "directorCards") return;
      if (nextCards.length < 1 || nextCards.length > 8) return;
      const sanitized = nextCards.map((card) => {
        const name = sanitizeCardText(card.name).trim().slice(0, 80);
        const role = sanitizeCardText(card.role).trim().slice(0, 100);
        if (card.mediaType === "video") {
          const duration = card.duration
            ? sanitizeCardText(card.duration).trim().slice(0, 16)
            : "";
          return {
            mediaType: "video" as const,
            src: card.src.trim(),
            ...(card.poster?.trim() ? { poster: card.poster.trim() } : {}),
            name: name || "Diretoria",
            role,
            ...(duration ? { duration } : {}),
          };
        }
        return {
          mediaType: "image" as const,
          src: card.src.trim(),
          name: name || "Diretoria",
          role,
        };
      });
      const serialized = JSON.stringify(sanitized);
      if (serialized === lastExternalJsonRef.current) return;
      lastExternalJsonRef.current = serialized;
      setLocalCards(sanitized);
      updateDirectorCardsField(directorsField.key, sanitized);
    },
    [directorsField, updateDirectorCardsField],
  );

  const openModalFor = useCallback(
    (target: number | "new") => {
      if (!directorsField || directorsField.kind !== "directorCards") return;
      setErrorMsg(null);
      setSearch("");
      setPosterPickerOpen(false);
      setMediaTab("upload");

      if (target === "new") {
        setDraftType("video");
        setDraftSrc("");
        setDraftPoster("");
        setDraftName("");
        setDraftRole("");
        setDraftDuration("");
      } else {
        const card = localCards[target];
        if (!card) return;
        setDraftType(card.mediaType);
        setDraftSrc(card.src);
        setDraftPoster(card.poster ?? "");
        setDraftName(card.name);
        setDraftRole(card.role);
        setDraftDuration(card.duration ?? "");
      }
      setEditingTarget(target);
      void fetchMediaLibrary();
    },
    [directorsField, fetchMediaLibrary, localCards],
  );

  const uploadMainMedia = useCallback(
    async (file: File) => {
      setErrorMsg(null);
      if (draftType === "video") {
        if (!ALLOWED_VIDEO_TYPES.has(file.type.toLowerCase())) {
          setErrorMsg("Formato inválido. Use MP4, WebM ou MOV.");
          return;
        }
        if (file.size > MAX_VIDEO_BYTES) {
          setErrorMsg("O vídeo deve ter no máximo 50 MB.");
          return;
        }
      } else {
        if (!ALLOWED_IMAGE_TYPES.has(file.type.toLowerCase())) {
          setErrorMsg("Formato inválido. Use JPEG, PNG, WebP, GIF ou AVIF.");
          return;
        }
        if (file.size > MAX_IMAGE_BYTES) {
          setErrorMsg("A imagem deve ter no máximo 10 MB.");
          return;
        }
      }

      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("scope", "director-media");
        formData.append("file", file);
        const label = sanitizeCardText(draftName).trim() || file.name.replace(/\.[^.]+$/, "");
        if (label) {
          formData.append("altText", label.slice(0, 500));
        }

        const endpoint =
          draftType === "video" ? "/api/admin/media?type=video" : "/api/admin/media";
        const response = await fetch(endpoint, { method: "POST", body: formData });
        const json = await response.json().catch(() => null);
        if (!response.ok || !json?.media?.url) {
          throw new Error(json?.error || "Não foi possível enviar o arquivo.");
        }

        const created = json.media as MediaLibraryRecord;
        setMediaList((prev) => [created, ...prev]);
        setDraftSrc(created.url);
        if (draftType === "video") {
          const detected = await detectVideoDuration(created.url);
          if (detected) setDraftDuration(detected);
        }
      } catch (error) {
        setErrorMsg(error instanceof Error ? error.message : "Erro ao enviar mídia.");
      } finally {
        setIsUploading(false);
      }
    },
    [draftName, draftType],
  );

  const uploadPosterImage = useCallback(
    async (file: File) => {
      setErrorMsg(null);
      if (!ALLOWED_IMAGE_TYPES.has(file.type.toLowerCase())) {
        setErrorMsg("Capa inválida. Use JPEG, PNG, WebP, GIF ou AVIF.");
        return;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        setErrorMsg("A imagem de capa deve ter no máximo 10 MB.");
        return;
      }

      setIsUploadingPoster(true);
      try {
        const formData = new FormData();
        formData.append("scope", "director-media");
        formData.append("file", file);
        const label = sanitizeCardText(draftName).trim();
        if (label) {
          formData.append("altText", `Capa ${label}`.slice(0, 500));
        }
        const response = await fetch("/api/admin/media", { method: "POST", body: formData });
        const json = await response.json().catch(() => null);
        if (!response.ok || !json?.media?.url) {
          throw new Error(json?.error || "Não foi possível enviar a capa.");
        }
        const created = json.media as MediaLibraryRecord;
        setMediaList((prev) => [created, ...prev]);
        setDraftPoster(created.url);
        setPosterPickerOpen(false);
      } catch (error) {
        setErrorMsg(error instanceof Error ? error.message : "Erro ao enviar capa.");
      } finally {
        setIsUploadingPoster(false);
      }
    },
    [draftName],
  );

  // Modal Escape and Ctrl+V image paste support
  useEffect(() => {
    if (editingTarget === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setEditingTarget(null);
    };
    const onPaste = (event: ClipboardEvent) => {
      if (draftType !== "image") return;
      const items = event.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) {
            void uploadMainMedia(file);
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
  }, [draftType, editingTarget, uploadMainMedia]);

  if (!active || !portalHost || !directorsField || directorsField.kind !== "directorCards") {
    return null;
  }

  const canAddMore = localCards.length < 8;

  const originalVideos = directorsField.originalValue.filter((c) => c.mediaType === "video");
  const originalImages = Array.from(
    new Set(
      directorsField.originalValue.flatMap((c) => {
        const urls: { url: string; label: string }[] = [];
        if (c.mediaType === "image" && c.src) urls.push({ url: c.src, label: c.name });
        if (c.poster) urls.push({ url: c.poster, label: `Capa · ${c.name}` });
        return urls;
      }),
    ),
  );

  const uploadedVideos = mediaList.filter((m) => m.mimeType?.startsWith("video/"));
  const uploadedImages = mediaList.filter(
    (m) => !m.mimeType || m.mimeType.startsWith("image/"),
  );

  const q = search.trim().toLowerCase();
  const filteredVideos = uploadedVideos.filter(
    (item) =>
      !q ||
      item.originalName.toLowerCase().includes(q) ||
      item.altText.toLowerCase().includes(q),
  );
  const filteredImages = uploadedImages.filter(
    (item) =>
      !q ||
      item.originalName.toLowerCase().includes(q) ||
      item.altText.toLowerCase().includes(q),
  );

  const handleInlineFieldChange = (
    idx: number,
    prop: "name" | "role" | "duration",
    raw: string,
  ) => {
    const cleaned = sanitizeCardText(raw);
    setLocalCards((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [prop]: cleaned } : item)),
    );
  };

  const handleInlineFieldBlur = (idx: number, prop: "name" | "role" | "duration") => {
    const card = latestLocalRef.current[idx];
    if (!card) return;
    const fallbackName = directorsField.value[idx]?.name ?? "Diretoria";
    const fixed = latestLocalRef.current.map((entry, i) => {
      if (i !== idx) return entry;
      if (prop === "name") {
        return { ...entry, name: entry.name.trim().slice(0, 80) || fallbackName };
      }
      if (prop === "role") {
        return { ...entry, role: entry.role.trim().slice(0, 100) };
      }
      const nextDuration = (entry.duration ?? "").trim().slice(0, 16);
      if (nextDuration) return { ...entry, duration: nextDuration };
      const { duration: _removed, ...rest } = entry;
      return rest;
    });
    commitCards(fixed);
  };

  const moveCard = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= localCards.length) return;
    const next = [...localCards];
    [next[index], next[target]] = [next[target], next[index]];
    commitCards(next);
  };

  const removeCard = (index: number) => {
    if (localCards.length <= 1) return;
    commitCards(localCards.filter((_, i) => i !== index));
  };

  const scrollStrip = (direction: -1 | 1) => {
    const vp = viewportRef.current;
    if (!vp) return;
    const firstCard = vp.querySelector<HTMLElement>(".ec-ie-dir-card");
    const step = firstCard ? firstCard.getBoundingClientRect().width + 8 : 220;
    vp.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  const handleSwitchType = (nextType: "video" | "image") => {
    if (nextType === draftType) return;
    setDraftType(nextType);
    setDraftSrc("");
    setDraftPoster("");
    setPosterPickerOpen(false);
    setErrorMsg(null);
    if (nextType === "image") {
      setDraftDuration("");
    }
  };

  const handleSelectLibraryVideo = async (url: string, suggestedDuration?: string) => {
    setDraftSrc(url);
    if (suggestedDuration) {
      setDraftDuration(suggestedDuration);
      return;
    }
    const detected = await detectVideoDuration(url);
    if (detected) setDraftDuration(detected);
  };

  const handleApplyModal = () => {
    const cleanName = sanitizeCardText(draftName).trim().slice(0, 80);
    const cleanRole = sanitizeCardText(draftRole).trim().slice(0, 100);
    const cleanDuration = sanitizeCardText(draftDuration).trim().slice(0, 16);

    if (!cleanName) {
      setErrorMsg("Informe o nome exibido no cartão.");
      return;
    }
    if (!draftSrc.trim()) {
      setErrorMsg(
        draftType === "video"
          ? "Selecione ou envie um vídeo antes de aplicar."
          : "Selecione ou envie uma imagem antes de aplicar.",
      );
      return;
    }

    const nextCard: DirectorCardItem =
      draftType === "video"
        ? {
            mediaType: "video",
            src: draftSrc.trim(),
            ...(draftPoster.trim() ? { poster: draftPoster.trim() } : {}),
            name: cleanName,
            role: cleanRole,
            ...(cleanDuration ? { duration: cleanDuration } : {}),
          }
        : {
            mediaType: "image",
            src: draftSrc.trim(),
            name: cleanName,
            role: cleanRole,
          };

    if (editingTarget === "new") {
      if (localCards.length >= 8) {
        setErrorMsg("Limite máximo de 8 cartões atingido.");
        return;
      }
      commitCards([...localCards, nextCard]);
      window.setTimeout(() => {
        const vp = viewportRef.current;
        if (vp) vp.scrollTo({ left: vp.scrollWidth, behavior: "smooth" });
      }, 60);
    } else if (typeof editingTarget === "number") {
      commitCards(localCards.map((item, idx) => (idx === editingTarget ? nextCard : item)));
    }
    setEditingTarget(null);
  };

  const editingOriginalCard =
    typeof editingTarget === "number"
      ? directorsField.originalValue[editingTarget]
      : undefined;

  return (
    <>
      {createPortal(
        <div
          className="ec-ie-dir-shell"
          role="region"
          aria-label="Edição de mídias dos Sócios-Diretores"
        >
          <div className="ec-ie-dir-topbar">
            <div className="ec-ie-dir-count-pill">
              <span>
                {localCards.length} {localCards.length === 1 ? "mídia" : "mídias"}
              </span>
              <span className="ec-ie-dir-count-sub">máx. 8</span>
            </div>

            <div className="ec-ie-dir-topbar-actions">
              {localCards.length > 2 ? (
                <div className="ec-ie-dir-scroll-group">
                  <button
                    type="button"
                    className="ec-ie-dir-nav-btn"
                    title="Rolar para esquerda"
                    aria-label="Ver mídia anterior"
                    onClick={() => scrollStrip(-1)}
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    type="button"
                    className="ec-ie-dir-nav-btn"
                    title="Rolar para direita"
                    aria-label="Ver próxima mídia"
                    onClick={() => scrollStrip(1)}
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              ) : null}

              <button
                type="button"
                className="ec-ie-dir-add-top-btn"
                disabled={!canAddMore}
                title={canAddMore ? "Adicionar novo vídeo ou foto" : "Limite de 8 cartões"}
                onClick={() => openModalFor("new")}
              >
                <Plus size={13} />
                <span>Adicionar</span>
              </button>
            </div>
          </div>

          <div
            ref={viewportRef}
            className={`ec-ie-dir-viewport ${localCards.length === 1 ? "is-single" : ""}`}
          >
            {localCards.map((card, idx) => {
              const previewImg = card.mediaType === "image" ? card.src : card.poster;
              return (
                <div
                  key={`dir-card-${idx}-${card.src}`}
                  className={`ec-ie-dir-card ${localCards.length === 1 ? "is-single" : ""}`}
                >
                  <div className="ec-ie-dir-media-box">
                    {previewImg ? (
                      <img
                        src={previewImageSrc(previewImg)}
                        alt={card.name}
                        className="ec-ie-dir-media"
                      />
                    ) : (
                      <video
                        src={previewImageSrc(card.src)}
                        preload="metadata"
                        muted
                        playsInline
                        className="ec-ie-dir-media"
                      />
                    )}
                    <div className="ec-ie-dir-scrim" />

                    <span className="ec-ie-dir-type-badge">
                      {card.mediaType === "video" ? (
                        <>
                          <Film size={10} />
                          <span>VÍDEO</span>
                        </>
                      ) : (
                        <>
                          <ImageIcon size={10} />
                          <span>FOTO</span>
                        </>
                      )}
                    </span>

                    <div
                      className="ec-ie-dir-card-actions"
                      role="toolbar"
                      aria-label={`Ações do cartão ${idx + 1}`}
                    >
                      <button
                        type="button"
                        className="ec-ie-dir-act-btn"
                        disabled={idx === 0}
                        title="Mover para esquerda"
                        aria-label="Mover cartão para esquerda"
                        onClick={() => moveCard(idx, -1)}
                      >
                        <ChevronLeft size={12} />
                      </button>
                      <button
                        type="button"
                        className="ec-ie-dir-act-btn"
                        disabled={idx === localCards.length - 1}
                        title="Mover para direita"
                        aria-label="Mover cartão para direita"
                        onClick={() => moveCard(idx, 1)}
                      >
                        <ChevronRight size={12} />
                      </button>
                      <button
                        type="button"
                        className="ec-ie-dir-act-btn"
                        title="Editar mídia e detalhes"
                        aria-label="Editar mídia do cartão"
                        onClick={() => openModalFor(idx)}
                      >
                        <Pencil size={11} />
                      </button>
                      <button
                        type="button"
                        className="ec-ie-dir-act-btn is-danger"
                        disabled={localCards.length <= 1}
                        title={
                          localCards.length <= 1
                            ? "Mínimo de 1 cartão obrigatório"
                            : "Remover cartão"
                        }
                        aria-label="Remover cartão"
                        onClick={() => removeCard(idx)}
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>

                    <button
                      type="button"
                      className="ec-ie-dir-swap-btn"
                      onClick={() => openModalFor(idx)}
                      title="Trocar vídeo, foto ou capa deste cartão"
                    >
                      <UploadCloud size={13} />
                      <span>Trocar {card.mediaType === "video" ? "Vídeo / Capa" : "Imagem"}</span>
                    </button>

                    <div className="ec-ie-dir-tag">
                      <span className="ec-ie-dir-tag-accent" />
                      <div className="ec-ie-dir-tag-inputs">
                        <input
                          type="text"
                          className="ec-ie-dir-name-input"
                          value={card.name}
                          maxLength={80}
                          placeholder="Nome"
                          aria-label={`Nome do cartão ${idx + 1}`}
                          onChange={(e) => handleInlineFieldChange(idx, "name", e.target.value)}
                          onBlur={() => handleInlineFieldBlur(idx, "name")}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              e.currentTarget.blur();
                            }
                          }}
                        />
                        <div className="ec-ie-dir-sub-row">
                          <input
                            type="text"
                            className="ec-ie-dir-role-input"
                            value={card.role}
                            maxLength={100}
                            placeholder="Cargo / função"
                            aria-label={`Cargo do cartão ${idx + 1}`}
                            onChange={(e) => handleInlineFieldChange(idx, "role", e.target.value)}
                            onBlur={() => handleInlineFieldBlur(idx, "role")}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                e.currentTarget.blur();
                              }
                            }}
                          />
                          {card.mediaType === "video" ? (
                            <input
                              type="text"
                              className="ec-ie-dir-dur-input"
                              value={card.duration ?? ""}
                              maxLength={16}
                              placeholder="00:00"
                              aria-label={`Duração do vídeo ${idx + 1}`}
                              onChange={(e) =>
                                handleInlineFieldChange(idx, "duration", e.target.value)
                              }
                              onBlur={() => handleInlineFieldBlur(idx, "duration")}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  e.currentTarget.blur();
                                }
                              }}
                            />
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>,
        portalHost,
      )}

      {editingTarget !== null ? (
        <div className="ec-ie-backdrop" onClick={() => setEditingTarget(null)}>
          <div
            aria-modal="true"
            className="ec-ie-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            style={{ maxWidth: "660px" }}
          >
            <div className="ec-ie-modal-head">
              <div className="ec-ie-modal-title-wrap">
                <div className="ec-ie-modal-icon">
                  {draftType === "video" ? <Film size={16} /> : <ImageIcon size={16} />}
                </div>
                <div>
                  <div className="ec-ie-modal-title">
                    {editingTarget === "new"
                      ? "Adicionar Novo Vídeo ou Foto"
                      : `Editar Cartão #${editingTarget + 1}`}
                  </div>
                  <div className="ec-ie-modal-sub">
                    Palavra dos Sócios-Diretores · Sobre Nós
                  </div>
                </div>
              </div>

              <button
                aria-label="Fechar"
                className="ec-ie-icon-btn"
                onClick={() => setEditingTarget(null)}
                type="button"
              >
                <X size={16} />
              </button>
            </div>

            <div className="ec-ie-modal-body" style={{ overflowY: "auto" }}>
              {/* Media Type Switcher */}
              <div className="ec-ie-dir-type-switch" role="group" aria-label="Tipo de mídia">
                <button
                  type="button"
                  className={`ec-ie-dir-type-btn ${draftType === "video" ? "is-active" : ""}`}
                  onClick={() => handleSwitchType("video")}
                >
                  <Film size={14} />
                  <span>Vídeo</span>
                </button>
                <button
                  type="button"
                  className={`ec-ie-dir-type-btn ${draftType === "image" ? "is-active" : ""}`}
                  onClick={() => handleSwitchType("image")}
                >
                  <ImageIcon size={14} />
                  <span>Imagem / Foto</span>
                </button>
              </div>

              {/* Name, Role, Duration */}
              <div className="ec-ie-dir-fields-grid">
                <div>
                  <label className="ec-ie-field-label" htmlFor="ec-ie-dir-modal-name">
                    Nome *
                  </label>
                  <input
                    id="ec-ie-dir-modal-name"
                    type="text"
                    className="ec-ie-input"
                    maxLength={80}
                    placeholder="Ex: Carlos Eduardo"
                    value={draftName}
                    onChange={(e) => setDraftName(sanitizeCardText(e.target.value))}
                  />
                </div>
                <div>
                  <label className="ec-ie-field-label" htmlFor="ec-ie-dir-modal-role">
                    Cargo / Função
                  </label>
                  <input
                    id="ec-ie-dir-modal-role"
                    type="text"
                    className="ec-ie-input"
                    maxLength={100}
                    placeholder="Ex: Diretor Técnico"
                    value={draftRole}
                    onChange={(e) => setDraftRole(sanitizeCardText(e.target.value))}
                  />
                </div>
                {draftType === "video" ? (
                  <div>
                    <label className="ec-ie-field-label" htmlFor="ec-ie-dir-modal-dur">
                      Duração (ex: 00:14)
                    </label>
                    <input
                      id="ec-ie-dir-modal-dur"
                      type="text"
                      className="ec-ie-input"
                      maxLength={16}
                      placeholder="00:14"
                      value={draftDuration}
                      onChange={(e) => setDraftDuration(sanitizeCardText(e.target.value))}
                    />
                  </div>
                ) : null}
              </div>

              {/* Current Selected Preview */}
              {draftSrc ? (
                <div className="ec-ie-dir-preview-row">
                  {draftType === "video" ? (
                    <video
                      src={previewImageSrc(draftSrc)}
                      poster={draftPoster ? previewImageSrc(draftPoster) : undefined}
                      controls
                      muted
                      playsInline
                      className="ec-ie-dir-preview-media"
                    />
                  ) : (
                    <img
                      src={previewImageSrc(draftSrc)}
                      alt={draftName || "Prévia"}
                      className="ec-ie-dir-preview-media"
                    />
                  )}
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: "11px", color: "#a1a1aa", marginBottom: "2px" }}>
                      {draftType === "video" ? "Vídeo selecionado" : "Imagem selecionada"}
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
                      {draftSrc}
                    </div>
                  </div>
                  {editingOriginalCard &&
                  editingOriginalCard.mediaType === draftType &&
                  draftSrc !== editingOriginalCard.src ? (
                    <button
                      type="button"
                      className="ec-ie-btn-secondary"
                      onClick={() => {
                        setDraftSrc(editingOriginalCard.src);
                        if (editingOriginalCard.poster) setDraftPoster(editingOriginalCard.poster);
                        if (editingOriginalCard.duration) setDraftDuration(editingOriginalCard.duration);
                      }}
                      title="Voltar à mídia original"
                    >
                      <RotateCcw size={13} />
                      <span>Original</span>
                    </button>
                  ) : null}
                </div>
              ) : null}

              {/* Upload / Library Tabs */}
              <div className="ec-ie-tabs" style={{ padding: 0, borderBottom: "1px solid #27272a" }}>
                <button
                  type="button"
                  className={`ec-ie-tab ${mediaTab === "upload" ? "is-active" : ""}`}
                  onClick={() => setMediaTab("upload")}
                >
                  <UploadCloud size={14} />
                  <span>{draftType === "video" ? "Enviar Vídeo" : "Enviar Imagem"}</span>
                </button>
                <button
                  type="button"
                  className={`ec-ie-tab ${mediaTab === "library" ? "is-active" : ""}`}
                  onClick={() => setMediaTab("library")}
                >
                  <Layers size={14} />
                  <span>
                    {draftType === "video"
                      ? `Biblioteca de Vídeos (${uploadedVideos.length + originalVideos.length})`
                      : `Biblioteca de Imagens (${uploadedImages.length + originalImages.length})`}
                  </span>
                </button>
              </div>

              {mediaTab === "upload" ? (
                <div>
                  <input
                    accept={
                      draftType === "video"
                        ? "video/mp4,video/webm,video/quicktime"
                        : "image/jpeg,image/png,image/webp,image/gif,image/avif"
                    }
                    hidden
                    id={mainFileInputId}
                    ref={mainFileInputRef}
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void uploadMainMedia(file);
                      e.target.value = "";
                    }}
                  />
                  <div
                    className={`ec-ie-dropzone ${isDragging ? "is-dragging" : ""}`}
                    onClick={() => mainFileInputRef.current?.click()}
                    onDragLeave={() => setIsDragging(false)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) void uploadMainMedia(file);
                    }}
                  >
                    <UploadCloud size={26} color="#38bdf8" />
                    <div style={{ fontSize: "12.5px", fontWeight: 700, color: "#ffffff" }}>
                      {isUploading
                        ? draftType === "video"
                          ? "Enviando vídeo..."
                          : "Enviando imagem..."
                        : draftType === "video"
                          ? "Clique ou arraste um vídeo aqui"
                          : "Clique, arraste ou cole (Ctrl+V) uma imagem"}
                    </div>
                    <div style={{ fontSize: "11px", color: "#a1a1aa" }}>
                      {draftType === "video"
                        ? "MP4, WebM ou MOV · máx. 50 MB"
                        : "JPEG, PNG, WebP, GIF ou AVIF · máx. 10 MB"}
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
                      placeholder={
                        draftType === "video"
                          ? "Buscar vídeo na biblioteca..."
                          : "Buscar imagem na biblioteca..."
                      }
                      style={{ paddingLeft: "32px" }}
                      type="text"
                      value={search}
                    />
                  </div>

                  {loadingLibrary && mediaList.length === 0 ? (
                    <div style={{ padding: "18px", textAlign: "center", fontSize: "12px", color: "#a1a1aa" }}>
                      Carregando biblioteca...
                    </div>
                  ) : draftType === "video" ? (
                    <div className="ec-ie-media-grid" style={{ maxHeight: "200px", overflowY: "auto" }}>
                      {originalVideos.map((orig) => (
                        <button
                          key={`orig-vid-${orig.src}`}
                          type="button"
                          className={`ec-ie-media-card ${draftSrc === orig.src ? "is-selected" : ""}`}
                          onClick={() => void handleSelectLibraryVideo(orig.src, orig.duration)}
                        >
                          {orig.poster ? (
                            <img
                              src={previewImageSrc(orig.poster)}
                              alt={orig.name}
                              className="ec-ie-media-thumb"
                            />
                          ) : (
                            <video
                              src={previewImageSrc(orig.src)}
                              muted
                              preload="metadata"
                              className="ec-ie-media-thumb"
                            />
                          )}
                          <span className="ec-ie-media-name">Original · {orig.name}</span>
                        </button>
                      ))}
                      {filteredVideos.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          className={`ec-ie-media-card ${draftSrc === item.url ? "is-selected" : ""}`}
                          onClick={() => void handleSelectLibraryVideo(item.url)}
                        >
                          <video
                            src={item.url}
                            muted
                            preload="metadata"
                            className="ec-ie-media-thumb"
                          />
                          <span className="ec-ie-media-name" title={item.originalName}>
                            {item.originalName}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="ec-ie-media-grid" style={{ maxHeight: "200px", overflowY: "auto" }}>
                      {originalImages.map((orig) => (
                        <button
                          key={`orig-img-${orig.url}`}
                          type="button"
                          className={`ec-ie-media-card ${draftSrc === orig.url ? "is-selected" : ""}`}
                          onClick={() => setDraftSrc(orig.url)}
                        >
                          <img
                            src={previewImageSrc(orig.url)}
                            alt={orig.label}
                            className="ec-ie-media-thumb"
                          />
                          <span className="ec-ie-media-name">{orig.label}</span>
                        </button>
                      ))}
                      {filteredImages.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          className={`ec-ie-media-card ${draftSrc === item.url ? "is-selected" : ""}`}
                          onClick={() => setDraftSrc(item.url)}
                        >
                          <img
                            src={item.url}
                            alt={item.altText || item.originalName}
                            className="ec-ie-media-thumb"
                          />
                          <span className="ec-ie-media-name" title={item.originalName}>
                            {item.originalName}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Poster / Thumbnail section for video cards */}
              {draftType === "video" ? (
                <div className="ec-ie-dir-poster-box">
                  <div className="ec-ie-dir-poster-head">
                    <div>
                      <div style={{ fontSize: "11.5px", fontWeight: 700, color: "#f4f4f5" }}>
                        Capa / Thumbnail do Vídeo (opcional)
                      </div>
                      <div style={{ fontSize: "11px", color: "#a1a1aa" }}>
                        Exibida antes de dar play no vídeo.
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                      <input
                        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                        hidden
                        id={posterFileInputId}
                        ref={posterFileInputRef}
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) void uploadPosterImage(file);
                          e.target.value = "";
                        }}
                      />
                      <button
                        type="button"
                        className="ec-ie-btn-secondary"
                        disabled={isUploadingPoster}
                        onClick={() => posterFileInputRef.current?.click()}
                      >
                        <UploadCloud size={12} />
                        <span>{isUploadingPoster ? "Enviando..." : "Enviar Capa"}</span>
                      </button>
                      <button
                        type="button"
                        className="ec-ie-btn-secondary"
                        onClick={() => setPosterPickerOpen((prev) => !prev)}
                      >
                        <Layers size={12} />
                        <span>{posterPickerOpen ? "Fechar Galeria" : "Escolher Capa"}</span>
                      </button>
                      {draftPoster ? (
                        <button
                          type="button"
                          className="ec-ie-btn-secondary"
                          onClick={() => setDraftPoster("")}
                          title="Remover capa"
                        >
                          <Trash2 size={12} />
                          <span>Remover</span>
                        </button>
                      ) : null}
                    </div>
                  </div>

                  {draftPoster ? (
                    <div className="ec-ie-dir-poster-preview">
                      <img
                        src={previewImageSrc(draftPoster)}
                        alt="Capa do vídeo"
                        style={{
                          width: "44px",
                          height: "44px",
                          objectFit: "cover",
                          borderRadius: "6px",
                          border: "1px solid #27272a",
                        }}
                      />
                      <span
                        style={{
                          fontSize: "11px",
                          color: "#d4d4d8",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {draftPoster}
                      </span>
                    </div>
                  ) : null}

                  {posterPickerOpen ? (
                    <div className="ec-ie-media-grid" style={{ maxHeight: "150px", overflowY: "auto", marginTop: "8px" }}>
                      {originalImages.map((orig) => (
                        <button
                          key={`poster-orig-${orig.url}`}
                          type="button"
                          className={`ec-ie-media-card ${draftPoster === orig.url ? "is-selected" : ""}`}
                          onClick={() => {
                            setDraftPoster(orig.url);
                            setPosterPickerOpen(false);
                          }}
                        >
                          <img
                            src={previewImageSrc(orig.url)}
                            alt={orig.label}
                            className="ec-ie-media-thumb"
                          />
                          <span className="ec-ie-media-name">{orig.label}</span>
                        </button>
                      ))}
                      {uploadedImages.map((item) => (
                        <button
                          key={`poster-lib-${item.id}`}
                          type="button"
                          className={`ec-ie-media-card ${draftPoster === item.url ? "is-selected" : ""}`}
                          onClick={() => {
                            setDraftPoster(item.url);
                            setPosterPickerOpen(false);
                          }}
                        >
                          <img
                            src={item.url}
                            alt={item.altText || item.originalName}
                            className="ec-ie-media-thumb"
                          />
                          <span className="ec-ie-media-name">{item.originalName}</span>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}

              {errorMsg ? <p className="ec-ie-error-text">{errorMsg}</p> : null}
            </div>

            <div className="ec-ie-modal-foot">
              <div style={{ fontSize: "11px", color: "#a1a1aa" }}>
                As alterações entram no ar ao clicar em Publicar.
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  className="ec-ie-btn-secondary"
                  onClick={() => setEditingTarget(null)}
                  type="button"
                >
                  Cancelar
                </button>
                <button
                  className="ec-ie-btn-primary"
                  disabled={isUploading || isUploadingPoster || !draftSrc.trim()}
                  onClick={handleApplyModal}
                  type="button"
                >
                  <Check size={14} />
                  <span>{editingTarget === "new" ? "Adicionar Cartão" : "Aplicar Alterações"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
