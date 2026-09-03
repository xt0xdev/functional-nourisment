import Link from "next/link";
import { Logo } from "@/components/Logo";

const explore = [
  { href: "/about", label: "About Anna" },
  { href: "/nutrition", label: "Nutrition counseling" },
  { href: "/sound-healing", label: "Sound healing" },
  { href: "/meditation", label: "Meditation" },
  { href: "/experiences", label: "Workshops" },
  { href: "/book", label: "Book" },
];

const locations = [
  { href: "/locations/astoria", label: "Astoria" },
  { href: "/locations/queens", label: "Queens" },
  { href: "/locations/nyc", label: "New York City" },
  { href: "/locations/manhattan", label: "Manhattan" },
  { href: "/locations/brooklyn", label: "Brooklyn" },
  { href: "/locations/metro", label: "NYC metro" },
];

export function Footer({
  settings,
}: {
  settings: Record<string, string>;
}) {
  return (
    <footer className="border-t border-forest/10 bg-forest text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4 md:px-6">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-8" />
            <p className="font-serif text-2xl">Functional Nourishment</p>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-cream/80">
            Functional nutrition and integrative wellness with Anna Almiroudis, serving
            Astoria and the New York City metro area.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold">Explore</p>
          <ul className="mt-4 space-y-2 text-sm text-cream/85">
            {explore.map((item) => (
              <li key={item.href}>
                <Link className="hover:text-white" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold">NYC metro</p>
          <ul className="mt-4 space-y-2 text-sm text-cream/85">
            {locations.map((item) => (
              <li key={item.href}>
                <Link className="hover:text-white" href={item.href}>
                  Nutritionist in {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold">Visit</p>
          <p className="mt-4 text-sm text-cream/85">{settings.address}</p>
          <p className="mt-2 text-sm">
            <a className="hover:text-white" href={`mailto:${settings.email}`}>
              {settings.email}
            </a>
          </p>
          <p className="mt-4 text-sm text-cream/75">{settings.insurance}</p>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-cream/60">
        {settings.footerText} ·{" "}
        <Link href="/privacy" className="hover:text-cream">
          Privacy
        </Link>
      </div>
    </footer>
  );
}
