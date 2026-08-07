import type { CapeVariantInfo, MarketInputsResponse } from "#/lib/api/schemas";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import {
  calculateCapeVsMean,
  calculateExcessEarningsYield,
  calculateImpliedEarningsYield,
  numberFormatter,
  percentFormatter,
  percentFormatter1dp,
} from "./-utils";

interface MetricCardProps {
  label: string;
  value: string;
  subtext?: string;
  valueColor?: string;
}

export function MetricCard({ label, value, subtext, valueColor }: MetricCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p
          className="text-2xl font-bold text-[var(--sea-ink)]"
          style={valueColor ? { color: valueColor } : undefined}
        >
          {value}
        </p>
        {subtext && <p className="mt-1 text-sm text-muted-foreground">{subtext}</p>}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// CAPE value with historical mean comparison
// ---------------------------------------------------------------------------

interface CapeMetricCardProps {
  marketInputs: MarketInputsResponse;
  variants: CapeVariantInfo[];
}

export function CapeMetricCard({ marketInputs, variants }: CapeMetricCardProps) {
  const { cape_value } = marketInputs;
  const component10y = variants.find((v) => v.variant === "component_10y");
  const historicalMean = component10y?.historical_mean;

  let subtext: string | undefined;
  let valueColor: string | undefined;

  if (historicalMean !== undefined) {
    const diff = calculateCapeVsMean(cape_value, historicalMean);
    const direction = diff >= 0 ? "above mean" : "below mean";
    subtext = `${numberFormatter.format(Math.abs(diff * 100))}% ${direction}`;
    valueColor = diff >= 0 ? "var(--status-negative)" : "var(--status-positive)";
  }

  return (
    <MetricCard
      label="CAPE Value"
      value={numberFormatter.format(cape_value)}
      subtext={subtext}
      valueColor={valueColor}
    />
  );
}

export function TipsYieldMetricCard({ tipsYield }: { tipsYield: number }) {
  // The API already returns a decimal ratio, for example 0.0196 for 1.96%.
  return <MetricCard label="10-yr TIPS Yield" value={percentFormatter.format(tipsYield)} />;
}

export function ImpliedEarningsYieldMetricCard({ capeValue }: { capeValue: number }) {
  return (
    <MetricCard
      label="Implied Earnings Yield (1/CAPE)"
      value={percentFormatter.format(calculateImpliedEarningsYield(capeValue))}
    />
  );
}

export function ExcessEarningsYieldMetricCard({
  capeValue,
  tipsYield,
}: {
  capeValue: number;
  tipsYield: number;
}) {
  const excessYield = calculateExcessEarningsYield(capeValue, tipsYield);
  const valueColor = excessYield < 0 ? "var(--status-negative)" : "var(--status-positive)";
  return (
    <MetricCard
      label="Excess Earnings Yield"
      value={percentFormatter.format(excessYield)}
      valueColor={valueColor}
    />
  );
}

export function ConstituentCoverageMetricCard({
  constituentCoverage,
}: {
  constituentCoverage: number | null;
}) {
  const displayValue =
    constituentCoverage !== null ? percentFormatter1dp.format(constituentCoverage) : "N/A";
  return <MetricCard label="Constituent Coverage" value={displayValue} />;
}

export function EpsExclusionRateMetricCard({
  epsExclusionRate,
}: {
  epsExclusionRate: number | null;
}) {
  const displayValue =
    epsExclusionRate !== null ? percentFormatter1dp.format(epsExclusionRate) : "N/A";
  return <MetricCard label="EPS Exclusion Rate" value={displayValue} />;
}
