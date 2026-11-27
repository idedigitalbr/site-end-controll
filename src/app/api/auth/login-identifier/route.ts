import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { isCmsUserActive } from "@/lib/cms/auth-role";
import {
  checkRateLimit,
  InvalidJsonBodyError,
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

function clientIpForRateLimit(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "local";
}

export async function POST(request: Request) {
  const sameOrigin = validateSameOriginRequest(request);
  if (!sameOrigin.allowed) {
    return jsonNoStore(
      { ok: false, error: sameOrigin.reason || "Origem não autorizada." },
      { status: 403 },
    );
  }

  const rate = checkRateLimit(`login:${clientIpForRateLimit(request)}`, 10, 60_000);
  if (!rate.allowed) {
    return jsonNoStore(
      { ok: false, error: "Muitas tentativas de login. Aguarde alguns segundos e tente novamente." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } },
    );
  }

  let body: { identifier?: unknown; password?: unknown };
  try {
    body = await readBoundedJsonBody<{ identifier?: unknown; password?: unknown }>(request, 8_192);
  } catch (error) {
    if (error instanceof JsonBodyLimitError) {
      return jsonNoStore({ ok: false, error: "Requisição excede o tamanho permitido." }, { status: 413 });
    }
    if (error instanceof InvalidJsonBodyError) {
      return jsonNoStore({ ok: false, error: "Corpo JSON inválido." }, { status: 400 });
    }
    return jsonNoStore({ ok: false, error: "Corpo JSON inválido." }, { status: 400 });
  }

  const rawIdentifier = typeof body?.identifier === "string" ? body.identifier.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!rawIdentifier || rawIdentifier.length > 255 || !password || password.length > 128) {
    return jsonNoStore({ ok: false, error: "Usuário, e-mail ou senha inválidos." }, { status: 401 });
  }

  const lowerIdentifier = rawIdentifier.toLowerCase();
  let resolvedEmail: string | null = null;
  let matchedUser: { email: string; banned: boolean | null; banExpires: Date | null } | null = null;

  if (rawIdentifier.includes("@")) {
    const rows = await db
      .select({ email: user.email, banned: user.banned, banExpires: user.banExpires })
      .from(user)
      .where(sql`LOWER(${user.email}) = ${lowerIdentifier}`)
      .limit(1);
    matchedUser = rows[0] ?? null;
    resolvedEmail = matchedUser?.email ?? lowerIdentifier;
  } else {
    const byName = await db
      .select({ email: user.email, banned: user.banned, banExpires: user.banExpires })
      .from(user)
      .where(sql`LOWER(${user.name}) = ${lowerIdentifier}`)
      .limit(2);

    if (byName.length === 1) {
      matchedUser = byName[0];
      resolvedEmail = byName[0].email;
    } else if (byName.length === 0) {
      const emailPrefix = `${lowerIdentifier}@`;
      const byEmailLocal = await db
        .select({ email: user.email, banned: user.banned, banExpires: user.banExpires })
        .from(user)
        .where(sql`LOWER(${user.email}) LIKE ${`${emailPrefix}%`}`)
        .limit(2);
      if (byEmailLocal.length === 1) {
        matchedUser = byEmailLocal[0];
        resolvedEmail = byEmailLocal[0].email;
      }
    }
  }

  if (!resolvedEmail || (matchedUser && !isCmsUserActive(matchedUser))) {
    return jsonNoStore({ ok: false, error: "Usuário, e-mail ou senha inválidos." }, { status: 401 });
  }

  try {
    const signInResponse = await auth.api.signInEmail({
      body: { email: resolvedEmail, password },
      headers: request.headers,
      asResponse: true,
    });

    if (!signInResponse.ok) {
      return jsonNoStore({ ok: false, error: "Usuário, e-mail ou senha inválidos." }, { status: 401 });
    }

    const response = jsonNoStore({ ok: true }, { status: 200 });
    const setCookies =
      typeof signInResponse.headers.getSetCookie === "function"
        ? signInResponse.headers.getSetCookie()
        : [];
    for (const cookieHeader of setCookies) {
      response.headers.append("Set-Cookie", cookieHeader);
    }
    if (setCookies.length === 0) {
      const fallbackCookie = signInResponse.headers.get("set-cookie");
      if (fallbackCookie) response.headers.set("Set-Cookie", fallbackCookie);
    }
    return response;
  } catch {
    return jsonNoStore({ ok: false, error: "Usuário, e-mail ou senha inválidos." }, { status: 401 });
  }
}
