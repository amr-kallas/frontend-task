import Link from "next/link";

import { buttonClasses } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ROUTES } from "@/constants/routes";

export default function NotFound() {
  return (
    <EmptyState
      eyebrow="404"
      title="Page not found"
      description="The page you're looking for doesn't exist."
    >
      <Link href={ROUTES.PRODUCTS} className={buttonClasses()}>
        Browse products
      </Link>
    </EmptyState>
  );
}
