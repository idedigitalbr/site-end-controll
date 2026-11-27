"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import type {
  CardListItem,
  ClientLogoItem,
  DirectorCardItem,
  EditablePageField,
  HomeSolutionCardItem,
  IndicatorItem,
  InlineEditorBootstrap,
  InlineNavigationContent,
  InlineRevisionItem,
} from "@/lib/cms/inline-editor-types";
import { HOME_SOLUTIONS_FIELD_KEY } from "@/lib/cms/home-solutions-defaults";
import { sanitizeRichTextHtml } from "@/lib/cms/rich-text";
import {
  applyFieldsToLiveDom,
  applyGlobalContentToLiveDom,
  applyNavigationContentToLiveDom,
  extractDraftDiffs,
  hydrateDraftOverrides,
  serializeEditableFields,
} from "./inline-editor-dom";

export type ViewportMode = "desktop" | "tablet" | "mobile";

export type MediaModalState = {
  isOpen: boolean;
  fieldKey?: string;
  kind?: "image" | "backgroundImage" | "homeSolutionImage" | "cardListImage";
  solutionRoutePath?: string;
  cardListItemIndex?: number;
  currentValue?: string;
  originalValue?: string;
  altText?: string;
  label?: string;
};

export type LinkModalState = {
  isOpen: boolean;
  fieldKey?: string;
  currentValue?: string;
  originalValue?: string;
  label?: string;
};

export type TextPopoverState = {
  isOpen: boolean;
  anchorRect?: { top: number; left: number; width: number; bottom: number };
  fieldKeys: string[];
  linkFieldKey?: string;
  title?: string;
};

export type RepositionTarget = {
  key: string;
  el: HTMLImageElement;
  solutionRoutePath?: string;
  cardListItemIndex?: number;
};

type SaveToast = {
  message: string;
  isError?: boolean;
};

type InlineEditorContextValue = {
  bootstrap: InlineEditorBootstrap;
  isEditing: boolean;
  isDevicePreviewFrame: boolean;
  setIsEditing: (editing: boolean) => void;
  previewMode: boolean;
  setPreviewMode: (preview: boolean) => void;
  viewport: ViewportMode;
  setViewport: (vp: ViewportMode) => void;
  fields: EditablePageField[];
  fieldsByKey: Map<string, EditablePageField>;
  versionNumber: number;
  publishedVersionId: string | null;
  hasUnsavedChanges: boolean;
  hasLocalDraft: boolean;
  isSaving: boolean;
  toast: SaveToast | null;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  updateTextField: (key: string, value: string) => void;
  updateRichTextField: (key: string, html: string) => void;
  updateImageField: (key: string, value: string, altText: string, objectPosition?: string) => void;
  updateImagePositionField: (key: string, objectPosition: string) => void;
  updateLinkField: (key: string, value: string) => void;
  updateBackgroundField: (key: string, value: string) => void;
  updateIndicatorsField: (key: string, items: IndicatorItem[]) => void;
  updateClientLogosField: (key: string, logos: ClientLogoItem[]) => void;
  updateDirectorCardsField: (key: string, cards: DirectorCardItem[]) => void;
  updateCardListField: (key: string, items: CardListItem[]) => void;
  updateHomeSolutionCard: (
    routePath: string,
    updater: (item: HomeSolutionCardItem) => HomeSolutionCardItem,
  ) => void;
  globalValues: Record<string, string>;
  hasGlobalChanges: boolean;
  updateGlobalValue: (key: string, value: string) => void;
  navigationContent: InlineNavigationContent | null;
  hasNavigationChanges: boolean;
  updateNavigationContent: (next: InlineNavigationContent) => void;
  repositionTarget: RepositionTarget | null;
  setRepositionTarget: (target: RepositionTarget | null) => void;
  moveSection: (parentKey: string, sectionSelector: string, direction: "up" | "down") => void;
  discardDraft: (skipConfirm?: boolean) => void;
  publishChanges: () => Promise<void>;
  mediaModalState: MediaModalState;
  openMediaModal: (options: Omit<MediaModalState, "isOpen">) => void;
  closeMediaModal: () => void;
  linkModalState: LinkModalState;
  openLinkModal: (options: Omit<LinkModalState, "isOpen">) => void;
  closeLinkModal: () => void;
  textPopoverState: TextPopoverState;
  openTextPopover: (options: Omit<TextPopoverState, "isOpen">) => void;
  closeTextPopover: () => void;
  revisionsModalOpen: boolean;
  setRevisionsModalOpen: (open: boolean) => void;
  revisions: InlineRevisionItem[];
  revisionsLoading: boolean;
  loadRevisions: () => Promise<void>;
  restoreRevision: (versionId: string) => Promise<void>;
};

const InlineEditorContext = createContext<InlineEditorContextValue | null>(null);

function draftStorageKey(pageId: string) {
  return `ec_inline_draft_v2:${pageId}`;
}

function legacyDraftStorageKey(pageId: string) {
  return `ec_inline_draft_v1:${pageId}`;
}

const GLOBAL_DRAFT_STORAGE_KEY = "ec_inline_global_v1:global";
const NAV_DRAFT_STORAGE_KEY = "ec_inline_nav_v1:global";

export function InlineEditorProvider({
  bootstrap,
  children,
}: {
  bootstrap: InlineEditorBootstrap;
  children: React.ReactNode;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDevicePreviewFrame, setIsDevicePreviewFrame] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [viewport, setViewport] = useState<ViewportMode>("desktop");

  const [publishedFields, setPublishedFields] = useState<EditablePageField[]>(bootstrap.fields);
  const [fields, setFields] = useState<EditablePageField[]>(bootstrap.fields);
  const [publishedGlobalValues, setPublishedGlobalValues] = useState<Record<string, string>>(
    bootstrap.globalContent,
  );
  const [globalValues, setGlobalValues] = useState<Record<string, string>>(
    bootstrap.globalContent,
  );
  const [publishedNavigationContent, setPublishedNavigationContent] =
    useState<InlineNavigationContent | null>(bootstrap.navigationContent ?? null);
  const [navigationContent, setNavigationContent] = useState<InlineNavigationContent | null>(
    bootstrap.navigationContent ?? null,
  );
  const [history, setHistory] = useState<EditablePageField[][]>([bootstrap.fields]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [versionNumber, setVersionNumber] = useState(bootstrap.versionNumber);
  const [publishedVersionId, setPublishedVersionId] = useState<string | null>(
    bootstrap.publishedVersionId,
  );
  const [hasFieldChanges, setHasFieldChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<SaveToast | null>(null);

  const [mediaModalState, setMediaModalState] = useState<MediaModalState>({ isOpen: false });
  const [linkModalState, setLinkModalState] = useState<LinkModalState>({ isOpen: false });
  const [textPopoverState, setTextPopoverState] = useState<TextPopoverState>({
    isOpen: false,
    fieldKeys: [],
  });
  const [repositionTarget, setRepositionTarget] = useState<RepositionTarget | null>(null);
  const [revisionsModalOpen, setRevisionsModalOpen] = useState(false);
  const [revisions, setRevisions] = useState<InlineRevisionItem[]>([]);
  const [revisionsLoading, setRevisionsLoading] = useState(false);

  const hasGlobalChanges = useMemo(
    () =>
      Object.keys(globalValues).some(
        (k) => (globalValues[k] ?? "") !== (publishedGlobalValues[k] ?? ""),
      ),
    [globalValues, publishedGlobalValues],
  );
  const hasNavigationChanges = useMemo(
    () =>
      Boolean(
        navigationContent &&
          publishedNavigationContent &&
          JSON.stringify(navigationContent) !== JSON.stringify(publishedNavigationContent),
      ),
    [navigationContent, publishedNavigationContent],
  );
  const hasUnsavedChanges = hasFieldChanges || hasGlobalChanges || hasNavigationChanges;
  const hasLocalDraft = hasUnsavedChanges;

  const toastTimerRef = useRef<number | null>(null);

  const showToast = useCallback((message: string, isError = false) => {
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    setToast({ message, isError });
    toastTimerRef.current = window.setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current));
      toastTimerRef.current = null;
    }, 3800);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const persistDraftToStorage = useCallback(
    (nextFields: EditablePageField[], base: EditablePageField[]) => {
      try {
        const diffs = extractDraftDiffs(base, nextFields);
        if (Object.keys(diffs).length === 0) {
          localStorage.removeItem(draftStorageKey(bootstrap.pageId));
          return false;
        }
        localStorage.setItem(draftStorageKey(bootstrap.pageId), JSON.stringify(diffs));
        return true;
      } catch {
        return false;
      }
    },
    [bootstrap.pageId],
  );

  const fieldsByKey = useMemo(
    () => new Map(fields.map((field) => [field.key, field])),
    [fields],
  );

  // Hydrate validated diff draft from localStorage and ?editor=1 / ?ec_device_preview=1 query
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const deviceFrame = params.get("ec_device_preview") === "1";
    setIsDevicePreviewFrame(deviceFrame);

    let retryTimer: number | null = null;
    try {
      localStorage.removeItem(legacyDraftStorageKey(bootstrap.pageId));
      const raw = localStorage.getItem(draftStorageKey(bootstrap.pageId));
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        const { fields: hydrated, appliedCount } = hydrateDraftOverrides(bootstrap.fields, parsed);
        if (appliedCount > 0) {
          setFields(hydrated);
          setHistory([hydrated]);
          setHistoryIndex(0);
          setHasFieldChanges(!deviceFrame);
          if (deviceFrame) {
            applyFieldsToLiveDom(hydrated, bootstrap.cardPrototypes);
            retryTimer = window.setTimeout(() => {
              applyFieldsToLiveDom(hydrated, bootstrap.cardPrototypes);
            }, 400);
          }
        } else {
          localStorage.removeItem(draftStorageKey(bootstrap.pageId));
        }
      }

      if (bootstrap.canEditMedia && bootstrap.navigationContent) {
        const rawNav = localStorage.getItem(NAV_DRAFT_STORAGE_KEY);
        if (rawNav) {
          const parsedNav = JSON.parse(rawNav) as unknown;
          if (
            parsedNav &&
            typeof parsedNav === "object" &&
            Array.isArray((parsedNav as InlineNavigationContent).primary) &&
            Array.isArray((parsedNav as InlineNavigationContent).groups)
          ) {
            const candidateNav = parsedNav as InlineNavigationContent;
            setNavigationContent(candidateNav);
            if (deviceFrame) applyNavigationContentToLiveDom(candidateNav);
          } else {
            localStorage.removeItem(NAV_DRAFT_STORAGE_KEY);
          }
        }
      }

      const rawGlobal = localStorage.getItem(GLOBAL_DRAFT_STORAGE_KEY);
      if (rawGlobal) {
        const parsedGlobal = JSON.parse(rawGlobal) as unknown;
        if (parsedGlobal && typeof parsedGlobal === "object" && !Array.isArray(parsedGlobal)) {
          const nextGlobal = { ...bootstrap.globalContent };
          let validGlobalCount = 0;
          for (const [k, v] of Object.entries(parsedGlobal as Record<string, unknown>)) {
            if (typeof v === "string" && Object.prototype.hasOwnProperty.call(bootstrap.globalContent, k)) {
              if (nextGlobal[k] !== v) {
                nextGlobal[k] = v;
                validGlobalCount += 1;
              }
            }
          }
          if (validGlobalCount > 0) {
            setGlobalValues(nextGlobal);
            if (deviceFrame) applyGlobalContentToLiveDom(nextGlobal);
          } else {
            localStorage.removeItem(GLOBAL_DRAFT_STORAGE_KEY);
          }
        }
      }
    } catch {
      // Ignore storage errors
    }

    if (deviceFrame) {
      setIsEditing(false);
      setPreviewMode(false);
      const onMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        const data = event.data as {
          type?: unknown;
          diffs?: unknown;
          globalValues?: unknown;
          navigationContent?: unknown;
        } | null;
        if (!data || data.type !== "ec-ie-sync-diffs") return;
        const { fields: hydrated } = hydrateDraftOverrides(bootstrap.fields, data.diffs);
        setFields(hydrated);
        applyFieldsToLiveDom(hydrated, bootstrap.cardPrototypes);
        if (
          data.globalValues &&
          typeof data.globalValues === "object" &&
          !Array.isArray(data.globalValues)
        ) {
          const safeGlobal = data.globalValues as Record<string, string>;
          setGlobalValues(safeGlobal);
          applyGlobalContentToLiveDom(safeGlobal);
        }
        if (
          data.navigationContent &&
          typeof data.navigationContent === "object" &&
          Array.isArray((data.navigationContent as InlineNavigationContent).primary)
        ) {
          const safeNav = data.navigationContent as InlineNavigationContent;
          setNavigationContent(safeNav);
          applyNavigationContentToLiveDom(safeNav);
        }
      };
      window.addEventListener("message", onMessage);
      return () => {
        if (retryTimer !== null) window.clearTimeout(retryTimer);
        window.removeEventListener("message", onMessage);
      };
    }

    if (
      params.get("editor") === "1" ||
      params.get("editor") === "true" ||
      params.get("edit") === "1" ||
      params.get("edit") === "true"
    ) {
      setIsEditing(true);
      setPreviewMode(false);
    }

    return () => {
      if (retryTimer !== null) window.clearTimeout(retryTimer);
    };
  }, [
    bootstrap.canEditMedia,
    bootstrap.cardPrototypes,
    bootstrap.fields,
    bootstrap.globalContent,
    bootstrap.navigationContent,
    bootstrap.pageId,
  ]);

  useEffect(() => {
    if (!hasUnsavedChanges || isDevicePreviewFrame) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [hasUnsavedChanges, isDevicePreviewFrame]);

  // Sync HTML attributes for layout offset, role capability & device simulator
  useEffect(() => {
    const root = document.documentElement;
    if (isEditing && !previewMode && !isDevicePreviewFrame) {
      root.dataset.ecIeEditing = "true";
      root.dataset.ecIeViewport = viewport;
      root.dataset.ecIeCanMedia = bootstrap.canEditMedia ? "true" : "false";
    } else {
      delete root.dataset.ecIeEditing;
      delete root.dataset.ecIeViewport;
      delete root.dataset.ecIeCanMedia;
    }

    return () => {
      delete root.dataset.ecIeEditing;
      delete root.dataset.ecIeViewport;
      delete root.dataset.ecIeCanMedia;
    };
  }, [bootstrap.canEditMedia, isDevicePreviewFrame, isEditing, previewMode, viewport]);

  // Clear active image reposition mode if leaving desktop editor
  useEffect(() => {
    if (!isEditing || previewMode || viewport !== "desktop" || isDevicePreviewFrame) {
      setRepositionTarget(null);
    }
  }, [isDevicePreviewFrame, isEditing, previewMode, viewport]);

  // Keep DOM synchronized whenever fields, global footer, or navigation values change
  useEffect(() => {
    if (isEditing || hasLocalDraft || isDevicePreviewFrame) {
      applyFieldsToLiveDom(fields, bootstrap.cardPrototypes);
      applyGlobalContentToLiveDom(globalValues);
      if (navigationContent) {
        applyNavigationContentToLiveDom(navigationContent);
      }
    }
  }, [
    bootstrap.cardPrototypes,
    fields,
    globalValues,
    hasLocalDraft,
    isDevicePreviewFrame,
    isEditing,
    navigationContent,
  ]);

  const commitFields = useCallback(
    (nextFields: EditablePageField[]) => {
      setFields(nextFields);
      setHistory((prev) => [...prev.slice(0, historyIndex + 1), nextFields].slice(-40));
      setHistoryIndex((prev) => Math.min(prev + 1, 39));
      const changed = persistDraftToStorage(nextFields, publishedFields);
      setHasFieldChanges(changed);
    },
    [historyIndex, persistDraftToStorage, publishedFields],
  );

  const undo = useCallback(() => {
    if (historyIndex <= 0) return;
    const nextIdx = historyIndex - 1;
    const prevFields = history[nextIdx];
    setHistoryIndex(nextIdx);
    setFields(prevFields);
    const changed = persistDraftToStorage(prevFields, publishedFields);
    setHasFieldChanges(changed);
  }, [history, historyIndex, persistDraftToStorage, publishedFields]);

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    const nextIdx = historyIndex + 1;
    const nextFields = history[nextIdx];
    setHistoryIndex(nextIdx);
    setFields(nextFields);
    const changed = persistDraftToStorage(nextFields, publishedFields);
    setHasFieldChanges(changed);
  }, [history, historyIndex, persistDraftToStorage, publishedFields]);

  // Keyboard shortcuts Ctrl+Z / Ctrl+Y in editor
  useEffect(() => {
    if (!isEditing || previewMode) return;
    const onKeyDown = (event: KeyboardEvent) => {
      const activeEl = document.activeElement as HTMLElement | null;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.isContentEditable)
      ) {
        return;
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
      } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "y") {
        event.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isEditing, previewMode, redo, undo]);

  const updateTextField = useCallback(
    (key: string, value: string) => {
      const current = fields.find((f) => f.key === key);
      if (!current || current.kind !== "text" || current.value === value) return;
      commitFields(fields.map((f) => (f.key === key && f.kind === "text" ? { ...f, value } : f)));
    },
    [commitFields, fields],
  );

  const updateRichTextField = useCallback(
    (key: string, html: string) => {
      const sanitized = sanitizeRichTextHtml(html);
      const current = fields.find((f) => f.key === key);
      if (!current || current.kind !== "richText" || current.value === sanitized) return;
      commitFields(
        fields.map((f) => (f.key === key && f.kind === "richText" ? { ...f, value: sanitized } : f)),
      );
    },
    [commitFields, fields],
  );

  const updateImageField = useCallback(
    (key: string, value: string, altText: string, objectPosition?: string) => {
      if (!bootstrap.canEditMedia) return;
      commitFields(
        fields.map((f) =>
          f.key === key && f.kind === "image"
            ? {
                ...f,
                value,
                altText,
                ...(objectPosition !== undefined ? { objectPosition } : {}),
              }
            : f,
        ),
      );
    },
    [bootstrap.canEditMedia, commitFields, fields],
  );

  const updateImagePositionField = useCallback(
    (key: string, objectPosition: string) => {
      const current = fields.find((f) => f.key === key);
      if (!current || current.kind !== "image") return;
      if (current.editorPhotoLocked && !bootstrap.canEditMedia) return;
      if ((current.objectPosition ?? "") === objectPosition) return;
      commitFields(
        fields.map((f) =>
          f.key === key && f.kind === "image" ? { ...f, objectPosition } : f,
        ),
      );
    },
    [bootstrap.canEditMedia, commitFields, fields],
  );

  const updateLinkField = useCallback(
    (key: string, value: string) => {
      commitFields(fields.map((f) => (f.key === key && f.kind === "link" ? { ...f, value } : f)));
    },
    [commitFields, fields],
  );

  const updateBackgroundField = useCallback(
    (key: string, value: string) => {
      if (!bootstrap.canEditMedia) return;
      commitFields(
        fields.map((f) =>
          f.key === key && f.kind === "backgroundImage" ? { ...f, value } : f,
        ),
      );
    },
    [bootstrap.canEditMedia, commitFields, fields],
  );

  const updateIndicatorsField = useCallback(
    (key: string, items: IndicatorItem[]) => {
      commitFields(
        fields.map((f) =>
          f.key === key && f.kind === "indicators" ? { ...f, value: items } : f,
        ),
      );
    },
    [commitFields, fields],
  );

  const updateClientLogosField = useCallback(
    (key: string, logos: ClientLogoItem[]) => {
      commitFields(
        fields.map((f) =>
          f.key === key && f.kind === "clientLogos" ? { ...f, value: logos } : f,
        ),
      );
    },
    [commitFields, fields],
  );

  const updateDirectorCardsField = useCallback(
    (key: string, cards: DirectorCardItem[]) => {
      commitFields(
        fields.map((f) =>
          f.key === key && f.kind === "directorCards" ? { ...f, value: cards } : f,
        ),
      );
    },
    [commitFields, fields],
  );

  const updateCardListField = useCallback(
    (key: string, items: CardListItem[]) => {
      commitFields(
        fields.map((f) =>
          f.key === key && f.kind === "cardList" ? { ...f, value: items } : f,
        ),
      );
    },
    [commitFields, fields],
  );

  const updateNavigationContent = useCallback(
    (next: InlineNavigationContent) => {
      if (!bootstrap.canEditMedia) return;
      setNavigationContent(next);
      try {
        if (
          publishedNavigationContent &&
          JSON.stringify(next) === JSON.stringify(publishedNavigationContent)
        ) {
          localStorage.removeItem(NAV_DRAFT_STORAGE_KEY);
        } else {
          localStorage.setItem(NAV_DRAFT_STORAGE_KEY, JSON.stringify(next));
        }
      } catch {
        // Ignore storage error
      }
      applyNavigationContentToLiveDom(next);
    },
    [bootstrap.canEditMedia, publishedNavigationContent],
  );

  const updateHomeSolutionCard = useCallback(
    (routePath: string, updater: (item: HomeSolutionCardItem) => HomeSolutionCardItem) => {
      const target = fields.find((f) => f.key === HOME_SOLUTIONS_FIELD_KEY);
      if (!target || target.kind !== "homeSolutions") return;
      let changed = false;
      const nextCards = target.value.map((card) => {
        if (card.routePath !== routePath) return card;
        const updated = updater(card);
        if (JSON.stringify(updated) !== JSON.stringify(card)) {
          changed = true;
        }
        return updated;
      });
      if (!changed) return;
      commitFields(
        fields.map((f) =>
          f.key === HOME_SOLUTIONS_FIELD_KEY && f.kind === "homeSolutions"
            ? { ...f, value: nextCards }
            : f,
        ),
      );
    },
    [commitFields, fields],
  );

  const updateGlobalValue = useCallback(
    (key: string, value: string) => {
      setGlobalValues((prev) => {
        if ((prev[key] ?? "") === value) return prev;
        const next = { ...prev, [key]: value };
        try {
          const diffs: Record<string, string> = {};
          for (const [k, v] of Object.entries(next)) {
            if ((publishedGlobalValues[k] ?? "") !== v) diffs[k] = v;
          }
          if (Object.keys(diffs).length === 0) {
            localStorage.removeItem(GLOBAL_DRAFT_STORAGE_KEY);
          } else {
            localStorage.setItem(GLOBAL_DRAFT_STORAGE_KEY, JSON.stringify(diffs));
          }
        } catch {
          // Ignore storage error
        }
        applyGlobalContentToLiveDom(next);
        return next;
      });
    },
    [publishedGlobalValues],
  );

  const moveSection = useCallback(
    (parentKey: string, sectionSelector: string, direction: "up" | "down") => {
      if (!bootstrap.canEditMedia) return;
      const targetField = fields.find((f) => f.key === parentKey);
      if (!targetField || targetField.kind !== "sectionOrder") return;
      const idx = targetField.value.indexOf(sectionSelector);
      if (idx === -1) return;
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= targetField.value.length) return;

      const nextOrder = [...targetField.value];
      [nextOrder[idx], nextOrder[swapIdx]] = [nextOrder[swapIdx], nextOrder[idx]];

      commitFields(
        fields.map((f) =>
          f.key === parentKey && f.kind === "sectionOrder" ? { ...f, value: nextOrder } : f,
        ),
      );
    },
    [bootstrap.canEditMedia, commitFields, fields],
  );

  const discardDraft = useCallback(
    (skipConfirm = false) => {
      if (
        !skipConfirm &&
        !window.confirm(
          "Apagar o rascunho deste navegador e voltar à versão publicada? As alterações não publicadas serão perdidas.",
        )
      ) {
        return;
      }

      try {
        localStorage.removeItem(draftStorageKey(bootstrap.pageId));
        localStorage.removeItem(GLOBAL_DRAFT_STORAGE_KEY);
        localStorage.removeItem(NAV_DRAFT_STORAGE_KEY);
      } catch {
        //
      }

      setFields(publishedFields);
      setGlobalValues(publishedGlobalValues);
      setNavigationContent(publishedNavigationContent);
      setHistory([publishedFields]);
      setHistoryIndex(0);
      setHasFieldChanges(false);
      setRepositionTarget(null);
      setTextPopoverState({ isOpen: false, fieldKeys: [] });
      applyFieldsToLiveDom(publishedFields, bootstrap.cardPrototypes);
      applyGlobalContentToLiveDom(publishedGlobalValues);
      if (publishedNavigationContent) {
        applyNavigationContentToLiveDom(publishedNavigationContent);
      }
      showToast("Rascunho local descartado. Versão publicada restaurada.");
    },
    [
      bootstrap.cardPrototypes,
      bootstrap.pageId,
      publishedFields,
      publishedGlobalValues,
      publishedNavigationContent,
      showToast,
    ],
  );

  const loadRevisions = useCallback(async () => {
    setRevisionsLoading(true);
    try {
      const response = await fetch(
        `/api/admin/inline-editor/revisions?pageId=${encodeURIComponent(bootstrap.pageId)}`,
        { cache: "no-store" },
      );
      const json = await response.json();
      if (response.ok && json?.ok && Array.isArray(json.revisions)) {
        setRevisions(json.revisions);
        if (json.publishedVersionId) setPublishedVersionId(json.publishedVersionId);
      }
    } catch {
      showToast("Não foi possível carregar o histórico de versões.", true);
    } finally {
      setRevisionsLoading(false);
    }
  }, [bootstrap.pageId, showToast]);

  const publishChanges = useCallback(async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      let nextGlobal = publishedGlobalValues;
      if (hasGlobalChanges) {
        const globalResponse = await fetch("/api/admin/inline-editor/global", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ values: globalValues }),
        });
        const globalJson = await globalResponse.json().catch(() => null);
        if (!globalResponse.ok || !globalJson?.ok) {
          throw new Error(globalJson?.error || "Não foi possível publicar os dados do rodapé.");
        }
        nextGlobal = (globalJson.values as Record<string, string>) ?? globalValues;
        try {
          localStorage.removeItem(GLOBAL_DRAFT_STORAGE_KEY);
        } catch {
          //
        }
        setPublishedGlobalValues(nextGlobal);
        setGlobalValues(nextGlobal);
      }

      if (hasNavigationChanges && navigationContent) {
        const navResponse = await fetch("/api/admin/inline-editor/navigation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: navigationContent }),
        });
        const navJson = await navResponse.json().catch(() => null);
        if (!navResponse.ok || !navJson?.ok) {
          throw new Error(navJson?.error || "Não foi possível publicar o menu de navegação.");
        }
        const nextNav = (navJson.content as InlineNavigationContent) ?? navigationContent;
        try {
          localStorage.removeItem(NAV_DRAFT_STORAGE_KEY);
        } catch {
          //
        }
        setPublishedNavigationContent(nextNav);
        setNavigationContent(nextNav);
      }

      let publishedVersionMeta: { version?: number; id?: string } | null = null;
      if (hasFieldChanges || (!hasGlobalChanges && !hasNavigationChanges)) {
        const response = await fetch("/api/admin/inline-editor/publish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pageId: bootstrap.pageId,
            patches: serializeEditableFields(fields),
          }),
        });
        const json = await response.json().catch(() => null);
        if (!response.ok || !json?.ok) {
          throw new Error(json?.error || "Não foi possível publicar as alterações.");
        }
        try {
          localStorage.removeItem(draftStorageKey(bootstrap.pageId));
        } catch {
          //
        }
        setPublishedFields(fields);
        setHasFieldChanges(false);
        publishedVersionMeta = json.version ?? null;
        if (json.version?.version) setVersionNumber(json.version.version);
        if (json.version?.id) setPublishedVersionId(json.version.id);
        void loadRevisions();
      }

      showToast(
        publishedVersionMeta?.version
          ? `Página publicada com sucesso (versão ${publishedVersionMeta.version})!`
          : hasNavigationChanges && !hasGlobalChanges
            ? "Menu global publicado com sucesso!"
            : "Alterações globais publicadas com sucesso!",
      );
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Erro ao publicar alterações.", true);
    } finally {
      setIsSaving(false);
    }
  }, [
    bootstrap.pageId,
    fields,
    globalValues,
    hasFieldChanges,
    hasGlobalChanges,
    hasNavigationChanges,
    isSaving,
    loadRevisions,
    navigationContent,
    publishedGlobalValues,
    showToast,
  ]);

  const restoreRevision = useCallback(
    async (versionId: string) => {
      if (!window.confirm("Deseja restaurar e publicar esta versão anterior?")) return;
      setIsSaving(true);
      try {
        const response = await fetch("/api/admin/inline-editor/restore", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pageId: bootstrap.pageId, versionId }),
        });
        const json = await response.json().catch(() => null);
        if (!response.ok || !json?.ok || !Array.isArray(json.fields)) {
          throw new Error(json?.error || "Não foi possível restaurar a versão.");
        }

        try {
          localStorage.removeItem(draftStorageKey(bootstrap.pageId));
        } catch {
          //
        }

        const nextFields = json.fields as EditablePageField[];
        setPublishedFields(nextFields);
        setFields(nextFields);
        setHistory([nextFields]);
        setHistoryIndex(0);
        setHasFieldChanges(false);
        if (json.version?.version) setVersionNumber(json.version.version);
        if (json.version?.id) setPublishedVersionId(json.version.id);
        setRevisionsModalOpen(false);
        applyFieldsToLiveDom(nextFields, bootstrap.cardPrototypes);
        showToast(`Versão restaurada e publicada (v${json.version?.version ?? ""})!`);
        void loadRevisions();
      } catch (error) {
        showToast(error instanceof Error ? error.message : "Erro ao restaurar versão.", true);
      } finally {
        setIsSaving(false);
      }
    },
    [bootstrap.cardPrototypes, bootstrap.pageId, loadRevisions, showToast],
  );

  const openMediaModal = useCallback(
    (options: Omit<MediaModalState, "isOpen">) => {
      if (!bootstrap.canEditMedia) return;
      setMediaModalState({ isOpen: true, ...options });
    },
    [bootstrap.canEditMedia],
  );

  const closeMediaModal = useCallback(() => {
    setMediaModalState({ isOpen: false });
  }, []);

  const openLinkModal = useCallback((options: Omit<LinkModalState, "isOpen">) => {
    setLinkModalState({ isOpen: true, ...options });
  }, []);

  const closeLinkModal = useCallback(() => {
    setLinkModalState({ isOpen: false });
  }, []);

  const openTextPopover = useCallback((options: Omit<TextPopoverState, "isOpen">) => {
    setTextPopoverState({ isOpen: true, ...options });
  }, []);

  const closeTextPopover = useCallback(() => {
    setTextPopoverState({ isOpen: false, fieldKeys: [] });
  }, []);

  return (
    <InlineEditorContext.Provider
      value={{
        bootstrap,
        isEditing,
        isDevicePreviewFrame,
        setIsEditing,
        previewMode,
        setPreviewMode,
        viewport,
        setViewport,
        fields,
        fieldsByKey,
        versionNumber,
        publishedVersionId,
        hasUnsavedChanges,
        hasLocalDraft,
        isSaving,
        toast,
        undo,
        redo,
        canUndo: historyIndex > 0,
        canRedo: historyIndex < history.length - 1,
        updateTextField,
        updateRichTextField,
        updateImageField,
        updateImagePositionField,
        updateLinkField,
        updateBackgroundField,
        updateIndicatorsField,
        updateClientLogosField,
        updateDirectorCardsField,
        updateCardListField,
        updateHomeSolutionCard,
        globalValues,
        hasGlobalChanges,
        updateGlobalValue,
        navigationContent,
        hasNavigationChanges,
        updateNavigationContent,
        repositionTarget,
        setRepositionTarget,
        moveSection,
        discardDraft,
        publishChanges,
        mediaModalState,
        openMediaModal,
        closeMediaModal,
        linkModalState,
        openLinkModal,
        closeLinkModal,
        textPopoverState,
        openTextPopover,
        closeTextPopover,
        revisionsModalOpen,
        setRevisionsModalOpen,
        revisions,
        revisionsLoading,
        loadRevisions,
        restoreRevision,
      }}
    >
      {children}
    </InlineEditorContext.Provider>
  );
}

export function useInlineEditor() {
  const ctx = useContext(InlineEditorContext);
  if (!ctx) {
    throw new Error("useInlineEditor must be used within InlineEditorProvider");
  }
  return ctx;
}
