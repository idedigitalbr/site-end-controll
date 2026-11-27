import { db } from "@/db";
import { user } from "@/db/schema";
import { requireCmsAdmin } from "@/lib/auth";
import { UserCreateForm } from "@/components/admin/user-create-form";

export default async function UsersPage() {
  await requireCmsAdmin();
  const users = await db.select({ id: user.id, name: user.name, email: user.email, role: user.role }).from(user);
  return <div className="space-y-6">
    <header><h1 className="text-3xl font-semibold">Contas do CMS</h1><p className="mt-2 text-sm text-slate-600">Contas Superadmin têm acesso total (textos, fotos, identidade e contas). Contas Editor editam textos, links e indicadores (sem trocar fotos).</p></header>
    <UserCreateForm />
    <div className="overflow-x-auto rounded-lg border bg-white"><table className="w-full text-left text-sm"><thead><tr><th className="p-4">Nome</th><th className="p-4">E-mail</th><th className="p-4">Permissão</th></tr></thead><tbody>{users.map(item => <tr key={item.id} className="border-t"><td className="p-4">{item.name}</td><td className="p-4">{item.email}</td><td className="p-4">{item.role === "admin" ? "Superadmin" : "Editor"}</td></tr>)}</tbody></table></div>
  </div>;
}
