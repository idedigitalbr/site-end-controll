import assert from "node:assert/strict";
import { test } from "node:test";

import {
  canAccessCmsAdmin,
  canAccessCmsEditor,
  isCmsAdmin,
  isCmsEditor,
  isCmsUserActive,
} from "@/lib/cms/auth-role";

test("only users with the admin role can access CMS administration", () => {
  assert.equal(isCmsAdmin("admin"), true);
  assert.equal(isCmsAdmin("editor"), false);
  assert.equal(isCmsAdmin(undefined), false);
});

test("editors can manage content but never administrative accounts", () => {
  assert.equal(isCmsEditor("editor"), true);
  assert.equal(isCmsEditor("admin"), true);
  for (const role of [undefined, null, "user", "editor,admin", "administrator", ""]) {
    assert.equal(isCmsEditor(role), false);
    assert.equal(isCmsAdmin(role), false);
  }
});

test("banned users cannot keep CMS admin or editor access unless ban expired", () => {
  assert.equal(isCmsUserActive({ banned: false }), true);
  assert.equal(canAccessCmsAdmin({ role: "admin", banned: false }), true);
  assert.equal(canAccessCmsEditor({ role: "editor", banned: false }), true);

  // Permanent ban
  assert.equal(isCmsUserActive({ banned: true, banExpires: null }), false);
  assert.equal(canAccessCmsAdmin({ role: "admin", banned: true, banExpires: null }), false);
  assert.equal(canAccessCmsEditor({ role: "editor", banned: true, banExpires: null }), false);

  // Active timed ban
  const future = new Date(Date.now() + 60_000);
  assert.equal(isCmsUserActive({ banned: true, banExpires: future }), false);
  assert.equal(canAccessCmsEditor({ role: "admin", banned: true, banExpires: future }), false);

  // Expired ban
  const past = new Date(Date.now() - 60_000);
  assert.equal(isCmsUserActive({ banned: true, banExpires: past }), true);
  assert.equal(canAccessCmsEditor({ role: "editor", banned: true, banExpires: past }), true);
});
