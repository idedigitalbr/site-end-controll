import "server-only";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { globalContentSettings } from "@/db/schema";
import { normalizeNavigationContent, type NavigationContent } from "./navigation-content";

export async function getNavigationContent(): Promise<NavigationContent | null> {
  const [row] = await db.select().from(globalContentSettings).where(eq(globalContentSettings.id, "navigation")).limit(1);
  const data = row?.values.data;
  if (!data) return null;
  try {
    return normalizeNavigationContent(JSON.parse(data));
  } catch {
    return null;
  }
}
