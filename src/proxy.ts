import { NextResponse, type NextRequest } from "next/server";

const STATIC_ASSET_PREFIXES = ["/assets/", "/src/", "/media/", "/_next/"];

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-endcontrol-public-path", pathname);

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  const isAdminOrAuthRoute =
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/login" ||
    pathname.startsWith("/login/") ||
    pathname.startsWith("/api/admin/");

  if (isAdminOrAuthRoute) {
    response.headers.set("Cache-Control", "private, no-store, no-cache, must-revalidate");
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    return response;
  }

  const isStaticAsset = STATIC_ASSET_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  if (!isStaticAsset) {
    response.headers.append("Vary", "Cookie");
    const cookieHeader = request.headers.get("cookie") ?? "";
    if (cookieHeader.includes("better-auth")) {
      response.headers.set("Cache-Control", "private, no-store");
    }
  }

  return response;
}
