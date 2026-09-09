import Link from "next/link";
import { getPage, getSettings, parseContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/CtaBand";
import { SmartImage } from "@/components/site/SmartImage";
import {
  SPIRIT_EXPERIENCE_ITEMS,
  SPIRIT_EYEBROW,
  SPIRIT_GATHER_INTRO,
  SPIRIT_GATHER_MORE,
  SPIRIT_HERO,
  SPIRIT_RETREATS_BODY,
  SPIRIT_RETREATS_GREECE,
  SPIRIT_RETREATS_LEAD,
} from "@/lib/page-copy";

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
  const content = parseContent<{
    gatherIntro?: string;
    gatherMore?: string;
    retreatsLead?: string;
    retreatsBody?: string;
    retreatsGreece?: string;
  }>(page?.content || "{}", {});

  return (
    <>
      <PageHero
        eyebrow={SPIRIT_EYEBROW}
        heading={page?.heroHeading || "Nourish Spirit"}
        subheading={page?.heroSubheading?.includes("reconnect—with yourself") ? page.heroSubheading : SPIRIT_HERO}
        image={page?.heroImage || "/images/meditation-2025-greece.jpg"}
        imageAlt={
          page?.heroImageAlt ||
          "Meditation and sound bath on a pebble beach in Greece, 2025"
        }
      />

      <section className="bg-mist">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <p className="eyebrow">Gather · Learn · Reconnect</p>
          <h2 className="mt-3 font-serif text-4xl text-primary md:text-5xl">Gather · Learn · Reconnect</h2>
          <p className="mt-6 max-w-3xl leading-relaxed text-muted">
            {content.gatherIntro || SPIRIT_GATHER_INTRO}
          </p>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted">
            {content.gatherMore || SPIRIT_GATHER_MORE}
          </p>
          <p className="mt-8 font-serif text-2xl text-primary">Experiences may include:</p>
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {SPIRIT_EXPERIENCE_ITEMS.map((item) => (
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
              View schedule
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <p className="eyebrow">Retreats</p>
          <h2 className="mt-3 font-serif text-4xl text-primary md:text-5xl">
            Retreats & Immersive Experiences
          </h2>
          <p className="mt-6 max-w-3xl font-serif text-2xl italic text-primary">
            {content.retreatsLead || SPIRIT_RETREATS_LEAD}
          </p>
          <p className="mt-5 max-w-3xl leading-relaxed text-muted">
            {content.retreatsBody || SPIRIT_RETREATS_BODY}
          </p>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted">
            {content.retreatsGreece || SPIRIT_RETREATS_GREECE}
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <figure className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-mist shadow-sm ring-1 ring-primary/10">
              <SmartImage
                src="/images/meditation-2025-greece.jpg"
                alt="Sound bath and meditation circle on a pebble beach in Greece at dusk, 2025"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </figure>
            <figure className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-mist shadow-sm ring-1 ring-primary/10">
              <SmartImage
                src="/images/meditation-2025-greece-circle.jpg"
                alt="Closer view of the 2025 Greece retreat sound bath circle and singing bowls"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </figure>
          </div>
        </div>
      </section>
      <CtaBand berryStreetUrl={settings.berryStreetUrl} bookingUrl={settings.bookingUrl} />
    </>
  );
}
