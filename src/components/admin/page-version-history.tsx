import { Clock3, RotateCcw } from "lucide-react";

import { restorePageVersion } from "@/app/(admin)/admin/pages/[id]/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type VersionEntry = {
  id: string;
  version: number;
  title: string;
  status: "draft" | "published" | "archived";
  createdAt: Date;
  publishedAt: Date | null;
  authorName: string | null;
  authorEmail: string | null;
};

type AuditEventEntry = {
  id: string;
  action: "page_created" | "draft_saved" | "published" | "unpublished" | "restored";
  versionId: string | null;
  sourceVersionId: string | null;
  createdAt: Date;
  actorName: string | null;
  actorEmail: string | null;
};

type PageVersionHistoryProps = {
  pageId: string;
  currentVersionId: string | null;
  versions: VersionEntry[];
  events: AuditEventEntry[];
};

const versionStatusLabel: Record<VersionEntry["status"], string> = {
  draft: "Rascunho",
  published: "Publicada",
  archived: "Arquivada",
};

const eventLabel: Record<AuditEventEntry["action"], string> = {
  page_created: "Página criada",
  draft_saved: "Rascunho salvo",
  published: "Publicada no site",
  unpublished: "Retirada do site",
  restored: "Versão restaurada como rascunho",
};

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(value);
}

function authorLabel(name: string | null, email: string | null) {
  if (name && email) return `${name} · ${email}`;
  return name || email || "Importado do site original";
}

export function PageVersionHistory({ pageId, currentVersionId, versions, events }: PageVersionHistoryProps) {
  const versionNumbers = new Map(versions.map((version) => [version.id, version.version]));

  return (
    <Card className="rounded-lg border-[#e5e9eb] bg-white py-0 shadow-none">
      <CardHeader className="border-b border-[#edf0f1] px-5 py-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-sm font-semibold text-[#26343c]">Histórico editorial</CardTitle>
            <p className="mt-1 text-xs leading-5 text-[#879198]">Cada salvamento cria uma revisão. As revisões não são apagadas automaticamente; restaurar cria um novo rascunho e preserva as versões anteriores.</p>
          </div>
          <Badge variant="outline" className="border-[#e3e7e9] bg-white text-[10px] text-[#69767d]">{versions.length} versões</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 p-5 sm:p-6">
        <div>
          <h2 className="mb-3 text-xs font-semibold text-[#45535b]">Revisões</h2>
          <Table>
            <TableHeader className="bg-[#fafbfb]">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#869198]">Versão</TableHead>
                <TableHead className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#869198]">Título</TableHead>
                <TableHead className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#869198]">Autor</TableHead>
                <TableHead className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#869198]">Criada em</TableHead>
                <TableHead className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#869198]">Estado</TableHead>
                <TableHead className="text-right text-[10px] font-semibold uppercase tracking-[0.1em] text-[#869198]">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {versions.map((version) => {
                const isCurrent = version.id === currentVersionId;
                return (
                  <TableRow key={version.id} className="border-[#edf0f1]">
                    <TableCell className="py-3 text-xs font-semibold text-[#2b363c]">
                      v{version.version}{isCurrent && <span className="ml-2 text-[10px] font-normal text-[#407451]">Atual</span>}
                    </TableCell>
                    <TableCell className="max-w-[240px] py-3 text-xs text-[#536168]">
                      <span className="block truncate" title={version.title}>{version.title}</span>
                    </TableCell>
                    <TableCell className="max-w-[230px] py-3 text-[11px] text-[#6f7b82]">
                      <span className="block truncate" title={authorLabel(version.authorName, version.authorEmail)}>{authorLabel(version.authorName, version.authorEmail)}</span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap py-3 text-[11px] text-[#6f7b82]">{formatDate(version.createdAt)}</TableCell>
                    <TableCell className="py-3 text-[11px] text-[#6f7b82]">{versionStatusLabel[version.status]}</TableCell>
                    <TableCell className="py-3 text-right">
                      {isCurrent ? (
                        <span className="text-[10px] text-[#879198]">Versão em edição</span>
                      ) : (
                        <form action={restorePageVersion}>
                          <input type="hidden" name="pageId" value={pageId} />
                          <input type="hidden" name="versionId" value={version.id} />
                          <Button type="submit" size="sm" variant="outline" className="h-8 border-[#dce2e5] bg-white px-2.5 text-[10px] text-[#536168]">
                            <RotateCcw size={13} aria-hidden="true" /> Restaurar como rascunho
                          </Button>
                        </form>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
              {versions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-20 text-center text-xs text-[#879198]">Nenhuma revisão encontrada.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="border-t border-[#edf0f1] pt-5">
          <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold text-[#45535b]"><Clock3 size={14} aria-hidden="true" /> Registro de auditoria</h2>
          <ol className="space-y-3">
            {events.map((event) => {
              const versionNumber = event.versionId ? versionNumbers.get(event.versionId) : undefined;
              const sourceVersionNumber = event.sourceVersionId ? versionNumbers.get(event.sourceVersionId) : undefined;
              return (
                <li key={event.id} className="flex flex-col gap-1 border-l-2 border-[#e7ecee] pl-3 sm:flex-row sm:items-baseline sm:justify-between">
                  <span className="text-xs text-[#45535b]">
                    {eventLabel[event.action]}
                    {versionNumber ? ` · v${versionNumber}` : ""}
                    {sourceVersionNumber ? ` (origem v${sourceVersionNumber})` : ""}
                    <span className="ml-2 text-[11px] text-[#879198]">por {authorLabel(event.actorName, event.actorEmail)}</span>
                  </span>
                  <time className="whitespace-nowrap text-[10px] text-[#9aa4a9]">{formatDate(event.createdAt)}</time>
                </li>
              );
            })}
            {events.length === 0 && <li className="text-xs text-[#879198]">Nenhuma ação editorial registrada ainda. As próximas edições, publicações e restaurações aparecerão aqui com autor e horário.</li>}
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
