"use client";

import { useEffect, useRef } from "react";

import { legacyReadyCallbacks, type LegacyScriptDescriptor } from "@/components/public/legacy-script-policy";

type Listener = EventListenerOrEventListenerObject | null;
type ListenerOptions = boolean | AddEventListenerOptions | undefined;
type AddListener = (type: string, listener: Listener, options?: ListenerOptions) => void;

function invokeListener(target: Document | Window, type: string, listener: Listener) {
  if (!listener) return;
  const event = new Event(type);
  if (typeof listener === "function") listener.call(target, event);
  else listener.handleEvent(event);
}

function isReadyEvent(type: string) {
  if (type === "DOMContentLoaded") return document.readyState !== "loading";
  if (type === "load") return document.readyState === "complete";
  return false;
}

function withLegacyReadyCallbacks(script: HTMLScriptElement, holder: HTMLElement) {
  const code = script.textContent ?? "";
  if (legacyReadyCallbacks(code).length === 0) {
    holder.append(script);
    return;
  }

  const documentDescriptor = Object.getOwnPropertyDescriptor(document, "addEventListener");
  const windowDescriptor = Object.getOwnPropertyDescriptor(window, "addEventListener");
  const nativeDocumentAdd = document.addEventListener.bind(document) as AddListener;
  const nativeWindowAdd = window.addEventListener.bind(window) as AddListener;

  const readyAwareAdd = (target: Document | Window, nativeAdd: AddListener): AddListener =>
    (type, listener, options) => {
      const signal = typeof options === "object" ? options.signal : undefined;
      if (isReadyEvent(type) && !signal?.aborted) {
        invokeListener(target, type, listener);
        return;
      }
      nativeAdd(type, listener, options);
    };

  Object.defineProperty(document, "addEventListener", {
    configurable: true,
    writable: true,
    value: readyAwareAdd(document, nativeDocumentAdd),
  });
  Object.defineProperty(window, "addEventListener", {
    configurable: true,
    writable: true,
    value: readyAwareAdd(window, nativeWindowAdd),
  });

  try {
    holder.append(script);
  } finally {
    if (documentDescriptor) Object.defineProperty(document, "addEventListener", documentDescriptor);
    else Reflect.deleteProperty(document, "addEventListener");
    if (windowDescriptor) Object.defineProperty(window, "addEventListener", windowDescriptor);
    else Reflect.deleteProperty(window, "addEventListener");
  }
}

function makeScript(descriptor: LegacyScriptDescriptor) {
  const script = document.createElement("script");
  for (const [name, value] of Object.entries(descriptor.attributes)) {
    if (!name.toLowerCase().startsWith("on")) script.setAttribute(name, value);
  }
  return script;
}

function appendExternalScript(holder: HTMLElement, script: HTMLScriptElement, source: string) {
  script.async = false;
  script.src = source;

  return new Promise<boolean>((resolve) => {
    let runtimeFailed = false;
    const detectRuntimeError = (event: ErrorEvent) => {
      if (document.currentScript === script || (event.filename && event.filename === script.src)) {
        runtimeFailed = true;
      }
    };
    const finish = (loaded: boolean) => {
      window.removeEventListener("error", detectRuntimeError);
      resolve(loaded && !runtimeFailed);
    };

    window.addEventListener("error", detectRuntimeError);
    script.addEventListener("load", () => finish(true), { once: true });
    script.addEventListener("error", () => finish(false), { once: true });
    holder.append(script);
  });
}

function appendInlineScript(holder: HTMLElement, script: HTMLScriptElement, content: string): ErrorEvent | null {
  script.textContent = content;
  let runtimeError: ErrorEvent | null = null;
  const recordError = (event: ErrorEvent) => {
    runtimeError = event;
  };

  window.addEventListener("error", recordError, { once: true });
  try {
    withLegacyReadyCallbacks(script, holder);
  } finally {
    window.removeEventListener("error", recordError);
  }

  return runtimeError;
}

async function executeLegacyScripts(holder: HTMLElement, scripts: LegacyScriptDescriptor[]) {
  let failed = false;

  for (const descriptor of scripts) {
    if (!holder.isConnected) return failed;

    const script = makeScript(descriptor);
    const hasSource = Object.prototype.hasOwnProperty.call(descriptor.attributes, "src");
    if (hasSource) {
      const source = descriptor.attributes.src;
      const loaded = await appendExternalScript(holder, script, source);
      if (!loaded) {
        failed = true;
        console.error(`[cms] Falha ao carregar o script original ${source}.`);
      }
      continue;
    }

    const error = appendInlineScript(holder, script, descriptor.content);
    if (error) {
      failed = true;
      console.error("[cms] Falha ao executar um script inline do template original.", error.error ?? error.message);
    }
  }

  return failed;
}

export function LegacyScriptBootstrap({
  pageKey,
  scripts,
}: {
  pageKey: string;
  scripts: LegacyScriptDescriptor[];
}) {
  const holderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const holder = holderRef.current;
    if (!holder || holder.dataset.endcontrolLegacyScriptsLoaded === pageKey) return;

    const root = document.documentElement;
    holder.replaceChildren();
    holder.dataset.endcontrolLegacyScriptSequence = pageKey;
    holder.dataset.endcontrolLegacyScriptsLoaded = pageKey;
    delete root.dataset.endcontrolReady;
    delete root.dataset.endcontrolError;

    void executeLegacyScripts(holder, scripts).then((failed) => {
      if (!holder.isConnected) return;
      if (failed) root.dataset.endcontrolError = "true";
      root.dataset.endcontrolReady = "true";
    }).catch((error: unknown) => {
      if (!holder.isConnected) return;
      root.dataset.endcontrolError = "true";
      root.dataset.endcontrolReady = "true";
      console.error("[cms] Falha ao executar a sequência de scripts originais.", error);
    });
  }, [pageKey, scripts]);

  return <div hidden ref={holderRef} data-endcontrol-legacy-script-sequence={pageKey} />;
}
