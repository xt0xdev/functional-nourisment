import { getPage, getSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { ContactForm } from "@/components/site/ContactForm";

export async function generateMetadata() {
  const page = await getPage("contact");
  return buildMetadata({
    title: page?.metaTitle || "Contact",
    description: page?.metaDescription || "",
    path: "/contact",
  });
}

export default async function ContactPage() {
  const [page, settings] = await Promise.all([getPage("contact"), getSettings()]);

  return (
    <>
      <PageHero
        eyebrow="Say hello"
        heading={page?.heroHeading || ""}
        subheading={page?.heroSubheading}
        image="https://images.unsplash.com/photo-1467453678174-768ec283a940?auto=format&fit=crop&w=1400&q=80"
        imageAlt="Tea and a notebook for getting in touch"
      />
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:px-6">
        <div>
          <p className="text-lg text-muted">
            In-person and remote appointments offered in Astoria, NY and across the NYC metro area.
          </p>
          <p className="mt-6 text-forest">
            Email:{" "}
            <a className="underline" href={`mailto:${settings.email}`}>
              {settings.email}
            </a>
          </p>
          <p className="mt-2 text-muted">{settings.address}</p>
          <p className="mt-6 text-sm text-muted">{settings.bookingNote}</p>
          <div className="mt-8 overflow-hidden rounded-3xl border border-forest/10">
            <iframe
              title="Map of Astoria, New York"
              className="h-72 w-full"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-73.94%2C40.76%2C-73.88%2C40.79&layer=mapnik&marker=40.7764,-73.9106"
            />
          </div>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <ContactForm defaultTopic="General" />
        </div>
      </section>
    </>
  );
}
