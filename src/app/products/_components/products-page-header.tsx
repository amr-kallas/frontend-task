import { PageHeader } from "@/components/layout/page-header";

/** Shared by page.tsx, loading.tsx and error.tsx so the header never jumps. */
export function ProductsPageHeader() {
  return (
    <PageHeader
      title="Products"
      description="Server-rendered on every request, paginated on the server."
    />
  );
}
