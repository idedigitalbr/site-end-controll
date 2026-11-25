import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { globalContentSettings } from "@/db/schema";
import { normalizeFfsContent } from "./ffs-content";

export async function getFfsOverrides() {
  const [row] = await db.select().from(globalContentSettings).where(eq(globalContentSettings.id, "ffs")).limit(1);
  return row?.values.data ? normalizeFfsContent(JSON.parse(row.values.data)) : null;
}
