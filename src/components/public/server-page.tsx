import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { InlineEditorShell } from "@/components/public/inline-editor/inline-editor-shell";
import { LegacyReactTemplate } from "@/components/public/legacy-react-template";
import { getCmsSession } from "@/lib/auth";
import { canAccessCmsAdmin, canAccessCmsEditor } from "@/lib/cms/auth-role";
import {
  getPublicPageDocument,
  getPublicPageDocumentForEditor,
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
  let editorRole: "admin" | "editor" | null = null;
  try {
    const session = await getCmsSession();
    if (session && canAccessCmsEditor(session.user)) {
      editorRole = canAccessCmsAdmin(session.user) ? "admin" : "editor";
    }
  } catch {
    editorRole = null;
  }

  if (editorRole) {
    const editorDocument = await getPublicPageDocumentForEditor(routePath, editorRole);
    if (!editorDocument) notFound();

    const templateNode = (
      <LegacyReactTemplate
        template={editorDocument.template}
        pageJsonLd={editorDocument.pageJsonLd}
        scriptKey={editorDocument.routePath}
      />
    );

    if (editorDocument.inlineEditorBootstrap) {
      return (
        <InlineEditorShell bootstrap={editorDocument.inlineEditorBootstrap}>
          {templateNode}
        </InlineEditorShell>
      );
    }

    return templateNode;
  }

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
