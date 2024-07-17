import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const requestHeaders = request.headers;

  requestHeaders.set("x-derivative-url", request.nextUrl.toString());

  return NextResponse.next({ headers: requestHeaders });
}
