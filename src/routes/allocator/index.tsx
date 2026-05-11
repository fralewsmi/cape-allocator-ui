import { getCapeVariants } from "#/lib/api/server-functions";
import { createFileRoute } from "@tanstack/react-router";

import { AllocatorFormPanel } from "./-form-panel";
import { InputGuide } from "./-input-guide";

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
        <p className="island-kicker mb-2">Live allocator</p>
        <h1 className="mb-3 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">Allocator</h1>
        <p className="mb-8 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
          Choose your risk aversion, volatility assumption, momentum blend, and CAPE variant.
        </p>
        <InputGuide />
        <AllocatorFormPanel variants={variants} />
      </section>
    </main>
  );
}
