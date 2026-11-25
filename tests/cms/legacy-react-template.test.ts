import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { isValidElement, type ReactElement, type ReactNode } from "react";
import { load } from "cheerio";

import { LegacyReactTemplate, prepareLegacyHtmlTemplate } from "../../src/components/public/legacy-react-template";
import { legacyReadyCallbacks } from "../../src/components/public/legacy-script-policy";
import { buildPublicPageJsonLd } from "../../src/lib/cms/public-seo";
import { sitePages } from "../../src/lib/site-inventory";

const executableScriptTypes = new Set([
  "application/ecmascript",
  "application/javascript",
  "module",
  "text/ecmascript",
  "text/javascript",
]);

function sourceExecutableScripts(markup: string) {
  const $ = load(markup);
  return $("script").toArray().flatMap((node) => {
    const type = $(node).attr("type")?.split(";", 1)[0].trim().toLowerCase() ?? "";
    if (type && !executableScriptTypes.has(type)) return [];
    return [{
      attributes: { ...node.attribs },
      content: $(node).contents().toArray().filter((child) => child.type === "text").map((child) => child.data ?? "").join(""),
    }];
  });
}

function renderedScriptTypes(node: ReactNode): string[] {
  if (Array.isArray(node)) return node.flatMap(renderedScriptTypes);
  if (!isValidElement(node)) return [];
  const element = node as ReactElement<{ type?: string; children?: ReactNode }>;
  if (element.type === "script") return [element.props.type ?? ""];
  return renderedScriptTypes(element.props.children);
}

for (const page of sitePages) {
  test(`prepares original React template and SEO metadata for ${page.routePath}`, async () => {
    const fileName = page.routePath === "/" ? "index.html" : page.routePath.replace(/^\/+/, "");
    const markup = await readFile(path.resolve(process.cwd(), fileName), "utf8");
    const prepared = prepareLegacyHtmlTemplate(markup);
    const $ = load(markup);

    assert.ok(prepared.metadata.title, "source title should be available for generated metadata");
    assert.ok(prepared.metadata.description, "source description should be available for generated metadata");
    assert.match(prepared.metadata.canonicalUrl ?? "", /^https?:\/\//, "source canonical should be absolute");
    assert.ok(prepared.metadata.openGraph.title, "Open Graph title should be available");
    assert.ok(prepared.bodyElements.length > 0, "original body elements should be converted to React nodes");
    assert.equal(prepared.bodyClassName, page.routePath === "/" || page.routePath === "/sobre-nos.html" ? "" : "sn-page-wrapper");
    assert.deepEqual(prepared.scripts, sourceExecutableScripts(markup), "all executable head and body scripts should retain their source order and attributes");

    const rendered = LegacyReactTemplate({
      template: prepared,
      pageJsonLd: "{\"@context\":\"https://schema.org\",\"@type\":\"WebPage\"}",
      scriptKey: page.routePath,
    });
    const renderedTypes = renderedScriptTypes(rendered);
    const payloadTypes = $("script").toArray().flatMap((node) => {
      const type = $(node).attr("type")?.split(";", 1)[0].trim().toLowerCase() ?? "";
      return type && !executableScriptTypes.has(type) ? [type] : [];
    });
    assert.deepEqual(
      renderedTypes.filter((type) => type !== "application/ld+json"),
      payloadTypes.filter((type) => type !== "application/ld+json"),
      "JSON payload scripts should stay server-rendered",
    );
    const bodyJsonLdCount = $("body script[type='application/ld+json']").length;
    assert.equal(renderedTypes.filter((type) => type === "application/ld+json").length, prepared.jsonLd.length + bodyJsonLdCount + 1);
    assert.ok(renderedTypes.every((type) => !executableScriptTypes.has(type)), "executable scripts must not be in the hydration tree");

    const canonicalUrl = `https://endcontrol.example${page.routePath === "/" ? "/index.html" : page.routePath}`;
    const jsonLd = buildPublicPageJsonLd(page.routePath, prepared.metadata.title!, prepared.metadata.description, canonicalUrl, "https://endcontrol.example/");
    assert.ok(jsonLd, "published CMS routes should get generated WebPage JSON-LD");
    assert.equal(JSON.parse(jsonLd).url, canonicalUrl);
  });
}

test("post-hydration adaptation recognizes document and window readiness handlers only", () => {
  assert.deepEqual(legacyReadyCallbacks("document.addEventListener('DOMContentLoaded', initialize);"), [
    { target: "document", event: "DOMContentLoaded" },
  ]);
  assert.deepEqual(legacyReadyCallbacks('window.addEventListener("DOMContentLoaded", initialize);'), [
    { target: "window", event: "DOMContentLoaded" },
  ]);
  assert.deepEqual(legacyReadyCallbacks("window.addEventListener('load', initialize);"), [
    { target: "window", event: "load" },
  ]);
  assert.deepEqual(legacyReadyCallbacks("document.addEventListener('click', initialize);"), []);
});

test("allowlisted service template exposes both source readiness targets to the loader", async () => {
  const markup = await readFile("1-solucao-engenharia-de-integridade-estrutural.html", "utf8");
  const prepared = prepareLegacyHtmlTemplate(markup);
  const callbacks = prepared.scripts.flatMap((script) => legacyReadyCallbacks(script.content));

  assert.ok(callbacks.some((callback) => callback.target === "window" && callback.event === "DOMContentLoaded"));
  assert.ok(callbacks.some((callback) => callback.target === "document" && callback.event === "DOMContentLoaded"));
});
