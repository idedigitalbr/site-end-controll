"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type ManagedPage = {
  id: string;
  title: string;
  routePath: string;
  pageType: "home" | "about" | "privacy" | "service" | "system";
  status: "draft" | "published" | "archived";
};

type Filter = "Todas" | "Institucional" | "Solução";
type StatusFilter = "all" | ManagedPage["status"];

export function PagesTable({ pages, initialQuery = "" }: { pages: ManagedPage[]; initialQuery?: string }) {
  const [filter, setFilter] = useState<Filter>("Todas");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [query, setQuery] = useState(initialQuery);

  const filteredPages = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");

    return pages.filter((page) => {
      const kind = page.pageType === "service" ? "Solução" : "Institucional";
      const matchesKind = filter === "Todas" || kind === filter;
      const matchesStatus = statusFilter === "all" || page.status === statusFilter;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${page.title} ${page.routePath}`.toLocaleLowerCase("pt-BR").includes(normalizedQuery);

      return matchesKind && matchesStatus && matchesQuery;
    });
  }, [filter, pages, query, statusFilter]);

  function statusLabel(status: ManagedPage["status"]) {
    if (status === "published") return "Publicado";
    if (status === "archived") return "Arquivado";
    return "Rascunho";
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[#e5e9eb] bg-white">
      <div className="flex flex-col gap-4 border-b border-[#edf0f1] px-4 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-5">
        <Tabs value={filter} onValueChange={(value) => setFilter(value as Filter)}>
          <TabsList className="h-9 w-full justify-start rounded-md bg-[#f4f6f7] p-1 sm:w-auto">
            <TabsTrigger value="Todas" className="px-3 text-xs">Todas <span className="ml-1 text-[10px] text-[#879198]">{pages.length}</span></TabsTrigger>
            <TabsTrigger value="Institucional" className="px-3 text-xs">Institucionais</TabsTrigger>
            <TabsTrigger value="Solução" className="px-3 text-xs">Soluções</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex h-9 items-center gap-2 rounded-md border border-[#e6eaec] bg-white px-3 text-xs text-[#6f7b82]">
            <span className="shrink-0">Situação</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
              aria-label="Filtrar páginas por situação"
              className="min-w-28 bg-transparent text-xs text-[#45535b] outline-none"
            >
              <option value="all">Todas</option>
              <option value="draft">Rascunhos</option>
              <option value="published">Publicadas</option>
              <option value="archived">Arquivadas</option>
            </select>
          </label>
          <div className="relative w-full sm:max-w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#98a1a7]" size={15} aria-hidden="true" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar páginas..." aria-label="Buscar páginas" className="h-9 border-[#e6eaec] pl-9 text-xs shadow-none" />
          </div>
        </div>
      </div>

      <Table>
        <TableHeader className="bg-[#fafbfb]">
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-11 pl-5 text-[10px] font-semibold uppercase tracking-[0.11em] text-[#869198]">Título</TableHead>
            <TableHead className="h-11 text-[10px] font-semibold uppercase tracking-[0.11em] text-[#869198]">Tipo</TableHead>
            <TableHead className="h-11 text-[10px] font-semibold uppercase tracking-[0.11em] text-[#869198]">Rota atual</TableHead>
            <TableHead className="h-11 pr-5 text-[10px] font-semibold uppercase tracking-[0.11em] text-[#869198]">Situação</TableHead>
            <TableHead className="h-11 pr-5 text-right text-[10px] font-semibold uppercase tracking-[0.11em] text-[#869198]">Ação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPages.map((page) => (
            <TableRow key={page.id} className="border-[#edf0f1] hover:bg-[#fcfcfc]">
              <TableCell className="min-w-[230px] py-4 pl-5 text-xs font-medium text-[#2b363c]">
                <Link href={`/admin/pages/${page.id}`} className="transition hover:text-[#96731b]">{page.title}</Link>
              </TableCell>
              <TableCell className="py-4 text-xs text-[#6f7b82]">{page.pageType === "service" ? "Solução" : "Institucional"}</TableCell>
              <TableCell className="max-w-[360px] py-4 font-mono text-[10px] text-[#7b878e]">
                <span className="block truncate" title={page.routePath}>{page.routePath}</span>
              </TableCell>
              <TableCell className="py-4 pr-5">
                <Badge variant="outline" className="whitespace-nowrap border-[#e8e5dc] bg-[#fbfaf6] text-[10px] font-medium text-[#82713e]">{statusLabel(page.status)}</Badge>
              </TableCell>
              <TableCell className="py-3 pr-5 text-right">
                <Button asChild variant="ghost" size="sm" className="h-8 px-2.5 text-xs text-[#536168] hover:text-[#182127]">
                  <Link href={`/admin/pages/${page.id}`}>Editar</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {filteredPages.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-28 text-center text-xs text-[#7b878e]">Nenhuma página encontrada para esta busca.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="border-t border-[#edf0f1] px-5 py-3 text-[11px] text-[#89949a]">
        Exibindo {filteredPages.length} de {pages.length} páginas cadastradas no MySQL local.
      </div>
    </div>
  );
}
