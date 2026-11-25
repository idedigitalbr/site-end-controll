import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { load } from "cheerio";
import { sitePages } from "../../src/lib/site-inventory.ts";
import { applyContentPatches, editableFieldsForRoute, hydrateEditableFields, normalizePageContentPatches } from "../../src/lib/cms/page-content.ts";

for (const page of sitePages) {
  test(`CMS roundtrip preserves layout and edits text/images: ${page.routePath}`, async () => {
    const source = await readFile(page.routePath === "/" ? "index.html" : page.routePath.slice(1), "utf8");
    const browserSource = source.replace(/^\uFEFF/, "");
    const fields = editableFieldsForRoute(source, page.routePath);
    assert.equal(new Set(fields.map(field => field.key)).size, fields.length);
    assert.equal(applyContentPatches(source, [], page.routePath), source);
    const baselinePatches = fields.map(field => ({ key: field.key, kind: field.kind, value: field.value, ...(field.kind === "image" ? { altText: field.altText } : {}) }));
    const baseline = applyContentPatches(source, normalizePageContentPatches(baselinePatches, fields), page.routePath);
    assert.equal(load(baseline)("body").text().replace(/\s+/g, " ").trim(), load(browserSource)("body").text().replace(/\s+/g, " ").trim(), "baseline publication preserves all original text and spacing");
    const text = fields.find(field => field.kind === "text" && field.selector.includes("h1"));
    const image = fields.find(field => field.kind === "image" && field.selector);
    assert.ok(text, "visible H1 must be editable");
    assert.ok(image, "page images must be editable");
    assert.ok(text.kind === "text");
    assert.ok(image.kind === "image");
    const patches = [
      { key: text.key, kind: "text" as const, value: "QA <texto> & conteúdo" },
      { key: image.key, kind: "image" as const, value: "/media/550e8400-e29b-41d4-a716-446655440000.webp", altText: "QA foto" },
    ];
    const rendered = applyContentPatches(source, patches, page.routePath);
    const before = load(browserSource);
    const after = load(rendered);
    assert.ok(after(text.selector).text().includes("QA <texto> & conteúdo"));
    assert.equal(after(image.selector).attr("src"), patches[1].value);
    assert.equal(after(image.selector).attr("alt"), "QA foto");
    assert.deepEqual(after("script").map((_, el) => after(el).attr("src") ?? after(el).html()).get(), before("script").map((_, el) => before(el).attr("src") ?? before(el).html()).get());
    assert.deepEqual(after("[class]").map((_, el) => after(el).attr("class")).get(), before("[class]").map((_, el) => before(el).attr("class")).get());
    const hydrated = hydrateEditableFields(source, patches, page.routePath);
    assert.equal(hydrated.find(field => field.key === text.key)?.value, patches[0].value);
    assert.equal(hydrated.find(field => field.key === image.key)?.value, patches[1].value);
  });
}
