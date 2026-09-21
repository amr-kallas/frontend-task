import { NextResponse, type NextRequest } from "next/server";

import { ROUTES } from "@/constants/routes";
import { decryptSession, SESSION_COOKIE } from "@/lib/auth/session";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await decryptSession(token);
  const isLoginPage = request.nextUrl.pathname === ROUTES.LOGIN;

  if (!isLoginPage && !session) {
    const response = NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
    if (token) response.cookies.delete(SESSION_COOKIE);
    return response;
  }

  if (isLoginPage && session) {
    return NextResponse.redirect(new URL(ROUTES.ADMIN, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
