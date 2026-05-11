import { getCapeVariants } from "#/lib/api/server-functions";
import { createFileRoute, Link } from "@tanstack/react-router";

import { AllocatorFormPanel } from "./-form-panel";
import { AllocatorInputGuide } from "#/components/input-guide";

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
});

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
