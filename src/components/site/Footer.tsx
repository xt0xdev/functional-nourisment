import Link from "next/link";
import { Logo } from "@/components/Logo";
import type { getFooterMenu } from "@/lib/menu";

export function Footer({
  settings,
  groups,
}: {
  settings: Record<string, string>;
  groups: Awaited<ReturnType<typeof getFooterMenu>>;
}) {
  return (
    <footer className="bg-deep text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4 md:px-6">
        <div>
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-8" />
            <p className="font-serif text-2xl">
              Functional <em className="italic">Nourishment</em>
            </p>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/75">
            {settings.footerBlurb ||
              "A whole-person approach to health that combines personalized functional nutrition with integrative mind-body practices."}
          </p>
        </div>
        {groups.map((group) => (
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
