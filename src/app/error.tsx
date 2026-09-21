"use client";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

type AppErrorProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function AppError({ error, retry }: AppErrorProps) {
  return (
    <EmptyState
      tone="danger"
      eyebrow="Something went wrong"
      title="This page couldn't be loaded"
      description={
        <>
          <p>An unexpected error occurred while loading this page.</p>
          {error.digest && (
            <p className="mt-2 font-mono text-xs text-zinc-500">
              Reference: {error.digest}
            </p>
          )}
        </>
      }
    >
      <Button onClick={() => retry()}>Try again</Button>
    </EmptyState>
  );
}
