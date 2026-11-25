import "server-only";

import { cache } from "react";
import { desc, eq, inArray } from "drizzle-orm";
import type { Metadata } from "next";

import { db } from "@/db";
import { pageVersions, pages } from "@/db/schema";
import { prepareLegacyHtmlTemplate, type PreparedLegacyPageTemplate } from "@/components/public/legacy-react-template";
import { appendFfsOverrides } from "@/lib/cms/ffs-content";
import { getFfsOverrides } from "@/lib/cms/ffs-data";
import { applyGlobalContent } from "@/lib/cms/global-content";
import { getGlobalContent } from "@/lib/cms/global-content-data";
import { appendHomeServiceOrder } from "@/lib/cms/home-services-content";
import { getHomeServiceOrder } from "@/lib/cms/home-services-data";
import { applyNavigationContent } from "@/lib/cms/navigation-content";
import { getNavigationContent } from "@/lib/cms/navigation-data";
import { applyBackgroundOverrides } from "@/lib/cms/background-content";
import { getBackgroundContent } from "@/lib/cms/background-data";
import {
  appendPublicSolutionOverrides,
  appendThemeOverrides,
  applyContentPatches,
  applyPageMetadata,
  getSolutionCardImageAltOverride,
  getSolutionCardImageOverride,
  resolveCmsTemplatePath,
  type PublicSolutionOverride,
} from "@/lib/cms/page-content";
import { getPublicSiteTheme } from "@/lib/cms/settings-data";
import { buildPublicPageJsonLd } from "@/lib/cms/public-seo";
import { getLegacyPageTemplatePaths, readLegacyPageMarkup, serveLegacySiteFile } from "@/lib/legacy-site";
import { sitePages } from "@/lib/site-inventory";

const publicSiteUrlFallback = "https://idedigitalbr.github.io/site-end-controll/";
const auxiliaryTemplateFiles = new Set(["404.html", "identidade-visual.html", "preview-design-system.html"]);
const cmsRoutePaths = new Set(sitePages.map((page) => page.routePath));
const ffsRoutePath = "/1-solucao-engenharia-de-integridade-estrutural.html";

function normalizePublicRoutePath(routePath: string) {
  return routePath === "/index.html" ? "/" : routePath;
}

type CmsPageDocument = {
  routePath: string;
  pageTitle: string | null;
  summary: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  template: PreparedLegacyPageTemplate;
  pageJsonLd: string | null;
};

type PublishedVersion = {
  id: string;
  title: string;
  summary: string | null;
  content: unknown;
  seoTitle: string | null;
  seoDescription: string | null;
  status: "draft" | "published" | "archived";
};

export function getPublicSiteBaseUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL || publicSiteUrlFallback;
  try {
    const url = new URL(configured);
    if (url.protocol !== "http:" && url.protocol !== "https:") return new URL(publicSiteUrlFallback);
    url.search = "";
    url.hash = "";
    if (!url.pathname.endsWith("/")) url.pathname += "/";
    return url;
  } catch {
    return new URL(publicSiteUrlFallback);
  }
}

function canonicalUrlForRoute(routePath: string) {
  if (routePath !== "/" && !/^\/[a-z0-9]+(?:-[a-z0-9]+)*\.html$/i.test(routePath)) return null;
  const relativePath = routePath === "/" ? "index.html" : routePath.replace(/^\/+/, "");
  return new URL(relativePath, getPublicSiteBaseUrl()).toString();
}

function absoluteAssetUrl(value: string) {
  try {
    return new URL(value, getPublicSiteBaseUrl()).toString();
  } catch {
    return value;
  }
}

function pageJsonLd(routePath: string, title: string, description: string | null, canonicalUrl: string | null) {
  return buildPublicPageJsonLd(routePath, title, description, canonicalUrl, getPublicSiteBaseUrl().toString());
}

async function readTemplateMarkup(routePath: string, templatePath?: string | null) {
  const resolvedTemplatePath = resolveCmsTemplatePath(
    templatePath ?? routePath,
    getLegacyPageTemplatePaths(),
    routePath,
  );
  if (resolvedTemplatePath) return readLegacyPageMarkup(resolvedTemplatePath);
  const fileName = routePath.replace(/^\/+/, "");
  if (!auxiliaryTemplateFiles.has(fileName)) return null;
  const response = await serveLegacySiteFile(fileName);
  return response?.text() ?? null;
}

async function applyGlobalContentSafely(markup: string, routePath: string) {
  try {
    return applyGlobalContent(markup, await getGlobalContent());
  } catch (error) {
    console.error(`[cms] Falha ao carregar o conteúdo global para ${routePath}; mantendo o conteúdo original.`, error);
    return markup;
  }
}

async function getPublishedSolutionOverrides(): Promise<Record<string, PublicSolutionOverride>> {
  const servicePages = await db
    .select({ routePath: pages.routePath, versionId: pages.publishedVersionId, status: pages.status })
    .from(pages)
    .where(eq(pages.pageType, "service"));
  const publishedPages = servicePages.filter((page) => page.versionId && page.status !== "archived");
  if (publishedPages.length === 0) return {};

  const versions = await db
    .select({
      id: pageVersions.id,
      title: pageVersions.title,
      summary: pageVersions.summary,
      content: pageVersions.content,
      status: pageVersions.status,
    })
    .from(pageVersions)
    .where(inArray(pageVersions.id, publishedPages.map((page) => page.versionId!)));
  const versionsById = new Map(versions.map((version) => [version.id, version]));

  return Object.fromEntries(
    publishedPages.flatMap((page) => {
      const version = versionsById.get(page.versionId!);
      return version?.status === "published"
        ? [[page.routePath, {
            title: version.title,
            summary: version.summary,
            imageUrl: getSolutionCardImageOverride(version.content),
            imageAltText: getSolutionCardImageAltOverride(version.content),
          }]]
        : [];
    }),
  );
}

async function applyPageOverlays(markup: string, routePath: string) {
  let result = await applyGlobalContentSafely(markup, routePath);

  try {
    result = applyNavigationContent(result, await getNavigationContent());
  } catch (error) {
    console.error(`[cms] Falha ao carregar a navegação publicada para ${routePath}; mantendo os itens originais.`, error);
  }

  let publishedRoutePaths: string[];
  try {
    const publishedPages = await getPublishedCmsSitemapPages();
    publishedRoutePaths = publishedPages.map((page) => page.routePath);
  } catch (error) {
    if (!auxiliaryTemplateFiles.has(routePath.replace(/^\/+/, ""))) throw error;
    console.error(`[cms] Falha ao carregar as rotas publicadas para ${routePath}; mantendo o menu original.`, error);
    publishedRoutePaths = sitePages.map((page) => page.routePath);
  }
  const routesJson = JSON.stringify(publishedRoutePaths).replaceAll("<", "\\u003c");
  const payload = `<script id="cms-published-routes" type="application/json">${routesJson}</script>`;
  result = result.replace(/<script\b(?=[^>]*\bid=["']cms-published-routes["'])[^>]*>[\s\S]*?<\/script\s*>/gi, "");
  result = /<\/body\s*>/i.test(result)
    ? result.replace(/<\/body\s*>/i, `${payload}</body>`)
    : `${result}${payload}`;

  if (routePath === "/") {
    try {
      result = appendPublicSolutionOverrides(result, await getPublishedSolutionOverrides());
      result = appendHomeServiceOrder(result, await getHomeServiceOrder());
    } catch (error) {
      console.error("[cms] Falha ao carregar soluções publicadas para a Home; mantendo o conteúdo original.", error);
    }
  }

  if (routePath === ffsRoutePath) {
    try {
      result = appendFfsOverrides(result, await getFfsOverrides());
    } catch (error) {
      console.error("[cms] Falha ao carregar os mecanismos FFS publicados; mantendo o conteúdo original.", error);
    }
  }

  return result;
}

async function getPublishedVersion(routePath: string) {
  const [page] = await db.select().from(pages).where(eq(pages.routePath, routePath)).limit(1);
  if (!page?.publishedVersionId || page.status === "archived") return { page, version: null as PublishedVersion | null };

  const [version] = await db
    .select({
      id: pageVersions.id,
      title: pageVersions.title,
      summary: pageVersions.summary,
      content: pageVersions.content,
      seoTitle: pageVersions.seoTitle,
      seoDescription: pageVersions.seoDescription,
      status: pageVersions.status,
    })
    .from(pageVersions)
    .where(eq(pageVersions.id, page.publishedVersionId))
    .limit(1);

  return {
    page,
    version: version?.status === "published" ? version : null,
  };
}

export const getPublicPageDocument = cache(async (routePath: string): Promise<CmsPageDocument | null> => {
  routePath = normalizePublicRoutePath(routePath);
  const { page, version } = await getPublishedVersion(routePath);
  const isCmsPage = cmsRoutePaths.has(routePath) || Boolean(page);
  if (isCmsPage && (!page || !version)) return null;

  const rawSource = await readTemplateMarkup(routePath, page?.templatePath);
  const source = rawSource?.replace(/^\uFEFF/, "") ?? null;
  if (!source) return null;

  let markup = source;
  let pageTitle: string | null = null;
  let summary: string | null = null;
  let seoTitle: string | null = null;
  let seoDescription: string | null = null;

  if (page && version) {
    pageTitle = version.title ?? page.title ?? sitePages.find((item) => item.routePath === routePath)?.title ?? null;
    summary = version.summary ?? page.summary ?? null;
    seoTitle = version.seoTitle ?? null;
    seoDescription = version.seoDescription ?? null;

    try {
      markup = applyContentPatches(source, version.content, routePath);
    } catch (error) {
      console.error(`[cms] Os campos publicados de ${routePath} não correspondem ao template; mantendo o conteúdo original.`, error);
    }
  }

  markup = await applyPageOverlays(markup, routePath);
  const template = prepareLegacyHtmlTemplate(markup, { rootRelativeUrls: routePath === "/404.html" });
  const effectiveTitle = seoTitle?.trim() || pageTitle?.trim() || template.metadata.title || "EndControl";
  const effectiveSummary = seoDescription?.trim() || summary?.trim() || template.metadata.description;
  const canonicalUrl = canonicalUrlForRoute(routePath);

  return {
    routePath,
    pageTitle,
    summary,
    seoTitle,
    seoDescription,
    canonicalUrl,
    template,
    pageJsonLd: pageJsonLd(routePath, effectiveTitle, effectiveSummary, canonicalUrl),
  };
});

function sourceRobots(value: string | null): Metadata["robots"] {
  if (!value) return undefined;
  const directives = new Set(value.toLowerCase().split(/[\s,]+/).filter(Boolean));
  return {
    index: !directives.has("noindex"),
    follow: !directives.has("nofollow"),
    noarchive: directives.has("noarchive"),
    nosnippet: directives.has("nosnippet"),
    noimageindex: directives.has("noimageindex"),
  };
}

export function publicMetadataForDocument(document: CmsPageDocument): Metadata {
  const sourceMetadata = document.template.metadata;
  const title = document.seoTitle?.trim()
    || document.pageTitle?.trim()
    || sourceMetadata.title
    || "EndControl";
  const description = document.seoDescription?.trim()
    || document.summary?.trim()
    || sourceMetadata.description
    || undefined;
  const canonicalUrl = document.canonicalUrl ?? undefined;
  const images = sourceMetadata.openGraph.images.map((image) => ({
    url: absoluteAssetUrl(image.url),
    ...(image.alt ? { alt: image.alt } : {}),
    ...(image.width && Number.isFinite(Number(image.width)) ? { width: Number(image.width) } : {}),
    ...(image.height && Number.isFinite(Number(image.height)) ? { height: Number(image.height) } : {}),
  }));
  const twitterCard = sourceMetadata.twitter.card === "summary"
    ? "summary"
    : "summary_large_image";
  const robots = sourceRobots(sourceMetadata.robots);

  const metadata: Metadata = {
    title: { absolute: title },
    description,
    ...(canonicalUrl ? { alternates: { canonical: canonicalUrl } } : {}),
    openGraph: {
      title,
      ...(description ? { description } : {}),
      ...(canonicalUrl ? { url: canonicalUrl } : {}),
      ...(sourceMetadata.openGraph.siteName ? { siteName: sourceMetadata.openGraph.siteName } : {}),
      type: "website",
      ...(sourceMetadata.openGraph.locale ? { locale: sourceMetadata.openGraph.locale } : {}),
      ...(images.length ? { images } : {}),
    },
    twitter: {
      card: twitterCard,
      title,
      ...(description ? { description } : {}),
      ...(sourceMetadata.twitter.site ? { site: sourceMetadata.twitter.site } : {}),
      ...(sourceMetadata.twitter.creator ? { creator: sourceMetadata.twitter.creator } : {}),
      ...(sourceMetadata.twitter.images.length
        ? { images: sourceMetadata.twitter.images.map(absoluteAssetUrl) }
        : images.length ? { images: images.map((image) => image.url) } : {}),
    },
    ...(document.template.metadata.icons.length
      ? {
          icons: document.template.metadata.icons.map((icon) => ({
            url: absoluteAssetUrl(icon.href),
            ...(icon.type ? { type: icon.type } : {}),
            ...(icon.sizes ? { sizes: icon.sizes } : {}),
          })),
        }
      : {}),
    ...(robots ? { robots } : {}),
  };

  return metadata;
}

export async function getPublishedCmsSitemapPages() {
  const cmsPages = await db
    .select({ routePath: pages.routePath, versionId: pages.publishedVersionId, status: pages.status })
    .from(pages);
  const publishedPages = cmsPages.filter((page) => page.versionId && page.status !== "archived");
  if (publishedPages.length === 0) return [];

  const versions = await db
    .select({ id: pageVersions.id, status: pageVersions.status, publishedAt: pageVersions.publishedAt })
    .from(pageVersions)
    .where(inArray(pageVersions.id, publishedPages.map((page) => page.versionId!)));
  const versionsById = new Map(versions.map((version) => [version.id, version]));

  return publishedPages.flatMap((page) => {
    const version = versionsById.get(page.versionId!);
    return version?.status === "published"
      ? [{ routePath: page.routePath, publishedAt: version.publishedAt }]
      : [];
  });
}

export async function serveCmsStaticAsset(requestedPath: string): Promise<Response | null> {
  const legacyResponse = await serveLegacySiteFile(requestedPath);
  if (!legacyResponse || !requestedPath.toLowerCase().endsWith(".css")) return legacyResponse;

  let css = await legacyResponse.clone().text();
  let modified = false;

  try {
    const backgrounds = await getBackgroundContent();
    const nextCss = applyBackgroundOverrides(css, backgrounds);
    modified ||= nextCss !== css;
    css = nextCss;
  } catch (error) {
    console.error("[cms] Falha ao carregar imagens de fundo; usando as referências CSS originais.", error);
  }

  try {
    if (requestedPath.replace(/^\/+/, "") === "src/css/tokens.css") {
      const theme = await getPublicSiteTheme();
      if (theme) {
        const nextCss = appendThemeOverrides(css, theme);
        modified ||= nextCss !== css;
        css = nextCss;
      }
    }
  } catch (error) {
    console.error("[cms] Falha ao carregar cores globais; usando os tokens CSS originais.", error);
  }

  if (!modified) return legacyResponse;
  const headers = new Headers(legacyResponse.headers);
  headers.delete("content-length");
  return new Response(css, { status: legacyResponse.status, headers });
}

export async function renderCmsPagePreview(pageId: string) {
  if (!/^[0-9a-f-]{36}$/i.test(pageId)) {
    return new Response("Página não encontrada.", { status: 404 });
  }

  const [page] = await db.select().from(pages).where(eq(pages.id, pageId)).limit(1);
  if (!page) return new Response("Página não encontrada.", { status: 404 });

  const [version] = await db
    .select()
    .from(pageVersions)
    .where(eq(pageVersions.pageId, pageId))
    .orderBy(desc(pageVersions.version))
    .limit(1);
  if (!version) return new Response("Rascunho não encontrado.", { status: 404 });

  const templatePath = resolveCmsTemplatePath(page.templatePath, getLegacyPageTemplatePaths(), page.routePath);
  if (!templatePath) return new Response("Template não permitido.", { status: 404 });

  const source = (await readLegacyPageMarkup(templatePath))?.replace(/^\uFEFF/, "") ?? null;
  if (!source) return new Response("Template não encontrado.", { status: 404 });

  let markup = applyContentPatches(source, version.content, page.routePath);
  markup = await applyPageOverlays(markup, page.routePath);

  const canonicalUrl = canonicalUrlForRoute(page.routePath);
  markup = applyPageMetadata(markup, {
    title: version.title,
    summary: version.summary,
    seoTitle: version.seoTitle,
    seoDescription: version.seoDescription,
    canonicalUrl: canonicalUrl ?? undefined,
  });

  const structuredData = pageJsonLd(
    page.routePath,
    version.seoTitle?.trim() || version.title,
    version.seoDescription?.trim() || version.summary,
    canonicalUrl,
  );
  if (structuredData) {
    markup = markup.replace(
      /<\/body\s*>/i,
      `<script type="application/ld+json">${structuredData}</script></body>`,
    );
  }

  return new Response(markup, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex, nofollow, noarchive",
    },
  });
}
