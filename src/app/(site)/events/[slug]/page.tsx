import Link from "next/link";
import { notFound } from "next/navigation";
import { getEvent, getEvents, getSettings } from "@/lib/content";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/CtaBand";
import { SmartImage } from "@/components/site/SmartImage";
import { renderRichText } from "@/lib/rich-text";
import { siteUrl } from "@/lib/content";

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

  const path = `/events/${event.slug || event.id}`;
  const gallery = event.images.filter((item) => item.media.id !== event.coverImageId);

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
      <article className="prose-fn mx-auto px-4 py-16 md:px-6">
        {event.startsAt ? (
          <p className="text-sm text-clay">
            {new Date(event.startsAt).toLocaleString("en-US", { timeZone: "America/New_York" })}
            {event.endsAt
              ? ` – ${new Date(event.endsAt).toLocaleString("en-US", { timeZone: "America/New_York" })}`
              : ""}
          </p>
        ) : null}
        {renderRichText(event.description)}
        {gallery.length > 0 ? (
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {gallery.map((item) => (
              <figure key={item.id} className="overflow-hidden rounded-2xl">
                <div className="relative aspect-[4/3]">
                  <SmartImage
                    src={item.media.url}
                    alt={item.media.alt || event.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                </div>
                {item.media.caption ? <figcaption className="mt-2 text-sm text-muted">{item.media.caption}</figcaption> : null}
              </figure>
            ))}
          </div>
        ) : null}
        <p className="mt-10">
          <Link href="/events" className="text-sm text-moss">
            ← All events
          </Link>
        </p>
      </article>
      <CtaBand berryStreetUrl={settings.berryStreetUrl} bookingUrl={settings.bookingUrl} />
    </>
  );
}
