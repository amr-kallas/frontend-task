import { Skeleton } from "@/components/ui/skeleton";
import { TableSkeleton } from "@/components/ui/table";
import { PRODUCTS_PAGE_SIZE } from "@/services/products.service";

import { PRODUCT_COLUMNS } from "./products-table";

export function ProductsTableSkeleton() {
  return (
    <div className="space-y-4">
      <TableSkeleton columns={PRODUCT_COLUMNS.length} rows={PRODUCTS_PAGE_SIZE} />
      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-9 w-72" />
      </div>
    </div>
  );
}
