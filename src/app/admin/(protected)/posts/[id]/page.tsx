import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { savePost } from "../../actions";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { InsertImageField } from "@/components/admin/InsertImageField";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div>
      <p className="text-sm text-muted">
        <Link href="/admin/posts" className="hover:underline">
          ← Journal
        </Link>
      </p>
      <h1 className="mt-2 font-serif text-4xl text-forest">Edit post</h1>
      <form action={savePost} className="mt-6 grid gap-3">
        <input type="hidden" name="id" value={post.id} />
        <input name="title" defaultValue={post.title} className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
        <input name="slug" defaultValue={post.slug} className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
        <input name="metaTitle" defaultValue={post.metaTitle} className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
        <textarea name="metaDescription" defaultValue={post.metaDescription} className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
        <textarea name="excerpt" defaultValue={post.excerpt} rows={3} className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
        <MediaPicker
          label="Featured image"
          name="featuredImage"
          defaultUrl={post.featuredImage}
          help="Shown on the journal list and at the top of the article."
        />
        <label className="grid gap-1 text-sm">
          Featured image alt text
          <input name="featuredImageAlt" defaultValue={post.featuredImageAlt} className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
        </label>
        <InsertImageField name="body" defaultValue={post.body} label="Body" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked={post.published} /> Published
        </label>
        <button className="w-fit rounded-full bg-forest px-6 py-3 text-cream">Save post</button>
      </form>
    </div>
  );
}
