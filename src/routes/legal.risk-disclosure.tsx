import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, Section } from "@/components/LegalPage";

export const Route = createFileRoute("/legal/risk-disclosure")({
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary" },
      { property: "og:type", content: "website" },
      { title: "Risk Disclosure — Golden Compass" },
      { name: "description", content: "Draft risk disclosure statement for retail investors using Golden Compass pooled funds and securities trading in Kenya." },
      { property: "og:title", content: "Risk Disclosure — Golden Compass" },
      { property: "og:description", content: "Understand the risks before you invest." },
      { property: "og:url", content: "/legal/risk-disclosure" },
    ],
    links: [{ rel: "canonical", href: "/legal/risk-disclosure" }],
  }),
  component: RiskPage,
});

function RiskPage() {
  return (
    <LegalPage eyebrow="LEGAL REVIEW" title="Risk Disclosure" updated="OCTOBER 2026">
      <Section heading="1. Capital is at risk">
        The value of investments can fall as well as rise. You may get back less than you
        invested, and in some cases you may lose the entire amount. Past performance and any
        indicative or target returns shown on the platform are not a reliable indicator of
        future results and are not guaranteed.
      </Section>
      <Section heading="2. Market risk">
        Prices of securities on the Nairobi Securities Exchange and global markets fluctuate
        with economic conditions, interest rates, company performance, and investor sentiment.
        Historical prices do not guarantee future performance.
      </Section>
      <Section heading="3. Liquidity and holding periods">
        Some pools apply a minimum holding period and an exit fee. During that period you may be
        unable to withdraw, or may withdraw only at a cost. In stressed markets, redemptions may
        be delayed or suspended to protect remaining investors.
      </Section>
      <Section heading="4. Currency risk">
        Investments denominated in currencies other than the Kenyan shilling expose you to
        exchange rate movements, which may increase or reduce your returns independently of the
        underlying asset's performance.
      </Section>
      <Section heading="5. Execution and counterparty risk">
        Real order routing and payment services are disabled pending approval. Demo orders,
        where available, are not market executions and do not establish custody arrangements.
      </Section>
      <Section heading="6. Technology and operational risk">
        Mobile networks, payment rails and platform systems can fail or be unavailable. This may
        prevent you from depositing, withdrawing or trading at a time of your choosing.
      </Section>
      <Section heading="7. Regulatory and tax risk">
        Changes in Kenyan law, CMA regulation or tax treatment (including withholding tax on
        investment income and capital gains tax) may affect returns. We do not provide tax
        advice.
      </Section>
      <Section heading="8. No advice, no guarantee">
        Content on the platform, including AI-generated guidance, is general information only
        and is not a personal recommendation. No return is guaranteed. Reviewed product-specific
        disclosures and any protection arrangements have not been supplied.
      </Section>
    </LegalPage>
  );
}
