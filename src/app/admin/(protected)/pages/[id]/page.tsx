import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { savePage } from "../../actions";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { PageTemplateFields } from "@/components/admin/PageTemplateFields";
import { PageLayoutDesigner } from "@/components/admin/PageLayoutDesigner";
import { HERO_DEFAULTS, getPageTemplate } from "@/lib/page-templates";
import { getStoredLayout, resolveEditorLayout } from "@/lib/page-layout";

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const page = await prisma.page.findUnique({ where: { id } });
  if (!page) notFound();

  const template = getPageTemplate(page.slug);
  const heroDefaults = HERO_DEFAULTS[page.slug];
  const storedLayout = getStoredLayout(page.content);
  const editorLayout = resolveEditorLayout(page.slug, page.content);
  const heroHeading = page.heroHeading.trim() || heroDefaults?.heading || page.heroHeading;
  const heroSubheading = page.heroSubheading.trim() || heroDefaults?.subheading || page.heroSubheading;

  return (
    <div>
      <p className="text-sm text-muted">
        <Link href="/admin/pages" className="hover:underline">
          ← Pages
        </Link>
      </p>
      <h1 className="mt-2 font-serif text-4xl text-forest">Edit {page.title}</h1>
      <p className="mt-2 text-sm text-muted">
        Hero, header, and footer stay on the site template. Use the body designer to place text and
        images, wrap copy around photos, and drag or resize blocks.{" "}
        {template
          ? "Card grids, forms, calendars, and listings under Template sections stay as designed widgets."
          : `Public URL: /${page.slug}. Add this URL to the menu under Navigation.`}
      </p>
      <form action={savePage} className="mt-6 grid gap-6">
        <input type="hidden" name="id" value={page.id} />
        <div className="grid gap-4 rounded-2xl bg-white p-5">
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
        </div>

        <fieldset className="grid gap-4 rounded-2xl bg-white p-5">
          <legend className="px-1 font-serif text-2xl text-forest">Hero · locked template</legend>
          <p className="text-sm text-muted">
            The hero shell is not movable in the designer. Edit the heading, subheading, and image here.
          </p>
          <label className="grid gap-1 text-sm">
            Hero heading
            <input name="heroHeading" defaultValue={heroHeading} className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
          </label>
          <label className="grid gap-1 text-sm">
            Hero subheading
            <textarea
              name="heroSubheading"
              defaultValue={heroSubheading}
              rows={3}
              className="rounded-xl border border-forest/15 bg-white px-3 py-2"
            />
          </label>
          <MediaPicker
            label="Hero image"
            name="heroImage"
            defaultUrl={page.heroImage}
            help="Pick from the media library or paste a URL in the library dialog."
          />
          <label className="grid gap-1 text-sm">
            Hero image alt text
            <input name="heroImageAlt" defaultValue={page.heroImageAlt} className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
          </label>
        </fieldset>

        <PageLayoutDesigner
          initialLayout={editorLayout}
          pageTitle={page.title}
          heroHeading={heroHeading}
          heroSubheading={heroSubheading}
          heroImage={page.heroImage}
          wasPublishedLayout={Boolean(storedLayout?.enabled && storedLayout.blocks.length)}
        />

        {template ? (
          page.slug === "about" ? (
            <div className="rounded-2xl bg-white p-5">
              <h2 className="font-serif text-2xl text-forest">About copy & Amazon button</h2>
              <p className="mt-2 text-sm text-muted">
                Edit the biography here, and set whether the Buy on Amazon button is shown, its label,
                and its URL. When the visual layout is on, add or drag a button block on the canvas to
                place it. These fields still control the template button if you turn the layout off.
              </p>
              <div className="mt-4">
                <PageTemplateFields slug={page.slug} content={page.content} />
              </div>
            </div>
          ) : (
            <details className="rounded-2xl bg-white p-5">
              <summary className="cursor-pointer font-serif text-2xl text-forest">
                Template sections
              </summary>
              <p className="mt-2 text-sm text-muted">
                These labeled fields still power cards, forms, and listings that are not freeform body
                blocks. They stay available if you turn the visual layout off.
              </p>
              <div className="mt-4">
                <PageTemplateFields slug={page.slug} content={page.content} />
              </div>
            </details>
          )
        ) : (
          <input type="hidden" name="content" value={page.content} />
        )}
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked={page.published} />
          Published
        </label>
        <button className="w-fit rounded-full bg-forest px-6 py-3 text-cream">Save page</button>
      </form>
    </div>
  );
}
