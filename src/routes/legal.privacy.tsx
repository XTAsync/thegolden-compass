import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, Section } from "@/components/LegalPage";

export const Route = createFileRoute("/legal/privacy")({
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary" },
      { property: "og:type", content: "website" },
      { title: "Privacy Policy — Golden Compass" },
      { name: "description", content: "Golden Compass privacy policy status and pending legal disclosures." },
      { property: "og:title", content: "Privacy Policy — Golden Compass" },
      { property: "og:description", content: "How we collect, use and protect your personal data." },
      { property: "og:url", content: "/legal/privacy" },
    ],
    links: [{ rel: "canonical", href: "/legal/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalPage eyebrow="LEGAL REVIEW" title="Privacy Policy" updated="OCTOBER 2026">
      <Section heading="Privacy policy pending review">
        The data controller, processing purposes, recipients, retention periods and rights
        procedures require legal review. This page does not assert that those arrangements
        have been approved. The current disclosures appear below.
      </Section>
    </LegalPage>
  );
}
