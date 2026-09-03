import Image from "next/image";
import Link from "next/link";
import { Brain, HeartPulse, Sparkles } from "lucide-react";
import { getPage, getSettings, parseContent } from "@/lib/content";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { CtaBand } from "@/components/site/CtaBand";

export async function generateMetadata() {
  const page = await getPage("home");
  return buildMetadata({
    title: page?.metaTitle || "Functional Nutritionist in NYC | Anna Almiroudis",
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

  const faq = [
    {
      q: "Do you take insurance for nutrition counseling in NYC?",
      a: "Yes. UnitedHealthcare, Aetna, and Blue Cross Blue Shield can be booked through Berry Street.",
    },
    {
      q: "Where is Functional Nourishment located?",
      a: "The practice is based in Astoria, NY. Nutrition visits are remote across the NYC metro area. Reiki and sound baths are offered in person in Astoria.",
    },
    {
      q: "What conditions do you treat?",
      a: "Cardiometabolic health, weight management, gastrointestinal disorders, and mental health nutrition — including IBS, celiac disease, prediabetes, diabetes, cholesterol, and stress-related outcomes.",
    },
  ];

  const pillars = [
    { href: "/sound-healing", title: "Nourish Mind", text: content.mind, icon: Brain },
    { href: "/nutrition", title: "Nourish Body", text: content.body, icon: HeartPulse },
    { href: "/meditation", title: "Nourish Spirit", text: content.spirit, icon: Sparkles },
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }}
      />

      <section className="bg-background">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-6 md:py-24">
          <div>
            <h1 className="font-serif text-4xl leading-tight text-primary md:text-6xl">
              Nourishing your <em className="italic">whole self</em> from the inside out.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted">{content.intro}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={settings.bookingUrl || "/book"}
                className="btn-primary"
                {...((settings.bookingUrl || "").startsWith("http")
                  ? { target: "_blank", rel: "noreferrer" }
                  : {})}
              >
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
              alt="Fresh greens, tea, and a journal on a table"
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
              alt="Colorful bowl of vegetables representing nourishing food"
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
                "As a board certified nutrition specialist, licensed nutritionist, certified dietitian-nutritionist and certified holistic health coach based in Astoria, NY, I bridge the gap between clinical science and intuitive wellness."}
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

      <CtaBand berryStreetUrl={settings.berryStreetUrl} bookingUrl={settings.bookingUrl} />
    </>
  );
}
