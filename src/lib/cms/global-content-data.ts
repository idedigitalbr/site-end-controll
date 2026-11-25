import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { globalContentSettings } from "@/db/schema";

export async function getGlobalContent() {
  const [row] = await db.select().from(globalContentSettings).where(eq(globalContentSettings.id, "global")).limit(1);
  return row?.values ?? null;
}
