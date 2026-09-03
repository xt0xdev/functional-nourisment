import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocation, locations } from "@/lib/locations";
import { getSettings } from "@/lib/content";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/CtaBand";
import { siteUrl } from "@/lib/content";

export function generateStaticParams() {
  return locations.map((location) => ({ slug: location.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const location = getLocation(slug);
  if (!location) return {};
  return buildMetadata({
    title: location.title,
    description: location.description,
    path: `/locations/${location.slug}`,
  });
}

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const location = getLocation(slug);
  if (!location) notFound();
  const settings = await getSettings();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "MedicalWebPage",
          name: location.title,
          description: location.description,
          about: "Nutritionist",
          url: siteUrl(`/locations/${location.slug}`),
          audience: { "@type": "PeopleAudience", geographicArea: location.name },
        }}
      />
      <PageHero eyebrow={`Nutritionist in ${location.name}`} heading={location.heading} subheading={location.intro} />
      <section className="prose-fn mx-auto px-4 py-16 md:px-6">
        {location.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
        <p>
          Explore related pages:{" "}
          {locations
            .filter((item) => item.slug !== location.slug)
            .map((item, index) => (
              <span key={item.slug}>
                {index > 0 ? " · " : ""}
                <Link href={`/locations/${item.slug}`}>{item.name}</Link>
              </span>
            ))}
          .
        </p>
      </section>
      <CtaBand berryStreetUrl={settings.berryStreetUrl} />
    </>
  );
}
