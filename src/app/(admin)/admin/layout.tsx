import { AdminShell } from "@/components/admin/admin-shell";
import { requireCmsEditor } from "@/lib/auth";

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await requireCmsEditor();
  return <AdminShell role={session.user.role}>{children}</AdminShell>;
}
