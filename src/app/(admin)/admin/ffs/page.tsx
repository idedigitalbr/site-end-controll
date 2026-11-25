import { FfsForm } from "@/components/admin/ffs-form";
import { requireCmsEditor } from "@/lib/auth";
import { defaultFfsContent } from "@/lib/cms/ffs-content";
import { getFfsOverrides } from "@/lib/cms/ffs-data";

export default async function FfsPage() {
  await requireCmsEditor();
  return <div className="space-y-6"><header><h1 className="text-3xl font-semibold">Mecanismos FFS</h1><p className="mt-2 text-sm text-slate-600">Edite os títulos, descrições e a ordem dos doze cards de integridade estrutural. Salvar aplica as alterações no site local.</p></header><FfsForm initial={(await getFfsOverrides()) ?? defaultFfsContent} /></div>;
}
