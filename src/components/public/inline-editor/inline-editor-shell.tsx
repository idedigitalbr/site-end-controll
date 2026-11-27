"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { Monitor } from "lucide-react";

import "./inline-editor.css";
import type { InlineEditorBootstrap } from "@/lib/cms/inline-editor-types";
import { InlineCardListEditor } from "./inline-card-list-editor";
import { InlineClientLogosEditor } from "./inline-client-logos-editor";
import { InlineDirectorCardsEditor } from "./inline-director-cards-editor";
import { InlineDomOverlays } from "./inline-dom-overlays";
import { InlineDraftBanner } from "./inline-draft-banner";
import { InlineEditorProvider, useInlineEditor } from "./inline-editor-context";
import { extractDraftDiffs } from "./inline-editor-dom";
import { InlineIndicatorsEditor } from "./inline-indicators-editor";
import { InlineLinkModal } from "./inline-link-modal";
import { InlineMediaModal } from "./inline-media-modal";
import { InlineNavigationEditor } from "./inline-navigation-editor";
import { InlineRevisionsModal } from "./inline-revisions-modal";
import { InlineSectionToolbar } from "./inline-section-toolbar";
import { InlineTogglePill } from "./inline-toggle-pill";
import { InlineTopBar } from "./inline-top-bar";

function InlineDevicePreviewFrame() {
  const { bootstrap, fields, globalValues, navigationContent, viewport, setViewport } =
    useInlineEditor();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const isMobile = viewport === "mobile";
  const previewSrc = bootstrap.routePath.includes("?")
    ? `${bootstrap.routePath}&ec_device_preview=1`
    : `${bootstrap.routePath}?ec_device_preview=1`;

  const postDiffs = useCallback(() => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    const diffs = extractDraftDiffs(bootstrap.fields, fields);
    win.postMessage(
      { type: "ec-ie-sync-diffs", diffs, globalValues, navigationContent },
      window.location.origin,
    );
  }, [bootstrap.fields, fields, globalValues, navigationContent]);

  useEffect(() => {
    postDiffs();
  }, [postDiffs]);

  return (
    <div
      className="ec-ie-device-stage"
      role="region"
      aria-label={isMobile ? "Simulador Mobile" : "Simulador Tablet"}
    >
      <div className="ec-ie-device-header">
        <span>
          {isMobile ? "Simulador Mobile (390px)" : "Simulador Tablet (768px)"} — visualização
          responsiva real
        </span>
        <button
          type="button"
          className="ec-ie-btn ec-ie-btn-ghost"
          onClick={() => setViewport("desktop")}
        >
          <Monitor size={14} />
          Voltar ao Desktop para editar
        </button>
      </div>

      <div className={`ec-ie-device-frame ${isMobile ? "is-mobile" : "is-tablet"}`}>
        {isMobile ? <div className="ec-ie-device-notch" aria-hidden="true" /> : null}
        <iframe
          ref={iframeRef}
          key={viewport}
          src={previewSrc}
          title={isMobile ? "Pré-visualização Mobile" : "Pré-visualização Tablet"}
          className="ec-ie-device-iframe"
          onLoad={postDiffs}
        />
      </div>
    </div>
  );
}

function InlineEditorShellInner({ children }: { children: React.ReactNode }) {
  const { bootstrap, isDevicePreviewFrame, isEditing, previewMode, viewport } = useInlineEditor();

  if (isDevicePreviewFrame) {
    return <>{children}</>;
  }

  const isDeviceSimulator =
    isEditing && !previewMode && (viewport === "tablet" || viewport === "mobile");

  return (
    <>
      <div className="ec-ie-ui" id="ec-inline-editor-root">
        <InlineDraftBanner />
        <InlineTopBar />
      </div>

      <div className="ec-ie-page-canvas">{children}</div>

      <div className="ec-ie-ui" id="ec-inline-editor-root-overlays">
        {isDeviceSimulator ? (
          <InlineDevicePreviewFrame />
        ) : (
          <>
            <InlineDomOverlays />
            <InlineCardListEditor />
            {bootstrap.canEditMedia ? <InlineSectionToolbar /> : null}
            <InlineNavigationEditor />
            {bootstrap.canEditMedia ? <InlineMediaModal /> : null}
            <InlineClientLogosEditor />
            <InlineDirectorCardsEditor />
            <InlineIndicatorsEditor />
            <InlineLinkModal />
            <InlineRevisionsModal />
          </>
        )}
        <InlineTogglePill />
      </div>
    </>
  );
}

export function InlineEditorShell({
  bootstrap,
  children,
}: {
  bootstrap: InlineEditorBootstrap;
  children: React.ReactNode;
}) {
  return (
    <InlineEditorProvider bootstrap={bootstrap}>
      <InlineEditorShellInner>{children}</InlineEditorShellInner>
    </InlineEditorProvider>
  );
}
