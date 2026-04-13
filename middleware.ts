import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // No custom auth middleware needed; Payload CMS handles its own auth.
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
