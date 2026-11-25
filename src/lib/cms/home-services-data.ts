import "server-only";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { globalContentSettings } from "@/db/schema";
import { normalizeHomeServiceOrder, type HomeServiceOrder } from "./home-services-content";

export async function getHomeServiceOrder(): Promise<HomeServiceOrder | null> {
  const [row] = await db.select().from(globalContentSettings).where(eq(globalContentSettings.id, "service-order")).limit(1);
  const data = row?.values.data;
  if (!data) return null;
  try {
    return normalizeHomeServiceOrder(JSON.parse(data));
  } catch {
    return null;
  }
}
