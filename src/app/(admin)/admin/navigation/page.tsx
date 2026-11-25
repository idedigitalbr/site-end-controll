import { Navigation } from "lucide-react";
import { NavigationForm } from "@/components/admin/navigation-form";
import { requireCmsEditor } from "@/lib/auth";
import { defaultNavigationContent } from "@/lib/cms/navigation-content";
import { getNavigationContent } from "@/lib/cms/navigation-data";

export default async function NavigationPage() {
  await requireCmsEditor();
  const navigation = await getNavigationContent();

  return <div className="space-y-7">
    <header>
      <div className="mb-3 flex items-center gap-2 text-xs font-medium text-[#77848c]"><span>Workspace</span><span>/</span><span className="text-[#26343c]">Navegação</span></div>
      <div className="flex items-start gap-3">
        <span className="grid size-10 place-items-center rounded-lg border border-[#e4e9eb] bg-white text-[#53626a]"><Navigation size={18} aria-hidden="true" /></span>
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#182127]">Navegação do site</h1>
          <p className="mt-2 text-sm leading-6 text-[#68757d]">Edite rótulos, destinos e ordem do menu principal e das soluções. Os links existentes permanecem como padrão até você salvar uma alteração.</p>
        </div>
      </div>
    </header>
    <NavigationForm initial={navigation ?? defaultNavigationContent} />
  </div>;
}
