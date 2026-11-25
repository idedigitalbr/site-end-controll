"use server";

import { randomUUID } from "node:crypto";
import { desc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { cmsPageAuditEvents, pageVersions, pages } from "@/db/schema";
import { editableFieldsForRoute, normalizePageContentPatches, resolveCmsTemplatePath } from "@/lib/cms/page-content";
import { requireCmsEditor } from "@/lib/auth";
import { assertKnownMediaUrls } from "@/lib/cms/media-references";
import { getLegacyPageTemplatePaths, readLegacyPageMarkup } from "@/lib/legacy-site";

function readText(formData: FormData, name: string, maxLength: number, required = false) {
  const raw = formData.get(name);
  const value = typeof raw === "string" ? raw.trim() : "";

  if (required && value.length === 0) throw new Error(`${name} é obrigatório.`);
  if (value.length > maxLength) throw new Error(`${name} excede o limite de ${maxLength} caracteres.`);

  return value || null;
}

function readPageId(formData: FormData) {
  const pageId = readText(formData, "pageId", 36, true);
  if (!pageId || !/^[0-9a-f-]{36}$/i.test(pageId)) throw new Error("Identificador de página inválido.");
  return pageId;
}

function readPageFields(formData: FormData) {
  const title = readText(formData, "title", 255, true);
  const summary = readText(formData, "summary", 500);
  const seoTitle = readText(formData, "seoTitle", 255);
  const seoDescription = readText(formData, "seoDescription", 320);
  const rawContent = readText(formData, "content", 500_000) ?? "[]";

  let parsedContent: unknown;
  try {
    parsedContent = JSON.parse(rawContent);
  } catch {
    throw new Error("O conteúdo enviado não é um JSON válido.");
  }

  return { title: title!, summary, seoTitle, seoDescription, parsedContent };
}

async function loadPageTemplate(pageId: string) {
  const [page] = await db.select().from(pages).where(eq(pages.id, pageId)).limit(1);
  if (!page) throw new Error("Página não encontrada.");

  const templatePath = resolveCmsTemplatePath(
    page.templatePath,
    getLegacyPageTemplatePaths(),
    page.routePath,
  );
  if (!templatePath) throw new Error("O template desta página não é permitido.");

  const source = await readLegacyPageMarkup(templatePath);
  if (!source) throw new Error("Não foi possível carregar o template original da página.");
  return { page, source };
}

async function persistPageDraft(pageId: string, formData: FormData, actorUserId: string) {
  const fields = readPageFields(formData);
  const { page, source } = await loadPageTemplate(pageId);
  const content = normalizePageContentPatches(fields.parsedContent, editableFieldsForRoute(source, page.routePath));
  await assertKnownMediaUrls(content.flatMap((patch) => patch.kind === "image" || patch.kind === "backgroundImage" ? [patch.value] : []));
  const versionId = randomUUID();

  await db.transaction(async (transaction) => {
    await transaction.execute(sql`SELECT id FROM pages WHERE id = ${pageId} FOR UPDATE`);
    const [latestVersion] = await transaction
      .select({ version: pageVersions.version })
      .from(pageVersions)
      .where(eq(pageVersions.pageId, pageId))
      .orderBy(desc(pageVersions.version))
      .limit(1);
    const version = (latestVersion?.version ?? 0) + 1;
    await transaction.insert(pageVersions).values({
      id: versionId,
      pageId,
      version,
      title: fields.title,
      summary: fields.summary,
      content,
      seoTitle: fields.seoTitle,
      seoDescription: fields.seoDescription,
      status: "draft",
      createdByUserId: actorUserId,
    });

    await transaction.insert(cmsPageAuditEvents).values({
      id: randomUUID(),
      pageId,
      actorUserId,
      action: "draft_saved",
      versionId,
    });

    await transaction.update(pages).set({ title: fields.title, summary: fields.summary, status: "draft" }).where(eq(pages.id, pageId));
  });

  refreshPagePaths(pageId, page.routePath);
  return versionId;
}

function refreshPagePaths(pageId: string, routePath: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/pages");
  revalidatePath(`/admin/pages/${pageId}`);
  revalidatePath(routePath);
}

export async function savePageDraft(formData: FormData) {
  const session = await requireCmsEditor();
  const pageId = readPageId(formData);
  const versionId = await persistPageDraft(pageId, formData, session.user.id);
  redirect(`/admin/pages/${pageId}?saved=${versionId}`);
}

export async function saveDraftAndPreview(formData: FormData) {
  const session = await requireCmsEditor();
  const pageId = readPageId(formData);
  await persistPageDraft(pageId, formData, session.user.id);
  redirect(`/admin/pages/${pageId}/preview`);
}

export async function publishPage(formData: FormData) {
  const session = await requireCmsEditor();
  const pageId = readPageId(formData);
  const fields = readPageFields(formData);
  const { page, source } = await loadPageTemplate(pageId);
  const content = normalizePageContentPatches(fields.parsedContent, editableFieldsForRoute(source, page.routePath));
  await assertKnownMediaUrls(content.flatMap((patch) => patch.kind === "image" || patch.kind === "backgroundImage" ? [patch.value] : []));
  const versionId = randomUUID();

  await db.transaction(async (transaction) => {
    await transaction.execute(sql`SELECT id FROM pages WHERE id = ${pageId} FOR UPDATE`);
    const [latestVersion] = await transaction
      .select({ version: pageVersions.version })
      .from(pageVersions)
      .where(eq(pageVersions.pageId, pageId))
      .orderBy(desc(pageVersions.version))
      .limit(1);
    const version = (latestVersion?.version ?? 0) + 1;

    await transaction.insert(pageVersions).values({
      id: versionId,
      pageId,
      version,
      title: fields.title,
      summary: fields.summary,
      content,
      seoTitle: fields.seoTitle,
      seoDescription: fields.seoDescription,
      status: "published",
      publishedAt: new Date(),
      createdByUserId: session.user.id,
    });

    await transaction.insert(cmsPageAuditEvents).values({
      id: randomUUID(),
      pageId,
      actorUserId: session.user.id,
      action: "published",
      versionId,
    });

    await transaction.update(pages).set({
      title: fields.title,
      summary: fields.summary,
      status: "published",
      publishedVersionId: versionId,
    }).where(eq(pages.id, pageId));
  });

  refreshPagePaths(pageId, page.routePath);
  redirect(`/admin/pages/${pageId}?published=1`);
}

export async function unpublishPage(formData: FormData) {
  const session = await requireCmsEditor();
  const pageId = readPageId(formData);
  let routePath = "/";

  await db.transaction(async (transaction) => {
    await transaction.execute(sql`SELECT id FROM pages WHERE id = ${pageId} FOR UPDATE`);
    const [page] = await transaction.select().from(pages).where(eq(pages.id, pageId)).limit(1);
    if (!page) throw new Error("Página não encontrada.");
    routePath = page.routePath;
    await transaction.insert(cmsPageAuditEvents).values({
      id: randomUUID(),
      pageId,
      actorUserId: session.user.id,
      action: "unpublished",
      versionId: page.publishedVersionId,
    });
    await transaction.update(pages).set({ status: "draft", publishedVersionId: null }).where(eq(pages.id, pageId));
  });

  refreshPagePaths(pageId, routePath);
  redirect(`/admin/pages/${pageId}?unpublished=1`);
}

export async function restorePageVersion(formData: FormData) {
  const session = await requireCmsEditor();
  const pageId = readPageId(formData);
  const sourceVersionId = readText(formData, "versionId", 36, true);
  if (!sourceVersionId || !/^[0-9a-f-]{36}$/i.test(sourceVersionId)) {
    throw new Error("Identificador de versão inválido.");
  }

  const { page, source } = await loadPageTemplate(pageId);
  const allowedFields = editableFieldsForRoute(source, page.routePath);
  const newVersionId = randomUUID();

  await db.transaction(async (transaction) => {
    await transaction.execute(sql`SELECT id FROM pages WHERE id = ${pageId} FOR UPDATE`);
    const [originalVersion] = await transaction
      .select()
      .from(pageVersions)
      .where(eq(pageVersions.id, sourceVersionId))
      .limit(1);
    if (!originalVersion || originalVersion.pageId !== pageId) {
      throw new Error("A versão selecionada não pertence a esta página.");
    }

    const content = normalizePageContentPatches(originalVersion.content, allowedFields);
    await assertKnownMediaUrls(content.flatMap((patch) => patch.kind === "image" || patch.kind === "backgroundImage" ? [patch.value] : []));
    const [latestVersion] = await transaction
      .select({ version: pageVersions.version })
      .from(pageVersions)
      .where(eq(pageVersions.pageId, pageId))
      .orderBy(desc(pageVersions.version))
      .limit(1);
    const version = (latestVersion?.version ?? 0) + 1;

    await transaction.insert(pageVersions).values({
      id: newVersionId,
      pageId,
      version,
      title: originalVersion.title,
      summary: originalVersion.summary,
      content,
      seoTitle: originalVersion.seoTitle,
      seoDescription: originalVersion.seoDescription,
      status: "draft",
      createdByUserId: session.user.id,
    });

    await transaction.insert(cmsPageAuditEvents).values({
      id: randomUUID(),
      pageId,
      actorUserId: session.user.id,
      action: "restored",
      versionId: newVersionId,
      sourceVersionId,
    });

    await transaction.update(pages).set({
      title: originalVersion.title,
      summary: originalVersion.summary,
      status: "draft",
    }).where(eq(pages.id, pageId));
  });

  refreshPagePaths(pageId, page.routePath);
  redirect(`/admin/pages/${pageId}?restored=${newVersionId}`);
}
