"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { globalContentSettings } from "@/db/schema";
import { requireCmsEditor } from "@/lib/auth";
import { normalizeNavigationContent } from "@/lib/cms/navigation-content";

export async function saveNavigationContent(_state: { error?: string; success?: string }, form: FormData): Promise<{ error?: string; success?: string }> {
  await requireCmsEditor();
  let data: string;
  try {
    data = JSON.stringify(normalizeNavigationContent(JSON.parse(String(form.get("content") ?? "null"))));
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Confira os itens da navegação." };
  }

  try {
    await db.insert(globalContentSettings)
      .values({ id: "navigation", values: { data } })
      .onDuplicateKeyUpdate({ set: { values: { data }, updatedAt: new Date() } });
    revalidatePath("/", "layout");
    return { success: "Menu atualizado no site local." };
  } catch {
    return { error: "Não foi possível salvar a navegação." };
  }
}
