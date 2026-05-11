import type { DataWarning } from "#/lib/api/schemas";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";

const SEVERITY_COLOUR: Record<DataWarning["severity"], string> = {
  INFO: "var(--status-info)",
  WARN: "var(--status-warning)",
  ERROR: "var(--status-negative)",
};

interface WarningsListProps {
  warnings: DataWarning[];
}

export function WarningsList({ warnings }: WarningsListProps) {
  if (warnings.length === 0) return null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Data Warnings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {warnings.map((warning, index) => (
            <li
              key={index}
              className="text-sm font-medium"
              style={{ color: SEVERITY_COLOUR[warning.severity] }}
            >
              {warning.message}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
