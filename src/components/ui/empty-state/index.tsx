import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type EmptyStateProps = {
  title: string;
  description?: ReactNode;
  children?: ReactNode;
  tone?: "neutral" | "danger";
  eyebrow?: string;
};

export function EmptyState({
  title,
  description,
  children,
  tone = "neutral",
  eyebrow,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-xl border border-dashed px-6 py-16 text-center",
        tone === "danger"
          ? "border-red-300 bg-red-50/60 dark:border-red-900 dark:bg-red-950/30"
          : "border-zinc-300 dark:border-zinc-700",
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "text-sm font-semibold",
            tone === "danger"
              ? "text-red-600 dark:text-red-400"
              : "text-zinc-500",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2 className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        {title}
      </h2>
      {description && (
        <div className="mt-2 max-w-md text-sm text-zinc-600 dark:text-zinc-400">
          {description}
        </div>
      )}
      {children && (
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {children}
        </div>
      )}
    </div>
  );
}
