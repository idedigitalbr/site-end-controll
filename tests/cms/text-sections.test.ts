import assert from "node:assert/strict";
import test from "node:test";

import { extractEditableFields } from "../../src/lib/cms/page-content.ts";

test("text fields carry their tag and the outermost section name", () => {
  const markup = `<main>
    <section id="sobre-servico" aria-label="Sobre o serviço"><div><h2>Título A</h2><p>Texto A</p></div></section>
    <section class="hero-band"><h1>Título B</h1></section>
    <div><span>Solto</span></div>
  </main>`;
  const texts = extractEditableFields(markup).filter((field) => field.kind === "text");
  const byValue = new Map(texts.map((field) => [field.value, field]));
  assert.equal(byValue.get("Título A")?.section, "Sobre o serviço");
  assert.equal(byValue.get("Título A")?.tag, "h2");
  assert.equal(byValue.get("Título B")?.section, "Hero band");
  assert.equal(byValue.get("Solto")?.section, undefined);
});
