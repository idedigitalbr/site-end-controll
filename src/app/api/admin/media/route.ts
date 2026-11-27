import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { globalContentSettings, mediaAssets, pageVersions } from "@/db/schema";
import { getCmsSession } from "@/lib/auth";
import { canAccessCmsAdmin, canAccessCmsEditor } from "@/lib/cms/auth-role";
import { readImageDimensions } from "@/lib/cms/image-metadata";
import {
  checkRateLimit,
  InvalidJsonBodyError,
  JsonBodyLimitError,
  NO_STORE_PRIVATE_HEADERS,
  readBoundedJsonBody,
  validateSameOriginRequest,
} from "@/lib/cms/inline-editor-security";
import {
  MAX_MEDIA_BYTES,
  MAX_MEDIA_REQUEST_BYTES,
  MAX_VIDEO_BYTES,
  MAX_VIDEO_REQUEST_BYTES,
  MediaRequestLimitError,
  parseBoundedFormData,
  verifyImageUpload,
  verifyVideoUpload,
} from "@/lib/cms/media-validation";

export const runtime = "nodejs";

function mediaDirectory() {
  const configured = process.env.CMS_MEDIA_DIR ?? "storage/media";
  return path.resolve(/* turbopackIgnore: true */ process.cwd(), configured);
}

async function authorized() {
  const session = await getCmsSession();
  return session && canAccessCmsEditor(session.user) ? session : null;
}

async function authorizedSuperAdmin() {
  const session = await getCmsSession();
  if (!session || !canAccessCmsEditor(session.user)) return { status: 401 as const, session: null };
  if (!canAccessCmsAdmin(session.user)) return { status: 403 as const, session: null };
  return { status: 200 as const, session };
}

function jsonNoStore(body: unknown, init: ResponseInit = {}) {
  return NextResponse.json(body, {
    ...init,
    headers: { ...NO_STORE_PRIVATE_HEADERS, ...(init.headers ?? {}) },
  });
}

export async function POST(request: Request) {
  const sameOrigin = validateSameOriginRequest(request);
  if (!sameOrigin.allowed) {
    return jsonNoStore({ error: sameOrigin.reason || "Origem não autorizada." }, { status: 403 });
  }

  const session = await authorized();
  if (!session) {
    return jsonNoStore({ error: "Acesso administrativo necessário." }, { status: 401 });
  }

  const rate = checkRateLimit(`media:post:${session.user.id}`, 30, 60_000);
  if (!rate.allowed) {
    return jsonNoStore(
      { error: "Muitos envios seguidos. Aguarde alguns segundos e tente novamente." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } },
    );
  }

  const isVideoUpload = new URL(request.url).searchParams.get("type") === "video";

  let formData: FormData;
  try {
    formData = await parseBoundedFormData(
      request,
      isVideoUpload ? MAX_VIDEO_REQUEST_BYTES : MAX_MEDIA_REQUEST_BYTES,
    );
  } catch (error) {
    if (error instanceof MediaRequestLimitError) {
      return jsonNoStore(
        {
          error: isVideoUpload
            ? "O envio excede o limite de 50 MB para vídeo."
            : "O envio excede o limite de 10 MB para imagem.",
        },
        { status: 413 },
      );
    }
    return jsonNoStore({ error: "Envie um formulário de arquivo válido." }, { status: 400 });
  }

  const uploadScope = String(formData.get("scope") ?? "");
  const isScopedEditorUpload = uploadScope === "client-logo" || uploadScope === "director-media";
  if (!canAccessCmsAdmin(session.user) && !isScopedEditorUpload) {
    return jsonNoStore(
      { error: "Apenas contas Superadmin podem enviar ou alterar fotografias." },
      { status: 403 },
    );
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return jsonNoStore(
      { error: isVideoUpload ? "Selecione um vídeo para enviar." : "Selecione uma imagem para enviar." },
      { status: 400 },
    );
  }

  if (isVideoUpload) {
    if (file.size > MAX_VIDEO_BYTES) {
      return jsonNoStore({ error: "O vídeo deve ter no máximo 50 MB." }, { status: 413 });
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    const verified = verifyVideoUpload(bytes, file.type, file.size);
    if (!verified) {
      return jsonNoStore(
        { error: "Formato de vídeo inválido. Use MP4, WebM ou MOV." },
        { status: 415 },
      );
    }

    const altText = String(formData.get("altText") ?? "").trim();
    if (altText.length > 500) {
      return jsonNoStore({ error: "O texto alternativo deve ter até 500 caracteres." }, { status: 400 });
    }

    const id = randomUUID();
    const fileName = `${id}.${verified.extension}`;
    const originalName = file.name.replace(/[\u0000-\u001f\u007f]/g, "").slice(0, 255) || fileName;
    const destination = path.join(/* turbopackIgnore: true */ mediaDirectory(), fileName);

    try {
      await mkdir(mediaDirectory(), { recursive: true });
      await writeFile(destination, bytes, { flag: "wx", mode: 0o600 });
      await db.insert(mediaAssets).values({
        id,
        fileName,
        originalName,
        mimeType: verified.mimeType,
        sizeBytes: file.size,
        altText,
        width: null,
        height: null,
        createdByUserId: session.user.id,
      });
    } catch {
      await unlink(destination).catch(() => undefined);
      return jsonNoStore({ error: "Não foi possível salvar o vídeo. Tente novamente." }, { status: 500 });
    }

    return jsonNoStore(
      {
        media: {
          id,
          url: `/media/${fileName}`,
          originalName,
          mimeType: verified.mimeType,
          sizeBytes: file.size,
          altText,
          width: null,
          height: null,
        },
      },
      { status: 201 },
    );
  }

  if (file.size > MAX_MEDIA_BYTES) {
    return jsonNoStore({ error: "A imagem deve ter no máximo 10 MB." }, { status: 413 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const verified = verifyImageUpload(bytes, file.type, file.size);
  if (!verified) {
    return jsonNoStore({ error: "Formato de imagem inválido. Use JPEG, PNG, WebP, GIF ou AVIF." }, { status: 415 });
  }

  let dimensions: { width: number; height: number };
  try {
    dimensions = await readImageDimensions(bytes);
  } catch {
    return jsonNoStore({ error: "Imagem corrompida ou com resolução superior a 40 megapixels." }, { status: 415 });
  }

  const altText = String(formData.get("altText") ?? "").trim();
  if (altText.length > 500) {
    return jsonNoStore({ error: "O texto alternativo deve ter até 500 caracteres." }, { status: 400 });
  }

  const id = randomUUID();
  const fileName = `${id}.${verified.extension}`;
  const originalName = file.name.replace(/[\u0000-\u001f\u007f]/g, "").slice(0, 255) || fileName;
  const destination = path.join(/* turbopackIgnore: true */ mediaDirectory(), fileName);

  try {
    await mkdir(mediaDirectory(), { recursive: true });
    await writeFile(destination, bytes, { flag: "wx", mode: 0o600 });
    await db.insert(mediaAssets).values({
      id,
      fileName,
      originalName,
      mimeType: verified.mimeType as "image/jpeg" | "image/png" | "image/webp" | "image/gif" | "image/avif",
      sizeBytes: file.size,
      altText,
      ...dimensions,
      createdByUserId: session.user.id,
    });
  } catch {
    await unlink(destination).catch(() => undefined);
    return jsonNoStore({ error: "Não foi possível salvar a imagem. Tente novamente." }, { status: 500 });
  }

  return jsonNoStore(
    {
      media: {
        id,
        url: `/media/${fileName}`,
        originalName,
        mimeType: verified.mimeType,
        sizeBytes: file.size,
        altText,
        ...dimensions,
      },
    },
    { status: 201 },
  );
}

export async function GET() {
  if (!(await authorized())) {
    return jsonNoStore({ error: "Acesso administrativo necessário." }, { status: 401 });
  }

  const items = await db
    .select({
      id: mediaAssets.id,
      fileName: mediaAssets.fileName,
      originalName: mediaAssets.originalName,
      mimeType: mediaAssets.mimeType,
      sizeBytes: mediaAssets.sizeBytes,
      altText: mediaAssets.altText,
      createdAt: mediaAssets.createdAt,
    })
    .from(mediaAssets)
    .orderBy(desc(mediaAssets.createdAt));

  return jsonNoStore({
    media: items.map(({ fileName, ...item }) => ({ ...item, url: `/media/${fileName}` })),
  });
}

export async function PATCH(request: Request) {
  const sameOrigin = validateSameOriginRequest(request);
  if (!sameOrigin.allowed) {
    return jsonNoStore({ error: sameOrigin.reason || "Origem não autorizada." }, { status: 403 });
  }

  const authCheck = await authorizedSuperAdmin();
  if (!authCheck.session) {
    return jsonNoStore(
      {
        error:
          authCheck.status === 403
            ? "Apenas contas Superadmin podem enviar ou alterar imagens."
            : "Acesso administrativo necessário.",
      },
      { status: authCheck.status },
    );
  }

  let body: unknown;
  try {
    body = await readBoundedJsonBody(request, 16_384);
  } catch (error) {
    if (error instanceof JsonBodyLimitError) {
      return jsonNoStore({ error: "Requisição excede o tamanho permitido." }, { status: 413 });
    }
    if (error instanceof InvalidJsonBodyError) {
      return jsonNoStore({ error: "Corpo JSON inválido." }, { status: 400 });
    }
    return jsonNoStore({ error: "Corpo JSON inválido." }, { status: 400 });
  }

  const input = body as { id?: unknown; altText?: unknown } | null;
  const id = typeof input?.id === "string" ? input.id : "";
  const altText = typeof input?.altText === "string" ? input.altText.trim() : null;
  if (!/^[0-9a-f-]{36}$/i.test(id) || altText === null || altText.length > 500) {
    return jsonNoStore(
      { error: "Informe um item e um texto alternativo válidos (até 500 caracteres)." },
      { status: 400 },
    );
  }

  const [asset] = await db
    .select({ id: mediaAssets.id })
    .from(mediaAssets)
    .where(eq(mediaAssets.id, id))
    .limit(1);
  if (!asset) return jsonNoStore({ error: "Imagem não encontrada." }, { status: 404 });
  await db.update(mediaAssets).set({ altText }).where(eq(mediaAssets.id, id));
  return jsonNoStore({ success: true });
}

export async function DELETE(request: Request) {
  const sameOrigin = validateSameOriginRequest(request);
  if (!sameOrigin.allowed) {
    return jsonNoStore({ error: sameOrigin.reason || "Origem não autorizada." }, { status: 403 });
  }

  const authCheck = await authorizedSuperAdmin();
  if (!authCheck.session) {
    return jsonNoStore(
      {
        error:
          authCheck.status === 403
            ? "Apenas contas Superadmin podem enviar ou alterar imagens."
            : "Acesso administrativo necessário.",
      },
      { status: authCheck.status },
    );
  }
  const session = authCheck.session;

  const rate = checkRateLimit(`media:delete:${session.user.id}`, 30, 60_000);
  if (!rate.allowed) {
    return jsonNoStore(
      { error: "Muitas exclusões seguidas. Aguarde alguns segundos." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } },
    );
  }

  let body: unknown;
  try {
    body = await readBoundedJsonBody(request, 16_384);
  } catch (error) {
    if (error instanceof JsonBodyLimitError) {
      return jsonNoStore({ error: "Requisição excede o tamanho permitido." }, { status: 413 });
    }
    return jsonNoStore({ error: "Corpo JSON inválido." }, { status: 400 });
  }
  const id = (body as { id?: unknown } | null)?.id;
  if (typeof id !== "string" || !/^[0-9a-f-]{36}$/i.test(id)) {
    return jsonNoStore({ error: "Item de mídia inválido." }, { status: 400 });
  }

  const [asset] = await db
    .select({ id: mediaAssets.id, fileName: mediaAssets.fileName, sourcePath: mediaAssets.sourcePath })
    .from(mediaAssets)
    .where(eq(mediaAssets.id, id))
    .limit(1);
  if (!asset) return jsonNoStore({ error: "Imagem não encontrada." }, { status: 404 });
  if (asset.sourcePath) {
    return jsonNoStore(
      { error: "As imagens originais fazem parte do site e não podem ser excluídas. Você pode substituí-las no editor." },
      { status: 409 },
    );
  }

  const versions = await db.select({ content: pageVersions.content }).from(pageVersions);
  const assetUrl = `/media/${asset.fileName}`;
  const globalSettings = await db.select({ values: globalContentSettings.values }).from(globalContentSettings);
  const isReferenced =
    versions.some((version) => JSON.stringify(version.content).includes(assetUrl)) ||
    globalSettings.some((settings) => JSON.stringify(settings.values).includes(assetUrl));
  if (isReferenced) {
    return jsonNoStore(
      { error: "Esta imagem está vinculada a uma versão de página. Remova a referência antes de excluir." },
      { status: 409 },
    );
  }

  await db.delete(mediaAssets).where(eq(mediaAssets.id, id));
  await unlink(path.join(/* turbopackIgnore: true */ mediaDirectory(), asset.fileName)).catch(() => undefined);
  return jsonNoStore({ success: true });
}
