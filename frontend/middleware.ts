// Restricts all pages and API requests behind authentication
// https://next-auth.js.org/configuration/nextjs#middleware
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export { default } from "next-auth/middleware";

export const config = { matcher: ["/dashboard"] };

export function middleware(request: NextRequest) {
  // proxies api requests to the backend service
  if (
    request.nextUrl.pathname.startsWith("/api") &&
    !request.nextUrl.pathname.startsWith("/api/auth")
  ) {
    return NextResponse.rewrite(
      new URL(
        request.nextUrl.pathname,
        "http://localhost:5000",
        // `${process.env.BACKEND_PROXY}`,
      ),
    );
  }
}
