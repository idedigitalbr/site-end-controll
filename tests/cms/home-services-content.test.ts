import assert from "node:assert/strict";
import test from "node:test";
import { load } from "cheerio";

import {
  appendHomeServiceOrder,
  defaultHomeServiceOrder,
  homeServiceItems,
  normalizeHomeServiceOrder,
} from "../../src/lib/cms/home-services-content.ts";

test("accepts a complete 12-solution ordering and rejects duplicates or missing IDs", () => {
  assert.deepEqual(normalizeHomeServiceOrder(defaultHomeServiceOrder), defaultHomeServiceOrder);
  assert.throws(() => normalizeHomeServiceOrder([0, ...defaultHomeServiceOrder.slice(1)]), /12 soluções/i);
  assert.throws(() => normalizeHomeServiceOrder(defaultHomeServiceOrder.slice(1)), /12 soluções/i);
});

test("appends the chosen Home order as a safe JSON payload without replacing site markup", () => {
  const original = "<!doctype html><html><body><main id=solucoes><div id=radarNodesLayer></div></main></body></html>";
  const custom = [...defaultHomeServiceOrder].reverse();
  const rendered = appendHomeServiceOrder(original, custom);
  const $ = load(rendered);
  assert.equal($("main#solucoes #radarNodesLayer").length, 1);
  assert.deepEqual(JSON.parse($("#cms-home-service-order").text() ?? "null"), custom);
  assert.equal(appendHomeServiceOrder(original, null), original);
  assert.equal(homeServiceItems.length, 12);
});
