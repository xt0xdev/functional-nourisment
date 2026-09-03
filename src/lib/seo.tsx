import type { Metadata } from "next";
import { siteUrl } from "./content";

type SeoInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
};

export function buildMetadata({ title, description, path = "/", image }: SeoInput): Metadata {
  const url = siteUrl(path);
  const ogImage =
    image ||
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&h=630&q=80";
  return {
    title,
    description,
    alternates: { canonical: url },
    keywords: [
      "nutritionist NYC",
      "functional nutritionist New York",
      "nutritionist Astoria",
      "nutritionist Queens",
      "dietitian NYC",
      "Certified Nutrition Specialist",
      "Medical Nutrition Therapy NYC",
      "IBS nutritionist New York",
      "gut health nutritionist NYC",
      "weight management nutritionist NYC",
      "Anna Almiroudis",
      "Functional Nourishment",
    ],
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

export function practiceSchema(settings: Record<string, string>) {
  return {
    "@context": "https://schema.org",
    "@type": ["MedicalBusiness", "LocalBusiness", "HealthAndBeautyBusiness"],
    name: settings.siteName || "Functional Nourishment",
    description:
      "Functional nutrition and integrative wellness practice in Astoria, NY serving the New York City metro area.",
    url: siteUrl(),
    email: settings.email,
    telephone: settings.phone || undefined,
    image: siteUrl("/og.jpg"),
    areaServed: [
      "Astoria, NY",
      "Queens, NY",
      "New York, NY",
      "Brooklyn, NY",
      "Bronx, NY",
      "Long Island, NY",
      "Westchester County, NY",
      "Northern New Jersey",
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
    medicalSpecialty: [
      "Nutrition",
      "Dietetics",
      "Preventive Medicine",
    ],
    founder: {
      "@type": "Person",
      name: settings.practitionerShortName || "Anna Almiroudis",
      honorificSuffix: settings.credentials,
      jobTitle: "Certified Nutrition Specialist",
      knowsLanguage: ["English", "Greek"],
    },
    sameAs: [settings.instagram, settings.berryStreetUrl].filter(Boolean),
  };
}
