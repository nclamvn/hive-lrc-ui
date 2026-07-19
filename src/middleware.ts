import { NextResponse, type NextRequest } from "next/server";

const LOCALES = ["en", "vi"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/en/overview", request.url));
  }

  const seg = pathname.split("/")[1];
  if (LOCALES.includes(seg) && pathname === `/${seg}`) {
    return NextResponse.redirect(new URL(`/${seg}/overview`, request.url));
  }

  // Retired Console site: send old /{locale}/console links to the unified Observatory.
  if (LOCALES.includes(seg) && pathname === `/${seg}/console`) {
    return NextResponse.redirect(new URL(`/${seg}/overview`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/en", "/vi", "/en/console", "/vi/console"],
};
