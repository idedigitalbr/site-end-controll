"use client";

import { useActionState, useState } from "react";
import { Check, Palette } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveSiteSettingsAction, type SaveSettingsState } from "@/app/(admin)/admin/settings/actions";
import type { SiteTheme } from "@/lib/cms/site-settings";

const colorGroups: { title: string; description: string; fields: { name: keyof SiteTheme; label: string; help: string }[] }[] = [
  {
    title: "Marca",
    description: "Cores principais usadas em chamadas, botões e destaques.",
    fields: [
      { name: "brandPrimary", label: "Cor principal", help: "Destaques e elementos da marca" },
      { name: "brandSecondary", label: "Cor secundária", help: "Links e elementos de apoio" },
    ],
  },
  {
    title: "Fundos",
    description: "Superfícies claras e escuras do site.",
    fields: [
      { name: "backgroundPage", label: "Fundo da página", help: "Fundo geral" },
      { name: "backgroundPrimary", label: "Fundo principal", help: "Seções e superfícies de destaque" },
      { name: "backgroundSecondary", label: "Fundo secundário", help: "Seções alternativas" },
      { name: "backgroundDeep", label: "Fundo profundo", help: "Áreas escuras e rodapé" },
    ],
  },
  {
    title: "Textos",
    description: "Cores para títulos, parágrafos e informações de apoio.",
    fields: [
      { name: "textPrimary", label: "Texto principal", help: "Títulos e conteúdo prioritário" },
      { name: "textSecondary", label: "Texto secundário", help: "Parágrafos e descrições" },
      { name: "textMuted", label: "Texto discreto", help: "Legendas e metadados" },
    ],
  },
];

const initialState: SaveSettingsState = {};

export function SiteSettingsForm({ initialSettings }: { initialSettings: SiteTheme }) {
  const [state, formAction, pending] = useActionState(saveSiteSettingsAction, initialState);
  const [colors, setColors] = useState(initialSettings);

  return (
    <form action={formAction} className="space-y-5">
      {colorGroups.map((group) => (
        <section key={group.title} className="overflow-hidden rounded-lg border border-[#e5e9eb] bg-white">
          <header className="border-b border-[#edf0f1] px-5 py-4 sm:px-6">
            <h2 className="text-sm font-semibold text-[#202a30]">{group.title}</h2>
            <p className="mt-1 text-xs text-[#78858c]">{group.description}</p>
          </header>
          <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-3">
            {group.fields.map(({ name, label, help }) => (
              <label key={name} className="flex items-center gap-3 rounded-md border border-[#edf0f1] p-3">
                <input
                  name={name}
                  type="color"
                  value={colors[name]}
                  onChange={(event) => setColors((current) => ({ ...current, [name]: event.target.value }))}
                  aria-label={label}
                  className="size-11 shrink-0 cursor-pointer rounded border-0 bg-transparent p-0"
                />
                <span className="min-w-0">
                  <span className="block text-xs font-semibold text-[#33434b]">{label}</span>
                  <span className="mt-1 block text-[11px] leading-4 text-[#879198]">{help}</span>
                  <span className="mt-1 flex items-center gap-1 text-[10px] font-mono uppercase text-[#7b878e]"><Palette size={10} aria-hidden="true" /> {colors[name]}</span>
                </span>
              </label>
            ))}
          </div>
        </section>
      ))}

      {state.error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">{state.error}</p>}
      {state.success && <p role="status" className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800"><Check size={14} aria-hidden="true" />{state.success}</p>}
      <div className="flex justify-end">
        <Button disabled={pending} className="h-10 bg-[#18252c] px-5 text-white hover:bg-[#26363f]">{pending ? "Salvando…" : "Salvar identidade visual"}</Button>
      </div>
    </form>
  );
}
