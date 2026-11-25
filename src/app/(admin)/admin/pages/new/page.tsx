import Link from "next/link";
import { ArrowLeft, Layers3 } from "lucide-react";

import { CreatePageForm } from "@/components/admin/create-page-form";
import { Button } from "@/components/ui/button";
import { requireCmsEditor } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NewPage() {
  await requireCmsEditor();

  return (
    <div className="mx-auto max-w-4xl space-y-7">
      <section>
        <Button asChild variant="ghost" size="sm" className="mb-3 -ml-2 h-8 px-2 text-xs text-[#718087] hover:text-[#182127]">
          <Link href="/admin/pages"><ArrowLeft size={14} aria-hidden="true" /> Voltar para páginas</Link>
        </Button>
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-md bg-[#edf3f4] text-[#536c74]"><Layers3 size={18} aria-hidden="true" /></div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#89949a]">CMS · Páginas</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-[-0.035em] text-[#182127] sm:text-[30px]">Criar página</h1>
          </div>
        </div>
      </section>
      <CreatePageForm />
    </div>
  );
}
