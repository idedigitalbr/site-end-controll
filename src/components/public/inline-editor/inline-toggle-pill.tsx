"use client";

import React from "react";
import { Edit3 } from "lucide-react";

import { useInlineEditor } from "./inline-editor-context";

export function InlineTogglePill() {
  const { isEditing, setIsEditing, setPreviewMode } = useInlineEditor();

  if (isEditing) return null;

  return (
    <div aria-label="Controle de edição da página" className="ec-ie-toggle-wrap" role="region">
      <button
        aria-label="Editar Página"
        className="ec-ie-toggle-btn"
        onClick={() => {
          setIsEditing(true);
          setPreviewMode(false);
        }}
        title="Editar página visualmente"
        type="button"
      >
        <span className="ec-ie-toggle-badge">EC</span>
        <span>Editar Página</span>
        <Edit3 size={13} />
      </button>
      <div aria-hidden="true" className="ec-ie-toggle-dot" />
    </div>
  );
}
