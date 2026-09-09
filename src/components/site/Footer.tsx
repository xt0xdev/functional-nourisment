import Link from "next/link";
import { Instagram } from "lucide-react";
import { Logo } from "@/components/Logo";
import { SubscribeForm } from "@/components/site/SubscribeForm";
import { applyBookingUrl, resolveBookingUrl } from "@/lib/booking";
import { locationLinks } from "@/lib/locations";
import type { getFooterMenu } from "@/lib/menu";
import {
  CHILDRENS_BOOK_NOTE,
  INSTAGRAM_HANDLE,
  PRACTITIONER_CREDIT,
  resolveFooterBlurb,
  resolveInstagramUrl,
} from "@/lib/site-defaults";

const staticServing = locationLinks.map((location) => ({
  href: location.href,
  label: location.footerLabel || `Nutritionist in ${location.label}`,
}));

export function Footer({
  settings,
  groups,
}: {
  settings: Record<string, string>;
  groups: Awaited<ReturnType<typeof getFooterMenu>>;
}) {
  const bookingUrl = resolveBookingUrl(settings);
  const instagramUrl = resolveInstagramUrl(settings.instagram);
  const resolvedGroups = groups.map((group) => ({
    ...group,
    links: group.links.map((item) => applyBookingUrl(item, bookingUrl)),
  }));
  const servingGroup = resolvedGroups.find((group) => group.name.toLowerCase() === "serving");
  const menuGroups = resolvedGroups.filter((group) => group.name.toLowerCase() !== "serving");
  const servingLinks = [
    ...(servingGroup && servingGroup.links.length > 0
      ? servingGroup.links.map((item) => ({ href: item.href, label: item.label }))
      : staticServing),
  ];
  if (!servingLinks.some((item) => item.href === "/locations/new-york-state")) {
    servingLinks.push({ href: "/locations/new-york-state", label: "New York State telehealth" });
  }

  return (
    <footer className="bg-deep text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-5 lg:px-6">
        <div>
          <div className="flex flex-col items-start gap-4">
            <Logo className="h-20 w-20 md:h-[88px] md:w-[88px]" />
            <p className="font-serif text-2xl">
              Functional <em className="italic">Nourishment</em>
            </p>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/75">
            {resolveFooterBlurb(settings.footerBlurb)}
          </p>
          <p className="mt-4 text-sm text-white/70">{settings.address || "Astoria, NY 11105"}</p>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm text-accent hover:text-white"
          >
            <Instagram className="h-4 w-4" aria-hidden="true" />
            <span>@{INSTAGRAM_HANDLE}</span>
          </a>
          <p className="mt-4 text-xs leading-relaxed text-white/55">{CHILDRENS_BOOK_NOTE}</p>
        </div>
        {menuGroups.map((group) => (
          <div key={group.name}>
            <p className="text-xs uppercase tracking-[0.2em] text-accent">{group.name}</p>
            <ul className="mt-4 space-y-2 text-sm text-white/85">
              {group.links.map((item) => (
                <li key={item.id}>
                  {item.href.startsWith("http") ? (
                    <a className="hover:text-white" href={item.href} target={item.openInNew ? "_blank" : undefined} rel="noreferrer">
                      {item.label}
                    </a>
                  ) : (
                    <Link className="hover:text-white" href={item.href || "/"}>
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-accent">Serving</p>
          <ul className="mt-4 space-y-2 text-sm text-white/85">
            {servingLinks.map((item) => (
              <li key={item.href}>
                <Link className="hover:text-white" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <p className="text-xs uppercase tracking-[0.2em] text-accent">Mailing list</p>
            <p className="mt-3 text-sm text-white/70">Occasional notes on workshops, sound baths, and practice updates.</p>
            <div className="mt-4">
              <SubscribeForm variant="footer" />
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/55">
        {settings.footerText || PRACTITIONER_CREDIT} · © {new Date().getFullYear()} Functional Nourishment. All rights reserved. ·{" "}
        <Link href="/privacy" className="hover:text-white">
          Privacy
        </Link>
        <p className="mt-2">{PRACTITIONER_CREDIT}</p>
      </div>
    </footer>
  );
}
