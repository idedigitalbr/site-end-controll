"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { globalContentSettings } from "@/db/schema";
import { requireCmsEditor } from "@/lib/auth";
import { normalizeHomeServiceOrder } from "@/lib/cms/home-services-content";

export async function saveHomeServiceOrder(_state: { error?: string; success?: string }, form: FormData): Promise<{ error?: string; success?: string }> {
  await requireCmsEditor();
  let data: string;
  try {
    data = JSON.stringify(normalizeHomeServiceOrder(JSON.parse(String(form.get("content") ?? "null"))));
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Confira a ordem das soluções." };
  }

  try {
    await db.insert(globalContentSettings)
      .values({ id: "service-order", values: { data } })
      .onDuplicateKeyUpdate({ set: { values: { data }, updatedAt: new Date() } });
    revalidatePath("/", "layout");
    return { success: "Ordem das soluções atualizada na Home local." };
  } catch {
    return { error: "Não foi possível salvar a ordem das soluções." };
  }
}
