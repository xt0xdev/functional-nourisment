import Image from "next/image";
import Link from "next/link";
import { getExperiences, getPage, getServices, getSettings, parseContent } from "@/lib/content";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { CtaBand } from "@/components/site/CtaBand";
import { ArrowRight } from "lucide-react";

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
  support: string[];
};

export default async function HomePage() {
  const [page, settings, services, experiences] = await Promise.all([
    getPage("home"),
    getSettings(),
    getServices(),
    getExperiences(),
  ]);
  const content = parseContent<HomeContent>(page?.content || "{}", {
    intro: page?.heroSubheading || "",
    mind: "",
    body: "",
    spirit: "",
    support: [],
  });

  const faq = [
    {
      q: "Do you take insurance for nutrition counseling in NYC?",
      a: "Yes. UnitedHealthcare, Aetna, and Blue Cross Blue Shield can be booked through Berry Street. Additional plans may be available depending on your coverage.",
    },
    {
      q: "Where is Functional Nourishment located?",
      a: "The practice is based in Astoria, NY 11105. Nutrition visits are remote across the NYC metro area. Reiki and sound baths are offered in person in Astoria.",
    },
    {
      q: "What conditions do you treat?",
      a: "Cardiometabolic health, weight management, gastrointestinal disorders, and mental health nutrition — including IBS, celiac disease, prediabetes, diabetes, cholesterol, and stress-related outcomes.",
    },
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
      <section className="relative min-h-[88vh] overflow-hidden bg-forest text-cream">
        <Image
          src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=2000&q=80"
          alt="Woman sitting in meditation on a wooden dock at sunrise"
          fill
          priority
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/70 to-forest/30" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 md:px-6 md:pb-24">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">
            Astoria · New York City metro
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-tight md:text-6xl">
            {page?.heroHeading}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-cream/85">{content.intro}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/book" className="rounded-full bg-cream px-6 py-3 text-center text-forest">
              Book a discovery call
            </Link>
            <a
              href={settings.berryStreetUrl}
              className="rounded-full border border-cream/40 px-6 py-3 text-center text-cream"
              target="_blank"
              rel="noreferrer"
            >
              Book with insurance
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-16 md:grid-cols-3 md:px-6">
        {[
          { href: "/sound-healing", title: "Mind", text: content.mind, image: "https://images.unsplash.com/photo-1600618528240-fb9fc964b853?auto=format&fit=crop&w=900&q=80", alt: "Crystal singing bowls used for sound healing" },
          { href: "/nutrition", title: "Body", text: content.body, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80", alt: "Colorful bowl of vegetables, grains, and healthy fats" },
          { href: "/meditation", title: "Spirit", text: content.spirit, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80", alt: "Calm mountain lake representing spiritual stillness" },
        ].map((pillar) => (
          <article key={pillar.title} className="overflow-hidden rounded-3xl bg-white shadow-sm">
            <div className="relative h-52">
              <Image src={pillar.image} alt={pillar.alt} fill className="object-cover" />
            </div>
            <div className="p-6">
              <h2 className="font-serif text-3xl text-forest">{pillar.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{pillar.text}</p>
              <Link href={pillar.href} className="mt-4 inline-flex items-center gap-2 text-sm text-moss">
                Learn more <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-6">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
            <Image
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80"
              alt="Hands preparing fresh herbs and whole foods in a sunlit kitchen"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-clay">Meet your nutritionist</p>
            <h2 className="mt-3 font-serif text-4xl text-forest md:text-5xl">
              {settings.practitionerName}
            </h2>
            <p className="mt-5 leading-relaxed text-muted">
              Certified Nutrition Specialist, licensed nutritionist, herbalist, Karuna® and Usui
              Reiki Master, and sound bath facilitator. Anna brings a uniquely integrative
              approach — grounded in science, rooted in nature, and powered by compassion — to
              clients across Astoria and the NYC metro area.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              She provides evidence-based Medical Nutrition Therapy for cardiometabolic health,
              gastrointestinal disorders, weight management, and mental health nutrition, and
              works in English and Greek.
            </p>
            <Link href="/about" className="mt-6 inline-flex items-center gap-2 text-moss">
              Read Anna’s story <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <p className="text-xs uppercase tracking-[0.22em] text-clay">How I can support you</p>
        <h2 className="mt-2 font-serif text-4xl text-forest">Clinical nutrition with a whole-person lens</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {content.support.map((item) => (
            <p key={item} className="rounded-2xl bg-white p-5 leading-relaxed text-muted shadow-sm">
              {item}
            </p>
          ))}
        </div>
      </section>

      <section className="bg-sand">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <h2 className="font-serif text-4xl text-forest">Specialties</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {services.map((service) => (
              <article key={service.id} className="rounded-2xl bg-cream p-6">
                <h3 className="font-serif text-2xl text-forest">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{service.excerpt}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-serif text-4xl text-forest">Wellness experiences</h2>
          <Link href="/experiences" className="hidden text-sm text-moss md:inline">
            View all
          </Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {experiences.map((experience) => (
            <article key={experience.id} className="rounded-2xl border border-forest/10 p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-clay">{experience.subtitle}</p>
              <h3 className="mt-2 font-serif text-2xl text-forest">{experience.title}</h3>
              <p className="mt-3 text-sm text-muted">{experience.excerpt}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 md:px-6">
          <h2 className="font-serif text-4xl text-forest">Questions from NYC clients</h2>
          <dl className="mt-8 space-y-6">
            {faq.map((item) => (
              <div key={item.q}>
                <dt className="font-medium text-forest">{item.q}</dt>
                <dd className="mt-2 text-muted">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <CtaBand berryStreetUrl={settings.berryStreetUrl} />
    </>
  );
}
