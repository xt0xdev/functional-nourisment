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
    q: "Do you take insurance for nutrition counseling in NYC?",
    a: "Yes. UnitedHealthcare, Aetna, and Blue Cross Blue Shield can be booked through Berry Street for clients in Astoria, Queens, and across New York City.",
  },
  {
    q: "Where is Functional Nourishment located?",
    a: "The practice is based in Astoria, Queens. Nutrition visits are remote across the NYC metro area. Reiki and sound baths are offered in person in Astoria.",
  },
  {
    q: "What conditions do you treat?",
    a: "Cardiometabolic health, weight management, gastrointestinal disorders, and mental health nutrition — including IBS, celiac disease, prediabetes, diabetes, cholesterol, and stress-related outcomes.",
  },
  {
    q: "Do you see clients in Queens and the rest of New York City?",
    a: "Yes. Medical Nutrition Therapy is available by telehealth throughout Queens and the five boroughs. Clients in Long Island, Westchester, Northern New Jersey, and nearby Connecticut can also book remotely.",
  },
];

export function practiceSchema(settings: Record<string, string>) {
  return {
    "@context": "https://schema.org",
    "@type": ["MedicalBusiness", "LocalBusiness", "HealthAndBeautyBusiness"],
    name: settings.siteName || "Functional Nourishment",
    description:
      "Functional nutrition and integrative wellness practice in Astoria, Queens, serving New York City with Medical Nutrition Therapy, Reiki, and sound healing.",
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
        areaServed: ["Astoria, NY", "Queens, NY", "New York, NY"],
      },
      {
        "@type": "Service",
        name: "Functional nutrition counseling",
        areaServed: "New York City metro area",
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
