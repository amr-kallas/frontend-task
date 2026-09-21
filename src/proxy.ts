import { NextResponse, type NextRequest } from "next/server";

import { ROUTES } from "@/constants/routes";
import { decryptSession, SESSION_COOKIE } from "@/lib/auth/session";

/**
 * Next.js 16 renamed Middleware to Proxy — same feature, runs before any
 * route is rendered. An anonymous request to /admin gets a real 307 from the
 * server, so no admin HTML is ever produced for it.
 */
export async function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await decryptSession(token);
  const isLoginPage = request.nextUrl.pathname === ROUTES.LOGIN;

  if (!isLoginPage && !session) {
    const response = NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
    // An expired or forged cookie is useless — drop it instead of re-sending it.
    if (token) response.cookies.delete(SESSION_COOKIE);
    return response;
  }

  // A logged-in user has no reason to see the login form.
  if (isLoginPage && session) {
    return NextResponse.redirect(new URL(ROUTES.ADMIN, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
