import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-endcontrol-public-path", request.nextUrl.pathname);

  return NextResponse.next({ request: { headers: requestHeaders } });
}
