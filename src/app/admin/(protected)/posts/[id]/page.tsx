import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { savePost } from "../../actions";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div>
      <h1 className="font-serif text-4xl text-forest">Edit post</h1>
      <form action={savePost} className="mt-6 grid gap-3">
        <input type="hidden" name="id" value={post.id} />
        <input name="title" defaultValue={post.title} className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
        <input name="slug" defaultValue={post.slug} className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
        <input name="metaTitle" defaultValue={post.metaTitle} className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
        <textarea name="metaDescription" defaultValue={post.metaDescription} className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
        <textarea name="excerpt" defaultValue={post.excerpt} rows={3} className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
        <textarea name="body" defaultValue={post.body} rows={16} className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked={post.published} /> Published
        </label>
        <button className="w-fit rounded-full bg-forest px-6 py-3 text-cream">Save post</button>
      </form>
    </div>
  );
}
