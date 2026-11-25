import assert from "node:assert/strict";
import test from "node:test";
import { load } from "cheerio";

import {
  applyNavigationContent,
  defaultNavigationContent,
  normalizeNavigationContent,
} from "../../src/lib/cms/navigation-content.ts";

const menu = `<!doctype html><html><body><nav class="main-menu">
  <a href="index.html#home">Home</a><a href="sobre-nos.html" id="menu-link-sobre">Sobre Nós</a>
  <div class="dropdown"><a class="drop-link" aria-haspopup="true">Nossas Soluções</a><div class="dropdown-rich-menu">
    <a class="dropdown-item-rich" data-service-id="0" href="original.html"><span class="dropdown-item-logo"><svg></svg></span><span class="dropdown-item-text">Original</span></a>
    <div class="item-with-submenu"><a class="submenuzinho-item" data-service-id="4" href="project.html"><span class="submenuzinho-bullet">•</span><span>Project</span></a></div>
  </div></div><a class="btn-contacts-menu" href="https://wa.me/5591984040710">Fale com Especialista</a>
</nav></body></html>`;

function cloneDefault() {
  return JSON.parse(JSON.stringify(defaultNavigationContent));
}

test("normalizes navigation data with the complete fixed menu structure", () => {
  assert.deepEqual(normalizeNavigationContent(defaultNavigationContent), defaultNavigationContent);
});

test("rejects unsafe or incomplete navigation destinations and ordering", () => {
  const unsafe = cloneDefault();
  unsafe.primary.find((item: { id: string }) => item.id === "contact").href = "javascript:alert(1)";
  assert.throws(() => normalizeNavigationContent(unsafe), /link.*válido/i);

  const missing = cloneDefault();
  missing.groups[0].services.pop();
  assert.throws(() => normalizeNavigationContent(missing), /submenu|serviços/i);
});

test("applies menu labels, safe destinations, primary order and group/service order", () => {
  const content = cloneDefault();
  content.primary = [content.primary[2], content.primary[0], content.primary[1], content.primary[3]];
  content.primary.find((item: { id: string }) => item.id === "home").label = "Página inicial";
  content.primary.find((item: { id: string }) => item.id === "home").href = "/#inicio";
  content.groups.reverse();
  content.groups[0].services.reverse();

  const rendered = applyNavigationContent(menu, content);
  const $ = load(rendered);
  assert.deepEqual(
    $("nav.main-menu").children("[data-cms-nav-item]").toArray().map((node) => $(node).attr("data-cms-nav-item")),
    ["solutions", "home", "about", "contact"],
  );
  assert.equal($("nav.main-menu [data-cms-nav-item='home']").attr("href"), "/#inicio");
  assert.equal($("nav.main-menu [data-cms-nav-item='home']").text(), "Página inicial");
  assert.equal($("[data-service-id='0'] .dropdown-item-text").text(), "Engenharia de Integridade Estrutural");
  assert.equal($("[data-service-id='0']").attr("href"), "1-solucao-engenharia-de-integridade-estrutural.html");

  const payload = JSON.parse($("#cms-navigation-content").text() ?? "null");
  assert.deepEqual(payload.groups.map((group: { id: string }) => group.id), ["projects", "inspection", "engineering"]);
  assert.deepEqual(payload.groups[0].serviceIds, ["12", "11", "6", "5", "4"]);
});

test("leaves the original markup unchanged when no global navigation has been saved", () => {
  assert.equal(applyNavigationContent(menu, null), menu);
});

test("keeps a global WhatsApp contact rewrite when the menu still uses its default destination", () => {
  const globallyRewritten = menu.replace("https://wa.me/5591984040710", "https://api.whatsapp.com/send?phone=5591999999999");
  const rendered = applyNavigationContent(globallyRewritten, defaultNavigationContent);
  assert.equal(load(rendered)(".btn-contacts-menu").attr("href"), "https://api.whatsapp.com/send?phone=5591999999999");
});
