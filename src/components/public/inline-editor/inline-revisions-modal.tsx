"use client";

import React, { useEffect } from "react";
import { CheckCircle2, History, RefreshCw, RotateCcw, User, X } from "lucide-react";

import { useInlineEditor } from "./inline-editor-context";

export function InlineRevisionsModal() {
  const {
    revisionsModalOpen,
    setRevisionsModalOpen,
    revisions,
    revisionsLoading,
    publishedVersionId,
    loadRevisions,
    restoreRevision,
    isSaving,
  } = useInlineEditor();

  useEffect(() => {
    if (!revisionsModalOpen) return;
    void loadRevisions();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setRevisionsModalOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [loadRevisions, revisionsModalOpen, setRevisionsModalOpen]);

  if (!revisionsModalOpen) return null;

  return (
    <div className="ec-ie-backdrop" onClick={() => setRevisionsModalOpen(false)}>
      <div
        aria-modal="true"
        className="ec-ie-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        style={{ maxWidth: "680px" }}
      >
        <div className="ec-ie-modal-head">
          <div className="ec-ie-modal-title-wrap">
            <div className="ec-ie-modal-icon">
              <History size={16} />
            </div>
            <div>
              <div className="ec-ie-modal-title">Histórico de Revisões da Página</div>
              <div className="ec-ie-modal-sub">
                Restaure qualquer versão anterior diretamente para o ar em 1 clique.
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <button
              aria-label="Atualizar revisões"
              className="ec-ie-icon-btn"
              onClick={() => void loadRevisions()}
              title="Recarregar"
              type="button"
            >
              <RefreshCw size={15} />
            </button>
            <button
              aria-label="Fechar"
              className="ec-ie-icon-btn"
              onClick={() => setRevisionsModalOpen(false)}
              type="button"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="ec-ie-modal-body">
          {revisionsLoading && revisions.length === 0 ? (
            <div style={{ padding: "28px", textAlign: "center", fontSize: "12px", color: "#a1a1aa" }}>
              Carregando histórico de revisões...
            </div>
          ) : revisions.length === 0 ? (
            <div style={{ padding: "28px", textAlign: "center", fontSize: "12px", color: "#a1a1aa" }}>
              Nenhuma versão registrada ainda.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {revisions.map((rev) => {
                const isLive = rev.id === publishedVersionId;
                const dateLabel = new Date(rev.publishedAt || rev.createdAt).toLocaleString("pt-BR", {
                  dateStyle: "short",
                  timeStyle: "short",
                });
                return (
                  <div
                    className={`ec-ie-revision-card ${isLive ? "is-current" : ""}`}
                    key={rev.id}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#ffffff" }}>
                          Versão {rev.version} · {dateLabel}
                        </span>
                        {isLive ? (
                          <span className="ec-ie-badge-live">
                            <CheckCircle2 size={11} />
                            <span>No Ar</span>
                          </span>
                        ) : (
                          <span style={{ fontSize: "10.5px", color: "#a1a1aa" }}>
                            ({rev.status === "published" ? "Publicada" : "Rascunho"})
                          </span>
                        )}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11.5px", color: "#a1a1aa" }}>
                        <User size={12} />
                        <span>{rev.authorName || rev.authorEmail || "Administrador"}</span>
                      </div>
                    </div>

                    {!isLive ? (
                      <button
                        className="ec-ie-btn-secondary"
                        disabled={isSaving}
                        onClick={() => void restoreRevision(rev.id)}
                        type="button"
                      >
                        <RotateCcw size={13} />
                        <span>Restaurar Esta Versão</span>
                      </button>
                    ) : (
                      <span style={{ fontSize: "11px", fontWeight: 600, color: "#34d399" }}>
                        Versão atual
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="ec-ie-modal-foot">
          <div style={{ fontSize: "11px", color: "#a1a1aa" }}>
            Cada restauração cria uma nova versão publicada preservando o histórico anterior.
          </div>
          <button
            className="ec-ie-btn-secondary"
            onClick={() => setRevisionsModalOpen(false)}
            type="button"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
