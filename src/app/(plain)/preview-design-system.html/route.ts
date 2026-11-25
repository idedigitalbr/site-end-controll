import { serveLegacySiteFile } from "@/lib/legacy-site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return (await serveLegacySiteFile("preview-design-system.html"))
    ?? new Response("Not Found", { status: 404 });
}
