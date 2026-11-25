import "server-only";

import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { mediaAssets, siteSettings } from "@/db/schema";
import { DEFAULT_SITE_THEME, type SiteTheme } from "@/lib/cms/site-settings";

export async function getPublicSiteTheme(): Promise<SiteTheme | null> {
  const [settings] = await db
    .select({
      brandPrimary: siteSettings.brandPrimary,
      brandSecondary: siteSettings.brandSecondary,
      backgroundPage: siteSettings.backgroundPage,
      backgroundPrimary: siteSettings.backgroundPrimary,
      backgroundSecondary: siteSettings.backgroundSecondary,
      backgroundDeep: siteSettings.backgroundDeep,
      textPrimary: siteSettings.textPrimary,
      textSecondary: siteSettings.textSecondary,
      textMuted: siteSettings.textMuted,
    })
    .from(siteSettings)
    .where(eq(siteSettings.id, "global"))
    .limit(1);

  return settings ?? null;
}

export async function getAdminSiteSettings(): Promise<SiteTheme> {
  return (await getPublicSiteTheme()) ?? DEFAULT_SITE_THEME;
}

export async function listCmsMedia() {
  const items = await db
    .select({
      id: mediaAssets.id,
      fileName: mediaAssets.fileName,
      originalName: mediaAssets.originalName,
      mimeType: mediaAssets.mimeType,
      sizeBytes: mediaAssets.sizeBytes,
      width: mediaAssets.width,
      height: mediaAssets.height,
      altText: mediaAssets.altText,
      createdAt: mediaAssets.createdAt,
      sourcePath: mediaAssets.sourcePath,
    })
    .from(mediaAssets)
    .orderBy(desc(mediaAssets.createdAt));

  return items.map(({ fileName, sourcePath, ...item }) => ({
    ...item,
    isOriginal: Boolean(sourcePath),
    url: `/media/${fileName}`,
  }));
}
