"use client";
import { useActionState } from "react";
import { saveBackgroundContent } from "@/app/(admin)/admin/settings/background-actions";
import { backgroundFields } from "@/lib/cms/background-content";
import { Button } from "@/components/ui/button";

export function BackgroundForm({ values, media }: { values: Record<string, string> | null; media: { url: string; originalName: string }[] }) {
  const [state, action, pending] = useActionState(saveBackgroundContent, {});
  return <section className="space-y-4 rounded-lg border bg-white p-5"><div><h2 className="text-lg font-semibold">Imagens de fundo</h2><p className="mt-1 text-sm text-slate-600">Substitua as fotos de fundo preservando os gradientes, efeitos e posições originais.</p></div><form action={action} className="grid gap-4 sm:grid-cols-2">
    {backgroundFields.map(field => <label key={field.key} className="space-y-2 text-sm">{field.label}<select name={field.key} defaultValue={values?.[field.key] ?? ""} className="block h-10 w-full rounded-md border px-3"><option value="">Imagem original</option>{media.map(item => <option key={item.url} value={item.url}>{item.originalName}</option>)}</select></label>)}
    {state.error && <p role="alert" className="text-sm text-red-700 sm:col-span-2">{state.error}</p>}{state.success && <p role="status" className="text-sm text-green-700 sm:col-span-2">{state.success}</p>}
    <Button disabled={pending} className="w-fit">{pending ? "Salvando…" : "Salvar imagens de fundo"}</Button>
  </form></section>;
}
