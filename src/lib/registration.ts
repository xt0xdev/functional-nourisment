export const RETREAT_DIETARY_OPTIONS = [
  "No dietary restrictions",
  "Vegetarian",
  "Vegan",
  "Gluten-free",
  "Dairy-free",
  "Other",
] as const;

export const RETREAT_HEAR_ABOUT_OPTIONS = [
  "Functional Nourishment website",
  "Instagram / Social Media",
  "Friend or Family",
  "Previous Event or Retreat",
  "Other",
] as const;

export type RetreatDietaryOption = (typeof RETREAT_DIETARY_OPTIONS)[number];
export type RetreatHearAboutOption = (typeof RETREAT_HEAR_ABOUT_OPTIONS)[number];

export type RetreatRegistrationDetails = {
  dietaryPreferences?: string[];
  dietaryOther?: string;
  foodAllergies?: string;
  accessibilityNeeds?: string;
  inspiration?: string;
  hopes?: string;
  heardAbout?: string[];
  agreedPolicy?: boolean;
  agreedVoluntary?: boolean;
  agreedEssentialComms?: boolean;
};

export function parseRegistrationDetails(raw?: string | null): RetreatRegistrationDetails {
  if (!raw?.trim()) return {};
  try {
    return JSON.parse(raw) as RetreatRegistrationDetails;
  } catch {
    return {};
  }
}
