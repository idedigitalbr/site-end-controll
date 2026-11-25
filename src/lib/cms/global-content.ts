import { load } from "cheerio";

export const globalContentFields = [
  { key: "address1", label: "Endereço — linha 1", value: "Av. Paulista, 1471" },
  { key: "address2", label: "Endereço — linha 2", value: "Edifício Barão de Cristina" },
  { key: "address3", label: "Endereço — linha 3", value: "Bela Vista, São Paulo - SP" },
  { key: "city", label: "Cidade", value: "São Paulo" },
  { key: "state", label: "Estado (UF)", value: "SP" },
  { key: "postalCode", label: "CEP", value: "CEP: 01311-927" },
  { key: "phoneLabel", label: "Telefone exibido", value: "(91) 9.8404-0710" },
  { key: "whatsapp", label: "WhatsApp com país e DDD (somente números)", value: "5591984040710" },
  { key: "email", label: "E-mail de contato", value: "contato@endcontrol.com.br" },
  { key: "instagram", label: "URL do Instagram", value: "https://www.instagram.com/endcontrol" },
  { key: "linkedin", label: "URL do LinkedIn", value: "https://www.linkedin.com/company/endcontrol" },
  { key: "copyright", label: "Direitos autorais", value: "Copyright © 2026 ENDCONTROL Engenharia – Todos os direitos reservados." },
] as const;

export function normalizeGlobalContent(input: Record<string, unknown>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const field of globalContentFields) {
    const raw = input[field.key];
    if (typeof raw !== "string" || !raw.trim() || raw.length > 500) throw new Error(`Confira o campo ${field.label}.`);
    const value = raw.trim();
    if (field.key === "whatsapp" && !/^\d{10,15}$/.test(value)) throw new Error("Informe o WhatsApp com país e DDD.");
    if (field.key === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) throw new Error("Informe um e-mail válido.");
    if (field.key === "state" && !/^[a-z]{2}$/i.test(value)) throw new Error("Informe a UF com duas letras.");
    if (["instagram", "linkedin"].includes(field.key)) {
      const url = new URL(value);
      if (url.protocol !== "https:" || url.username || url.password) throw new Error("Use um link HTTPS válido para a rede social.");
    }
    result[field.key] = value;
  }
  return result;
}

export function applyGlobalContent(markup: string, values: Record<string, string> | null): string {
  if (!values) return markup;
  const settings = { ...Object.fromEntries(globalContentFields.map(field => [field.key, field.value])), ...values };
  const $ = load(markup.replace(/^\uFEFF/, ""));
  for (const [index, key] of ["address1", "address2", "address3", "postalCode"].entries()) {
    if (settings[key]) $(".footer-location-details p").eq(index).text(settings[key]);
  }
  if (settings.phoneLabel) $(".footer-phone-number").text(settings.phoneLabel);
  if (settings.copyright) $(".copyright-left").text(settings.copyright);
  if (settings.email) {
    $(".footer-email-row span").text(settings.email);
    $('a[href^="mailto:"]').attr("href", `mailto:${settings.email}`);
  }
  if (settings.whatsapp) $('a[href*="api.whatsapp.com/send"], a[href^="https://wa.me/"]').each((_, element) => {
    const old = new URL($(element).attr("href")!);
    const next = new URL("https://api.whatsapp.com/send");
    next.searchParams.set("phone", settings.whatsapp);
    if (old.searchParams.has("text")) next.searchParams.set("text", old.searchParams.get("text")!);
    $(element).attr("href", next.toString());
  });
  if (settings.instagram) $('footer a[aria-label="Instagram"]').attr("href", settings.instagram);
  if (settings.linkedin) $('footer a[aria-label="LinkedIn"]').attr("href", settings.linkedin);
  $('script[type="application/ld+json"]').each((_, element) => {
    try {
      const data = JSON.parse($(element).html() ?? "null");
      function update(value: unknown) {
        if (Array.isArray(value)) { value.forEach(update); return; }
        if (!value || typeof value !== "object") return;
        const item = value as Record<string, unknown>;
        const types = Array.isArray(item["@type"]) ? item["@type"] : [item["@type"]];
        if (types.some(type => ["Organization", "LocalBusiness", "ProfessionalService"].includes(String(type)))) {
          item.email = settings.email;
          item.telephone = settings.phoneLabel;
          if (item.address && typeof item.address === "object" && !Array.isArray(item.address)) {
            Object.assign(item.address, { streetAddress: `${settings.address1}, ${settings.address2}`, addressLocality: settings.city, addressRegion: settings.state, postalCode: settings.postalCode.replace(/^CEP:\s*/i, "") });
          }
          item.sameAs = [...new Set([...(Array.isArray(item.sameAs) ? item.sameAs.filter(url => typeof url === "string" && !/instagram\.com|linkedin\.com/i.test(url)) : []), settings.instagram, settings.linkedin])];
        }
        if (types.includes("ContactPoint")) { item.telephone = settings.phoneLabel; item.email = settings.email; }
        Object.values(item).forEach(update);
      }
      update(data);
      $(element).text(JSON.stringify(data).replaceAll("<", "\\u003c").replaceAll(">", "\\u003e").replaceAll("&", "\\u0026"));
    } catch { /* Keep malformed original structured data untouched. */ }
  });
  return $.html();
}
