import Image from "next/image";
import Link from "next/link";
import { Brain, HeartPulse, Sparkles } from "lucide-react";
import { SmartImage } from "@/components/site/SmartImage";
import { getPage, getSettings } from "@/lib/content";
import { SITE_IMAGES, isStockOrEmptyImage } from "@/lib/site-images";
import { buildMetadata, JsonLd, faqPageSchema, practiceFaqs } from "@/lib/seo";
import { CtaBand } from "@/components/site/CtaBand";
import { FAQ_HEADING, HERO_EYEBROW, HERO_HEADING } from "@/lib/site-defaults";
import { resolveHeroText, resolveHomeContent } from "@/lib/page-templates";
import { getStoredLayout } from "@/lib/page-layout";
import { PageBodyOrLayout } from "@/components/site/PageLayoutBody";

export async function generateMetadata() {
  const page = await getPage("home");
  return buildMetadata({
    title: page?.metaTitle || "Nutritionist in Astoria, Queens & NYC | Anna Almiroudis",
    description: page?.metaDescription || "",
    path: "/",
  });
}

export default async function HomePage() {
  const [page, settings] = await Promise.all([getPage("home"), getSettings()]);
  const hero = resolveHeroText(page);
  const content = resolveHomeContent(page?.content);
  const layout = getStoredLayout(page?.content);
  const heading = hero.heading || HERO_HEADING;

  const pillars = [
    { href: "/sound-healing", title: "Nourish Mind", text: content.mind, icon: Brain },
    { href: "/nutrition", title: "Nourish Body", text: content.body, icon: HeartPulse },
    { href: "/meditation", title: "Nourish Spirit", text: content.spirit, icon: Sparkles },
  ];

  return (
    <>
      <JsonLd data={faqPageSchema(practiceFaqs)} />

      <section className="bg-background">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-6 md:py-24">
          <div>
            <p className="eyebrow">{HERO_EYEBROW}</p>
            <h1 className="mt-3 font-serif text-4xl leading-tight text-primary md:text-6xl">
              {heading === HERO_HEADING ? (
                <>
                  Nourishing your <em className="italic pr-[0.22em]">whole self</em> from the inside
                  out.
                </>
              ) : (
                heading
              )}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted">{content.intro}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="btn-primary" href="/book">
                Book a Discovery Call
              </Link>
              <Link href="/nutrition" className="btn-outline">
                Explore Services
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <SmartImage
              src={isStockOrEmptyImage(page?.heroImage) ? SITE_IMAGES.landingHero : page!.heroImage}
              alt={page?.heroImageAlt || SITE_IMAGES.landingHeroAlt}
              fill
              priority
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
        </div>
      </section>

      <PageBodyOrLayout
        layout={layout}
        fallback={
          <>
      <section className="bg-mist">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <p className="eyebrow">{content.pillarsEyebrow}</p>
          <h2 className="mt-3 font-serif text-4xl text-primary md:text-5xl">{content.pillarsHeading}</h2>
          <p className="mt-3 text-muted">{content.pillarsSub}</p>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {pillars.map((pillar) => (
              <article key={pillar.title} className="rounded-3xl bg-background p-6 shadow-sm">
                <pillar.icon className="h-7 w-7 text-teal" />
                <h3 className="mt-4 font-serif text-2xl text-primary">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{pillar.text}</p>
                <Link href={pillar.href} className="mt-5 inline-flex text-sm text-teal hover:underline">
                  Learn more →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-2 md:px-6">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
            <Image
              src={SITE_IMAGES.practitionerPortrait}
              alt={SITE_IMAGES.practitionerPortraitAlt}
              fill
              className="object-cover object-[center_20%]"
            />
            <p className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/90 px-4 py-3 font-serif text-lg italic text-navy">
              “{content.quote}”
            </p>
          </div>
          <div>
            <p className="eyebrow">{content.meetEyebrow}</p>
            <h2 className="mt-3 font-serif text-4xl text-primary md:text-5xl">{content.meetHeading}</h2>
            <p className="mt-5 leading-relaxed text-muted">{content.practitioner}</p>
            <p className="mt-4 leading-relaxed text-muted">{content.practitionerMore}</p>
            <Link href="/about" className="mt-6 inline-flex text-teal hover:underline">
              Read more about Anna →
            </Link>
          </div>
        </div>
      </section>
          </>
        }
      />

      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <p className="eyebrow">Common questions</p>
          <h2 className="mt-3 font-serif text-4xl text-primary md:text-5xl">{FAQ_HEADING}</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {practiceFaqs.map((item) => (
              <article key={item.q} className="rounded-3xl bg-mist p-6">
                <h3 className="font-serif text-2xl text-primary">{item.q}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{item.a}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBand berryStreetUrl={settings.berryStreetUrl} bookingUrl={settings.bookingUrl} />
    </>
  );
}
