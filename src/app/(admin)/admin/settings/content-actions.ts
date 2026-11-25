"use server";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { globalContentSettings } from "@/db/schema";
import { requireCmsAdmin } from "@/lib/auth";
import { globalContentFields, normalizeGlobalContent } from "@/lib/cms/global-content";

export async function saveGlobalContent(_state: { error?: string; success?: string }, form: FormData): Promise<{ error?: string; success?: string }> {
  await requireCmsAdmin();
  let values: Record<string, string>;
  try {
    values = normalizeGlobalContent(Object.fromEntries(globalContentFields.map(field => [field.key, form.get(field.key)])));
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Confira as configurações." };
  }
  try {
    await db.insert(globalContentSettings).values({ id: "global", values }).onDuplicateKeyUpdate({ set: { values, updatedAt: new Date() } });
    revalidatePath("/", "layout");
    return { success: "Contatos e rodapé atualizados em todas as páginas." };
  } catch {
    return { error: "Não foi possível salvar as configurações." };
  }
}
