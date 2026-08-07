import { calculateExcessEarningsYield } from "./-utils";

interface ExcessYieldCalloutProps {
  capeValue: number;
  tipsYield: number;
}

export function ExcessYieldCallout({ capeValue, tipsYield }: ExcessYieldCalloutProps) {
  const excessYield = calculateExcessEarningsYield(capeValue, tipsYield);

  if (excessYield >= 0) return null;

  return (
    <div
      className="mt-6 rounded-lg border-2 border-[var(--status-negative)] p-4 sm:p-5"
      style={{ backgroundColor: "color-mix(in srgb, var(--status-negative) 10%, transparent)" }}
    >
      <p className="text-sm font-bold text-[var(--status-negative)]">
        Equities currently offer no real premium over TIPS
      </p>
    </div>
  );
}
