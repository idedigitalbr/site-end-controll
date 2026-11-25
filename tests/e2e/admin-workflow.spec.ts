import { randomUUID } from "node:crypto";
import { loadEnvConfig } from "@next/env";
import mysql, { type Connection, type RowDataPacket } from "mysql2/promise";
import { expect, test, type Page } from "@playwright/test";

loadEnvConfig(process.cwd());
test.use({ trace: "off" });

const email = process.env.CMS_QA_EMAIL;
const password = process.env.CMS_QA_PASSWORD;
const databaseUrl = process.env.DATABASE_URL;

type RevisionRow = RowDataPacket & { version: number };

async function expectStoredRevisionNumbers(connection: Connection, pageId: string, expected: number[]) {
  const [rows] = await connection.execute<RevisionRow[]>(
    "SELECT version FROM page_versions WHERE page_id = ? ORDER BY version ASC",
    [pageId],
  );
  expect(rows.map((row) => Number(row.version))).toEqual(expected);
}

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
  }));
  expect(dimensions.document, "admin content should fit the viewport").toBeLessThanOrEqual(dimensions.viewport + 2);
}

function revisionRow(page: Page, version: number) {
  return page.getByRole("row").filter({
    has: page.getByRole("cell").filter({ hasText: new RegExp(`^v${version}`) }),
  });
}

test("admin logs in, uses the responsive panel, and restores a draft revision", async ({ page }, testInfo) => {
  test.skip(!email || !password || !databaseUrl, "Configure CMS_QA_EMAIL, CMS_QA_PASSWORD e DATABASE_URL para executar o fluxo do CMS.");

  const baseUrl = String(testInfo.project.use.baseURL ?? "http://127.0.0.1:3000");
  const hostname = new URL(baseUrl).hostname;
  expect(["127.0.0.1", "localhost"]).toContain(hostname);

  const token = randomUUID().replaceAll("-", "");
  const title = `QA página temporária ${token}`;
  const slug = `qa-playwright-${token}`;
  const routePath = `/${slug}.html`;
  const markerA = `QA-REVISION-A-${token}`;
  const markerB = `QA-REVISION-B-${token}`;
  const connection = await mysql.createConnection(databaseUrl!);

  try {
    const loginResponse = await page.goto("/login");
    expect(loginResponse?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: "Entrar no CMS" })).toBeVisible();
    await page.getByLabel("E-mail").fill(email!);
    await page.getByLabel("Senha").fill(password!);
    await page.getByRole("button", { name: "Entrar", exact: true }).click();
    await expect(page).toHaveURL(/\/admin\/?$/);
    await expect(page.getByRole("heading", { name: "Visão geral" })).toBeVisible();

    const desktopNavigation = page.getByRole("navigation", { name: "Navegação administrativa", exact: true });
    const mobileNavigation = page.getByRole("navigation", { name: "Navegação administrativa móvel", exact: true });
    if (testInfo.project.name === "desktop") {
      await expect(desktopNavigation).toBeVisible();
      await expect(mobileNavigation).toBeHidden();
    } else {
      await expect(desktopNavigation).toBeHidden();
      await expect(mobileNavigation).toBeVisible();
    }

    await expectNoHorizontalOverflow(page);

    await page.getByRole("link", { name: "Páginas", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Páginas", exact: true })).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await page.getByRole("link", { name: "Nova página" }).click();
    await page.getByLabel("Título", { exact: true }).fill(title);
    await page.getByLabel(/^Slug da URL/).fill(slug);
    await page.getByRole("button", { name: "Criar rascunho", exact: true }).click();

    await page.waitForURL((url) => /^\/admin\/pages\/[0-9a-f-]{36}$/i.test(url.pathname) && url.searchParams.get("created") === "1");
    const pageId = new URL(page.url()).pathname.split("/").at(-1);
    expect(pageId).toMatch(/^[0-9a-f-]{36}$/i);
    await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();
    await expectNoHorizontalOverflow(page);

    const firstHeadingField = page.locator('textarea[aria-label^="Título principal:"]').first();
    await expect(firstHeadingField).toBeVisible();
    await firstHeadingField.fill(markerA);
    const savedVersionBeforeFirstSave = new URL(page.url()).searchParams.get("saved");
    await page.getByRole("button", { name: "Salvar rascunho", exact: true }).click();
    await page.waitForURL((url) => url.pathname === `/admin/pages/${pageId}`
      && url.searchParams.has("saved")
      && url.searchParams.get("saved") !== savedVersionBeforeFirstSave);
    await expectStoredRevisionNumbers(connection, pageId!, [1, 2]);
    const revisionA = revisionRow(page, 2);
    await expect(revisionA).toBeVisible();
    await expect(page.locator('textarea[aria-label^="Título principal:"]').first()).toHaveValue(markerA);
    await expectNoHorizontalOverflow(page);

    const savedVersionBeforeSecondSave = new URL(page.url()).searchParams.get("saved");
    const revisionB = revisionRow(page, 3);
    await page.locator('textarea[aria-label^="Título principal:"]').first().fill(markerB);
    await page.getByRole("button", { name: "Salvar rascunho", exact: true }).click();
    await page.waitForURL((url) => url.pathname === `/admin/pages/${pageId}`
      && url.searchParams.has("saved")
      && url.searchParams.get("saved") !== savedVersionBeforeSecondSave);
    await expectStoredRevisionNumbers(connection, pageId!, [1, 2, 3]);
    await expect(revisionB).toBeVisible();
    await expect(page.locator('textarea[aria-label^="Título principal:"]').first()).toHaveValue(markerB);
    await expectNoHorizontalOverflow(page);

    await expect(revisionA).toContainText(email!);
    await expect(revisionB).toContainText(email!);
    await expect(revisionB).toContainText("Versão em edição");

    await revisionA.getByRole("button", { name: "Restaurar como rascunho", exact: true }).click();
    await page.waitForURL((url) => url.pathname === `/admin/pages/${pageId}` && url.searchParams.has("restored"));
    await expectStoredRevisionNumbers(connection, pageId!, [1, 2, 3, 4]);
    const restoredRevision = revisionRow(page, 4);
    await expect(restoredRevision).toBeVisible();
    await expect(restoredRevision).toContainText("Versão em edição");
    await expect(page.locator('textarea[aria-label^="Título principal:"]').first()).toHaveValue(markerA);
    await expect(page.getByRole("status")).toContainText("Versão restaurada como um novo rascunho.");
    await expectNoHorizontalOverflow(page);

    await page.getByRole("button", { name: "Pré-visualizar rascunho", exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/admin/pages/${pageId}/preview$`));
    await expect(page.getByText(markerA, { exact: false })).toBeVisible();
    await expect(page.getByText(markerB, { exact: false })).toHaveCount(0);
  } finally {
    await page.request.post("/api/auth/sign-out", { data: {}, headers: { Origin: baseUrl } }).catch(() => undefined);
    try {
      await connection.execute("DELETE FROM pages WHERE route_path = ? AND title = ?", [routePath, title]);
    } finally {
      await connection.end();
    }
  }
});
