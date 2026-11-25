export const MAX_MEDIA_BYTES = 10 * 1024 * 1024;
export const MAX_MEDIA_REQUEST_BYTES = MAX_MEDIA_BYTES + 64 * 1024;

export class MediaRequestLimitError extends Error {
  constructor() {
    super("O envio excede o limite de tamanho permitido.");
    this.name = "MediaRequestLimitError";
  }
}

export async function parseBoundedFormData(request: Request): Promise<FormData> {
  const declaredLength = request.headers.get("content-length");
  if (declaredLength !== null) {
    if (!/^\d+$/.test(declaredLength)) throw new Error("Content-Length inválido.");
    if (Number(declaredLength) > MAX_MEDIA_REQUEST_BYTES) throw new MediaRequestLimitError();
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
      if (total > MAX_MEDIA_REQUEST_BYTES) {
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
