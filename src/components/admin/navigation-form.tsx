"use client";

import { useActionState, useState } from "react";
import { ArrowDown, ArrowUp, Link2 } from "lucide-react";
import { saveNavigationContent } from "@/app/(admin)/admin/navigation/actions";
import type { NavigationContent, NavigationGroup, NavigationPrimaryItem } from "@/lib/cms/navigation-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const emptyState: { error?: string; success?: string } = {};

function MoveButtons({ label, index, length, onMove }: { label: string; index: number; length: number; onMove: (delta: number) => void }) {
  return <div className="flex shrink-0 gap-1">
    <Button type="button" variant="outline" size="icon-sm" disabled={index === 0} onClick={() => onMove(-1)} aria-label={`Subir ${label}`}><ArrowUp size={15} /></Button>
    <Button type="button" variant="outline" size="icon-sm" disabled={index === length - 1} onClick={() => onMove(1)} aria-label={`Descer ${label}`}><ArrowDown size={15} /></Button>
  </div>;
}

export function NavigationForm({ initial }: { initial: NavigationContent }) {
  const [content, setContent] = useState(initial);
  const [state, action, pending] = useActionState(saveNavigationContent, emptyState);

  function updatePrimary(index: number, patch: Partial<NavigationPrimaryItem>) {
    setContent((current) => ({ ...current, primary: current.primary.map((item, position) => position === index ? { ...item, ...patch } : item) }));
  }
  function movePrimary(index: number, delta: number) {
    setContent((current) => {
      const primary = [...current.primary];
      [primary[index], primary[index + delta]] = [primary[index + delta], primary[index]];
      return { ...current, primary };
    });
  }
  function updateGroup(index: number, patch: Partial<NavigationGroup>) {
    setContent((current) => ({ ...current, groups: current.groups.map((group, position) => position === index ? { ...group, ...patch } : group) }));
  }
  function moveGroup(index: number, delta: number) {
    setContent((current) => {
      const groups = [...current.groups];
      [groups[index], groups[index + delta]] = [groups[index + delta], groups[index]];
      return { ...current, groups };
    });
  }
  function updateService(groupIndex: number, serviceIndex: number, patch: Partial<NavigationGroup["services"][number]>) {
    setContent((current) => ({
      ...current,
      groups: current.groups.map((group, position) => position === groupIndex
        ? { ...group, services: group.services.map((service, itemIndex) => itemIndex === serviceIndex ? { ...service, ...patch } : service) }
        : group),
    }));
  }
  function moveService(groupIndex: number, serviceIndex: number, delta: number) {
    setContent((current) => ({
      ...current,
      groups: current.groups.map((group, position) => {
        if (position !== groupIndex) return group;
        const services = [...group.services];
        [services[serviceIndex], services[serviceIndex + delta]] = [services[serviceIndex + delta], services[serviceIndex]];
        return { ...group, services };
      }),
    }));
  }

  return <form action={action} className="space-y-6">
    <input name="content" type="hidden" value={JSON.stringify(content)} />
    <section className="space-y-4 rounded-xl border bg-white p-5 sm:p-6">
      <div><h2 className="text-lg font-semibold">Menu principal</h2><p className="mt-1 text-sm text-slate-600">A ordem dos itens é aplicada no menu do site. O acionador de soluções continua abrindo o submenu.</p></div>
      {content.primary.map((item, index) => <div key={item.id} className="grid gap-4 rounded-lg border border-slate-200 p-4 md:grid-cols-[minmax(160px,0.8fr)_minmax(220px,1fr)_minmax(260px,1.4fr)_auto] md:items-end">
        <div className="flex items-center justify-between gap-3 md:contents">
          <span className="text-sm font-medium text-slate-700">{index + 1}. {item.id === "solutions" ? "Soluções" : item.id === "about" ? "Sobre" : item.id === "contact" ? "Contato" : "Início"}</span>
          <MoveButtons label={item.label} index={index} length={content.primary.length} onMove={(delta) => movePrimary(index, delta)} />
        </div>
        <label className="space-y-1.5 text-sm">Rótulo<Input value={item.label} maxLength={100} required onChange={(event) => updatePrimary(index, { label: event.target.value })} /></label>
        {item.id === "solutions"
          ? <p className="flex items-center gap-2 self-center text-xs text-slate-500"><Link2 size={14} /> Abre o submenu de soluções</p>
          : <label className="space-y-1.5 text-sm">Destino<Input value={item.href ?? ""} maxLength={2048} required onChange={(event) => updatePrimary(index, { href: event.target.value })} /></label>}
      </div>)}
    </section>

    <section className="space-y-4 rounded-xl border bg-white p-5 sm:p-6">
      <div><h2 className="text-lg font-semibold">Submenu de soluções</h2><p className="mt-1 text-sm text-slate-600">Mude a ordem dos grupos e dos serviços dentro de cada grupo, além de seus rótulos e destinos.</p></div>
      {content.groups.map((group, groupIndex) => <section key={group.id} className="space-y-4 rounded-lg border border-slate-200 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold">Grupo {groupIndex + 1}</h3>
          <MoveButtons label={group.title} index={groupIndex} length={content.groups.length} onMove={(delta) => moveGroup(groupIndex, delta)} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1.5 text-sm">Título do grupo<Input value={group.title} maxLength={100} required onChange={(event) => updateGroup(groupIndex, { title: event.target.value })} /></label>
          <label className="space-y-1.5 text-sm">Descrição do grupo<Input value={group.description} maxLength={240} required onChange={(event) => updateGroup(groupIndex, { description: event.target.value })} /></label>
        </div>
        <div className="space-y-3">
          {group.services.map((service, serviceIndex) => <div key={service.id} className="grid gap-3 rounded-lg bg-slate-50 p-3 md:grid-cols-[minmax(180px,0.8fr)_minmax(220px,1fr)_minmax(260px,1.4fr)_auto] md:items-end">
            <div className="flex items-center justify-between gap-3 md:contents">
              <span className="text-xs font-medium text-slate-600">{serviceIndex + 1}. {service.label}</span>
              <MoveButtons label={service.label} index={serviceIndex} length={group.services.length} onMove={(delta) => moveService(groupIndex, serviceIndex, delta)} />
            </div>
            <label className="space-y-1.5 text-sm">Rótulo<Input value={service.label} maxLength={140} required onChange={(event) => updateService(groupIndex, serviceIndex, { label: event.target.value })} /></label>
            <label className="space-y-1.5 text-sm">Destino<Input value={service.href} maxLength={2048} required onChange={(event) => updateService(groupIndex, serviceIndex, { href: event.target.value })} /></label>
          </div>)}
        </div>
      </section>)}
    </section>

    {state.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
    {state.success && <p role="status" className="text-sm text-green-700">{state.success}</p>}
    <Button disabled={pending}>{pending ? "Salvando…" : "Salvar navegação"}</Button>
  </form>;
}
