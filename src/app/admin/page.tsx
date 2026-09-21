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
