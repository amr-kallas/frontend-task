import { getPageItems } from "./get-page-items";
import { PaginationLink } from "./pagination-link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  getPageHref: (page: number) => string;
};

export function Pagination({
  currentPage,
  totalPages,
  getPageHref,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav aria-label="Pagination">
      <ul className="flex flex-wrap items-center justify-center gap-1">
        <li>
          <PaginationLink
            href={hasPrevious ? getPageHref(currentPage - 1) : null}
            aria-label="Previous page"
          >
            ‹ Prev
          </PaginationLink>
        </li>

        {getPageItems(currentPage, totalPages).map((item) =>
          typeof item === "number" ? (
            <li key={item}>
              <PaginationLink
                href={getPageHref(item)}
                isActive={item === currentPage}
                aria-label={`Page ${item}`}
              >
                {item}
              </PaginationLink>
            </li>
          ) : (
            <li key={item} aria-hidden className="px-2 text-zinc-400">
              …
            </li>
          ),
        )}

        <li>
          <PaginationLink
            href={hasNext ? getPageHref(currentPage + 1) : null}
            aria-label="Next page"
          >
            Next ›
          </PaginationLink>
        </li>
      </ul>
    </nav>
  );
}
