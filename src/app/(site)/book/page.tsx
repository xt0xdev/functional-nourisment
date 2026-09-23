import { getPage, getSettings } from "@/lib/content";
import { resolveBookingUrl } from "@/lib/booking";
import { buildMetadata } from "@/lib/seo";
import { ContactForm } from "@/components/site/ContactForm";
import { SmartImage } from "@/components/site/SmartImage";
import { resolveBookBrandImage } from "@/lib/site-images";
import {
  BOOK_BERRY_STREET_LABEL,
  BOOK_CONNECT_BODY,
  BOOK_CONNECT_TITLE,
  BOOK_EYEBROW,
  BOOK_FORM_INTRO,
  BOOK_FORM_LEAD,
  BOOK_FORM_NOTE,
  BOOK_FORM_TITLE,
  BOOK_HEADING,
  BOOK_INQUIRIES_TITLE,
  BOOK_INSURANCE_BODY,
  BOOK_INSURANCE_TITLE,
  BOOK_INTRO,
  BOOK_LEAD,
  BOOK_META_DESCRIPTION,
  BOOK_META_TITLE,
  BOOK_TAGLINE,
} from "@/lib/page-copy";

export async function generateMetadata() {
  const page = await getPage("book");
  return buildMetadata({
    title: page?.metaTitle || BOOK_META_TITLE,
    description: page?.metaDescription || BOOK_META_DESCRIPTION,
    path: "/book",
  });
}

export default async function BookPage() {
  const [page, settings] = await Promise.all([getPage("book"), getSettings()]);
  const calendlyUrl = resolveBookingUrl(settings);
  const brandImage = resolveBookBrandImage(page?.heroImage, page?.heroImageAlt);
  const inquiryEmail = settings.email || "functionalnurture@gmail.com";

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-4 pt-10 md:px-6 md:pt-14">
        <div className="relative aspect-[16/7] overflow-hidden rounded-3xl bg-mist md:aspect-[21/8]">
          <SmartImage
            src={brandImage.src}
            alt={brandImage.alt}
            fill
            className="object-cover"
            priority
            sizes="(min-width: 768px) 72rem, 100vw"
          />
        </div>
      </div>
      <div className="mx-auto grid max-w-6xl items-start gap-12 px-4 py-14 md:grid-cols-2 md:px-6 md:py-16">
        <div>
          <p className="eyebrow">{BOOK_EYEBROW}</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-primary md:text-6xl">{BOOK_HEADING}</h1>
          <p className="mt-5 text-lg font-medium leading-relaxed text-primary">{BOOK_LEAD}</p>
          <p className="mt-4 leading-relaxed text-muted">{BOOK_INTRO}</p>

          <h2 className="mt-10 font-serif text-3xl text-primary">{BOOK_CONNECT_TITLE}</h2>
          <p className="mt-3 leading-relaxed text-muted">{BOOK_CONNECT_BODY}</p>

          <h2 className="mt-10 font-serif text-3xl text-primary">{BOOK_INSURANCE_TITLE}</h2>
          <p className="mt-3 leading-relaxed text-muted">{BOOK_INSURANCE_BODY}</p>
          <a
            href={settings.berryStreetUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-outline mt-5 no-underline"
          >
            {BOOK_BERRY_STREET_LABEL}
          </a>

          <h2 className="mt-10 font-serif text-3xl text-primary">{BOOK_INQUIRIES_TITLE}</h2>
          <p className="mt-3 leading-relaxed text-muted">
            For questions about my services, sound bath meditations, wellness events, or collaborations,
            please email{" "}
            <a className="underline" href={`mailto:${inquiryEmail}`}>
              {inquiryEmail}
            </a>
            .
          </p>

          <p className="mt-10 font-serif text-2xl italic text-primary">{BOOK_TAGLINE}</p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-primary/10 md:sticky md:top-28">
          <h2 className="font-serif text-3xl text-primary">{BOOK_FORM_TITLE}</h2>
          <p className="mt-3 font-medium text-primary">{BOOK_FORM_LEAD}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">{BOOK_FORM_INTRO}</p>
          <p className="mt-3 mb-6 text-sm leading-relaxed text-muted">{BOOK_FORM_NOTE}</p>
          <ContactForm variant="discovery" defaultTopic="Nutrition Counseling" redirectTo={calendlyUrl} />
        </div>
      </div>
    </section>
  );
}
