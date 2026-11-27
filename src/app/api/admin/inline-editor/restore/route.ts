import { randomUUID } from "node:crypto";

import { desc, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { cmsPageAuditEvents, pageVersions, pages } from "@/db/schema";
import { getCmsSession } from "@/lib/auth";
import { canAccessCmsEditor } from "@/lib/cms/auth-role";
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
    return jsonNoStore({ ok: false, error: "Sessão expirada." }, { status: 401 });
  }
  if (!canAccessCmsEditor(session.user)) {
    return jsonNoStore({ ok: false, error: "Permissão administrativa necessária." }, { status: 403 });
  }

  const rate = checkRateLimit(`inline:restore:${session.user.id}`, 20, 60_000);
  if (!rate.allowed) {
    return jsonNoStore(
      { ok: false, error: "Muitas restaurações seguidas. Aguarde alguns segundos." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } },
    );
  }

  let body: { pageId?: unknown; versionId?: unknown };
  try {
    body = await readBoundedJsonBody<{ pageId?: unknown; versionId?: unknown }>(request, 16_384);
  } catch (error) {
    if (error instanceof JsonBodyLimitError) {
      return jsonNoStore({ ok: false, error: "Payload excede o limite permitido." }, { status: 413 });
    }
    return jsonNoStore({ ok: false, error: "Corpo JSON inválido." }, { status: 400 });
  }

  if (!isValidUuid(body?.pageId) || !isValidUuid(body?.versionId)) {
    return jsonNoStore({ ok: false, error: "Identificador inválido." }, { status: 400 });
  }

  const loaded = await loadInlineEditablePage(body.pageId);
  if ("error" in loaded) {
    return jsonNoStore({ ok: false, error: loaded.error }, { status: loaded.status });
  }

  const { page, source } = loaded;
  const [originalVersion] = await db
    .select()
    .from(pageVersions)
    .where(eq(pageVersions.id, body.versionId))
    .limit(1);

  if (!originalVersion || originalVersion.pageId !== page.id) {
    return jsonNoStore(
      { ok: false, error: "A versão selecionada não pertence a esta página." },
      { status: 404 },
    );
  }

  let content;
  let hydratedFields;
  try {
    const allowedFields = editableFieldsForRoute(source, page.routePath);
    content = normalizePageContentPatches(originalVersion.content, allowedFields);
    await assertKnownMediaUrls(
      content.flatMap((patch) => {
        if (patch.kind === "image" || patch.kind === "backgroundImage") return [patch.value];
        if (patch.kind === "clientLogos") return patch.value.map((item) => item.src);
        if (patch.kind === "directorCards") {
          return patch.value.flatMap((item) => (item.poster ? [item.src, item.poster] : [item.src]));
        }
        if (patch.kind === "cardList") {
          return patch.value.flatMap((item) => (item.image?.src ? [item.image.src] : []));
        }
        return [];
      }),
    );
    hydratedFields = hydrateEditableFields(source, content, page.routePath);
  } catch (error) {
    const message = error instanceof Error ? error.message : "A versão não é mais compatível com este template.";
    return jsonNoStore({ ok: false, error: message }, { status: 400 });
  }

  const newVersionId = randomUUID();
  const publishedAt = new Date();
  let nextVersion = 1;

  try {
    await db.transaction(async (transaction) => {
      await transaction.execute(sql`SELECT id FROM pages WHERE id = ${page.id} FOR UPDATE`);
      const [latestVersion] = await transaction
        .select({ version: pageVersions.version })
        .from(pageVersions)
        .where(eq(pageVersions.pageId, page.id))
        .orderBy(desc(pageVersions.version))
        .limit(1);

      nextVersion = (latestVersion?.version ?? 0) + 1;

      await transaction.insert(pageVersions).values({
        id: newVersionId,
        pageId: page.id,
        version: nextVersion,
        title: originalVersion.title,
        summary: originalVersion.summary,
        content,
        seoTitle: originalVersion.seoTitle,
        seoDescription: originalVersion.seoDescription,
        status: "published",
        publishedAt,
        createdByUserId: session.user.id,
      });

      await transaction.insert(cmsPageAuditEvents).values({
        id: randomUUID(),
        pageId: page.id,
        actorUserId: session.user.id,
        action: "restored",
        versionId: newVersionId,
        sourceVersionId: originalVersion.id,
      });

      await transaction
        .update(pages)
        .set({
          title: originalVersion.title,
          summary: originalVersion.summary,
          status: "published",
          publishedVersionId: newVersionId,
        })
        .where(eq(pages.id, page.id));
    });
  } catch {
    return jsonNoStore(
      { ok: false, error: "Não foi possível restaurar esta versão." },
      { status: 500 },
    );
  }

  revalidateInlinePagePaths(page.id, page.routePath);

  return jsonNoStore({
    ok: true,
    version: {
      id: newVersionId,
      version: nextVersion,
      publishedAt: publishedAt.toISOString(),
    },
    fields: hydratedFields,
  });
}
