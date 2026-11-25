"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth, requireCmsAdmin } from "@/lib/auth";

export type UserActionState = { error?: string; success?: string };

export async function createCmsUser(_state: UserActionState, form: FormData): Promise<UserActionState> {
  await requireCmsAdmin();
  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  const role = String(form.get("role") ?? "editor");
  if (!name || name.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255 || password.length < 8 || password.length > 128 || !["admin", "editor"].includes(role)) {
    return { error: "Confira nome, e-mail, papel e senha (12 a 128 caracteres)." };
  }
  try {
    await auth.api.createUser({ headers: await headers(), body: { name, email, password, role: role as "admin" | "editor" } });
  } catch {
    return { error: "Não foi possível criar a conta. Confira se o e-mail já está cadastrado." };
  }
  revalidatePath("/admin/users");
  return { success: "Conta criada. A pessoa já pode acessar o CMS." };
}
