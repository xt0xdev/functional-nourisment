import { bookingLinkProps, resolveBookingUrl } from "@/lib/booking";

export function CtaBand({
  berryStreetUrl,
  bookingUrl,
}: {
  berryStreetUrl: string;
  bookingUrl?: string;
}) {
  const bookHref = resolveBookingUrl(bookingUrl);
  const bookProps = bookingLinkProps(bookHref);

  return (
    <section className="bg-deep text-white">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <h2 className="max-w-3xl font-serif text-3xl md:text-5xl">
          Ready to take a more personalized approach to your health?
        </h2>
        <p className="mt-4 max-w-2xl text-white/75">
          Together, we’ll look beyond symptoms to understand your unique needs and create a
          realistic, evidence-based plan to support lasting health and well-being.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <article className="rounded-3xl bg-white/6 p-6 ring-1 ring-white/10">
            <h3 className="font-serif text-2xl">Book a free discovery call</h3>
            <p className="mt-2 text-sm text-white/70">
              Schedule a complimentary 20-minute call to share what you’re looking for, ask
              questions, and see if working together feels like the right fit.
            </p>
            <a className="btn-primary mt-5" {...bookProps}>
              Book a Discovery Call
            </a>
          </article>
          <article className="rounded-3xl bg-white/6 p-6 ring-1 ring-white/10">
            <h3 className="font-serif text-2xl">Insurance</h3>
            <p className="mt-2 text-sm text-white/70">
              I am currently in network with United Healthcare, Aetna and Blue Cross Blue Shield.
              To book a nutrition appointment through your insurance, please use Berry Street.
            </p>
            <a href={berryStreetUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex text-accent hover:underline">
              Book via Berry Street →
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
