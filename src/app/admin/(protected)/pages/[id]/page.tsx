import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { savePage } from "../../actions";

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const page = await prisma.page.findUnique({ where: { id } });
  if (!page) notFound();

  return (
    <div>
      <p className="text-sm text-muted">
        <Link href="/admin/pages" className="hover:underline">
          ← Pages
        </Link>
      </p>
      <h1 className="mt-2 font-serif text-4xl text-forest">Edit {page.title}</h1>
      {page.system ? (
        <p className="mt-2 text-sm text-muted">
          Built-in page. Content can be edited; the slug stays reserved for the designed template.
        </p>
      ) : (
        <p className="mt-2 text-sm text-muted">
          Public URL: /{page.slug}. Add this URL to the menu under Navigation.
        </p>
      )}
      <form action={savePage} className="mt-6 grid gap-4">
        <input type="hidden" name="id" value={page.id} />
        <label className="grid gap-1 text-sm">
          Title
          <input name="title" defaultValue={page.title} className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
        </label>
        <label className="grid gap-1 text-sm">
          URL slug
          <input
            name="slug"
            defaultValue={page.slug}
            readOnly={page.system}
            className="rounded-xl border border-forest/15 bg-white px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          SEO title
          <input name="metaTitle" defaultValue={page.metaTitle} className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
        </label>
        <label className="grid gap-1 text-sm">
          SEO description
          <textarea name="metaDescription" defaultValue={page.metaDescription} rows={3} className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
        </label>
        <label className="grid gap-1 text-sm">
          Hero heading
          <input name="heroHeading" defaultValue={page.heroHeading} className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
        </label>
        <label className="grid gap-1 text-sm">
          Hero subheading
          <textarea name="heroSubheading" defaultValue={page.heroSubheading} rows={3} className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
        </label>
        <label className="grid gap-1 text-sm">
          Hero image URL
          <input name="heroImage" defaultValue={page.heroImage} className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
        </label>
        <label className="grid gap-1 text-sm">
          {page.system ? "Content JSON" : "Page content"}
          <textarea
            name="content"
            defaultValue={page.content}
            rows={16}
            className={`rounded-xl border border-forest/15 bg-white px-3 py-2 ${page.system ? "font-mono text-xs" : ""}`}
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked={page.published} />
          Published
        </label>
        <button className="w-fit rounded-full bg-forest px-6 py-3 text-cream">Save page</button>
      </form>
    </div>
  );
}
