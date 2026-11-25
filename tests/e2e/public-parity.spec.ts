import { test, expect, type Page } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { sitePages } from "../../src/lib/site-inventory";

async function prepare(page: Page, url: string) {
  page.on("pageerror", error => console.log(`PAGE ERROR ${url}: ${error.message}`));
  page.on("console", message => { if (message.type() === "error") console.log(`CONSOLE ERROR ${url}: ${message.text().slice(0, 1200)}`); });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    let seed = 42;
    Math.random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    const timeout = window.setTimeout.bind(window);
    const interval = window.setInterval.bind(window);
    const frame = window.requestAnimationFrame.bind(window);
    const timeouts = new Set<number>();
    const intervals = new Set<number>();
    const frames = new Set<number>();
    let paused = false;
    const isSite = () => new Error().stack?.includes("/src/js/") ?? false;
    window.setTimeout = ((handler: TimerHandler, delay?: number, ...args: unknown[]) => {
      const site = isSite();
      const id = timeout(handler, delay, ...args);
      if (site) timeouts.add(id);
      return id;
    }) as typeof window.setTimeout;
    window.setInterval = ((handler: TimerHandler, delay?: number, ...args: unknown[]) => {
      const site = isSite();
      // Site intervals (solution gallery autoplay, hero carousel) never start during the capture: otherwise the
      // slide shown depends on how long the page ran before the freeze, and the reference and CMS differ at random.
      if (site) return 0;
      const id = interval(handler, delay, ...args);
      if (site) intervals.add(id);
      return id;
    }) as typeof window.setInterval;
    window.requestAnimationFrame = callback => {
      const site = isSite();
      if (site && paused) return 0;
      const id = frame(callback);
      if (site) frames.add(id);
      return id;
    };
    (window as Window & { __freezeEndcontrol?: () => void }).__freezeEndcontrol = () => {
      paused = true;
      timeouts.forEach(id => clearTimeout(id));
      intervals.forEach(id => clearInterval(id));
      frames.forEach(id => cancelAnimationFrame(id));
    };
  });
  const response = await page.goto(url, { waitUntil: "load" });
  // "networkidle" never settles on /sobre-nos.html: the original streams large testimonial videos on both
  // the reference and the CMS. Wait for it up to 15s, then rely on the explicit readiness checks below.
  await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
  expect(response?.status()).toBe(200);
  if (new URL(url).port === "3000") {
    await page.waitForFunction(() => document.documentElement.dataset.endcontrolReady === "true", undefined, { timeout: 15_000 });
    expect(await page.locator("html").getAttribute("data-endcontrol-error")).toBeNull();
  }
  await page.waitForFunction(() => document.querySelector(".solutions-menu-aside"), undefined, { timeout: 10_000 });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => (window as Window & { __freezeEndcontrol?: () => void }).__freezeEndcontrol?.());
  await page.addStyleTag({ content: "*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important} nextjs-portal{display:none!important}" });
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const viewport = page.viewportSize()!.height;
  for (let y = 0; y < height; y += viewport) {
    await page.evaluate(value => window.scrollTo(0, value), y);
    await page.waitForTimeout(80);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(100);
}

for (const entry of sitePages) {
  test(`original visual and content ${entry.routePath}`, async ({ page, context }, testInfo) => {
    const reference = await context.newPage();
    await prepare(reference, `http://127.0.0.1:4179${entry.routePath}`);
    const baseline = await reference.screenshot({ fullPage: true, animations: "disabled", mask: [reference.locator(".hero-benefits-bar .value, .card-progress, .dep-controls-timeline-progress")] });
    const filename = `${entry.routePath === "/" ? "home" : entry.routePath.slice(1, -5)}.png`;
    const baselinePath = testInfo.snapshotPath(filename);
    await mkdir(path.dirname(baselinePath), { recursive: true });
    await writeFile(baselinePath, baseline);
    await prepare(page, `http://127.0.0.1:3000${entry.routePath}`);
    const normalizeHeadings = (headings: string[]) => headings.map(value => value.replace(/\s+/g, " ").trim());
    const referenceHeadings = normalizeHeadings(await reference.locator("h1").allTextContents());
    expect(normalizeHeadings(await page.locator("h1").allTextContents())).toEqual(referenceHeadings);
    const geometry = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth }));
    expect(geometry.scroll).toBeLessThanOrEqual(geometry.width + 2);
    expect(await page.screenshot({ fullPage: true, animations: "disabled", mask: [page.locator(".hero-benefits-bar .value, .card-progress, .dep-controls-timeline-progress")] })).toMatchSnapshot(filename, { maxDiffPixelRatio: 0.005 });
    await reference.close();
  });
}
