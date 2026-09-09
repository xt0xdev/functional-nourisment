import Image from "next/image";
import { getPage, getSettings, parseContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/CtaBand";
import { CHILDRENS_BOOK_NOTE, PRACTITIONER_CREDIT } from "@/lib/site-defaults";
import {
  ABOUT_CREDENTIAL_SOUND,
  ABOUT_CREDENTIALS,
  ABOUT_HERO_SUBHEADING,
  AMAZON_BOOK_URL,
  splitPractitionerHeading,
  withUpdatedSoundCredential,
} from "@/lib/page-copy";

export async function generateMetadata() {
  const page = await getPage("about");
  return buildMetadata({
    title: page?.metaTitle || "About Anna Almiroudis | Functional Nutritionist in Astoria, NYC",
    description: page?.metaDescription || "",
    path: "/about",
  });
}

export default async function AboutPage() {
  const [page, settings] = await Promise.all([getPage("about"), getSettings()]);
  const content = parseContent<{ paragraphs: string[] }>(page?.content || "{}", { paragraphs: [] });
  const { name, credentials } = splitPractitionerHeading(page?.heroHeading || settings.practitionerName);
  const subheading =
    page?.heroSubheading?.includes("Certified and NYS licensed")
      ? page.heroSubheading
      : ABOUT_HERO_SUBHEADING;

  return (
    <>
      <PageHero
        eyebrow="About · Astoria, Queens & NYC"
        heading={name}
        headingSubtitle={credentials || ABOUT_CREDENTIALS}
        subheading={subheading}
        image={
          page?.heroImage ||
          "https://images.unsplash.com/photo-1467453678174-768ec283a940?auto=format&fit=crop&w=1400&q=80"
        }
        imageAlt={page?.heroImageAlt || "Tea and greens at Functional Nourishment, a nutrition practice in Astoria, Queens"}
      />
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-[1fr_1.2fr] md:px-6">
        <div className="relative aspect-[3/4] overflow-hidden rounded-3xl">
          <Image
            src="/images/anna-almiroudis.webp"
            alt="Anna Almiroudis, functional nutritionist in Astoria, Queens, serving New York City"
            fill
            className="object-cover object-top"
          />
        </div>
        <div className="prose-fn">
          {content.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{withUpdatedSoundCredential(paragraph)}</p>
          ))}
          <h2>Credentials</h2>
          <ul>
            <li>Master of Science (MS)</li>
            <li>Certified Nutrition Specialist (CNS)</li>
            <li>Licensed Nutritionist (LN)</li>
            <li>Certified Dietitian-Nutritionist, New York (CDN)</li>
            <li>Certified Holistic Health Coach (CHHC)</li>
            <li>Karuna® and Usui Reiki Master</li>
            <li>{ABOUT_CREDENTIAL_SOUND}</li>
          </ul>
          <p className="mt-8 text-sm text-muted">{PRACTITIONER_CREDIT}</p>
          <p className="mt-4 text-sm leading-relaxed text-muted">{CHILDRENS_BOOK_NOTE}</p>
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
