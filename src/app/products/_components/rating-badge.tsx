import type { ProductRating } from "@/types/product";

type RatingBadgeProps = {
  rating: ProductRating;
};

export function RatingBadge({ rating }: RatingBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap">
      <span aria-hidden className="text-amber-500">
        ★
      </span>
      <span aria-hidden className="font-medium">
        {rating.rate.toFixed(1)}
      </span>
      <span aria-hidden className="text-zinc-500">
        ({rating.count})
      </span>
      <span className="sr-only">
        Rated {rating.rate} out of 5 by {rating.count} customers
      </span>
    </span>
  );
}
