import { getPage, getSettings, parseContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/CtaBand";
import {
  COLLABORATIVE_CARE_BODY,
  COLLABORATIVE_CARE_EYEBROW,
  COLLABORATIVE_CARE_META_DESCRIPTION,
  COLLABORATIVE_CARE_META_TITLE,
  COLLABORATIVE_CARE_PARTNER_LABEL,
  COLLABORATIVE_CARE_PARTNER_URL,
  COLLABORATIVE_CARE_TITLE,
} from "@/lib/page-copy";
import { SITE_IMAGES, isStockOrEmptyImage } from "@/lib/site-images";

export async function generateMetadata() {
  const page = await getPage("collaborative-care");
  return buildMetadata({
    title: page?.metaTitle || COLLABORATIVE_CARE_META_TITLE,
    description: page?.metaDescription || COLLABORATIVE_CARE_META_DESCRIPTION,
    path: "/collaborative-care",
  });
}

export default async function CollaborativeCarePage() {
  const [page, settings] = await Promise.all([getPage("collaborative-care"), getSettings()]);
  const content = parseContent<{ body?: string }>(page?.content || "{}", {});
  const body = content.body?.trim() || COLLABORATIVE_CARE_BODY;

  return (
    <>
      <PageHero
        eyebrow={COLLABORATIVE_CARE_EYEBROW}
        heading={page?.heroHeading || COLLABORATIVE_CARE_TITLE}
        subheading={page?.heroSubheading || COLLABORATIVE_CARE_META_DESCRIPTION}
        image={isStockOrEmptyImage(page?.heroImage) ? SITE_IMAGES.wellnessDining : page!.heroImage}
        imageAlt={page?.heroImageAlt || SITE_IMAGES.wellnessDiningAlt}
      />
      <section className="mx-auto max-w-5xl px-4 py-16 md:px-6">
        <p className="max-w-3xl text-lg leading-relaxed text-muted">{body}</p>
        <article className="mt-12 max-w-3xl rounded-3xl bg-mist p-8 shadow-sm ring-1 ring-primary/10">
          <p className="eyebrow">Partner practitioner</p>
          <h2 className="mt-3 font-serif text-3xl text-primary">Mike Kokkolis</h2>
          <p className="mt-3 leading-relaxed text-muted">
            Nutritionist collaboration with Bell Dental Care — complementary clinical perspective for
            patients who want oral health and whole-person nutrition support together.
          </p>
          <a
            href={COLLABORATIVE_CARE_PARTNER_URL}
            target="_blank"
            rel="noreferrer"
            className="btn-primary mt-6"
          >
            {COLLABORATIVE_CARE_PARTNER_LABEL}
          </a>
        </article>
      </section>
      <CtaBand berryStreetUrl={settings.berryStreetUrl} bookingUrl={settings.bookingUrl} />
    </>
  );
}
