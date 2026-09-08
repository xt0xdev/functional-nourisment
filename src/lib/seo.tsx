import type { Metadata } from "next";
import { siteUrl } from "./content";

type SeoInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  keywords?: string[];
};

const defaultKeywords = [
  "nutritionist NYC",
  "nutritionist in New York City",
  "functional nutritionist New York",
  "nutritionist Astoria",
  "nutritionist in Astoria NY",
  "nutritionist Queens",
  "nutritionist in Queens NY",
  "dietitian NYC",
  "dietitian Queens",
  "Certified Nutrition Specialist Astoria",
  "Medical Nutrition Therapy NYC",
  "IBS nutritionist Queens",
  "gut health nutritionist NYC",
  "weight management nutritionist NYC",
  "sound healing Astoria",
  "Reiki Astoria NY",
  "Anna Almiroudis",
  "Functional Nourishment",
  "New York State telehealth nutrition",
  "functional nutrition telehealth New York State",
];

export function buildMetadata({ title, description, path = "/", image, keywords }: SeoInput): Metadata {
  const url = siteUrl(path);
  const ogImage =
    image ||
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&h=630&q=80";
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    keywords: keywords || defaultKeywords,
    other: {
      "geo.region": "US-NY",
      "geo.placename": "Astoria, Queens, New York City",
      "geo.position": "40.7764;-73.9106",
      ICBM: "40.7764, -73.9106",
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Functional Nourishment",
      locale: "en_US",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function faqPageSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: siteUrl(item.path),
    })),
  };
}

export const practiceFaqs = [
  {
    q: "Do you accept insurance for nutrition counseling?",
    a: "Yes. I accept select insurance plans for nutrition services, including UnitedHealthcare, Aetna, Cigna, Emblem Health, GHI and Blue Cross Blue Shield. If you’re using insurance, you can book your appointment directly online.",
  },
  {
    q: "Where is Functional Nourishment located?",
    a: "Functional Nourishment is based in Astoria, Queens, with functional nutrition services available by telehealth throughout New York City and New York State. Meditation and sound bath experiences are also offered locally in the NYC area.",
  },
  {
    q: "What can functional nutrition help with?",
    a: "Functional nutrition takes a whole-person approach to health, looking beyond individual symptoms to better understand the bigger picture of your health and what may be contributing to how you feel. I support clients with digestive and gut health; metabolic and cardiovascular concerns such as high cholesterol and hypertension; insulin resistance, prediabetes, and diabetes; weight management and GLP-1 nutrition support; nutritional deficiencies; and nutrition for mental well-being, stress, and overall health.",
  },
  {
    q: "Do you work with clients outside of NYC?",
    a: "Yes. While Functional Nourishment is based in Astoria, Queens, I work with clients virtually throughout New York and New Jersey, as well as California for eligible clients. Insurance participation varies by state and plan, so I encourage you to check your coverage when booking.",
  },
];

export function practiceSchema(settings: Record<string, string>) {
  return {
    "@context": "https://schema.org",
    "@type": ["MedicalBusiness", "LocalBusiness", "HealthAndBeautyBusiness"],
    name: settings.siteName || "Functional Nourishment",
    description:
      "Personalized, evidence-based functional nutrition rooted in a whole-person approach to health and well-being. Based in Astoria, Queens, serving New York City and New York State through telehealth.",
    url: siteUrl(),
    email: settings.email,
    telephone: settings.phone || undefined,
    image: siteUrl("/og.jpg"),
    areaServed: [
      { "@type": "Place", name: "Astoria, NY" },
      { "@type": "AdministrativeArea", name: "Queens, NY" },
      { "@type": "City", name: "New York, NY" },
      { "@type": "AdministrativeArea", name: "Manhattan" },
      { "@type": "AdministrativeArea", name: "Brooklyn" },
      { "@type": "AdministrativeArea", name: "The Bronx" },
      { "@type": "AdministrativeArea", name: "Staten Island" },
      { "@type": "AdministrativeArea", name: "Long Island, NY" },
      { "@type": "AdministrativeArea", name: "Westchester County, NY" },
      { "@type": "State", name: "New York" },
      { "@type": "AdministrativeArea", name: "New York State telehealth" },
      { "@type": "AdministrativeArea", name: "Northern New Jersey" },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: settings.city || "Astoria",
      addressRegion: settings.region || "NY",
      postalCode: settings.postalCode || "11105",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 40.7764,
      longitude: -73.9106,
    },
    priceRange: "$$",
    openingHours: "Mo-Sa 10:00-18:00",
    medicalSpecialty: ["Nutrition", "Dietetics", "Preventive Medicine"],
    knowsAbout: [
      "Functional nutrition",
      "Medical Nutrition Therapy",
      "Gut health",
      "IBS",
      "Prediabetes",
      "Weight management",
      "Mental health nutrition",
      "Sound healing",
      "Reiki",
    ],
    availableLanguage: ["English", "Greek"],
    availableService: [
      {
        "@type": "MedicalTherapy",
        name: "Medical Nutrition Therapy",
        areaServed: ["Astoria, NY", "Queens, NY", "New York, NY", "New York State"],
      },
      {
        "@type": "Service",
        name: "Functional nutrition counseling",
        areaServed: "New York City and New York State telehealth",
      },
      {
        "@type": "Service",
        name: "Reiki and sound healing",
        areaServed: "Astoria, NY",
      },
    ],
    founder: {
      "@type": "Person",
      name: settings.practitionerShortName || "Anna Almiroudis",
      honorificSuffix: settings.credentials,
      jobTitle: "Certified Nutrition Specialist",
      knowsLanguage: ["English", "Greek"],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Astoria",
        addressRegion: "NY",
        addressCountry: "US",
      },
    },
    sameAs: [settings.instagram, settings.berryStreetUrl].filter(Boolean),
  };
}
