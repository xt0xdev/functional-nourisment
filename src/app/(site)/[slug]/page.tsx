import { notFound } from "next/navigation";
import { getPage, getSettings } from "@/lib/content";
import { RESERVED_SLUGS } from "@/lib/menu";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/CtaBand";
import { renderRichText } from "@/lib/rich-text";

function renderBody(content: string) {
  try {
    const parsed = JSON.parse(content) as { paragraphs?: string[]; body?: string };
    if (Array.isArray(parsed.paragraphs)) {
      return parsed.paragraphs.map((paragraph) => <p key={paragraph.slice(0, 32)}>{paragraph}</p>);
    }
    if (parsed.body) {
      return renderRichText(parsed.body);
    }
  } catch {
    /* plain text */
  }
  return renderRichText(content);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (RESERVED_SLUGS.has(slug)) return {};
  const page = await getPage(slug);
  if (!page || !page.published) return {};
  return buildMetadata({
    title: page.metaTitle || page.title,
    description: page.metaDescription,
    path: `/${page.slug}`,
  });
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (RESERVED_SLUGS.has(slug)) notFound();
  const [page, settings] = await Promise.all([getPage(slug), getSettings()]);
  if (!page || !page.published) notFound();

  return (
    <>
      <PageHero
        heading={page.heroHeading || page.title}
        subheading={page.heroSubheading}
        image={page.heroImage || undefined}
        imageAlt={page.heroImageAlt || page.title}
      />
      <section className="prose-fn mx-auto px-4 py-12 md:px-6">{renderBody(page.content)}</section>
      <CtaBand berryStreetUrl={settings.berryStreetUrl} bookingUrl={settings.bookingUrl} />
    </>
  );
}
