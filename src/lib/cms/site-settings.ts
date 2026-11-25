export type SiteTheme = {
  brandPrimary: string;
  brandSecondary: string;
  backgroundPage: string;
  backgroundPrimary: string;
  backgroundSecondary: string;
  backgroundDeep: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
};

export const DEFAULT_SITE_THEME: SiteTheme = {
  brandPrimary: "#67a8b8",
  brandSecondary: "#00ace4",
  backgroundPage: "#ffffff",
  backgroundPrimary: "#071429",
  backgroundSecondary: "#0a1b33",
  backgroundDeep: "#020b18",
  textPrimary: "#071429",
  textSecondary: "#52627a",
  textMuted: "#8fa3bc",
};

export function normalizeSiteColor(value: string): string {
  const normalized = value.trim().toLowerCase();
  if (!/^#[0-9a-f]{6}$/.test(normalized)) {
    throw new Error("Informe uma cor hex válida no formato #RRGGBB.");
  }
  return normalized;
}

export function hexToRgb(value: string): string {
  const normalized = normalizeSiteColor(value);
  const red = Number.parseInt(normalized.slice(1, 3), 16);
  const green = Number.parseInt(normalized.slice(3, 5), 16);
  const blue = Number.parseInt(normalized.slice(5, 7), 16);
  return `${red}, ${green}, ${blue}`;
}
