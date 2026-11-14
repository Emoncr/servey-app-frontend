import { NextRequest, NextResponse } from "next/server";

const DASHBOARD_PREFIX = "/dashboard";
const AUTH_PAGES = ["/signin", "/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get("token")?.value);

  if (pathname.startsWith(DASHBOARD_PREFIX) && !hasSession) {
    const signinUrl = new URL("/signin", request.url);
    signinUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(signinUrl);
  }

  if (AUTH_PAGES.includes(pathname) && hasSession) {
    return NextResponse.redirect(new URL(DASHBOARD_PREFIX, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/signin", "/signup"],
};
