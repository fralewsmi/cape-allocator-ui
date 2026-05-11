import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "#/components/ui/chart";
import { CartesianGrid, Line, LineChart, ReferenceLine, XAxis, YAxis } from "recharts";
import type { SensitivityDataPoint } from "#/lib/api/schemas";

export const HISTORICAL_MEAN_CAPE = 29.74;

const percentFormatter = new Intl.NumberFormat("en", {
  style: "percent",
  maximumFractionDigits: 0,
});

function pivotData(data: Array<SensitivityDataPoint>) {
  // Sort ascending so Line declarations and legend are always γ=1 first
  const gammas = [...new Set(data.map((d) => d.gamma))].sort((a, b) => a - b);
  const byCapeThenGamma = new Map<number, Record<string, number>>();

  for (const row of data) {
    if (!byCapeThenGamma.has(row.cape)) {
      byCapeThenGamma.set(row.cape, { cape: row.cape });
    }
    byCapeThenGamma.get(row.cape)![`gamma_${row.gamma}`] = row.equity_allocation;
  }

  const rows = [...byCapeThenGamma.values()].sort((a, b) => a.cape - b.cape);
  return { rows, gammas };
}

function buildChartConfig(gammas: Array<number>): ChartConfig {
  return Object.fromEntries(
    gammas.map((g) => [
      `gamma_${g}`,
      {
        label: `γ = ${g}`,
        color: `var(--gamma-${g})`,
      },
    ]),
  );
}

interface SensitivityChartProps {
  data: Array<SensitivityDataPoint>;
  isStreaming: boolean;
}

export function SensitivityChart({ data, isStreaming }: SensitivityChartProps) {
  const { rows, gammas } = pivotData(data);
  const config = buildChartConfig(gammas);

  return (
    <section
      className="mt-6 transition-opacity duration-300"
      style={{ opacity: isStreaming && data.length === 0 ? 0 : 1 }}
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs text-[var(--sea-ink-soft)]">
          Equity allocation (%) vs CAPE ratio — one curve per γ
        </p>
        {isStreaming && <span className="text-xs text-[var(--lagoon-deep)]">Streaming…</span>}
      </div>

      <ChartContainer config={config} className="h-96 w-full">
        <LineChart data={rows} margin={{ top: 4, right: 16, bottom: 16, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
          <XAxis
            dataKey="cape"
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => String(v)}
            label={{
              value: "CAPE ratio",
              position: "insideBottom",
              offset: -8,
              fontSize: 11,
              fill: "var(--sea-ink-soft)",
            }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => percentFormatter.format(v)}
            domain={[0, 1]}
            width={48}
          />
          <ReferenceLine
            x={HISTORICAL_MEAN_CAPE}
            stroke="var(--sea-ink-soft)"
            strokeDasharray="4 3"
            strokeWidth={1}
            label={{
              value: `hist. mean / ${HISTORICAL_MEAN_CAPE}×`,
              position: "insideTopRight",
              fontSize: 10,
              fill: "var(--sea-ink-soft)",
            }}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(_label, payload) => {
                  const cape = payload?.[0]?.payload?.cape;
                  return cape != null ? `CAPE ${cape}` : "CAPE";
                }}
                formatter={(value) =>
                  typeof value === "number" ? percentFormatter.format(value) : String(value)
                }
                indicator="line"
              />
            }
          />
          <ChartLegend
            content={
              <ChartLegendContent
                payload={gammas.map((g) => ({
                  value: `gamma_${g}`,
                  type: "line" as const,
                  color: `var(--gamma-${g})`,
                  dataKey: `gamma_${g}`,
                }))}
              />
            }
          />
          {gammas.map((g) => (
            <Line
              key={g}
              type="monotone"
              dataKey={`gamma_${g}`}
              stroke={`var(--color-gamma_${g})`}
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 3 }}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ChartContainer>
    </section>
  );
}
