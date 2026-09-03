import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocation, locations } from "@/lib/locations";
import { getSettings } from "@/lib/content";
import { breadcrumbSchema, buildMetadata, faqPageSchema, JsonLd } from "@/lib/seo";
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
    keywords: [
      `nutritionist ${location.name}`,
      `nutritionist in ${location.name}`,
      "nutritionist Astoria",
      "nutritionist Queens",
      "nutritionist NYC",
      "functional nutritionist New York",
      "Anna Almiroudis",
      "Functional Nourishment",
    ],
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
          sourceOrganization: "Functional Nourishment",
        }}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: `Nutritionist in ${location.name}`, path: `/locations/${location.slug}` },
        ])}
      />
      {location.faqs.length > 0 ? <JsonLd data={faqPageSchema(location.faqs)} /> : null}
      <PageHero
        eyebrow={`Nutritionist in ${location.name}`}
        heading={location.heading}
        subheading={location.intro}
      />
      <section className="mx-auto max-w-4xl px-4 py-16 md:px-6">
        <div className="prose-fn">
          {location.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>
        {location.neighborhoods.length > 0 ? (
          <div className="mt-10">
            <h2 className="font-serif text-3xl text-primary">Neighborhoods we serve</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {location.neighborhoods.map((neighborhood) => (
                <li
                  key={neighborhood}
                  className="rounded-full bg-mist px-4 py-2 text-sm text-primary"
                >
                  {neighborhood}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {location.faqs.length > 0 ? (
          <div className="mt-12">
            <h2 className="font-serif text-3xl text-primary">
              Questions about nutrition care in {location.name}
            </h2>
            <div className="mt-6 grid gap-4">
              {location.faqs.map((item) => (
                <article key={item.q} className="rounded-2xl bg-mist p-5">
                  <h3 className="font-serif text-xl text-primary">{item.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.a}</p>
                </article>
              ))}
            </div>
          </div>
        ) : null}
        <p className="mt-12 text-sm text-muted">
          Explore related pages:{" "}
          {locations
            .filter((item) => item.slug !== location.slug)
            .map((item, index) => (
              <span key={item.slug}>
                {index > 0 ? " · " : ""}
                <Link href={`/locations/${item.slug}`} className="text-teal hover:underline">
                  {item.name}
                </Link>
              </span>
            ))}
          .
        </p>
      </section>
      <CtaBand
        berryStreetUrl={settings.berryStreetUrl}
        bookingUrl={settings.bookingUrl}
        showServiceArea={false}
      />
    </>
  );
}
