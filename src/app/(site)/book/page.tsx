import { getPage, getSettings, parseContent } from "@/lib/content";
import { bookingLinkProps, resolveBookingUrl } from "@/lib/booking";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { ContactForm } from "@/components/site/ContactForm";

export async function generateMetadata() {
  const page = await getPage("book");
  return buildMetadata({
    title: page?.metaTitle || "Book",
    description: page?.metaDescription || "",
    path: "/book",
  });
}

export default async function BookPage() {
  const [page, settings] = await Promise.all([getPage("book"), getSettings()]);
  const content = parseContent<{ paragraphs: string[] }>(page?.content || "{}", { paragraphs: [] });

  return (
    <>
      <PageHero
        eyebrow="Appointments"
        heading={page?.heroHeading || ""}
        subheading={page?.heroSubheading}
        image="https://images.unsplash.com/photo-1467453678174-768ec283a940?auto=format&fit=crop&w=1400&q=80"
        imageAlt="A quiet table set for a wellness conversation"
      />
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:px-6">
        <div className="prose-fn">
          {content.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 28)}>{paragraph}</p>
          ))}
          <div className="flex flex-wrap gap-3">
            <a className="btn-primary no-underline" {...bookingLinkProps(resolveBookingUrl(settings))}>
              Book a Discovery Call
            </a>
            <a
              href={settings.berryStreetUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-outline no-underline"
            >
              Book through Berry Street
            </a>
          </div>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="font-serif text-3xl text-forest">Free 20-minute discovery call</h2>
          <p className="mt-2 mb-6 text-sm text-muted">
            For out-of-network nutritional counseling and questions about fit.
          </p>
          <ContactForm defaultTopic="Discovery call" />
        </div>
      </section>
    </>
  );
}
