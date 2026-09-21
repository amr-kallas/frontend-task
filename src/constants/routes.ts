export const ROUTES = {
  PRODUCTS: "/products",
  PRODUCT_DETAILS: (id: number | string) => `/products/${id}`,
  ADMIN: "/admin",
  LOGIN: "/login",
} as const;
