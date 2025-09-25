import { NextResponse } from "next/server";
import { verifySession as verifySessionEdge } from "./src/lib/auth";

const ADMIN_PATH = "/admin";

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith(ADMIN_PATH)) {
    const token = req.cookies.get("admin_session")?.value;
    const valid = token ? await verifySessionEdge(token) : null;
    if (!token || !valid) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  if (pathname === "/login") {
    const token = req.cookies.get("admin_session")?.value;
    const valid = token ? await verifySessionEdge(token) : null;
    if (token && valid) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
