import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getEvent, getSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { RetreatRegistrationForm } from "@/components/site/RetreatRegistrationForm";
import { eventPublicPath, formatEventDateLabel, formatEventWhen, isRetreatEvent } from "@/lib/events";
import { resolveStripeUrl } from "@/lib/site-defaults";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event || !isRetreatEvent(event)) return {};
  return buildMetadata({
    title: `Register | ${event.title}`,
    description: "Complete your retreat registration with Functional Nourishment.",
    path: `/retreats/${event.slug || event.id}/register`,
  });
}

export default async function RetreatRegisterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [event, settings] = await Promise.all([getEvent(slug), getSettings()]);
  if (!event) notFound();
  if (!isRetreatEvent(event)) {
    redirect(`/events/${event.slug || event.id}/register`);
  }

  return (
    <>
      <PageHero
        eyebrow="Retreat Registration"
        heading="Retreat Registration"
        subheading="We look forward to welcoming you! Please complete the form below to reserve your place and help us create a thoughtful, nourishing experience for you."
      />
      <section className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <p className="text-sm text-teal">{formatEventWhen(event.startsAt, event.endsAt)}</p>
        <p className="mt-2 font-serif text-2xl text-primary">{event.title}</p>
        {event.location ? <p className="mt-1 text-sm text-muted">{event.location}</p> : null}
        <p className="mt-6">
          <Link href={eventPublicPath(event)} className="text-sm text-teal hover:underline">
            ← Back to retreat details
          </Link>
        </p>
        <div className="mt-8">
          <RetreatRegistrationForm
            eventId={event.id}
            eventTitle={event.title}
            eventDate={formatEventDateLabel(event.startsAt)}
            stripeUrl={resolveStripeUrl(event, settings)}
          />
        </div>
      </section>
    </>
  );
}
