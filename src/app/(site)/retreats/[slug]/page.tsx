import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getEvent, getSettings, getUpcomingRetreats, siteUrl } from "@/lib/content";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/CtaBand";
import { EventPageBody } from "@/components/site/EventPageBody";
import { eventRegisterPath, formatEventWhen, isRetreatEvent } from "@/lib/events";
import { hasEnabledEventLayout } from "@/lib/page-layout";

export async function generateStaticParams() {
  const retreats = await getUpcomingRetreats();
  return retreats.map((event) => ({ slug: event.slug || event.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event || !isRetreatEvent(event)) return {};
  return buildMetadata({
    title: `${event.title} | Retreats`,
    description: event.description.replace(/!\[[^\]]*\]\([^)]+\)/g, "").slice(0, 160),
    path: `/retreats/${event.slug || event.id}`,
    image: event.coverImage?.url,
  });
}

export default async function RetreatDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [event, settings] = await Promise.all([getEvent(slug), getSettings()]);
  if (!event) notFound();
  if (!isRetreatEvent(event)) {
    redirect(`/events/${event.slug || event.id}`);
  }

  const path = `/retreats/${event.slug || event.id}`;
  const registerHref = eventRegisterPath(event);
  const designed = hasEnabledEventLayout(event.layout);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Event",
          name: event.title,
          description: event.description.replace(/!\[[^\]]*\]\([^)]+\)/g, "").trim(),
          startDate: event.startsAt || undefined,
          endDate: event.endsAt || undefined,
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          eventStatus: "https://schema.org/EventScheduled",
          location: event.location
            ? { "@type": "Place", name: event.location, address: event.location }
            : undefined,
          image: event.coverImage?.url,
          organizer: { "@type": "Organization", name: "Functional Nourishment", url: siteUrl() },
          url: siteUrl(path),
        }}
      />
      <PageHero
        eyebrow="Retreat"
        heading={event.title}
        subheading={event.location || "A nourishing retreat experience"}
        image={event.coverImage?.url}
        imageAlt={event.coverImage?.alt || event.title}
      />
      <article className="py-16">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <p className="text-sm text-teal">{formatEventWhen(event.startsAt, event.endsAt)}</p>
        </div>
        <div className={designed ? "mx-auto mt-8 max-w-6xl px-4 md:px-6" : "mx-auto mt-6 max-w-3xl px-4 md:px-6"}>
          <EventPageBody event={event} showItinerary />
        </div>
        <div className="mx-auto mt-12 max-w-3xl px-4 md:px-6">
          <div className="rounded-3xl bg-mist p-8">
            <h2 className="font-serif text-3xl text-primary">Reserve your place</h2>
            <p className="mt-3 leading-relaxed text-muted">
              Review the retreat details above, then complete registration. Payment is completed
              securely through Stripe.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={registerHref} className="btn-primary">
                Register
              </Link>
              <Link href="/event-policy" className="btn-outline">
                Cancellation policy
              </Link>
            </div>
          </div>
          <p className="mt-10">
            <Link href="/retreats" className="text-sm text-moss">
              ← All retreats
            </Link>
          </p>
        </div>
      </article>
      <CtaBand berryStreetUrl={settings.berryStreetUrl} bookingUrl={settings.bookingUrl} />
    </>
  );
}
