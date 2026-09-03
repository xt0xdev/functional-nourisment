"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";

const links = [
  { href: "/about", label: "About" },
  { href: "/nutrition", label: "Body" },
  { href: "/sound-healing", label: "Mind" },
  { href: "/meditation", label: "Spirit" },
  { href: "/experiences", label: "Experiences" },
  { href: "/events", label: "Events" },
  { href: "/journal", label: "Journal" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-forest/10 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-2 text-forest" onClick={() => setOpen(false)}>
          <Logo className="h-9 w-9" />
          <span className="font-serif text-xl tracking-wide md:text-2xl">Functional Nourishment</span>
        </Link>
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm tracking-wide text-muted transition hover:text-forest"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/book"
            className="rounded-full bg-forest px-4 py-2 text-sm text-cream transition hover:bg-moss"
          >
            Book
          </Link>
        </nav>
        <button
          type="button"
          className="rounded-md p-2 text-forest lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X /> : <Menu />}
          <span className="sr-only">Toggle menu</span>
        </button>
      </div>
      {open ? (
        <div id="mobile-nav" className="border-t border-forest/10 bg-cream px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-3" aria-label="Mobile">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-1 text-forest"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/book"
              className="mt-2 rounded-full bg-forest px-4 py-2 text-center text-cream"
              onClick={() => setOpen(false)}
            >
              Book a visit
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
