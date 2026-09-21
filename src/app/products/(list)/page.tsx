import type { Metadata } from "next";
import { Suspense } from "react";

import { parsePageParam } from "@/lib/search-params";

import { ProductsPageHeader } from "../_components/products-page-header";
import { ProductsTableSection } from "../_components/products-table-section";
import { ProductsTableSkeleton } from "../_components/products-table-skeleton";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse the product catalog, rendered on the server on every request.",
};

/**
 * Lives in the `(list)` route group so that its loading.tsx wraps only this
 * page, not /products/[id] (see the comment in [id]/page.tsx).
 */
export default async function ProductsPage({
  searchParams,
}: PageProps<"/products">) {
  const page = parsePageParam((await searchParams).page);

  return (
    <>
      <ProductsPageHeader />

      {/* A new key per page makes each page a fresh boundary, so the skeleton
          shows on every page switch instead of the old rows lingering. */}
      <Suspense key={page} fallback={<ProductsTableSkeleton />}>
        <ProductsTableSection page={page} />
      </Suspense>
    </>
  );
}
