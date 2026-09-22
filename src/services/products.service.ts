import "server-only";

import { cache } from "react";

import API_ROUTES from "@/constants/api-routes";
import { ApiError, http, type CachePolicy } from "@/lib/fetch";
import type { APIListParams, IPaginationResponse } from "@/types/api";
import type { Product } from "@/types/product";

export const PRODUCTS_PAGE_SIZE = 5;

const PRODUCTS_LIST_CACHE: CachePolicy = { mode: "no-store" };

const PRODUCT_DETAILS_CACHE: CachePolicy = { mode: "no-store" };

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

export const getProductById = cache(
  async (id: string): Promise<Product | null> => {
    try {
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
