import Link from "next/link";

export function CtaBand({
  berryStreetUrl,
}: {
  berryStreetUrl: string;
}) {
  return (
    <section className="bg-sand">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-14 md:flex-row md:items-center md:px-6">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-clay">Start here</p>
          <h2 className="mt-2 font-serif text-3xl text-forest md:text-4xl">
            Ready for personalized nutrition care in the NYC metro area?
          </h2>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/book"
            className="rounded-full bg-forest px-6 py-3 text-center text-cream hover:bg-moss"
          >
            Book a discovery call
          </Link>
          <a
            href={berryStreetUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-forest px-6 py-3 text-center text-forest hover:bg-cream"
          >
            Use insurance
          </a>
        </div>
      </div>
    </section>
  );
}
