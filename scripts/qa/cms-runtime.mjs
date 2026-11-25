import assert from "node:assert/strict";
import { randomUUID, randomBytes } from "node:crypto";
import mysql from "mysql2/promise";
import sharp from "sharp";
import { load } from "cheerio";
import { readdir, readFile } from "node:fs/promises";

const base = process.env.CMS_QA_URL ?? "http://127.0.0.1:3000";
if (!new URL(base).hostname.match(/^(127\.0\.0\.1|localhost)$/)) throw new Error("QA permitido somente em localhost.");
const email = process.env.CMS_QA_EMAIL;
const password = process.env.CMS_QA_PASSWORD;
if (!email || !password || !process.env.DATABASE_URL) throw new Error("Configure CMS_QA_EMAIL, CMS_QA_PASSWORD e DATABASE_URL no ambiente.");
const results = [];
const connection = await mysql.createConnection(process.env.DATABASE_URL);
let temporaryUserId;
let adminCookie;
let editorCookie;
let temporaryMediaId;
const temporaryRoute = `/qa-runtime-${randomUUID()}.html`;
const forbiddenEmail = `forbidden-${randomUUID()}@example.invalid`;
const temporaryEmail = `qa-${randomUUID()}@example.invalid`;
const request = (route, cookie, options = {}) => fetch(`${base}${route}`, {
  redirect: "manual", ...options,
  headers: { Origin: base, ...(cookie ? { Cookie: cookie } : {}), ...options.headers },
});
async function login(account, secret) {
  const response = await request("/api/auth/sign-in/email", null, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: account, password: secret }),
  });
  assert.equal(response.status, 200, "login HTTP");
  const cookie = response.headers.getSetCookie().map(value => value.split(";")[0]).join("; ");
  assert.ok(cookie, "session cookie");
  return cookie;
}
async function check(label, run) { await run(); results.push(label); console.log(`PASS ${label}`); }
function formDataFrom($, form) {
  const body = new FormData();
  form.find("input[name],select[name],textarea[name]").each((_, element) => {
    const input = $(element);
    if (input.attr("disabled") !== undefined) return;
    if (["checkbox", "radio"].includes(input.attr("type")) && input.attr("checked") === undefined) return;
    const value = input.val();
    for (const entry of Array.isArray(value) ? value : [value ?? ""]) body.append(input.attr("name"), String(entry));
  });
  return body;
}
async function editorDocument(route) {
  const response = await request(route, adminCookie);
  assert.equal(response.status, 200, `GET ${route}`);
  return load(await response.text());
}
try {
  await check("admin and media reject anonymous access", async () => {
    assert.equal((await request("/admin")).status, 307);
    assert.equal((await request("/api/admin/media")).status, 401);
    for (const method of ["POST", "PATCH", "DELETE"]) {
      assert.equal((await request("/api/admin/media", null, { method })).status, 401, `${method} anonymous denied`);
    }
  });
  adminCookie = await login(email, password);
  await check("administrator account and settings pages", async () => {
    assert.equal((await request("/admin/users", adminCookie)).status, 200);
    assert.equal((await request("/admin/settings", adminCookie)).status, 200);
  });
  await check("all original CSS responses remain readable and unchanged without overrides", async () => {
    const [settings] = await connection.query("SELECT (SELECT COUNT(*) FROM cms_site_settings) + (SELECT COUNT(*) FROM cms_global_content WHERE id='backgrounds') count");
    for (const file of (await readdir("src/css")).filter(name => name.endsWith(".css"))) {
      const response = await request(`/src/css/${file}`);
      assert.equal(response.status, 200, file);
      assert.match(response.headers.get("content-type") ?? "", /^text\/css/);
      const bytes = Buffer.from(await response.arrayBuffer());
      const css = bytes.toString("utf8");
      assert.ok(css.length > 0, file);
      if (settings[0].count === 0) assert.ok(bytes.equals(await readFile(`src/css/${file}`)), `CSS fidelity ${file}`);
    }
  });
  await check("media upload, dimensions, authorship, alt update and deletion", async () => {
    const invalidForm = new FormData();
    invalidForm.set("file", new File([Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10])], "truncated.png", { type: "image/png" }));
    assert.equal((await request("/api/admin/media", adminCookie, { method: "POST", body: invalidForm })).status, 415);
    const bytes = await sharp({ create: { width: 8, height: 12, channels: 3, background: "#123456" } }).png().toBuffer();
    const form = new FormData();
    form.set("file", new File([bytes], "endcontrol-runtime-qa.png", { type: "image/png" }));
    form.set("altText", "QA mídia temporária");
    const upload = await request("/api/admin/media", adminCookie, { method: "POST", body: form });
    assert.equal(upload.status, 201);
    const { media } = await upload.json();
    temporaryMediaId = media.id;
    assert.equal((await request(media.url)).status, 200);
    const [rows] = await connection.execute("SELECT width,height,created_by_user_id FROM cms_media_assets WHERE id=?", [media.id]);
    assert.equal(rows[0].width, 8);
    assert.equal(rows[0].height, 12);
    assert.ok(rows[0].created_by_user_id);
    const library = await (await request("/api/admin/media", adminCookie)).json();
    const entry = library.media.find(item => item.id === media.id);
    assert.ok(entry?.createdAt);
    assert.ok(Math.abs(Date.now() - new Date(entry.createdAt).getTime()) < 60_000, "audit/media timestamps are UTC-correct");
    const patch = await request("/api/admin/media", adminCookie, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: media.id, altText: "QA atualizado" }) });
    assert.equal(patch.status, 200);
    const deleted = await request("/api/admin/media", adminCookie, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: media.id }) });
    assert.equal(deleted.status, 200);
    temporaryMediaId = undefined;
    assert.equal((await request(media.url)).status, 404);
  });
  const [pages] = await connection.query("SELECT id,route_path FROM pages ORDER BY route_path");
  assert.ok(pages.length >= 15);
  for (const page of pages) await check(`editor and private preview ${page.route_path}`, async () => {
    assert.equal((await request(`/admin/pages/${page.id}`, adminCookie)).status, 200);
    assert.equal((await request(`/admin/pages/${page.id}/preview`, adminCookie)).status, 200);
    assert.equal((await request(`/admin/pages/${page.id}/preview`)).status, 307);
  });
  await check("real Server Actions: create, draft, publish, private preview, restore and unpublish", async () => {
    let $ = await editorDocument("/admin/pages/new");
    let form = $("form").filter((_, element) => $(element).find('input[name="slug"]').length > 0).first();
    const body = formDataFrom($, form);
    body.set("title", "QA temporary workflow");
    body.set("slug", temporaryRoute.slice(1, -5));
    body.set("templatePath", "/");
    const create = await request("/admin/pages/new", adminCookie, { method: "POST", body });
    assert.equal(create.status, 303, "create server action redirects");
    const [created] = await connection.execute("SELECT id FROM pages WHERE route_path=?", [temporaryRoute]);
    const pageId = created[0]?.id;
    assert.ok(pageId);
    const editorRoute = `/admin/pages/${pageId}`;
    const markerA = "QA-WORKFLOW-A";
    const markerB = "QA-WORKFLOW-B";
    const submitEditor = async (buttonText, marker) => {
      const $ = await editorDocument(editorRoute);
      const form = $("form").filter((_, element) => $(element).find('input[name="content"]').length > 0).first();
      const data = formDataFrom($, form);
      if (marker) {
        const patches = JSON.parse(String(data.get("content")));
        const heading = patches.find(patch => patch.kind === "text" && patch.key.includes("h1"));
        assert.ok(heading);
        heading.value = marker;
        data.set("content", JSON.stringify(patches));
      }
      const button = form.find("button").filter((_, element) => $(element).text().trim() === buttonText).first();
      assert.equal(button.length, 1, `button ${buttonText}`);
      const actionName = button.attr("name");
      if (actionName) {
        for (const key of [...data.keys()]) if (key.startsWith("$ACTION_ID_")) data.delete(key);
        data.append(actionName, button.attr("value") ?? "");
      }
      const result = await request(editorRoute, adminCookie, { method: "POST", body: data });
      assert.equal(result.status, 303, `${buttonText} redirects`);
    };
    assert.equal((await request(temporaryRoute)).status, 404);
    await submitEditor("Salvar rascunho", markerA);
    const [saved] = await connection.execute("SELECT id FROM page_versions WHERE page_id=? ORDER BY version DESC LIMIT 1", [pageId]);
    const savedVersionId = saved[0].id;
    assert.ok((await (await request(`${editorRoute}/preview`, adminCookie)).text()).includes(markerA));
    await submitEditor("Publicar no site", markerA);
    const publishedHtml = await (await request(temporaryRoute)).text();
    assert.ok(publishedHtml.includes(markerA));
    assert.equal(load(publishedHtml)("body").attr("class") ?? "", "", "new Home template uses its original plain body class");
    await submitEditor("Salvar rascunho", markerB);
    const publicHtml = await (await request(temporaryRoute)).text();
    assert.ok(publicHtml.includes(markerA) && !publicHtml.includes(markerB));
    assert.ok((await (await request(`${editorRoute}/preview`, adminCookie)).text()).includes(markerB));
    $ = await editorDocument(editorRoute);
    form = $("form").filter((_, element) => $(element).find(`input[name="versionId"][value="${savedVersionId}"]`).length > 0).first();
    assert.equal(form.length, 1, "restore form for prior version");
    const restored = await request(editorRoute, adminCookie, { method: "POST", body: formDataFrom($, form) });
    assert.equal(restored.status, 303);
    const preview = await (await request(`${editorRoute}/preview`, adminCookie)).text();
    assert.ok(preview.includes(markerA) && !preview.includes(markerB));
    await submitEditor("Retirar do site");
    assert.equal((await request(temporaryRoute)).status, 404);
    const [events] = await connection.execute("SELECT action,actor_user_id FROM cms_page_audit_events WHERE page_id=?", [pageId]);
    for (const action of ["page_created", "draft_saved", "published", "restored", "unpublished"]) assert.ok(events.some(event => event.action === action && event.actor_user_id), `authored audit ${action}`);
  });
  await check("unpublished original route is absent from public page and sitemap", async () => {
    const [rows] = await connection.query("SELECT id,route_path,status,published_version_id FROM pages WHERE published_version_id IS NOT NULL AND route_path LIKE '/%-solucao-%.html' LIMIT 1");
    const original = rows[0];
    assert.ok(original, "run baseline content import before this QA");
    await connection.execute("UPDATE pages SET published_version_id=NULL,status='draft' WHERE id=? AND published_version_id=?", [original.id, original.published_version_id]);
    try {
      assert.equal((await request(original.route_path)).status, 404);
      const sitemap = await (await request("/sitemap.xml")).text();
      assert.ok(!sitemap.includes(original.route_path));
    } finally {
      await connection.execute("UPDATE pages SET published_version_id=?,status=? WHERE id=? AND published_version_id IS NULL", [original.published_version_id, original.status, original.id]);
    }
  });
  const temporaryPassword = randomBytes(24).toString("hex");
  const create = await request("/api/auth/admin/create-user", adminCookie, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "QA temporary editor", email: temporaryEmail, password: temporaryPassword, role: "editor" }),
  });
  assert.equal(create.status, 200, "create temporary editor");
  const [created] = await connection.execute("SELECT id FROM user WHERE email = ?", [temporaryEmail]);
  temporaryUserId = created[0]?.id;
  assert.ok(temporaryUserId);
  editorCookie = await login(temporaryEmail, temporaryPassword);
  await check("editor accesses content and media but not settings or accounts", async () => {
    assert.equal((await request("/admin/pages", editorCookie)).status, 200);
    assert.equal((await request("/api/admin/media", editorCookie)).status, 200);
    assert.equal((await request("/admin/users", editorCookie)).status, 307);
    assert.equal((await request("/admin/settings", editorCookie)).status, 307);
    const denied = await request("/api/auth/admin/create-user", editorCookie, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Forbidden", email: forbiddenEmail, password: temporaryPassword, role: "admin" }),
    });
    assert.ok([401, 403].includes(denied.status), "editor cannot create administrators");
  });
  await check("health endpoint checks database", async () => assert.equal((await request("/api/health")).status, 200));
  console.log(`Runtime checks passed: ${results.length}`);
} finally {
  await connection.execute("DELETE FROM pages WHERE route_path=? AND title=?", [temporaryRoute, "QA temporary workflow"]);
  if (temporaryMediaId && adminCookie) await request("/api/admin/media", adminCookie, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: temporaryMediaId }) }).catch(() => {});
  for (const cookie of [editorCookie, adminCookie]) if (cookie) await request("/api/auth/sign-out", cookie, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }).catch(() => {});
  if (temporaryUserId) await connection.execute("DELETE FROM user WHERE id = ? AND name = ?", [temporaryUserId, "QA temporary editor"]);
  await connection.execute("DELETE FROM user WHERE email=? AND name=?", [temporaryEmail, "QA temporary editor"]);
  await connection.execute("DELETE FROM user WHERE email=? AND name=?", [forbiddenEmail, "Forbidden"]);
  await connection.end();
}
