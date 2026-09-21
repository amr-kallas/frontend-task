type SearchParamValue = string | string[] | undefined;

/**
 * `?page=` comes straight from the URL, so anything that is not a positive
 * integer (`?page=abc`, `?page=-2`, `?page=1&page=2`) falls back to page 1.
 */
export function parsePageParam(value: SearchParamValue): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const page = Number(raw);
  return Number.isInteger(page) && page >= 1 ? page : 1;
}
