import { PublicLegacyPage, generateLegacyPageMetadata } from "@/components/public/server-page";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function generateMetadata() {
  return generateLegacyPageMetadata("/");
}

export default function HomePage() {
  return <PublicLegacyPage routePath="/" />;
}
