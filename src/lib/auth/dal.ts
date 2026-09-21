import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import { ROUTES } from "@/constants/routes";
import { decryptSession, SESSION_COOKIE } from "@/lib/auth/session";

export const verifySession = cache(async () => {
  const cookieStore = await cookies();
  const session = await decryptSession(cookieStore.get(SESSION_COOKIE)?.value);

  if (!session) redirect(ROUTES.LOGIN);

  return session;
});
