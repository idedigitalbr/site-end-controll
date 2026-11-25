import { serveCmsStaticAsset } from "@/lib/cms/public-renderer";

type SourceRouteContext = {
  params: Promise<{ path: string[] }>;
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: SourceRouteContext) {
  const { path } = await params;
  return (await serveCmsStaticAsset(`src/${path.join("/")}`))
    ?? new Response("Not Found", { status: 404 });
}
