import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getEvent, getEvents, getSettings } from "@/lib/content";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/CtaBand";
import { siteUrl } from "@/lib/content";
import { EventPayButtons } from "@/components/site/EventPayButtons";
import { EventPageBody } from "@/components/site/EventPageBody";
import { eventRegisterPath, isRetreatEvent } from "@/lib/events";
import { hasEnabledEventLayout } from "@/lib/page-layout";

export async function generateStaticParams() {
  const events = await getEvents();
  return events.map((event) => ({ slug: event.slug || event.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return {};
  return buildMetadata({
    title: event.title,
    description: event.description.replace(/!\[[^\]]*\]\([^)]+\)/g, "").slice(0, 160),
    path: `/events/${event.slug || event.id}`,
    image: event.coverImage?.url,
  });
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [event, settings] = await Promise.all([getEvent(slug), getSettings()]);
  if (!event) notFound();
  if (isRetreatEvent(event)) {
    redirect(`/retreats/${event.slug || event.id}`);
  }

  const path = `/events/${event.slug || event.id}`;
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
          eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
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
        eyebrow="Events & workshops"
        heading={event.title}
        subheading={event.location || undefined}
        image={event.coverImage?.url}
        imageAlt={event.coverImage?.alt || event.title}
      />
      <article className="py-16">
        <div className="prose-fn mx-auto px-4 md:px-6">
          {event.startsAt ? (
            <p className="text-sm text-clay">
              {new Date(event.startsAt).toLocaleString("en-US", { timeZone: "America/New_York" })}
              {event.endsAt
                ? ` – ${new Date(event.endsAt).toLocaleString("en-US", { timeZone: "America/New_York" })}`
                : ""}
            </p>
          ) : null}
        </div>
        <div className={designed ? "mx-auto mt-8 max-w-6xl px-4 md:px-6" : "prose-fn mx-auto mt-6 px-4 md:px-6"}>
          <EventPageBody event={event} />
        </div>
        <div className="prose-fn mx-auto mt-6 px-4 md:px-6">
          <div className="flex flex-wrap items-center gap-3">
            <Link href={eventRegisterPath(event)} className="btn-primary">
              Register
            </Link>
            <EventPayButtons event={event} settings={settings} compact />
          </div>
          <p className="mt-10">
            <Link href="/events" className="text-sm text-moss">
              ← All events
            </Link>
          </p>
        </div>
      </article>
      <CtaBand berryStreetUrl={settings.berryStreetUrl} bookingUrl={settings.bookingUrl} />
    </>
  );
}
