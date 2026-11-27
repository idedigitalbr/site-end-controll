import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { pageVersions, pages, user } from "@/db/schema";
import { getCmsSession } from "@/lib/auth";
import { canAccessCmsEditor } from "@/lib/cms/auth-role";
import { NO_STORE_PRIVATE_HEADERS } from "@/lib/cms/inline-editor-security";
import { isValidUuid } from "@/lib/cms/inline-editor-server";

export const runtime = "nodejs";

function jsonNoStore(body: unknown, init: ResponseInit = {}) {
  return NextResponse.json(body, {
    ...init,
    headers: { ...NO_STORE_PRIVATE_HEADERS, ...(init.headers ?? {}) },
  });
}

export async function GET(request: Request) {
  const session = await getCmsSession();
  if (!session) {
    return jsonNoStore({ ok: false, error: "Sessão expirada." }, { status: 401 });
  }
  if (!canAccessCmsEditor(session.user)) {
    return jsonNoStore({ ok: false, error: "Permissão administrativa necessária." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const pageId = searchParams.get("pageId");
  if (!isValidUuid(pageId)) {
    return jsonNoStore({ ok: false, error: "Identificador de página inválido." }, { status: 400 });
  }

  const [page] = await db
    .select({ id: pages.id, publishedVersionId: pages.publishedVersionId })
    .from(pages)
    .where(eq(pages.id, pageId))
    .limit(1);

  if (!page) {
    return jsonNoStore({ ok: false, error: "Página não encontrada." }, { status: 404 });
  }

  const rows = await db
    .select({
      id: pageVersions.id,
      version: pageVersions.version,
      title: pageVersions.title,
      status: pageVersions.status,
      createdAt: pageVersions.createdAt,
      publishedAt: pageVersions.publishedAt,
      authorName: user.name,
      authorEmail: user.email,
    })
    .from(pageVersions)
    .leftJoin(user, eq(pageVersions.createdByUserId, user.id))
    .where(eq(pageVersions.pageId, pageId))
    .orderBy(desc(pageVersions.version))
    .limit(50);

  return jsonNoStore({
    ok: true,
    publishedVersionId: page.publishedVersionId,
    revisions: rows.map((row) => ({
      id: row.id,
      version: row.version,
      title: row.title,
      status: row.status,
      createdAt: row.createdAt.toISOString(),
      publishedAt: row.publishedAt ? row.publishedAt.toISOString() : null,
      authorName: row.authorName,
      authorEmail: row.authorEmail,
    })),
  });
}
