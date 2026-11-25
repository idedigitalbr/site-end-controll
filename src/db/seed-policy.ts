export type SeedVersionState = {
  id: string;
  version: number;
  status: "draft" | "published" | "archived";
};

export type InitialSeedAction = "keep-archived" | "keep-published" | "keep-unpublished" | "create-baseline";

export function decideInitialSeedAction(
  pageStatus: "draft" | "published" | "archived",
  publishedVersionId: string | null,
  versions: readonly SeedVersionState[],
): InitialSeedAction {
  if (pageStatus === "archived") return "keep-archived";
  if (publishedVersionId && versions.some((version) => version.id === publishedVersionId && version.status === "published")) {
    return "keep-published";
  }
  if (versions.some((version) => version.status === "published")) return "keep-unpublished";
  return "create-baseline";
}

export function latestDraftVersion<T extends SeedVersionState>(versions: readonly T[]): T | null {
  return versions
    .filter((version) => version.status === "draft")
    .reduce<T | null>((latest, version) => !latest || version.version > latest.version ? version : latest, null);
}
