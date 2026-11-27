import "server-only";

import { readFile, realpath } from "node:fs/promises";
import path from "node:path";

import { sitePages } from "@/lib/site-inventory";

const rootHtmlFiles = new Set([
  "index.html",
  ...sitePages.map((page) => page.routePath.replace(/^\//, "")),
  "404.html",
  "identidade-visual.html",
  "preview-design-system.html",
]);

function isAllowedLegacyPath(relativePath: string) {
  if (rootHtmlFiles.has(relativePath)) return true;
  if (relativePath === "robots.txt" || relativePath === "sitemap.xml") return true;
  if (relativePath.startsWith(`assets${path.sep}`)) return true;
  if (relativePath.startsWith(`src${path.sep}css${path.sep}`)) return true;
  if (relativePath.startsWith(`src${path.sep}js${path.sep}`)) return true;
  return false;
}

export function getLegacyPageTemplatePaths() {
  return sitePages.map((page) => page.routePath);
}

export async function readLegacyPageMarkup(templatePath: string) {
  const allowedTemplates = new Set(getLegacyPageTemplatePaths());
  if (!allowedTemplates.has(templatePath)) return null;

  const relativePath = templatePath === "/" ? "index.html" : templatePath.replace(/^\/+/, "");
  if (!rootHtmlFiles.has(relativePath) || path.extname(relativePath) !== ".html") return null;

  const absolutePath = path.resolve(/* turbopackIgnore: true */ process.cwd(), relativePath);
  try {
    return await readFile(absolutePath, "utf8");
  } catch {
    return null;
  }
}

function getContentType(extension: string) {
  const types: Record<string, string> = {
    ".avif": "image/avif",
    ".css": "text/css; charset=utf-8",
    ".eot": "application/vnd.ms-fontobject",
    ".gif": "image/gif",
    ".html": "text/html; charset=utf-8",
    ".ico": "image/x-icon",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".m4a": "audio/mp4",
    ".map": "application/json; charset=utf-8",
    ".mp4": "video/mp4",
    ".otf": "font/otf",
    ".pdf": "application/pdf",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".ttf": "font/ttf",
    ".txt": "text/plain; charset=utf-8",
    ".webm": "video/webm",
    ".webp": "image/webp",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".xml": "application/xml; charset=utf-8",
  };

  return types[extension.toLowerCase()] ?? "application/octet-stream";
}

export async function serveLegacySiteFile(requestedPath: string, status = 200): Promise<Response | null> {
  const normalizedPath = path.normalize(requestedPath).replace(/^[\\/]+/, "");
  const absolutePath = path.resolve(/* turbopackIgnore: true */ process.cwd(), normalizedPath);
  const relativePath = path.relative(process.cwd(), absolutePath);

  if (
    relativePath === "" ||
    relativePath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativePath) ||
    !isAllowedLegacyPath(relativePath)
  ) {
    return null;
  }

  try {
    const [canonicalRoot, canonicalFile] = await Promise.all([
      realpath(process.cwd()),
      realpath(absolutePath),
    ]);
    const canonicalRelative = path.relative(canonicalRoot, canonicalFile);
    if (
      !canonicalRelative ||
      canonicalRelative.startsWith("..") ||
      path.isAbsolute(canonicalRelative) ||
      !isAllowedLegacyPath(canonicalRelative)
    ) {
      return null;
    }

    const extension = path.extname(canonicalRelative).toLowerCase();
    const isCacheableStatic =
      extension !== ".html" &&
      extension !== ".css" &&
      (canonicalRelative.startsWith(`assets${path.sep}`) ||
        canonicalRelative.startsWith(`src${path.sep}js${path.sep}`));

    const body = await readFile(canonicalFile);
    return new Response(body, {
      status,
      headers: {
        "Cache-Control": isCacheableStatic
          ? "public, max-age=3600, stale-while-revalidate=86400"
          : "no-store",
        "Content-Type": getContentType(extension),
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return null;
  }
}
