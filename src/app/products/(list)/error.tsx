"use client";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

import { ProductsPageHeader } from "../_components/products-page-header";

type ProductsErrorProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

/**
 * Catches anything thrown while rendering /products — typically an ApiError
 * from the http layer (API down, timeout, 5xx). In production the message is
 * replaced by Next.js, so only the digest is shown; it matches the server log.
 */
export default function ProductsError({ error, retry }: ProductsErrorProps) {
  return (
    <>
      <ProductsPageHeader />

      <EmptyState
        tone="danger"
        eyebrow="Something went wrong"
        title="We couldn't load the products"
        description={
          <>
            <p>The product service is not responding right now.</p>
            {error.digest && (
              <p className="mt-2 font-mono text-xs text-zinc-500">
                Reference: {error.digest}
              </p>
            )}
          </>
        }
      >
        {/* retry() re-fetches on the server and re-renders this segment. */}
        <Button onClick={() => retry()}>Try again</Button>
      </EmptyState>
    </>
  );
}
