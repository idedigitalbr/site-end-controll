import assert from "node:assert/strict";
import test from "node:test";

import { resolveCmsTemplatePath } from "../../src/lib/cms/page-content.ts";

const allowed = ["/", "/sobre-nos.html", "/1-solucao-engenharia.html"];

test("accepts only registered original templates and normalizes the home route", () => {
  assert.equal(resolveCmsTemplatePath("/sobre-nos.html", allowed), "/sobre-nos.html");
  assert.equal(resolveCmsTemplatePath("index.html", allowed), "/");
  assert.equal(resolveCmsTemplatePath(null, allowed, "/sobre-nos.html"), "/sobre-nos.html");
});

test("custom routes resolve to the selected original template, not to their own route", () => {
  // Regression: the private preview used the route path as template and returned 404 for custom routes.
  assert.equal(resolveCmsTemplatePath("/", allowed, "/qa-runtime-1.html"), "/");
  assert.equal(resolveCmsTemplatePath("/sobre-nos.html", allowed, "/qa-runtime-1.html"), "/sobre-nos.html");
  assert.equal(resolveCmsTemplatePath("/qa-runtime-1.html", allowed, "/qa-runtime-1.html"), null);
});

test("rejects arbitrary files and traversal attempts as CMS templates", () => {
  assert.equal(resolveCmsTemplatePath("/../../.env", allowed), null);
  assert.equal(resolveCmsTemplatePath("/assets/logo.svg", allowed), null);
  assert.equal(resolveCmsTemplatePath("https://example.com/template.html", allowed), null);
});
