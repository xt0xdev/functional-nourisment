import Image from "next/image";
import { getPage, getSettings, parseContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/CtaBand";

export async function generateMetadata() {
  const page = await getPage("sound-healing");
  return buildMetadata({
    title: page?.metaTitle || "Sound Healing & Reiki in Astoria, NY | Queens & NYC",
    description: page?.metaDescription || "",
    path: "/sound-healing",
  });
}

export default async function SoundHealingPage() {
  const [page, settings] = await Promise.all([getPage("sound-healing"), getSettings()]);
  const content = parseContent<{ what: string; how: string; close: string }>(page?.content || "{}", {
    what: "",
    how: "",
    close: "",
  });

  return (
    <>
      <PageHero
        eyebrow="Mind · In person in Astoria"
        heading={page?.heroHeading || ""}
        subheading={page?.heroSubheading}
        image="https://images.unsplash.com/photo-1600618528240-fb9fc964b853?auto=format&fit=crop&w=1400&q=80"
        imageAlt="Sound healing bowls for Reiki and sound baths in Astoria, Queens"
      />
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:px-6">
        <div className="relative min-h-80 overflow-hidden rounded-3xl">
          <Image
            src="https://images.unsplash.com/photo-1600618528240-fb9fc964b853?auto=format&fit=crop&w=1400&q=80"
            alt="Crystal singing bowls used for sound healing sessions in Astoria, NY"
            fill
            className="object-cover"
          />
        </div>
        <div className="prose-fn">
          <h2>What is sound healing?</h2>
          <p>{content.what}</p>
          <h2>How does sound healing work?</h2>
          <p>{content.how}</p>
          <p>{content.close}</p>
        </div>
      </section>
      <CtaBand berryStreetUrl={settings.berryStreetUrl} bookingUrl={settings.bookingUrl} />
    </>
  );
}
