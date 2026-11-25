import assert from "node:assert/strict";
import test from "node:test";

import { applyContentPatches, applyPageMetadata, editableFieldsForRoute, extractEditableFields, getSolutionCardImageAltOverride, getSolutionCardImageOverride, hydrateEditableFields } from "../../src/lib/cms/page-content.ts";

const source = `<!DOCTYPE html><html><head><title>Original</title></head><body>
  <header><a href="/">Marca</a></header>
  <main><h1 class="hero-title">Segurança <span class="accent">para operar</span></h1>
    <p class="intro">Texto original do serviço.</p>
    <img class="hero-image" src="/assets/hero.jpg" alt="Foto original">
  </main>
</body></html>`;

test("a UTF-8 BOM does not move metadata into the body when editing", () => {
  const prefixed = `\uFEFF${source}`;
  const field = extractEditableFields(prefixed).find(candidate => candidate.kind === "text" && candidate.value.trim() === "Texto original do serviço.");
  assert.ok(field);
  const result = applyContentPatches(prefixed, [{ key: field.key, kind: "text", value: "Revisado" }]);
  assert.ok(result.indexOf("<title>Original</title>") < result.indexOf("<body>"));
  assert.match(result, /Revisado/);
  assert.equal(applyContentPatches(prefixed, []), prefixed);
});

test("keeps the legacy HTML byte-identical when there are no CMS patches", () => {
  assert.equal(applyContentPatches(source, []), source);
});

test("updates a text field while retaining the original element wrappers and classes", () => {
  const field = extractEditableFields(source).find(
    (candidate) => candidate.kind === "text" && candidate.value.trim() === "Texto original do serviço.",
  );

  assert.ok(field, "expected the paragraph text to be editable");
  const rendered = applyContentPatches(source, [
    { key: field.key, kind: "text", value: "Texto atualizado pelo CMS." },
  ]);

  assert.match(rendered, /class="intro"/);
  assert.match(rendered, /Texto atualizado pelo CMS\./);
  assert.match(rendered, /class="accent"/);
  assert.match(rendered, /para operar/);
});

test("updates an image URL and alt text without changing its class", () => {
  const field = extractEditableFields(source).find((candidate) => candidate.kind === "image");

  assert.ok(field, "expected the image to be editable");
  const rendered = applyContentPatches(source, [
    { key: field.key, kind: "image", value: "/media/550e8400-e29b-41d4-a716-446655440000.webp", altText: "Estrutura industrial" },
  ]);

  assert.match(rendered, /class="hero-image"/);
  assert.match(rendered, /src="\/media\/550e8400-e29b-41d4-a716-446655440000\.webp"/);
  assert.match(rendered, /alt="Estrutura industrial"/);
});

test("rejects image URLs outside the original image and CMS media library", () => {
  const field = extractEditableFields(source).find((candidate) => candidate.kind === "image");

  assert.ok(field, "expected the image to be editable");
  assert.throws(
    () => applyContentPatches(source, [
      { key: field.key, kind: "image", value: "/media/../private.webp", altText: "Inseguro" },
    ]),
    /selecione uma imagem da biblioteca de mídia/i,
  );
});

test("lets service editors replace the Home card image without changing page markup", () => {
  const routePath = "/1-solucao-engenharia-de-integridade-estrutural.html";
  const fields = editableFieldsForRoute(source, routePath);
  const cardImage = fields.find((field) => field.key === "cms:solution-card-image");
  assert.ok(cardImage && cardImage.kind === "image");

  const mediaUrl = "/media/550e8400-e29b-41d4-a716-446655440000.webp";
  const patch = { key: cardImage.key, kind: "image" as const, value: mediaUrl, altText: "Cartão da Home" };
  const hydrated = hydrateEditableFields(source, [patch], routePath);
  assert.equal(hydrated.find((field) => field.key === cardImage.key)?.value, mediaUrl);
  assert.equal(applyContentPatches(source, [patch], routePath), source);
  assert.equal(getSolutionCardImageOverride([patch]), mediaUrl);
  assert.equal(getSolutionCardImageAltOverride([patch]), "Cartão da Home");
  assert.equal(getSolutionCardImageOverride([{ ...patch, value: "/media/../image.webp" }]), undefined);
});

test("rejects a CMS field key that does not exist in the selected template", () => {
  assert.throws(
    () => applyContentPatches(source, [{ key: "unknown:text:0", kind: "text", value: "não permitido" }]),
    /campo.*(inválido|inexistente)/i,
  );
});

test("updates SEO metadata and canonical URL on a published page", () => {
  const rendered = applyPageMetadata(source, {
    title: "Página atualizada",
    summary: "Resumo atualizado",
    seoTitle: "Título SEO atualizado",
    seoDescription: "Descrição SEO atualizada",
    canonicalUrl: "https://endcontrol.example/servico.html",
  });

  assert.match(rendered, /<title>Título SEO atualizado<\/title>/);
  assert.match(rendered, /name="description" content="Descrição SEO atualizada"/);
  assert.match(rendered, /property="og:title" content="Título SEO atualizado"/);
  assert.match(rendered, /rel="canonical" href="https:\/\/endcontrol\.example\/servico\.html"/);
});

test("edits CTA destinations and CSS background images without replacing template attributes", () => {
  const markup = `<!DOCTYPE html><html><body><header><a href="/">Marca</a></header><main>
    <a class="primary-cta" href="/contato.html" target="_blank" rel="noopener" data-source="legacy">Fale com um especialista</a>
    <section class="hero" style="background: linear-gradient(#111, transparent), url('../assets/hero.jpg') center / cover no-repeat; color: white;"><h1>Original</h1></section>
  </main><footer><a href="/privacidade.html">Privacidade</a></footer></body></html>`;
  const fields = extractEditableFields(markup);
  const link = fields.find((field) => field.kind === "link");
  const background = fields.find((field) => field.kind === "backgroundImage");
  assert.ok(link && link.kind === "link");
  assert.ok(background && background.kind === "backgroundImage");
  assert.equal(fields.filter((field) => field.kind === "link").length, 1, "global header/footer links stay outside per-page content editing");

  const mediaUrl = "/media/550e8400-e29b-41d4-a716-446655440000.webp";
  const rendered = applyContentPatches(markup, [
    { key: link.key, kind: "link", value: "https://example.com/contato" },
    { key: background.key, kind: "backgroundImage", value: mediaUrl },
  ]);

  assert.match(rendered, /class="primary-cta" href="https:\/\/example\.com\/contato" target="_blank" rel="noopener" data-source="legacy"/);
  assert.match(rendered, /background:\s*linear-gradient\(#111, transparent\), url\(&quot;\/media\/550e8400-e29b-41d4-a716-446655440000\.webp&quot;\) center \/ cover no-repeat/);
  assert.match(rendered, /<footer><a href="\/privacidade\.html">Privacidade<\/a><\/footer>/);
});

test("marks shared menu and global footer text as managed while keeping legacy text patches loadable", () => {
  const markup = `<html><body><header><nav class="main-menu"><a href="/">Home</a></nav></header><main><h1>Page heading</h1></main><footer><div class="footer-location-details"><p>Address</p></div><span class="footer-phone-number">Phone</span></footer></body></html>`;
  const fields = extractEditableFields(markup);
  const menuText = fields.find((field) => field.kind === "text" && field.value.trim() === "Home");
  const footerText = fields.find((field) => field.kind === "text" && field.value.trim() === "Address");
  const pageText = fields.find((field) => field.kind === "text" && field.value.trim() === "Page heading");

  assert.equal(menuText?.kind === "text" ? menuText.managedBy : undefined, "navigation");
  assert.equal(footerText?.kind === "text" ? footerText.managedBy : undefined, "global");
  assert.equal(pageText?.kind === "text" ? pageText.managedBy : undefined, undefined);
  assert.ok(menuText && menuText.kind === "text");
  const storedPatch = [{ key: menuText.key, kind: "text", value: "Legacy menu text" }];
  const hydrated = hydrateEditableFields(markup, storedPatch);
  const preserved = hydrated.find((field) => field.key === menuText.key);
  assert.equal(preserved?.kind === "text" ? preserved.value : undefined, "Legacy menu text");
  assert.equal(preserved?.kind === "text" ? preserved.managedBy : undefined, "navigation");
});

test("rejects unsafe CTA destinations", () => {
  const markup = `<html><body><main><a href="/contato.html">Contato</a></main></body></html>`;
  const link = extractEditableFields(markup).find((field) => field.kind === "link");
  assert.ok(link && link.kind === "link");
  assert.throws(
    () => applyContentPatches(markup, [{ key: link.key, kind: "link", value: "javascript:alert(1)" }]),
    /link.*válido/i,
  );
});

test("reorders only existing direct main sections and retains intervening markup", () => {
  const markup = `<html><body><main><section id="one" class="keep-one"><h2>Primeira seção</h2></section>
    <aside data-keep="yes">Entre seções</aside>
    <section id="two" class="keep-two"><h2>Segunda seção</h2></section>
    <section id="three" class="keep-three"><h2>Terceira seção</h2></section></main></body></html>`;
  const field = extractEditableFields(markup).find((candidate) => candidate.kind === "sectionOrder");
  assert.ok(field && field.kind === "sectionOrder");
  assert.equal(field.value.length, 3);

  const rendered = applyContentPatches(markup, [{ key: field.key, kind: "sectionOrder", value: [field.value[2], field.value[0], field.value[1]] }]);
  assert.ok(rendered.indexOf('id="three"') < rendered.indexOf('id="one"'));
  assert.ok(rendered.indexOf('id="one"') < rendered.indexOf('id="two"'));
  assert.match(rendered, /<aside data-keep="yes">Entre seções<\/aside>/);
  assert.match(rendered, /id="three" class="keep-three"/);
});

test("exposes CSS-backed service backgrounds and preserves their overlay, position and size", () => {
  const markup = `<html><body><main><section class="svc-techniques-section"><h2>Técnicas</h2></section></main></body></html>`;
  const field = extractEditableFields(markup).find((candidate) => candidate.kind === "backgroundImage");
  assert.ok(field && field.kind === "backgroundImage");

  const rendered = applyContentPatches(markup, [{
    key: field.key,
    kind: "backgroundImage",
    value: "/media/550e8400-e29b-41d4-a716-446655440000.webp",
  }]);
  assert.match(rendered, /class="svc-techniques-section" style="background: #071324/);
  assert.match(rendered, /url\(&quot;\/media\/550e8400-e29b-41d4-a716-446655440000\.webp&quot;\) center \/ cover no-repeat/);
});
