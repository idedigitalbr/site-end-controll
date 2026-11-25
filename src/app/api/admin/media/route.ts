import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { globalContentSettings, mediaAssets, pageVersions } from "@/db/schema";
import { getCmsSession } from "@/lib/auth";
import { isCmsEditor } from "@/lib/cms/auth-role";
import { readImageDimensions } from "@/lib/cms/image-metadata";
import {
  MAX_MEDIA_BYTES,
  MediaRequestLimitError,
  parseBoundedFormData,
  verifyImageUpload,
} from "@/lib/cms/media-validation";

export const runtime = "nodejs";

function mediaDirectory() {
  const configured = process.env.CMS_MEDIA_DIR ?? "storage/media";
  return path.resolve(/* turbopackIgnore: true */ process.cwd(), configured);
}

async function authorized() {
  const session = await getCmsSession();
  return session && isCmsEditor(session.user.role) ? session : null;
}

export async function POST(request: Request) {
  const session = await authorized();
  if (!session) {
    return NextResponse.json({ error: "Acesso administrativo necessário." }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await parseBoundedFormData(request);
  } catch (error) {
    if (error instanceof MediaRequestLimitError) {
      return NextResponse.json({ error: "O envio excede o limite de 10 MB para imagem." }, { status: 413 });
    }
    return NextResponse.json({ error: "Envie um formulário de arquivo válido." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Selecione uma imagem para enviar." }, { status: 400 });
  }
  if (file.size > MAX_MEDIA_BYTES) {
    return NextResponse.json({ error: "A imagem deve ter no máximo 10 MB." }, { status: 413 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const verified = verifyImageUpload(bytes, file.type, file.size);
  if (!verified) {
    return NextResponse.json({ error: "Formato de imagem inválido. Use JPEG, PNG, WebP, GIF ou AVIF." }, { status: 415 });
  }

  let dimensions: { width: number; height: number };
  try {
    dimensions = await readImageDimensions(bytes);
  } catch {
    return NextResponse.json({ error: "Imagem corrompida ou com resolução superior a 40 megapixels." }, { status: 415 });
  }

  const altText = String(formData.get("altText") ?? "").trim();
  if (altText.length > 500) {
    return NextResponse.json({ error: "O texto alternativo deve ter até 500 caracteres." }, { status: 400 });
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
    return NextResponse.json({ error: "Não foi possível salvar a imagem. Tente novamente." }, { status: 500 });
  }

  return NextResponse.json({
    media: { id, url: `/media/${fileName}`, originalName, mimeType: verified.mimeType, sizeBytes: file.size, altText, ...dimensions },
  }, { status: 201 });
}

export async function GET() {
  if (!(await authorized())) {
    return NextResponse.json({ error: "Acesso administrativo necessário." }, { status: 401 });
  }

  const items = await db.select({
    id: mediaAssets.id,
    fileName: mediaAssets.fileName,
    originalName: mediaAssets.originalName,
    mimeType: mediaAssets.mimeType,
    sizeBytes: mediaAssets.sizeBytes,
    altText: mediaAssets.altText,
    createdAt: mediaAssets.createdAt,
  }).from(mediaAssets);

  return NextResponse.json({ media: items.map(({ fileName, ...item }) => ({ ...item, url: `/media/${fileName}` })) });
}

export async function PATCH(request: Request) {
  if (!(await authorized())) {
    return NextResponse.json({ error: "Acesso administrativo necessário." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo JSON inválido." }, { status: 400 });
  }

  const input = body as { id?: unknown; altText?: unknown } | null;
  const id = typeof input?.id === "string" ? input.id : "";
  const altText = typeof input?.altText === "string" ? input.altText.trim() : null;
  if (!/^[0-9a-f-]{36}$/i.test(id) || altText === null || altText.length > 500) {
    return NextResponse.json({ error: "Informe um item e um texto alternativo válidos (até 500 caracteres)." }, { status: 400 });
  }

  const [asset] = await db.select({ id: mediaAssets.id }).from(mediaAssets).where(eq(mediaAssets.id, id)).limit(1);
  if (!asset) return NextResponse.json({ error: "Imagem não encontrada." }, { status: 404 });
  await db.update(mediaAssets).set({ altText }).where(eq(mediaAssets.id, id));
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  if (!(await authorized())) {
    return NextResponse.json({ error: "Acesso administrativo necessário." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo JSON inválido." }, { status: 400 });
  }
  const id = (body as { id?: unknown } | null)?.id;
  if (typeof id !== "string" || !/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json({ error: "Item de mídia inválido." }, { status: 400 });
  }

  const [asset] = await db.select({ id: mediaAssets.id, fileName: mediaAssets.fileName, sourcePath: mediaAssets.sourcePath })
    .from(mediaAssets).where(eq(mediaAssets.id, id)).limit(1);
  if (!asset) return NextResponse.json({ error: "Imagem não encontrada." }, { status: 404 });
  if (asset.sourcePath) return NextResponse.json({ error: "As imagens originais fazem parte do site e não podem ser excluídas. Você pode substituí-las no editor." }, { status: 409 });

  const versions = await db.select({ content: pageVersions.content }).from(pageVersions);
  const assetUrl = `/media/${asset.fileName}`;
  const globalSettings = await db.select({ values: globalContentSettings.values }).from(globalContentSettings);
  const isReferenced = versions.some((version) => JSON.stringify(version.content).includes(assetUrl))
    || globalSettings.some((settings) => JSON.stringify(settings.values).includes(assetUrl));
  if (isReferenced) {
    return NextResponse.json({ error: "Esta imagem está vinculada a uma versão de página. Remova a referência antes de excluir." }, { status: 409 });
  }

  await db.delete(mediaAssets).where(eq(mediaAssets.id, id));
  await unlink(path.join(/* turbopackIgnore: true */ mediaDirectory(), asset.fileName)).catch(() => undefined);
  return NextResponse.json({ success: true });
}
