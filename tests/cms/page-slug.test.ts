import assert from "node:assert/strict";
import test from "node:test";

import { normalizePageSlug } from "../../src/lib/cms/page-content.ts";

test("normalizes a Portuguese page title into a route-safe slug", () => {
  assert.equal(normalizePageSlug("Calibração de Instrumentos"), "/calibracao-de-instrumentos.html");
  assert.equal(normalizePageSlug("  nova página  "), "/nova-pagina.html");
});

test("rejects empty, overlong and path-like page slugs", () => {
  assert.equal(normalizePageSlug("   "), null);
  assert.equal(normalizePageSlug("../../.env"), null);
  assert.equal(normalizePageSlug("pagina/filha"), null);
  assert.equal(normalizePageSlug("a".repeat(230)), null);
});
