import { useStore } from "@tanstack/react-form";

import { Slider as ShadcnSlider } from "#/components/ui/slider";
import { Label } from "#/components/ui/label";
import { Button } from "#/components/ui/button";

import { useFieldContext, useFormContext } from "./-form-context";

export function SubscribeButton({ label }: { label: string }) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button type="submit" disabled={isSubmitting}>
          {label}
        </Button>
      )}
    </form.Subscribe>
  );
}

function ErrorMessages({ errors }: { errors: Array<string | { message: string }> }) {
  return (
    <>
      {errors.map((error) => (
        <div
          key={typeof error === "string" ? error : error.message}
          className="mt-1 font-bold text-red-500"
        >
          {typeof error === "string" ? error : error.message}
        </div>
      ))}
    </>
  );
}

export function Slider({
  label,
  min = 0,
  max = 100,
  step = 1,
}: {
  label: string;
  min?: number;
  max?: number;
  step?: number;
}) {
  const field = useFieldContext<number>();
  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={label} className="mb-2 text-xl font-bold">
          {label}
        </Label>
        <span className="text-sm text-muted-foreground">{field.state.value}</span>
      </div>
      <ShadcnSlider
        id={label}
        onBlur={field.handleBlur}
        value={[field.state.value]}
        onValueChange={(value) => field.handleChange(Array.isArray(value) ? value[0] : value)}
        min={min}
        max={max}
        step={step}
      />
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  );
}
