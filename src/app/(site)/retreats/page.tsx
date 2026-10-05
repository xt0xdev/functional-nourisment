import Link from "next/link";
import { getPage, getUpcomingRetreats } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { SmartImage } from "@/components/site/SmartImage";
import { SubscribeForm } from "@/components/site/SubscribeForm";
import { RETREATS_SUB, RETREATS_TITLE } from "@/lib/page-copy";
import { resolveHeroText, resolveRetreatsContent } from "@/lib/page-templates";
import { getStoredLayout } from "@/lib/page-layout";
import { PageBodyOrLayout } from "@/components/site/PageLayoutBody";
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
  const hero = resolveHeroText(page);
  const content = resolveRetreatsContent(page?.content);
  const layout = getStoredLayout(page?.content);

  return (
    <>
      <PageHero
        eyebrow="Wellness"
        heading={hero.heading || RETREATS_TITLE}
        subheading={hero.subheading || RETREATS_SUB}
        image={isStockOrEmptyImage(page?.heroImage) ? SITE_IMAGES.spiritSoundbath : page!.heroImage}
        imageAlt={page?.heroImageAlt || SITE_IMAGES.spiritSoundbathAlt}
      />
      <PageBodyOrLayout
        layout={layout}
        fallback={
          <section className="mx-auto max-w-5xl px-4 pt-16 md:px-6">
        <div className="max-w-3xl space-y-5 text-lg leading-relaxed text-muted">
          {content.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-14">
          <h2 className="font-serif text-4xl text-primary">{content.whatHeading}</h2>
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {content.whatItems.map((item) => (
              <li key={item} className="rounded-2xl bg-mist px-5 py-4 text-sm leading-relaxed text-muted">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-14">
          <h2 className="font-serif text-4xl text-primary">{content.natureHeading}</h2>
          <div className="mt-5 max-w-3xl space-y-5 leading-relaxed text-muted">
            {content.nature.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <figure className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-mist">
              <SmartImage
                src={content.natureImage1}
                alt={content.natureImage1Alt}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </figure>
            <figure className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-mist">
              <SmartImage
                src={content.natureImage2}
                alt={content.natureImage2Alt}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </figure>
          </div>
          {content.bottomImage ? (
            <figure className="relative mt-4 aspect-[21/9] overflow-hidden rounded-3xl bg-mist">
              <SmartImage
                src={content.bottomImage}
                alt={content.bottomImageAlt || "Retreat photo"}
                fill
                className="object-cover"
                sizes="100vw"
              />
            </figure>
          ) : null}
        </div>
          </section>
        }
      />
      <section className="mx-auto max-w-5xl px-4 py-16 md:px-6">

        <div className="mt-14 rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="font-serif text-3xl text-primary">{content.upcomingHeading}</h2>
          {retreats.length === 0 ? (
            <>
              <p className="mt-4 text-muted">{content.upcomingEmpty}</p>
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
          <h2 className="font-serif text-3xl text-primary">{content.mailingHeading}</h2>
          <p className="mt-3 text-muted">{content.mailingBody}</p>
          <div className="mt-6 max-w-md">
            <SubscribeForm />
          </div>
        </div>
      </section>
    </>
  );
}
