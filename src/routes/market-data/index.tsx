import { getCapeVariants, getMarketInputs } from "#/lib/api/server-functions";
import { createFileRoute } from "@tanstack/react-router";

import { ExcessEarningsYieldCallout } from "./-callout";
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
});

function RouteComponent() {
  const { marketInputs, variants } = Route.useLoaderData();

  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell p-6 sm:p-8">
        <h1 className="mb-3 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">Market Data</h1>
        <p className="mb-8 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
          Live market inputs driving the Merton ratio calculation.{" "}
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
            <ExcessEarningsYieldCallout
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
      <p className="text-base font-semibold text-[var(--sea-ink)]">
        Market data could not be loaded
      </p>
      <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">
        The market inputs service is temporarily unavailable. Please try again later.
      </p>
    </div>
  );
}
