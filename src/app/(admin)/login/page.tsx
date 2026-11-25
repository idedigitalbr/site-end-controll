import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { getCmsSession } from "@/lib/auth";
import { isCmsEditor } from "@/lib/cms/auth-role";

export const metadata: Metadata = { title: "Acesso administrativo" };

export default async function LoginPage() {
  const session = await getCmsSession();
  if (session && isCmsEditor(session.user.role)) redirect("/admin");

  return (
    <main className="grid min-h-screen place-items-center bg-[#f4f6f7] px-5 py-12 text-[#182127]">
      <section className="w-full max-w-md rounded-xl border border-[#e3e8ea] bg-white p-7 shadow-[0_18px_50px_rgba(24,33,39,0.08)] sm:p-9">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/Imagens-Diversas/Logos/logo-principal-original-horizontal-endcontrol.png"
            alt="EndControl Engenharia"
            width={220}
            height={64}
            className="h-14 w-auto max-w-full object-contain"
          />
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#879198]">Painel de conteúdo</p>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Entrar no CMS</h1>
        <p className="mt-2 text-sm leading-6 text-[#68757d]">Acesse com a conta administrativa cadastrada para este ambiente.</p>
        <LoginForm />
      </section>
    </main>
  );
}
