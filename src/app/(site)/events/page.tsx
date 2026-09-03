import { getEvents, getPage } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";

export async function generateMetadata() {
  const page = await getPage("events");
  return buildMetadata({
    title: page?.metaTitle || "Events",
    description: page?.metaDescription || "",
    path: "/events",
  });
}

export default async function EventsPage() {
  const [page, events] = await Promise.all([getPage("events"), getEvents()]);

  return (
    <>
      <PageHero eyebrow="Calendar" heading={page?.heroHeading || ""} subheading={page?.heroSubheading} />
      <section className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <div className="space-y-5">
          {events.map((event) => (
            <article key={event.id} className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="font-serif text-2xl text-forest">{event.title}</h2>
              {event.startsAt ? (
                <p className="mt-1 text-sm text-clay">
                  {new Date(event.startsAt).toLocaleString("en-US", { timeZone: "America/New_York" })}
                </p>
              ) : null}
              <p className="mt-3 text-muted">{event.description}</p>
              {event.location ? <p className="mt-2 text-sm text-muted">{event.location}</p> : null}
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
