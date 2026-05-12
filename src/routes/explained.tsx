import { createFileRoute } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "#/components/ui/accordion";

export const Route = createFileRoute("/explained")({
  component: RouteComponent,
});

function Ref({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

function Formula({ children }: { children: React.ReactNode }) {
  return (
    <p className="my-3 overflow-x-auto rounded border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3 font-mono text-sm text-[var(--sea-ink)]">
      {children}
    </p>
  );
}

function RouteComponent() {
  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell p-6 sm:p-8">
        <h1 className="mb-3 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">Explained</h1>
        <p className="mb-8 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
          CAPE, the Merton ratio, risk aversion, and data sources.
        </p>

        <Accordion className="max-w-3xl" multiple>
          <AccordionItem value="cape">
            <AccordionTrigger>What is CAPE?</AccordionTrigger>
            <AccordionContent>
              <p>
                The Cyclically Adjusted Price-to-Earnings ratio (CAPE), introduced by{" "}
                <Ref href="https://doi.org/10.2307/1884037">Campbell &amp; Shiller (1988)</Ref>,
                smooths out short-term earnings volatility by dividing the current price by the
                average of the past ten years of real (inflation-adjusted) earnings. A higher CAPE
                implies lower expected future returns.
              </p>
              <p>
                The traditional Shiller CAPE uses aggregate S&amp;P 500 earnings.{" "}
                <Ref href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6060895">
                  Ma, Marshall, Nguyen &amp; Visaltanachoti (2026)
                </Ref>{" "}
                proposed the <em>Component CAPE</em>, which computes CAPE bottom-up from individual
                constituent earnings weighted by market cap. This approach avoids distortions from
                index composition changes and produces a more stable earnings series.
              </p>
              <p>
                Ma et al. evaluate four variants by out-of-sample R² for 10-year return prediction
                (OOS period 1974–2015):
              </p>
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-[var(--line)]">
                    <th className="pb-2 pr-4 font-semibold text-[var(--sea-ink)]">Variant</th>
                    <th className="pb-2 pr-4 font-semibold text-[var(--sea-ink)]">Method</th>
                    <th className="pb-2 font-semibold text-[var(--sea-ink)]">OOS R²</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line)]">
                  {[
                    ["Component 10y", "Bottom-up, 10-year window", "Highest"],
                    ["Component 5y", "Bottom-up, 5-year window", "High"],
                    ["Component EWMA", "Bottom-up, exponential weighting", "High"],
                    ["Aggregate 10y", "Traditional Shiller CAPE", "Lower"],
                  ].map(([v, m, r]) => (
                    <tr key={v}>
                      <td className="py-2 pr-4 font-semibold text-[var(--sea-ink)]">{v}</td>
                      <td className="py-2 pr-4">{m}</td>
                      <td className="py-2 font-mono">{r}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p>
                Component 10y is the recommended default — it achieves the highest predictive
                accuracy and is the paper's primary result.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="merton" id="merton">
            <AccordionTrigger>The Merton Ratio</AccordionTrigger>
            <AccordionContent>
              <p>
                The Merton ratio (
                <Ref href="https://doi.org/10.1016/0022-0531(71)90038-X">Merton, 1971</Ref>) is the
                equity exposure that maximises expected utility for an investor with constant
                relative risk aversion, given the expected excess return, equity volatility, and the
                investor's degree of risk aversion. It takes the form:
              </p>
              <Formula>f* = μ / (γ · σ²)</Formula>
              <p>Where:</p>
              <ul className="my-2 space-y-1 pl-4">
                <li>
                  <strong className="text-[var(--sea-ink)]">μ</strong> — excess earnings yield ={" "}
                  <span className="font-mono">1/CAPE − TIPS yield</span>. This is the equity risk
                  premium over the real risk-free rate, following{" "}
                  <Ref href="https://elmwealth.com/earnings-yield-dynamic-allocation/">
                    Haghani &amp; White (2022)
                  </Ref>
                  .
                </li>
                <li>
                  <strong className="text-[var(--sea-ink)]">γ</strong> — risk aversion coefficient
                  (see below).
                </li>
                <li>
                  <strong className="text-[var(--sea-ink)]">σ</strong> — annualised equity
                  volatility. The long-run historical average is 18%.
                </li>
              </ul>
              <p>
                The result is unconstrained — it can exceed 100% (leverage) or go negative (short).
                The allocator clamps the output to [0%, 100%].
              </p>
              <p>
                The <strong className="text-[var(--sea-ink)]">Certainty Equivalent Return</strong>{" "}
                (CER) measures the risk-adjusted return the investor expects:
              </p>
              <Formula>CER = f · μ − (γ/2) · (f · σ)²</Formula>
              <p>
                This is the return a risk-free investment would need to offer to be equally
                attractive. A higher CER means a better risk-adjusted outcome for this investor at
                this allocation. See{" "}
                <Ref href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6060895">
                  Ma et al. (2026)
                </Ref>{" "}
                eq. 17.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="gamma" id="gamma">
            <AccordionTrigger>Risk aversion (γ)</AccordionTrigger>
            <AccordionContent>
              <p>
                A standard heuristic: consider how a permanent 50% loss of wealth would affect your
                life. Note that γ should reflect <em>financial</em> risk aversion rather than
                emotional comfort. See{" "}
                <Ref href="https://elmwealth.com/measuring-the-fabric-of-felicity/">
                  Haghani &amp; White (2018)
                </Ref>
                .
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
                      <td className="py-2 pr-6 font-mono font-semibold text-[var(--sea-ink)]">
                        {g}
                      </td>
                      <td className="py-2">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p>
                The momentum overlay (
                <Ref href="https://doi.org/10.1111/jofi.12021">
                  Asness, Moskowitz &amp; Pedersen, 2013
                </Ref>
                ) blends the Merton share with a binary 12-month S&amp;P 500 momentum signal.
                Setting momentum weight to 0.5 follows the Asness et al. recommendation for equal
                blending, and naturally allocates 50% to equities when Merton suggests 0% but
                momentum is positive — without arbitrary clamps.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="data">
            <AccordionTrigger>Data sources</AccordionTrigger>
            <AccordionContent>
              <p>All market data is fetched live and cached locally.</p>
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-[var(--line)]">
                    <th className="pb-2 pr-4 font-semibold text-[var(--sea-ink)]">Source</th>
                    <th className="pb-2 font-semibold text-[var(--sea-ink)]">Used for</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line)]">
                  <tr>
                    <td className="py-2 pr-4">
                      <Ref href="https://fred.stlouisfed.org/series/DFII10">FRED DFII10</Ref>
                      {" / "}
                      <Ref href="https://fred.stlouisfed.org/series/WFII10">WFII10</Ref>
                    </td>
                    <td className="py-2">10-year TIPS real yield (daily / weekly)</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">
                      <Ref href="https://finance.yahoo.com">Yahoo Finance</Ref>{" "}
                      <span className="text-[var(--sea-ink-soft)]">(yfinance)</span>
                    </td>
                    <td className="py-2">
                      S&amp;P 500 constituent prices, market cap, EPS; monthly index prices for
                      momentum signal
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">
                      <Ref href="https://en.wikipedia.org/wiki/List_of_S%26P_500_companies">
                        Wikipedia
                      </Ref>
                    </td>
                    <td className="py-2">List of S&P 500 companies</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">
                      <Ref href="http://www.econ.yale.edu/~shiller/data.htm">Shiller dataset</Ref>{" "}
                      <span className="text-[var(--sea-ink-soft)]">(Yale)</span>
                    </td>
                    <td className="py-2">
                      Aggregate CAPE and low-coverage fallback; historical mean CAPE
                    </td>
                  </tr>
                </tbody>
              </table>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-10 max-w-3xl border-t border-[var(--line)] pt-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--kicker)]">
            References
          </p>
          <ol className="space-y-2 text-xs text-[var(--sea-ink-soft)]">
            {[
              {
                text: "Merton, R. C. (1971). Optimum Consumption and Portfolio Rules in a Continuous-Time Model. Journal of Economic Theory, 3(4), 373–413.",
                href: "https://doi.org/10.1016/0022-0531(71)90038-X",
              },
              {
                text: "Campbell, J. Y., & Shiller, R. J. (1988). Stock Prices, Earnings, and Expected Dividends. The Journal of Finance, 43(3), 661–676.",
                href: "https://doi.org/10.2307/1884037",
              },
              {
                text: "Asness, C. S., Moskowitz, T. J., & Pedersen, L. H. (2013). Value and Momentum Everywhere. The Journal of Finance, 68(3), 929–985.",
                href: "https://doi.org/10.1111/jofi.12021",
              },
              {
                text: "Haghani, V., & White, J. (2018). Measuring the Fabric of Felicity. Elm Wealth.",
                href: "https://elmwealth.com/measuring-the-fabric-of-felicity/",
              },
              {
                text: "Haghani, V., & White, J. (2022). Man Doth Not Invest by Earnings Yield Alone. Elm Wealth.",
                href: "https://elmwealth.com/earnings-yield-dynamic-allocation/",
              },
              {
                text: "Ma, Q., Marshall, A., Nguyen, T. H., & Visaltanachoti, N. (2026). CAPE Ratios and Long-Term Returns. SSRN.",
                href: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6060895",
              },
            ].map(({ text, href }, i) => (
              <li key={href} className="flex gap-2">
                <span className="shrink-0 font-mono text-[var(--sea-ink)]">{i + 1}.</span>
                <span>
                  {text} <Ref href={href}>{href.replace("https://", "")}</Ref>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
