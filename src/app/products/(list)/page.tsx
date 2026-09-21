import type { Metadata } from "next";
import { Suspense } from "react";

import { parsePageParam } from "@/lib/search-params";

import { ProductsPageHeader } from "../_components/products-page-header";
import { ProductsTableSection } from "../_components/products-table-section";
import { ProductsTableSkeleton } from "../_components/products-table-skeleton";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse the product catalog.",
};

export default async function ProductsPage({
  searchParams,
}: PageProps<"/products">) {
  const page = parsePageParam((await searchParams).page);

  return (
    <>
      <ProductsPageHeader />

      <Suspense key={page} fallback={<ProductsTableSkeleton />}>
        <ProductsTableSection page={page} />
      </Suspense>
    </>
  );
}
