import Link from "next/link";
import { getPage } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { ExperiencesGallery } from "@/components/site/ExperiencesGallery";
import { EXPERIENCES_SUB, EXPERIENCES_TITLE } from "@/lib/page-copy";
import { resolveExperiencesContent, resolveHeroText } from "@/lib/page-templates";
import { getStoredLayout } from "@/lib/page-layout";
import { PageBodyOrLayout } from "@/components/site/PageLayoutBody";
import { SITE_IMAGES, isStockOrEmptyImage } from "@/lib/site-images";

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
  const hero = resolveHeroText(page);
  const content = resolveExperiencesContent(page?.content);
  const layout = getStoredLayout(page?.content);

  return (
    <>
      <PageHero
        eyebrow="Wellness"
        heading={hero.heading || EXPERIENCES_TITLE}
        subheading={hero.subheading || EXPERIENCES_SUB}
        image={isStockOrEmptyImage(page?.heroImage) ? SITE_IMAGES.wellnessYoga : page!.heroImage}
        imageAlt={page?.heroImageAlt || SITE_IMAGES.wellnessYogaAlt}
      />
      <PageBodyOrLayout
        layout={layout}
        fallback={
          <section className="mx-auto max-w-5xl px-4 pt-16 md:px-6">
        <p className="max-w-3xl text-lg leading-relaxed text-muted">{content.intro}</p>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted">{content.introMore}</p>
        <p className="mt-8">
          <Link href="/calendar" className="btn-primary">
            View Upcoming Dates
          </Link>
        </p>

        <div className="mt-14 grid gap-6">
          {content.experienceSections.map((section) => (
            <article key={section.title} className="rounded-3xl bg-white p-8 shadow-sm">
              <h2 className="font-serif text-3xl text-primary">{section.title}</h2>
              <p className="mt-4 leading-relaxed text-muted">{section.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-14 rounded-3xl bg-mist p-8">
          <h2 className="font-serif text-3xl text-primary">{content.groupHeading}</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted">{content.groupBody}</p>
          <Link href="/contact?interest=Workshops+%26+Events" className="btn-primary mt-6">
            Inquire About a Private or Group Experience
          </Link>
        </div>
          </section>
        }
      />
      <section className="mx-auto max-w-5xl px-4 py-16 md:px-6">
        {content.gallery.length ? (
          <div className="mt-14">
            <ExperiencesGallery
              eyebrow={content.galleryEyebrow}
              heading={content.galleryHeading}
              items={content.gallery}
            />
          </div>
        ) : null}

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <article className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="font-serif text-3xl text-primary">{content.datesHeading}</h2>
            <Link href="/calendar" className="btn-outline mt-6">
              View Calendar
            </Link>
          </article>
          <article className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="font-serif text-3xl text-primary">{content.retreatsHeading}</h2>
            <Link href="/retreats" className="btn-outline mt-6">
              Explore Retreats
            </Link>
          </article>
        </div>
      </section>
    </>
  );
}
