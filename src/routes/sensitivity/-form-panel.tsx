import { sensitivityDataPointSchema, type SensitivityDataPoint } from "#/lib/api/schemas";
import { Slider } from "#/components/ui/slider";
import { Label } from "#/components/ui/label";
import { useState, useEffect, useRef, useCallback } from "react";
import { SensitivityChart } from "./-chart";

const FIXED = {
  tips_yield: 0.017,
  sigma: 0.18,
  cape_min: 5,
  cape_max: 80,
  cape_step: 0.5,
} as const;

const DEBOUNCE_MS = 400;

const percentFormatter = new Intl.NumberFormat("en", {
  style: "percent",
  maximumFractionDigits: 2,
});

async function* streamSensitivity(
  gammaMin: number,
  gammaMax: number,
  signal: AbortSignal,
): AsyncGenerator<SensitivityDataPoint> {
  const params = new URLSearchParams({
    gamma_min: String(gammaMin),
    gamma_max: String(gammaMax),
    cape_min: String(FIXED.cape_min),
    cape_max: String(FIXED.cape_max),
    cape_step: String(FIXED.cape_step),
    tips_yield: String(FIXED.tips_yield),
    sigma: String(FIXED.sigma),
  });

  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000"}/api/sensitivity?${params}`,
    { signal },
  );

  if (!res.ok || !res.body) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Sensitivity request failed with ${res.status}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const parsed = sensitivityDataPointSchema.safeParse(JSON.parse(trimmed));
      if (parsed.success) yield parsed.data;
    }
  }

  if (buffer.trim()) {
    const parsed = sensitivityDataPointSchema.safeParse(JSON.parse(buffer.trim()));
    if (parsed.success) yield parsed.data;
  }
}

function FixedParam({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3">
      <span className="text-sm text-[var(--sea-ink-soft)]">{label}</span>
      <span className="font-mono text-sm font-semibold text-[var(--sea-ink)]">{value}</span>
    </div>
  );
}

export function SensitivityFormPanel() {
  const [gammaMin, setGammaMin] = useState(1);
  const [gammaMax, setGammaMax] = useState(10);
  const [data, setData] = useState<Array<SensitivityDataPoint>>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  // Buffer incoming points between animation-frame flushes to avoid a state update per row
  const pendingRef = useRef<Array<SensitivityDataPoint>>([]);
  const rafRef = useRef<number | null>(null);

  const flushPending = useCallback(() => {
    rafRef.current = null;
    if (pendingRef.current.length === 0) return;
    const batch = pendingRef.current;
    pendingRef.current = [];
    setData((prev) => [...prev, ...batch]);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      // Cancel previous stream and any pending rAF flush
      abortRef.current?.abort();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      pendingRef.current = [];

      const controller = new AbortController();
      abortRef.current = controller;

      setError(null);
      setData([]);
      setIsStreaming(true);

      try {
        for await (const point of streamSensitivity(gammaMin, gammaMax, controller.signal)) {
          pendingRef.current.push(point);
          // Schedule a flush if one isn't already queued
          if (rafRef.current === null) {
            rafRef.current = requestAnimationFrame(flushPending);
          }
        }
        // Final flush for any remaining points after stream ends
        flushPending();
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError(err instanceof Error ? err.message : "Unable to compute sensitivity.");
        }
      } finally {
        setIsStreaming(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      abortRef.current?.abort();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [gammaMin, gammaMax, flushPending]);

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--kicker)]">
          Fixed parameters
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          <FixedParam label="TIPS yield" value={percentFormatter.format(FIXED.tips_yield)} />
          <FixedParam label="Volatility (σ)" value={percentFormatter.format(FIXED.sigma)} />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <div className="flex items-center justify-between gap-2">
            <Label className="mb-2 text-xl font-bold">γ min</Label>
            <span className="text-sm text-muted-foreground">{gammaMin}</span>
          </div>
          <Slider
            value={[gammaMin]}
            onValueChange={(v) => {
              const val = Array.isArray(v) ? v[0] : v;
              setGammaMin(Math.min(val, gammaMax));
            }}
            min={1}
            max={10}
            step={1}
          />
        </div>

        <div>
          <div className="flex items-center justify-between gap-2">
            <Label className="mb-2 text-xl font-bold">γ max</Label>
            <span className="text-sm text-muted-foreground">{gammaMax}</span>
          </div>
          <Slider
            value={[gammaMax]}
            onValueChange={(v) => {
              const val = Array.isArray(v) ? v[0] : v;
              setGammaMax(Math.max(val, gammaMin));
            }}
            min={1}
            max={10}
            step={1}
          />
        </div>
      </div>

      {error && (
        <p className="border-l-2 border-[var(--status-negative)] pl-3 text-sm font-semibold text-[var(--status-negative)]">
          {error}
        </p>
      )}

      {(data.length > 0 || isStreaming) && (
        <SensitivityChart data={data} isStreaming={isStreaming} />
      )}
    </div>
  );
}
