import type { MetadataRoute } from "next";

import { getPublicSiteBaseUrl, getPublishedCmsSitemapPages } from "@/lib/cms/public-renderer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteBase = getPublicSiteBaseUrl();
  const pages = await getPublishedCmsSitemapPages();

  return pages.map((page) => ({
    url: new URL(page.routePath === "/" ? "index.html" : page.routePath.replace(/^\/+/, ""), siteBase).toString(),
    ...(page.publishedAt ? { lastModified: page.publishedAt } : {}),
  }));
}
