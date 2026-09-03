import { PageHero } from "@/components/site/PageHero";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: "Privacy practices for Functional Nourishment.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <PageHero heading="Privacy" />
      <section className="prose-fn mx-auto px-4 py-16 md:px-6">
        <p>
          Functional Nourishment, LLC collects only the information you submit through contact and
          booking forms — typically your name, email, phone, and message — so Anna can respond to
          your inquiry. Inquiries are stored in the practice’s private admin system.
        </p>
        <p>
          This website does not sell personal information. Clinical care through Berry Street is
          governed by Berry Street’s privacy and HIPAA practices. Email functionalnurture@gmail.com
          with privacy questions.
        </p>
      </section>
    </>
  );
}
