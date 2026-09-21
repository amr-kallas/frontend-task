import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ROUTES } from "@/constants/routes";
import { truncate } from "@/lib/format";
import { getProductById } from "@/services/products.service";

import { ProductDetails } from "../_components/product-details";

export async function generateMetadata({
  params,
}: PageProps<"/products/[id]">): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  const description = truncate(product.description, 160);

  return {
    title: product.title,
    description,
    openGraph: {
      title: product.title,
      description,
      images: [{ url: product.image, alt: product.title }],
    },
  };
}

export default async function ProductPage({
  params,
}: PageProps<"/products/[id]">) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  return (
    <>
      <Link
        href={ROUTES.PRODUCTS}
        className="mb-6 inline-block text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        ← Back to products
      </Link>
      <ProductDetails product={product} />
    </>
  );
}
