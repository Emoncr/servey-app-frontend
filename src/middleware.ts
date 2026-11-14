import { NextRequest, NextResponse } from "next/server";

const DASHBOARD_PREFIX = "/dashboard";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const hasSession = Boolean(token && token !== "deleted" && token.length > 10);

  if (pathname.startsWith(DASHBOARD_PREFIX) && !hasSession) {
    const signinUrl = new URL("/signin", request.url);
    signinUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(signinUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
