import assert from "node:assert/strict";
import test from "node:test";

import { decideInitialSeedAction, latestDraftVersion, type SeedVersionState } from "../../src/db/seed-policy";

const published: SeedVersionState = { id: "published-1", version: 1, status: "published" };
const draft: SeedVersionState = { id: "draft-2", version: 2, status: "draft" };

test("keeps an archived page archived before considering its published history", () => {
  assert.equal(decideInitialSeedAction("archived", null, [published]), "keep-archived");
});

test("preserves the current published pointer", () => {
  assert.equal(decideInitialSeedAction("published", published.id, [published]), "keep-published");
});

test("does not relink a page with published history after it was unpublished", () => {
  assert.equal(decideInitialSeedAction("draft", null, [published]), "keep-unpublished");
});

test("keeps a page unpublished when its pointer is stale but published history remains", () => {
  assert.equal(decideInitialSeedAction("draft", "missing-version", [published]), "keep-unpublished");
});

test("creates the baseline only when the page has no published history", () => {
  assert.equal(decideInitialSeedAction("draft", null, [draft]), "create-baseline");
});

test("selects the latest editable draft for preservation after baseline creation", () => {
  const previousDraft: SeedVersionState = { id: "draft-1", version: 1, status: "draft" };
  assert.deepEqual(latestDraftVersion([previousDraft, published, draft]), draft);
  assert.equal(latestDraftVersion([published]), null);
});
