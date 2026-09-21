import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import { ROUTES } from "@/constants/routes";
import { decryptSession, SESSION_COOKIE } from "@/lib/auth/session";

/**
 * The authoritative session check, run by the protected page itself.
 * `proxy.ts` already redirects anonymous requests, but Proxy is an optimistic
 * layer — the page must not trust that it ran.
 *
 * `cache` makes repeated calls within one request cost a single verification.
 */
export const verifySession = cache(async () => {
  const cookieStore = await cookies();
  const session = await decryptSession(cookieStore.get(SESSION_COOKIE)?.value);

  if (!session) redirect(ROUTES.LOGIN);

  return session;
});
