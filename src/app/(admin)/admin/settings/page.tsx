import { Palette } from "lucide-react";
import { requireCmsAdmin } from "@/lib/auth";
import { GlobalContentForm } from "@/components/admin/global-content-form";
import { getGlobalContent } from "@/lib/cms/global-content-data";
import { BackgroundForm } from "@/components/admin/background-form";
import { getBackgroundContent } from "@/lib/cms/background-data";

import { SiteSettingsForm } from "@/components/admin/site-settings-form";
import { getAdminSiteSettings, listCmsMedia } from "@/lib/cms/settings-data";

export default async function AdminSettingsPage() {
  await requireCmsAdmin();
  const settings = await getAdminSiteSettings();

  return (
    <div className="space-y-7">
      <header>
        <div className="mb-3 flex items-center gap-2 text-xs font-medium text-[#77848c]"><span>Workspace</span><span>/</span><span className="text-[#26343c]">Identidade visual</span></div>
        <div className="flex items-start gap-3">
          <span className="grid size-10 place-items-center rounded-lg border border-[#e4e9eb] bg-white text-[#53626a]"><Palette size={18} aria-hidden="true" /></span>
          <div>
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#182127]">Cores globais</h1>
            <p className="mt-2 text-sm leading-6 text-[#68757d]">Ajuste os tokens visuais aplicados ao site público, sem alterar os arquivos originais.</p>
          </div>
        </div>
      </header>
      <SiteSettingsForm initialSettings={settings} />
      <GlobalContentForm values={await getGlobalContent()} />
      <BackgroundForm values={await getBackgroundContent()} media={await listCmsMedia()} />
    </div>
  );
}
