import assert from "node:assert/strict";
import test from "node:test";

import { appendThemeOverrides } from "../../src/lib/cms/page-content.ts";

test("does not change original token CSS when no CMS theme exists", () => {
  const css = ":root { --brand-primary: #67A8B8; }\n";
  assert.equal(appendThemeOverrides(css, null), css);
});

test("overrides only recognized global tokens and derives RGB companions", () => {
  const css = ":root { --brand-primary: #67A8B8; }";
  const rendered = appendThemeOverrides(css, {
    brandPrimary: "#D0A31B",
    brandSecondary: "#0086A8",
    backgroundPage: "#10191D",
    textPrimary: "#F3F4F4",
  });

  assert.match(rendered, /--brand-primary: #D0A31B;/);
  assert.match(rendered, /--brand-primary-rgb: 208, 163, 27;/);
  assert.match(rendered, /--brand-secondary: #0086A8;/);
  assert.match(rendered, /--brand-secondary-rgb: 0, 134, 168;/);
  assert.match(rendered, /--color-bg-page: #10191D;/);
  assert.match(rendered, /--color-text-primary: #F3F4F4;/);
  assert.doesNotMatch(rendered, /<script/i);
});

test("rejects unsafe values before writing a color into CSS", () => {
  assert.throws(
    () => appendThemeOverrides("", { brandPrimary: "red; } body { display:none" }),
    /cor.*inválida/i,
  );
});
