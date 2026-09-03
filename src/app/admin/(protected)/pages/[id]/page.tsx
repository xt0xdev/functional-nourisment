import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { savePage } from "../../actions";

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const page = await prisma.page.findUnique({ where: { id } });
  if (!page) notFound();

  return (
    <div>
      <h1 className="font-serif text-4xl text-forest">Edit {page.title}</h1>
      <form action={savePage} className="mt-6 grid gap-4">
        <input type="hidden" name="id" value={page.id} />
        <label className="grid gap-1 text-sm">
          Title
          <input name="title" defaultValue={page.title} className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
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
          Content JSON
          <textarea name="content" defaultValue={page.content} rows={16} className="font-mono text-xs rounded-xl border border-forest/15 bg-white px-3 py-2" />
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
