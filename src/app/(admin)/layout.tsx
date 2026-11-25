import type { Metadata } from "next";

import "../globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: {
    default: "EndControl | Engenharia de Integridade Industrial",
    template: "%s | EndControl",
  },
  description:
    "Engenharia, inspeção e soluções integradas para a integridade de ativos industriais.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={cn("font-sans", geist.variable)}>
      <body>{children}</body>
    </html>
  );
}
