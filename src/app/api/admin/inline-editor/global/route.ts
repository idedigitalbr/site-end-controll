import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { globalContentSettings } from "@/db/schema";
import { getCmsSession } from "@/lib/auth";
import { canAccessCmsEditor } from "@/lib/cms/auth-role";
import { globalContentFields, normalizeGlobalContent } from "@/lib/cms/global-content";
import { getGlobalContent } from "@/lib/cms/global-content-data";
import {
  checkRateLimit,
  JsonBodyLimitError,
  NO_STORE_PRIVATE_HEADERS,
  readBoundedJsonBody,
  validateSameOriginRequest,
} from "@/lib/cms/inline-editor-security";

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
  if (!canAccessCmsEditor(session.user)) {
    return jsonNoStore(
      { ok: false, error: "Permissão administrativa necessária." },
      { status: 403 },
    );
  }

  const rate = checkRateLimit(`inline:global:${session.user.id}`, 30, 60_000);
  if (!rate.allowed) {
    return jsonNoStore(
      { ok: false, error: "Muitas atualizações seguidas. Aguarde alguns segundos." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } },
    );
  }

  let body: { values?: unknown };
  try {
    body = await readBoundedJsonBody<{ values?: unknown }>(request, 64_000);
  } catch (error) {
    if (error instanceof JsonBodyLimitError) {
      return jsonNoStore({ ok: false, error: "Payload excede o limite permitido." }, { status: 413 });
    }
    return jsonNoStore({ ok: false, error: "Corpo JSON inválido." }, { status: 400 });
  }

  if (!body?.values || typeof body.values !== "object" || Array.isArray(body.values)) {
    return jsonNoStore({ ok: false, error: "Dados do rodapé inválidos." }, { status: 400 });
  }

  const incoming = body.values as Record<string, unknown>;
  const defaults = Object.fromEntries(globalContentFields.map((field) => [field.key, field.value]));
  const currentStored = await getGlobalContent().catch(() => null);
  const merged: Record<string, unknown> = {
    ...defaults,
    ...(currentStored ?? {}),
  };

  for (const field of globalContentFields) {
    if (Object.prototype.hasOwnProperty.call(incoming, field.key)) {
      merged[field.key] = incoming[field.key];
    }
  }

  let normalized: Record<string, string>;
  try {
    normalized = normalizeGlobalContent(merged);
  } catch (error) {
    return jsonNoStore(
      { ok: false, error: error instanceof Error ? error.message : "Dados inválidos no rodapé." },
      { status: 400 },
    );
  }

  try {
    await db
      .insert(globalContentSettings)
      .values({ id: "global", values: normalized })
      .onDuplicateKeyUpdate({ set: { values: normalized, updatedAt: new Date() } });
    revalidatePath("/", "layout");
  } catch {
    return jsonNoStore(
      { ok: false, error: "Não foi possível salvar os dados do rodapé." },
      { status: 500 },
    );
  }

  return jsonNoStore({ ok: true, values: normalized });
}
