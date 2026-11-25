import type { MetadataRoute } from "next";

import { getPublicSiteBaseUrl } from "@/lib/cms/public-renderer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  const siteBase = getPublicSiteBaseUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/", "/login", "/login/", "/api/"],
    },
    sitemap: new URL("sitemap.xml", siteBase).toString(),
  };
}
