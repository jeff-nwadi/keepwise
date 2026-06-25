import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";



const PROTECTED_PREFIXES = ["/items", "/upload", "/settings"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
  if (!isProtected) return NextResponse.next();

  const session = getSessionCookie(request);
  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/items/:path*",
    "/upload/:path*",
    "/settings/:path*",
  ],
};
