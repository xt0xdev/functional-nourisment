import { bookingLinkProps, resolveBookingUrl } from "@/lib/booking";
import { ServiceArea } from "@/components/site/ServiceArea";
import {
  BERRY_STREET_URL,
  CTA_BODY,
  CTA_HEADING,
  CTA_LEFT_TEXT,
  CTA_LEFT_TITLE,
  CTA_RIGHT_TEXT,
  CTA_RIGHT_TITLE,
} from "@/lib/site-defaults";

export function CtaBand({
  berryStreetUrl,
  bookingUrl,
  showServiceArea = true,
}: {
  berryStreetUrl: string;
  bookingUrl?: string;
  showServiceArea?: boolean;
}) {
  const bookHref = resolveBookingUrl(bookingUrl);
  const bookProps = bookingLinkProps(bookHref);

  return (
    <>
      {showServiceArea ? <ServiceArea /> : null}
      <section className="bg-deep text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <h2 className="max-w-3xl font-serif text-3xl md:text-5xl">{CTA_HEADING}</h2>
          <p className="mt-4 max-w-2xl text-white/75">{CTA_BODY}</p>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <article className="rounded-3xl bg-white/6 p-6 ring-1 ring-white/10">
              <h3 className="font-serif text-2xl">{CTA_LEFT_TITLE}</h3>
              <p className="mt-2 text-sm text-white/70">{CTA_LEFT_TEXT}</p>
              <a className="btn-primary mt-5" {...bookProps}>
                Book a Discovery Call
              </a>
            </article>
            <article className="rounded-3xl bg-white/6 p-6 ring-1 ring-white/10">
              <h3 className="font-serif text-2xl">{CTA_RIGHT_TITLE}</h3>
              <p className="mt-2 text-sm text-white/70">{CTA_RIGHT_TEXT}</p>
              <a
                href={berryStreetUrl || BERRY_STREET_URL}
                target="_blank"
                rel="noreferrer"
                className="btn-outline btn-outline-on-dark mt-5"
              >
                Book via Berry Street
              </a>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
