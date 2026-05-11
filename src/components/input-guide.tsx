import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "#/components/ui/accordion";

// ── Shared accordion items ────────────────────────────────────────
// Each item is exported individually so routes can compose only
// the sections relevant to their inputs.

export function GammaGuideItem() {
  return (
    <AccordionItem value="gamma">
      <AccordionTrigger>Choosing γ (risk aversion)</AccordionTrigger>
      <AccordionContent>
        <p>
          Gamma is the most consequential input. A standard heuristic: ask yourself how a permanent
          50% loss of wealth would affect your life. Note that γ should reflect <em>financial</em>{" "}
          risk aversion rather than emotional comfort — a large pension or guaranteed income
          effectively lowers your financial γ even if markets make you nervous.{" "}
          <a
            href="https://elmwealth.com/measuring-the-fabric-of-felicity/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Haghani &amp; White (2018)
          </a>
        </p>
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[var(--line)]">
              <th className="pb-2 pr-6 font-semibold text-[var(--sea-ink)]">γ</th>
              <th className="pb-2 font-semibold text-[var(--sea-ink)]">Profile</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {[
              ["1", "Young investor, long horizon, stable income; near-maximally aggressive"],
              ["2", "Haghani & White (2022) default; moderate risk tolerance"],
              [
                "5",
                "Ma et al. (2026) calibration; pre-retiree or institutionally conservative. Allocates ~30% at the historical mean CAPE.",
              ],
              ["10", "Retiree; portfolio is primary income source"],
            ].map(([g, desc]) => (
              <tr key={g}>
                <td className="py-2 pr-6 font-mono font-semibold text-[var(--sea-ink)]">{g}</td>
                <td className="py-2">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </AccordionContent>
    </AccordionItem>
  );
}

export function SigmaGuideItem() {
  return (
    <AccordionItem value="sigma">
      <AccordionTrigger>Volatility (σ)</AccordionTrigger>
      <AccordionContent>
        <p>
          The annualised equity volatility assumption. The default of 18% is the long-run historical
          average and can generally be left unchanged.
        </p>
      </AccordionContent>
    </AccordionItem>
  );
}

export function MomentumGuideItem() {
  return (
    <AccordionItem value="momentum">
      <AccordionTrigger>Momentum overlay</AccordionTrigger>
      <AccordionContent>
        <p>
          The momentum weight controls blending with the 12-month S&amp;P 500 momentum signal (0.0 =
          pure Merton, 0.5 = equal blend following Asness et al. 2013). The blended allocation is:
        </p>
        <p className="font-mono text-[var(--sea-ink)]">
          f_blended = (1 − w) · f_merton + w · f_momentum
        </p>
        <p>
          The momentum signal is 1.0 when the 12-month S&amp;P 500 price return (from 12 months ago
          to 1 month ago, excluding the most recent month) is positive, and 0.0 otherwise. When
          Merton suggests 0% but momentum is positive, a weight of 0.5 naturally allocates 50% to
          equities without arbitrary clamps.
        </p>
      </AccordionContent>
    </AccordionItem>
  );
}

// ── Convenience wrappers ──────────────────────────────────────────

/** Full guide: γ + σ + momentum. Used by the Allocator route. */
export function AllocatorInputGuide() {
  return (
    <Accordion className="mb-8 max-w-3xl" multiple>
      <GammaGuideItem />
      <SigmaGuideItem />
      <MomentumGuideItem />
    </Accordion>
  );
}

/** Reduced guide: γ + σ only. Used by the Sensitivity route. */
export function SensitivityInputGuide() {
  return (
    <Accordion className="mb-8 max-w-3xl" multiple>
      <GammaGuideItem />
      <SigmaGuideItem />
    </Accordion>
  );
}
