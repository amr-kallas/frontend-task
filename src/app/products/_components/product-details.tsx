import Image from "next/image";

import { formatPrice } from "@/lib/format";
import type { Product } from "@/types/product";

import { RatingBadge } from "./rating-badge";

type ProductDetailsProps = {
  product: Product;
};

export function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <article className="grid gap-8 md:grid-cols-2 md:gap-12">
      <div className="flex items-center justify-center rounded-2xl bg-white p-8 ring-1 ring-zinc-200 dark:ring-zinc-800">
        <Image
          src={product.image}
          alt={product.title}
          width={400}
          height={400}
          sizes="(min-width: 768px) 400px, 80vw"
          preload
          className="h-72 w-auto object-contain md:h-96"
        />
      </div>

      <div className="flex flex-col">
        <p className="text-sm font-medium capitalize text-zinc-500">
          {product.category}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          {product.title}
        </h1>

        <div className="mt-3 text-sm">
          <RatingBadge rating={product.rating} />
        </div>

        <p className="mt-6 text-3xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
          {formatPrice(product.price)}
        </p>

        <p className="mt-6 leading-relaxed text-zinc-600 dark:text-zinc-400">
          {product.description}
        </p>
      </div>
    </article>
  );
}
