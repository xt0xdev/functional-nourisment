export const CALENDLY_URL =
  "https://calendly.com/functionalnourishment-krbc/new-meeting";

export const BERRY_STREET_URL =
  "https://www.berrystreet.co/provider-details/anna-almiroudis";

export const INSTAGRAM_URL = "https://www.instagram.com/functional_nourishment/";
export const INSTAGRAM_HANDLE = "Functional_nourishment";

export const DEFAULT_STRIPE_URL = "https://book.stripe.com/dRm7sLewW98h3uTaCo6Zy00";
export const DEFAULT_PAYPAL_URL = "https://www.paypal.com/ncp/payment/KZSXHPJZ4HCMU";

export const HERO_EYEBROW = "FUNCTIONAL NUTRITIONIST IN ASTORIA, QUEENS & NEW YORK CITY";
export const HERO_HEADING = "Nourishing your whole self from the inside out.";
export const HERO_INTRO =
  "Personalized, evidence-based functional nutrition and integrative mind-body practices to support your health and well-being. Based in Astoria, Queens, serving New York City and beyond through telehealth, with meditation and sound bath experiences offered locally.";

export const SERVICE_AREA_EYEBROW = "Serving New York";
export const SERVICE_AREA_HEADING = "Functional Nutrition in Astoria, Queens & NYC";
export const SERVICE_AREA_BODY =
  "Based in Astoria, Queens, Functional Nourishment offers personalized, evidence-based functional nutrition through telehealth across New York City and New York State, with meditation, breathwork, sound bath and holistic wellness experiences offered locally.";

export const CTA_HEADING = "Ready to feel more supported in your health?";
export const CTA_BODY =
  "Together, we’ll look beyond symptoms to understand the bigger picture of your health and create a personalized, evidence-based nutrition plan that supports you as a whole person. Telehealth nutrition services are available throughout New York City and New York State.";
export const CTA_LEFT_TITLE = "Want to learn more?";
export const CTA_LEFT_TEXT =
  "Book a complimentary 20-minute call to learn more about what you’re looking for, answer your questions, and explore whether working together feels like the right fit.";
export const CTA_RIGHT_TITLE = "Book with Insurance";
export const CTA_RIGHT_TEXT =
  "Ready to begin? If you’re using insurance, there’s no need to schedule a discovery call. You can book your nutrition appointment directly through Berry Street and choose a time that works best for you.";

export const FOOTER_BLURB =
  "Based in Astoria, Queens, Functional Nourishment offers personalized, evidence-based functional nutrition through telehealth across New York City and New York State, with meditation, breathwork, sound bath and holistic wellness experiences offered locally.";

export const PRACTITIONER_CREDIT =
  "Anna Almiroudis, MS, CNS, LN, CDN — Functional Nourishment, LLC — Functional-Nourishment.com";

export const CHILDRENS_BOOK_NOTE =
  "Explore my new children's book on nutrition and mindfulness! Plant Superheroes: The Adventures of Cee and her Citrus Cousins";

export const FAQ_HEADING = "Functional Nutrition in Astoria, Queens & New York City";

export const INQUIRY_SOURCES = [
  "Referred by Physician's office",
  "Google search",
  "Friend or family",
  "Other",
] as const;

export type InquirySource = (typeof INQUIRY_SOURCES)[number];

const LEGACY_FOOTER_BLURBS = [
  "A whole-person functional nutrition practice in Astoria, Queens, serving New York City",
  "Personalized, evidence-based functional nutrition rooted in a whole-person approach to health and well-being. Based in Astoria, Queens, serving New York City and New York State through telehealth.",
];

const LEGACY_HERO_INTROS = [
  "Holistic functional nutrition and mind-body care from Astoria, Queens",
];

export function isLegacyHeroIntro(value?: string | null) {
  if (!value?.trim()) return true;
  return LEGACY_HERO_INTROS.some((legacy) => value.includes(legacy));
}

export function resolveFooterBlurb(value?: string | null) {
  const text = value?.trim() || "";
  if (!text) return FOOTER_BLURB;
  if (LEGACY_FOOTER_BLURBS.some((legacy) => text.includes(legacy))) return FOOTER_BLURB;
  return text;
}

export function resolveInstagramUrl(value?: string | null) {
  const url = value?.trim() || "";
  if (!url) return INSTAGRAM_URL;
  const normalized = url.toLowerCase();
  if (
    normalized.includes("instagram.com/functionalnourishment") &&
    !normalized.includes("functional_nourishment")
  ) {
    return INSTAGRAM_URL;
  }
  return url;
}

export function resolveStripeUrl(
  event?: { stripeUrl?: string | null } | null,
  settings?: Record<string, string> | null,
) {
  return event?.stripeUrl?.trim() || settings?.stripeUrl?.trim() || DEFAULT_STRIPE_URL;
}

export function resolvePaypalUrl(
  event?: { paypalUrl?: string | null } | null,
  settings?: Record<string, string> | null,
) {
  return event?.paypalUrl?.trim() || settings?.paypalUrl?.trim() || DEFAULT_PAYPAL_URL;
}
