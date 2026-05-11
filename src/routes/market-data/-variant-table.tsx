import type { CapeVariantInfo } from "#/lib/api/schemas";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";

interface VariantTableProps {
  variants: CapeVariantInfo[];
}

export function VariantTable({ variants }: VariantTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          CAPE Variants
        </CardTitle>
      </CardHeader>
      <CardContent>
        {variants.length === 0 ? (
          <p className="text-sm text-muted-foreground">Variant data unavailable</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-2 text-left font-semibold text-muted-foreground">Label</th>
                  <th className="pb-2 text-right font-semibold text-muted-foreground">
                    Historical Mean
                  </th>
                  <th className="pb-2 text-right font-semibold text-muted-foreground">OOS R²</th>
                </tr>
              </thead>
              <tbody>
                {variants.map((v) => {
                  const isDefault = v.variant === "component_10y";
                  return (
                    <tr key={v.variant} className="border-b border-border last:border-0">
                      <td className="py-2 pr-4 text-left text-[var(--sea-ink)]">
                        <span className="inline-flex items-center gap-2">
                          {v.label}
                          {isDefault && (
                            <span
                              className="rounded px-1.5 py-0.5 text-xs font-semibold"
                              style={{
                                color: "var(--lagoon-deep)",
                                backgroundColor:
                                  "color-mix(in srgb, var(--lagoon-deep) 12%, transparent)",
                              }}
                            >
                              Default
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="py-2 text-right tabular-nums text-[var(--sea-ink)]">
                        {v.historical_mean.toFixed(2)}
                      </td>
                      <td className="py-2 text-right tabular-nums text-[var(--sea-ink)]">
                        {v.oos_r2.toFixed(3)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
