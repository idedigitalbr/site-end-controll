import { open, readFile, realpath, stat } from "node:fs/promises";
import path from "node:path";

import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { mediaAssets } from "@/db/schema";

export const runtime = "nodejs";

function parseByteRange(rangeHeader: string, totalSize: number): { start: number; end: number } | "unsatisfiable" | null {
  const match = /^bytes=(\d*)-(\d*)$/i.exec(rangeHeader.trim());
  if (!match) return null;
  const [, rawStart, rawEnd] = match;
  if (!rawStart && !rawEnd) return null;

  let start: number;
  let end: number;

  if (!rawStart) {
    const suffixLength = Number(rawEnd);
    if (!Number.isFinite(suffixLength) || suffixLength <= 0) return "unsatisfiable";
    start = Math.max(0, totalSize - suffixLength);
    end = totalSize - 1;
  } else {
    start = Number(rawStart);
    end = rawEnd ? Number(rawEnd) : totalSize - 1;
  }

  if (
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    start < 0 ||
    start >= totalSize ||
    end < start
  ) {
    return "unsatisfiable";
  }

  return { start, end: Math.min(end, totalSize - 1) };
}

export async function GET(request: Request, { params }: { params: Promise<{ fileName: string }> }) {
  const { fileName } = await params;
  if (!/^[0-9a-f-]{36}\.(?:jpg|png|webp|gif|avif|mp4|webm|mov)$/i.test(fileName)) {
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

    const cacheControl = asset.sourcePath
      ? "public, max-age=0, must-revalidate"
      : "public, max-age=31536000, immutable";
    const rangeHeader = request.headers.get("range");

    if (rangeHeader) {
      const fileStat = await stat(filename);
      const totalSize = fileStat.size;
      const parsedRange = parseByteRange(rangeHeader, totalSize);
      if (parsedRange === "unsatisfiable") {
        return new NextResponse(null, {
          status: 416,
          headers: {
            "Content-Range": `bytes */${totalSize}`,
            "Accept-Ranges": "bytes",
          },
        });
      }
      if (parsedRange) {
        const chunkLength = parsedRange.end - parsedRange.start + 1;
        const buffer = Buffer.alloc(chunkLength);
        const handle = await open(filename, "r");
        try {
          await handle.read(buffer, 0, chunkLength, parsedRange.start);
        } finally {
          await handle.close();
        }
        return new NextResponse(buffer, {
          status: 206,
          headers: {
            "Content-Type": asset.mimeType,
            "Content-Length": String(chunkLength),
            "Content-Range": `bytes ${parsedRange.start}-${parsedRange.end}/${totalSize}`,
            "Accept-Ranges": "bytes",
            "Content-Disposition": "inline",
            "Cache-Control": cacheControl,
            "X-Content-Type-Options": "nosniff",
          },
        });
      }
    }

    const bytes = await readFile(filename);
    return new NextResponse(bytes, {
      headers: {
        "Content-Type": asset.mimeType,
        "Content-Length": String(bytes.byteLength),
        "Accept-Ranges": "bytes",
        "Content-Disposition": "inline",
        "Cache-Control": cacheControl,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
