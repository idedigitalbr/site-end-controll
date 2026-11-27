import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { globalContentSettings } from "@/db/schema";
import { getCmsSession } from "@/lib/auth";
import { canAccessCmsAdmin } from "@/lib/cms/auth-role";
import {
  checkRateLimit,
  JsonBodyLimitError,
  NO_STORE_PRIVATE_HEADERS,
  readBoundedJsonBody,
  validateSameOriginRequest,
} from "@/lib/cms/inline-editor-security";
import { normalizeNavigationContent, type NavigationContent } from "@/lib/cms/navigation-content";

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
    return jsonNoStore(
      { ok: false, error: "Sessão expirada. Faça login novamente." },
      { status: 401 },
    );
  }
  if (!canAccessCmsAdmin(session.user)) {
    return jsonNoStore(
      { ok: false, error: "Apenas contas Superadmin podem editar a navegação global." },
      { status: 403 },
    );
  }

  const rate = checkRateLimit(`inline:navigation:${session.user.id}`, 30, 60_000);
  if (!rate.allowed) {
    return jsonNoStore(
      { ok: false, error: "Muitas atualizações seguidas. Aguarde alguns segundos." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } },
    );
  }

  let body: { content?: unknown };
  try {
    body = await readBoundedJsonBody<{ content?: unknown }>(request, 64_000);
  } catch (error) {
    if (error instanceof JsonBodyLimitError) {
      return jsonNoStore({ ok: false, error: "Payload excede o limite permitido." }, { status: 413 });
    }
    return jsonNoStore({ ok: false, error: "Corpo JSON inválido." }, { status: 400 });
  }

  let normalized: NavigationContent;
  try {
    normalized = normalizeNavigationContent(body?.content);
  } catch (error) {
    return jsonNoStore(
      { ok: false, error: error instanceof Error ? error.message : "Dados inválidos no menu." },
      { status: 400 },
    );
  }

  const serialized = JSON.stringify(normalized);
  try {
    await db
      .insert(globalContentSettings)
      .values({ id: "navigation", values: { data: serialized } })
      .onDuplicateKeyUpdate({ set: { values: { data: serialized }, updatedAt: new Date() } });
    revalidatePath("/", "layout");
  } catch {
    return jsonNoStore(
      { ok: false, error: "Não foi possível salvar a navegação." },
      { status: 500 },
    );
  }

  return jsonNoStore({ ok: true, content: normalized });
}
