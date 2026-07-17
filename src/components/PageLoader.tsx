import { Skeleton } from "#/components/ui/skeleton";

export default function PageLoader() {
  return (
    <main className="page-wrap px-4 py-12" aria-busy="true" aria-label="Loading page">
      <section className="island-shell p-6 sm:p-8">
        {/* Page heading */}
        <Skeleton className="mb-3 h-10 w-48 sm:h-12" />
        {/* Subtitle */}
        <Skeleton className="mb-2 h-4 w-full max-w-xl" />
        <Skeleton className="mb-8 h-4 w-3/4 max-w-lg" />
        {/* Content block */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </section>
    </main>
  );
}
