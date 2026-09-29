import Image from "next/image";
import { getPage, getSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/CtaBand";
import {
  ABOUT_CREDENTIALS,
  ABOUT_HERO_SUBHEADING,
  AMAZON_BOOK_URL,
  normalizeCredentials,
  splitPractitionerHeading,
  withUpdatedSoundCredential,
} from "@/lib/page-copy";
import { resolveAboutContent, resolveHeroText } from "@/lib/page-templates";
import { SITE_IMAGES } from "@/lib/site-images";

export async function generateMetadata() {
  const page = await getPage("about");
  return buildMetadata({
    title: page?.metaTitle || "About Anna Almiroudis | Functional Nutritionist in Astoria, NYC",
    description: page?.metaDescription || "",
    path: "/about",
  });
}

function polishAboutText(paragraph: string) {
  return normalizeCredentials(
    withUpdatedSoundCredential(paragraph).replace(
      /\bCertified Health Coach\b/g,
      "Certified Integrative Nutrition Health Coach (CINHC)",
    ),
  );
}

export default async function AboutPage() {
  const [page, settings] = await Promise.all([getPage("about"), getSettings()]);
  const hero = resolveHeroText(page);
  const content = resolveAboutContent(page?.content);
  const { name, credentials } = splitPractitionerHeading(page?.heroHeading || settings.practitionerName);

  return (
    <>
      <PageHero
        eyebrow="About · Astoria, Queens & NYC"
        heading={name}
        headingSubtitle={credentials || ABOUT_CREDENTIALS}
        subheading={hero.subheading || ABOUT_HERO_SUBHEADING}
        image={
          page?.heroImage ||
          "https://images.unsplash.com/photo-1467453678174-768ec283a940?auto=format&fit=crop&w=1400&q=80"
        }
        imageAlt={page?.heroImageAlt || "Tea and greens at Functional Nourishment, a nutrition practice in Astoria, Queens"}
      />
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-[1fr_1.2fr] md:px-6">
        <div className="relative aspect-[3/4] overflow-hidden rounded-3xl">
          <Image
            src={SITE_IMAGES.practitionerPortrait}
            alt={SITE_IMAGES.practitionerPortraitAlt}
            fill
            className="object-cover object-top"
          />
        </div>
        <div className="prose-fn">
          {content.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{polishAboutText(paragraph)}</p>
          ))}
          <h2>Credentials</h2>
          <ul>
            {content.credentials.map((item) => (
              <li key={item}>{polishAboutText(item)}</li>
            ))}
          </ul>
          <p className="mt-8 text-sm leading-relaxed text-muted">{content.bookNote}</p>
          <p className="mt-5">
            <a
              href={AMAZON_BOOK_URL}
              target="_blank"
              rel="noreferrer"
              className="btn-outline"
            >
              Buy on Amazon
            </a>
          </p>
        </div>
      </section>
      <CtaBand berryStreetUrl={settings.berryStreetUrl} bookingUrl={settings.bookingUrl} />
    </>
  );
}
