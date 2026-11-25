import { spawn } from "node:child_process";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const database = new URL(process.env.DATABASE_URL ?? "");
if (!["127.0.0.1", "localhost"].includes(database.hostname)) throw new Error("Snapshot QA restrito ao MySQL local.");
const directory = await mkdtemp(path.join(tmpdir(), "endcontrol-mysql-"));
const config = path.join(directory, "client.cnf");
const backupDirectory = path.resolve("storage/backups");
await mkdir(backupDirectory, { recursive: true });
const destination = path.join(backupDirectory, `pre-migration-${Date.now()}.sql`);
const quote = value => `"${value.replaceAll("\\", "\\\\").replaceAll('"', '\\"').replaceAll("\n", "\\n").replaceAll("\r", "\\r")}"`;
try {
  await writeFile(config, `[client]\nhost=${quote(database.hostname)}\nport=${database.port || "3306"}\nuser=${quote(decodeURIComponent(database.username))}\npassword=${quote(decodeURIComponent(database.password))}\n`, { mode: 0o600 });
  const binary = process.env.MYSQLDUMP_BIN ?? "mysqldump";
  const output = createWriteStream(destination, { mode: 0o600, flags: "wx" });
  const child = spawn(binary, [`--defaults-extra-file=${config}`, "--single-transaction", "--set-gtid-purged=OFF", "--no-tablespaces", "--default-character-set=utf8mb4", database.pathname.slice(1)], { windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
  child.stdout.pipe(output);
  child.stderr.resume();
  const code = await new Promise((resolve, reject) => { child.once("error", reject); child.once("close", resolve); });
  await new Promise((resolve, reject) => { if (output.writableFinished) resolve(); else { output.once("finish", resolve); output.once("error", reject); } });
  if (code !== 0) { await rm(destination, { force: true }); throw new Error(`mysqldump falhou (${code}); saída sensível omitida.`); }
  console.log(`Snapshot local criado: ${destination}`);
} finally {
  await rm(config, { force: true });
  if (!path.resolve(directory).startsWith(path.join(path.resolve(tmpdir()), "endcontrol-mysql-"))) throw new Error("Diretório temporário fora do escopo.");
  await rm(directory, { recursive: true, force: true });
}
