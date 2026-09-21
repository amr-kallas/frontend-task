import Link from "next/link";

import { buttonClasses } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { ROUTES } from "@/constants/routes";
import { getProducts, PRODUCTS_PAGE_SIZE } from "@/services/products.service";

import { ProductsTable } from "./products-table";

function getProductsPageHref(page: number): string {
  return `${ROUTES.PRODUCTS}?page=${page}`;
}

type ProductsTableSectionProps = {
  page: number;
};

/**
 * The async part of /products: fetches one page on the server and renders
 * it. Any fetch failure is thrown to the nearest error.tsx.
 */
export async function ProductsTableSection({ page }: ProductsTableSectionProps) {
  const { data, pageNumber, totalPages, totalDataCount } = await getProducts({
    PageNumber: page,
  });

  if (totalDataCount === 0) {
    return (
      <EmptyState
        title="No products yet"
        description="The catalog is empty right now."
      />
    );
  }

  // A hand-edited URL such as ?page=99.
  if (data.length === 0) {
    return (
      <EmptyState
        title="This page doesn't exist"
        description={`There are only ${totalPages} pages of products.`}
      >
        <Link href={getProductsPageHref(1)} className={buttonClasses("secondary")}>
          Go to the first page
        </Link>
      </EmptyState>
    );
  }

  const firstItem = (pageNumber - 1) * PRODUCTS_PAGE_SIZE + 1;
  const lastItem = firstItem + data.length - 1;

  return (
    <div className="space-y-4">
      <ProductsTable products={data} />

      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-sm text-zinc-500">
          Showing {firstItem}–{lastItem} of {totalDataCount} products
        </p>
        <Pagination
          currentPage={pageNumber}
          totalPages={totalPages}
          getPageHref={getProductsPageHref}
        />
      </div>
    </div>
  );
}
