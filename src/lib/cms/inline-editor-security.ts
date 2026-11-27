export type SameOriginValidationResult = {
  allowed: boolean;
  reason?: string;
};

export type ValidateSameOriginOptions = {
  trustedHosts?: string[];
};

export const NO_STORE_PRIVATE_HEADERS: Record<string, string> = {
  "Cache-Control": "private, no-store, no-cache, must-revalidate",
  "X-Content-Type-Options": "nosniff",
};

function normalizeHost(rawHost: string | null | undefined): string | null {
  if (!rawHost) return null;
  const first = rawHost.split(",")[0]?.trim().toLowerCase();
  return first || null;
}

function normalizeProtocol(rawProto: string | null | undefined, fallbackProtocol: string): string {
  const first = rawProto?.split(",")[0]?.trim().toLowerCase();
  if (first === "http" || first === "https") return `${first}:`;
  return fallbackProtocol.toLowerCase();
}

function isLoopbackHost(host: string): boolean {
  const hostname = host.replace(/^\[([^\]]+)\](?::\d+)?$/, "$1").split(":")[0]?.toLowerCase() ?? "";
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

function configuredTrustedOrigins(): Array<{ host: string; protocol: string }> {
  const result: Array<{ host: string; protocol: string }> = [];
  for (const raw of [process.env.BETTER_AUTH_URL, process.env.NEXT_PUBLIC_SITE_URL]) {
    if (!raw) continue;
    try {
      const parsed = new URL(raw);
      result.push({
        host: parsed.host.toLowerCase(),
        protocol: parsed.protocol.toLowerCase(),
      });
    } catch {
      // Ignore malformed env URL
    }
  }
  return result;
}

export function validateSameOriginRequest(
  request: Request,
  options: ValidateSameOriginOptions = {},
): SameOriginValidationResult {
  const secFetchSite = request.headers.get("sec-fetch-site")?.trim().toLowerCase();
  if (secFetchSite === "cross-site") {
    return { allowed: false, reason: "Requisição cross-site bloqueada." };
  }

  let requestUrl: URL;
  try {
    requestUrl = new URL(request.url);
  } catch {
    return { allowed: false, reason: "URL da requisição inválida." };
  }

  const directHost = normalizeHost(request.headers.get("host")) ?? requestUrl.host.toLowerCase();
  const baseProtocol = requestUrl.protocol.toLowerCase();
  const configured = configuredTrustedOrigins();
  const configuredHostSet = new Set([
    ...configured.map((entry) => entry.host),
    ...(options.trustedHosts ?? []).map((host) => host.trim().toLowerCase()).filter(Boolean),
  ]);

  const allowedPairs: Array<{ host: string; protocol: string }> = [
    { host: directHost, protocol: baseProtocol },
    { host: requestUrl.host.toLowerCase(), protocol: baseProtocol },
    ...configured,
  ];

  const forwardedHost = normalizeHost(request.headers.get("x-forwarded-host"));
  if (forwardedHost && (isLoopbackHost(directHost) || configuredHostSet.has(forwardedHost))) {
    const forwardedProtocol = normalizeProtocol(
      request.headers.get("x-forwarded-proto"),
      baseProtocol,
    );
    allowedPairs.push({ host: forwardedHost, protocol: forwardedProtocol });
  }

  const matchesAllowed = (candidate: URL) => {
    const host = candidate.host.toLowerCase();
    const protocol = candidate.protocol.toLowerCase();
    return allowedPairs.some((entry) => entry.host === host && entry.protocol === protocol);
  };

  const originHeader = request.headers.get("origin");
  if (originHeader) {
    try {
      const parsedOrigin = new URL(originHeader);
      if (matchesAllowed(parsedOrigin)) return { allowed: true };
      return { allowed: false, reason: "Origem não autorizada." };
    } catch {
      return { allowed: false, reason: "Cabeçalho Origin inválido." };
    }
  }

  const refererHeader = request.headers.get("referer");
  if (refererHeader) {
    try {
      const parsedReferer = new URL(refererHeader);
      if (matchesAllowed(parsedReferer)) return { allowed: true };
      return { allowed: false, reason: "Referer não autorizado." };
    } catch {
      return { allowed: false, reason: "Cabeçalho Referer inválido." };
    }
  }

  return { allowed: false, reason: "Cabeçalho de origem ausente." };
}

export class JsonBodyLimitError extends Error {
  constructor() {
    super("O corpo JSON excede o limite de tamanho permitido.");
    this.name = "JsonBodyLimitError";
  }
}

export class InvalidJsonBodyError extends Error {
  constructor() {
    super("Corpo JSON inválido.");
    this.name = "InvalidJsonBodyError";
  }
}

export async function readBoundedJsonBody<T = unknown>(
  request: Request,
  maxBytes: number,
): Promise<T> {
  const declaredLength = request.headers.get("content-length");
  if (declaredLength !== null) {
    if (!/^\d+$/.test(declaredLength)) throw new InvalidJsonBodyError();
    if (Number(declaredLength) > maxBytes) throw new JsonBodyLimitError();
  }

  if (!request.body) throw new InvalidJsonBodyError();
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel().catch(() => undefined);
        throw new JsonBodyLimitError();
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

  const text = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new InvalidJsonBodyError();
  }
}

const rateLimitBuckets = new Map<string, number[]>();

export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number,
  now = Date.now(),
): { allowed: boolean; retryAfterSeconds: number } {
  const cutoff = now - windowMs;

  if (rateLimitBuckets.size > 500) {
    for (const [bucketKey, timestamps] of rateLimitBuckets.entries()) {
      const recent = timestamps.filter((ts) => ts > cutoff);
      if (recent.length === 0) rateLimitBuckets.delete(bucketKey);
      else rateLimitBuckets.set(bucketKey, recent);
    }
  }

  const existing = (rateLimitBuckets.get(key) ?? []).filter((ts) => ts > cutoff);
  if (existing.length >= maxRequests) {
    const oldest = existing[0] ?? now;
    const retryAfterSeconds = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    rateLimitBuckets.set(key, existing);
    return { allowed: false, retryAfterSeconds };
  }

  existing.push(now);
  rateLimitBuckets.set(key, existing);
  return { allowed: true, retryAfterSeconds: 0 };
}
