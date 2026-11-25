"use client";

import { useActionState, useState } from "react";
import { ArrowDown, ArrowUp, RotateCcw } from "lucide-react";
import { saveHomeServiceOrder } from "@/app/(admin)/admin/home-services/actions";
import { homeServiceItems, type HomeServiceOrder } from "@/lib/cms/home-services-content";
import { Button } from "@/components/ui/button";

const emptyState: { error?: string; success?: string } = {};

export function HomeServicesOrderForm({ initial }: { initial: HomeServiceOrder }) {
  const [order, setOrder] = useState(initial);
  const [state, action, pending] = useActionState(saveHomeServiceOrder, emptyState);
  function move(index: number, delta: number) {
    setOrder((current) => {
      const next = [...current];
      [next[index], next[index + delta]] = [next[index + delta], next[index]];
      return next;
    });
  }
  const titleById = new Map<number, string>(homeServiceItems.map((item) => [item.id, item.title]));

  return <form action={action} className="space-y-5">
    <input name="content" type="hidden" value={JSON.stringify(order)} />
    <section className="space-y-4 rounded-xl border bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h2 className="text-lg font-semibold">Ordem das soluções</h2><p className="mt-1 text-sm text-slate-600">A ordem define os 12 nós e os cartões apresentados na seção de soluções da Home.</p></div>
        <Button type="button" variant="outline" size="sm" onClick={() => setOrder(initial)}><RotateCcw size={15} /> Restaurar ordem carregada</Button>
      </div>
      <ol className="space-y-2">
        {order.map((id, index) => {
          const title = titleById.get(id) ?? "Solução";
          return <li key={id} className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 px-4 py-3">
            <span className="min-w-0 text-sm"><span className="mr-2 inline-flex size-6 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">{index + 1}</span>{title}</span>
            <div className="flex shrink-0 gap-1">
              <Button type="button" variant="outline" size="icon-sm" disabled={index === 0} onClick={() => move(index, -1)} aria-label={`Subir ${title}`}><ArrowUp size={15} /></Button>
              <Button type="button" variant="outline" size="icon-sm" disabled={index === order.length - 1} onClick={() => move(index, 1)} aria-label={`Descer ${title}`}><ArrowDown size={15} /></Button>
            </div>
          </li>;
        })}
      </ol>
    </section>
    {state.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
    {state.success && <p role="status" className="text-sm text-green-700">{state.success}</p>}
    <Button disabled={pending}>{pending ? "Salvando…" : "Salvar ordem da Home"}</Button>
  </form>;
}
