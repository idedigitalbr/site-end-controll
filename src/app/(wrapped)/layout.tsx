import type { ReactNode } from "react";
import { headers } from "next/headers";

import "../public-utilities.css";
import { getPublicPageDocument } from "@/lib/cms/public-renderer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function WrappedPublicRootLayout({ children }: { children: ReactNode }) {
  const routePath = (await headers()).get("x-endcontrol-public-path");
  const document = routePath ? await getPublicPageDocument(routePath) : null;
  const bodyClassName = document?.template.bodyClassName ?? "sn-page-wrapper";
  const lang = document?.template.lang ?? "pt-BR";

  return (
    <html lang={lang}>
      <body className={bodyClassName}>{children}</body>
    </html>
  );
}
