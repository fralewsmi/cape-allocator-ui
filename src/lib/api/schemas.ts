import { z } from "zod";

export const warningSeveritySchema = z.enum(["INFO", "WARN", "ERROR"]);

export const dataWarningSchema = z.object({
  severity: warningSeveritySchema,
  code: z.string(),
  message: z.string(),
});

export const allocationRequestSchema = z.object({
  gamma: z.number().min(0.5).max(20),
  sigma: z.number().min(0.05).max(0.6),
  momentum_weight: z.number().min(0).max(1),
  cape_variant: z.string().min(1),
});

export const manualAllocationRequestSchema = allocationRequestSchema.extend({
  cape_value: z.number().positive(),
  tips_yield: z.number().min(-0.1).max(0.2),
});

export const allocationResponseSchema = z.object({
  cape_value: z.number(),
  cape_variant: z.string(),
  tips_yield: z.number(),
  gamma: z.number(),
  sigma: z.number(),
  momentum_weight: z.number(),
  as_of_date: z.string(),
  constituent_coverage: z.number().nullable(),
  earnings_yield: z.number(),
  excess_earnings_yield: z.number(),
  merton_share_unconstrained: z.number(),
  momentum_signal: z.number(),
  f_momentum: z.number(),
  equity_allocation: z.number(),
  tips_allocation: z.number(),
  cer: z.number(),
  warnings: z.array(dataWarningSchema),
  historical_mean_cape: z.number(),
  cape_vs_mean_pct: z.number(),
  allocation_is_constrained: z.boolean(),
});

export const marketInputsResponseSchema = z.object({
  cape_value: z.number(),
  tips_yield: z.number(),
  cape_variant: z.string(),
  constituent_coverage: z.number().nullable(),
  eps_exclusion_rate: z.number().nullable(),
  as_of_date: z.string(),
  warnings: z.array(dataWarningSchema),
});

export const capeVariantInfoSchema = z.object({
  variant: z.string(),
  label: z.string(),
  oos_r2: z.number(),
  historical_mean: z.number(),
  earnings_window_years: z.number(),
  description: z.string(),
});

export const capeVariantsResponseSchema = z.object({
  variants: z.array(capeVariantInfoSchema),
});

export const healthResponseSchema = z.object({
  status: z.enum(["healthy", "degraded", "unhealthy", "error"]),
  cache_age_hours: z.number().nullable(),
  fred_reachable: z.boolean(),
  as_of: z.string().nullable(),
});

export const errorResponseSchema = z.object({
  detail: z.string(),
  warnings: z.array(z.unknown()).nullable().optional(),
});

export type AllocationRequest = z.infer<typeof allocationRequestSchema>;
export type AllocationResponse = z.infer<typeof allocationResponseSchema>;
export type CapeVariantInfo = z.infer<typeof capeVariantInfoSchema>;
export type HealthResponse = z.infer<typeof healthResponseSchema>;
