import { Boxes } from "lucide-react";
import { HomeServicesOrderForm } from "@/components/admin/home-services-order-form";
import { requireCmsEditor } from "@/lib/auth";
import { defaultHomeServiceOrder } from "@/lib/cms/home-services-content";
import { getHomeServiceOrder } from "@/lib/cms/home-services-data";

export default async function HomeServicesPage() {
  await requireCmsEditor();
  const order = await getHomeServiceOrder();

  return <div className="space-y-7">
    <header>
      <div className="mb-3 flex items-center gap-2 text-xs font-medium text-[#77848c]"><span>Workspace</span><span>/</span><span className="text-[#26343c]">Soluções da Home</span></div>
      <div className="flex items-start gap-3">
        <span className="grid size-10 place-items-center rounded-lg border border-[#e4e9eb] bg-white text-[#53626a]"><Boxes size={18} aria-hidden="true" /></span>
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#182127]">Ordem das soluções</h1>
          <p className="mt-2 text-sm leading-6 text-[#68757d]">Reorganize as 12 soluções da seção interativa na Home. Os nós e seus cartões acompanham a ordem salva.</p>
        </div>
      </div>
    </header>
    <HomeServicesOrderForm initial={order ?? defaultHomeServiceOrder} />
  </div>;
}
