import Link from "next/link";
import { getPage, getSettings, parseContent } from "@/lib/content";
import { resolveBookingUrl } from "@/lib/booking";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { ContactForm } from "@/components/site/ContactForm";
import { SITE_IMAGES, isStockOrEmptyImage } from "@/lib/site-images";

export async function generateMetadata() {
  const page = await getPage("book");
  return buildMetadata({
    title: page?.metaTitle || "Book a Nutritionist in Astoria, Queens & NYC",
    description: page?.metaDescription || "",
    path: "/book",
  });
}

export default async function BookPage() {
  const [page, settings] = await Promise.all([getPage("book"), getSettings()]);
  const content = parseContent<{ paragraphs: string[] }>(page?.content || "{}", { paragraphs: [] });
  const calendlyUrl = resolveBookingUrl(settings);

  return (
    <>
      <PageHero
        eyebrow="Appointments · Astoria, Queens & NYC"
        heading={page?.heroHeading || "Book a Discovery Call"}
        subheading={
          page?.heroSubheading ||
          "Share a few details first. After your inquiry is received, you can choose a time for a complimentary 20-minute call."
        }
        image={isStockOrEmptyImage(page?.heroImage) ? SITE_IMAGES.landingMeet : page!.heroImage}
        imageAlt={page?.heroImageAlt || SITE_IMAGES.landingMeetAlt}
      />
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:px-6">
        <div className="prose-fn">
          {content.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 28)}>{paragraph}</p>
          ))}
          <p>
            Insurance and Berry Street bookings stay direct — no discovery call is required if you are
            ready to schedule nutrition counseling through insurance.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={settings.berryStreetUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-outline no-underline"
            >
              Book through Berry Street
            </a>
            <Link href="/calendar" className="btn-outline no-underline">
              View the calendar
            </Link>
          </div>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="font-serif text-3xl text-forest">Free 20-minute discovery call</h2>
          <p className="mt-2 mb-6 text-sm text-muted">
            Please complete this inquiry first. After you send it, you can choose a time on Calendly.
            Anna reviews messages before the call.
          </p>
          <ContactForm
            defaultTopic="Nutrition Counseling"
            showCalendlyOnSuccess
            calendlyUrl={calendlyUrl}
          />
        </div>
      </section>
    </>
  );
}
