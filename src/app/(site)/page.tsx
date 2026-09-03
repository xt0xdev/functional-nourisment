import Image from "next/image";
import Link from "next/link";
import { Brain, HeartPulse, Sparkles } from "lucide-react";
import { getPage, getSettings, parseContent } from "@/lib/content";
import { bookingLinkProps, resolveBookingUrl } from "@/lib/booking";
import { buildMetadata, JsonLd, faqPageSchema, practiceFaqs } from "@/lib/seo";
import { CtaBand } from "@/components/site/CtaBand";

export async function generateMetadata() {
  const page = await getPage("home");
  return buildMetadata({
    title: page?.metaTitle || "Nutritionist in Astoria, Queens & NYC | Anna Almiroudis",
    description: page?.metaDescription || "",
    path: "/",
  });
}

type HomeContent = {
  intro: string;
  mind: string;
  body: string;
  spirit: string;
  quote?: string;
  practitioner?: string;
  practitionerMore?: string;
};

export default async function HomePage() {
  const [page, settings] = await Promise.all([getPage("home"), getSettings()]);
  const content = parseContent<HomeContent>(page?.content || "{}", {
    intro: page?.heroSubheading || "",
    mind: "",
    body: "",
    spirit: "",
  });

  const pillars = [
    { href: "/sound-healing", title: "Nourish Mind", text: content.mind, icon: Brain },
    { href: "/nutrition", title: "Nourish Body", text: content.body, icon: HeartPulse },
    { href: "/meditation", title: "Nourish Spirit", text: content.spirit, icon: Sparkles },
  ];

  return (
    <>
      <JsonLd data={faqPageSchema(practiceFaqs)} />

      <section className="bg-background">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-6 md:py-24">
          <div>
            <p className="eyebrow">Functional nutritionist in Astoria, Queens &amp; NYC</p>
            <h1 className="mt-3 font-serif text-4xl leading-tight text-primary md:text-6xl">
              Nourishing your <em className="italic">whole self</em> from the inside out.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted">
              {content.intro ||
                "Holistic functional nutrition and mind-body care from Astoria, Queens — serving New York City by telehealth, with in-person Reiki and sound baths locally."}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a className="btn-primary" {...bookingLinkProps(resolveBookingUrl(settings))}>
                Book a Discovery Call
              </a>
              <Link href="/nutrition" className="btn-outline">
                Explore Services
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src="https://images.unsplash.com/photo-1467453678174-768ec283a940?auto=format&fit=crop&w=1400&q=80"
              alt="Fresh greens and tea prepared for functional nutrition counseling in Astoria, Queens"
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-mist">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <p className="eyebrow">A whole-person approach</p>
            <h2 className="mt-3 font-serif text-4xl text-primary md:text-5xl">Our core pillars</h2>
          <p className="mt-3 text-muted">A comprehensive approach to your well-being.</p>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {pillars.map((pillar) => (
              <article key={pillar.title} className="rounded-3xl bg-background p-6 shadow-sm">
                <pillar.icon className="h-7 w-7 text-teal" />
                <h3 className="mt-4 font-serif text-2xl text-primary">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{pillar.text}</p>
                <Link href={pillar.href} className="mt-5 inline-flex text-sm text-teal hover:underline">
                  Learn more →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-2 md:px-6">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
            <Image
              src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80"
              alt="Nourishing bowl of vegetables for Medical Nutrition Therapy clients in NYC and Queens"
              fill
              className="object-cover"
            />
            <p className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/90 px-4 py-3 font-serif text-lg italic text-navy">
              “{content.quote || "True nourishment begins with listening to the body."}”
            </p>
          </div>
          <div>
            <p className="eyebrow">Meet your practitioner</p>
            <h2 className="mt-3 font-serif text-4xl text-primary md:text-5xl">Anna Almiroudis</h2>
            <p className="mt-5 leading-relaxed text-muted">
              {content.practitioner ||
                "As a board certified nutrition specialist, licensed nutritionist, certified dietitian-nutritionist and certified holistic health coach based in Astoria, Queens, I bridge the gap between clinical science and intuitive wellness for clients across New York City."}
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              {content.practitionerMore ||
                "My practice is rooted in functional nutrition and medical nutrition therapy, with a whole-person view of health."}
            </p>
            <Link href="/about" className="mt-6 inline-flex text-teal hover:underline">
              Read more about Anna →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <p className="eyebrow">Common questions</p>
          <h2 className="mt-3 font-serif text-4xl text-primary md:text-5xl">
            Nutrition care in Astoria, Queens, and New York City
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {practiceFaqs.map((item) => (
              <article key={item.q} className="rounded-3xl bg-mist p-6">
                <h3 className="font-serif text-2xl text-primary">{item.q}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{item.a}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBand berryStreetUrl={settings.berryStreetUrl} bookingUrl={settings.bookingUrl} />
    </>
  );
}
