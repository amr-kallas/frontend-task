import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

const BASE =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-medium transition-colors";

type PaginationLinkProps = {
  /** `null` renders a disabled control (e.g. "Previous" on page 1). */
  href: string | null;
  isActive?: boolean;
  "aria-label"?: string;
  children: ReactNode;
};

export function PaginationLink({
  href,
  isActive = false,
  children,
  ...aria
}: PaginationLinkProps) {
  if (isActive) {
    return (
      <span
        aria-current="page"
        className={cn(BASE, "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900")}
      >
        {children}
      </span>
    );
  }

  if (href === null) {
    return (
      <span
        aria-disabled="true"
        className={cn(BASE, "cursor-not-allowed text-zinc-400 dark:text-zinc-600")}
        {...aria}
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        BASE,
        "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800",
      )}
      {...aria}
    >
      {children}
    </Link>
  );
}
