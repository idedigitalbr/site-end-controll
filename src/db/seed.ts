import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import mysql, { type PoolConnection, type RowDataPacket } from "mysql2/promise";
import { loadEnvConfig } from "@next/env";
import { load } from "cheerio";

import { editableFieldsForRoute, normalizePageContentPatches } from "@/lib/cms/page-content";
import { sitePages } from "@/lib/site-inventory";
import { decideInitialSeedAction, latestDraftVersion } from "./seed-policy";

loadEnvConfig(process.cwd());

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL precisa estar configurada para importar o inventário inicial.");
}

const connectionUrl = new URL(databaseUrl);
const pool = mysql.createPool({
  host: connectionUrl.hostname,
  port: connectionUrl.port ? Number(connectionUrl.port) : 3306,
  user: decodeURIComponent(connectionUrl.username),
  password: decodeURIComponent(connectionUrl.password),
  database: connectionUrl.pathname.replace(/^\//, ""),
  connectionLimit: 5,
  charset: "utf8mb4",
});

type PageRow = RowDataPacket & {
  id: string;
  title: string;
  summary: string | null;
  page_type: string;
  status: "draft" | "published" | "archived";
  template_path: string | null;
  published_version_id: string | null;
};

type PageVersionRow = RowDataPacket & {
  id: string;
  version: number;
  title: string;
  summary: string | null;
  status: "draft" | "published" | "archived";
};

const uuidNamespace = Buffer.from("6ba7b8109dad11d180b400c04fd430c8", "hex");

function stableUuid(name: string) {
  const digest = createHash("sha1")
    .update(Buffer.concat([uuidNamespace, Buffer.from(name, "utf8")]))
    .digest();
  const bytes = Buffer.from(digest.subarray(0, 16));
  bytes[6] = (bytes[6] & 0x0f) | 0x50;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString("hex");

  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join("-");
}

function pageType(routePath: string, kind: string) {
  if (routePath === "/") return "home";
  if (routePath.startsWith("/sobre-nos")) return "about";
  if (routePath.startsWith("/politica-de-privacidade")) return "privacy";
  return kind === "Solução" ? "service" : "system";
}

function initialPageContent(markup: string, routePath: string) {
  const fields = editableFieldsForRoute(markup, routePath);
  const rawPatches = fields.map((field) => {
    const patch = { key: field.key, kind: field.kind, value: field.value };
    return field.kind === "image" ? { ...patch, altText: field.altText } : patch;
  });

  return normalizePageContentPatches(rawPatches, fields);
}

function originalMetadata(markup: string) {
  const $ = load(markup);
  const description = $("meta[name='description']").first().attr("content")?.trim() || null;
  const documentTitle = $("title").first().text().trim() || null;

  return {
    summary: description,
    seoTitle: documentTitle,
    seoDescription: description,
  };
}

async function readInitialTemplate(routePath: string) {
  const definition = sitePages.find((page) => page.routePath === routePath);
  if (!definition) return null;

  const fileName = routePath === "/" ? "index.html" : routePath.replace(/^\/+/, "");
  try {
    const markup = await readFile(path.resolve(process.cwd(), fileName), "utf8");
    return markup.replace(/^\uFEFF/, "");
  } catch {
    return null;
  }
}

async function seed() {
  let connection: PoolConnection | undefined;

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    let imported = 0;
    let preserved = 0;
    let unpublished = 0;
    let archived = 0;

    for (const definition of sitePages) {
      const routePath = definition.routePath;
      const markup = await readInitialTemplate(routePath);
      if (!markup) throw new Error(`O template original da rota ${routePath} não foi encontrado.`);

      const metadata = originalMetadata(markup);
      const content = initialPageContent(markup, routePath);
      const type = pageType(routePath, definition.kind);
      // The Home service card shows the published summary when present. The solution's meta description is not
      // the card copy, so service pages start without a summary and keep the original card text.
      const publishedSummary = type === "service" ? null : metadata.summary;

      const [pageRows] = await connection.query<PageRow[]>(
        "SELECT id, title, summary, page_type, status, template_path, published_version_id FROM pages WHERE route_path = ? FOR UPDATE",
        [routePath],
      );
      let page = pageRows[0];

      if (!page) {
        const pageId = stableUuid(`site-endcontrol:page:${routePath}`);
        await connection.execute(
          "INSERT INTO pages (id, route_path, template_path, title, summary, page_type, status) VALUES (?, ?, ?, ?, ?, ?, 'draft')",
          [pageId, routePath, routePath, definition.title, metadata.summary, type],
        );
        const [createdRows] = await connection.query<PageRow[]>(
          "SELECT id, title, summary, page_type, status, template_path, published_version_id FROM pages WHERE id = ? FOR UPDATE",
          [pageId],
        );
        page = createdRows[0];
      } else if (!page.template_path) {
        await connection.execute("UPDATE pages SET template_path = ? WHERE id = ?", [routePath, page.id]);
        page.template_path = routePath;
      }

      if (!page) throw new Error(`Não foi possível preparar o cadastro CMS da rota ${routePath}.`);

      const [versions] = await connection.query<PageVersionRow[]>(
        "SELECT id, version, title, summary, status FROM page_versions WHERE page_id = ? ORDER BY version DESC FOR UPDATE",
        [page.id],
      );

      const seedAction = decideInitialSeedAction(page.status, page.published_version_id, versions);
      if (seedAction === "keep-archived") {
        archived += 1;
        continue;
      }
      if (seedAction === "keep-published") {
        preserved += 1;
        continue;
      }
      if (seedAction === "keep-unpublished") {
        unpublished += 1;
        continue;
      }

      const versionNumber = (versions[0]?.version ?? 0) + 1;
      const versionId = stableUuid(`site-endcontrol:published:${routePath}:v${versionNumber}`);
      await connection.execute(
        "INSERT INTO page_versions (id, page_id, version, title, summary, content, seo_title, seo_description, status, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'published', NOW())",
        [
          versionId,
          page.id,
          versionNumber,
          definition.title,
          publishedSummary,
          JSON.stringify(content),
          metadata.seoTitle,
          metadata.seoDescription,
        ],
      );

      const draftToPreserve = latestDraftVersion(versions);
      const nextPageStatus = draftToPreserve ? "draft" : "published";
      await connection.execute(
        "UPDATE pages SET published_version_id = ?, status = ?, title = ?, summary = ? WHERE id = ?",
        [
          versionId,
          nextPageStatus,
          draftToPreserve ? draftToPreserve.title : definition.title,
          draftToPreserve ? draftToPreserve.summary : publishedSummary,
          page.id,
        ],
      );

      if (draftToPreserve) {
        const draftVersionNumber = versionNumber + 1;
        const draftVersionId = stableUuid(`site-endcontrol:preserved-draft:${routePath}:v${draftVersionNumber}`);
        await connection.execute(
          "INSERT INTO page_versions (id, page_id, version, title, summary, content, seo_title, seo_description, status, created_by_user_id) SELECT ?, page_id, ?, title, summary, content, seo_title, seo_description, 'draft', created_by_user_id FROM page_versions WHERE id = ?",
          [draftVersionId, draftVersionNumber, draftToPreserve.id],
        );
      }

      imported += 1;
    }

    await connection.commit();
    console.log(
      `Importação CMS concluída: ${imported} versões publicadas criadas, ${preserved} publicações preservadas, ${unpublished} páginas mantidas sem publicação e ${archived} páginas arquivadas mantidas.`,
    );
  } catch (error) {
    await connection?.rollback();
    throw error;
  } finally {
    connection?.release();
    await pool.end();
  }
}

seed().catch((error: unknown) => {
  console.error("Falha ao importar as versões iniciais do site.");
  console.error(error instanceof Error ? error.message : "Erro desconhecido.");
  process.exitCode = 1;
});
