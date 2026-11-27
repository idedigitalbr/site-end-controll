import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { load } from "cheerio";

import {
  extractDraftDiffs,
  hydrateDraftOverrides,
} from "../../src/components/public/inline-editor/inline-editor-dom.ts";
import { sitePages } from "../../src/lib/site-inventory.ts";
import {
  checkRateLimit,
  JsonBodyLimitError,
  readBoundedJsonBody,
  validateSameOriginRequest,
} from "../../src/lib/cms/inline-editor-security.ts";
import {
  HOME_SOLUTIONS_FIELD_KEY,
  applyContentPatches,
  applyContentPatchesWithInlineAnnotations,
  editableFieldsForRoute,
  extractEditableFields,
  hydrateEditableFields,
  normalizePageContentPatches,
  sanitizeRichTextHtml,
} from "../../src/lib/cms/page-content.ts";

const sampleHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head><title>Teste</title></head>
<body>
  <header class="site-header"><nav class="main-menu"><a href="/sobre-nos.html">Sobre</a></nav></header>
  <main>
    <section id="sec-a" style="background: #071324 url('./assets/bg.webp') center / cover no-repeat">
      <h1 class="hero-title">Título <span>Principal</span></h1>
      <p class="hero-copy">Texto inicial</p>
      <a class="cta" href="/contato">Fale conosco</a>
      <img class="hero-img" src="./assets/foto.webp" alt="Foto inicial" />
    </section>
    <section id="sec-b">
      <h2>Segunda seção</h2>
    </section>
  </main>
  <footer><div class="footer-phone-number">(11) 99999-0000</div></footer>
</body>
</html>`;

test("applyContentPatchesWithInlineAnnotations annotates text, images, links, backgrounds, sections, and shortcuts", () => {
  const { markup, fields } = applyContentPatchesWithInlineAnnotations(sampleHtml, [], "/");
  const $ = load(markup);

  assert.equal($("header.site-header").attr("data-ec-shortcut"), undefined);
  assert.equal($("header.site-header").attr("data-ec-nav-inline"), "true");
  assert.equal($("footer").attr("data-ec-shortcut"), undefined);
  assert.equal($("header nav a").attr("data-ec-managed"), "navigation");
  assert.equal($("footer .footer-phone-number").attr("data-ec-managed"), undefined);
  assert.equal($("footer .footer-phone-number").attr("data-ec-global-text"), "phoneLabel");

  const titleEl = $("h1.hero-title");
  const titleAttr = titleEl.attr("data-ec-text-fields");
  assert.ok(titleAttr, "expected h1 to carry data-ec-text-fields");
  assert.equal(JSON.parse(titleAttr).length, 1);

  assert.ok($("p.hero-copy").attr("data-ec-text-fields"));
  assert.ok($("a.cta").attr("data-ec-link-key"));
  assert.ok($("a.cta").attr("data-ec-text-fields"));
  assert.ok($("img.hero-img").attr("data-ec-image-key"));
  assert.ok($("#sec-a").attr("data-ec-bg-key"));
  assert.ok($("main").attr("data-ec-section-parent"));
  assert.ok($("#sec-a").attr("data-ec-section-item"));
  assert.ok($("#sec-b").attr("data-ec-section-item"));
  assert.ok(fields.length > 0);
});

test("sectionOrder reordering preserves original data-ec-* annotations on moved sections", () => {
  const fields = extractEditableFields(sampleHtml);
  const orderField = fields.find((f) => f.kind === "sectionOrder");
  assert.ok(orderField && orderField.kind === "sectionOrder");
  const reversed = [...orderField.value].reverse();

  const { markup } = applyContentPatchesWithInlineAnnotations(sampleHtml, [
    { key: orderField.key, kind: "sectionOrder", value: reversed },
  ]);
  const $ = load(markup);
  const sections = $("main > section");
  assert.equal(sections.eq(0).attr("id"), "sec-b");
  assert.equal(sections.eq(1).attr("id"), "sec-a");
  assert.ok(sections.eq(1).find("p.hero-copy").attr("data-ec-text-fields"));
  assert.ok(sections.eq(1).find("img.hero-img").attr("data-ec-image-key"));
});

test("anonymous applyContentPatches emits zero data-ec-* attributes", () => {
  const fields = extractEditableFields(sampleHtml);
  const textField = fields.find((f) => f.kind === "text" && f.value.trim() === "Texto inicial");
  assert.ok(textField);
  const rendered = applyContentPatches(sampleHtml, [
    { key: textField.key, kind: "text", value: "Texto alterado" },
  ]);
  assert.equal(/data-ec-/i.test(rendered), false);
});

test("validateSameOriginRequest rejects cross-origin, Sec-Fetch-Site cross-site, and untrusted forwarded host spoofing", () => {
  const sameOriginReq = new Request("https://endcontrol.local/api/admin/inline-editor/publish", {
    method: "POST",
    headers: {
      origin: "https://endcontrol.local",
      host: "endcontrol.local",
      "sec-fetch-site": "same-origin",
    },
  });
  assert.equal(validateSameOriginRequest(sameOriginReq).allowed, true);

  const secFetchCrossSite = new Request("https://endcontrol.local/api/admin/inline-editor/publish", {
    method: "POST",
    headers: {
      origin: "https://endcontrol.local",
      host: "endcontrol.local",
      "sec-fetch-site": "cross-site",
    },
  });
  assert.equal(validateSameOriginRequest(secFetchCrossSite).allowed, false);

  const loopbackForwardedReq = new Request("http://127.0.0.1:3000/api/admin/inline-editor/publish", {
    method: "POST",
    headers: {
      origin: "https://endcontrol.suporteide.digital",
      host: "127.0.0.1:3000",
      "x-forwarded-host": "endcontrol.suporteide.digital",
      "x-forwarded-proto": "https",
    },
  });
  assert.equal(validateSameOriginRequest(loopbackForwardedReq).allowed, true);

  const spoofedForwardedReq = new Request("https://endcontrol.local/api/admin/inline-editor/publish", {
    method: "POST",
    headers: {
      origin: "https://attacker.example",
      host: "endcontrol.local",
      "x-forwarded-host": "attacker.example",
      "x-forwarded-proto": "https",
    },
  });
  assert.equal(validateSameOriginRequest(spoofedForwardedReq).allowed, false);

  const crossOriginReq = new Request("https://endcontrol.local/api/admin/inline-editor/publish", {
    method: "POST",
    headers: {
      origin: "https://evil.example",
      host: "endcontrol.local",
    },
  });
  assert.equal(validateSameOriginRequest(crossOriginReq).allowed, false);

  const missingOriginReq = new Request("https://endcontrol.local/api/admin/inline-editor/publish", {
    method: "POST",
    headers: { host: "endcontrol.local" },
  });
  assert.equal(validateSameOriginRequest(missingOriginReq).allowed, false);
});

test("readBoundedJsonBody enforces byte limits via Content-Length and streaming", async () => {
  const validReq = new Request("https://endcontrol.local/api/test", {
    method: "POST",
    body: JSON.stringify({ ok: true }),
    headers: { "content-type": "application/json" },
  });
  assert.deepEqual(await readBoundedJsonBody(validReq, 1024), { ok: true });

  const headerTooBig = new Request("https://endcontrol.local/api/test", {
    method: "POST",
    body: JSON.stringify({ a: "123" }),
    headers: { "content-length": "5000" },
  });
  await assert.rejects(() => readBoundedJsonBody(headerTooBig, 100), JsonBodyLimitError);

  const streamTooBig = new Request("https://endcontrol.local/api/test", {
    method: "POST",
    body: JSON.stringify({ data: "x".repeat(250) }),
  });
  await assert.rejects(() => readBoundedJsonBody(streamTooBig, 100), JsonBodyLimitError);
});

test("checkRateLimit allows requests up to threshold and blocks excess", () => {
  const key = `test-rl-${Date.now()}`;
  const t0 = 1_000_000;
  assert.equal(checkRateLimit(key, 2, 10_000, t0).allowed, true);
  assert.equal(checkRateLimit(key, 2, 10_000, t0 + 100).allowed, true);
  const blocked = checkRateLimit(key, 2, 10_000, t0 + 200);
  assert.equal(blocked.allowed, false);
  assert.ok(blocked.retryAfterSeconds >= 1);
  assert.equal(checkRateLimit(key, 2, 10_000, t0 + 10_500).allowed, true);
});

test("extractDraftDiffs and hydrateDraftOverrides sanitize tampered drafts and retain valid edits", () => {
  const baseFields = extractEditableFields(sampleHtml);
  const textField = baseFields.find((f) => f.kind === "text" && f.value.trim() === "Texto inicial");
  const linkField = baseFields.find((f) => f.kind === "link");
  const imageField = baseFields.find((f) => f.kind === "image");
  const bgField = baseFields.find((f) => f.kind === "backgroundImage");
  const orderField = baseFields.find((f) => f.kind === "sectionOrder");
  assert.ok(textField && linkField && imageField && bgField && orderField);

  const validUuidUrl = "/media/11111111-1111-4111-8111-111111111111.webp";
  const modifiedFields = baseFields.map((f) => {
    if (f.kind === "text" && f.key === textField.key) return { ...f, value: "Texto editado\u0000" };
    if (f.kind === "image" && f.key === imageField.key) {
      return { ...f, value: validUuidUrl, altText: "Nova foto" };
    }
    return f;
  });

  const diffs = extractDraftDiffs(baseFields, modifiedFields);
  assert.equal(Object.keys(diffs).length, 2);

  // Inject malicious payloads alongside valid diffs
  const maliciousPayload = {
    ...diffs,
    [linkField.key]: { value: "javascript:alert(1)" },
    [bgField.key]: { value: "https://evil.example/payload.png" },
    [orderField.key]: { value: ["#not-real"] },
  };

  const hydrated = hydrateDraftOverrides(baseFields, maliciousPayload);
  assert.equal(hydrated.appliedCount, 2);
  const byKey = new Map(hydrated.fields.map((f) => [f.key, f]));
  assert.equal((byKey.get(textField.key) as { value: string }).value, "Texto editado");
  assert.equal((byKey.get(imageField.key) as { value: string }).value, validUuidUrl);
  assert.equal((byKey.get(linkField.key) as { value: string }).value, linkField.value);
  assert.equal((byKey.get(bgField.key) as { value: string }).value, bgField.value);
  assert.deepEqual((byKey.get(orderField.key) as { value: string[] }).value, orderField.value);
});

test("Home and Solution 1 templates expose indicators/clients annotations without home-services shortcut or client image overlays", async () => {
  const homeMarkup = await readFile("index.html", "utf8");
  assert.ok(homeMarkup);
  const homeAnnotated = applyContentPatchesWithInlineAnnotations(homeMarkup, [], "/");
  const $home = load(homeAnnotated.markup);

  assert.equal($home(".solucoes-main-content").attr("data-ec-shortcut"), undefined);
  assert.ok($home(".solucoes-heading").attr("data-ec-text-fields"));
  assert.equal($home("#heroBenefitsBar").attr("data-ec-indicators-key"), "cms:home-indicators");
  assert.equal($home("#heroBenefitsBar [data-ec-text-fields]").length, 0);
  assert.equal($home("#clientes .logo-marquee").attr("data-ec-clients-key"), "cms:home-client-logos");
  assert.equal($home("#clientes .logo-marquee img[data-ec-image-key]").length, 0);
  assert.equal($home("footer").attr("data-ec-shortcut"), undefined);
  assert.equal($home("footer .footer-phone-number").attr("data-ec-global-text"), "phoneLabel");
  assert.equal($home(".endo-acc-panel img").first().attr("data-ec-editor-photo-locked"), "true");

  const svc1Markup = await readFile("1-solucao-engenharia-de-integridade-estrutural.html", "utf8");
  assert.ok(svc1Markup);
  const svc1Annotated = applyContentPatchesWithInlineAnnotations(
    svc1Markup,
    [],
    "/1-solucao-engenharia-de-integridade-estrutural.html",
  );
  const $svc1 = load(svc1Annotated.markup);
  assert.equal($svc1(".ffs-mechanisms-grid").attr("data-ec-shortcut"), undefined);
  assert.ok($svc1(".ffs-mechanisms-grid").attr("data-ec-cardlist-key"));
  assert.ok($svc1(".ffs-mechanisms-grid [data-ec-card-slot-fields]").length > 0);
});

test("hydrateEditableFields ignores legacy Preview Design System patches on .legal-preview and keeps Login", async () => {
  const homeMarkup = await readFile("index.html", "utf8");
  const fields = editableFieldsForRoute(homeMarkup, "/");
  const legalText = fields.find(
    (f) => f.kind === "text" && f.value.trim() === "Login" && f.selector.includes("a"),
  );
  const legalLink = fields.find(
    (f) => f.kind === "link" && f.originalValue === "/login",
  );
  assert.ok(legalText && legalText.kind === "text");

  const hydrated = hydrateEditableFields(
    homeMarkup,
    [
      { key: legalText.key, kind: "text", value: "Preview Design System" },
      ...(legalLink ? [{ key: legalLink.key, kind: "link" as const, value: "preview-design-system.html" }] : []),
    ],
    "/",
  );
  const hydratedText = hydrated.find((f) => f.key === legalText.key);
  assert.equal(hydratedText?.kind === "text" ? hydratedText.value.trim() : "", "Login");
});

test("cms:home-indicators and cms:home-client-logos validate, persist, and reject unsafe input", async () => {
  const homeMarkup = await readFile("index.html", "utf8");
  const fields = editableFieldsForRoute(homeMarkup, "/");
  const indicatorsField = fields.find((f) => f.kind === "indicators");
  const clientsField = fields.find((f) => f.kind === "clientLogos");
  assert.ok(indicatorsField && indicatorsField.kind === "indicators");
  assert.ok(clientsField && clientsField.kind === "clientLogos");
  assert.equal(indicatorsField.value.length, 8);
  assert.equal(clientsField.value.length, 15);

  const newLogoUrl = "/media/22222222-2222-4222-8222-222222222222.png";
  const nextIndicators = [...indicatorsField.value.slice(0, 2), { value: "+500", label: "inspeções" }];
  const nextClients = [...clientsField.value.slice(0, 2), { src: newLogoUrl, alt: "Novo Cliente" }];

  const patches = normalizePageContentPatches(
    [
      { key: indicatorsField.key, kind: "indicators", value: nextIndicators },
      { key: clientsField.key, kind: "clientLogos", value: nextClients },
    ],
    fields,
  );
  const patchedHtml = applyContentPatches(homeMarkup, patches, "/");
  const $ = load(patchedHtml);
  assert.deepEqual(JSON.parse($("#heroBenefitsBar").attr("data-cms-indicators") ?? "[]"), nextIndicators);
  assert.equal($("#clientes .logo-marquee .logo-marquee__track").eq(0).find("img").length, 3);
  assert.equal($("#clientes .logo-marquee .logo-marquee__track").eq(1).find("img").length, 3);
  assert.equal(
    $("#clientes .logo-marquee .logo-marquee__track").eq(0).find("img").eq(2).attr("src"),
    newLogoUrl,
  );

  // Reject HTML brackets in indicators and external URLs in clientLogos
  assert.throws(() =>
    normalizePageContentPatches(
      [{ key: indicatorsField.key, kind: "indicators", value: [{ value: "<script>", label: "x" }] }],
      fields,
    ),
  );
  assert.throws(() =>
    normalizePageContentPatches(
      [{ key: clientsField.key, kind: "clientLogos", value: [{ src: "https://evil.example/a.png", alt: "x" }] }],
      fields,
    ),
  );

  // Draft diff & hydration checks for indicators and clientLogos
  const modified = fields.map((f) => {
    if (f.kind === "indicators") return { ...f, value: nextIndicators };
    if (f.kind === "clientLogos") return { ...f, value: nextClients };
    return f;
  });
  const diffs = extractDraftDiffs(fields, modified);
  const hydrated = hydrateDraftOverrides(fields, {
    ...diffs,
    [clientsField.key]: { value: [{ src: "https://evil.example/x.png", alt: "bad" }] },
  });
  const hydratedByKey = new Map(hydrated.fields.map((f) => [f.key, f]));
  assert.deepEqual((hydratedByKey.get(indicatorsField.key) as { value: unknown }).value, nextIndicators);
  assert.deepEqual(
    (hydratedByKey.get(clientsField.key) as { value: unknown }).value,
    clientsField.value,
  );

  const imageField = fields.find((f) => f.kind === "image" && !f.editorPhotoLocked);
  if (imageField && imageField.kind === "image") {
    const posPatched = applyContentPatches(
      homeMarkup,
      [
        {
          key: imageField.key,
          kind: "image",
          value: imageField.originalValue,
          altText: imageField.altText,
          objectPosition: "25% 75%",
        },
      ],
      "/",
    );
    const $pos = load(posPatched);
    assert.match($pos(imageField.selector).attr("style") ?? "", /object-position:\s*25% 75%/i);
  }
});

test("all auto-advancing carousels and radars pause timers when ecIeEditing is true", async () => {
  const carouselFiles = [
    "src/js/solucoes.js",
    "src/js/solucoes-integridade.js",
    "src/js/solution-gallery.js",
    "src/js/main.js",
    "src/js/presenca-nacional.js",
    "src/js/radar-ffs.js",
    "index.html",
  ];

  for (const filePath of carouselFiles) {
    const source = await readFile(filePath, "utf8");
    assert.match(
      source,
      /dataset\.ecIeEditing\s*===\s*['"]true['"]/,
      `Expected ${filePath} to check document.documentElement.dataset.ecIeEditing`,
    );
  }

  for (const scriptFile of carouselFiles.slice(0, 6)) {
    const source = await readFile(scriptFile, "utf8");
    assert.match(
      source,
      /attributeFilter:\s*\[\s*['"]data-ec-ie-editing['"]\s*\]/,
      `Expected ${scriptFile} to observe data-ec-ie-editing changes with MutationObserver`,
    );
  }

  const solucoesSrc = await readFile("src/js/solucoes.js", "utf8");
  assert.match(solucoesSrc, /syncEditablePrimarySlide/);
  assert.match(solucoesSrc, /cardImage\.style\.objectPosition/);

  const cssSrc = await readFile("src/components/public/inline-editor/inline-editor.css", "utf8");
  assert.match(cssSrc, /sectors-marquee-track[\s\S]*animation-play-state:\s*paused/);
});

test("cms:about-director-cards extracts, annotates, edits, adds, removes, and validates director media cards", async () => {
  const aboutMarkup = await readFile("sobre-nos.html", "utf8");
  const fields = editableFieldsForRoute(aboutMarkup, "/sobre-nos.html");
  const directorsField = fields.find((f) => f.kind === "directorCards");
  assert.ok(directorsField && directorsField.kind === "directorCards");
  assert.equal(directorsField.key, "cms:about-director-cards");
  assert.equal(directorsField.value.length, 2);
  assert.equal(directorsField.value[0]?.name, "Carlos Eduardo");
  assert.equal(directorsField.value[0]?.mediaType, "video");
  assert.equal(directorsField.value[1]?.name, "Marcus Oliveira");

  // Annotations: container has data-ec-directors-key, and inner card texts/images are not individually annotated
  const annotated = applyContentPatchesWithInlineAnnotations(aboutMarkup, [], "/sobre-nos.html");
  const $ann = load(annotated.markup);
  assert.equal(
    $ann("#sobre-2 .about-media-dual-videos").attr("data-ec-directors-key"),
    "cms:about-director-cards",
  );
  assert.equal($ann("#sobre-2 .about-media-dual-videos [data-ec-text-fields]").length, 0);
  assert.equal($ann("#sobre-2 .about-media-dual-videos [data-ec-richtext-key]").length, 0);

  // Edit existing video, add a 3rd image card -> public HTML output has zero data-ec-* attributes
  const newVideoUrl = "/media/33333333-3333-4333-8333-333333333333.mp4";
  const newPosterUrl = "/media/44444444-4444-4444-8444-444444444444.webp";
  const newPhotoUrl = "/media/55555555-5555-4555-8555-555555555555.jpg";
  const updatedCards = [
    {
      mediaType: "video" as const,
      src: newVideoUrl,
      poster: newPosterUrl,
      name: "Carlos Silva",
      role: "Diretor Executivo",
      duration: "00:22",
    },
    directorsField.value[1],
    {
      mediaType: "image" as const,
      src: newPhotoUrl,
      name: "Equipe Técnica",
      role: "Engenharia de Campo",
    },
  ];

  const multiHtml = applyContentPatches(
    aboutMarkup,
    [{ key: directorsField.key, kind: "directorCards", value: updatedCards }],
    "/sobre-nos.html",
  );
  assert.equal(/data-ec-/i.test(multiHtml), false);
  const $multi = load(multiHtml);
  const dual = $multi("#sobre-2 .about-media-dual-videos");
  assert.equal(dual.attr("data-card-count"), "3");
  assert.equal(dual.attr("data-card-count-multi"), "true");
  assert.equal(dual.children(".dep-video-card").length, 3);
  assert.equal(dual.children(".dep-video-card").eq(0).find("video.dep-video").attr("src"), newVideoUrl);
  assert.equal(dual.children(".dep-video-card").eq(0).find("video.dep-video").attr("poster"), newPosterUrl);
  assert.equal(dual.children(".dep-video-card").eq(0).find(".dep-tag-name").text(), "Carlos Silva");
  assert.equal(dual.children(".dep-video-card").eq(0).find(".dep-tag-role").text(), "Diretor Executivo");
  assert.equal(dual.children(".dep-video-card").eq(0).find(".dep-tag-duration").text(), "00:22");
  assert.equal(dual.children(".dep-video-card").eq(2).hasClass("dep-image-card"), true);
  assert.equal(dual.children(".dep-video-card").eq(2).find("img.dep-card-image").attr("src"), newPhotoUrl);

  // Removing down to 1 card sets data-card-count="1" without data-card-count-multi
  const singleHtml = applyContentPatches(
    aboutMarkup,
    [{ key: directorsField.key, kind: "directorCards", value: [updatedCards[2]] }],
    "/sobre-nos.html",
  );
  const $single = load(singleHtml);
  assert.equal($single("#sobre-2 .about-media-dual-videos").attr("data-card-count"), "1");
  assert.equal($single("#sobre-2 .about-media-dual-videos").attr("data-card-count-multi"), undefined);

  // Validation rejects external URLs, mismatched media types, empty/oversized lists, and HTML brackets
  assert.throws(() =>
    normalizePageContentPatches(
      [{ key: directorsField.key, kind: "directorCards", value: [] }],
      fields,
    ),
  );
  assert.throws(() =>
    normalizePageContentPatches(
      [
        {
          key: directorsField.key,
          kind: "directorCards",
          value: Array.from({ length: 9 }, () => updatedCards[2]),
        },
      ],
      fields,
    ),
  );
  assert.throws(() =>
    normalizePageContentPatches(
      [
        {
          key: directorsField.key,
          kind: "directorCards",
          value: [{ mediaType: "video", src: "https://evil.example/a.mp4", name: "Teste", role: "" }],
        },
      ],
      fields,
    ),
  );
  assert.throws(() =>
    normalizePageContentPatches(
      [
        {
          key: directorsField.key,
          kind: "directorCards",
          value: [{ mediaType: "video", src: newPhotoUrl, name: "Teste", role: "" }],
        },
      ],
      fields,
    ),
  );
  assert.throws(() =>
    normalizePageContentPatches(
      [
        {
          key: directorsField.key,
          kind: "directorCards",
          value: [{ mediaType: "image", src: newVideoUrl, name: "Teste", role: "" }],
        },
      ],
      fields,
    ),
  );
  assert.throws(() =>
    normalizePageContentPatches(
      [
        {
          key: directorsField.key,
          kind: "directorCards",
          value: [{ mediaType: "image", src: newPhotoUrl, name: "<script>", role: "" }],
        },
      ],
      fields,
    ),
  );

  // Draft diff & hydration roundtrip
  const modifiedFields = fields.map((f) =>
    f.kind === "directorCards" ? { ...f, value: updatedCards } : f,
  );
  const diffs = extractDraftDiffs(fields, modifiedFields);
  assert.ok(diffs[directorsField.key]);
  const hydrated = hydrateDraftOverrides(fields, diffs);
  const hydratedDir = hydrated.fields.find((f) => f.key === directorsField.key);
  assert.deepEqual(hydratedDir?.kind === "directorCards" ? hydratedDir.value : [], updatedCards);

  const tampered = hydrateDraftOverrides(fields, {
    [directorsField.key]: {
      value: [{ mediaType: "video", src: "https://evil.example/x.mp4", name: "Bad", role: "" }],
    },
  });
  const tamperedDir = tampered.fields.find((f) => f.key === directorsField.key);
  assert.deepEqual(
    tamperedDir?.kind === "directorCards" ? tamperedDir.value : [],
    directorsField.value,
  );
});

test("sanitizeRichTextHtml preserves allowed inline formatting and strips unsafe markup", () => {
  assert.equal(
    sanitizeRichTextHtml('Soluções <b>rápidas</b> <i>e</i> <u>seguras</u><br><span class="ec-accent-primary evil-cls" onclick="alert(1)">destaque</span>'),
    'Soluções <strong>rápidas</strong> <em>e</em> <u>seguras</u><br><span class="ec-accent-primary">destaque</span>',
  );
  assert.equal(
    sanitizeRichTextHtml('<span style="color: rgb(0, 172, 228); background: url(javascript:alert(1))">ciano</span>'),
    '<span style="color: #00ace4">ciano</span>',
  );
  assert.equal(
    sanitizeRichTextHtml('Texto <script>alert(1)</script><img src=x onerror=alert(1)> limpo'),
    "Texto  limpo",
  );
});

test("richText roundtrip on Home heading updates formatted markup while leaving untouched HTML identical", async () => {
  const homeMarkup = await readFile("index.html", "utf8");
  const fields = editableFieldsForRoute(homeMarkup, "/");
  const headingField = fields.find(
    (f) => f.kind === "richText" && f.value.includes("Soluções") && f.value.includes("integradas"),
  );
  assert.ok(headingField && headingField.kind === "richText");

  const nextHtml = 'Soluções <span class="ec-accent-primary">personalizadas</span> <strong>agora</strong>.';
  const patches = normalizePageContentPatches(
    [{ key: headingField.key, kind: "richText", value: nextHtml }],
    fields,
  );
  const patched = applyContentPatches(homeMarkup, patches, "/");
  const $ = load(patched);
  assert.equal($(".solucoes-heading").html()?.trim(), nextHtml);

  const annotated = applyContentPatchesWithInlineAnnotations(homeMarkup, patches, "/");
  const $ann = load(annotated.markup);
  assert.equal($ann(".solucoes-heading").attr("data-ec-richtext-key"), headingField.key);
  assert.ok($ann(".solucoes-heading").attr("data-ec-text-fields"));
});

test("cms:home-solutions-cards supports editing all 12 solutions, icon topics, photo, and objectPosition", async () => {
  const homeMarkup = await readFile("index.html", "utf8");
  const annotated = applyContentPatchesWithInlineAnnotations(homeMarkup, [], "/");
  const $ann = load(annotated.markup);

  assert.equal($ann("#highlightCard").attr("data-ec-solutions-key"), HOME_SOLUTIONS_FIELD_KEY);
  assert.equal($ann("#highlightCard [data-ec-image-key]").length, 0);
  assert.equal($ann("#highlightCard [data-ec-text-fields]").length, 0);

  const fields = editableFieldsForRoute(homeMarkup, "/");
  const solField = fields.find((f) => f.kind === "homeSolutions");
  assert.ok(solField && solField.kind === "homeSolutions");
  assert.equal(solField.value.length, 12);
  assert.equal(solField.value[1].topics.length, 4);

  const customPhoto = "/media/33333333-3333-4333-8333-333333333333.webp";
  const nextCards = solField.value.map((card, idx) =>
    idx === 1
      ? {
          ...card,
          title: "Obras de Arte Editada",
          topics: ["Item editado 1", "Item editado 2", "Novo item 3"],
          image: customPhoto,
          objectPosition: "30% 70%",
        }
      : card,
  );

  const patches = normalizePageContentPatches(
    [{ key: solField.key, kind: "homeSolutions", value: nextCards }],
    fields,
  );
  const patched = applyContentPatches(homeMarkup, patches, "/");
  const $ = load(patched);
  const saved = JSON.parse($("#highlightCard").attr("data-cms-solutions-cards") ?? "[]");
  assert.equal(saved.length, 12);
  assert.equal(saved[1].title, "Obras de Arte Editada");
  assert.deepEqual(saved[1].topics, ["Item editado 1", "Item editado 2", "Novo item 3"]);
  assert.equal(saved[1].image, customPhoto);
  assert.equal(saved[1].objectPosition, "30% 70%");

  assert.throws(() =>
    normalizePageContentPatches(
      [
        {
          key: solField.key,
          kind: "homeSolutions",
          value: solField.value.map((card, idx) =>
            idx === 0 ? { ...card, image: "https://evil.example/a.png" } : card,
          ),
        },
      ],
      fields,
    ),
  );
  assert.throws(() =>
    normalizePageContentPatches(
      [
        {
          key: solField.key,
          kind: "homeSolutions",
          value: solField.value.map((card, idx) =>
            idx === 0 ? { ...card, topics: ["<script>alert(1)</script>"] } : card,
          ),
        },
      ],
      fields,
    ),
  );

  const modified = fields.map((f) =>
    f.kind === "homeSolutions" ? { ...f, value: nextCards } : f,
  );
  const diffs = extractDraftDiffs(fields, modified);
  const hydrated = hydrateEditableFields(homeMarkup, patches, "/");
  const hydratedSol = hydrated.find((f) => f.kind === "homeSolutions");
  assert.ok(hydratedSol && hydratedSol.kind === "homeSolutions");
  assert.equal(hydratedSol.value[1].title, "Obras de Arte Editada");
  assert.ok(diffs[HOME_SOLUTIONS_FIELD_KEY]);
});

test("cardList supports inline text editing, reordering, duplicating, deleting, connectors, and preserves non-item siblings", async () => {
  const ffsMarkup = await readFile("1-solucao-engenharia-de-integridade-estrutural.html", "utf8");
  const ffsFields = editableFieldsForRoute(ffsMarkup, "/1-solucao-engenharia-de-integridade-estrutural.html");
  const ffsCardList = ffsFields.find((f) => f.kind === "cardList" && f.itemSelector === "article.ffs-mechanism-card");
  assert.ok(ffsCardList && ffsCardList.kind === "cardList");
  const originalFfsCount = ffsCardList.value.length;
  assert.ok(originalFfsCount >= 4);

  // Reorder (swap 0 and 1), edit text with <script> payload (must escape as text), duplicate item 0, delete last item
  const reordered = [
    {
      ...ffsCardList.value[1],
      texts: ["<script>alert(1)</script> Mecanismo Editado", ...ffsCardList.value[1].texts.slice(1)],
    },
    ffsCardList.value[0],
    {
      ...ffsCardList.value[0],
      id: `${ffsCardList.value[0].id}-clone-1`,
      sourceIndex: ffsCardList.value[0].sourceIndex,
      texts: ["Cópia Duplicada", ...ffsCardList.value[0].texts.slice(1)],
    },
    ...ffsCardList.value.slice(2, -1),
  ];

  const ffsNormalized = normalizePageContentPatches(
    [{ key: ffsCardList.key, kind: "cardList", value: reordered }],
    ffsFields,
  );
  const ffsPatched = applyContentPatches(
    ffsMarkup,
    ffsNormalized,
    "/1-solucao-engenharia-de-integridade-estrutural.html",
  );
  const $ffs = load(ffsPatched);
  assert.equal($ffs(".ffs-mechanisms-grid").attr("data-cms-cardlist-custom"), "true");
  assert.equal($ffs(".ffs-mechanisms-grid > article").length, originalFfsCount);
  assert.ok($ffs(".ffs-mechanisms-grid > article").eq(0).text().includes("<script>alert(1)</script> Mecanismo Editado"));
  assert.equal($ffs(".ffs-mechanisms-grid script").length, 0);
  assert.ok($ffs(".ffs-mechanisms-grid > article").eq(2).text().includes("Cópia Duplicada"));

  // Draft roundtrip for cardList
  const ffsModified = ffsFields.map((f) =>
    f.kind === "cardList" && f.key === ffsCardList.key ? { ...f, value: reordered } : f,
  );
  const ffsDiffs = extractDraftDiffs(ffsFields, ffsModified);
  assert.ok(ffsDiffs[ffsCardList.key]);
  const ffsRestored = hydrateDraftOverrides(ffsFields, ffsDiffs);
  const restoredField = ffsRestored.fields.find((f) => f.key === ffsCardList.key);
  assert.ok(restoredField && restoredField.kind === "cardList");
  assert.equal(restoredField.value[2].texts[0], "Cópia Duplicada");

  // Validation rejections
  assert.throws(() =>
    normalizePageContentPatches([{ key: ffsCardList.key, kind: "cardList", value: [] }], ffsFields),
  );
  assert.throws(() =>
    normalizePageContentPatches(
      [{ key: ffsCardList.key, kind: "cardList", value: [{ ...ffsCardList.value[0], sourceIndex: 999 }] }],
      ffsFields,
    ),
  );
  assert.throws(() =>
    normalizePageContentPatches(
      [{ key: ffsCardList.key, kind: "cardList", value: [{ ...ffsCardList.value[0], texts: ["only-one"] }] }],
      ffsFields,
    ),
  );

  // Methodology flow connectors (N cards -> N - 1 .svc-method-arrow-connector)
  const svcMethod = ffsFields.find((f) => f.kind === "cardList" && f.itemSelector === ".svc-method-card");
  assert.ok(svcMethod && svcMethod.kind === "cardList");
  const duplicatedMethod = [
    ...svcMethod.value,
    {
      ...svcMethod.value[0],
      id: `${svcMethod.value[0].id}-clone-1`,
      sourceIndex: svcMethod.value[0].sourceIndex,
      texts: ["Etapa Extra", ...svcMethod.value[0].texts.slice(1)],
    },
  ];
  const methodPatched = applyContentPatches(
    ffsMarkup,
    normalizePageContentPatches([{ key: svcMethod.key, kind: "cardList", value: duplicatedMethod }], ffsFields),
    "/1-solucao-engenharia-de-integridade-estrutural.html",
  );
  const $method = load(methodPatched);
  assert.equal($method(".svc-methodology-flow > .svc-method-card").length, svcMethod.value.length + 1);
  assert.equal($method(".svc-methodology-flow > .svc-method-arrow-connector").length, svcMethod.value.length);

  // Bento row on Solution 2 (text edit)
  const svc2Markup = await readFile("2-solucao-inspecao-em-obras-de-artes-especiais.html", "utf8");
  const svc2Fields = editableFieldsForRoute(
    svc2Markup,
    "/2-solucao-inspecao-em-obras-de-artes-especiais.html",
  );
  const bentoField = svc2Fields.find((f) => f.kind === "cardList" && f.itemSelector === "article.ec-card-white");
  assert.ok(bentoField && bentoField.kind === "cardList");
  const nextBento = bentoField.value.map((item, idx) =>
    idx === 0
      ? {
          ...item,
          texts: ["Card Bento Editado", ...item.texts.slice(1)],
        }
      : item,
  );
  const $svc2 = load(
    applyContentPatches(
      svc2Markup,
      normalizePageContentPatches([{ key: bentoField.key, kind: "cardList", value: nextBento }], svc2Fields),
      "/2-solucao-inspecao-em-obras-de-artes-especiais.html",
    ),
  );
  assert.ok($svc2(".bento-row > article.ec-card-white").eq(0).text().includes("Card Bento Editado"));

  // Home endo-acc-row (image swap + objectPosition) and FAQ cardList
  const homeMarkup = await readFile("index.html", "utf8");
  const homeFields = editableFieldsForRoute(homeMarkup, "/");
  const endoField = homeFields.find((f) => f.kind === "cardList" && f.itemSelector === "li.endo-acc-panel");
  assert.ok(endoField && endoField.kind === "cardList");
  const customPhoto = "/media/44444444-4444-4444-8444-444444444444.webp";
  const nextEndo = endoField.value.map((item, idx) =>
    idx === 0
      ? {
          ...item,
          image: {
            src: customPhoto,
            alt: "Foto Editada",
            objectPosition: "40% 60%",
          },
        }
      : item,
  );
  const $endo = load(
    applyContentPatches(
      homeMarkup,
      normalizePageContentPatches([{ key: endoField.key, kind: "cardList", value: nextEndo }], homeFields),
      "/",
    ),
  );
  assert.equal($endo("ul.endo-acc-row > li.endo-acc-panel").eq(0).find("img").first().attr("src"), customPhoto);
  assert.match(
    $endo("ul.endo-acc-row > li.endo-acc-panel").eq(0).find("img").first().attr("style") ?? "",
    /object-position:\s*40% 60%/i,
  );
  assert.throws(() =>
    normalizePageContentPatches(
      [
        {
          key: endoField.key,
          kind: "cardList",
          value: endoField.value.map((item, idx) =>
            idx === 0 ? { ...item, image: { src: "https://evil.example/hack.png", alt: "x" } } : item,
          ),
        },
      ],
      homeFields,
    ),
  );

  const faqField = homeFields.find((f) => f.kind === "cardList" && f.itemSelector === ".faq-v2-item");
  assert.ok(faqField && faqField.kind === "cardList");
  const nextFaq = faqField.value.slice(0, -1);
  const $faq = load(
    applyContentPatches(
      homeMarkup,
      normalizePageContentPatches([{ key: faqField.key, kind: "cardList", value: nextFaq }], homeFields),
      "/",
    ),
  );
  assert.equal($faq(".faq-v2-grid > .faq-v2-item").length, faqField.value.length - 1);

  // Sobre Nos timeline connectors (N cards -> N - 1 connectors)
  const aboutMarkup = await readFile("sobre-nos.html", "utf8");
  const aboutFields = editableFieldsForRoute(aboutMarkup, "/sobre-nos.html");
  const trackField = aboutFields.find((f) => f.kind === "cardList" && f.itemSelector === ".sn-step-unit");
  assert.ok(trackField && trackField.kind === "cardList");
  const nextTrack = [...trackField.value.slice(1), trackField.value[0]];
  const $about = load(
    applyContentPatches(
      aboutMarkup,
      normalizePageContentPatches([{ key: trackField.key, kind: "cardList", value: nextTrack }], aboutFields),
      "/sobre-nos.html",
    ),
  );
  assert.equal($about(".sn-process-track-zone > .sn-step-unit").length, trackField.value.length);
  assert.equal(
    $about(".sn-process-track-zone > .sn-step-arrow, .sn-process-track-zone > .sn-step-line-connector").length,
    trackField.value.length - 1,
  );

  // Privacy Policy legal blocks keep trailing .legal-back-row
  const legalMarkup = await readFile("politica-de-privacidade.html", "utf8");
  const legalFields = editableFieldsForRoute(legalMarkup, "/politica-de-privacidade.html");
  const legalCardField = legalFields.find((f) => f.kind === "cardList" && f.itemSelector === ".legal-block");
  assert.ok(legalCardField && legalCardField.kind === "cardList");
  const $legal = load(
    applyContentPatches(
      legalMarkup,
      normalizePageContentPatches([{ key: legalCardField.key, kind: "cardList", value: legalCardField.value.slice(0, 3) }], legalFields),
      "/politica-de-privacidade.html",
    ),
  );
  assert.equal($legal(".legal-content-container > .legal-block").length, 3);
  assert.equal($legal(".legal-content-container > .legal-back-row").length, 1);
});

test("zero data-ec-shortcut remains in editor annotations and zero data-ec-* in anonymous HTML across all 15 pages", async () => {
  for (const page of sitePages) {
    const filePath = page.routePath === "/" ? "index.html" : page.routePath.slice(1);
    const source = await readFile(filePath, "utf8");
    const annotated = applyContentPatchesWithInlineAnnotations(source, [], page.routePath);
    const $ann = load(annotated.markup);
    assert.equal(
      $ann("[data-ec-shortcut]").length,
      0,
      `Expected zero data-ec-shortcut elements on ${page.routePath}`,
    );

    const anon = applyContentPatches(source, [], page.routePath);
    assert.equal(
      /data-ec-/.test(anon),
      false,
      `Expected zero data-ec-* attributes in anonymous markup on ${page.routePath}`,
    );
  }
});
