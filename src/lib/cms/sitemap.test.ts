import assert from "node:assert/strict";
import test from "node:test";

import { renderCmsSitemap } from "./sitemap.ts";

const original = `<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://idedigitalbr.github.io/site-end-controll/index.html</loc></url>
  <url><loc>https://idedigitalbr.github.io/site-end-controll/sobre-nos.html</loc></url>
</urlset>`;

test("rewrites legacy entries to the configured site URL and adds new published pages", () => {
  const rendered = renderCmsSitemap(original, "https://endcontrol.example", [
    { routePath: "/sobre-nos.html" },
    { routePath: "/nova-solucao.html", publishedAt: new Date("2026-11-03T14:30:00.000Z") },
  ]);

  assert.equal((rendered.match(/<loc>/g) ?? []).length, 3);
  assert.match(rendered, /https:\/\/endcontrol\.example\/index\.html/);
  assert.match(rendered, /https:\/\/endcontrol\.example\/sobre-nos\.html/);
  assert.match(rendered, /https:\/\/endcontrol\.example\/nova-solucao\.html/);
  assert.match(rendered, /<lastmod>2026-11-03<\/lastmod>/);
});

test("does not add duplicate pages or unsafe routes", () => {
  const rendered = renderCmsSitemap(original, "http://127.0.0.1:3000", [
    { routePath: "/sobre-nos.html" },
    { routePath: "/../secrets.html" },
    { routePath: "/nested/page.html" },
  ]);

  assert.equal((rendered.match(/<loc>/g) ?? []).length, 2);
  assert.doesNotMatch(rendered, /secrets|nested/);
});
