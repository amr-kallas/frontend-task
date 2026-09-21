export type PageItem = number | "ellipsis-start" | "ellipsis-end";

function range(from: number, to: number): number[] {
  return Array.from({ length: to - from + 1 }, (_, i) => from + i);
}

/**
 * Which page buttons to show: always the first and last page, `siblings`
 * pages on each side of the current one, and an ellipsis for each gap.
 * The result always has the same length, so the bar does not jump around.
 *
 *   getPageItems(5, 10) → [1, "ellipsis-start", 4, 5, 6, "ellipsis-end", 10]
 *   getPageItems(2, 4)  → [1, 2, 3, 4]
 */
export function getPageItems(
  currentPage: number,
  totalPages: number,
  siblings = 1,
): PageItem[] {
  // first + last + current + 2 ellipses + siblings on both sides
  const maxItems = siblings * 2 + 5;
  if (totalPages <= maxItems) return range(1, totalPages);

  const left = Math.max(currentPage - siblings, 1);
  const right = Math.min(currentPage + siblings, totalPages);
  const edgeBlock = siblings * 2 + 3;

  if (left <= 2) {
    return [...range(1, edgeBlock), "ellipsis-end", totalPages];
  }
  if (right >= totalPages - 1) {
    return [1, "ellipsis-start", ...range(totalPages - edgeBlock + 1, totalPages)];
  }
  return [1, "ellipsis-start", ...range(left, right), "ellipsis-end", totalPages];
}
