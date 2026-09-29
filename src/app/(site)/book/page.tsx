import { getPage, getSettings } from "@/lib/content";
import { resolveBookingUrl } from "@/lib/booking";
import { buildMetadata } from "@/lib/seo";
import { ContactForm } from "@/components/site/ContactForm";
import { SmartImage } from "@/components/site/SmartImage";
import { resolveBookBrandImage } from "@/lib/site-images";
import { DEFAULT_PUBLIC_EMAIL, isLegacyPublicEmail } from "@/lib/site-defaults";
import { BOOK_META_DESCRIPTION, BOOK_META_TITLE } from "@/lib/page-copy";
import { resolveBookContent } from "@/lib/page-templates";

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
  const inquiryEmail = isLegacyPublicEmail(settings.email) ? DEFAULT_PUBLIC_EMAIL : settings.email;
  const content = resolveBookContent(page?.content);

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
          <p className="eyebrow">{content.eyebrow}</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-primary md:text-6xl">{content.heading}</h1>
          <p className="mt-5 text-lg font-medium leading-relaxed text-primary">{content.lead}</p>
          <p className="mt-4 leading-relaxed text-muted">{content.intro}</p>

          <h2 className="mt-10 font-serif text-3xl text-primary">{content.connectTitle}</h2>
          <p className="mt-3 leading-relaxed text-muted">{content.connectBody}</p>

          <h2 className="mt-10 font-serif text-3xl text-primary">{content.insuranceTitle}</h2>
          <p className="mt-3 leading-relaxed text-muted">{content.insuranceBody}</p>
          <a
            href={settings.berryStreetUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-outline mt-5 no-underline"
          >
            {content.berryStreetLabel}
          </a>

          <h2 className="mt-10 font-serif text-3xl text-primary">{content.inquiriesTitle}</h2>
          <p className="mt-3 leading-relaxed text-muted">
            {content.inquiriesBody.includes(inquiryEmail) ? (
              <>
                {content.inquiriesBody.split(inquiryEmail)[0]}
                <a className="underline" href={`mailto:${inquiryEmail}`}>
                  {inquiryEmail}
                </a>
                {content.inquiriesBody.split(inquiryEmail).slice(1).join(inquiryEmail)}
              </>
            ) : (
              <>
                {content.inquiriesBody}{" "}
                <a className="underline" href={`mailto:${inquiryEmail}`}>
                  {inquiryEmail}
                </a>
                .
              </>
            )}
          </p>

          <p className="mt-10 font-serif text-2xl italic text-primary">{content.tagline}</p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-primary/10 md:sticky md:top-28">
          <h2 className="font-serif text-3xl text-primary">{content.formTitle}</h2>
          <p className="mt-3 font-medium text-primary">{content.formLead}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">{content.formIntro}</p>
          <p className="mt-3 mb-6 text-sm leading-relaxed text-muted">{content.formNote}</p>
          <ContactForm variant="discovery" defaultTopic="Nutrition Counseling" redirectTo={calendlyUrl} />
        </div>
      </div>
    </section>
  );
}
