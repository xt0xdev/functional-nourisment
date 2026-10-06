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
import { WellnessPartnerCard } from "@/components/site/WellnessPartnerCard";
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
      {content.partners.length ? (
        <section className="mx-auto max-w-5xl px-4 pb-16 md:px-6">
          <div className="mt-12 grid gap-8">
            {content.partners.map((partner) => (
              <WellnessPartnerCard key={partner.id} partner={partner} />
            ))}
          </div>
        </section>
      ) : null}
      <CtaBand berryStreetUrl={settings.berryStreetUrl} bookingUrl={settings.bookingUrl} />
    </>
  );
}
