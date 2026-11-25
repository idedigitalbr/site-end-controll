import assert from "node:assert/strict";
import test from "node:test";

import { appendPublicSolutionOverrides } from "./page-content.ts";

test("leaves the original homepage bytes unchanged when there are no published solution overrides", () => {
  const markup = "<html><body><p>Conteúdo original</p></body></html>";

  assert.equal(appendPublicSolutionOverrides(markup, {}), markup);
});

test("adds published solution data before the body close and escapes script delimiters", () => {
  const markup = "<html><body><p>Conteúdo original</p></body></html>";
  const rendered = appendPublicSolutionOverrides(markup, {
    "/1-solucao-engenharia-de-integridade-estrutural.html": {
      title: "Estruturas </script><script>alert(1)</script>",
      summary: "Análise & integridade",
      imageUrl: "/media/550e8400-e29b-41d4-a716-446655440000.webp",
      imageAltText: "Cartão da Home",
    },
  });

  assert.ok(rendered.indexOf("id=\"cms-public-solutions\"") < rendered.indexOf("</body>"));
  assert.ok(rendered.includes("Estruturas \\u003c/script>\\u003cscript>alert(1)\\u003c/script>"));
  assert.ok(rendered.includes("Análise & integridade"));
  assert.ok(rendered.includes('"imageUrl":"/media/550e8400-e29b-41d4-a716-446655440000.webp"'));
  assert.ok(rendered.includes('"imageAltText":"Cartão da Home"'));
  assert.equal((rendered.match(/<body>/g) ?? []).length, 1);
});
