import { NextResponse } from "next/server";

function clearCookie(res) {
  res.cookies.set("admin_session", "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
}

export async function POST(request) {
  const url = new URL("/login", request.url);
  const res = NextResponse.redirect(url);
  clearCookie(res);
  return res;
}

export async function GET(request) {
  const url = new URL("/login", request.url);
  const res = NextResponse.redirect(url);
  clearCookie(res);
  return res;
}
