import { Images } from "lucide-react";

import { MediaLibrary } from "@/components/admin/media-library";
import { listCmsMedia } from "@/lib/cms/settings-data";

export default async function AdminMediaPage() {
  const media = await listCmsMedia();

  return (
    <div className="space-y-7">
      <header>
        <div className="mb-3 flex items-center gap-2 text-xs font-medium text-[#77848c]"><span>Workspace</span><span>/</span><span className="text-[#26343c]">Mídia</span></div>
        <div className="flex items-start gap-3">
          <span className="grid size-10 place-items-center rounded-lg border border-[#e4e9eb] bg-white text-[#53626a]"><Images size={18} aria-hidden="true" /></span>
          <div>
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#182127]">Biblioteca de mídia</h1>
            <p className="mt-2 text-sm leading-6 text-[#68757d]">Imagens enviadas ficam disponíveis para uso nos conteúdos públicos.</p>
          </div>
        </div>
      </header>
      <MediaLibrary initialMedia={media} />
    </div>
  );
}
