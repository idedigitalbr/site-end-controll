import type { ReactNode } from "react";

import "../public-utilities.css";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function PlainPublicRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
