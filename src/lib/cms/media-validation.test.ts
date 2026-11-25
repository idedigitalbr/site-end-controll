import assert from "node:assert/strict";
import { test } from "node:test";

import {
  MAX_MEDIA_BYTES,
  MAX_MEDIA_REQUEST_BYTES,
  parseBoundedFormData,
  verifyImageUpload,
} from "@/lib/cms/media-validation";

test("accepts an image only when MIME and file signature agree", () => {
  const pngSignature = Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10]);

  assert.deepEqual(verifyImageUpload(pngSignature, "image/png", pngSignature.length), {
    extension: "png",
    mimeType: "image/png",
  });
  assert.equal(verifyImageUpload(pngSignature, "image/jpeg", pngSignature.length), null);
  assert.equal(verifyImageUpload(pngSignature, "image/svg+xml", pngSignature.length), null);
});

test("rejects uploads larger than the configured limit", () => {
  const pngSignature = Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10]);

  assert.equal(verifyImageUpload(pngSignature, "image/png", MAX_MEDIA_BYTES + 1), null);
});

test("parses multipart only after enforcing the request-size limit", async () => {
  const form = new FormData();
  form.set("altText", "Descrição curta");
  const request = new Request("http://localhost/api/admin/media", { method: "POST", body: form });
  const parsed = await parseBoundedFormData(request);
  assert.equal(parsed.get("altText"), "Descrição curta");

  const oversized = new Request("http://localhost/api/admin/media", {
    method: "POST",
    headers: {
      "content-type": "multipart/form-data; boundary=any",
      "content-length": String(MAX_MEDIA_REQUEST_BYTES + 1),
    },
    body: "ignored before form parsing",
  });
  await assert.rejects(parseBoundedFormData(oversized), /limite de tamanho/);
});
