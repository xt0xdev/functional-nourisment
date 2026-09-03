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
  const classes = className || "text-sm text-primary/80 transition hover:text-primary";
  if (item.href.startsWith("http")) {
    return (
      <a href={item.href} target="_blank" rel="noreferrer" className={classes} onClick={onClick}>
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
    <header className="sticky top-0 z-50 border-b border-primary/10 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-2 text-primary" onClick={() => setOpen(false)}>
          <Logo className="h-8 w-8" />
          <span className="font-serif text-xl tracking-wide md:text-2xl">
            Functional <em className="italic">Nourishment</em>
          </span>
        </Link>
        <nav className="hidden items-center gap-5 lg:flex" aria-label="Primary">
          {menu.map((item) =>
            item.children.length ? (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => setOpenGroup(item.id)}
                onMouseLeave={() => setOpenGroup(null)}
              >
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-sm text-primary/80 hover:text-primary"
                  aria-expanded={openGroup === item.id}
                  onClick={() => setOpenGroup((current) => (current === item.id ? null : item.id))}
                >
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                {openGroup === item.id ? (
                  <div className="absolute left-0 top-full z-20 min-w-56 rounded-2xl bg-background p-2 shadow-lg ring-1 ring-primary/10">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.id}
                        item={child}
                        className="block rounded-xl px-3 py-2 text-sm text-primary/80 hover:bg-mist"
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            ) : item.style === "cta" ? (
              <NavLink
                key={item.id}
                item={item}
                className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-accent hover:text-deep"
              />
            ) : item.style === "ghost" ? (
              <NavLink key={item.id} item={item} className="text-sm text-primary/80 hover:text-primary" />
            ) : (
              <NavLink key={item.id} item={item} />
            ),
          )}
        </nav>
        <button
          type="button"
          className="rounded-md p-2 text-primary lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X /> : <Menu />}
          <span className="sr-only">Toggle menu</span>
        </button>
      </div>
      {open ? (
        <div id="mobile-nav" className="border-t border-primary/10 bg-background px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-2" aria-label="Mobile">
            {menu.map((item) => (
              <div key={item.id}>
                {item.children.length ? (
                  <>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between py-1 text-primary"
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
                        ? "mt-2 block rounded-full bg-primary px-4 py-2 text-center text-white"
                        : "block py-1 text-primary"
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
