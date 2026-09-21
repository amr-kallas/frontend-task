import { ProductsPageHeader } from "../_components/products-page-header";
import { ProductsTableSkeleton } from "../_components/products-table-skeleton";

/**
 * Shown instantly when navigating to /products, while the server renders
 * the page. Same header as the page, so nothing jumps when it resolves.
 */
export default function ProductsLoading() {
  return (
    <>
      <ProductsPageHeader />
      <ProductsTableSkeleton />
    </>
  );
}
