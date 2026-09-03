import Link from "next/link";
import { getEvents, getPage, getSettings, parseContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/CtaBand";
import { SmartImage } from "@/components/site/SmartImage";

export async function generateMetadata() {
  const page = await getPage("events");
  return buildMetadata({
    title: page?.metaTitle || "Nutrition Workshops & Sound Baths in Astoria, NYC",
    description: page?.metaDescription || "",
    path: "/events",
  });
}

export default async function EventsPage() {
  const [page, events, settings] = await Promise.all([getPage("events"), getEvents(), getSettings()]);
  const content = parseContent<{ intro?: string }>(page?.content || "{}", {});

  return (
    <>
      <PageHero
        eyebrow="What's coming up"
        heading={page?.heroHeading || ""}
        subheading={page?.heroSubheading}
        image={
          page?.heroImage ||
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80"
        }
        imageAlt={page?.heroImageAlt || "Calm horizon for sound bath and wellness events in Astoria, Queens"}
      />
      <section className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        {content.intro ? <p className="mb-8 text-lg leading-relaxed text-muted">{content.intro}</p> : null}
        <div className="space-y-5">
          {events.map((event) => {
            const href = `/events/${event.slug || event.id}`;
            return (
              <article key={event.id} className="overflow-hidden rounded-2xl bg-white shadow-sm">
                {event.coverImage ? (
                  <Link href={href} className="relative block aspect-[16/9]">
                    <SmartImage
                      src={event.coverImage.url}
                      alt={event.coverImage.alt || event.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 700px, 100vw"
                    />
                  </Link>
                ) : null}
                <div className="p-6">
                  <h2 className="font-serif text-2xl text-forest">
                    <Link href={href}>{event.title}</Link>
                  </h2>
                  {event.startsAt ? (
                    <p className="mt-1 text-sm text-clay">
                      {new Date(event.startsAt).toLocaleString("en-US", { timeZone: "America/New_York" })}
                    </p>
                  ) : null}
                  <p className="mt-3 text-muted">{event.description.replace(/!\[[^\]]*\]\([^)]+\)/g, "").trim()}</p>
                  {event.location ? <p className="mt-2 text-sm text-muted">{event.location}</p> : null}
                  <Link href={href} className="mt-4 inline-block text-sm text-moss">
                    View event
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
      <CtaBand berryStreetUrl={settings.berryStreetUrl} bookingUrl={settings.bookingUrl} />
    </>
  );
}
