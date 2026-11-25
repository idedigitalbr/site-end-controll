import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { applyBackgroundOverrides, backgroundFields, normalizeBackgroundContent } from "./background-content";

test("CSS photo replacement preserves gradients and rejects CSS injection", async () => {
  const source = await readFile("src/css/header.css", "utf8");
  const defaults = Object.fromEntries(backgroundFields.map(field => [field.key, ""]));
  const url = "/media/550e8400-e29b-41d4-a716-446655440000.webp";
  assert.equal(applyBackgroundOverrides(source, null), source);
  assert.equal(applyBackgroundOverrides(source, defaults), source);
  const values = normalizeBackgroundContent({ ...defaults, menu: url });
  assert.equal(applyBackgroundOverrides(source, values), source.replaceAll(backgroundFields[0].source, url));
  assert.throws(() => normalizeBackgroundContent({ ...defaults, menu: 'x");}body{display:none}/*' }));
});
