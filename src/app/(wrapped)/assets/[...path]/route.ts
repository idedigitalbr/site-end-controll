import { serveCmsStaticAsset } from "@/lib/cms/public-renderer";

type AssetRouteContext = {
  params: Promise<{ path: string[] }>;
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: AssetRouteContext) {
  const { path } = await params;
  return (await serveCmsStaticAsset(`assets/${path.join("/")}`))
    ?? new Response("Not Found", { status: 404 });
}
