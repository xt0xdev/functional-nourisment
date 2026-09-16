export const INQUIRY_INTERESTS = [
  "Nutrition Counseling",
  "Sound Baths & Meditation",
  "Workshops & Events",
  "Corporate Wellness",
  "Retreats",
  "Collaborations & Partnerships",
  "General Inquiry",
] as const;

export const INQUIRY_SOURCES = [
  "Google/Search Engine",
  "Social Media",
  "Friend or Family",
  "Healthcare Provider",
  "Professional Referral",
  "Workshop or Event",
  "Insurance Directory",
  "Berry Street",
  "Other",
] as const;

export type InquiryInterest = (typeof INQUIRY_INTERESTS)[number];
export type InquirySource = (typeof INQUIRY_SOURCES)[number];

export const REFERRAL_SOURCES = new Set<InquirySource>([
  "Healthcare Provider",
  "Professional Referral",
]);

export function showsReferredBy(source: string) {
  return REFERRAL_SOURCES.has(source as InquirySource);
}
