import { redirect } from "next/navigation";
import { requireCmsEditor } from "@/lib/auth";

export default async function ServicesPage() {
  await requireCmsEditor();
  redirect("/admin/home-services");
}
