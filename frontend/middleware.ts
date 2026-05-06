import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const TOKEN_KEY = process.env.NEXT_PUBLIC_TOKEN_KEY || "strapi-jwt-token";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip Next internals and public pages.
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/unauthorized") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get(TOKEN_KEY)?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Run middleware for all app routes except Next static assets.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

