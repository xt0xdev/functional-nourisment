import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createPage, deletePage } from "../actions";

export default async function AdminPagesPage() {
  const pages = await prisma.page.findMany({ orderBy: [{ system: "desc" }, { title: "asc" }] });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl text-forest">Pages</h1>
          <p className="mt-2 text-sm text-muted">
            Edit existing pages or add a new one. New pages appear at /your-slug and can be added to the site menu.
          </p>
        </div>
      </div>

      <form action={createPage} className="mt-6 grid gap-3 rounded-2xl bg-white p-5 md:grid-cols-[1fr_1fr_auto]">
        <input name="title" required placeholder="New page title" className="rounded-xl border border-forest/15 px-3 py-2" />
        <input name="slug" placeholder="optional-url-slug" className="rounded-xl border border-forest/15 px-3 py-2" />
        <button className="rounded-full bg-forest px-5 py-2 text-cream">Add page</button>
      </form>

      <div className="mt-6 divide-y divide-forest/10 rounded-2xl bg-white">
        {pages.map((page) => (
          <div key={page.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <Link href={`/admin/pages/${page.id}`} className="hover:underline">
              <p className="font-medium text-forest">{page.title}</p>
              <p className="text-sm text-muted">/{page.slug === "home" ? "" : page.slug}</p>
            </Link>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-moss">{page.published ? "Published" : "Draft"}</span>
              {page.system ? <span className="text-muted">Built-in</span> : null}
              <Link href={`/admin/pages/${page.id}`} className="text-moss">
                Edit
              </Link>
              {!page.system ? (
                <form action={deletePage}>
                  <input type="hidden" name="id" value={page.id} />
                  <button className="text-clay">Delete</button>
                </form>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
