import assert from "node:assert/strict";
import { test } from "node:test";
import sharp from "sharp";
import { readImageDimensions } from "./image-metadata";

test("reads actual dimensions and rejects truncated image signatures", async () => {
  const png = await sharp({ create: { width: 8, height: 12, channels: 3, background: "#123456" } }).png().toBuffer();
  assert.deepEqual(await readImageDimensions(png), { width: 8, height: 12 });
  await assert.rejects(readImageDimensions(png.subarray(0, 8)));
});
