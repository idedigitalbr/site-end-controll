import assert from "node:assert/strict";
import { test } from "node:test";

import {
  MAX_MEDIA_BYTES,
  MAX_MEDIA_REQUEST_BYTES,
  MAX_VIDEO_BYTES,
  parseBoundedFormData,
  verifyImageUpload,
  verifyVideoUpload,
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

  const smallForm = new FormData();
  smallForm.set("altText", "Video");
  const videoSized = new Request("http://localhost/api/admin/media?type=video", { method: "POST", body: smallForm });
  const parsedCustom = await parseBoundedFormData(videoSized, 1024);
  assert.equal(parsedCustom.get("altText"), "Video");
});

test("verifyVideoUpload validates MP4, WebM, and MOV signatures and rejects disguised images or oversized files", () => {
  const mp4Bytes = Uint8Array.from([
    0x00, 0x00, 0x00, 0x18,
    0x66, 0x74, 0x79, 0x70, // ftyp
    0x69, 0x73, 0x6f, 0x6d, // isom
  ]);
  assert.deepEqual(verifyVideoUpload(mp4Bytes, "video/mp4", mp4Bytes.length), {
    extension: "mp4",
    mimeType: "video/mp4",
  });
  assert.equal(verifyVideoUpload(mp4Bytes, "video/webm", mp4Bytes.length), null);

  const webmBytes = Uint8Array.from([
    0x1a, 0x45, 0xdf, 0xa3,
    0x9f, 0x42, 0x86, 0x81,
    0x01, 0x42, 0xf7, 0x81,
  ]);
  assert.deepEqual(verifyVideoUpload(webmBytes, "video/webm", webmBytes.length), {
    extension: "webm",
    mimeType: "video/webm",
  });

  const movBytes = Uint8Array.from([
    0x00, 0x00, 0x00, 0x14,
    0x66, 0x74, 0x79, 0x70, // ftyp
    0x71, 0x74, 0x20, 0x20, // "qt  "
  ]);
  assert.deepEqual(verifyVideoUpload(movBytes, "video/quicktime", movBytes.length), {
    extension: "mov",
    mimeType: "video/quicktime",
  });

  const avifDisguised = Uint8Array.from([
    0x00, 0x00, 0x00, 0x18,
    0x66, 0x74, 0x79, 0x70, // ftyp
    0x61, 0x76, 0x69, 0x66, // avif
  ]);
  assert.equal(verifyVideoUpload(avifDisguised, "video/mp4", avifDisguised.length), null);
  assert.equal(verifyVideoUpload(mp4Bytes, "video/mp4", MAX_VIDEO_BYTES + 1), null);
});
