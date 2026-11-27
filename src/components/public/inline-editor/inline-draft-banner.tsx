"use client";

import React, { useState } from "react";
import { AlertTriangle, Edit3, Trash2, X } from "lucide-react";

import { useInlineEditor } from "./inline-editor-context";

export function InlineDraftBanner() {
  const { hasLocalDraft, isEditing, previewMode, setIsEditing, setPreviewMode, discardDraft } =
    useInlineEditor();
  const [dismissed, setDismissed] = useState(false);

  if (!hasLocalDraft || dismissed || (isEditing && !previewMode)) {
    return null;
  }

  return (
    <div aria-label="Aviso de rascunho local" className="ec-ie-draft-banner" role="region">
      <div className="ec-ie-draft-inner">
        <div className="ec-ie-draft-text">
          <AlertTriangle size={16} />
          <span>
            <strong>Rascunho Local Ativo:</strong> Você está vendo alterações salvas neste navegador que ainda não foram publicadas.
          </span>
        </div>

        <div className="ec-ie-draft-actions">
          <button
            className="ec-ie-btn-dark"
            onClick={() => {
              setIsEditing(true);
              setPreviewMode(false);
            }}
            type="button"
          >
            <Edit3 size={13} />
            <span>Abrir no Editor</span>
          </button>

          <button
            className="ec-ie-btn-danger"
            onClick={() => discardDraft(false)}
            type="button"
          >
            <Trash2 size={13} />
            <span>Descartar Rascunho</span>
          </button>

          <button
            aria-label="Ocultar aviso"
            className="ec-ie-btn-ghost-amber"
            onClick={() => setDismissed(true)}
            type="button"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
