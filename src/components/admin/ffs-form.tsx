"use client";
import { useActionState, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { saveFfsContent } from "@/app/(admin)/admin/ffs/actions";
import { type FfsContent } from "@/lib/cms/ffs-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function FfsForm({ initial }: { initial: FfsContent[] }) {
  const [items, setItems] = useState(initial);
  const [state, action, pending] = useActionState(saveFfsContent, {});
  function update(index: number, patch: Partial<FfsContent>) { setItems(current => current.map((item, position) => position === index ? { ...item, ...patch } : item)); }
  function move(index: number, delta: number) { setItems(current => { const next = [...current]; [next[index], next[index + delta]] = [next[index + delta], next[index]]; return next; }); }
  return <form action={action} className="space-y-5">
    <input name="content" type="hidden" value={JSON.stringify(items)} />
    {items.map((item, index) => <section key={item.id} className="space-y-4 rounded-lg border bg-white p-5">
      <div className="flex items-center justify-between gap-3"><h2 className="font-semibold">{index + 1}. {item.title}</h2><div className="flex gap-2"><Button type="button" variant="outline" size="icon" disabled={index === 0} onClick={() => move(index, -1)} aria-label={`Subir ${item.title}`}><ArrowUp size={16} /></Button><Button type="button" variant="outline" size="icon" disabled={index === items.length - 1} onClick={() => move(index, 1)} aria-label={`Descer ${item.title}`}><ArrowDown size={16} /></Button></div></div>
      <label className="block space-y-2 text-sm">Título<Input value={item.title} maxLength={150} required onChange={event => update(index, { title: event.target.value })} /></label>
      <label className="block space-y-2 text-sm">Descrição<textarea className="min-h-24 w-full rounded-md border p-3" value={item.desc} maxLength={1500} required onChange={event => update(index, { desc: event.target.value })} /></label>
    </section>)}
    {state.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
    {state.success && <p role="status" className="text-sm text-green-700">{state.success}</p>}
    <Button disabled={pending}>{pending ? "Salvando…" : "Salvar mecanismos FFS"}</Button>
  </form>;
}
