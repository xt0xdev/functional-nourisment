import { getPage, getSettings, parseContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/CtaBand";

export async function generateMetadata() {
  const page = await getPage("meditation");
  return buildMetadata({
    title: page?.metaTitle || "Meditation & Breathwork in Astoria, NYC",
    description: page?.metaDescription || "",
    path: "/meditation",
  });
}

export default async function MeditationPage() {
  const [page, settings] = await Promise.all([getPage("meditation"), getSettings()]);
  const content = parseContent<{ paragraphs: string[] }>(page?.content || "{}", { paragraphs: [] });

  return (
    <>
      <PageHero
        eyebrow="Spirit · Astoria, Queens & NYC"
        heading={page?.heroHeading || ""}
        subheading={page?.heroSubheading}
        image="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80"
        imageAlt="Calm ocean view for meditation and breathwork clients in Queens and NYC"
      />
      <section className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <div className="prose-fn">
          {content.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 36)}>{paragraph}</p>
          ))}
        </div>
      </section>
      <CtaBand berryStreetUrl={settings.berryStreetUrl} bookingUrl={settings.bookingUrl} />
    </>
  );
}
