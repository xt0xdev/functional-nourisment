import Link from "next/link";
import { locationLinks } from "@/lib/locations";
import { SERVICE_AREA_BODY, SERVICE_AREA_EYEBROW, SERVICE_AREA_HEADING } from "@/lib/site-defaults";

export function ServiceArea({
  intro = SERVICE_AREA_BODY,
}: {
  intro?: string;
}) {
  return (
    <section className="bg-mist">
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <p className="eyebrow">{SERVICE_AREA_EYEBROW}</p>
        <h2 className="mt-3 font-serif text-3xl text-primary md:text-4xl">{SERVICE_AREA_HEADING}</h2>
        <p className="mt-4 max-w-2xl text-muted">{intro}</p>
        <ul className="mt-8 flex flex-wrap gap-3">
          {locationLinks.map((location) => (
            <li key={location.href}>
              <Link
                href={location.href}
                className="inline-flex rounded-full bg-background px-4 py-2 text-sm text-primary shadow-sm ring-1 ring-primary/10 transition hover:bg-white hover:text-teal"
              >
                {location.chipLabel || `Nutritionist in ${location.label}`}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
