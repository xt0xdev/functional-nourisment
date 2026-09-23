import { getPage, getSettings } from "@/lib/content";
import { resolveBookingUrl } from "@/lib/booking";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { ContactForm } from "@/components/site/ContactForm";
import { ServiceArea } from "@/components/site/ServiceArea";
import { CONTACT_HERO, CONTACT_SECOND } from "@/lib/page-copy";
import { SITE_IMAGES, isStockOrEmptyImage } from "@/lib/site-images";

export async function generateMetadata() {
  const page = await getPage("contact");
  return buildMetadata({
    title: page?.metaTitle || "Contact a Nutritionist in Astoria, Queens & NYC",
    description: page?.metaDescription || CONTACT_HERO,
    path: "/contact",
  });
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ discovery?: string; interest?: string }>;
}) {
  const [{ discovery, interest }, page, settings] = await Promise.all([
    searchParams,
    getPage("contact"),
    getSettings(),
  ]);
  const isDiscovery = discovery === "1";
  const calendlyUrl = resolveBookingUrl(settings);

  return (
    <>
      <PageHero
        eyebrow="Say hello"
        heading={page?.heroHeading || "Contact"}
        subheading={CONTACT_HERO}
        image={isStockOrEmptyImage(page?.heroImage) ? SITE_IMAGES.landingMeet : page!.heroImage}
        imageAlt={page?.heroImageAlt || SITE_IMAGES.landingMeetAlt}
      />
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:px-6">
        <div>
          <p className="text-lg text-muted">{CONTACT_SECOND}</p>
          <p className="mt-6 text-forest">
            Email:{" "}
            <a className="underline" href={`mailto:${settings.email}`}>
              {settings.email}
            </a>
          </p>
          <p className="mt-2 text-muted">{settings.address}</p>
          <div className="mt-8 overflow-hidden rounded-3xl border border-forest/10">
            <iframe
              title="Map of Astoria, New York"
              className="h-72 w-full"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-73.94%2C40.76%2C-73.88%2C40.79&layer=mapnik&marker=40.7764,-73.9106"
            />
          </div>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          {isDiscovery ? (
            <>
              <h2 className="font-serif text-3xl text-forest">Book a Discovery Call</h2>
              <p className="mt-2 mb-6 text-sm text-muted">
                Share a few details first. After you send your inquiry, you can choose a time for your
                complimentary call.
              </p>
            </>
          ) : null}
          <ContactForm
            variant={isDiscovery ? "discovery" : "contact"}
            defaultTopic={isDiscovery ? "Nutrition Counseling" : interest || "General Inquiry"}
            redirectTo={isDiscovery ? calendlyUrl : undefined}
          />
        </div>
      </section>
      <ServiceArea intro="Whether you live in Astoria, elsewhere in Queens, or across New York City, you can reach Anna for remote nutrition care or in-person mind-body sessions." />
    </>
  );
}
