"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { requireCmsAdmin } from "@/lib/auth";
import { normalizeSiteColor, type SiteTheme } from "@/lib/cms/site-settings";

export type SaveSettingsState = { success?: string; error?: string };

const fields: (keyof SiteTheme)[] = [
  "brandPrimary",
  "brandSecondary",
  "backgroundPage",
  "backgroundPrimary",
  "backgroundSecondary",
  "backgroundDeep",
  "textPrimary",
  "textSecondary",
  "textMuted",
];

export async function saveSiteSettingsAction(
  _previousState: SaveSettingsState,
  formData: FormData,
): Promise<SaveSettingsState> {
  await requireCmsAdmin();

  const theme = {} as SiteTheme;
  try {
    for (const field of fields) {
      const value = formData.get(field);
      if (typeof value !== "string") throw new Error("Preencha todas as cores.");
      theme[field] = normalizeSiteColor(value);
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Confira as cores informadas." };
  }

  const updatedAt = new Date();
  const [existing] = await db.select({ id: siteSettings.id })
    .from(siteSettings).where(eq(siteSettings.id, "global")).limit(1);

  if (existing) {
    await db.update(siteSettings).set({ ...theme, updatedAt }).where(eq(siteSettings.id, "global"));
  } else {
    await db.insert(siteSettings).values({ id: "global", ...theme, updatedAt });
  }

  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { success: "Cores globais atualizadas." };
}
