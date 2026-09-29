import { getPage, getSettings, parseContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/CtaBand";
import {
  COLLABORATIVE_CARE_BODY,
  COLLABORATIVE_CARE_EYEBROW,
  COLLABORATIVE_CARE_META_DESCRIPTION,
  COLLABORATIVE_CARE_META_TITLE,
  COLLABORATIVE_CARE_PARAGRAPHS,
  COLLABORATIVE_CARE_PARTNER_BODY,
  COLLABORATIVE_CARE_PARTNER_DETAIL,
  COLLABORATIVE_CARE_PARTNER_LABEL,
  COLLABORATIVE_CARE_PARTNER_NAME,
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
  const storedBody = content.body?.trim() || "";
  const paragraphs =
    storedBody && storedBody !== COLLABORATIVE_CARE_BODY
      ? storedBody.split(/\n\n+/).filter(Boolean)
      : [...COLLABORATIVE_CARE_PARAGRAPHS];

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
        <div className="max-w-3xl space-y-5 text-lg leading-relaxed text-muted">
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </div>
        <article className="mt-12 max-w-3xl rounded-3xl bg-mist p-8 shadow-sm ring-1 ring-primary/10">
          <p className="eyebrow">Wellness partner</p>
          <h2 className="mt-3 font-serif text-3xl text-primary">{COLLABORATIVE_CARE_PARTNER_NAME}</h2>
          <p className="mt-2 font-medium text-primary">{COLLABORATIVE_CARE_PARTNER_DETAIL}</p>
          {COLLABORATIVE_CARE_PARTNER_BODY.map((paragraph) => (
            <p key={paragraph.slice(0, 48)} className="mt-4 leading-relaxed text-muted">
              {paragraph}
            </p>
          ))}
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
