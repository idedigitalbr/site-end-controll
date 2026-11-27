import "server-only";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { pages } from "@/db/schema";
import { resolveCmsTemplatePath } from "@/lib/cms/page-content";
import { getLegacyPageTemplatePaths, readLegacyPageMarkup } from "@/lib/legacy-site";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidUuid(value: unknown): value is string {
  return typeof value === "string" && UUID_RE.test(value);
}

export async function loadInlineEditablePage(pageId: string) {
  const [page] = await db.select().from(pages).where(eq(pages.id, pageId)).limit(1);
  if (!page) return { error: "Página não encontrada.", status: 404 as const };

  const templatePath = resolveCmsTemplatePath(
    page.templatePath,
    getLegacyPageTemplatePaths(),
    page.routePath,
  );
  if (!templatePath) {
    return { error: "O template desta página não é permitido.", status: 400 as const };
  }

  const source = await readLegacyPageMarkup(templatePath);
  if (!source) {
    return { error: "Não foi possível carregar o template original da página.", status: 500 as const };
  }

  return { page, source };
}

export function revalidateInlinePagePaths(pageId: string, routePath: string) {
  try {
    revalidatePath("/admin");
    revalidatePath("/admin/pages");
    revalidatePath(`/admin/pages/${pageId}`);
    revalidatePath(routePath);
  } catch {
    // Ignore outside Next request context (e.g. unit tests)
  }
}
