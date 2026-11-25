import assert from "node:assert/strict";
import test from "node:test";

import { extractEditableFields, hydrateEditableFields } from "../../src/lib/cms/page-content.ts";

const source = `<!DOCTYPE html><html><body><main><p>Texto original.</p><img src="/assets/hero.jpg" alt="Foto antiga"></main></body></html>`;

test("hydrates saved text and image values while retaining the original image source", () => {
  const fields = extractEditableFields(source);
  const paragraph = fields.find((field) => field.kind === "text");
  const image = fields.find((field) => field.kind === "image");
  assert.ok(paragraph);
  assert.ok(image);

  const hydrated = hydrateEditableFields(source, [
    { key: paragraph.key, kind: "text", value: "Rascunho salvo." },
    { key: image.key, kind: "image", value: "/media/550e8400-e29b-41d4-a716-446655440000.webp", altText: "Imagem do rascunho" },
  ]);

  assert.equal(hydrated.find((field) => field.key === paragraph.key)?.value, "Rascunho salvo.");
  const hydratedImage = hydrated.find((field) => field.key === image.key);
  assert.equal(hydratedImage?.kind, "image");
  if (hydratedImage?.kind === "image") {
    assert.equal(hydratedImage.value, "/media/550e8400-e29b-41d4-a716-446655440000.webp");
    assert.equal(hydratedImage.originalValue, "/assets/hero.jpg");
    assert.equal(hydratedImage.altText, "Imagem do rascunho");
  }
});
