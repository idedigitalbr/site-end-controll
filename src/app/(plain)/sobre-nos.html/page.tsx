import { PublicLegacyPage, generateLegacyPageMetadata } from "@/components/public/server-page";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function generateMetadata() {
  return generateLegacyPageMetadata("/sobre-nos.html");
}

export default function AboutPage() {
  return <PublicLegacyPage routePath="/sobre-nos.html" />;
}
