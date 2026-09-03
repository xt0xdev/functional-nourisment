import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminPagesPage() {
  const pages = await prisma.page.findMany({ orderBy: { title: "asc" } });

  return (
    <div>
      <h1 className="font-serif text-4xl text-forest">Pages</h1>
      <div className="mt-6 divide-y divide-forest/10 rounded-2xl bg-white">
        {pages.map((page) => (
          <Link key={page.id} href={`/admin/pages/${page.id}`} className="flex items-center justify-between p-4 hover:bg-sand">
            <div>
              <p className="font-medium text-forest">{page.title}</p>
              <p className="text-sm text-muted">/{page.slug}</p>
            </div>
            <span className="text-sm text-moss">{page.published ? "Published" : "Draft"}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
