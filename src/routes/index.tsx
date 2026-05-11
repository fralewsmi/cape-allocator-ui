import { createFileRoute } from "@tanstack/react-router";
import { getHealth } from "#/lib/api/server-functions";
import type { HealthResponse } from "#/lib/api/schemas";

const loadHealth = async (): Promise<HealthResponse> => {
  try {
    return await getHealth();
  } catch (error) {
    console.error("Error fetching health status:", error);
    return {
      status: "error",
      cache_age_hours: null,
      fred_reachable: false,
      as_of: null,
    };
  }
};

export const Route = createFileRoute("/")({ component: App, loader: loadHealth });

const HealthCheck = () => {
  const health = Route.useLoaderData();

  return (
    <div className="island-shell mt-10 p-6 sm:p-8">
      <p className="island-kicker mb-2">Health Check</p>
      <h2 className="mb-3 text-2xl font-bold text-[var(--sea-ink)]">API Status</h2>
      <p className="mb-3 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
        The API is currently:{" "}
        <span className="font-semibold text-[var(--lagoon-deep)]">{health.status}</span>
      </p>
    </div>
  );
};

function App() {
  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <section className="island-shell rise-in relative overflow-hidden px-6 py-10 sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56  bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56  bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]" />
        <p className="island-kicker mb-3">TanStack Start Base Template</p>
        <h1 className="mb-5 max-w-3xl text-4xl leading-[1.02] font-bold tracking-tight text-[var(--sea-ink)] sm:text-6xl">
          Component CAPE + Merton Rule Portfolio Allocator
        </h1>
        <p className="mb-8 max-w-2xl text-base text-[var(--sea-ink-soft)] sm:text-lg">
          This is a portfolio allocation model which uses the Component CAPE and 12-month momentum
          to determine an optimal equity allocation.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="/allocator"
            className="border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] px-5 py-2.5 text-sm font-semibold text-[var(--lagoon-deep)] no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)]"
          >
            Go to Allocator
          </a>
        </div>
      </section>

      <HealthCheck />
    </main>
  );
}
