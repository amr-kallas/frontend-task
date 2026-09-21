import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export { TableSkeleton } from "./table-skeleton";

export type TableColumn<T> = {
  /** Unique per table; used as the React key of the column's cells. */
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  /** Applied to the header cell and every body cell of the column. */
  className?: string;
};

type TableProps<T> = {
  columns: TableColumn<T>[];
  data: T[];
  getRowKey: (row: T) => string | number;
  /** Read by screen readers only. */
  caption?: string;
  emptyMessage?: ReactNode;
};

/**
 * Presentational and generic: it knows nothing about products. Each page
 * describes its columns and hands over already-fetched rows.
 */
export function Table<T>({
  columns,
  data,
  getRowKey,
  caption,
  emptyMessage = "No data to display.",
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
      <table className="w-full text-left text-sm">
        {caption && <caption className="sr-only">{caption}</caption>}

        <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={cn("px-4 py-3 font-medium", column.className)}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center text-zinc-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={getRowKey(row)}
                className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/60"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn("px-4 py-3 align-middle", column.className)}
                  >
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
