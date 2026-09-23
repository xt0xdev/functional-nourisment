import { getPage, getSettings, getUpcomingEvents } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/CtaBand";
import { EventCalendar } from "@/components/site/EventCalendar";
import { CALENDAR_DESCRIPTION, CALENDAR_META_TITLE, CALENDAR_TITLE } from "@/lib/page-copy";
import { SITE_IMAGES, isStockOrEmptyImage } from "@/lib/site-images";
import { isRetreatEvent, toCalendarEvent } from "@/lib/events";

export async function generateMetadata() {
  const page = await getPage("calendar");
  return buildMetadata({
    title: page?.metaTitle || CALENDAR_META_TITLE,
    description: page?.metaDescription || CALENDAR_DESCRIPTION,
    path: "/calendar",
  });
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ focus?: string }>;
}) {
  const [{ focus }, page, allEvents, settings] = await Promise.all([
    searchParams,
    getPage("calendar"),
    getUpcomingEvents(),
    getSettings(),
  ]);

  const filtered =
    focus === "retreats" ? allEvents.filter((event) => isRetreatEvent(event)) : allEvents;
  const events = filtered.map(toCalendarEvent);

  return (
    <>
      <PageHero
        eyebrow="Upcoming experiences"
        heading={page?.heroHeading || CALENDAR_TITLE}
        subheading={page?.heroSubheading || CALENDAR_DESCRIPTION}
        image={isStockOrEmptyImage(page?.heroImage) ? SITE_IMAGES.wellnessMats : page!.heroImage}
        imageAlt={page?.heroImageAlt || SITE_IMAGES.wellnessMatsAlt}
      />
      <section className="bg-mist">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <p className="mb-10 max-w-3xl text-lg leading-relaxed text-muted">{CALENDAR_DESCRIPTION}</p>
          {focus === "retreats" ? (
            <p className="mb-8 text-sm text-teal">Showing retreat dates when they are posted to the calendar.</p>
          ) : null}
          <EventCalendar
            events={events}
            emptyTitle={
              focus === "retreats"
                ? "No upcoming retreats posted just yet"
                : "No upcoming public dates just yet"
            }
          />
        </div>
      </section>
      <CtaBand berryStreetUrl={settings.berryStreetUrl} bookingUrl={settings.bookingUrl} />
    </>
  );
}
