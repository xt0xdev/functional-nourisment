import Link from "next/link";
import { locationLinks } from "@/lib/locations";

export function ServiceArea({
  intro = "Based in Astoria, Queens, Functional Nourishment offers remote Medical Nutrition Therapy across New York City and in-person Reiki and sound healing locally.",
}: {
  intro?: string;
}) {
  return (
    <section className="bg-mist">
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <p className="eyebrow">Serving New York</p>
        <h2 className="mt-3 font-serif text-3xl text-primary md:text-4xl">
          A nutritionist for Astoria, Queens, and NYC
        </h2>
        <p className="mt-4 max-w-2xl text-muted">{intro}</p>
        <ul className="mt-8 flex flex-wrap gap-3">
          {locationLinks.map((location) => (
            <li key={location.href}>
              <Link
                href={location.href}
                className="inline-flex rounded-full bg-background px-4 py-2 text-sm text-primary shadow-sm ring-1 ring-primary/10 transition hover:bg-white hover:text-teal"
              >
                Nutritionist in {location.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
