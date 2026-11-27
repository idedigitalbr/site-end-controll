"use client";

import React from "react";
import {
  AlertCircle,
  Check,
  ExternalLink,
  Eye,
  History,
  Laptop,
  Redo2,
  Save,
  Smartphone,
  Tablet,
  Undo2,
  X,
} from "lucide-react";

import { useInlineEditor } from "./inline-editor-context";

export function InlineTopBar() {
  const {
    bootstrap,
    isEditing,
    setIsEditing,
    previewMode,
    setPreviewMode,
    viewport,
    setViewport,
    undo,
    redo,
    canUndo,
    canRedo,
    hasUnsavedChanges,
    hasLocalDraft,
    isSaving,
    toast,
    discardDraft,
    publishChanges,
    setRevisionsModalOpen,
    versionNumber,
  } = useInlineEditor();

  if (!isEditing) return null;

  return (
    <>
      {toast ? (
        <div className={`ec-ie-toast ${toast.isError ? "is-error" : ""}`} role="status">
          {toast.isError ? <AlertCircle size={15} color="#f87171" /> : <Check size={15} color="#34d399" />}
          <span>{toast.message}</span>
        </div>
      ) : null}

      <div aria-label="Barra do Editor Visual" className="ec-ie-topbar" role="toolbar">
        <div className="ec-ie-topbar-group">
          <div className="ec-ie-brand-chip">
            <span className="ec-ie-brand-mark">EC</span>
            <span className="ec-ie-brand-title">Modo Edição</span>
            <span
              className={`ec-ie-role-badge ${
                bootstrap.canEditMedia ? "is-admin" : "is-editor"
              }`}
            >
              {bootstrap.canEditMedia ? "SUPERADMIN" : "EDITOR"}
            </span>
          </div>

          <span className="ec-ie-page-badge" title={bootstrap.routePath}>
            · {bootstrap.title} (v{versionNumber})
          </span>

          <div className="ec-ie-divider" />

          <button
            aria-label="Desfazer"
            className="ec-ie-icon-btn"
            disabled={!canUndo}
            onClick={undo}
            title="Desfazer (Ctrl+Z)"
            type="button"
          >
            <Undo2 size={14} />
          </button>

          <button
            aria-label="Refazer"
            className="ec-ie-icon-btn"
            disabled={!canRedo}
            onClick={redo}
            title="Refazer (Ctrl+Y)"
            type="button"
          >
            <Redo2 size={14} />
          </button>

          <button
            aria-label="Histórico de Revisões"
            className="ec-ie-icon-btn"
            onClick={() => setRevisionsModalOpen(true)}
            title="Histórico de Revisões e Checkpoints"
            type="button"
          >
            <History size={14} color="#38bdf8" />
          </button>

          <a
            className="ec-ie-admin-link"
            href={`/admin/pages/${bootstrap.pageId}`}
            rel="noreferrer"
            target="_blank"
            title="Abrir edição completa (SEO/título) no painel Admin"
          >
            <span>Admin</span>
            <ExternalLink size={11} />
          </a>
        </div>

        <div className="ec-ie-viewport-group" role="group" aria-label="Simulador de tela">
          <button
            aria-label="Desktop"
            className={`ec-ie-viewport-btn ${viewport === "desktop" ? "is-active" : ""}`}
            onClick={() => setViewport("desktop")}
            title="Desktop (largura total)"
            type="button"
          >
            <Laptop size={14} />
          </button>
          <button
            aria-label="Tablet"
            className={`ec-ie-viewport-btn ${viewport === "tablet" ? "is-active" : ""}`}
            onClick={() => setViewport("tablet")}
            title="Tablet (768px)"
            type="button"
          >
            <Tablet size={14} />
          </button>
          <button
            aria-label="Mobile"
            className={`ec-ie-viewport-btn ${viewport === "mobile" ? "is-active" : ""}`}
            onClick={() => setViewport("mobile")}
            title="Mobile (390px)"
            type="button"
          >
            <Smartphone size={14} />
          </button>
        </div>

        <div className="ec-ie-topbar-group">
          <button
            aria-label="Modo Preview"
            className={`ec-ie-icon-btn ${previewMode ? "is-active" : ""}`}
            onClick={() => setPreviewMode(!previewMode)}
            title={previewMode ? "Voltar à edição" : "Visualizar sem marcadores"}
            type="button"
          >
            <Eye size={15} />
          </button>

          {hasLocalDraft || hasUnsavedChanges ? (
            <button
              className="ec-ie-link-btn"
              onClick={() => discardDraft(false)}
              title="Descartar rascunho local"
              type="button"
            >
              Descartar rascunho
            </button>
          ) : null}

          <button
            className={`ec-ie-publish-btn ${hasUnsavedChanges ? "has-changes" : ""}`}
            disabled={!hasUnsavedChanges || isSaving}
            onClick={() => void publishChanges()}
            type="button"
          >
            <Save size={14} color={hasUnsavedChanges ? "#059669" : "#34d399"} />
            <span>
              {isSaving ? "Publicando..." : hasUnsavedChanges ? "Publicar *" : "Publicado"}
            </span>
          </button>

          <button
            aria-label="Sair do Modo Edição"
            className="ec-ie-icon-btn"
            onClick={() => {
              setIsEditing(false);
              setPreviewMode(false);
            }}
            title="Sair do modo edição"
            type="button"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </>
  );
}
