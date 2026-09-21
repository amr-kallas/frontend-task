import type { Metadata } from "next";

import { logout } from "@/actions/auth.actions";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { verifySession } from "@/lib/auth/dal";

import { SessionDetails } from "./_components/session-details";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

/**
 * Two server-side checks guard this page:
 *   1. proxy.ts redirects before rendering when there is no valid session.
 *   2. verifySession() re-checks here, so the page is safe even if the
 *      proxy is misconfigured or bypassed.
 * Reading cookies also makes the page dynamic: it can never be cached and
 * served to someone else.
 */
export default async function AdminPage() {
  const session = await verifySession();

  return (
    <>
      <PageHeader
        title="Admin"
        description={
          <>
            Signed in as{" "}
            <strong className="text-zinc-900 dark:text-zinc-100">
              {session.username}
            </strong>
          </>
        }
        actions={
          // A plain form posting to a Server Action: works without client JS.
          <form action={logout}>
            <Button type="submit" variant="secondary">
              Log out
            </Button>
          </form>
        }
      />

      <SessionDetails session={session} />
    </>
  );
}
