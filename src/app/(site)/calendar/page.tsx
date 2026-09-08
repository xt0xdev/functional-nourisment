import Link from "next/link";
import { getPage, getSettings, getUpcomingEvents, parseContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/CtaBand";
import { SmartImage } from "@/components/site/SmartImage";
import { EventPayButtons } from "@/components/site/EventPayButtons";

export async function generateMetadata() {
  const page = await getPage("calendar");
  return buildMetadata({
    title: page?.metaTitle || "Workshop & Sound Bath Calendar | Functional Nourishment",
    description:
      page?.metaDescription ||
      "Upcoming workshops and sound bath meditations in Astoria and the NYC area. Book and pay online with Stripe or PayPal.",
    path: "/calendar",
  });
}

function monthLabel(value: Date | null) {
  if (!value) return "Open scheduling";
  return value.toLocaleString("en-US", { timeZone: "America/New_York", month: "long", year: "numeric" });
}

function formatWhen(startsAt: Date | null, endsAt: Date | null) {
  if (!startsAt) return "Date to be announced — book anytime";
  const start = startsAt.toLocaleString("en-US", {
    timeZone: "America/New_York",
    weekday: "long",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  if (!endsAt) return start;
  const end = endsAt.toLocaleString("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "2-digit",
  });
  return `${start} – ${end}`;
}

export default async function CalendarPage() {
  const [page, events, settings] = await Promise.all([
    getPage("calendar"),
    getUpcomingEvents(),
    getSettings(),
  ]);
  const content = parseContent<{ intro?: string }>(page?.content || "{}", {});
  const grouped = new Map<string, typeof events>();
  for (const event of events) {
    const key = monthLabel(event.startsAt);
    const list = grouped.get(key) ?? [];
    list.push(event);
    grouped.set(key, list);
  }

  return (
    <>
      <PageHero
        eyebrow="Workshops & sound baths"
        heading={page?.heroHeading || "Calendar"}
        subheading={
          page?.heroSubheading ||
          "Upcoming workshops and sound bath meditations. Reserve your spot with Stripe or PayPal."
        }
        image={
          page?.heroImage ||
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80"
        }
        imageAlt={page?.heroImageAlt || "Calm water for sound bath and workshop calendar"}
      />
      <section className="mx-auto max-w-4xl px-4 py-16 md:px-6">
        <p className="mb-10 text-lg leading-relaxed text-muted">
          {content.intro ||
            "Join Anna for workshops and sound bath meditations. Browse upcoming dates below and pay securely through Stripe or PayPal. Sound Bath Meditations also remain listed on the events page."}
        </p>
        {events.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="font-serif text-3xl text-primary">No upcoming public dates just yet</h2>
            <p className="mt-3 text-muted">
              Private and corporate bookings are available year-round. You can still reserve a sound bath
              meditation using the payment links below, or email Anna to plan a custom session.
            </p>
            <EventPayButtons settings={settings} />
            <p className="mt-6 text-sm">
              <Link href="/events" className="text-teal hover:underline">
                View all events →
              </Link>
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {Array.from(grouped.entries()).map(([month, items]) => (
              <section key={month}>
                <p className="eyebrow">{month}</p>
                <div className="mt-4 space-y-5">
                  {items.map((event) => {
                    const href = `/events/${event.slug || event.id}`;
                    return (
                      <article key={event.id} className="overflow-hidden rounded-3xl bg-white shadow-sm">
                        <div className={event.coverImage ? "grid md:grid-cols-[220px_1fr]" : ""}>
                          {event.coverImage ? (
                            <Link href={href} className="relative block min-h-44">
                              <SmartImage
                                src={event.coverImage.url}
                                alt={event.coverImage.alt || event.title}
                                fill
                                className="object-cover"
                                sizes="220px"
                              />
                            </Link>
                          ) : null}
                          <div className="p-6">
                            <p className="text-sm text-teal">{formatWhen(event.startsAt, event.endsAt)}</p>
                            <h2 className="mt-1 font-serif text-2xl text-primary">
                              <Link href={href}>{event.title}</Link>
                            </h2>
                            {event.location ? <p className="mt-1 text-sm text-muted">{event.location}</p> : null}
                            <p className="mt-3 text-sm leading-relaxed text-muted">
                              {event.description.replace(/!\[[^\]]*\]\([^)]+\)/g, "").trim()}
                            </p>
                            <EventPayButtons event={event} settings={settings} compact />
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </section>
      <CtaBand berryStreetUrl={settings.berryStreetUrl} bookingUrl={settings.bookingUrl} />
    </>
  );
}
