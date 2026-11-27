"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { ArrowDown, ArrowUp, Eye, ExternalLink, Image as ImageIcon, Save, Search, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { publishPage, saveDraftAndPreview, savePageDraft, unpublishPage } from "@/app/(admin)/admin/pages/[id]/actions";
import type { EditablePageField, EditableTextField, PageContentPatch } from "@/lib/cms/page-content";

type MediaOption = {
  id: string;
  url: string;
  altText: string;
  originalName: string;
};

type PageEditorFormProps = {
  pageId: string;
  routePath: string;
  title: string;
  summary: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  fields: EditablePageField[];
  media: MediaOption[];
  isPublished: boolean;
  /** Title and description the live site uses when the SEO fields are left empty. */
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  publishedAtLabel: string | null;
  statusLabel: string;
  versionNumber: number;
};

const tagNames: Record<string, string> = {
  h1: "Título principal",
  h2: "Título de seção",
  h3: "Subtítulo",
  h4: "Subtítulo",
  h5: "Subtítulo",
  h6: "Subtítulo",
  p: "Parágrafo",
  span: "Rótulo ou destaque",
  a: "Texto de link ou botão",
  button: "Texto de botão",
  li: "Item de lista",
  strong: "Texto em destaque",
  em: "Texto em destaque",
  label: "Rótulo de campo",
  figcaption: "Legenda",
  blockquote: "Citação",
  td: "Célula de tabela",
  th: "Cabeçalho de tabela",
  small: "Texto auxiliar",
};

type TextGroup = {
  id: string;
  keys: string[];
  section: string;
  kindLabel: string;
  preview: string;
};

function buildTextGroups(fields: EditableTextField[]): TextGroup[] {
  const groups = new Map<string, TextGroup>();
  for (const field of fields) {
    const id = `${field.tag ?? "texto"}|${field.value}`;
    const existing = groups.get(id);
    if (existing) {
      existing.keys.push(field.key);
      continue;
    }
    groups.set(id, {
      id,
      keys: [field.key],
      section: field.section || "Outros textos",
      kindLabel: tagNames[field.tag ?? ""] ?? "Texto",
      preview: field.value.replace(/\s+/g, " ").trim().slice(0, 60),
    });
  }
  return [...groups.values()];
}

function serializeFields(fields: EditablePageField[]): PageContentPatch[] {
  return fields.map((field) => {
    if (field.kind === "text") return { key: field.key, kind: "text", value: field.value };
    if (field.kind === "richText") return { key: field.key, kind: "richText", value: field.value };
    if (field.kind === "image") {
      return {
        key: field.key,
        kind: "image",
        value: field.value,
        altText: field.altText,
        ...(field.objectPosition ? { objectPosition: field.objectPosition } : {}),
      };
    }
    if (field.kind === "link") return { key: field.key, kind: "link", value: field.value };
    if (field.kind === "backgroundImage") return { key: field.key, kind: "backgroundImage", value: field.value };
    if (field.kind === "indicators") return { key: field.key, kind: "indicators", value: field.value };
    if (field.kind === "clientLogos") return { key: field.key, kind: "clientLogos", value: field.value };
    if (field.kind === "homeSolutions") return { key: field.key, kind: "homeSolutions", value: field.value };
    if (field.kind === "directorCards") return { key: field.key, kind: "directorCards", value: field.value };
    if (field.kind === "cardList") return { key: field.key, kind: "cardList", value: field.value };
    return { key: field.key, kind: "sectionOrder", value: field.value };
  });
}

function previewImageUrl(value: string) {
  if (!value || value.startsWith("/") || /^https?:\/\//i.test(value)) return value;
  return `/${value.replace(/^(?:\.\/)+/, "")}`;
}

function PendingFieldset({ children }: { children: ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <fieldset disabled={pending} className="min-w-0 space-y-5 border-0 p-0">
      {pending && (
        <p role="status" className="rounded-md border border-[#dce6e9] bg-[#f6fafb] px-4 py-3 text-xs text-[#536c74]">
          Aguarde enquanto atualizamos esta página…
        </p>
      )}
      {children}
    </fieldset>
  );
}

export function PageEditorForm({
  pageId,
  routePath,
  title,
  summary,
  seoTitle,
  seoDescription,
  fields: initialFields,
  media,
  isPublished,
  defaultSeoTitle,
  defaultSeoDescription,
  publishedAtLabel,
  statusLabel,
  versionNumber,
}: PageEditorFormProps) {
  const [fields, setFields] = useState(initialFields);
  const [titleValue, setTitleValue] = useState(title);
  const [summaryValue, setSummaryValue] = useState(summary ?? "");
  const [seoTitleValue, setSeoTitleValue] = useState(seoTitle ?? "");
  const [seoDescriptionValue, setSeoDescriptionValue] = useState(seoDescription ?? "");
  const [textQuery, setTextQuery] = useState("");
  const submitting = useRef(false);
  const initialContent = useRef(JSON.stringify(serializeFields(initialFields)));
  const content = useMemo(() => JSON.stringify(serializeFields(fields)), [fields]);
  const dirty = content !== initialContent.current
    || titleValue !== title
    || summaryValue !== (summary ?? "")
    || seoTitleValue !== (seoTitle ?? "")
    || seoDescriptionValue !== (seoDescription ?? "");

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      if (submitting.current) return;
      event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const textFields = fields.filter((field): field is EditableTextField => field.kind === "text" && !field.managedBy);
  const textGroups = useMemo(
    () => buildTextGroups(initialFields.filter((field): field is EditableTextField => field.kind === "text" && !field.managedBy)),
    [initialFields],
  );
  const textValueByKey = useMemo(() => new Map(textFields.map((field) => [field.key, field.value])), [textFields]);
  const normalizedQuery = textQuery.trim().toLocaleLowerCase("pt-BR");
  const visibleGroups = textGroups.filter((group) => !normalizedQuery
    || `${group.kindLabel} ${group.section} ${textValueByKey.get(group.keys[0]) ?? ""}`.toLocaleLowerCase("pt-BR").includes(normalizedQuery));
  const groupsBySection = useMemo(() => {
    const sections = new Map<string, TextGroup[]>();
    for (const group of visibleGroups) sections.set(group.section, [...(sections.get(group.section) ?? []), group]);
    return [...sections.entries()];
  }, [visibleGroups]);
  const effectiveSeoTitle = seoTitleValue.trim() || defaultSeoTitle || titleValue;
  const effectiveSeoDescription = seoDescriptionValue.trim() || defaultSeoDescription || summaryValue;

  function updateTextGroup(keys: string[], value: string) {
    const targets = new Set(keys);
    setFields((current) => current.map((field) => targets.has(field.key) && field.kind === "text"
      ? { ...field, value }
      : field));
  }
  const managedTextFields = fields.filter((field): field is EditableTextField => field.kind === "text" && Boolean(field.managedBy));
  const imageFields = fields.filter((field) => field.kind === "image");
  const backgroundImageFields = fields.filter((field) => field.kind === "backgroundImage");
  const linkFields = fields.filter((field) => field.kind === "link");
  const sectionOrderFields = fields.filter((field) => field.kind === "sectionOrder");

  function updateImage(key: string, value: string) {
    setFields((current) => current.map((field) => field.key === key && (field.kind === "image" || field.kind === "backgroundImage")
      ? { ...field, value }
      : field));
  }

  function updateLink(key: string, value: string) {
    setFields((current) => current.map((field) => field.key === key && field.kind === "link"
      ? { ...field, value }
      : field));
  }

  function moveSection(key: string, selector: string, direction: -1 | 1) {
    setFields((current) => current.map((field) => {
      if (field.key !== key || field.kind !== "sectionOrder") return field;
      const from = field.value.indexOf(selector);
      const to = from + direction;
      if (from < 0 || to < 0 || to >= field.value.length) return field;
      const value = [...field.value];
      [value[from], value[to]] = [value[to], value[from]];
      return { ...field, value };
    }));
  }

  function updateAltText(key: string, altText: string) {
    setFields((current) => current.map((field) => field.key === key && field.kind === "image"
      ? { ...field, altText }
      : field));
  }

  return (
    <form action={savePageDraft} onSubmit={() => { submitting.current = true; }}>
      <PendingFieldset>
      <input type="hidden" name="pageId" value={pageId} />
      <input type="hidden" name="content" value={content} readOnly />

      <Card className="rounded-lg border-[#e5e9eb] bg-white py-0 shadow-none">
        <CardHeader className="border-b border-[#edf0f1] px-5 py-4 sm:px-6">
          <CardTitle className="text-sm font-semibold text-[#26343c]">Conteúdo principal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 p-5 sm:p-6">
          <dl className="grid gap-3 rounded-md border border-[#e8ecee] bg-[#f9fafb] p-4 text-xs sm:grid-cols-2 lg:grid-cols-4">
            <div><dt className="text-[#879198]">Endereço</dt><dd className="mt-1 break-all font-mono text-[#26343c]">{routePath}</dd></div>
            <div><dt className="text-[#879198]">Situação</dt><dd className="mt-1 font-medium text-[#26343c]">{statusLabel}</dd></div>
            <div><dt className="text-[#879198]">Última publicação</dt><dd className="mt-1 font-medium text-[#26343c]">{publishedAtLabel ?? "Nunca publicada pelo CMS"}</dd></div>
            <div><dt className="text-[#879198]">Rascunho atual</dt><dd className="mt-1 font-medium text-[#26343c]">Versão {versionNumber}</dd></div>
          </dl>
          <label className="block space-y-2 text-xs font-medium text-[#45535b]">
            Título da página
            <Input name="title" value={titleValue} onChange={(event) => setTitleValue(event.target.value)} maxLength={255} required className="h-10 border-[#e1e6e8] text-sm" />
            <span className="block font-normal leading-5 text-[#879198]">Nome da página no painel e, nas soluções, título do card na Home. O título grande do site é editado em “Textos da página”.</span>
          </label>
          <label className="block space-y-2 text-xs font-medium text-[#45535b]">
            Resumo
            <Textarea name="summary" value={summaryValue} onChange={(event) => setSummaryValue(event.target.value)} maxLength={500} rows={3} className="resize-y border-[#e1e6e8] text-sm" placeholder="Deixe vazio para manter o texto original do site." />
            <span className="block font-normal leading-5 text-[#879198]">Nas soluções, substitui o texto do card na Home. Vazio mantém o texto original.</span>
          </label>

          <details open className="border-t border-[#edf0f1] pt-5">
            <summary className="cursor-pointer text-xs font-semibold text-[#45535b]">
              Textos da página <span className="font-normal text-[#879198]">· {textGroups.length} textos{textFields.length > textGroups.length ? `, ${textFields.length} ocorrências` : ""}</span>
            </summary>
            <div className="mt-4 grid gap-3">
              <label className="relative block">
                <span className="sr-only">Buscar texto na página</span>
                <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#879198]" aria-hidden="true" />
                <Input
                  type="search"
                  value={textQuery}
                  onChange={(event) => setTextQuery(event.target.value)}
                  placeholder="Buscar texto ou seção…"
                  className="h-9 border-[#e1e6e8] pl-8 text-xs"
                />
              </label>
              {groupsBySection.map(([sectionName, groups], sectionIndex) => (
                <details key={sectionName} open={Boolean(normalizedQuery) || sectionIndex === 0} className="rounded-md border border-[#e8ecee] bg-white">
                  <summary className="cursor-pointer px-3 py-2.5 text-xs font-semibold text-[#26343c]">
                    {sectionName} <span className="font-normal text-[#879198]">· {groups.length}</span>
                  </summary>
                  <div className="grid gap-3 border-t border-[#edf0f1] p-3">
                    {groups.map((group) => {
                      const value = textValueByKey.get(group.keys[0]) ?? "";
                      return (
                        <label key={group.id} className="block space-y-2 rounded-md border border-[#e8ecee] bg-[#fcfcfc] p-3 text-xs font-medium text-[#45535b]">
                          <span className="flex flex-wrap items-center gap-2 leading-5">
                            {group.kindLabel}
                            {group.keys.length > 1 && (
                              <span className="rounded-full bg-[#eef3f5] px-2 py-0.5 text-[10px] font-normal text-[#5f737b]">aparece em {group.keys.length} lugares da página</span>
                            )}
                          </span>
                          <Textarea
                            value={value}
                            onChange={(event) => updateTextGroup(group.keys, event.target.value)}
                            maxLength={8_000}
                            rows={value.length > 90 ? 3 : 2}
                            aria-label={`${group.kindLabel}: ${group.preview}`}
                            className="resize-y border-[#e1e6e8] bg-white text-sm font-normal"
                          />
                        </label>
                      );
                    })}
                  </div>
                </details>
              ))}
              {textFields.length === 0 && <p className="text-xs text-[#879198]">Nenhum texto editável foi encontrado neste template.</p>}
              {textFields.length > 0 && groupsBySection.length === 0 && <p className="text-xs text-[#879198]">Nenhum texto corresponde à busca.</p>}
              {managedTextFields.length > 0 && <div className="rounded-md border border-[#e5e9eb] bg-[#f7f9f9] p-3 text-xs leading-5 text-[#68757d]">
                <p>Textos compartilhados ficam nos editores globais para que suas alterações não sejam sobrescritas.</p>
                <div className="mt-2 flex flex-wrap gap-3 font-medium">
                  {managedTextFields.some((field) => field.managedBy === "navigation") && <a href="/admin/navigation" className="underline">Editar navegação</a>}
                  {managedTextFields.some((field) => field.managedBy === "global") && <a href="/admin/settings" className="underline">Editar contatos e rodapé</a>}
                  {managedTextFields.some((field) => field.managedBy === "ffs") && <a href="/admin/ffs" className="underline">Editar mecanismos FFS</a>}
                </div>
              </div>}
            </div>
          </details>

          <details className="border-t border-[#edf0f1] pt-5">
            <summary className="cursor-pointer text-xs font-semibold text-[#45535b]">
              Links e chamadas para ação <span className="font-normal text-[#879198]">· {linkFields.length}</span>
            </summary>
            <p className="mb-4 mt-3 text-xs leading-5 text-[#6f7b82]">Altere destinos sem mexer nos rótulos, classes, ícones ou atributos originais dos links.</p>
            <div className="grid gap-3">
              {linkFields.map((field, index) => (
                <label key={field.key} className="block space-y-2 rounded-md border border-[#e8ecee] bg-[#fcfcfc] p-3 text-xs font-medium text-[#45535b]">
                  <span className="block leading-5">{index + 1}. {field.label}</span>
                  <Input
                    type="text"
                    value={field.value}
                    onChange={(event) => updateLink(field.key, event.target.value)}
                    maxLength={2_048}
                    aria-label={`Destino do link ${index + 1}: ${field.label}`}
                    className="h-9 border-[#e1e6e8] bg-white text-xs font-normal"
                  />
                </label>
              ))}
              {linkFields.length === 0 && <p className="text-xs text-[#879198]">Nenhum link de conteúdo foi encontrado neste template.</p>}
            </div>
          </details>

          <details className="border-t border-[#edf0f1] pt-5">
            <summary className="cursor-pointer text-xs font-semibold text-[#45535b]">
              Fotos da página <span className="font-normal text-[#879198]">· {imageFields.length}</span>
            </summary>
            <div className="mb-4 mt-3 flex flex-wrap items-center justify-between gap-3 rounded-md bg-[#f7f9f9] p-3">
              <p className="text-xs leading-5 text-[#6f7b82]">Troque fotos da página e, em soluções, a imagem do cartão da Home.</p>
              <Button asChild variant="outline" size="sm" className="h-8 border-[#e1e6e8] bg-white text-xs">
                <a href="/admin/media"><Upload size={14} aria-hidden="true" /> Gerenciar mídia</a>
              </Button>
            </div>
            <div className="grid gap-3">
              {imageFields.map((field, index) => (
                <div key={field.key} className="grid gap-3 rounded-md border border-[#e8ecee] bg-[#fcfcfc] p-3 sm:grid-cols-[120px_minmax(0,1fr)]">
                  <div className="grid min-h-24 place-items-center overflow-hidden rounded border border-[#e1e6e8] bg-white">
                    {field.value ? (
                      // The source can be a legacy asset or a CMS upload served by this same application.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={previewImageUrl(field.value)} alt="" className="max-h-28 w-full object-contain" />
                    ) : <ImageIcon size={24} className="text-[#9aa5aa]" aria-hidden="true" />}
                  </div>
                  <div className="space-y-3">
                    <label className="block space-y-2 text-xs font-medium text-[#45535b]">
                      {index + 1}. {field.label}
                      <select
                        value={field.value}
                        onChange={(event) => updateImage(field.key, event.target.value)}
                        aria-label={`Foto ${index + 1}: ${field.label}`}
                        className="h-10 w-full rounded-md border border-[#e1e6e8] bg-white px-3 text-xs font-normal text-[#45535b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#97b7c0]"
                      >
                        <option value={field.originalValue}>Imagem atual do site</option>
                        {media.map((asset) => (
                          <option key={asset.id} value={asset.url}>{asset.originalName}</option>
                        ))}
                      </select>
                    </label>
                    <label className="block space-y-2 text-xs font-medium text-[#45535b]">
                      Texto alternativo
                      <Input value={field.altText} onChange={(event) => updateAltText(field.key, event.target.value)} maxLength={255} className="h-9 border-[#e1e6e8] bg-white text-xs font-normal" />
                    </label>
                  </div>
                </div>
              ))}
              {imageFields.length === 0 && <p className="text-xs text-[#879198]">Nenhuma foto editável foi encontrada neste template.</p>}
              {media.length === 0 && imageFields.length > 0 && (
                <p className="text-xs text-[#879198]">A biblioteca ainda está vazia. Envie fotos em <a href="/admin/media" className="font-medium text-[#536c74] underline">Gerenciar mídia</a>.</p>
              )}
            </div>
          </details>

          <details className="border-t border-[#edf0f1] pt-5">
            <summary className="cursor-pointer text-xs font-semibold text-[#45535b]">
              Imagens de fundo <span className="font-normal text-[#879198]">· {backgroundImageFields.length}</span>
            </summary>
            <p className="mb-4 mt-3 text-xs leading-5 text-[#6f7b82]">O editor altera apenas a imagem de fundo conhecida; camada de cor, posição, classe e demais estilos permanecem no template.</p>
            <div className="grid gap-3">
              {backgroundImageFields.map((field, index) => (
                <div key={field.key} className="grid gap-3 rounded-md border border-[#e8ecee] bg-[#fcfcfc] p-3 sm:grid-cols-[120px_minmax(0,1fr)]">
                  <div className="grid min-h-24 place-items-center overflow-hidden rounded border border-[#e1e6e8] bg-white">
                    {field.value ? (
                      // The source can be a legacy asset or a CMS upload served by this same application.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={previewImageUrl(field.value)} alt="" className="max-h-28 w-full object-contain" />
                    ) : <ImageIcon size={24} className="text-[#9aa5aa]" aria-hidden="true" />}
                  </div>
                  <label className="block space-y-2 text-xs font-medium text-[#45535b]">
                    {index + 1}. {field.label}
                    <select
                      value={field.value}
                      onChange={(event) => updateImage(field.key, event.target.value)}
                      aria-label={`Imagem de fundo ${index + 1}: ${field.label}`}
                      className="h-10 w-full rounded-md border border-[#e1e6e8] bg-white px-3 text-xs font-normal text-[#45535b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#97b7c0]"
                    >
                      <option value={field.originalValue}>Imagem original do site</option>
                      {media.map((asset) => (
                        <option key={asset.id} value={asset.url}>{asset.originalName}</option>
                      ))}
                    </select>
                  </label>
                </div>
              ))}
              {backgroundImageFields.length === 0 && <p className="text-xs text-[#879198]">Nenhuma imagem de fundo editável foi encontrada neste template.</p>}
              {media.length === 0 && backgroundImageFields.length > 0 && (
                <p className="text-xs text-[#879198]">A biblioteca ainda está vazia. Envie fotos em <a href="/admin/media" className="font-medium text-[#536c74] underline">Gerenciar mídia</a>.</p>
              )}
            </div>
          </details>

          {sectionOrderFields.map((field) => (
            <details key={field.key} className="border-t border-[#edf0f1] pt-5">
              <summary className="cursor-pointer text-xs font-semibold text-[#45535b]">
                {field.label} <span className="font-normal text-[#879198]">· {field.items.length} seções</span>
              </summary>
              <p className="mb-3 mt-3 text-xs leading-5 text-[#6f7b82]">Mova apenas seções irmãs diretas da área principal. Os elementos e estilos originais são mantidos.</p>
              <ol className="space-y-2">
                {field.value.map((selector, index) => {
                  const item = field.items.find((candidate) => candidate.selector === selector);
                  return (
                    <li key={selector} className="flex items-center gap-2 rounded-md border border-[#e8ecee] bg-[#fcfcfc] p-2.5">
                      <span className="min-w-0 flex-1 truncate text-xs text-[#45535b]" title={item?.label}>{index + 1}. {item?.label ?? "Seção"}</span>
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="outline"
                        disabled={index === 0}
                        onClick={() => moveSection(field.key, selector, -1)}
                        aria-label={`Mover seção ${index + 1} para cima`}
                        className="border-[#e1e6e8] bg-white"
                      ><ArrowUp size={14} aria-hidden="true" /></Button>
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="outline"
                        disabled={index === field.value.length - 1}
                        onClick={() => moveSection(field.key, selector, 1)}
                        aria-label={`Mover seção ${index + 1} para baixo`}
                        className="border-[#e1e6e8] bg-white"
                      ><ArrowDown size={14} aria-hidden="true" /></Button>
                    </li>
                  );
                })}
              </ol>
            </details>
          ))}
        </CardContent>
      </Card>

      <Card className="rounded-lg border-[#e5e9eb] bg-white py-0 shadow-none">
        <CardHeader className="border-b border-[#edf0f1] px-5 py-4 sm:px-6">
          <CardTitle className="text-sm font-semibold text-[#26343c]">SEO</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
          <label className="block space-y-2 text-xs font-medium text-[#45535b]">
            <span className="flex justify-between">Título para buscadores <span className={seoTitleValue.length > 60 ? "font-normal text-[#a35a1a]" : "font-normal text-[#879198]"}>{(seoTitleValue || defaultSeoTitle).length}/60</span></span>
            <Input name="seoTitle" value={seoTitleValue} onChange={(event) => setSeoTitleValue(event.target.value)} maxLength={255} placeholder={defaultSeoTitle || "Título usado pelo site"} className="h-10 border-[#e1e6e8] text-sm" />
            <span className="block font-normal leading-5 text-[#879198]">Vazio mantém o título atual do site.</span>
          </label>
          <label className="block space-y-2 text-xs font-medium text-[#45535b]">
            <span className="flex justify-between">Descrição para buscadores <span className={seoDescriptionValue.length > 160 ? "font-normal text-[#a35a1a]" : "font-normal text-[#879198]"}>{(seoDescriptionValue || defaultSeoDescription).length}/160</span></span>
            <Textarea name="seoDescription" value={seoDescriptionValue} onChange={(event) => setSeoDescriptionValue(event.target.value)} maxLength={320} rows={3} placeholder={defaultSeoDescription || "Descrição usada pelo site"} className="resize-y border-[#e1e6e8] text-sm" />
            <span className="block font-normal leading-5 text-[#879198]">Vazio mantém a descrição atual do site.</span>
          </label>
          <div className="rounded-md border border-[#e8ecee] bg-white p-4 sm:col-span-2" aria-label="Prévia no Google">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#879198]">Prévia nos buscadores</p>
            <p className="mt-2 truncate text-xs text-[#4d5156]">Endereço do site › {routePath === "/" ? "página inicial" : routePath.replace(/^\//, "")}</p>
            <p className="truncate text-lg leading-6 text-[#1a0dab]">{effectiveSeoTitle}</p>
            <p className="line-clamp-2 text-sm leading-5 text-[#4d5156]">{effectiveSeoDescription}</p>
          </div>
        </CardContent>
      </Card>

      <div className="sticky bottom-0 z-20 -mx-1 flex flex-col gap-3 rounded-lg border border-[#e5e9eb] bg-white/95 px-4 py-3 shadow-[0_-8px_24px_rgba(24,33,39,0.08)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <p aria-live="polite" className="text-[11px] leading-5 text-[#849097]">
          {dirty
            ? <span className="font-medium text-[#a35a1a]">● Alterações não salvas.</span>
            : <span>Sem alterações pendentes.</span>}{" "}
          Salvar cria rascunho; publicar aplica o conteúdo no site.
        </p>
        <div className="flex flex-wrap gap-2 sm:justify-end">
          <Button type="submit" formAction={saveDraftAndPreview} variant="outline" className="border-[#dce2e5] bg-white text-[#26343c]">
            <Eye size={15} aria-hidden="true" /> Pré-visualizar rascunho
          </Button>
          <Button type="submit" variant="outline" className="border-[#dce2e5] bg-white text-[#26343c]">
            <Save size={15} aria-hidden="true" /> Salvar rascunho
          </Button>
          <Button type="submit" formAction={publishPage} className="bg-[#18252c] text-white hover:bg-[#26363f]">
            <ExternalLink size={15} aria-hidden="true" /> Publicar no site
          </Button>
          {isPublished && (
            <Button type="submit" formAction={unpublishPage} variant="ghost" className="text-[#8f4038] hover:bg-[#fff8f7] hover:text-[#8f4038]">
              Retirar do site
            </Button>
          )}
        </div>
      </div>
      </PendingFieldset>
    </form>
  );
}
