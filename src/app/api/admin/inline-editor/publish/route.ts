import { randomUUID } from "node:crypto";

import { desc, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { cmsPageAuditEvents, pageVersions, pages } from "@/db/schema";
import { getCmsSession } from "@/lib/auth";
import { canAccessCmsAdmin, canAccessCmsEditor } from "@/lib/cms/auth-role";
import {
  checkRateLimit,
  JsonBodyLimitError,
  NO_STORE_PRIVATE_HEADERS,
  readBoundedJsonBody,
  validateSameOriginRequest,
} from "@/lib/cms/inline-editor-security";
import {
  isValidUuid,
  loadInlineEditablePage,
  revalidateInlinePagePaths,
} from "@/lib/cms/inline-editor-server";
import { assertKnownMediaUrls } from "@/lib/cms/media-references";
import {
  editableFieldsForRoute,
  hydrateEditableFields,
  normalizePageContentPatches,
} from "@/lib/cms/page-content";

export const runtime = "nodejs";

function jsonNoStore(body: unknown, init: ResponseInit = {}) {
  return NextResponse.json(body, {
    ...init,
    headers: { ...NO_STORE_PRIVATE_HEADERS, ...(init.headers ?? {}) },
  });
}

export async function POST(request: Request) {
  const sameOrigin = validateSameOriginRequest(request);
  if (!sameOrigin.allowed) {
    return jsonNoStore(
      { ok: false, error: sameOrigin.reason || "Origem não autorizada." },
      { status: 403 },
    );
  }

  const session = await getCmsSession();
  if (!session) {
    return jsonNoStore({ ok: false, error: "Sessão expirada. Faça login novamente." }, { status: 401 });
  }
  if (!canAccessCmsEditor(session.user)) {
    return jsonNoStore({ ok: false, error: "Permissão administrativa necessária." }, { status: 403 });
  }

  const rate = checkRateLimit(`inline:publish:${session.user.id}`, 30, 60_000);
  if (!rate.allowed) {
    return jsonNoStore(
      { ok: false, error: "Muitas publicações seguidas. Aguarde alguns segundos." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } },
    );
  }

  let body: { pageId?: unknown; patches?: unknown };
  try {
    body = await readBoundedJsonBody<{ pageId?: unknown; patches?: unknown }>(request, 900_000);
  } catch (error) {
    if (error instanceof JsonBodyLimitError) {
      return jsonNoStore({ ok: false, error: "Payload excede o limite permitido." }, { status: 413 });
    }
    return jsonNoStore({ ok: false, error: "Corpo JSON inválido." }, { status: 400 });
  }

  if (!isValidUuid(body?.pageId)) {
    return jsonNoStore({ ok: false, error: "Identificador de página inválido." }, { status: 400 });
  }

  const loaded = await loadInlineEditablePage(body.pageId);
  if ("error" in loaded) {
    return jsonNoStore({ ok: false, error: loaded.error }, { status: loaded.status });
  }

  const { page, source } = loaded;
  let content;
  try {
    const allowedFields = editableFieldsForRoute(source, page.routePath);
    content = normalizePageContentPatches(body.patches, allowedFields);
    await assertKnownMediaUrls(
      content.flatMap((patch) => {
        if (patch.kind === "image" || patch.kind === "backgroundImage") return [patch.value];
        if (patch.kind === "clientLogos") return patch.value.map((item) => item.src);
        if (patch.kind === "homeSolutions") return patch.value.map((item) => item.image);
        if (patch.kind === "directorCards") {
          return patch.value.flatMap((item) => (item.poster ? [item.src, item.poster] : [item.src]));
        }
        if (patch.kind === "cardList") {
          return patch.value.flatMap((item) => (item.image?.src ? [item.image.src] : []));
        }
        return [];
      }),
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Alterações inválidas para este template.";
    return jsonNoStore({ ok: false, error: message }, { status: 400 });
  }

  const isSuperAdmin = canAccessCmsAdmin(session.user);
  if (!isSuperAdmin) {
    let currentPublishedContent: unknown[] = [];
    if (page.publishedVersionId) {
      const [publishedRow] = await db
        .select({ content: pageVersions.content })
        .from(pageVersions)
        .where(eq(pageVersions.id, page.publishedVersionId))
        .limit(1);
      if (Array.isArray(publishedRow?.content)) {
        currentPublishedContent = publishedRow.content;
      }
    }
    const currentFields = hydrateEditableFields(source, currentPublishedContent, page.routePath);
    const currentByKey = new Map(currentFields.map((field) => [field.key, field]));

    const touchedMedia = content.some((patch) => {
      const current = currentByKey.get(patch.key);
      if (patch.kind === "image") {
        if (current?.kind !== "image") return true;
        if (patch.value !== current.value || patch.altText !== current.altText) return true;
        if (current.editorPhotoLocked && (patch.objectPosition ?? "") !== (current.objectPosition ?? "")) {
          return true;
        }
        return false;
      }
      if (patch.kind === "backgroundImage") {
        if (current?.kind !== "backgroundImage") return true;
        return patch.value !== current.value;
      }
      if (patch.kind === "homeSolutions") {
        if (current?.kind !== "homeSolutions") return true;
        const currentByRoute = new Map(current.value.map((item) => [item.routePath, item]));
        return patch.value.some((item) => {
          const prev = currentByRoute.get(item.routePath);
          if (!prev) return true;
          return item.image !== prev.image || item.imageAlt !== prev.imageAlt;
        });
      }
      if (patch.kind === "cardList") {
        if (current?.kind !== "cardList") return true;
        const currentBySource = new Map(current.value.map((item) => [item.sourceIndex, item]));
        return patch.value.some((item) => {
          const prev = currentBySource.get(item.sourceIndex) ?? current.originalValue[item.sourceIndex];
          if (!item.image && !prev?.image) return false;
          if (!item.image || !prev?.image) return true;
          if (item.image.src !== prev.image.src || item.image.alt !== prev.image.alt) return true;
          if (current.editorPhotoLocked && (item.image.objectPosition ?? "") !== (prev.image.objectPosition ?? "")) {
            return true;
          }
          return false;
        });
      }
      return false;
    });

    if (touchedMedia) {
      return jsonNoStore(
        { ok: false, error: "Apenas contas Superadmin podem alterar fotografias e imagens." },
        { status: 403 },
      );
    }

    const touchedSectionOrder = content.some((patch) => {
      if (patch.kind !== "sectionOrder") return false;
      const current = currentByKey.get(patch.key);
      if (current?.kind !== "sectionOrder") return true;
      if (patch.value.length !== current.value.length) return true;
      return patch.value.some((sel, idx) => sel !== current.value[idx]);
    });

    if (touchedSectionOrder) {
      return jsonNoStore(
        { ok: false, error: "Apenas contas Superadmin podem reordenar seções da página." },
        { status: 403 },
      );
    }
  }

  const versionId = randomUUID();
  const publishedAt = new Date();
  let nextVersion = 1;

  try {
    await db.transaction(async (transaction) => {
      await transaction.execute(sql`SELECT id FROM pages WHERE id = ${page.id} FOR UPDATE`);
      const [latestVersion] = await transaction
        .select({
          version: pageVersions.version,
          title: pageVersions.title,
          summary: pageVersions.summary,
          seoTitle: pageVersions.seoTitle,
          seoDescription: pageVersions.seoDescription,
        })
        .from(pageVersions)
        .where(eq(pageVersions.pageId, page.id))
        .orderBy(desc(pageVersions.version))
        .limit(1);

      nextVersion = (latestVersion?.version ?? 0) + 1;
      const effectiveTitle = latestVersion?.title ?? page.title;
      const effectiveSummary = latestVersion?.summary ?? page.summary;

      await transaction.insert(pageVersions).values({
        id: versionId,
        pageId: page.id,
        version: nextVersion,
        title: effectiveTitle,
        summary: effectiveSummary,
        content,
        seoTitle: latestVersion?.seoTitle ?? null,
        seoDescription: latestVersion?.seoDescription ?? null,
        status: "published",
        publishedAt,
        createdByUserId: session.user.id,
      });

      await transaction.insert(cmsPageAuditEvents).values({
        id: randomUUID(),
        pageId: page.id,
        actorUserId: session.user.id,
        action: "published",
        versionId,
      });

      await transaction
        .update(pages)
        .set({
          title: effectiveTitle,
          summary: effectiveSummary,
          status: "published",
          publishedVersionId: versionId,
        })
        .where(eq(pages.id, page.id));
    });
  } catch {
    return jsonNoStore(
      { ok: false, error: "Não foi possível publicar as alterações no banco de dados." },
      { status: 500 },
    );
  }

  revalidateInlinePagePaths(page.id, page.routePath);

  return jsonNoStore({
    ok: true,
    version: {
      id: versionId,
      version: nextVersion,
      publishedAt: publishedAt.toISOString(),
      authorName: session.user.name,
      authorEmail: session.user.email,
    },
  });
}
