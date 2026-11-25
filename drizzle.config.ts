import { loadEnvConfig } from "@next/env";

import { defineConfig } from "drizzle-kit";

loadEnvConfig(process.cwd());

export default defineConfig({
  dialect: "mysql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "mysql://endcontrol2_local:change-me@127.0.0.1:3306/endcontrol_cms_local",
  },
});
