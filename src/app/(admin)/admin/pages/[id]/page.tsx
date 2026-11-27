import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { load } from "cheerio";

import { db } from "@/db";
import { cmsPageAuditEvents, pageVersions, pages, user } from "@/db/schema";
import { PageEditorForm } from "@/components/admin/page-editor-form";
import { PageVersionHistory } from "@/components/admin/page-version-history";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { hydrateEditableFields, resolveCmsTemplatePath } from "@/lib/cms/page-content";
import { listCmsMedia } from "@/lib/cms/settings-data";
import { requireCmsEditor } from "@/lib/auth";
import { getLegacyPageTemplatePaths, readLegacyPageMarkup } from "@/lib/legacy-site";

export const dynamic = "force-dynamic";

export default async function PageEditor({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; published?: string; unpublished?: string; created?: string; restored?: string }>;
}) {
  await requireCmsEditor();
  const [{ id }, query] = await Promise.all([params, searchParams]);
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const [page] = await db.select().from(pages).where(eq(pages.id, id)).limit(1);
  if (!page) notFound();

  const versions = await db
    .select({
      id: pageVersions.id,
      version: pageVersions.version,
      title: pageVersions.title,
      summary: pageVersions.summary,
      content: pageVersions.content,
      seoTitle: pageVersions.seoTitle,
      seoDescription: pageVersions.seoDescription,
      status: pageVersions.status,
      createdAt: pageVersions.createdAt,
      publishedAt: pageVersions.publishedAt,
      authorName: user.name,
      authorEmail: user.email,
    })
    .from(pageVersions)
    .leftJoin(user, eq(pageVersions.createdByUserId, user.id))
    .where(eq(pageVersions.pageId, id))
    .orderBy(desc(pageVersions.version));
  const latestVersion = versions[0];
  const events = await db
    .select({
      id: cmsPageAuditEvents.id,
      action: cmsPageAuditEvents.action,
      versionId: cmsPageAuditEvents.versionId,
      sourceVersionId: cmsPageAuditEvents.sourceVersionId,
      createdAt: cmsPageAuditEvents.createdAt,
      actorName: user.name,
      actorEmail: user.email,
    })
    .from(cmsPageAuditEvents)
    .leftJoin(user, eq(cmsPageAuditEvents.actorUserId, user.id))
    .where(eq(cmsPageAuditEvents.pageId, id))
    .orderBy(desc(cmsPageAuditEvents.createdAt));
  const templatePath = resolveCmsTemplatePath(page.templatePath, getLegacyPageTemplatePaths(), page.routePath);
  if (!templatePath) notFound();
  const source = await readLegacyPageMarkup(templatePath);
  if (!source) notFound();

  const fields = hydrateEditableFields(source, latestVersion?.content ?? [], page.routePath);
  const media = (await listCmsMedia())
    .filter((item) => item.mimeType.startsWith("image/"))
    .map(({ id: mediaId, url, altText, originalName }) => ({
      id: mediaId,
      url,
      altText,
      originalName,
    }));
  const title = latestVersion?.title ?? page.title;
  const isPublished = Boolean(page.publishedVersionId);
  const statusLabel = page.status === "published"
    ? "Publicado"
    : isPublished ? "Rascunho · publicação anterior ativa" : "Rascunho";
  const publicHref = page.routePath === "/" ? "/" : page.routePath;
  const $source = load(source.replace(/^﻿/, ""));
  const defaultSeoTitle = $source("title").first().text().trim();
  const defaultSeoDescription = ($source("meta[name='description']").first().attr("content") ?? "").trim();
  const publishedVersion = versions.find((version) => version.id === page.publishedVersionId);
  const publishedAtLabel = publishedVersion?.publishedAt
    ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Sao_Paulo" }).format(publishedVersion.publishedAt)
    : null;

  return (
    <div className="space-y-7">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div className="min-w-0">
          <Button asChild variant="ghost" size="sm" className="mb-3 -ml-2 h-8 px-2 text-xs text-[#718087] hover:text-[#182127]">
            <Link href="/admin/pages"><ArrowLeft size={14} aria-hidden="true" /> Voltar para páginas</Link>
          </Button>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={isPublished
              ? "border-[#d7e8de] bg-[#f5fbf7] text-[10px] text-[#407451]"
              : "border-[#e8e5dc] bg-[#fbfaf6] text-[10px] text-[#82713e]"}
            >{statusLabel}</Badge>
            <span className="text-[11px] text-[#879198]">Versão {latestVersion?.version ?? 0}</span>
          </div>
          <h1 className="max-w-3xl truncate text-2xl font-semibold tracking-[-0.035em] text-[#182127] sm:text-[30px]">{title}</h1>
          <p className="mt-2 break-all font-mono text-[11px] text-[#879198]">{page.routePath}</p>
          <p className="mt-3 max-w-2xl text-xs leading-5 text-[#728087]">
            {isPublished
              ? "O rascunho pode ser editado sem substituir a publicação atual até você publicar a atualização."
              : "As edições ficam como rascunho. Publique para aplicá-las à página pública."}
          </p>
        </div>
        <Button asChild variant="outline" className="h-9 shrink-0 border-[#e0e5e7] bg-white text-xs">
          <Link href={publicHref} target="_blank" rel="noreferrer"><ExternalLink size={14} aria-hidden="true" /> Abrir página atual</Link>
        </Button>
      </section>

      {(query.saved || query.published || query.unpublished || query.created || query.restored) && (
        <p role="status" className="rounded-md border border-[#d7e8de] bg-[#f5fbf7] px-4 py-3 text-xs text-[#407451]">
          {query.published ? "A versão foi publicada no site." : query.unpublished ? "A página foi retirada do site." : query.restored ? "Versão restaurada como um novo rascunho." : query.created ? "Página criada como rascunho." : "Rascunho salvo no MySQL."}
        </p>
      )}

      <PageEditorForm
        key={latestVersion?.id ?? "initial"}
        pageId={page.id}
        routePath={page.routePath}
        title={title}
        summary={latestVersion?.summary ?? page.summary}
        seoTitle={latestVersion?.seoTitle ?? null}
        seoDescription={latestVersion?.seoDescription ?? null}
        fields={fields}
        media={media}
        isPublished={isPublished}
        defaultSeoTitle={defaultSeoTitle}
        defaultSeoDescription={defaultSeoDescription}
        publishedAtLabel={publishedAtLabel}
        statusLabel={statusLabel}
        versionNumber={latestVersion?.version ?? 0}
      />
      <PageVersionHistory
        pageId={page.id}
        currentVersionId={latestVersion?.id ?? null}
        versions={versions}
        events={events}
      />
    </div>
  );
}
