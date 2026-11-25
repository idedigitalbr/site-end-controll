import { chromium } from "@playwright/test";
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  for (const port of [4179, 3000]) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    page.on("pageerror", error => errors.push(error.message));
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`http://127.0.0.1:${port}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1200);
    const result = await page.evaluate(() => ({
      ready: document.readyState,
      height: document.documentElement.scrollHeight,
      radar: document.querySelectorAll(".radar-node").length,
      menu: document.querySelectorAll(".solutions-menu-aside").length,
      scripts: Array.from(document.scripts).filter(script => script.src.includes("/src/js/")).map(script => ({ src: script.src.split("/").pop(), async: script.async, defer: script.defer })),
    }));
    console.log(JSON.stringify({ port, ...result, errors }));
    await page.screenshot({ path: `.playwright/inspect-${port}.png`, fullPage: false });
    await page.close();
  }
} finally { await browser.close(); }
