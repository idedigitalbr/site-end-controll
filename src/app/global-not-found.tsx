import type { Metadata } from "next";

import { LegacyScriptBootstrap } from "@/components/public/legacy-script-bootstrap";
import { getPublicPageDocument, publicMetadataForDocument } from "@/lib/cms/public-renderer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const document = await getPublicPageDocument("/404.html");
  return document
    ? publicMetadataForDocument(document)
    : { title: "Página não encontrada | EndControl", robots: "noindex" };
}

export default async function GlobalNotFound() {
  const document = await getPublicPageDocument("/404.html");

  if (!document) {
    return (
      <html lang="pt-BR">
        <head>
          <title>404 - Página Não Encontrada | ENDCONTROL Engenharia</title>
          <meta name="description" content="A página solicitada não foi encontrada ou foi movida. Retorne à página inicial da ENDCONTROL Engenharia ou fale com nossos especialistas." />
        </head>
        <body className="sn-page-wrapper">
          <main>
            <h1>Página não encontrada</h1>
            <a href="/">Voltar à página inicial</a>
          </main>
        </body>
      </html>
    );
  }

  const { template } = document;
  return (
    <html lang={template.lang}>
      <head>
        <title>{template.metadata.title || "404 - Página Não Encontrada | ENDCONTROL Engenharia"}</title>
        {template.metadata.description && (
          <meta name="description" content={template.metadata.description} />
        )}
        {template.headElements}
        {template.jsonLd.map((json, index) => (
          <script key={`json-ld-${index}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
        ))}
      </head>
      <body className={template.bodyClassName}>
        {template.bodyElements}
        <LegacyScriptBootstrap pageKey="/404.html" scripts={template.scripts} />
      </body>
    </html>
  );
}
