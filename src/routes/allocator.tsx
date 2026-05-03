import { useAppForm } from "#/hooks/allocator.form";
import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

export const Route = createFileRoute("/allocator")({
  component: RouteComponent,
});

const bounds = {
  gammma: { min: 0, max: 10 },
  sigma: { min: 0, max: 1 },
  momentumWeight: { min: 0, max: 1 },
};

const schema = z.object({
  gammma: z.number().min(bounds.gammma.min).max(bounds.gammma.max),
  sigma: z.number().min(bounds.sigma.min).max(bounds.sigma.max),
  momentumWeight: z.number().min(bounds.momentumWeight.min).max(bounds.momentumWeight.max),
  variant: z.enum(["component_10y", "component_5y", "component_ewma", "aggregate_10y"]),
});

function AllocatorForm() {
  const form = useAppForm({
    defaultValues: {
      gammma: 2,
      sigma: 0.18,
      momentumWeight: 0.5,
      variant: "component_10y",
    },
    validators: {
      onBlur: schema,
    },
    onSubmit: ({ value }) => {
      console.log(value);
      // Show success message
      alert("Form submitted successfully!");
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
      <form.AppField name="gammma">
        {(field) => <field.Slider label="Gamma" min={bounds.gammma.min} max={bounds.gammma.max} />}
      </form.AppField>

      <form.AppField name="sigma">
        {(field) => (
          <field.Slider label="Volatility" min={bounds.sigma.min} max={bounds.sigma.max} />
        )}
      </form.AppField>

      <form.AppField name="momentumWeight">
        {(field) => (
          <field.Slider
            label="Momentum Weight"
            min={bounds.momentumWeight.min}
            max={bounds.momentumWeight.max}
          />
        )}
      </form.AppField>

      <form.AppField name="variant">
        {(field) => (
          <field.Select
            label="CAPE Variant"
            values={[
              { label: "10 Year Component CAPE", value: "component_10y" },
              { label: "5 Year Component CAPE", value: "component_5y" },
              { label: "EWMA Component CAPE", value: "component_ewma" },
              { label: "Aggregate 10 Year CAPE", value: "aggregate_10y" },
            ]}
            placeholder="Select a variant"
          />
        )}
      </form.AppField>

      <div className="flex justify-end">
        <form.AppForm>
          <form.SubscribeButton label="Submit" />
        </form.AppForm>
      </div>
    </form>
  );
}

function RouteComponent() {
  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">About</p>
        <h1 className="display-title mb-3 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">
          Allocator
        </h1>
        <p className="mb-3 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
          TanStack Start gives you type-safe routing, server functions, and modern SSR defaults. Use
          this as a clean foundation, then layer in your own routes, styling, and add-ons.
        </p>
        <AllocatorForm />
      </section>
    </main>
  );
}
