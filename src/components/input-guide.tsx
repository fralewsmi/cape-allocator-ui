import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "#/components/ui/accordion";
import { Link } from "@tanstack/react-router";

export function GammaGuideItem() {
  return (
    <AccordionItem value="gamma">
      <AccordionTrigger>Risk aversion (γ)</AccordionTrigger>
      <AccordionContent>
        <p>
          Gamma controls how aggressively the model allocates to equities. A value of 2 suits most
          investors; 5 is appropriate for pre-retirees; 10 for retirees whose portfolio is their
          primary income source.{" "}
          <Link to="/explained" hash="gamma" className="underline">
            Full guide →
          </Link>
        </p>
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
          Annualised equity volatility. The default of 18% is the long-run historical average and
          can generally be left unchanged.
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
          Blends the Merton share with a 12-month S&amp;P 500 momentum signal. 0.0 = pure Merton,
          0.5 = equal blend (Asness et al. 2013 recommendation).{" "}
          <Link to="/explained" hash="merton" className="underline">
            Full guide →
          </Link>
        </p>
      </AccordionContent>
    </AccordionItem>
  );
}

export function AllocatorInputGuide() {
  return (
    <Accordion className="mb-8" multiple>
      <GammaGuideItem />
      <SigmaGuideItem />
      <MomentumGuideItem />
    </Accordion>
  );
}

export function SensitivityInputGuide() {
  return (
    <Accordion className="mb-8" multiple>
      <GammaGuideItem />
      <SigmaGuideItem />
    </Accordion>
  );
}
