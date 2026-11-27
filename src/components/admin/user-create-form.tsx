"use client";
import { useActionState } from "react";
import { createCmsUser } from "@/app/(admin)/admin/users/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function UserCreateForm() {
  const [state, action, pending] = useActionState(createCmsUser, {});
  return <form action={action} className="grid gap-4 rounded-lg border bg-white p-6 sm:grid-cols-2">
    <label className="space-y-2 text-sm">Nome<Input name="name" required maxLength={255} autoComplete="name" /></label>
    <label className="space-y-2 text-sm">E-mail<Input name="email" type="email" required maxLength={255} autoComplete="email" /></label>
    <label className="space-y-2 text-sm">Senha inicial<Input name="password" type="password" required minLength={8} maxLength={128} autoComplete="new-password" /></label>
    <label className="space-y-2 text-sm">Permissão<select name="role" defaultValue="editor" className="block h-9 w-full rounded-md border px-3"><option value="editor">Editor — edição de textos, links e indicadores (sem trocar fotos)</option><option value="admin">Superadmin — acesso total (textos, fotos, mídia, identidade e contas)</option></select></label>
    {state.error && <p role="alert" className="text-sm text-red-700 sm:col-span-2">{state.error}</p>}
    {state.success && <p role="status" className="text-sm text-green-700 sm:col-span-2">{state.success}</p>}
    <Button disabled={pending} className="w-fit">{pending ? "Criando…" : "Criar conta"}</Button>
  </form>;
}
