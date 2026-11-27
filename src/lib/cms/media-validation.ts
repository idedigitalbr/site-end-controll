export const MAX_MEDIA_BYTES = 10 * 1024 * 1024;
export const MAX_MEDIA_REQUEST_BYTES = MAX_MEDIA_BYTES + 64 * 1024;
export const MAX_VIDEO_BYTES = 50 * 1024 * 1024;
export const MAX_VIDEO_REQUEST_BYTES = MAX_VIDEO_BYTES + 64 * 1024;

export class MediaRequestLimitError extends Error {
  constructor() {
    super("O envio excede o limite de tamanho permitido.");
    this.name = "MediaRequestLimitError";
  }
}

export async function parseBoundedFormData(
  request: Request,
  maxRequestBytes = MAX_MEDIA_REQUEST_BYTES,
): Promise<FormData> {
  const declaredLength = request.headers.get("content-length");
  if (declaredLength !== null) {
    if (!/^\d+$/.test(declaredLength)) throw new Error("Content-Length inválido.");
    if (Number(declaredLength) > maxRequestBytes) throw new MediaRequestLimitError();
  }

  if (!request.body) throw new Error("Corpo multipart ausente.");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxRequestBytes) {
        await reader.cancel();
        throw new MediaRequestLimitError();
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  const headers = new Headers(request.headers);
  headers.delete("content-length");
  headers.delete("transfer-encoding");
  const boundedRequest = new Request(request.url, {
    method: request.method,
    headers,
    body: bytes,
  });
  return boundedRequest.formData();
}

export function verifyImageUpload(
  bytes: Uint8Array,
  mimeType: string,
  sizeBytes: number,
): { extension: string; mimeType: string } | null {
  if (sizeBytes < 1 || sizeBytes > MAX_MEDIA_BYTES || bytes.byteLength < 8) return null;

  const startsWith = (...signature: number[]) => signature.every((byte, index) => bytes[index] === byte);
  const asciiAt = (offset: number, length: number) =>
    String.fromCharCode(...bytes.subarray(offset, offset + length));

  const detected = startsWith(0xff, 0xd8, 0xff)
    ? { extension: "jpg", mimeType: "image/jpeg" }
    : startsWith(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)
      ? { extension: "png", mimeType: "image/png" }
      : asciiAt(0, 6) === "GIF87a" || asciiAt(0, 6) === "GIF89a"
        ? { extension: "gif", mimeType: "image/gif" }
        : asciiAt(0, 4) === "RIFF" && asciiAt(8, 4) === "WEBP"
          ? { extension: "webp", mimeType: "image/webp" }
          : asciiAt(4, 4) === "ftyp" && ["avif", "avis", "mif1"].includes(asciiAt(8, 4))
            ? { extension: "avif", mimeType: "image/avif" }
            : null;

  if (!detected || detected.mimeType !== mimeType) return null;
  return detected;
}

const ALLOWED_MP4_BRANDS = new Set([
  "isom",
  "iso2",
  "iso3",
  "iso4",
  "iso5",
  "iso6",
  "mp41",
  "mp42",
  "M4V ",
  "M4VH",
  "M4VP",
  "avc1",
  "dash",
  "MSNV",
  "mp71",
  "f4v ",
  "3gp4",
  "3gp5",
  "3gp6",
  "nvr1",
]);

export function verifyVideoUpload(
  bytes: Uint8Array,
  mimeType: string,
  sizeBytes: number,
): { extension: "mp4" | "webm" | "mov"; mimeType: "video/mp4" | "video/webm" | "video/quicktime" } | null {
  if (sizeBytes < 1 || sizeBytes > MAX_VIDEO_BYTES || bytes.byteLength < 12) return null;

  const startsWith = (...signature: number[]) => signature.every((byte, index) => bytes[index] === byte);
  const asciiAt = (offset: number, length: number) =>
    String.fromCharCode(...bytes.subarray(offset, offset + length));

  let detected:
    | { extension: "mp4" | "webm" | "mov"; mimeType: "video/mp4" | "video/webm" | "video/quicktime" }
    | null = null;

  if (startsWith(0x1a, 0x45, 0xdf, 0xa3)) {
    detected = { extension: "webm", mimeType: "video/webm" };
  } else if (asciiAt(4, 4) === "ftyp") {
    const brand = asciiAt(8, 4);
    if (brand === "qt  ") {
      detected = { extension: "mov", mimeType: "video/quicktime" };
    } else if (ALLOWED_MP4_BRANDS.has(brand)) {
      detected = { extension: "mp4", mimeType: "video/mp4" };
    }
  }

  if (!detected || detected.mimeType !== mimeType) return null;
  return detected;
}
