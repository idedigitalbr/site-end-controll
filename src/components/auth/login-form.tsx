"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError("");
    setPending(true);
    const identifier = String(formData.get("identifier") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    try {
      const response = await fetch("/api/auth/login-identifier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.ok) {
        setError(result?.error || "Usuário, e-mail ou senha inválidos.");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Não foi possível entrar agora. Tente novamente.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form action={handleSubmit} className="mt-7 space-y-5">
      <div className="space-y-2">
        <label htmlFor="identifier" className="text-xs font-medium text-[#3a4850]">
          Usuário ou E-mail
        </label>
        <Input
          id="identifier"
          name="identifier"
          type="text"
          autoComplete="username"
          placeholder="editor ou editor@mail.com"
          required
          maxLength={255}
          className="h-10 border-[#d9e0e3] bg-white text-sm text-[#182127] placeholder:text-[#a3adb3]"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-xs font-medium text-[#3a4850]">Senha</label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          maxLength={128}
          className="h-10 border-[#d9e0e3] bg-white text-sm text-[#182127] placeholder:text-[#a3adb3]"
        />
      </div>
      {error && <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
      <Button disabled={pending} className="h-10 w-full bg-[#18252c] text-white hover:bg-[#26363f]">
        {pending ? "Verificando acesso…" : "Entrar"}
      </Button>
    </form>
  );
}
