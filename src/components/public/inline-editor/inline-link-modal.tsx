"use client";

import React, { useEffect, useState } from "react";
import { Check, Link2, RotateCcw, Unlink, X } from "lucide-react";

import { isSafeEditableLink } from "@/lib/cms/inline-editor-types";
import { useInlineEditor } from "./inline-editor-context";

const quickDestinations = [
  { label: "Home (/)", href: "/" },
  { label: "Sobre Nós", href: "/sobre-nos.html" },
  { label: "Contato (#contato)", href: "#contato" },
  { label: "Política de Privacidade", href: "/politica-de-privacidade.html" },
];

export function InlineLinkModal() {
  const { linkModalState, closeLinkModal, updateLinkField } = useInlineEditor();
  const [linkInput, setLinkInput] = useState("");

  useEffect(() => {
    if (!linkModalState.isOpen) return;
    setLinkInput(linkModalState.currentValue ?? "");
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLinkModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeLinkModal, linkModalState.currentValue, linkModalState.isOpen]);

  if (!linkModalState.isOpen || !linkModalState.fieldKey) return null;

  const trimmed = linkInput.trim();
  const isOriginal = trimmed === (linkModalState.originalValue ?? "");
  const isValid = isOriginal || isSafeEditableLink(trimmed);
  const hasActiveLink = Boolean(trimmed && trimmed !== "#" && isValid);

  const handleSave = () => {
    if (!isValid || !linkModalState.fieldKey) return;
    updateLinkField(linkModalState.fieldKey, trimmed);
    closeLinkModal();
  };

  return (
    <div className="ec-ie-backdrop" onClick={closeLinkModal}>
      <div
        aria-modal="true"
        className="ec-ie-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        style={{ maxWidth: "600px" }}
      >
        <div className="ec-ie-modal-head">
          <div className="ec-ie-modal-title-wrap">
            <div className="ec-ie-modal-icon">
              <Link2 size={16} />
            </div>
            <div>
              <div className="ec-ie-modal-title">Configurar Link de Destino</div>
              <div className="ec-ie-modal-sub">
                {linkModalState.label || "Botão ou link da página"}
              </div>
            </div>
          </div>

          <button
            aria-label="Fechar"
            className="ec-ie-icon-btn"
            onClick={closeLinkModal}
            type="button"
          >
            <X size={16} />
          </button>
        </div>

        <div className="ec-ie-modal-body">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              padding: "10px 12px",
              borderRadius: "10px",
              border: "1px solid #27272a",
              background: "#14171c",
              fontSize: "12px",
            }}
          >
            <span style={{ color: hasActiveLink ? "#34d399" : "#a1a1aa" }}>
              {hasActiveLink ? `Destino ativo: ${trimmed}` : "Sem link configurado"}
            </span>
            {linkModalState.originalValue && trimmed !== linkModalState.originalValue ? (
              <button
                className="ec-ie-btn-secondary"
                onClick={() => setLinkInput(linkModalState.originalValue ?? "")}
                type="button"
              >
                <RotateCcw size={12} />
                <span>Original</span>
              </button>
            ) : null}
          </div>

          <div>
            <label className="ec-ie-field-label" htmlFor="ec-ie-link-input">
              URL de destino (rota interna, #âncora, https://, mailto: ou tel:)
            </label>
            <input
              autoFocus
              className="ec-ie-input"
              id="ec-ie-link-input"
              maxLength={2048}
              onChange={(e) => setLinkInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && isValid) handleSave();
                if (e.key === "Escape") closeLinkModal();
              }}
              placeholder="Ex: /sobre-nos.html ou https://wa.me/..."
              type="text"
              value={linkInput}
            />
            {!isValid ? (
              <p className="ec-ie-error-text" style={{ marginTop: "6px" }}>
                Link inválido. Use rota relativa, #âncora, http/https, mailto: ou tel:.
              </p>
            ) : null}
          </div>

          <div>
            <span className="ec-ie-field-label">Atalhos rápidos:</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {quickDestinations.map((dest) => (
                <button
                  className="ec-ie-pill-chip"
                  key={dest.href}
                  onClick={() => setLinkInput(dest.href)}
                  type="button"
                >
                  {dest.label}
                </button>
              ))}
              <button
                className="ec-ie-pill-chip"
                onClick={() => setLinkInput("")}
                style={{ color: "#f87171" }}
                type="button"
              >
                <Unlink size={11} style={{ display: "inline", marginRight: "4px" }} />
                Remover Link
              </button>
            </div>
          </div>
        </div>

        <div className="ec-ie-modal-foot">
          <div style={{ fontSize: "11px", color: "#a1a1aa" }}>
            Cliques em links ficam pausados durante o modo edição.
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button className="ec-ie-btn-secondary" onClick={closeLinkModal} type="button">
              Cancelar
            </button>
            <button
              className="ec-ie-btn-primary"
              disabled={!isValid}
              onClick={handleSave}
              type="button"
            >
              <Check size={14} />
              <span>Salvar Link</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
