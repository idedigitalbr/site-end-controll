import { loadEnvConfig } from "@next/env";
import mysql from "mysql2/promise";

import { createCmsAuth } from "./src/lib/auth-options";

loadEnvConfig(process.cwd());

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL precisa estar configurada para usar as ferramentas administrativas do Better Auth.");

const url = new URL(databaseUrl);
const pool = mysql.createPool({
  host: url.hostname,
  port: url.port ? Number(url.port) : 3306,
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.replace(/^\//, ""),
  connectionLimit: 3,
  waitForConnections: true,
  queueLimit: 0,
  charset: "utf8mb4",
  timezone: "Z",
});

export const auth = createCmsAuth(pool);
