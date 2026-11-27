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

function findElements(
  node: ReactNode,
  predicate: (el: ReactElement<Record<string, unknown>>) => boolean,
): Array<ReactElement<Record<string, unknown>>> {
  if (Array.isArray(node)) return node.flatMap((child) => findElements(child, predicate));
  if (!isValidElement(node)) return [];
  const el = node as ReactElement<Record<string, unknown> & { children?: ReactNode }>;
  const matches = predicate(el) ? [el] : [];
  return [...matches, ...findElements(el.props.children, predicate)];
}

test("converts mutable form attributes, empty media src, and boolean DOM props without React warnings", () => {
  const prepared = prepareLegacyHtmlTemplate(`<!doctype html><html><head><title>Test</title></head><body>
    <input type="range" class="dep-volume-slider" min="0" max="1" step="0.05" value="1" />
    <input type="checkbox" value="yes" checked />
    <input type="hidden" value="tok" />
    <video id="modal-testimonial-video" src="" autoplay playsinline></video>
  </body></html>`);

  const inputs = findElements(prepared.bodyElements, (el) => el.type === "input");
  assert.equal(inputs.length, 3);
  assert.equal(inputs[0].props.defaultValue, "1");
  assert.equal(inputs[0].props.value, undefined);
  assert.equal(inputs[1].props.value, "yes");
  assert.equal(inputs[1].props.defaultChecked, true);
  assert.equal(inputs[1].props.checked, undefined);
  assert.equal(inputs[2].props.value, "tok");

  const videos = findElements(prepared.bodyElements, (el) => el.type === "video");
  assert.equal(videos.length, 1);
  assert.equal(videos[0].props.src, undefined);
  assert.equal(videos[0].props.autoPlay, true);
  assert.equal(videos[0].props.autoplay, undefined);
  assert.equal(videos[0].props.playsInline, true);
});

for (const fileName of ["index.html", "sobre-nos.html"]) {
  test(`${fileName} renders without empty src, lowercase autoplay, or controlled mutable input value`, async () => {
    const markup = await readFile(path.resolve(process.cwd(), fileName), "utf8");
    const prepared = prepareLegacyHtmlTemplate(markup);

    const emptySrcs = findElements(prepared.bodyElements, (el) => el.props.src === "");
    assert.equal(emptySrcs.length, 0);

    const lowercaseAutoplay = findElements(prepared.bodyElements, (el) => "autoplay" in el.props);
    assert.equal(lowercaseAutoplay.length, 0);

    const controlledRanges = findElements(
      prepared.bodyElements,
      (el) => el.type === "input" && el.props.type === "range" && el.props.value !== undefined,
    );
    assert.equal(controlledRanges.length, 0);
  });
}
