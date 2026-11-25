import assert from "node:assert/strict";
import test from "node:test";

import { routePathFromLegacyRequest } from "../../src/lib/cms/page-content.ts";

test("maps legacy HTML file requests to CMS route paths", () => {
  assert.equal(routePathFromLegacyRequest("index.html"), "/");
  assert.equal(routePathFromLegacyRequest("sobre-nos.html"), "/sobre-nos.html");
});

test("does not treat assets or unsafe paths as CMS pages", () => {
  assert.equal(routePathFromLegacyRequest("src/css/tokens.css"), null);
  assert.equal(routePathFromLegacyRequest("assets/logo.png"), null);
  assert.equal(routePathFromLegacyRequest("../index.html"), null);
  assert.equal(routePathFromLegacyRequest("foo/bar.html"), null);
});
