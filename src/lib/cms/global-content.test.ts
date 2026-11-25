import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { load } from "cheerio";
import { applyGlobalContent, globalContentFields, normalizeGlobalContent } from "./global-content";

const defaults = Object.fromEntries(globalContentFields.map(field => [field.key, field.value]));
test("global contact settings validate links and never inject markup", async () => {
  assert.throws(() => normalizeGlobalContent({ ...defaults, instagram: "javascript:alert(1)" }));
  assert.throws(() => normalizeGlobalContent({ ...defaults, whatsapp: "no" }));
  const source = await readFile("index.html", "utf8");
  assert.equal(applyGlobalContent(source, null), source);
  const values = normalizeGlobalContent({ ...defaults, address1: "<script>QA</script>", email: "qa@example.com", whatsapp: "5511999999999" });
  const $ = load(applyGlobalContent(source, values));
  assert.equal($(".footer-location-details p").first().text(), "<script>QA</script>");
  assert.equal($(".footer-location-details script").length, 0);
  assert.equal($(".footer-email-row").attr("href"), "mailto:qa@example.com");
  assert.ok($(".footer-whatsapp-row").attr("href")?.includes("5511999999999"));
  const organization = $('script[type="application/ld+json"]').toArray().map(element => JSON.parse($(element).html() ?? "null")).find(value => value?.["@type"] === "ProfessionalService");
  assert.ok(organization);
  assert.equal(organization.email, "qa@example.com");
  assert.equal(organization.address.addressLocality, "São Paulo");
});
