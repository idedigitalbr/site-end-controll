"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowUpRight,
  FileText,
  Images,
  LayoutDashboard,
  LogOut,
  Palette,
  Search,
  ShieldCheck,
  Users,
  Radar,
  Menu,
  ListOrdered,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const navigation: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/admin", label: "Visão geral", icon: LayoutDashboard },
  { href: "/admin/pages", label: "Páginas", icon: FileText },
  { href: "/admin/media", label: "Mídia", icon: Images },
  { href: "/admin/ffs", label: "Mecanismos FFS", icon: Radar },
  { href: "/admin/home-services", label: "Soluções da Home", icon: ListOrdered },
  { href: "/admin/navigation", label: "Navegação", icon: Menu },
  { href: "/admin/settings", label: "Identidade visual", icon: Palette },
  { href: "/admin/users", label: "Contas", icon: Users },
];

function NavigationLinks({ compact = false, role }: { compact?: boolean; role?: string | null }) {
  const pathname = usePathname();

  return navigation.filter(({ href }) => role === "admin" || !["/admin/users", "/admin/settings"].includes(href)).map(({ href, label, icon: Icon }) => {
    const active = href === "/admin" ? pathname === href : pathname.startsWith(href);

    return (
      <Link
        key={href}
        href={href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
          compact && "shrink-0",
          active
            ? "bg-[#252f35] text-white"
            : "text-white/60 hover:bg-white/[0.06] hover:text-white",
        )}
      >
        <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
        {label}
      </Link>
    );
  });
}

export function AdminShell({ children, role }: { children: React.ReactNode; role?: string | null }) {
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#f5f6f7] text-[#182127]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[258px] flex-col overflow-y-auto border-r border-white/10 bg-[#151e24] px-4 text-white lg:flex">
        <Link href="/admin" className="flex h-[76px] items-center gap-3 border-b border-white/10 px-2">
          <span className="grid size-9 place-items-center border border-[#e3b332]/70 text-xs font-bold tracking-tight text-[#e3b332]">EC</span>
          <span>
            <span className="block text-xs font-bold tracking-[0.19em]">ENDCONTROL</span>
            <span className="mt-1 block text-[10px] uppercase tracking-[0.16em] text-white/40">Painel de conteúdo</span>
          </span>
        </Link>

        <div className="px-2 pb-2 pt-7 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">Workspace</div>
        <nav aria-label="Navegação administrativa" className="flex flex-col gap-1">
          <NavigationLinks role={role} />
        </nav>

        <div className="mt-auto mb-4 rounded-lg border border-white/10 bg-white/[0.035] p-3">
          <div className="flex items-center gap-2 text-xs font-medium text-white/75">
            <span className="size-1.5 rounded-full bg-[#e3b332]" /> Desenvolvimento local
          </div>
          <p className="mt-2 text-[11px] leading-5 text-white/40">As publicações deste painel são aplicadas ao site local.</p>
        </div>
      </aside>

      <div className="lg:pl-[258px]">
        <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-[#e7eaec] bg-white/95 px-5 backdrop-blur sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid size-9 shrink-0 place-items-center border border-[#dce2e5] text-[11px] font-bold text-[#26343c] lg:hidden">EC</div>
            <div className="hidden items-center gap-2 text-xs text-[#859099] sm:flex">
              <span>EndControl</span><span>/</span><span className="font-medium text-[#26343c]">Administração</span>
            </div>
            <div className="hidden h-5 w-px bg-[#e7eaec] sm:block" />
            <form action="/admin/pages" method="get" role="search" className="relative hidden w-64 md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#98a1a7]" size={15} aria-hidden="true" />
              <Input name="q" aria-label="Buscar no painel" placeholder="Buscar conteúdo..." className="h-9 border-transparent bg-[#f5f6f7] pl-9 text-xs shadow-none focus-visible:border-[#dce2e5]" />
            </form>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden items-center gap-1.5 rounded-full border border-[#e7eaec] px-2.5 py-1.5 text-[10px] font-medium text-[#617079] sm:inline-flex">
              <ShieldCheck size={13} aria-hidden="true" /> Ambiente local
            </span>
            <Button asChild variant="outline" size="sm" className="h-9 border-[#e1e5e7] bg-white text-xs">
              <Link href="/">
                Ver site <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            </Button>
            <Button onClick={handleSignOut} variant="ghost" size="sm" className="h-9 text-xs text-[#68757d] hover:text-[#182127]">
              <LogOut size={14} aria-hidden="true" /> Sair
            </Button>
          </div>
        </header>

        <nav aria-label="Navegação administrativa móvel" className="flex gap-1 overflow-x-auto border-b border-[#e7eaec] bg-[#151e24] px-4 py-2 lg:hidden">
          <NavigationLinks compact role={role} />
        </nav>

        <main className="mx-auto w-full max-w-[1440px] px-5 py-8 sm:px-8 sm:py-10">{children}</main>
      </div>
    </div>
  );
}
