import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LegacyReactTemplate } from "@/components/public/legacy-react-template";
import {
  getPublicPageDocument,
  publicMetadataForDocument,
} from "@/lib/cms/public-renderer";

export async function generateLegacyPageMetadata(routePath: string): Promise<Metadata> {
  const document = await getPublicPageDocument(routePath);
  if (!document) {
    return {
      // robots comes from the not-found root (global-not-found.tsx); repeating it here duplicates the tag.
      title: "Página não encontrada | EndControl",
    };
  }

  return publicMetadataForDocument(document);
}

export async function PublicLegacyPage({ routePath }: { routePath: string }) {
  const document = await getPublicPageDocument(routePath);
  if (!document) notFound();

  return (
    <LegacyReactTemplate
      template={document.template}
      pageJsonLd={document.pageJsonLd}
      scriptKey={document.routePath}
    />
  );
}

export async function PublicLegacyNotFound() {
  const document = await getPublicPageDocument("/404.html");
  if (!document) {
    return (
      <>
        <title>404 - Página Não Encontrada | ENDCONTROL Engenharia</title>
        <meta name="description" content="A página solicitada não foi encontrada ou foi movida. Retorne à página inicial da ENDCONTROL Engenharia ou fale com nossos especialistas." />
        <main>
          <h1>Página não encontrada</h1>
          <a href="/">Voltar à página inicial</a>
        </main>
      </>
    );
  }

  return (
    <>
      <title>{document.template.metadata.title || "404 - Página Não Encontrada | ENDCONTROL Engenharia"}</title>
      {document.template.metadata.description && (
        <meta name="description" content={document.template.metadata.description} />
      )}
      <LegacyReactTemplate template={document.template} scriptKey="/404.html" />
    </>
  );
}
