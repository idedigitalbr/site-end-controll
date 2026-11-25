import assert from "node:assert/strict";
import { test } from "node:test";

import { hexToRgb, normalizeSiteColor } from "@/lib/cms/site-settings";

test("normalizes valid six-digit hex colors for the CMS theme", () => {
  assert.equal(normalizeSiteColor("#E3B332"), "#e3b332");
  assert.equal(hexToRgb("#67A8B8"), "103, 168, 184");
});

test("rejects non-hex and shorthand colors", () => {
  assert.throws(() => normalizeSiteColor("red"), /cor hex/i);
  assert.throws(() => normalizeSiteColor("#abc"), /cor hex/i);
  assert.throws(() => normalizeSiteColor("#12345z"), /cor hex/i);
});
