"use client";

import { useActionState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sitePages } from "@/lib/site-inventory";
import { createPage } from "@/app/(admin)/admin/pages/new/actions";

const defaultTemplate = sitePages.find((page) => page.kind === "Solução")?.routePath ?? sitePages[0].routePath;

export function CreatePageForm() {
  const [state, formAction, pending] = useActionState(createPage, {});

  return (
    <form action={formAction} className="space-y-6">
      <section className="rounded-lg border border-[#e5e9eb] bg-white p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-[#26343c]">Nova página</h2>
        <p className="mt-1 text-xs leading-5 text-[#7b878e]">A página começa como rascunho, usando a estrutura visual de um template EndControl existente.</p>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className="block space-y-2 text-xs font-medium text-[#45535b]">
            Título
            <Input name="title" required maxLength={255} placeholder="Ex.: Inspeção de equipamentos" className="h-10 border-[#e1e6e8] text-sm" />
          </label>
          <label className="block space-y-2 text-xs font-medium text-[#45535b]">
            Slug da URL
            <Input name="slug" required maxLength={220} placeholder="inspecao-de-equipamentos" className="h-10 border-[#e1e6e8] font-mono text-xs" />
            <span className="block font-normal text-[#879198]">A URL será criada como `/{"slug"}.html`.</span>
          </label>
          <label className="block space-y-2 text-xs font-medium text-[#45535b] sm:col-span-2">
            Template visual
            <select
              name="templatePath"
              defaultValue={defaultTemplate}
              className="h-10 w-full rounded-md border border-[#e1e6e8] bg-white px-3 text-xs text-[#45535b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#97b7c0]"
            >
              {sitePages.map((page) => (
                <option key={page.routePath} value={page.routePath}>{page.title} · {page.routePath}</option>
              ))}
            </select>
            <span className="block font-normal leading-5 text-[#879198]">Depois de criar, edite os textos e fotos do template antes de publicar.</span>
          </label>
        </div>

        {state.error && <p role="alert" className="mt-4 rounded-md border border-[#f0d9d5] bg-[#fff8f7] px-3 py-2 text-xs text-[#973f36]">{state.error}</p>}
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e5e9eb] pt-5">
        <Button asChild variant="ghost" className="text-[#647179]">
          <Link href="/admin/pages"><ArrowLeft size={15} aria-hidden="true" /> Voltar para páginas</Link>
        </Button>
        <Button type="submit" disabled={pending} className="bg-[#18252c] text-white hover:bg-[#26363f]">
          <Plus size={15} aria-hidden="true" /> {pending ? "Criando…" : "Criar rascunho"}
        </Button>
      </div>
    </form>
  );
}
