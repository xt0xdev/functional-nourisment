import { PageHero } from "@/components/site/PageHero";
import { buildMetadata } from "@/lib/seo";
import { EVENT_POLICY_INTRO, EVENT_POLICY_TITLE } from "@/lib/page-copy";

export const metadata = buildMetadata({
    title: `${EVENT_POLICY_TITLE} | Functional Nourishment`,
    description: EVENT_POLICY_INTRO,
  path: "/event-policy",
});

export default function EventPolicyPage() {
  return (
    <>
      <PageHero
        heading={EVENT_POLICY_TITLE}
        subheading={EVENT_POLICY_INTRO}
      />
      <section className="prose-fn mx-auto px-4 py-16 md:px-6">
        <h2>Cancellation and refunds</h2>
        <p>
          Workshops and sound baths may be canceled or transferred up to 48 hours before the start
          time for a full refund, minus any processing fees charged by Stripe or PayPal. Cancellations
          within 48 hours are non-refundable, though we will do our best to offer a credit toward a
          future date when space allows.
        </p>
        <p>
          Retreat registrations are held with a deposit or full payment through Stripe. Cancellations
          made 30 or more days before the retreat start date may receive a refund minus any
          non-recoverable costs. Cancellations within 30 days are non-refundable unless we are able
          to fill your place from a waitlist. Travel, lodging, and personal expenses are the
          participant&apos;s responsibility.
        </p>
        <h2>If we need to reschedule</h2>
        <p>
          If Functional Nourishment must cancel or significantly change an offering, you will be
          offered a full refund or a transfer to another date.
        </p>
        <h2>Participation</h2>
        <p>
          Participation in all activities is voluntary. You may choose not to take part in any
          practice, meal, or excursion. Please share accessibility needs and food allergies on the
          registration form so we can plan thoughtfully.
        </p>
        <p>
          Questions about a specific offering? Email{" "}
          <a href="mailto:functionalnurture@gmail.com">functionalnurture@gmail.com</a>.
        </p>
      </section>
    </>
  );
}
