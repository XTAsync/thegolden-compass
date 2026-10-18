import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, Section } from "@/components/LegalPage";

export const Route = createFileRoute("/legal/terms")({
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary" },
      { property: "og:type", content: "website" },
      { title: "Terms of Service — Golden Compass" },
      { name: "description", content: "Draft terms of service governing use of the Golden Compass investment platform in Kenya." },
      { property: "og:title", content: "Terms of Service — Golden Compass" },
      { property: "og:description", content: "Draft terms governing use of the Golden Compass investment platform." },
      { property: "og:url", content: "/legal/terms" },
    ],
    links: [{ rel: "canonical", href: "/legal/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalPage eyebrow="LEGAL REVIEW" title="Terms of Service" updated="OCTOBER 2026">
      <Section heading="Terms pending review">
        Reviewed terms have not been supplied. No broker, custody, licensing or regulatory
        status is asserted by this page. The current disclosures appear below.
      </Section>
    </LegalPage>
  );
}
