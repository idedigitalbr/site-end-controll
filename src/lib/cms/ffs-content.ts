import { load } from "cheerio";
import defaults from "./ffs-defaults.json";

export type FfsContent = { id: number; title: string; desc: string };
export const defaultFfsContent: FfsContent[] = defaults;

export function normalizeFfsContent(input: unknown): FfsContent[] {
  if (!Array.isArray(input) || input.length !== defaults.length) throw new Error("Mantenha os doze mecanismos FFS existentes.");
  const ids = new Set<number>();
  return input.map(item => {
    if (!item || typeof item !== "object" || !defaults.some(entry => entry.id === item.id) || ids.has(item.id)) throw new Error("Mecanismo FFS inválido ou duplicado.");
    ids.add(item.id);
    const text = (key: string, max: number) => {
      const value = item[key];
      if (typeof value !== "string" || !value.trim() || value.length > max) throw new Error(`Confira ${key} do mecanismo FFS.`);
      return value.trim();
    };
    return { id: item.id, title: text("title", 150), desc: text("desc", 1500) };
  });
}

export function appendFfsOverrides(markup: string, content: FfsContent[] | null) {
  if (!content || !markup.includes("ffs-mechanisms-grid")) return markup;
  const $ = load(markup.replace(/^\uFEFF/, ""));
  const container = $(".ffs-mechanisms-grid").first();
  const cards = container.children(".ffs-mechanism-card").toArray();
  if (cards.length !== defaults.length) return markup;
  for (const item of normalizeFfsContent(content)) {
    const card = $(cards[item.id]);
    card.find("h3").first().text(item.title);
    card.find(".ec-card-white-text").first().text(item.desc);
    container.append(card);
  }
  return $.html();
}
