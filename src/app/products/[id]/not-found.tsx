import Link from "next/link";

import { buttonClasses } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ROUTES } from "@/constants/routes";

/** Rendered with a 404 status when the page calls notFound(). */
export default function ProductNotFound() {
  return (
    <EmptyState
      eyebrow="404"
      title="Product not found"
      description="This product doesn't exist or is no longer available."
    >
      <Link href={ROUTES.PRODUCTS} className={buttonClasses()}>
        Back to products
      </Link>
    </EmptyState>
  );
}
