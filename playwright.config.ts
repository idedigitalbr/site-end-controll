import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: ".playwright/results",
  snapshotPathTemplate: "{testDir}/../../.playwright/reference/{projectName}/{arg}{ext}",
  timeout: 90_000,
  workers: 1,
  reporter: [["list"], ["html", { outputFolder: ".playwright/report", open: "never" }]],
  use: { baseURL: "http://127.0.0.1:3000", channel: process.env.PLAYWRIGHT_CHANNEL ?? "chrome", headless: true, trace: "retain-on-failure", screenshot: "only-on-failure" },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 1000 } } },
    { name: "tablet", use: { viewport: { width: 768, height: 1024 } } },
    { name: "mobile", use: { viewport: { width: 390, height: 844 } } },
  ],
});
