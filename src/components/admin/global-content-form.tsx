"use client";
import { useActionState } from "react";
import { saveGlobalContent } from "@/app/(admin)/admin/settings/content-actions";
import { globalContentFields } from "@/lib/cms/global-content";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function GlobalContentForm({ values }: { values: Record<string, string> | null }) {
  const [state, action, pending] = useActionState(saveGlobalContent, {});
  return <section className="space-y-4 rounded-lg border bg-white p-5">
    <div><h2 className="text-lg font-semibold">Contatos e rodapé</h2><p className="mt-1 text-sm text-slate-600">Estas informações são aplicadas a todas as páginas ao salvar.</p></div>
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      {globalContentFields.map(field => <label key={field.key} className="space-y-2 text-sm">{field.label}<Input name={field.key} defaultValue={values?.[field.key] ?? field.value} required maxLength={500} /></label>)}
      {state.error && <p role="alert" className="text-sm text-red-700 sm:col-span-2">{state.error}</p>}
      {state.success && <p role="status" className="text-sm text-green-700 sm:col-span-2">{state.success}</p>}
      <Button disabled={pending} className="w-fit">{pending ? "Salvando…" : "Salvar contatos e rodapé"}</Button>
    </form>
  </section>;
}
