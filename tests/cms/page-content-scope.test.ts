import assert from "node:assert/strict";
import test from "node:test";

import { extractEditableFields } from "../../src/lib/cms/page-content.ts";

test("includes editable text and images from the shared header, page body and footer", () => {
  const markup = `<!DOCTYPE html><html><body>
    <header><a href="/">Marca EndControl</a></header>
    <main><p>Conteúdo da página.</p><img src="/assets/conteudo.jpg" alt="Imagem do conteúdo"></main>
    <footer><p>Contato da empresa.</p></footer>
  </body></html>`;
  const fields = extractEditableFields(markup);
  const text = fields.filter((field) => field.kind === "text").map((field) => field.value.trim());
  const images = fields.filter((field) => field.kind === "image");

  assert.ok(text.includes("Marca EndControl"));
  assert.ok(text.includes("Conteúdo da página."));
  assert.ok(text.includes("Contato da empresa."));
  assert.equal(images.length, 1);
});
