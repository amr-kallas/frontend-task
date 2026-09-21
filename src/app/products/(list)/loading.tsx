import { ProductsPageHeader } from "../_components/products-page-header";
import { ProductsTableSkeleton } from "../_components/products-table-skeleton";

export default function ProductsLoading() {
  return (
    <>
      <ProductsPageHeader />
      <ProductsTableSkeleton />
    </>
  );
}
