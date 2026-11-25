import { sitePages } from "@/lib/site-inventory";

const cmsRoutes = new Set(sitePages.map((page) => page.routePath));

export function buildPublicPageJsonLd(
  routePath: string,
  title: string,
  description: string | null,
  canonicalUrl: string | null,
  siteUrl: string,
) {
  if (!canonicalUrl || !cmsRoutes.has(routePath)) return null;

  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description: description || undefined,
    url: canonicalUrl,
    isPartOf: {
      "@type": "WebSite",
      name: "EndControl",
      url: siteUrl,
    },
  }).replaceAll("<", "\\u003c");
}
