import { Skeleton } from "@/components/ui/skeleton";

type TableSkeletonProps = {
  columns: number;
  rows: number;
};

/** Same frame as <Table>, so swapping one for the other causes no layout shift. */
export function TableSkeleton({ columns, rows }: TableSkeletonProps) {
  return (
    <div
      role="status"
      className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800"
    >
      <span className="sr-only">Loading…</span>

      <div className="flex gap-4 bg-zinc-50 px-4 py-3.5 dark:bg-zinc-900">
        {Array.from({ length: columns }, (_, i) => (
          <Skeleton key={i} className="h-3 flex-1" />
        ))}
      </div>

      <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
        {Array.from({ length: rows }, (_, row) => (
          <div key={row} className="flex items-center gap-4 px-4 py-3">
            {Array.from({ length: columns }, (_, col) => (
              <Skeleton key={col} className="h-10 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
