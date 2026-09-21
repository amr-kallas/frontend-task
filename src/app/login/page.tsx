import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";

import { LoginForm } from "./_components/login-form";

export const metadata: Metadata = {
  title: "Log in",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="mx-auto w-full max-w-sm">
      <PageHeader
        title="Log in"
        description="Sign in to access the admin page."
      />
      <LoginForm />
    </div>
  );
}
