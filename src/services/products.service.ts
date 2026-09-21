import "server-only";

import { cache } from "react";

import API_ROUTES from "@/constants/api-routes";
import { ApiError, http, type CachePolicy } from "@/lib/fetch";
import type { APIListParams, IPaginationResponse } from "@/types/api";
import type { Product } from "@/types/product";

export const PRODUCTS_PAGE_SIZE = 5;

/**
 * The single caching decision for the products list (reasoning in README →
 * "Caching decision"). Passed explicitly rather than relying on
 * `DEFAULT_CACHE`, so changing the http layer's default can never silently
 * change this page.
 */
const PRODUCTS_LIST_CACHE: CachePolicy = { mode: "no-store" };

/** Same policy as the list, so a product never shows two different prices. */
const PRODUCT_DETAILS_CACHE: CachePolicy = { mode: "no-store" };

/**
 * FakeStoreAPI supports `?limit` but has no offset, so it cannot return
 * "page N" by itself. The server fetches the collection and slices it —
 * the browser only ever receives the rows of the requested page.
 */
export async function getProducts({
  PageNumber = 1,
  PageSize = PRODUCTS_PAGE_SIZE,
}: APIListParams = {}): Promise<IPaginationResponse<Product>> {
  const products =
    (await http.get<Product[] | undefined>(
      API_ROUTES.PRODUCTS.GET_ALL_PRODUCTS,
      { cache: PRODUCTS_LIST_CACHE },
    )) ?? [];

  const start = (PageNumber - 1) * PageSize;

  return {
    pageNumber: PageNumber,
    totalPages: Math.max(1, Math.ceil(products.length / PageSize)),
    totalDataCount: products.length,
    data: products.slice(start, start + PageSize),
  };
}

/**
 * Only numeric ids reach the API. Besides skipping a pointless request, this
 * stops a crafted id like `..%2Fusers` from turning into `/users` upstream.
 */
function isValidProductId(id: string): boolean {
  return /^[1-9]\d*$/.test(id);
}

/**
 * Returns `null` when the product does not exist, so the page can call
 * `notFound()`. Real failures (network, 5xx) still throw and reach error.tsx.
 *
 * Wrapped in React `cache` because `generateMetadata` and the page both need
 * the product in the same request. Next's automatic fetch memoization does
 * not cover this: the http layer always passes an AbortSignal (for its
 * timeout), and a fetch with a signal is never memoized.
 */
export const getProductById = cache(
  async (id: string): Promise<Product | null> => {
    if (!isValidProductId(id)) return null;

    try {
      // FakeStoreAPI answers an unknown id with `200` and an empty body.
      const product = await http.get<Product | undefined>(
        API_ROUTES.PRODUCTS.GET_PRODUCT_BY_ID(id),
        { cache: PRODUCT_DETAILS_CACHE },
      );
      return product ?? null;
    } catch (error) {
      if (error instanceof ApiError && error.isNotFound) return null;
      throw error;
    }
  },
);
