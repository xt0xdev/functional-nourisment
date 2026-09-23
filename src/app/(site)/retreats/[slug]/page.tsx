import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getEvent, getSettings, getUpcomingRetreats, siteUrl } from "@/lib/content";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/CtaBand";
import { SmartImage } from "@/components/site/SmartImage";
import { renderRichText } from "@/lib/rich-text";
import { eventRegisterPath, formatEventWhen, isRetreatEvent } from "@/lib/events";

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
  const gallery = event.images.filter((item) => item.media.id !== event.coverImageId);
  const itinerary = event.itinerary?.trim();

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
      <article className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <p className="text-sm text-teal">{formatEventWhen(event.startsAt, event.endsAt)}</p>
        <div className="prose-fn mt-6 max-w-none">{renderRichText(event.description)}</div>
        {itinerary ? (
          <section className="mt-12">
            <h2 className="font-serif text-3xl text-primary">Itinerary</h2>
            <div className="prose-fn mt-4 max-w-none">{renderRichText(itinerary)}</div>
          </section>
        ) : null}
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
                {item.media.caption ? (
                  <figcaption className="mt-2 text-sm text-muted">{item.media.caption}</figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        ) : null}
        <div className="mt-12 rounded-3xl bg-mist p-8">
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
      </article>
      <CtaBand berryStreetUrl={settings.berryStreetUrl} bookingUrl={settings.bookingUrl} />
    </>
  );
}
