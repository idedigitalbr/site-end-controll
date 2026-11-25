import { readFile, realpath } from "node:fs/promises";
import path from "node:path";

import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { mediaAssets } from "@/db/schema";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ fileName: string }> }) {
  const { fileName } = await params;
  if (!/^[0-9a-f-]{36}\.(?:jpg|png|webp|gif|avif)$/i.test(fileName)) {
    return new NextResponse(null, { status: 404 });
  }

  const [asset] = await db.select({ fileName: mediaAssets.fileName, mimeType: mediaAssets.mimeType, sourcePath: mediaAssets.sourcePath })
    .from(mediaAssets).where(eq(mediaAssets.fileName, fileName)).limit(1);
  if (!asset) return new NextResponse(null, { status: 404 });

  try {
    const directory = path.resolve(/* turbopackIgnore: true */ process.cwd(), process.env.CMS_MEDIA_DIR ?? "storage/media");
    let filename = path.join(/* turbopackIgnore: true */ directory, asset.fileName);
    if (asset.sourcePath) {
      const assetsRoot = await realpath(path.resolve("assets"));
      filename = await realpath(path.resolve(/* turbopackIgnore: true */ asset.sourcePath));
      const relative = path.relative(assetsRoot, filename);
      if (relative.startsWith("..") || path.isAbsolute(relative)) return new NextResponse(null, { status: 404 });
    }
    const bytes = await readFile(filename);
    return new NextResponse(bytes, {
      headers: {
        "Content-Type": asset.mimeType,
        "Content-Length": String(bytes.byteLength),
        "Content-Disposition": "inline",
        "Cache-Control": asset.sourcePath ? "public, max-age=0, must-revalidate" : "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
