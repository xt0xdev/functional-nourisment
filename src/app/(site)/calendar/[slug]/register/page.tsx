import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getEvent, getSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { EventRegistrationForm } from "@/components/site/EventRegistrationForm";
import {
  EVENT_REGISTRATION_HEADING,
  EVENT_REGISTRATION_INTRO,
} from "@/lib/page-copy";
import { eventPublicPath, eventSlug, formatEventWhen, isRetreatEvent } from "@/lib/events";
import { resolveStripeUrl } from "@/lib/site-defaults";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return {};
  return buildMetadata({
    title: `${EVENT_REGISTRATION_HEADING} | ${event.title}`,
    description: EVENT_REGISTRATION_INTRO,
    path: `/calendar/${eventSlug(event)}/register`,
  });
}

export default async function CalendarRegisterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [event, settings] = await Promise.all([getEvent(slug), getSettings()]);
  if (!event) notFound();
  if (isRetreatEvent(event)) {
    redirect(`/retreats/${eventSlug(event)}/register`);
  }

  return (
    <>
      <PageHero eyebrow="Reserve your spot" heading={EVENT_REGISTRATION_HEADING} subheading={EVENT_REGISTRATION_INTRO} />
      <section className="mx-auto max-w-xl px-4 py-16 md:px-6">
        <p className="mb-6">
          <Link href="/calendar" className="text-sm text-teal hover:underline">
            ← Back to calendar
          </Link>
        </p>
        <EventRegistrationForm
          eventId={event.id}
          eventTitle={event.title}
          eventWhen={formatEventWhen(event.startsAt, event.endsAt)}
          stripeUrl={resolveStripeUrl(event, settings)}
        />
        <p className="mt-6 text-sm">
          <Link href={eventPublicPath(event)} className="text-teal hover:underline">
            View full event details
          </Link>
        </p>
      </section>
    </>
  );
}
