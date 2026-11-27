"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Images, LoaderCircle, Trash2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type MediaItem = {
  id: string;
  url: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  width?: number | null;
  height?: number | null;
  altText: string;
  createdAt: Date;
  isOriginal?: boolean;
};

function formatSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function MediaLibrary({ initialMedia }: { initialMedia: MediaItem[] }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState(initialMedia);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(24);
  const filtered = items.filter(item => `${item.originalName} ${item.altText}`.toLocaleLowerCase("pt-BR").includes(query.toLocaleLowerCase("pt-BR")));

  async function upload(formData: FormData) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/media", { method: "POST", body: formData });
      const result = await response.json().catch(() => ({ error: "O servidor não respondeu corretamente. Recarregue a página e tente novamente." }));
      if (!response.ok || !result.media?.id) throw new Error(result.error ?? "Falha ao enviar a imagem.");
      setNotice("Imagem enviada e disponível para uso no site.");
      setItems((current) => [
        { ...result.media, createdAt: new Date() },
        ...current,
      ]);
      if (fileRef.current) fileRef.current.value = "";
      const form = document.getElementById("media-upload-form");
      if (form instanceof HTMLFormElement) form.reset();
      router.refresh();
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Falha ao enviar a imagem.");
    } finally {
      setBusy(false);
    }
  }

  async function updateAlt(item: MediaItem, altText: string) {
    const response = await fetch("/api/admin/media", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, altText }),
    });
    const result = await response.json().catch(() => ({ error: "Resposta inválida do servidor. Recarregue a página e tente novamente." }));
    if (!response.ok || !result.success) throw new Error(result.error ?? "Não foi possível salvar a descrição.");
    setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, altText } : entry));
    setNotice("Texto alternativo atualizado.");
  }

  async function remove(item: MediaItem) {
    if (!window.confirm(`Excluir “${item.originalName}”?`)) return;
    setError("");
    setNotice("");
    try {
    const response = await fetch("/api/admin/media", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id }),
    });
    const result = await response.json().catch(() => ({ error: "Resposta inválida do servidor. Recarregue a página e tente novamente." }));
    if (!response.ok || !result.success) {
      setError(result.error ?? "Não foi possível excluir a imagem.");
      return;
    }
    setItems((current) => current.filter((entry) => entry.id !== item.id));
    setNotice("Imagem excluída da biblioteca.");
    router.refresh();
    } catch {
      setError("Não foi possível excluir a imagem. Confira a conexão e tente novamente.");
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-[#e5e9eb] bg-white p-5 sm:p-6">
        <div className="mb-4 flex items-start gap-3">
          <span className="grid size-9 place-items-center rounded-md bg-[#f5f6f7] text-[#65737b]"><ImagePlus size={17} aria-hidden="true" /></span>
          <div><h2 className="text-sm font-semibold text-[#202a30]">Adicionar imagem</h2><p className="mt-1 text-xs text-[#78858c]">JPEG, PNG, WebP, GIF ou AVIF · até 10 MB.</p></div>
        </div>
        <form id="media-upload-form" action={upload} className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <label className="space-y-2 text-xs font-medium text-[#506069]">Arquivo de imagem
            <Input ref={fileRef} name="file" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" required className="h-10 bg-white file:mr-3" />
          </label>
          <label className="space-y-2 text-xs font-medium text-[#506069]">Texto alternativo
            <Input name="altText" maxLength={500} placeholder="Descreva a imagem para acessibilidade" className="h-10" />
          </label>
          <Button disabled={busy} className="h-10 bg-[#18252c] px-4 text-white hover:bg-[#26363f]">
            {busy ? <LoaderCircle size={15} className="animate-spin" aria-hidden="true" /> : <Upload size={15} aria-hidden="true" />}
            {busy ? "Enviando…" : "Enviar imagem"}
          </Button>
        </form>
        {notice && <p role="status" className="mt-4 text-xs text-[#47745c]">{notice}</p>}
        {error && <p role="alert" className="mt-4 text-xs text-red-700">{error}</p>}
      </section>

      <section>
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h2 className="text-sm font-semibold text-[#26343c]">Biblioteca do site</h2>
          <span className="text-xs text-[#879198]">{items.length} {items.length === 1 ? "imagem" : "imagens"}</span>
        </div>
        <Input aria-label="Buscar imagens" placeholder="Buscar por nome ou descrição..." value={query} onChange={event => { setQuery(event.target.value); setVisibleCount(24); }} className="mb-4 bg-white" />
        {items.length === 0 ? (
          <div className="grid min-h-48 place-items-center rounded-lg border border-dashed border-[#dce2e5] bg-white px-5 text-center">
            <div><Images size={22} className="mx-auto text-[#9aa5ab]" aria-hidden="true" /><p className="mt-3 text-sm font-medium text-[#53626a]">Sua biblioteca está vazia</p><p className="mt-1 text-xs text-[#879198]">Envie uma imagem para começar.</p></div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.slice(0, visibleCount).map((item) => <MediaCard key={item.id} item={item} onUpdateAlt={updateAlt} onRemove={remove} />)}
          </div>
        )}
        {items.length > 0 && filtered.length === 0 && <p className="py-8 text-center text-sm text-slate-600">Nenhuma imagem corresponde à busca.</p>}
        {filtered.length > visibleCount && <Button type="button" variant="outline" className="mt-4" onClick={() => setVisibleCount(current => current + 24)}>Carregar mais imagens</Button>}
      </section>
    </div>
  );
}

function MediaCard({
  item,
  onUpdateAlt,
  onRemove,
}: {
  item: MediaItem;
  onUpdateAlt: (item: MediaItem, altText: string) => Promise<void>;
  onRemove: (item: MediaItem) => Promise<void>;
}) {
  const [altText, setAltText] = useState(item.altText);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function saveAlt() {
    setSaving(true);
    setError("");
    try {
      await onUpdateAlt(item, altText);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Falha ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  const isVideo = item.mimeType.startsWith("video/");

  return (
    <article className="overflow-hidden rounded-lg border border-[#e5e9eb] bg-white">
      <div className="relative grid h-48 place-items-center bg-[#f5f6f7] p-3">
        {isVideo ? (
          <>
            <video src={item.url} muted preload="metadata" playsInline controls className="max-h-full max-w-full object-contain" />
            <span className="pointer-events-none absolute right-2 top-2 rounded bg-[#18252c]/85 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              Vídeo
            </span>
          </>
        ) : (
          <>
            {/* These URLs are served by the public, allowlisted media handler. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.url} alt={item.altText} loading="lazy" className="max-h-full max-w-full object-contain" />
          </>
        )}
      </div>
      <div className="space-y-3 p-4">
        <div className="min-w-0"><p className="truncate text-xs font-semibold text-[#26343c]" title={item.originalName}>{item.originalName}</p><p className="mt-1 text-[11px] text-[#879198]">{formatSize(item.sizeBytes)} · {item.mimeType.split("/")[1]?.toUpperCase()}{item.width && item.height ? ` · ${item.width} × ${item.height}` : ""}</p></div>
        <label className="block space-y-1.5 text-[11px] font-medium text-[#68757d]">Texto alternativo
          <Input value={altText} onChange={(event) => setAltText(event.target.value)} maxLength={500} className="h-9 text-xs" />
        </label>
        {error && <p role="alert" className="text-[11px] text-red-700">{error}</p>}
        <div className="flex items-center justify-between gap-2">
          <Button onClick={() => void saveAlt()} disabled={saving || altText === item.altText} variant="outline" size="sm">{saving ? "Salvando…" : "Salvar descrição"}</Button>
          {item.isOriginal ? <span className="text-xs text-slate-500">Imagem original</span> : <Button onClick={() => void onRemove(item)} variant="ghost" size="icon-sm" aria-label={`Excluir ${item.originalName}`} className="text-[#9c4b4b] hover:text-red-700"><Trash2 size={15} aria-hidden="true" /></Button>}
        </div>
      </div>
    </article>
  );
}
