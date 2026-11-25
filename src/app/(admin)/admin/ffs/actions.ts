"use server";
import { db } from "@/db";
import { globalContentSettings } from "@/db/schema";
import { requireCmsEditor } from "@/lib/auth";
import { normalizeFfsContent } from "@/lib/cms/ffs-content";
import { revalidatePath } from "next/cache";

export async function saveFfsContent(_state: { error?: string; success?: string }, form: FormData): Promise<{ error?: string; success?: string }> {
  await requireCmsEditor();
  let data: string;
  try {
    const content = normalizeFfsContent(JSON.parse(String(form.get("content") ?? "null")));
    data = JSON.stringify(content);
  }
  catch (error) { return { error: error instanceof Error ? error.message : "Confira os mecanismos." }; }
  try {
    await db.insert(globalContentSettings).values({ id: "ffs", values: { data } }).onDuplicateKeyUpdate({ set: { values: { data }, updatedAt: new Date() } });
    revalidatePath("/", "layout");
    return { success: "Mecanismos FFS atualizados no site local." };
  } catch { return { error: "Não foi possível salvar os mecanismos FFS." }; }
}
