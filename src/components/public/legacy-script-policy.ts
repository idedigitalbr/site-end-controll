export type LegacyScriptDescriptor = {
  attributes: Record<string, string>;
  content: string;
};

export type LegacyReadyCallback = {
  target: "document" | "window";
  event: "DOMContentLoaded" | "load";
};

const readyCallbackExpression = /\b(document|window)\s*\.\s*addEventListener\s*\(\s*(['"])(DOMContentLoaded|load)\2\s*,/g;

export function legacyReadyCallbacks(content: string): LegacyReadyCallback[] {
  return Array.from(content.matchAll(readyCallbackExpression), (match) => ({
    target: match[1] as LegacyReadyCallback["target"],
    event: match[3] as LegacyReadyCallback["event"],
  }));
}
