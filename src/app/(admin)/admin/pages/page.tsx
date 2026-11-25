import { asc } from "drizzle-orm";
import { AlertCircle, FilePlus2 } from "lucide-react";
import Link from "next/link";

import { db } from "@/db";
import { pages } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PagesTable, type ManagedPage } from "@/components/admin/pages-table";
import { requireCmsEditor } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminPagesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireCmsEditor();
  const query = await searchParams;
  const initialQuery = typeof query.q === "string" ? query.q.slice(0, 120) : "";
  const pageRows = (await db
    .select({
      id: pages.id,
      title: pages.title,
      routePath: pages.routePath,
      pageType: pages.pageType,
      status: pages.status,
    })
    .from(pages)
    .orderBy(asc(pages.title))) as ManagedPage[];

  return (
    <div className="space-y-7">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs font-medium text-[#77848c]">
            <span>Painel</span><span>/</span><span className="text-[#26343c]">Páginas</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#182127] sm:text-[34px]">Páginas</h1>
            <Badge variant="outline" className="border-[#e3e7e9] bg-white text-[10px] font-medium text-[#69767d]">{pageRows.length} páginas</Badge>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#68757d]">Gerencie conteúdo, mídia, rascunhos e publicação das páginas EndControl.</p>
        </div>
        <Button asChild className="w-fit bg-[#18252c] text-white hover:bg-[#26363f]">
          <Link href="/admin/pages/new"><FilePlus2 size={16} aria-hidden="true" /> Nova página</Link>
        </Button>
      </section>

      <div className="flex items-start gap-3 rounded-lg border border-[#e9e4d5] bg-[#fffdf7] px-4 py-3.5 text-xs leading-5 text-[#766a49]">
        <AlertCircle className="mt-0.5 shrink-0 text-[#ad9041]" size={16} aria-hidden="true" />
        <p>Rascunhos não alteram o site público. As páginas originais mantêm o visual e os efeitos atuais; somente o botão Publicar aplica a versão do CMS à página.</p>
      </div>

      <PagesTable key={initialQuery} pages={pageRows} initialQuery={initialQuery} />
    </div>
  );
}
