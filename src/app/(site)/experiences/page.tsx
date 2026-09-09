import Link from "next/link";
import { getExperiences, getPage, getSettings, parseContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/CtaBand";
import {
  EXPERIENCES_INTRO,
  EXPERIENCES_INTRO_MORE,
  SQUARESPACE_EXPERIENCES,
} from "@/lib/page-copy";

export async function generateMetadata() {
  const page = await getPage("experiences");
  return buildMetadata({
    title: page?.metaTitle || "Corporate Wellness Workshops in NYC | Nutrition & Sound Baths",
    description: page?.metaDescription || EXPERIENCES_INTRO,
    path: "/experiences",
  });
}

export default async function ExperiencesPage() {
  const [page, settings, experiences] = await Promise.all([
    getPage("experiences"),
    getSettings(),
    getExperiences(),
  ]);
  const content = parseContent<{ intro?: string; introMore?: string }>(page?.content || "{}", {});
  const listings = experiences.length
    ? experiences
    : SQUARESPACE_EXPERIENCES.map((item) => ({
        id: item.slug,
        ...item,
      }));

  return (
    <>
      <PageHero
        eyebrow="Community · NYC, Queens & Astoria"
        heading={page?.heroHeading || "Wellness Experiences"}
        subheading={
          page?.heroSubheading ||
          "Bespoke corporate wellness workshops and intimate local experiences across New York City, Queens, and Astoria."
        }
        image={
          page?.heroImage ||
          "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1400&q=80"
        }
        imageAlt={page?.heroImageAlt || "Hands preparing whole foods for a wellness workshop in New York City"}
      />
      <section className="mx-auto max-w-5xl px-4 py-16 md:px-6">
        <p className="max-w-3xl text-lg leading-relaxed text-muted">
          {content.intro?.includes("bespoke corporate wellness workshops") ? content.intro : EXPERIENCES_INTRO}
        </p>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted">
          {content.introMore || EXPERIENCES_INTRO_MORE}
        </p>
        <div className="mt-10 grid gap-6">
          {listings.map((experience) => (
            <article key={experience.id} className="rounded-3xl bg-white p-8 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-clay">{experience.subtitle}</p>
              <h2 className="mt-2 font-serif text-3xl text-forest">{experience.title}</h2>
              <div className="mt-4 space-y-4 leading-relaxed text-muted">
                {experience.body.split(/\n\n+/).map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                ))}
              </div>
              <p className="mt-5 text-sm text-muted">
                Stay tuned for future dates by checking the{" "}
                <Link href="/calendar" className="text-teal hover:underline">
                  workshop page
                </Link>
                .
              </p>
            </article>
          ))}
        </div>
      </section>
      <CtaBand berryStreetUrl={settings.berryStreetUrl} bookingUrl={settings.bookingUrl} />
    </>
  );
}
