export type CmsSitemapPage = {
  routePath: string;
  publishedAt?: Date | null;
};

function xmlEscape(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function routeFilename(routePath: string) {
  if (routePath === "/") return "index.html";
  if (!/^\/[a-z0-9-]+\.html$/i.test(routePath)) return null;
  return routePath.slice(1);
}

function formatDate(value?: Date | null) {
  if (!value || Number.isNaN(value.getTime())) return null;
  return value.toISOString().slice(0, 10);
}

export function renderCmsSitemap(
  originalXml: string,
  siteUrl: string,
  publishedPages: CmsSitemapPage[],
) {
  let base: URL;
  try {
    base = new URL(siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`);
    if (base.protocol !== "http:" && base.protocol !== "https:") return originalXml;
    base.search = "";
    base.hash = "";
  } catch {
    return originalXml;
  }

  const existingRoutes = new Set<string>();
  const rewritten = originalXml.replace(/<loc>([\s\S]*?)<\/loc>/gi, (locationTag, rawLocation: string) => {
    try {
      const fileName = new URL(rawLocation.trim()).pathname.split("/").filter(Boolean).at(-1);
      if (!fileName || !/^[a-z0-9-]+\.html$/i.test(fileName)) return locationTag;
      existingRoutes.add(fileName);
      return `<loc>${xmlEscape(new URL(fileName, base).toString())}</loc>`;
    } catch {
      return locationTag;
    }
  });

  const additions = publishedPages.flatMap((page) => {
    const fileName = routeFilename(page.routePath);
    if (!fileName || existingRoutes.has(fileName)) return [];

    existingRoutes.add(fileName);
    const lastmod = formatDate(page.publishedAt);
    return [`  <url>\n    <loc>${xmlEscape(new URL(fileName, base).toString())}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}\n    <changefreq>monthly</changefreq>\n    <priority>0.65</priority>\n  </url>`];
  });

  if (additions.length === 0) return rewritten;
  return rewritten.replace(/<\/urlset\s*>/i, `${additions.join("\n")}\n</urlset>`);
}
