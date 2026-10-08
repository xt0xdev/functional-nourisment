import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { savePage } from "../../actions";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { PageTemplateFields } from "@/components/admin/PageTemplateFields";
import { PageLayoutDesigner } from "@/components/admin/PageLayoutDesigner";
import { ExperiencesGalleryEditor } from "@/components/admin/ExperiencesGalleryEditor";
import { WellnessPartnersEditor } from "@/components/admin/WellnessPartnersEditor";
import { ExperiencesGallery } from "@/components/site/ExperiencesGallery";
import { HERO_DEFAULTS, getPageTemplate, resolveExperiencesContent } from "@/lib/page-templates";
import { getStoredLayout, resolveEditorLayout } from "@/lib/page-layout";
import { resolveWellnessPartners } from "@/lib/wellness-partners";

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
  const experiencesContent = page.slug === "experiences" ? resolveExperiencesContent(page.content) : null;

  return (
    <div>
      <p className="text-sm text-muted">
        <Link href="/admin/pages" className="hover:underline">
          ← Pages
        </Link>
      </p>
      <h1 className="mt-2 font-serif text-4xl text-forest">Edit {page.title}</h1>
      <p className="mt-2 max-w-3xl text-sm text-muted">
        Three separate areas: the hero banner, the body canvas, and any template widgets. Selecting a
        body photo and pressing Delete removes it from the canvas and from the saved layout.
      </p>
      <form action={savePage} className="mt-6 grid gap-8">
        <input type="hidden" name="id" value={page.id} />

        <section className="grid gap-4 rounded-2xl bg-white p-5">
          <h2 className="font-serif text-2xl text-forest">Page</h2>
          <div className="grid gap-4 md:grid-cols-2">
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
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" defaultChecked={page.published} />
            Published
          </label>
          <details className="rounded-xl bg-sand/60 px-4 py-3">
            <summary className="cursor-pointer text-sm font-medium text-forest">SEO</summary>
            <div className="mt-3 grid gap-3">
              <label className="grid gap-1 text-sm">
                SEO title
                <input name="metaTitle" defaultValue={page.metaTitle} className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
              </label>
              <label className="grid gap-1 text-sm">
                SEO description
                <textarea name="metaDescription" defaultValue={page.metaDescription} rows={3} className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
              </label>
            </div>
          </details>
        </section>

        <section className="grid gap-4 rounded-2xl bg-white p-5">
          <div>
            <h2 className="font-serif text-2xl text-forest">Hero banner</h2>
            <p className="mt-1 text-sm text-muted">
              The page banner at the top of the live site. Changing this photo does not add or replace
              images on the body canvas below.
            </p>
          </div>
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
            variant="hero"
            label="Hero image"
            name="heroImage"
            defaultUrl={page.heroImage}
            changeLabel="Change banner"
            removeLabel="Remove banner"
            help="Pick from the media library or paste a URL. This is the banner only — it is not inserted into the body designer."
          />
          <label className="grid gap-1 text-sm">
            Hero image alt text
            <input name="heroImageAlt" defaultValue={page.heroImageAlt} className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
          </label>
        </section>

        <section className="grid gap-3">
          <PageLayoutDesigner
            initialLayout={editorLayout}
            pageTitle={page.title}
            heroHeading={heroHeading}
            heroSubheading={heroSubheading}
            heroImage={page.heroImage}
            wasPublishedLayout={Boolean(storedLayout?.enabled && storedLayout.blocks.length)}
            lockedAfterBody={
              experiencesContent ? (
                <div className="border-t border-dashed border-teal/30 bg-teal/[0.04] px-5 py-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-teal">Workshop gallery · locked widget</p>
                  <p className="mt-1 text-xs text-muted">
                    Always shown on the public page. Edit photos in Template widgets below.
                  </p>
                  <div className="mt-3">
                    <ExperiencesGallery
                      eyebrow={experiencesContent.galleryEyebrow}
                      heading={experiencesContent.galleryHeading}
                      items={experiencesContent.gallery}
                      compact
                    />
                  </div>
                </div>
              ) : undefined
            }
          />
        </section>

        {template ? (
          page.slug === "about" ? (
            <section className="grid gap-3 rounded-2xl bg-white p-5">
              <h2 className="font-serif text-2xl text-forest">Template widgets · About</h2>
              <p className="text-sm text-muted">
                Biography and the Amazon button fields used when the body layout is off. On the live
                designed layout, delete or move the button block on the canvas to change placement.
              </p>
              <PageTemplateFields slug={page.slug} content={page.content} />
            </section>
          ) : page.slug === "experiences" ? (
            <section className="grid gap-6">
              <ExperiencesGalleryEditor items={experiencesContent?.gallery || []} />
              <details className="rounded-2xl bg-white p-5">
                <summary className="cursor-pointer font-serif text-2xl text-forest">
                  Template widgets
                </summary>
                <p className="mt-2 text-sm text-muted">
                  Intro copy, experience cards, and the gallery heading. They stay available if you
                  turn the visual layout off.
                </p>
                <div className="mt-4">
                  <PageTemplateFields slug={page.slug} content={page.content} />
                </div>
              </details>
            </section>
          ) : page.slug === "collaborative-care" ? (
            <section className="grid gap-6">
              <div className="rounded-2xl bg-white p-5">
                <h2 className="font-serif text-2xl text-forest">Template widgets · Collaborative Care</h2>
                <div className="mt-4">
                  <PageTemplateFields slug={page.slug} content={page.content} />
                </div>
              </div>
              <WellnessPartnersEditor partners={resolveWellnessPartners(page.content)} />
            </section>
          ) : (
            <details className="rounded-2xl bg-white p-5">
              <summary className="cursor-pointer font-serif text-2xl text-forest">
                Template widgets
              </summary>
              <p className="mt-2 text-sm text-muted">
                Card grids, forms, calendars, and listings that are not freeform body blocks.
              </p>
              <div className="mt-4">
                <PageTemplateFields slug={page.slug} content={page.content} />
              </div>
            </details>
          )
        ) : (
          <input type="hidden" name="content" value={page.content} />
        )}

        <button className="w-fit rounded-full bg-forest px-6 py-3 text-cream">Save page</button>
      </form>
    </div>
  );
}
