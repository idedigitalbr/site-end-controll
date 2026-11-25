import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { globalContentSettings } from "@/db/schema";

export async function getBackgroundContent() {
  const [row] = await db.select().from(globalContentSettings).where(eq(globalContentSettings.id, "backgrounds")).limit(1);
  return row?.values ?? null;
}
