import Link from "next/link";
import { getPage, getSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/CtaBand";
import { SmartImage } from "@/components/site/SmartImage";
import { SITE_IMAGES, isStockOrEmptyImage } from "@/lib/site-images";
import { SPIRIT_HERO } from "@/lib/page-copy";
import { resolveHeroText, resolveMeditationContent } from "@/lib/page-templates";
import { getStoredLayout } from "@/lib/page-layout";
import { PageBodyOrLayout } from "@/components/site/PageLayoutBody";

export async function generateMetadata() {
  const page = await getPage("meditation");
  return buildMetadata({
    title: page?.metaTitle || "Meditation & Breathwork in Astoria, NYC",
    description: page?.metaDescription || SPIRIT_HERO,
    path: "/meditation",
  });
}

export default async function MeditationPage() {
  const [page, settings] = await Promise.all([getPage("meditation"), getSettings()]);
  const hero = resolveHeroText(page);
  const content = resolveMeditationContent(page?.content);
  const layout = getStoredLayout(page?.content);

  return (
    <>
      <PageHero
        eyebrow={content.eyebrow}
        heading={hero.heading || "Nourish Spirit"}
        subheading={hero.subheading || SPIRIT_HERO}
        image={isStockOrEmptyImage(page?.heroImage) ? SITE_IMAGES.spiritSoundbath : page!.heroImage}
        imageAlt={page?.heroImageAlt || SITE_IMAGES.spiritSoundbathAlt}
      />

      <PageBodyOrLayout
        layout={layout}
        fallback={
          <>
      <section className="bg-mist">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <p className="eyebrow">{content.gatherEyebrow}</p>
          <h2 className="mt-3 font-serif text-4xl text-primary md:text-5xl">{content.gatherHeading}</h2>
          <p className="mt-6 max-w-3xl leading-relaxed text-muted">{content.gatherIntro}</p>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted">{content.gatherMore}</p>
          <p className="mt-8 font-serif text-2xl text-primary">{content.experienceHeading}</p>
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {content.experienceItems.map((item) => (
              <li
                key={item}
                className="rounded-2xl bg-background px-5 py-4 text-sm leading-relaxed text-muted shadow-sm"
              >
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/experiences" className="btn-primary">
              Explore Upcoming Workshops & Retreats
            </Link>
            <Link href="/calendar" className="btn-outline">
              View Upcoming Dates
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <p className="eyebrow">{content.retreatsEyebrow}</p>
          <h2 className="mt-3 font-serif text-4xl text-primary md:text-5xl">{content.retreatsHeading}</h2>
          <p className="mt-6 max-w-3xl font-serif text-2xl italic text-primary">{content.retreatsLead}</p>
          <p className="mt-5 max-w-3xl leading-relaxed text-muted">{content.retreatsBody}</p>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted">{content.retreatsGreece}</p>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <figure className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-mist shadow-sm ring-1 ring-primary/10">
              <SmartImage
                src={content.image1}
                alt={content.image1Alt}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 33vw, 100vw"
              />
            </figure>
            <figure className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-mist shadow-sm ring-1 ring-primary/10">
              <SmartImage
                src={content.image2}
                alt={content.image2Alt}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 33vw, 100vw"
              />
            </figure>
            <figure className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-mist shadow-sm ring-1 ring-primary/10">
              <SmartImage
                src={content.image3}
                alt={content.image3Alt}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 33vw, 100vw"
              />
            </figure>
          </div>
        </div>
      </section>
          </>
        }
      />
      {layout?.enabled ? (
        <section className="mx-auto max-w-6xl px-4 pb-12 md:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/experiences" className="btn-primary">
              Explore Upcoming Workshops & Retreats
            </Link>
            <Link href="/calendar" className="btn-outline">
              View Upcoming Dates
            </Link>
          </div>
        </section>
      ) : null}
      <CtaBand berryStreetUrl={settings.berryStreetUrl} bookingUrl={settings.bookingUrl} />
    </>
  );
}
