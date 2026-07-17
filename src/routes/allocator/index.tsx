import { getCapeVariants } from "#/lib/api/server-functions";
import { createFileRoute, Link } from "@tanstack/react-router";

import { AllocatorFormPanel } from "./-form-panel";
import { AllocatorInputGuide } from "#/components/input-guide";
import { Skeleton } from "#/components/ui/skeleton";

export const Route = createFileRoute("/allocator/")({
  loader: async () => {
    try {
      return await getCapeVariants();
    } catch (error) {
      console.error("Error fetching CAPE variants:", error);
      return { variants: [] };
    }
  },
  component: RouteComponent,
  pendingComponent: AllocatorSkeleton,
});

function AllocatorSkeleton() {
  return (
    <main className="page-wrap px-4 py-12" aria-busy="true" aria-label="Loading allocator">
      <section className="island-shell p-6 sm:p-8">
        {/* Heading */}
        <Skeleton className="mb-3 h-10 w-36 sm:h-12" />
        {/* Description lines */}
        <Skeleton className="mb-2 h-4 w-full max-w-xl" />
        <Skeleton className="mb-1 h-4 w-48" />
        <Skeleton className="mb-6 h-4 w-56" />
        {/* Form fields */}
        <div className="mt-6 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
          <Skeleton className="mt-4 h-10 w-32" />
        </div>
      </section>
    </main>
  );
}

function RouteComponent() {
  const { variants } = Route.useLoaderData();

  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell p-6 sm:p-8">
        <h1 className="mb-3 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">Allocator</h1>
        <p className="mb-4 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
          Choose your risk aversion, volatility assumption, momentum blend, and CAPE variant.
        </p>
        <p className="max-w-2xl text-sm text-[var(--sea-ink-soft)]">
          <Link to="/market-data" className="underline">
            See live market inputs →
          </Link>
        </p>
        <p className="mb-4 max-w-2xl text-sm text-[var(--sea-ink-soft)]">
          <Link to="/sensitivity" className="underline">
            See how allocation varies across risk profiles →
          </Link>
        </p>
        <AllocatorInputGuide />
        <AllocatorFormPanel variants={variants} />
      </section>
    </main>
  );
}
