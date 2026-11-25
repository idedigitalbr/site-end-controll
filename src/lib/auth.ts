import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { mysqlPool } from "@/db";
import { createCmsAuth } from "@/lib/auth-options";
import { isCmsAdmin, isCmsEditor } from "@/lib/cms/auth-role";

export const auth = createCmsAuth(mysqlPool);

export type CmsSession = NonNullable<Awaited<ReturnType<typeof getCmsSession>>>;

export async function getCmsSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function requireCmsAdmin(): Promise<CmsSession> {
  const session = await getCmsSession();

  if (!session || !isCmsAdmin(session.user.role)) {
    redirect("/login");
  }

  return session;
}

export async function requireCmsEditor(): Promise<CmsSession> {
  const session = await getCmsSession();
  if (!session || !isCmsEditor(session.user.role)) redirect("/login");
  return session;
}
