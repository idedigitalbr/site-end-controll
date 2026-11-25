import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { load } from "cheerio";
import { appendFfsOverrides, defaultFfsContent, normalizeFfsContent } from "./ffs-content";

test("FFS edits/reorders the actual twelve cards without changing icons or injecting markup", async () => {
  const reversed = normalizeFfsContent([...defaultFfsContent].reverse());
  assert.equal(reversed[0].id, 11);
  assert.throws(() => normalizeFfsContent(defaultFfsContent.slice(1)));
  assert.throws(() => normalizeFfsContent(defaultFfsContent.map(item => ({ ...item, id: 0 }))));
  const source = await readFile("1-solucao-engenharia-de-integridade-estrutural.html", "utf8");
  assert.equal(appendFfsOverrides(source, null), source);
  const before = load(source);
  const result = load(appendFfsOverrides(source, reversed));
  assert.equal(result(".ffs-mechanism-card").length, 12);
  assert.equal(result(".ffs-mechanism-card h3").first().text(), defaultFfsContent[11].title);
  assert.equal(result(".ffs-mechanism-card svg").first().html(), before(".ffs-mechanism-card svg").last().html());
  const malicious = defaultFfsContent.map(item => ({ ...item, title: "<script>QA</script>" }));
  const safe = load(appendFfsOverrides(source, malicious));
  assert.equal(safe(".ffs-mechanisms-grid script").length, 0);
  assert.equal(safe(".ffs-mechanism-card h3").first().text(), "<script>QA</script>");
});
