import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  Database,
  FileText,
  Image,
  Layers3,
  MoveUpRight,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { siteInventory } from "@/lib/site-inventory";

const inventoryCards = [
  { label: "Páginas públicas", value: siteInventory.publicPages, note: "encontradas no site atual", icon: FileText },
  { label: "Soluções", value: siteInventory.services, note: "páginas de serviços", icon: Boxes },
  { label: "Mecanismos FFS", value: siteInventory.ffsMechanisms, note: "na solução de integridade", icon: Layers3 },
  { label: "Arquivos de mídia", value: siteInventory.mediaFiles, note: "no inventário atual", icon: Image },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs font-medium text-[#77848c]">
            <span>Painel</span><span>/</span><span className="text-[#26343c]">Visão geral</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#182127] sm:text-[34px]">Visão geral</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#68757d]">Gerencie os textos, fotos e a identidade visual do site EndControl.</p>
        </div>
        <Button asChild className="w-fit bg-[#18252c] text-white hover:bg-[#26363f]">
          <Link href="/admin/pages">Abrir páginas <ArrowRight size={16} aria-hidden="true" /></Link>
        </Button>
      </section>

      <section aria-label="Inventário do site atual" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {inventoryCards.map(({ label, value, note, icon: Icon }) => (
          <Card key={label} className="gap-0 rounded-lg border-[#e5e9eb] bg-white py-0 shadow-none">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <span className="text-xs font-medium text-[#78858c]">{label}</span>
                <span className="grid size-8 place-items-center rounded-md bg-[#f5f6f7] text-[#65737b]"><Icon size={16} strokeWidth={1.8} aria-hidden="true" /></span>
              </div>
              <div className="mt-5 flex items-baseline gap-2">
                <span className="text-3xl font-semibold tracking-[-0.04em] text-[#182127]">{value}</span>
                <span className="text-xs text-[#879198]">{note}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.4fr_0.9fr]">
        <Card className="rounded-lg border-[#e5e9eb] bg-white py-0 shadow-none">
          <CardHeader className="flex flex-row items-start justify-between border-b border-[#edf0f1] px-5 py-5 sm:px-6">
            <div>
              <CardTitle className="text-base font-semibold text-[#202a30]">Como atualizar o site</CardTitle>
              <CardDescription className="mt-1.5 text-xs">Edite, revise e publique o conteúdo no ambiente local.</CardDescription>
            </div>
            <Badge variant="outline" className="border-[#ead9a5] bg-[#fffaf0] text-[10px] font-medium text-[#896b17]">Fluxo editorial</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex items-start gap-4 border-b border-[#edf0f1] px-5 py-5 sm:px-6">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#eef5f0] text-[#47745c]"><FileText size={15} aria-hidden="true" /></span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[#26343c]">Edite as páginas existentes</p>
                <p className="mt-1 text-xs leading-5 text-[#78858c]">Abra Páginas e selecione os textos e fotos que deseja atualizar.</p>
              </div>
              <Badge variant="outline" className="border-[#dce8df] bg-[#f5faf6] text-[10px] text-[#47745c]">Passo 1</Badge>
            </div>
            <div className="flex items-start gap-4 border-b border-[#edf0f1] px-5 py-5 sm:px-6">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#f4f1e8] text-[#907626]"><Database size={15} aria-hidden="true" /></span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[#26343c]">Salve e revise o rascunho</p>
                <p className="mt-1 text-xs leading-5 text-[#78858c]">Use a prévia privada para conferir suas alterações antes de publicar.</p>
              </div>
              <Badge variant="outline" className="border-[#dce8df] bg-[#f5faf6] text-[10px] text-[#47745c]">Passo 2</Badge>
            </div>
            <div className="flex items-start gap-4 px-5 py-5 sm:px-6">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#f1f2f6] text-[#66728c]"><Image size={15} aria-hidden="true" /></span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[#26343c]">Publique no site local</p>
                <p className="mt-1 text-xs leading-5 text-[#78858c]">Publicar aplica a versão revisada. Um novo rascunho mantém a última versão publicada disponível.</p>
              </div>
              <Badge variant="outline" className="border-[#e4e6eb] bg-[#f8f9fb] text-[10px] text-[#737d8e]">Passo 3</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg border-[#e5e9eb] bg-white py-0 shadow-none">
          <CardHeader className="border-b border-[#edf0f1] px-5 py-5 sm:px-6">
            <CardTitle className="text-base font-semibold text-[#202a30]">Ambiente de desenvolvimento</CardTitle>
            <CardDescription className="mt-1.5 text-xs">Este painel está rodando apenas neste computador.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-[#78858c]">Aplicação</span>
              <span className="inline-flex items-center gap-2 text-xs font-medium text-[#47745c]"><span className="size-1.5 rounded-full bg-[#5b9b70]" /> Next.js local</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-[#78858c]">Interface</span>
              <span className="text-xs font-medium text-[#45535b]">Tailwind · Radix · shadcn</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-[#78858c]">Ícones</span>
              <span className="text-xs font-medium text-[#45535b]">Lucide</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-[#78858c]">Publicação</span>
              <span className="text-xs font-medium text-[#78858c]">Não configurada</span>
            </div>
            <div className="mt-2 rounded-md border border-[#e8ecee] bg-[#f8f9f9] p-3.5">
              <p className="text-xs leading-5 text-[#69767d]">O domínio e a VPS serão definidos antes da etapa de publicação. Nenhuma configuração remota foi feita.</p>
            </div>
            <Link href="/admin/pages" className="inline-flex items-center gap-2 pt-1 text-xs font-semibold text-[#394950] transition hover:text-[#9b771a]">
              Consultar inventário de páginas <MoveUpRight size={14} aria-hidden="true" />
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
