"use server";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { globalContentSettings } from "@/db/schema";
import { requireCmsAdmin } from "@/lib/auth";
import { assertKnownMediaUrls } from "@/lib/cms/media-references";
import { backgroundFields, normalizeBackgroundContent } from "@/lib/cms/background-content";

export async function saveBackgroundContent(_state: { error?: string; success?: string }, form: FormData): Promise<{ error?: string; success?: string }> {
  await requireCmsAdmin();
  let values: Record<string, string>;
  try {
    values = normalizeBackgroundContent(Object.fromEntries(backgroundFields.map(field => [field.key, form.get(field.key)])));
    await assertKnownMediaUrls(Object.values(values));
  }
  catch { return { error: "Confira as imagens de fundo selecionadas." }; }
  try {
    await db.insert(globalContentSettings).values({ id: "backgrounds", values }).onDuplicateKeyUpdate({ set: { values, updatedAt: new Date() } });
    revalidatePath("/", "layout");
    return { success: "Imagens de fundo atualizadas no site local." };
  } catch { return { error: "Não foi possível salvar as imagens de fundo." }; }
}
