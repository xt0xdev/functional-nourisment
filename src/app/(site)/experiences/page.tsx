import Link from "next/link";
import { getPage, parseContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { SmartImage } from "@/components/site/SmartImage";
import {
  EXPERIENCES_GROUP_BODY,
  EXPERIENCES_GROUP_HEADING,
  EXPERIENCES_INTRO,
  EXPERIENCES_INTRO_MORE,
  EXPERIENCES_SUB,
  EXPERIENCES_TITLE,
  EXPERIENCE_SECTIONS,
} from "@/lib/page-copy";
import { SITE_IMAGES, WELLNESS_GALLERY, isStockOrEmptyImage } from "@/lib/site-images";

export async function generateMetadata() {
  const page = await getPage("experiences");
  return buildMetadata({
    title: page?.metaTitle || "Workshops & Experiences | Functional Nourishment",
    description: page?.metaDescription || EXPERIENCES_SUB,
    path: "/experiences",
  });
}

export default async function ExperiencesPage() {
  const page = await getPage("experiences");
  const content = parseContent<{ intro?: string; introMore?: string }>(page?.content || "{}", {});

  return (
    <>
      <PageHero
        eyebrow="Wellness"
        heading={page?.heroHeading || EXPERIENCES_TITLE}
        subheading={page?.heroSubheading || EXPERIENCES_SUB}
        image={isStockOrEmptyImage(page?.heroImage) ? SITE_IMAGES.wellnessYoga : page!.heroImage}
        imageAlt={page?.heroImageAlt || SITE_IMAGES.wellnessYogaAlt}
      />
      <section className="mx-auto max-w-5xl px-4 py-16 md:px-6">
        <p className="max-w-3xl text-lg leading-relaxed text-muted">
          {content.intro?.includes("invitation to pause") ? content.intro : EXPERIENCES_INTRO}
        </p>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted">
          {content.introMore || EXPERIENCES_INTRO_MORE}
        </p>
        <p className="mt-8">
          <Link href="/calendar" className="btn-primary">
            View Upcoming Events
          </Link>
        </p>

        <div className="mt-14 grid gap-6">
          {EXPERIENCE_SECTIONS.map((section) => (
            <article key={section.title} className="rounded-3xl bg-white p-8 shadow-sm">
              <h2 className="font-serif text-3xl text-primary">{section.title}</h2>
              <p className="mt-4 leading-relaxed text-muted">{section.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-14 rounded-3xl bg-mist p-8">
          <h2 className="font-serif text-3xl text-primary">{EXPERIENCES_GROUP_HEADING}</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted">{EXPERIENCES_GROUP_BODY}</p>
          <Link href="/contact?interest=Workshops+%26+Events" className="btn-primary mt-6">
            Inquire About a Private or Group Experience
          </Link>
        </div>

        <div className="mt-14">
          <p className="eyebrow">From the field</p>
          <h2 className="mt-3 font-serif text-3xl text-primary">Workshops, sound, and gathering</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {WELLNESS_GALLERY.map((photo) => (
              <figure key={photo.src} className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-mist">
                <SmartImage src={photo.src} alt={photo.alt} fill className="object-cover" sizes="(min-width: 1024px) 33vw, 50vw" />
              </figure>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <article className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="font-serif text-3xl text-primary">Looking for an upcoming experience?</h2>
            <Link href="/calendar" className="btn-outline mt-6">
              View Calendar
            </Link>
          </article>
          <article className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="font-serif text-3xl text-primary">Looking for something more immersive?</h2>
            <Link href="/retreats" className="btn-outline mt-6">
              Explore Retreats
            </Link>
          </article>
        </div>
      </section>
    </>
  );
}
