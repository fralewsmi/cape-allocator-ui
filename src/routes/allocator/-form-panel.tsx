import { computeAllocation } from "#/lib/api/server-functions";
import {
  allocationRequestSchema,
  type AllocationResponse,
  type CapeVariantInfo,
} from "#/lib/api/schemas";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { useAppForm } from "./-form";

const bounds = {
  gamma: { min: 0.5, max: 20, step: 0.5 },
  sigma: { min: 0.05, max: 0.6, step: 0.01 },
  momentum_weight: { min: 0, max: 1, step: 0.05 },
};

const percentFormatter = new Intl.NumberFormat("en", {
  style: "percent",
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat("en", { maximumFractionDigits: 2 });

function Result({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-[var(--sea-ink)]">{value}</p>
      </CardContent>
    </Card>
  );
}

function ResultPanel({ result }: { result: AllocationResponse }) {
  return (
    <section className="border-t border-[var(--line)] pt-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Result label="Equity" value={percentFormatter.format(result.equity_allocation)} />
        <Result label="TIPS" value={percentFormatter.format(result.tips_allocation)} />
        <Result label="CAPE" value={numberFormatter.format(result.cape_value)} />
        <Result
          label="Excess Yield"
          value={percentFormatter.format(result.excess_earnings_yield)}
        />
      </div>

      <dl className="mt-6 grid gap-x-8 gap-y-3 text-sm text-[var(--sea-ink-soft)] sm:grid-cols-2">
        <div className="flex justify-between gap-4">
          <dt>Merton share</dt>
          <dd className="font-semibold text-[var(--sea-ink)]">
            {percentFormatter.format(result.merton_share_unconstrained)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Momentum signal</dt>
          <dd className="font-semibold text-[var(--sea-ink)]">
            {percentFormatter.format(result.momentum_signal)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Certainty equivalent return</dt>
          <dd className="font-semibold text-[var(--sea-ink)]">
            {percentFormatter.format(result.cer)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>CAPE vs mean</dt>
          <dd className="font-semibold text-[var(--sea-ink)]">
            {numberFormatter.format(result.cape_vs_mean_pct)}%
          </dd>
        </div>
      </dl>

      {result.warnings.length > 0 && (
        <div className="mt-6 space-y-2">
          {result.warnings.map((warning) => (
            <p
              key={`${warning.severity}-${warning.code}`}
              className="border-l-2 border-[var(--status-warning)] pl-3 text-sm text-[var(--sea-ink-soft)]"
            >
              <span className="font-semibold text-[var(--sea-ink)]">{warning.code}:</span>{" "}
              {warning.message}
            </p>
          ))}
        </div>
      )}
    </section>
  );
}

export function AllocatorFormPanel({ variants }: { variants: Array<CapeVariantInfo> }) {
  const submitAllocation = useServerFn(computeAllocation);
  const [result, setResult] = useState<AllocationResponse | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useAppForm({
    defaultValues: {
      gamma: 2,
      sigma: 0.18,
      momentum_weight: 0.5,
      cape_variant: variants[0]?.variant ?? "",
    },
    validators: {
      onBlur: allocationRequestSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null);

      try {
        const response = await submitAllocation({ data: value });
        setResult(response);
      } catch (error) {
        setResult(null);
        setSubmitError(error instanceof Error ? error.message : "Unable to compute allocation.");
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      <form.AppField name="gamma">
        {(field) => (
          <field.Slider
            label="Gamma"
            min={bounds.gamma.min}
            max={bounds.gamma.max}
            step={bounds.gamma.step}
          />
        )}
      </form.AppField>

      <form.AppField name="sigma">
        {(field) => (
          <field.Slider
            label="Volatility"
            min={bounds.sigma.min}
            max={bounds.sigma.max}
            step={bounds.sigma.step}
          />
        )}
      </form.AppField>

      <form.AppField name="momentum_weight">
        {(field) => (
          <field.Slider
            label="Momentum Weight"
            min={bounds.momentum_weight.min}
            max={bounds.momentum_weight.max}
            step={bounds.momentum_weight.step}
          />
        )}
      </form.AppField>

      <form.AppField name="cape_variant">
        {(field) => (
          <field.Select
            label="CAPE Variant"
            values={variants.map((variant) => ({ label: variant.label, value: variant.variant }))}
            placeholder="Select a variant"
          />
        )}
      </form.AppField>

      <div className="flex justify-end">
        <form.AppForm>
          <form.SubscribeButton label="Submit" />
        </form.AppForm>
      </div>

      {submitError && (
        <p className="border-l-2 border-[var(--status-negative)] pl-3 text-sm font-semibold text-[var(--status-negative)]">
          {submitError}
        </p>
      )}

      {result && <ResultPanel result={result} />}
    </form>
  );
}
