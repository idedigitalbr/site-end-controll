import { loadEnvConfig } from "@next/env";
import { createHash } from "node:crypto";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import mysql from "mysql2/promise";
import sharp from "sharp";

loadEnvConfig(process.cwd());
async function main() {
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("Configure DATABASE_URL.");
const url = new URL(databaseUrl);
if (!["localhost", "127.0.0.1"].includes(url.hostname)) throw new Error("Importação inicial permitida apenas no banco local.");
const connection = await mysql.createConnection(databaseUrl);
const types: Record<string, string> = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif", avif: "image/avif" };
let imported = 0;
let existing = 0;
async function visit(directory: string) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) continue;
    if (entry.isDirectory()) { await visit(absolute); continue; }
    const extension = path.extname(entry.name).slice(1).toLowerCase();
    if (!types[extension]) continue;
    const sourcePath = path.relative(process.cwd(), absolute).replaceAll("\\", "/");
    const hash = createHash("sha256").update(`endcontrol-media:${sourcePath}`).digest("hex");
    const id = `${hash.slice(0, 8)}-${hash.slice(8, 12)}-5${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
    const metadata = await sharp(await readFile(absolute)).metadata().catch(() => null);
    const fileName = `${id}.${extension === "jpeg" ? "jpg" : extension}`;
    const [result] = await connection.execute<mysql.ResultSetHeader>(
      "INSERT IGNORE INTO cms_media_assets (id,file_name,original_name,mime_type,size_bytes,alt_text,width,height,source_path) VALUES (?,?,?,?,?,?,?,?,?)",
      [id, fileName, entry.name.slice(0, 255), types[extension], (await stat(absolute)).size, entry.name.replace(/\.[^.]+$/, "").replaceAll("-", " ").slice(0, 500), metadata?.width ?? null, metadata?.height ?? null, sourcePath],
    );
    if (result.affectedRows) imported++; else existing++;
  }
}
try {
  await visit(path.resolve("assets"));
  console.log(`Biblioteca original: ${imported} adicionadas, ${existing} já cadastradas. Arquivos originais preservados no lugar.`);
} finally { await connection.end(); }
}
main().catch(() => { console.error("Importation de mídia falhou; confira banco, migrações e arquivos locais."); process.exitCode = 1; });
