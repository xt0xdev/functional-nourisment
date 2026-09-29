import Image from "next/image";
import Link from "next/link";
import { getPage, getSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/CtaBand";
import { MIND_HERO } from "@/lib/page-copy";
import { resolveHeroText, resolveSoundHealingContent } from "@/lib/page-templates";
import { SITE_IMAGES, isStockOrEmptyImage } from "@/lib/site-images";

export async function generateMetadata() {
  const page = await getPage("sound-healing");
  return buildMetadata({
    title: page?.metaTitle || "Sound Healing & Reiki in Astoria, NY | Queens & NYC",
    description: page?.metaDescription || MIND_HERO,
    path: "/sound-healing",
  });
}

export default async function SoundHealingPage() {
  const [page, settings] = await Promise.all([getPage("sound-healing"), getSettings()]);
  const hero = resolveHeroText(page);
  const content = resolveSoundHealingContent(page?.content);

  return (
    <>
      <PageHero
        eyebrow="Mind · In person in Astoria"
        heading={hero.heading || "Nourish Mind"}
        subheading={hero.subheading || MIND_HERO}
        image={isStockOrEmptyImage(page?.heroImage) ? SITE_IMAGES.mindMeditation : page!.heroImage}
        imageAlt={page?.heroImageAlt || SITE_IMAGES.mindMeditationAlt}
      />
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:px-6">
        <div className="relative min-h-80 overflow-hidden rounded-3xl">
          <Image
            src={content.sectionImage}
            alt={content.sectionImageAlt}
            fill
            className="object-cover"
          />
        </div>
        <div className="prose-fn">
          <h2>{content.whatHeading}</h2>
          <p>{content.what}</p>
          <h2>{content.howHeading}</h2>
          <p>{content.how}</p>
          <p>{content.meditative}</p>
          <p>{content.close}</p>
          <p className="mt-8 flex flex-wrap gap-3">
            <Link href="/calendar" className="btn-primary no-underline">
              View Upcoming Dates
            </Link>
            <Link href="/calendar" className="btn-outline no-underline">
              Book your next sound bath experience
            </Link>
          </p>
        </div>
      </section>
      <CtaBand berryStreetUrl={settings.berryStreetUrl} bookingUrl={settings.bookingUrl} />
    </>
  );
}
