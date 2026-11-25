import "server-only";
import { inArray } from "drizzle-orm";
import { db } from "@/db";
import { mediaAssets } from "@/db/schema";

export async function assertKnownMediaUrls(urls: string[]) {
  const names = [...new Set(urls.filter(url => url.startsWith("/media/")).map(url => url.slice(7)))];
  if (!names.length) return;
  const assets = await db.select({ fileName: mediaAssets.fileName }).from(mediaAssets).where(inArray(mediaAssets.fileName, names));
  const found = new Set(assets.map(asset => asset.fileName));
  if (names.some(name => !found.has(name))) throw new Error("Uma das imagens não existe mais na biblioteca. Selecione uma imagem disponível.");
}
