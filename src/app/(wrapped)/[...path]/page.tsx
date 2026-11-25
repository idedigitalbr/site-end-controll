import { notFound } from "next/navigation";

import {
  PublicLegacyPage,
  generateLegacyPageMetadata,
} from "@/components/public/server-page";

type CatchAllPageProps = {
  params: Promise<{ path: string[] }>;
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function routePathForSegments(segments: string[]) {
  return `/${segments.join("/")}`;
}

export async function generateMetadata({ params }: CatchAllPageProps) {
  const { path } = await params;
  const routePath = routePathForSegments(path);
  return generateLegacyPageMetadata(routePath);
}

export default async function PublicCatchAllPage({ params }: CatchAllPageProps) {
  const { path } = await params;
  const routePath = routePathForSegments(path);
  if (routePath === "/404.html") notFound();

  return <PublicLegacyPage routePath={routePath} />;
}
