"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <section role="alert" className="mx-auto max-w-xl space-y-4 rounded-lg border bg-white p-6">
    <h1 className="text-xl font-semibold">Não foi possível concluir esta operação</h1>
    <p className="text-sm leading-6 text-slate-600">Confira os campos e tente novamente. Se o problema continuar, verifique a conexão com o banco e o funcionamento do servidor local.</p>
    <div className="flex flex-wrap gap-3"><Button onClick={reset}>Tentar novamente</Button><Button asChild variant="outline"><Link href="/admin/pages">Voltar para páginas</Link></Button></div>
  </section>;
}
