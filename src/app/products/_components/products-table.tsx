import Image from "next/image";
import Link from "next/link";

import { Table, type TableColumn } from "@/components/ui/table";
import { ROUTES } from "@/constants/routes";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types/product";

import { RatingBadge } from "./rating-badge";

export const PRODUCT_COLUMNS: TableColumn<Product>[] = [
  {
    key: "image",
    header: <span className="sr-only">Image</span>,
    className: "w-16",
    cell: (product) => (
      <div className="flex size-12 items-center justify-center rounded-lg bg-white p-1 ring-1 ring-zinc-200 dark:ring-zinc-800">
        <Image
          src={product.image}
          alt=""
          width={40}
          height={40}
          className="size-10 object-contain"
        />
      </div>
    ),
  },
  {
    key: "title",
    header: "Product",
    cell: (product) => (
      <Link
        href={ROUTES.PRODUCT_DETAILS(product.id)}
        className="line-clamp-2 font-medium text-zinc-900 hover:underline dark:text-zinc-100"
      >
        {product.title}
      </Link>
    ),
  },
  {
    key: "category",
    header: "Category",
    className: "hidden md:table-cell",
    cell: (product) => (
      <span className="capitalize text-zinc-600 dark:text-zinc-400">
        {product.category}
      </span>
    ),
  },
  {
    key: "rating",
    header: "Rating",
    className: "hidden sm:table-cell",
    cell: (product) => <RatingBadge rating={product.rating} />,
  },
  {
    key: "price",
    header: "Price",
    className: "text-right",
    cell: (product) => (
      <span className="font-medium tabular-nums">{formatPrice(product.price)}</span>
    ),
  },
];

type ProductsTableProps = {
  products: Product[];
};

export function ProductsTable({ products }: ProductsTableProps) {
  return (
    <Table
      caption="Products"
      columns={PRODUCT_COLUMNS}
      data={products}
      getRowKey={(product) => product.id}
      emptyMessage="No products found."
    />
  );
}
