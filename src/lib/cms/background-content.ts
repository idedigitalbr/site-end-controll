export const backgroundFields = [
  { key: "menu", label: "Menu de soluções — desktop e celular", source: "../../assets/Paginas/HOME/S1-TOPO-HERO/megamenu-foto.webp" },
] as const;

export function normalizeBackgroundContent(input: Record<string, unknown>) {
  const values: Record<string, string> = {};
  for (const field of backgroundFields) {
    const value = input[field.key];
    if (typeof value !== "string" || (value !== "" && !/^\/media\/[0-9a-f-]{36}\.(?:png|jpg|webp|gif|avif)$/i.test(value))) throw new Error("Selecione uma imagem da biblioteca ou mantenha a original.");
    values[field.key] = value;
  }
  return values;
}

export function applyBackgroundOverrides(css: string, values: Record<string, string> | null) {
  if (!values) return css;
  let result = css;
  for (const field of backgroundFields) {
    const value = values[field.key];
    if (value && /^\/media\/[0-9a-f-]{36}\.(?:png|jpg|webp|gif|avif)$/i.test(value)) result = result.replaceAll(field.source, value);
  }
  return result;
}
