import { useStore } from "@tanstack/react-form";

import { useFieldContext } from "#/hooks/allocator.form-context";

import { Slider as ShadcnSlider } from "#/components/ui/slider";
import { Label } from "#/components/ui/label";
import { Button } from "./ui/button";
import { useFormContext } from "#/hooks/allocator.form-context";
import * as ShadcnSelect from "#/components/ui/select";

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
          className="text-red-500 mt-1 font-bold"
        >
          {typeof error === "string" ? error : error.message}
        </div>
      ))}
    </>
  );
}

export function Select({
  label,
  values,
  placeholder,
}: {
  label: string;
  values: Array<{ label: string; value: string }>;
  placeholder?: string;
}) {
  const field = useFieldContext<string>();
  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <div>
      <ShadcnSelect.Select
        name={field.name}
        value={field.state.value}
        onValueChange={(value) => field.handleChange(value)}
      >
        <ShadcnSelect.SelectTrigger className="w-full">
          <ShadcnSelect.SelectValue placeholder={placeholder} />
        </ShadcnSelect.SelectTrigger>
        <ShadcnSelect.SelectContent className="bg-background text-foreground">
          <ShadcnSelect.SelectGroup>
            <ShadcnSelect.SelectLabel>{label}</ShadcnSelect.SelectLabel>
            {values.map((value) => (
              <ShadcnSelect.SelectItem
                key={value.value}
                value={value.value}
                className="text-foreground"
              >
                {value.label}
              </ShadcnSelect.SelectItem>
            ))}
          </ShadcnSelect.SelectGroup>
        </ShadcnSelect.SelectContent>
      </ShadcnSelect.Select>
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  );
}

export function Slider({
  label,
  min = 0,
  max = 100,
}: {
  label: string;
  min?: number;
  max?: number;
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
        onValueChange={(value) => field.handleChange(value[0])}
        min={min}
        max={max}
      />
      {field.state.meta.isTouched && <ErrorMessages errors={errors} />}
    </div>
  );
}
