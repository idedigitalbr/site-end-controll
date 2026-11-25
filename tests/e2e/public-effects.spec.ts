import { test, expect, type Page } from "@playwright/test";

const engineeringRoute = "/1-solucao-engenharia-de-integridade-estrutural.html";

async function openWithReducedMotion(page: Page, routePath: string) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const response = await page.goto(routePath, { waitUntil: "domcontentloaded" });
  expect(response?.status()).toBe(200);
  await page.waitForFunction(() => document.documentElement.dataset.endcontrolReady === "true");
  await expect(page.locator("html")).not.toHaveAttribute("data-endcontrol-error", "true");
}

test("legacy scripts execute once after hydration without React hydration errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await openWithReducedMotion(page, "/");
  await expect(page.locator(".solutions-menu-aside")).toHaveCount(1);

  const localLegacyScripts = page.locator('script[src*="/src/js/"]');
  await expect(localLegacyScripts).toHaveCount(4);
  const urls = await localLegacyScripts.evaluateAll((scripts) => scripts.map((script) => (script as HTMLScriptElement).src));
  expect(new Set(urls).size).toBe(urls.length);
  expect(errors.join("\n")).not.toMatch(/#418|hydration failed/i);
});

test("desktop menu opens, expands a solution group, and navigates to its page", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "The desktop hover menu is checked in the desktop project.");
  await openWithReducedMotion(page, "/");

  const menu = page.locator("#main-menu");
  await page.waitForFunction(() => document.querySelector(".menu-toggle")?.getAttribute("aria-expanded") === "false");
  const dropdown = menu.locator(".dropdown").first();
  await dropdown.hover();
  await expect(dropdown).toHaveClass(/is-open/);
  await expect(dropdown.locator(".drop-link")).toHaveAttribute("aria-expanded", "true");

  const firstGroup = dropdown.locator(".menu-group").first();
  const groupToggle = firstGroup.locator(".menu-group-title");
  await expect(groupToggle).toBeVisible();
  await groupToggle.click();
  await expect(groupToggle).toHaveAttribute("aria-expanded", "false");
  await groupToggle.click();
  await expect(groupToggle).toHaveAttribute("aria-expanded", "true");

  await firstGroup.locator('.menu-service-item[data-service-id="0"]').click();
  await expect(page).toHaveURL(/\/1-solucao-engenharia-de-integridade-estrutural\.html$/);
  await expect(page.locator("h1")).toContainText("Engenharia de Integridade Estrutural");
});

test("mobile menu opens, expands solutions, then closes after navigating", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "desktop", "The compact menu applies to tablet and mobile widths.");
  await openWithReducedMotion(page, "/");

  const menuToggle = page.locator(".menu-toggle");
  await menuToggle.click();
  await expect(menuToggle).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("body")).toHaveClass(/menu-is-open/);

  const dropdown = page.locator("#main-menu .dropdown").first();
  const solutionsTrigger = dropdown.locator(".drop-link");
  await solutionsTrigger.click();
  await expect(solutionsTrigger).toHaveAttribute("aria-expanded", "true");
  const serviceLink = dropdown.locator('.menu-service-item[data-service-id="0"]');
  await expect(serviceLink).toBeVisible();
  await serviceLink.click();

  await expect(page).toHaveURL(/\/1-solucao-engenharia-de-integridade-estrutural\.html$/);
  await expect(page.locator(".menu-toggle")).toHaveAttribute("aria-expanded", "false");
});

test("Home radar selection updates the active node and featured solution", async ({ page }) => {
  await openWithReducedMotion(page, "/");

  const diagram = page.locator("#orbitalDiagram");
  const cardTitle = page.locator("#cardTitle");
  const initialTitle = await cardTitle.textContent();
  const nextNode = page.locator("#radarNodesLayer .service-node").nth(1);
  await expect(nextNode).toBeVisible();
  await nextNode.click();

  await expect(diagram).toHaveAttribute("data-current-step", "2");
  await expect(cardTitle).not.toHaveText(initialTitle ?? "");
  await expect(page.locator("#radarNodesLayer .service-node[aria-current='true']")).toHaveCount(1);
});

test("FFS mechanism cards keep their original count and hover treatment", async ({ page }) => {
  await openWithReducedMotion(page, engineeringRoute);

  const cards = page.locator("#radar-ffs .ffs-mechanism-card");
  await expect(cards).toHaveCount(12);
  const firstTitle = cards.first().locator(".ec-card-white-title");
  await cards.first().hover();
  await expect(firstTitle).toHaveCSS("color", "rgb(255, 255, 255)");
});

test("engineering gallery and when-to-apply accordion advance one item", async ({ page }) => {
  await openWithReducedMotion(page, engineeringRoute);

  const gallery = page.locator("#solutionGallery");
  const slides = gallery.locator(".ec-gallery-slide");
  await expect(slides).toHaveCount(6);
  await gallery.hover();
  const currentSlide = Number(await gallery.locator(".ec-gallery-slide.is-active").getAttribute("data-slide-index"));
  await gallery.locator(".ec-gallery-next").click();
  const expectedSlide = (currentSlide + 1) % (await slides.count());
  await expect(gallery.locator(".ec-gallery-slide.is-active")).toHaveAttribute("data-slide-index", String(expectedSlide));

  const accordion = page.locator("#quando-aplicar");
  const panels = accordion.locator(".endo-acc-panel");
  await expect(panels).toHaveCount(8);
  await expect(panels.first()).toHaveAttribute("aria-expanded", "true");
  // Up to 860px the original shows the prev/next buttons; above that they are hidden and panels are clicked.
  const narrow = (page.viewportSize()?.width ?? 0) <= 860;
  if (narrow) await accordion.locator("#btnNextAcc").click();
  else await panels.nth(1).click();
  await expect(panels.nth(1)).toHaveAttribute("aria-expanded", "true");
  await expect(panels.first()).toHaveAttribute("aria-expanded", "false");
});

test("index.html serves the published Home with its canonical URL", async ({ page }) => {
  const response = await page.goto("/index.html", { waitUntil: "domcontentloaded" });

  expect(response?.status()).toBe(200);
  await expect(page.locator("h1").first()).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/index\.html$/);
});

test("unknown paths return the original 404 page metadata and status", async ({ page }) => {
  const response = await page.goto("/qa-not-found-20261114", { waitUntil: "domcontentloaded" });

  expect(response?.status()).toBe(404);
  await expect(page).toHaveTitle("404 - Página Não Encontrada | ENDCONTROL Engenharia");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    "A página solicitada não foi encontrada ou foi movida. Retorne à página inicial da ENDCONTROL Engenharia ou fale com nossos especialistas.",
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});
