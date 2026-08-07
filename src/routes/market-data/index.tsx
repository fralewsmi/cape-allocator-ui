import { getCapeVariants, getMarketInputs } from "#/lib/api/server-functions";
import { createFileRoute } from "@tanstack/react-router";

import { ExcessYieldCallout } from "./-callout";
import {
  CapeMetricCard,
  ConstituentCoverageMetricCard,
  EpsExclusionRateMetricCard,
  ExcessEarningsYieldMetricCard,
  ImpliedEarningsYieldMetricCard,
  TipsYieldMetricCard,
} from "./-metric-cards";
import { VariantTable } from "./-variant-table";
import { WarningsList } from "./-warnings-list";
import { Skeleton } from "#/components/ui/skeleton";

export const Route = createFileRoute("/market-data/")({
  loader: async () => {
    try {
      const [marketInputs, capeVariantsResponse] = await Promise.all([
        getMarketInputs(),
        getCapeVariants(),
      ]);
      return { marketInputs, variants: capeVariantsResponse.variants };
    } catch (error) {
      console.error("Error fetching market data:", error);
      return { marketInputs: null, variants: [] };
    }
  },
  component: RouteComponent,
  pendingComponent: MarketDataSkeleton,
});

function MarketDataSkeleton() {
  return (
    <main className="page-wrap px-4 py-12" aria-busy="true" aria-label="Loading market data">
      <section className="island-shell p-6 sm:p-8">
        <Skeleton className="mb-3 h-10 w-44 sm:h-12" />
        <Skeleton className="mb-8 h-4 w-full max-w-lg" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="island-shell p-4">
              <Skeleton className="mb-2 h-3 w-28" />
              <Skeleton className="mb-1 h-8 w-24" />
              <Skeleton className="h-3 w-36" />
            </div>
          ))}
        </div>
        <Skeleton className="mt-6 h-16 w-full" />
        <div className="mt-6 space-y-2">
          <Skeleton className="h-8 w-full" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </section>
    </main>
  );
}

function RouteComponent() {
  const { marketInputs, variants } = Route.useLoaderData();

  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell p-6 sm:p-8">
        <h1 className="mb-3 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">Market Data</h1>
        <p className="mb-8 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
          Live market inputs drive the Merton ratio calculation.{" "}
          {marketInputs && "As of " + marketInputs.as_of_date}
        </p>

        {marketInputs === null ? (
          <ErrorState />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <CapeMetricCard marketInputs={marketInputs} variants={variants} />
              <TipsYieldMetricCard tipsYield={marketInputs.tips_yield} />
              <ImpliedEarningsYieldMetricCard capeValue={marketInputs.cape_value} />
              <ExcessEarningsYieldMetricCard
                capeValue={marketInputs.cape_value}
                tipsYield={marketInputs.tips_yield}
              />
              <ConstituentCoverageMetricCard
                constituentCoverage={marketInputs.constituent_coverage}
              />
              <EpsExclusionRateMetricCard epsExclusionRate={marketInputs.eps_exclusion_rate} />
            </div>
            <ExcessYieldCallout
              capeValue={marketInputs.cape_value}
              tipsYield={marketInputs.tips_yield}
            />
            <div className="mt-6">
              <VariantTable variants={variants} />
            </div>
            <WarningsList warnings={marketInputs.warnings} />
          </>
        )}
      </section>
    </main>
  );
}

function ErrorState() {
  return (
    <div className="rounded-lg border border-[var(--status-negative)] bg-[var(--surface-strong)] p-6">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--status-negative)]">
        Error
      </p>
      <p className="text-base font-semibold text-[var(--sea-ink)]">Market data did not load</p>
      <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">
        The market inputs service is temporarily unavailable. Please try again later.
      </p>
    </div>
  );
}
