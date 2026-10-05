import { getPage, getSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/CtaBand";
import {
  COLLABORATIVE_CARE_META_DESCRIPTION,
  COLLABORATIVE_CARE_META_TITLE,
  COLLABORATIVE_CARE_TITLE,
} from "@/lib/page-copy";
import { resolveCollaborativeContent, resolveHeroText } from "@/lib/page-templates";
import { getStoredLayout } from "@/lib/page-layout";
import { PageBodyOrLayout } from "@/components/site/PageLayoutBody";
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
  const hero = resolveHeroText(page);
  const content = resolveCollaborativeContent(page?.content);
  const layout = getStoredLayout(page?.content);

  return (
    <>
      <PageHero
        eyebrow={content.eyebrow}
        heading={hero.heading || COLLABORATIVE_CARE_TITLE}
        subheading={hero.subheading || COLLABORATIVE_CARE_META_DESCRIPTION}
        image={isStockOrEmptyImage(page?.heroImage) ? SITE_IMAGES.wellnessDining : page!.heroImage}
        imageAlt={page?.heroImageAlt || SITE_IMAGES.wellnessDiningAlt}
      />
      <PageBodyOrLayout
        layout={layout}
        fallback={
          <section className="mx-auto max-w-5xl px-4 pt-16 md:px-6">
        <div className="max-w-3xl space-y-5 text-lg leading-relaxed text-muted">
          {content.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </div>
          </section>
        }
      />
      <section className="mx-auto max-w-5xl px-4 pb-16 md:px-6">
        <article className="mt-12 max-w-3xl rounded-3xl bg-mist p-8 shadow-sm ring-1 ring-primary/10">
          <p className="eyebrow">Wellness partner</p>
          <h2 className="mt-3 font-serif text-3xl text-primary">{content.partnerName}</h2>
          <p className="mt-2 font-medium text-primary">{content.partnerDetail}</p>
          {content.partnerBody.map((paragraph) => (
            <p key={paragraph.slice(0, 48)} className="mt-4 leading-relaxed text-muted">
              {paragraph}
            </p>
          ))}
          <a
            href={content.partnerUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-primary mt-6"
          >
            {content.partnerLabel}
          </a>
        </article>
      </section>
      <CtaBand berryStreetUrl={settings.berryStreetUrl} bookingUrl={settings.bookingUrl} />
    </>
  );
}
