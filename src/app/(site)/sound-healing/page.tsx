import Image from "next/image";
import Link from "next/link";
import { getPage, getSettings, parseContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/CtaBand";
import { MIND_HERO, MIND_HOW, MIND_MEDITATIVE, MIND_SESSIONS, MIND_WHAT } from "@/lib/page-copy";
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
  const content = parseContent<{ what?: string; how?: string; meditative?: string; close?: string }>(
    page?.content || "{}",
    {},
  );
  const what = content.what?.includes("Sound healing uses the tones") ? content.what : MIND_WHAT;
  const how = content.how?.includes("entrainment") ? content.how : MIND_HOW;
  const meditative = content.meditative?.includes("breathing naturally") ? content.meditative : MIND_MEDITATIVE;
  const close = content.close?.includes("in-person sessions in Astoria") ? content.close : MIND_SESSIONS;

  return (
    <>
      <PageHero
        eyebrow="Mind · In person in Astoria"
        heading={page?.heroHeading || "Nourish Mind"}
        subheading={page?.heroSubheading?.includes("mental and emotional well-being") ? page.heroSubheading : MIND_HERO}
        image={isStockOrEmptyImage(page?.heroImage) ? SITE_IMAGES.mindMeditation : page!.heroImage}
        imageAlt={page?.heroImageAlt || SITE_IMAGES.mindMeditationAlt}
      />
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:px-6">
        <div className="relative min-h-80 overflow-hidden rounded-3xl">
          <Image
            src={SITE_IMAGES.mindBowls}
            alt={SITE_IMAGES.mindBowlsAlt}
            fill
            className="object-cover"
          />
        </div>
        <div className="prose-fn">
          <h2>What is sound healing?</h2>
          <p>{what}</p>
          <h2>How sound may influence awareness</h2>
          <p>{how}</p>
          <p>{meditative}</p>
          <p>{close}</p>
          <p className="mt-8">
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
