import { renderCmsPagePreview } from "@/lib/cms/public-renderer";
import { requireCmsEditor } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await requireCmsEditor();
  const { id } = await params;
  return renderCmsPagePreview(id);
}
