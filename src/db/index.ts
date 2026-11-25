import "server-only";

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

import * as schema from "@/db/schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL precisa estar configurada para acessar o CMS.");
}

const connectionUrl = new URL(databaseUrl);

const globalForDatabase = globalThis as typeof globalThis & {
  endcontrolPool?: mysql.Pool;
};

const pool =
  globalForDatabase.endcontrolPool ??
  mysql.createPool({
    host: connectionUrl.hostname,
    port: connectionUrl.port ? Number(connectionUrl.port) : 3306,
    user: decodeURIComponent(connectionUrl.username),
    password: decodeURIComponent(connectionUrl.password),
    database: connectionUrl.pathname.replace(/^\//, ""),
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
    charset: "utf8mb4",
    timezone: "Z",
  });

if (!globalForDatabase.endcontrolPool) {
  pool.on("connection", (connection) => {
    connection.query("SET time_zone = '+00:00'");
  });
}
globalForDatabase.endcontrolPool = pool;

export const mysqlPool = pool;
export const db = drizzle({ client: pool, schema, mode: "default" });
