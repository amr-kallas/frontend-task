"use client";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

import { ProductsPageHeader } from "../_components/products-page-header";

type ProductsErrorProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

export default function ProductsError({ retry }: ProductsErrorProps) {
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
          </>
        }
      >
        <Button onClick={() => retry()}>Try again</Button>
      </EmptyState>
    </>
  );
}
