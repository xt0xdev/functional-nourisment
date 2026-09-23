import Link from "next/link";
import { getPage, getUpcomingRetreats } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { SmartImage } from "@/components/site/SmartImage";
import { SubscribeForm } from "@/components/site/SubscribeForm";
import {
  RETREATS_INTRO,
  RETREATS_NATURE,
  RETREATS_NATURE_HEADING,
  RETREATS_SUB,
  RETREATS_TITLE,
  RETREATS_WHAT,
  RETREATS_WHAT_HEADING,
} from "@/lib/page-copy";
import { SITE_IMAGES, isStockOrEmptyImage } from "@/lib/site-images";
import { eventPublicPath, eventRegisterPath, formatEventWhen } from "@/lib/events";

export async function generateMetadata() {
  const page = await getPage("retreats");
  return buildMetadata({
    title: page?.metaTitle || "Retreats | Functional Nourishment",
    description: page?.metaDescription || RETREATS_SUB,
    path: "/retreats",
  });
}

export default async function RetreatsPage() {
  const [page, retreats] = await Promise.all([getPage("retreats"), getUpcomingRetreats()]);

  return (
    <>
      <PageHero
        eyebrow="Wellness"
        heading={page?.heroHeading || RETREATS_TITLE}
        subheading={page?.heroSubheading || RETREATS_SUB}
        image={isStockOrEmptyImage(page?.heroImage) ? SITE_IMAGES.spiritSoundbath : page!.heroImage}
        imageAlt={page?.heroImageAlt || SITE_IMAGES.spiritSoundbathAlt}
      />
      <section className="mx-auto max-w-5xl px-4 py-16 md:px-6">
        <div className="max-w-3xl space-y-5 text-lg leading-relaxed text-muted">
          {RETREATS_INTRO.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-14">
          <h2 className="font-serif text-4xl text-primary">{RETREATS_WHAT_HEADING}</h2>
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {RETREATS_WHAT.map((item) => (
              <li key={item} className="rounded-2xl bg-mist px-5 py-4 text-sm leading-relaxed text-muted">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-14">
          <h2 className="font-serif text-4xl text-primary">{RETREATS_NATURE_HEADING}</h2>
          <div className="mt-5 max-w-3xl space-y-5 leading-relaxed text-muted">
            {RETREATS_NATURE.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <figure className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-mist">
              <SmartImage
                src={SITE_IMAGES.greeceCircle}
                alt={SITE_IMAGES.greeceCircleAlt}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </figure>
            <figure className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-mist">
              <SmartImage
                src={SITE_IMAGES.wellnessCliff}
                alt={SITE_IMAGES.wellnessCliffAlt}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </figure>
          </div>
        </div>

        <div className="mt-14 rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="font-serif text-3xl text-primary">Upcoming Retreats</h2>
          {retreats.length === 0 ? (
            <>
              <p className="mt-4 text-muted">
                Dates are posted on the calendar as they are announced. Join the mailing list to hear
                about upcoming retreats first.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href="/calendar?focus=retreats" className="btn-primary">
                  View Upcoming Retreats
                </Link>
              </div>
            </>
          ) : (
            <div className="mt-6 space-y-5">
              {retreats.map((event) => {
                const href = eventPublicPath(event);
                return (
                  <article key={event.id} className="rounded-2xl border border-forest/10 p-5">
                    <p className="text-sm text-teal">{formatEventWhen(event.startsAt, event.endsAt)}</p>
                    <h3 className="mt-1 font-serif text-2xl text-primary">
                      <Link href={href}>{event.title}</Link>
                    </h3>
                    {event.location ? <p className="mt-1 text-sm text-muted">{event.location}</p> : null}
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {event.description.replace(/!\[[^\]]*\]\([^)]+\)/g, "").trim()}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link href={href} className="btn-outline">
                        View retreat
                      </Link>
                      <Link href={eventRegisterPath(event)} className="btn-primary">
                        Register
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-10 rounded-3xl bg-mist p-8">
          <h2 className="font-serif text-3xl text-primary">Join the Mailing List</h2>
          <p className="mt-3 text-muted">
            Sign up for updates on nutrition, wellness, workshops, sound baths, retreats, and upcoming
            offerings.
          </p>
          <div className="mt-6 max-w-md">
            <SubscribeForm />
          </div>
        </div>
      </section>
    </>
  );
}
