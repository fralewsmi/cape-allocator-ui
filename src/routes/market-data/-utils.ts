export const percentFormatter = new Intl.NumberFormat("en", {
  style: "percent",
  maximumFractionDigits: 2,
});

export const percentFormatter1dp = new Intl.NumberFormat("en", {
  style: "percent",
  maximumFractionDigits: 1,
});

export const numberFormatter = new Intl.NumberFormat("en", { maximumFractionDigits: 2 });

export function calculateImpliedEarningsYield(cape: number): number {
  return 1 / cape;
}

export function calculateExcessEarningsYield(cape: number, tipsYield: number): number {
  return 1 / cape - tipsYield;
}

export function calculateCapeVsMean(cape: number, historicalMean: number): number {
  return cape / historicalMean - 1;
}
