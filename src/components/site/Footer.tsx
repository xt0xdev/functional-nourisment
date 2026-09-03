import Link from "next/link";
import { Logo } from "@/components/Logo";
import { applyBookingUrl, resolveBookingUrl } from "@/lib/booking";
import { locationLinks } from "@/lib/locations";
import type { getFooterMenu } from "@/lib/menu";

const staticServing = locationLinks.map((location) => ({
  href: location.href,
  label: `Nutritionist in ${location.label}`,
}));

export function Footer({
  settings,
  groups,
}: {
  settings: Record<string, string>;
  groups: Awaited<ReturnType<typeof getFooterMenu>>;
}) {
  const bookingUrl = resolveBookingUrl(settings);
  const resolvedGroups = groups.map((group) => ({
    ...group,
    links: group.links.map((item) => applyBookingUrl(item, bookingUrl)),
  }));
  const servingGroup = resolvedGroups.find((group) => group.name.toLowerCase() === "serving");
  const menuGroups = resolvedGroups.filter((group) => group.name.toLowerCase() !== "serving");
  const servingLinks =
    servingGroup && servingGroup.links.length > 0
      ? servingGroup.links.map((item) => ({ href: item.href, label: item.label }))
      : staticServing;

  return (
    <footer className="bg-deep text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-5 lg:px-6">
        <div>
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-8" />
            <p className="font-serif text-2xl">
              Functional <em className="italic">Nourishment</em>
            </p>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/75">
            {settings.footerBlurb ||
              "A whole-person functional nutrition practice in Astoria, Queens, serving New York City with personalized Medical Nutrition Therapy and mind-body care."}
          </p>
          <p className="mt-4 text-sm text-white/70">{settings.address || "Astoria, NY 11105"}</p>
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
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/55">
        {settings.footerText} · © {new Date().getFullYear()} Functional Nourishment. All rights reserved. ·{" "}
        <Link href="/privacy" className="hover:text-white">
          Privacy
        </Link>
      </div>
    </footer>
  );
}
