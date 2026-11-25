"use server";

import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { cmsPageAuditEvents, pageVersions, pages } from "@/db/schema";
import { requireCmsEditor } from "@/lib/auth";
import { normalizePageSlug, resolveCmsTemplatePath } from "@/lib/cms/page-content";
import { sitePages } from "@/lib/site-inventory";

export type CreatePageState = { error?: string };

export async function createPage(_previousState: CreatePageState, formData: FormData): Promise<CreatePageState> {
  const session = await requireCmsEditor();

  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "");
  const templateInput = String(formData.get("templatePath") ?? "");
  if (!title || title.length > 255) return { error: "Informe um título com até 255 caracteres." };

  const routePath = normalizePageSlug(slugInput);
  if (!routePath) return { error: "Informe um slug válido, sem pastas ou endereço de arquivo." };

  const templatePath = resolveCmsTemplatePath(templateInput, sitePages.map((page) => page.routePath));
  const template = sitePages.find((page) => page.routePath === templatePath);
  if (!template) return { error: "Selecione um template original válido." };

  const [existingPage] = await db.select({ id: pages.id }).from(pages).where(eq(pages.routePath, routePath)).limit(1);
  if (existingPage) return { error: "Já existe uma página cadastrada com essa rota." };

  const id = randomUUID();
  const versionId = randomUUID();
  const pageType = template.routePath === "/"
    ? "home"
    : template.routePath.includes("sobre-nos")
      ? "about"
      : template.routePath.includes("politica-de-privacidade")
        ? "privacy"
        : template.kind === "Solução" ? "service" : "system";

  await db.transaction(async (transaction) => {
    await transaction.insert(pages).values({
      id,
      routePath,
      templatePath,
      title,
      summary: null,
      pageType,
      status: "draft",
    });
    await transaction.insert(pageVersions).values({
      id: versionId,
      pageId: id,
      version: 1,
      title,
      summary: null,
      content: [],
      seoTitle: null,
      seoDescription: null,
      status: "draft",
      createdByUserId: session.user.id,
    });
    await transaction.insert(cmsPageAuditEvents).values({
      id: randomUUID(),
      pageId: id,
      actorUserId: session.user.id,
      action: "page_created",
      versionId,
    });
  });

  revalidatePath("/admin/pages");
  redirect(`/admin/pages/${id}?created=1`);
}
