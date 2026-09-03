import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminHomePage() {
  const [pages, events, media, inquiries, unread] = await Promise.all([
    prisma.page.count(),
    prisma.event.count(),
    prisma.media.count(),
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { read: false } }),
  ]);

  const cards = [
    { label: "Pages", value: pages, href: "/admin/pages" },
    { label: "Events", value: events, href: "/admin/events" },
    { label: "Media", value: media, href: "/admin/media" },
    { label: "Inquiries", value: `${inquiries}${unread ? ` · ${unread} new` : ""}`, href: "/admin/inquiries" },
  ];

  return (
    <div>
      <h1 className="font-serif text-4xl text-forest">Dashboard</h1>
      <p className="mt-2 text-muted">Edit site copy, upload photos, and manage events from one place.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-muted">{card.label}</p>
            <p className="mt-2 font-serif text-4xl text-forest">{card.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
