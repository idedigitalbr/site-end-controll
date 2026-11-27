"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Link2,
  X,
} from "lucide-react";

import {
  isSafeEditableLink,
  type InlineNavigationContent,
  type InlineNavigationGroupId,
  type InlineNavigationPrimaryId,
} from "@/lib/cms/inline-editor-types";
import { useInlineEditor } from "./inline-editor-context";
import { stripControlChars } from "./inline-editor-dom";

type HoveredNavTarget =
  | {
      kind: "primary";
      id: InlineNavigationPrimaryId;
      rect: DOMRect;
    }
  | {
      kind: "group";
      groupId: InlineNavigationGroupId;
      rect: DOMRect;
    }
  | {
      kind: "service";
      groupId: InlineNavigationGroupId;
      serviceId: string;
      rect: DOMRect;
    };

function placeCaretEnd(el: HTMLElement) {
  const sel = window.getSelection();
  if (!sel) return;
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  sel.removeAllRanges();
  sel.addRange(range);
}

export function InlineNavigationEditor() {
  const {
    bootstrap,
    isEditing,
    previewMode,
    isDevicePreviewFrame,
    navigationContent,
    updateNavigationContent,
  } = useInlineEditor();

  const active =
    isEditing &&
    !previewMode &&
    !isDevicePreviewFrame &&
    bootstrap.canEditMedia &&
    Boolean(navigationContent);

  const [hovered, setHovered] = useState<HoveredNavTarget | null>(null);
  const [submenuPinned, setSubmenuPinned] = useState(false);
  const [linkEdit, setLinkEdit] = useState<{
    targetKind: "primary" | "service";
    id: string;
    groupId?: InlineNavigationGroupId;
    value: string;
  } | null>(null);

  const navCleanupRef = useRef<((commit: boolean) => void) | null>(null);
  const hoveredNodeRef = useRef<HTMLElement | null>(null);
  const navRef = useRef<InlineNavigationContent | null>(navigationContent);
  navRef.current = navigationContent;

  const toggleSubmenuOpen = useCallback((force?: boolean) => {
    const dropdown = document.querySelector<HTMLElement>("header.site-header .main-menu .dropdown");
    if (!dropdown) return;
    const next = force !== undefined ? force : !dropdown.classList.contains("is-open");
    dropdown.classList.toggle("is-open", next);
    const trigger = dropdown.querySelector<HTMLElement>(".drop-link");
    trigger?.setAttribute("aria-expanded", String(next));
    setSubmenuPinned(next);
  }, []);

  const beginNavTextEdit = useCallback(
    (
      element: HTMLElement,
      onCommit: (nextText: string) => void,
      options?: { isButton?: boolean; maxLen?: number },
    ) => {
      if (element.dataset.ecInlineActive === "true") return;
      navCleanupRef.current?.(true);

      let editTarget = element;
      let tempSpan: HTMLSpanElement | null = null;
      let replacedTextNode: Text | null = null;
      const maxLen = options?.maxLen ?? 120;

      // For .drop-link button which also contains <svg class="menu-chevron">
      const firstTextNode = Array.from(element.childNodes).find(
        (n): n is Text => n.nodeType === Node.TEXT_NODE && Boolean((n as Text).data.trim()),
      );
      const originalText = (firstTextNode?.data ?? element.textContent ?? "").trim();

      if (element.children.length > 0 && firstTextNode) {
        replacedTextNode = firstTextNode;
        tempSpan = document.createElement("span");
        tempSpan.dataset.ecInlineActive = "true";
        tempSpan.dataset.ecInlineTemp = "true";
        tempSpan.setAttribute("contenteditable", "true");
        tempSpan.textContent = originalText;
        element.replaceChild(tempSpan, firstTextNode);
        editTarget = tempSpan;
      } else {
        element.dataset.ecInlineActive = "true";
        element.setAttribute("contenteditable", "true");
      }

      editTarget.focus();
      placeCaretEnd(editTarget);

      let finished = false;
      const finish = (commit: boolean) => {
        if (finished) return;
        finished = true;
        navCleanupRef.current = null;
        editTarget.removeEventListener("blur", onBlur);
        editTarget.removeEventListener("keydown", onKeyDown);
        editTarget.removeEventListener("keyup", onKeyUp);
        editTarget.removeEventListener("paste", onPaste);

        const nextText = stripControlChars(editTarget.textContent ?? "")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, maxLen);
        const finalText = commit && nextText ? nextText : originalText;

        if (tempSpan && replacedTextNode) {
          if (tempSpan.parentNode === element) {
            element.replaceChild(document.createTextNode(finalText), tempSpan);
          }
        } else {
          delete element.dataset.ecInlineActive;
          element.removeAttribute("contenteditable");
          element.textContent = finalText;
        }

        if (commit && nextText && nextText !== originalText) {
          onCommit(finalText);
        }
      };

      const onPaste = (event: ClipboardEvent) => {
        event.preventDefault();
        const plain = stripControlChars(event.clipboardData?.getData("text/plain") ?? "");
        if (!plain) return;
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return;
        const range = sel.getRangeAt(0);
        range.deleteContents();
        const node = document.createTextNode(plain.slice(0, maxLen));
        range.insertNode(node);
        range.setStartAfter(node);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      };

      const onBlur = () => finish(true);

      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          finish(false);
          return;
        }
        if (event.key === "Enter") {
          event.preventDefault();
          event.stopPropagation();
          finish(true);
          return;
        }
        if (event.key === " " && options?.isButton) {
          event.preventDefault();
          event.stopPropagation();
          const sel = window.getSelection();
          if (sel && sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            range.deleteContents();
            const spaceNode = document.createTextNode(" ");
            range.insertNode(spaceNode);
            range.setStartAfter(spaceNode);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }
      };

      const onKeyUp = (event: KeyboardEvent) => {
        if (event.key === " " && options?.isButton) {
          event.preventDefault();
          event.stopPropagation();
        }
      };

      navCleanupRef.current = finish;
      editTarget.addEventListener("blur", onBlur);
      editTarget.addEventListener("keydown", onKeyDown);
      editTarget.addEventListener("keyup", onKeyUp);
      editTarget.addEventListener("paste", onPaste);
    },
    [],
  );

  useEffect(() => {
    if (!active) {
      setHovered(null);
      setLinkEdit(null);
      navCleanupRef.current?.(true);
      return;
    }

    const handleMouseOver = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      if (event.target.closest(".ec-ie-nav-toolbar")) return;
      if (!event.target.closest('header[data-ec-nav-inline="true"]')) {
        if (!linkEdit && hoveredNodeRef.current) {
          hoveredNodeRef.current = null;
          setHovered(null);
        }
        return;
      }

      const serviceEl = event.target.closest(
        ".menu-service-item[data-service-id]",
      ) as HTMLElement | null;
      if (serviceEl) {
        const groupEl = serviceEl.closest(".menu-group[data-ec-nav-group-id]") as HTMLElement | null;
        const groupId = groupEl?.getAttribute("data-ec-nav-group-id") as InlineNavigationGroupId | null;
        const serviceId = serviceEl.getAttribute("data-service-id");
        if (groupId && serviceId && hoveredNodeRef.current !== serviceEl) {
          hoveredNodeRef.current = serviceEl;
          setHovered({
            kind: "service",
            groupId,
            serviceId,
            rect: serviceEl.getBoundingClientRect(),
          });
        }
        return;
      }

      const groupEl = event.target.closest(".menu-group[data-ec-nav-group-id]") as HTMLElement | null;
      if (groupEl) {
        const groupId = groupEl.getAttribute("data-ec-nav-group-id") as InlineNavigationGroupId | null;
        if (groupId && hoveredNodeRef.current !== groupEl) {
          hoveredNodeRef.current = groupEl;
          setHovered({
            kind: "group",
            groupId,
            rect: groupEl.getBoundingClientRect(),
          });
        }
        return;
      }

      const primaryEl = event.target.closest("[data-ec-nav-primary-id]") as HTMLElement | null;
      if (primaryEl) {
        const id = primaryEl.getAttribute("data-ec-nav-primary-id") as InlineNavigationPrimaryId | null;
        if (id && hoveredNodeRef.current !== primaryEl) {
          hoveredNodeRef.current = primaryEl;
          setHovered({
            kind: "primary",
            id,
            rect: primaryEl.getBoundingClientRect(),
          });
        }
      }
    };

    const handleClickCapture = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      if (event.target.closest(".ec-ie-nav-toolbar")) return;
      const header = event.target.closest('header[data-ec-nav-inline="true"]');
      if (!header) return;

      if (event.target.closest("a")) {
        event.preventDefault();
      }
      if (event.target.closest('[data-ec-inline-active="true"]')) return;

      const currentNav = navRef.current;
      if (!currentNav) return;

      // 1. Submenu service item label
      const serviceEl = event.target.closest(
        ".menu-service-item[data-service-id]",
      ) as HTMLElement | null;
      if (serviceEl) {
        const groupEl = serviceEl.closest(".menu-group[data-ec-nav-group-id]") as HTMLElement | null;
        const groupId = groupEl?.getAttribute("data-ec-nav-group-id") as InlineNavigationGroupId | null;
        const serviceId = serviceEl.getAttribute("data-service-id");
        const labelEl =
          serviceEl.querySelector<HTMLElement>(".dropdown-item-text") ??
          serviceEl.querySelector<HTMLElement>(
            "span:not(.submenuzinho-bullet):not(.dropdown-item-logo)",
          );
        if (groupId && serviceId && labelEl) {
          event.preventDefault();
          event.stopPropagation();
          beginNavTextEdit(
            labelEl,
            (nextText) => {
              const latest = navRef.current;
              if (!latest) return;
              updateNavigationContent({
                ...latest,
                groups: latest.groups.map((g) =>
                  g.id === groupId
                    ? {
                        ...g,
                        services: g.services.map((s) =>
                          s.id === serviceId ? { ...s, label: nextText } : s,
                        ),
                      }
                    : g,
                ),
              });
            },
            { maxLen: 140 },
          );
          return;
        }
      }

      // 2. Submenu group title or description
      const groupEl = event.target.closest(".menu-group[data-ec-nav-group-id]") as HTMLElement | null;
      if (groupEl) {
        const groupId = groupEl.getAttribute("data-ec-nav-group-id") as InlineNavigationGroupId | null;
        const titleBtn = event.target.closest(".menu-group-title");
        const titleSpan = groupEl.querySelector<HTMLElement>(".menu-group-title > span");
        const descEl = event.target.closest(".menu-group-description") as HTMLElement | null;

        if (groupId && titleBtn && titleSpan) {
          event.preventDefault();
          event.stopPropagation();
          beginNavTextEdit(
            titleSpan,
            (nextText) => {
              const latest = navRef.current;
              if (!latest) return;
              updateNavigationContent({
                ...latest,
                groups: latest.groups.map((g) =>
                  g.id === groupId ? { ...g, title: nextText } : g,
                ),
              });
            },
            { isButton: true, maxLen: 100 },
          );
          return;
        }
        if (groupId && descEl) {
          event.preventDefault();
          event.stopPropagation();
          beginNavTextEdit(
            descEl,
            (nextText) => {
              const latest = navRef.current;
              if (!latest) return;
              updateNavigationContent({
                ...latest,
                groups: latest.groups.map((g) =>
                  g.id === groupId ? { ...g, description: nextText } : g,
                ),
              });
            },
            { maxLen: 240 },
          );
          return;
        }
      }

      // 3. Primary menu item
      const primaryEl = event.target.closest("[data-ec-nav-primary-id]") as HTMLElement | null;
      if (primaryEl) {
        const primaryId = primaryEl.getAttribute(
          "data-ec-nav-primary-id",
        ) as InlineNavigationPrimaryId | null;
        if (primaryId) {
          event.preventDefault();
          event.stopPropagation();
          const targetEl =
            primaryId === "solutions"
              ? primaryEl.querySelector<HTMLElement>(".drop-link") ?? primaryEl
              : primaryEl;
          beginNavTextEdit(
            targetEl,
            (nextText) => {
              const latest = navRef.current;
              if (!latest) return;
              updateNavigationContent({
                ...latest,
                primary: latest.primary.map((p) =>
                  p.id === primaryId ? { ...p, label: nextText } : p,
                ),
              });
            },
            { isButton: targetEl.tagName === "BUTTON", maxLen: 100 },
          );
        }
      }
    };

    document.addEventListener("mouseover", handleMouseOver, true);
    document.addEventListener("click", handleClickCapture, true);
    return () => {
      document.removeEventListener("mouseover", handleMouseOver, true);
      document.removeEventListener("click", handleClickCapture, true);
    };
  }, [active, beginNavTextEdit, linkEdit, updateNavigationContent]);

  if (!active || !navigationContent || !hovered) return null;

  const movePrimary = (id: InlineNavigationPrimaryId, delta: -1 | 1) => {
    const idx = navigationContent.primary.findIndex((p) => p.id === id);
    const target = idx + delta;
    if (idx < 0 || target < 0 || target >= navigationContent.primary.length) return;
    const nextPrimary = [...navigationContent.primary];
    [nextPrimary[idx], nextPrimary[target]] = [nextPrimary[target], nextPrimary[idx]];
    updateNavigationContent({ ...navigationContent, primary: nextPrimary });
  };

  const moveGroup = (groupId: InlineNavigationGroupId, delta: -1 | 1) => {
    const idx = navigationContent.groups.findIndex((g) => g.id === groupId);
    const target = idx + delta;
    if (idx < 0 || target < 0 || target >= navigationContent.groups.length) return;
    const nextGroups = [...navigationContent.groups];
    [nextGroups[idx], nextGroups[target]] = [nextGroups[target], nextGroups[idx]];
    updateNavigationContent({ ...navigationContent, groups: nextGroups });
  };

  const moveService = (groupId: InlineNavigationGroupId, serviceId: string, delta: -1 | 1) => {
    const group = navigationContent.groups.find((g) => g.id === groupId);
    if (!group) return;
    const idx = group.services.findIndex((s) => s.id === serviceId);
    const target = idx + delta;
    if (idx < 0 || target < 0 || target >= group.services.length) return;
    const nextServices = [...group.services];
    [nextServices[idx], nextServices[target]] = [nextServices[target], nextServices[idx]];
    updateNavigationContent({
      ...navigationContent,
      groups: navigationContent.groups.map((g) =>
        g.id === groupId ? { ...g, services: nextServices } : g,
      ),
    });
  };

  const saveLinkEdit = () => {
    if (!linkEdit) return;
    const trimmed = linkEdit.value.trim();
    if (!trimmed || !isSafeEditableLink(trimmed)) return;
    if (linkEdit.targetKind === "primary") {
      updateNavigationContent({
        ...navigationContent,
        primary: navigationContent.primary.map((p) =>
          p.id === linkEdit.id && p.href !== null ? { ...p, href: trimmed } : p,
        ),
      });
    } else if (linkEdit.groupId) {
      updateNavigationContent({
        ...navigationContent,
        groups: navigationContent.groups.map((g) =>
          g.id === linkEdit.groupId
            ? {
                ...g,
                services: g.services.map((s) =>
                  s.id === linkEdit.id ? { ...s, href: trimmed } : s,
                ),
              }
            : g,
        ),
      });
    }
    setLinkEdit(null);
  };

  const top = Math.max(50, Math.min(hovered.rect.bottom + 4, window.innerHeight - 60));
  const left = Math.max(12, Math.min(hovered.rect.left, window.innerWidth - 280));

  const primaryIdx =
    hovered.kind === "primary"
      ? navigationContent.primary.findIndex((p) => p.id === hovered.id)
      : -1;
  const primaryItem = primaryIdx >= 0 ? navigationContent.primary[primaryIdx] : null;

  const groupIdx =
    hovered.kind === "group"
      ? navigationContent.groups.findIndex((g) => g.id === hovered.groupId)
      : -1;

  const serviceGroup =
    hovered.kind === "service"
      ? navigationContent.groups.find((g) => g.id === hovered.groupId)
      : null;
  const serviceIdx =
    hovered.kind === "service" && serviceGroup
      ? serviceGroup.services.findIndex((s) => s.id === hovered.serviceId)
      : -1;
  const serviceItem =
    hovered.kind === "service" && serviceGroup && serviceIdx >= 0
      ? serviceGroup.services[serviceIdx]
      : null;

  const linkInputValid = !linkEdit || (Boolean(linkEdit.value.trim()) && isSafeEditableLink(linkEdit.value.trim()));

  return (
    <div
      aria-label="Controles de navegação inline"
      className="ec-ie-nav-toolbar ec-ie-ui"
      role="toolbar"
      style={{ top: `${top}px`, left: `${left}px` }}
    >
      {hovered.kind === "primary" && primaryItem ? (
        <>
          <span className="ec-ie-nav-badge">Menu</span>
          <button
            aria-label="Mover item do menu para esquerda"
            className="ec-ie-card-tool-btn"
            disabled={primaryIdx <= 0}
            onClick={() => movePrimary(primaryItem.id, -1)}
            title="Mover esquerda"
            type="button"
          >
            <ChevronLeft size={13} />
          </button>
          <button
            aria-label="Mover item do menu para direita"
            className="ec-ie-card-tool-btn"
            disabled={primaryIdx >= navigationContent.primary.length - 1}
            onClick={() => movePrimary(primaryItem.id, 1)}
            title="Mover direita"
            type="button"
          >
            <ChevronRight size={13} />
          </button>
          {primaryItem.href !== null ? (
            <button
              aria-label="Editar destino do link do menu"
              className="ec-ie-card-tool-btn"
              onClick={() =>
                setLinkEdit({
                  targetKind: "primary",
                  id: primaryItem.id,
                  value: primaryItem.href ?? "",
                })
              }
              title="Editar URL"
              type="button"
            >
              <Link2 size={13} />
            </button>
          ) : (
            <button
              className="ec-ie-nav-sub-btn"
              onClick={() => toggleSubmenuOpen()}
              title="Abrir ou fechar submenu para editar soluções"
              type="button"
            >
              <span>{submenuPinned ? "Fechar Submenu" : "Editar Submenu"}</span>
            </button>
          )}
        </>
      ) : null}

      {hovered.kind === "group" ? (
        <>
          <span className="ec-ie-nav-badge">Grupo</span>
          <button
            aria-label="Mover grupo para esquerda"
            className="ec-ie-card-tool-btn"
            disabled={groupIdx <= 0}
            onClick={() => moveGroup(hovered.groupId, -1)}
            title="Mover grupo esquerda"
            type="button"
          >
            <ChevronLeft size={13} />
          </button>
          <button
            aria-label="Mover grupo para direita"
            className="ec-ie-card-tool-btn"
            disabled={groupIdx >= navigationContent.groups.length - 1}
            onClick={() => moveGroup(hovered.groupId, 1)}
            title="Mover grupo direita"
            type="button"
          >
            <ChevronRight size={13} />
          </button>
        </>
      ) : null}

      {hovered.kind === "service" && serviceItem && serviceGroup ? (
        <>
          <span className="ec-ie-nav-badge">Solução</span>
          <button
            aria-label="Subir solução no submenu"
            className="ec-ie-card-tool-btn"
            disabled={serviceIdx <= 0}
            onClick={() => moveService(serviceGroup.id, serviceItem.id, -1)}
            title="Subir item"
            type="button"
          >
            <ChevronUp size={13} />
          </button>
          <button
            aria-label="Descer solução no submenu"
            className="ec-ie-card-tool-btn"
            disabled={serviceIdx >= serviceGroup.services.length - 1}
            onClick={() => moveService(serviceGroup.id, serviceItem.id, 1)}
            title="Descer item"
            type="button"
          >
            <ChevronDown size={13} />
          </button>
          <button
            aria-label="Editar URL do serviço"
            className="ec-ie-card-tool-btn"
            onClick={() =>
              setLinkEdit({
                targetKind: "service",
                id: serviceItem.id,
                groupId: serviceGroup.id,
                value: serviceItem.href,
              })
            }
            title="Editar URL"
            type="button"
          >
            <Link2 size={13} />
          </button>
        </>
      ) : null}

      {linkEdit ? (
        <div className="ec-ie-nav-link-bar">
          <input
            autoFocus
            className={`ec-ie-nav-link-input ${!linkInputValid ? "is-invalid" : ""}`}
            maxLength={2048}
            onChange={(e) => setLinkEdit({ ...linkEdit, value: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter" && linkInputValid) saveLinkEdit();
              if (e.key === "Escape") setLinkEdit(null);
            }}
            placeholder="Ex: sobre-nos.html ou https://..."
            type="text"
            value={linkEdit.value}
          />
          <button
            aria-label="Aplicar URL"
            className="ec-ie-card-tool-btn"
            disabled={!linkInputValid}
            onClick={saveLinkEdit}
            title="Aplicar"
            type="button"
          >
            <Check size={13} color="#34d399" />
          </button>
          <button
            aria-label="Cancelar"
            className="ec-ie-card-tool-btn"
            onClick={() => setLinkEdit(null)}
            title="Cancelar"
            type="button"
          >
            <X size={13} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
