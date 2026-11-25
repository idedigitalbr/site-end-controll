import assert from "node:assert/strict";
import { test } from "node:test";

import { isCmsAdmin, isCmsEditor } from "@/lib/cms/auth-role";

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
