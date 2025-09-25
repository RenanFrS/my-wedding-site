import { NextResponse } from "next/server";
import { verifySession } from "./src/lib/auth";

const ADMIN_PATH = "/admin";

export function middleware(req) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith(ADMIN_PATH)) {
    const token = req.cookies.get("admin_session")?.value;
    if (!token || !verifySession(token)) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  if (pathname === "/login") {
    const token = req.cookies.get("admin_session")?.value;
    if (token && verifySession(token)) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
