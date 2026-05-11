import { createFileRoute } from "@tanstack/react-router";

import { SensitivityInputGuide } from "#/components/input-guide";
import { SensitivityFormPanel } from "./-form-panel";

export const Route = createFileRoute("/sensitivity/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell p-6 sm:p-8">
        <h1 className="mb-3 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">Sensitivity</h1>
        <p className="mb-8 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
          Sweep CAPE and γ to see how equity allocation varies across market conditions and risk
          profiles.
        </p>
        <SensitivityInputGuide />
        <SensitivityFormPanel />
      </section>
    </main>
  );
}
