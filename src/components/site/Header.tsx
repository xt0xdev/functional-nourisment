"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import type { MenuNode } from "@/lib/menu";

function NavLink({
  item,
  onClick,
  className,
}: {
  item: MenuNode;
  onClick?: () => void;
  className?: string;
}) {
  const classes = className || "text-sm text-navy/80 transition hover:text-navy";
  if (item.href.startsWith("http")) {
    return (
      <a href={item.href} target={item.openInNew ? "_blank" : undefined} rel="noreferrer" className={classes} onClick={onClick}>
        {item.label}
      </a>
    );
  }
  if (!item.href) {
    return <span className={classes}>{item.label}</span>;
  }
  return (
    <Link href={item.href} className={classes} onClick={onClick}>
      {item.label}
    </Link>
  );
}

export function Header({ menu }: { menu: MenuNode[] }) {
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 border-b border-navy/8 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-2 text-navy" onClick={() => setOpen(false)}>
          <Logo className="h-8 w-8" />
          <span className="font-serif text-xl tracking-wide md:text-2xl">
            Functional <em className="italic text-teal-dark">Nourishment</em>
          </span>
        </Link>
        <nav className="hidden items-center gap-5 lg:flex" aria-label="Primary">
          {menu.map((item) =>
            item.children.length ? (
              <div key={item.id} className="group relative">
                <button type="button" className="inline-flex items-center gap-1 text-sm text-navy/80 hover:text-navy">
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                <div className="invisible absolute left-0 top-full z-20 min-w-52 translate-y-1 rounded-2xl bg-white p-2 opacity-0 shadow-lg ring-1 ring-navy/8 transition group-hover:visible group-hover:opacity-100">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.id}
                      item={child}
                      className="block rounded-xl px-3 py-2 text-sm text-navy/80 hover:bg-sky"
                    />
                  ))}
                </div>
              </div>
            ) : item.style === "cta" ? (
              <NavLink
                key={item.id}
                item={item}
                className="rounded-full bg-teal px-4 py-2 text-sm font-medium text-navy hover:bg-teal-dark hover:text-white"
              />
            ) : item.style === "ghost" ? (
              <NavLink key={item.id} item={item} className="text-sm text-navy/70 hover:text-navy" />
            ) : (
              <NavLink key={item.id} item={item} />
            ),
          )}
        </nav>
        <button
          type="button"
          className="rounded-md p-2 text-navy lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X /> : <Menu />}
          <span className="sr-only">Toggle menu</span>
        </button>
      </div>
      {open ? (
        <div id="mobile-nav" className="border-t border-navy/8 bg-white px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-2" aria-label="Mobile">
            {menu.map((item) => (
              <div key={item.id}>
                {item.children.length ? (
                  <>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between py-1 text-navy"
                      onClick={() => setOpenGroup((current) => (current === item.id ? null : item.id))}
                    >
                      {item.label}
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    {openGroup === item.id
                      ? item.children.map((child) => (
                          <NavLink
                            key={child.id}
                            item={child}
                            className="block py-1 pl-4 text-sm text-muted"
                            onClick={() => setOpen(false)}
                          />
                        ))
                      : null}
                  </>
                ) : (
                  <NavLink
                    item={item}
                    onClick={() => setOpen(false)}
                    className={
                      item.style === "cta"
                        ? "mt-2 block rounded-full bg-teal px-4 py-2 text-center text-navy"
                        : "block py-1 text-navy"
                    }
                  />
                )}
              </div>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
