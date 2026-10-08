import {
  ABOUT_CREDENTIAL_ITEMS,
  ABOUT_HERO_SUBHEADING,
  ABOUT_NAME,
  ABOUT_PARAGRAPHS,
  AMAZON_BOOK_LABEL,
  AMAZON_BOOK_URL,
  BOOK_BERRY_STREET_LABEL,
  BOOK_CONNECT_BODY,
  BOOK_CONNECT_TITLE,
  BOOK_EYEBROW,
  BOOK_FORM_INTRO,
  BOOK_FORM_LEAD,
  BOOK_FORM_NOTE,
  BOOK_FORM_TITLE,
  BOOK_HEADING,
  BOOK_INQUIRIES_BODY,
  BOOK_INQUIRIES_TITLE,
  BOOK_INSURANCE_BODY,
  BOOK_INSURANCE_TITLE,
  BOOK_INTRO,
  BOOK_LEAD,
  BOOK_TAGLINE,
  CALENDAR_DESCRIPTION,
  CALENDAR_TITLE,
  COLLABORATIVE_CARE_BODY,
  COLLABORATIVE_CARE_EYEBROW,
  COLLABORATIVE_CARE_META_DESCRIPTION,
  COLLABORATIVE_CARE_PARAGRAPHS,
  COLLABORATIVE_CARE_PARTNER_BODY,
  COLLABORATIVE_CARE_PARTNER_DETAIL,
  COLLABORATIVE_CARE_PARTNER_LABEL,
  COLLABORATIVE_CARE_PARTNER_NAME,
  COLLABORATIVE_CARE_PARTNER_URL,
  COLLABORATIVE_CARE_TITLE,
  CONTACT_HERO,
  CONTACT_SECOND,
  EVENTS_INTRO,
  EXPERIENCES_DATES_HEADING,
  EXPERIENCES_GALLERY_EYEBROW,
  EXPERIENCES_GALLERY_HEADING,
  EXPERIENCES_GROUP_BODY,
  EXPERIENCES_GROUP_HEADING,
  EXPERIENCES_INTRO,
  EXPERIENCES_INTRO_MORE,
  EXPERIENCES_RETREATS_HEADING,
  EXPERIENCES_SUB,
  EXPERIENCES_TITLE,
  EXPERIENCE_SECTIONS,
  HOME_MEET_EYEBROW,
  HOME_MEET_HEADING,
  HOME_PILLARS_EYEBROW,
  HOME_PILLARS_HEADING,
  HOME_PILLARS_SUB,
  HOME_PRACTITIONER,
  HOME_PRACTITIONER_MORE,
  HOME_QUOTE,
  MIND_HERO,
  MIND_HOW,
  MIND_HOW_HEADING,
  MIND_MEDITATIVE,
  MIND_SESSIONS,
  MIND_WHAT,
  MIND_WHAT_HEADING,
  NOURISH_DESCRIPTION,
  NOURISH_HERO_LINE,
  NOURISH_INSIGHTS_HEADING,
  NOURISH_JOURNAL_BODY,
  NOURISH_JOURNAL_LEAD,
  NOURISH_JOURNAL_TAGS,
  NOURISH_RECIPE_TAGS,
  NOURISH_RECIPES_BODY,
  NOURISH_RECIPES_LEAD,
  NOURISH_RESOURCES_BODY,
  NOURISH_RESOURCES_HEADING,
  NOURISH_TITLE,
  NUTRITION_APPROACH,
  NUTRITION_AREAS,
  NUTRITION_AREAS_EYEBROW,
  NUTRITION_AREAS_HEADING,
  NUTRITION_CLOSING,
  NUTRITION_COOKING_ALT,
  NUTRITION_COOKING_IMAGE,
  NUTRITION_FOOD_FIRST,
  NUTRITION_GOAL,
  NUTRITION_HEADING,
  NUTRITION_HERO,
  NUTRITION_HOW_EYEBROW,
  NUTRITION_HOW_HEADING,
  NUTRITION_HOW_IT_WORKS,
  NUTRITION_INTRO,
  NUTRITION_NOT_ALONE,
  PILLAR_BODY,
  PILLAR_MIND,
  PILLAR_SPIRIT,
  RETREATS_INTRO,
  RETREATS_MAILING_BODY,
  RETREATS_MAILING_HEADING,
  RETREATS_NATURE,
  RETREATS_NATURE_HEADING,
  RETREATS_SUB,
  RETREATS_TITLE,
  RETREATS_UPCOMING_EMPTY,
  RETREATS_UPCOMING_HEADING,
  RETREATS_WHAT,
  RETREATS_WHAT_HEADING,
  SPIRIT_EXPERIENCE_HEADING,
  SPIRIT_EXPERIENCE_ITEMS,
  SPIRIT_EYEBROW,
  SPIRIT_GATHER_EYEBROW,
  SPIRIT_GATHER_HEADING,
  SPIRIT_GATHER_INTRO,
  SPIRIT_GATHER_MORE,
  SPIRIT_HERO,
  SPIRIT_RETREATS_BODY,
  SPIRIT_RETREATS_EYEBROW,
  SPIRIT_RETREATS_GREECE,
  SPIRIT_RETREATS_HEADING,
  SPIRIT_RETREATS_LEAD,
  resolveAreaIconKey,
  resolvePillarCopy,
} from "./page-copy";
import { CHILDRENS_BOOK_NOTE, HERO_HEADING, HERO_INTRO, isLegacyHeroIntro } from "./site-defaults";
import { SITE_IMAGES } from "./site-images";
import { galleryFromFormData, resolveExperiencesGallery } from "./experiences-gallery";
import { partnersFromFormData, resolveWellnessPartners } from "./wellness-partners";

export type FieldKind = "text" | "textarea" | "list" | "paragraphs" | "image" | "checkbox";

export type TemplateField = {
  key: string;
  label: string;
  help?: string;
  kind: FieldKind;
  rows?: number;
};

export type RepeatField = {
  key: string;
  label: string;
  kind: "text" | "textarea";
  rows?: number;
};

export type TemplateGroup = {
  key: string;
  label: string;
  help?: string;
  itemLabel: string;
  fields: RepeatField[];
};

export type TemplateSection = {
  heading: string;
  help?: string;
  fields?: TemplateField[];
  groups?: TemplateGroup[];
};

export type PageTemplate = {
  slug: string;
  description: string;
  sections: TemplateSection[];
};

export type HeroDefaults = {
  heading: string;
  subheading: string;
};

export function parsePageJson(raw?: string | null): Record<string, unknown> {
  try {
    const parsed = JSON.parse(raw || "{}") as unknown;
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

export function isEmptyValue(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === "string") return !value.trim();
  if (Array.isArray(value)) return value.length === 0 || value.every((item) => isEmptyValue(item));
  if (typeof value === "object") return Object.keys(value as object).length === 0;
  return false;
}

export function fillMissingContent(
  existing: Record<string, unknown>,
  defaults: Record<string, unknown>,
) {
  const next = { ...existing };
  for (const [key, value] of Object.entries(defaults)) {
    if (key === "layout") continue;
    if (isEmptyValue(next[key])) next[key] = value;
  }
  return next;
}

export function pickText(value: unknown, fallback: string, legacy: readonly string[] = []) {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text) return fallback;
  if (legacy.some((item) => text === item || text.includes(item))) return fallback;
  return text;
}

export function pickBoolean(value: unknown, fallback: boolean) {
  if (typeof value === "boolean") return value;
  if (value === "on" || value === "true" || value === "1") return true;
  if (value === "off" || value === "false" || value === "0") return false;
  return fallback;
}

export function pickList(value: unknown, fallback: readonly string[], legacy: readonly string[] = []) {
  const items = Array.isArray(value)
    ? value.map((item) => String(item).trim()).filter(Boolean)
    : typeof value === "string" && value.trim()
      ? value.split(/\n+/).map((item) => item.trim()).filter(Boolean)
      : [];
  if (!items.length) return [...fallback];
  const joined = items.join("\n");
  if (legacy.some((item) => joined === item || items.length === 1 && items[0] === item)) {
    return [...fallback];
  }
  return items;
}

export function pickParagraphs(
  value: unknown,
  fallback: readonly string[],
  legacy: readonly string[] = [],
) {
  const items = Array.isArray(value)
    ? value.map((item) => String(item).trim()).filter(Boolean)
    : typeof value === "string" && value.trim()
      ? value.split(/\n\n+/).map((item) => item.trim()).filter(Boolean)
      : [];
  if (!items.length) return [...fallback];
  const joined = items.join("\n\n");
  if (legacy.some((item) => joined === item || (items.length === 1 && items[0] === item))) {
    return [...fallback];
  }
  return items;
}

type StringRecord = Record<string, string>;

export function pickItems(value: unknown, fallback: readonly StringRecord[], keys: string[]) {
  if (!Array.isArray(value) || !value.length) {
    return fallback.map((item) => ({ ...item }));
  }
  return value.map((raw, index) => {
    const row = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
    const fallbackRow = fallback[index] || fallback[0] || {};
    const next: StringRecord = {};
    for (const key of keys) {
      next[key] = pickText(row[key], fallbackRow[key] || "");
    }
    return next;
  });
}

export function publicPathForSlug(slug: string) {
  return slug === "home" ? "/" : `/${slug}`;
}

export const HERO_DEFAULTS: Record<string, HeroDefaults> = {
  home: { heading: HERO_HEADING, subheading: HERO_INTRO },
  about: { heading: ABOUT_NAME, subheading: ABOUT_HERO_SUBHEADING },
  nutrition: { heading: "Nourish Body", subheading: NUTRITION_HERO },
  "sound-healing": { heading: "Nourish Mind", subheading: MIND_HERO },
  meditation: { heading: "Nourish Spirit", subheading: SPIRIT_HERO },
  experiences: { heading: EXPERIENCES_TITLE, subheading: EXPERIENCES_SUB },
  events: {
    heading: "Events & Workshops",
    subheading: "Join an upcoming class, sound bath, or community wellness gathering in Astoria and New York City.",
  },
  calendar: { heading: CALENDAR_TITLE, subheading: CALENDAR_DESCRIPTION },
  book: { heading: BOOK_HEADING, subheading: BOOK_LEAD },
  contact: { heading: "Contact", subheading: CONTACT_HERO },
  retreats: { heading: RETREATS_TITLE, subheading: RETREATS_SUB },
  nourish: { heading: NOURISH_TITLE, subheading: NOURISH_HERO_LINE },
  "collaborative-care": {
    heading: COLLABORATIVE_CARE_TITLE,
    subheading: COLLABORATIVE_CARE_META_DESCRIPTION,
  },
};

export function resolveHeroText(
  page: { slug: string; heroHeading: string; heroSubheading: string } | null | undefined,
) {
  const defaults = page ? HERO_DEFAULTS[page.slug] : undefined;
  return {
    heading: page?.heroHeading?.trim() || defaults?.heading || "",
    subheading: page?.heroSubheading?.trim() || defaults?.subheading || "",
  };
}

export function retreatsContentDefaults() {
  return {
    intro: [...RETREATS_INTRO],
    whatHeading: RETREATS_WHAT_HEADING,
    whatItems: [...RETREATS_WHAT],
    natureHeading: RETREATS_NATURE_HEADING,
    nature: [...RETREATS_NATURE],
    natureImage1: SITE_IMAGES.greeceCircle,
    natureImage1Alt: SITE_IMAGES.greeceCircleAlt,
    natureImage2: SITE_IMAGES.wellnessCliff,
    natureImage2Alt: SITE_IMAGES.wellnessCliffAlt,
    bottomImage: "",
    bottomImageAlt: "",
    upcomingHeading: RETREATS_UPCOMING_HEADING,
    upcomingEmpty: RETREATS_UPCOMING_EMPTY,
    mailingHeading: RETREATS_MAILING_HEADING,
    mailingBody: RETREATS_MAILING_BODY,
  };
}

export function nutritionContentDefaults() {
  return {
    heading: NUTRITION_HEADING,
    intro: NUTRITION_INTRO,
    notAlone: NUTRITION_NOT_ALONE,
    approach: NUTRITION_APPROACH,
    foodFirst: NUTRITION_FOOD_FIRST,
    goal: NUTRITION_GOAL,
    closing: NUTRITION_CLOSING,
    cookingImage: NUTRITION_COOKING_IMAGE,
    cookingImageAlt: NUTRITION_COOKING_ALT,
    howEyebrow: NUTRITION_HOW_EYEBROW,
    howHeading: NUTRITION_HOW_HEADING,
    howItWorks: NUTRITION_HOW_IT_WORKS.map((step) => ({ ...step })),
    areasEyebrow: NUTRITION_AREAS_EYEBROW,
    areasHeading: NUTRITION_AREAS_HEADING,
    areas: NUTRITION_AREAS.map((area) => ({ ...area })),
  };
}

export function aboutContentDefaults() {
  return {
    paragraphs: [...ABOUT_PARAGRAPHS],
    credentials: [...ABOUT_CREDENTIAL_ITEMS],
    bookNote: CHILDRENS_BOOK_NOTE,
    showAmazonButton: true,
    amazonButtonLabel: AMAZON_BOOK_LABEL,
    amazonButtonUrl: AMAZON_BOOK_URL,
  };
}

export function homeContentDefaults() {
  return {
    intro: HERO_INTRO,
    mind: PILLAR_MIND,
    body: PILLAR_BODY,
    spirit: PILLAR_SPIRIT,
    quote: HOME_QUOTE,
    practitioner: HOME_PRACTITIONER,
    practitionerMore: HOME_PRACTITIONER_MORE,
    pillarsEyebrow: HOME_PILLARS_EYEBROW,
    pillarsHeading: HOME_PILLARS_HEADING,
    pillarsSub: HOME_PILLARS_SUB,
    meetEyebrow: HOME_MEET_EYEBROW,
    meetHeading: HOME_MEET_HEADING,
  };
}

export function soundHealingContentDefaults() {
  return {
    whatHeading: MIND_WHAT_HEADING,
    what: MIND_WHAT,
    howHeading: MIND_HOW_HEADING,
    how: MIND_HOW,
    meditative: MIND_MEDITATIVE,
    close: MIND_SESSIONS,
    sectionImage: SITE_IMAGES.mindBowls,
    sectionImageAlt: SITE_IMAGES.mindBowlsAlt,
  };
}

export function meditationContentDefaults() {
  return {
    eyebrow: SPIRIT_EYEBROW,
    gatherEyebrow: SPIRIT_GATHER_EYEBROW,
    gatherHeading: SPIRIT_GATHER_HEADING,
    gatherIntro: SPIRIT_GATHER_INTRO,
    gatherMore: SPIRIT_GATHER_MORE,
    experienceHeading: SPIRIT_EXPERIENCE_HEADING,
    experienceItems: [...SPIRIT_EXPERIENCE_ITEMS],
    retreatsEyebrow: SPIRIT_RETREATS_EYEBROW,
    retreatsHeading: SPIRIT_RETREATS_HEADING,
    retreatsLead: SPIRIT_RETREATS_LEAD,
    retreatsBody: SPIRIT_RETREATS_BODY,
    retreatsGreece: SPIRIT_RETREATS_GREECE,
    image1: SITE_IMAGES.spiritSoundbath,
    image1Alt: SITE_IMAGES.spiritSoundbathAlt,
    image2: SITE_IMAGES.greeceCircle,
    image2Alt: SITE_IMAGES.greeceCircleAlt,
    image3: SITE_IMAGES.greeceClose,
    image3Alt: SITE_IMAGES.greeceCloseAlt,
  };
}

export function experiencesContentDefaults() {
  return {
    intro: EXPERIENCES_INTRO,
    introMore: EXPERIENCES_INTRO_MORE,
    experienceSections: EXPERIENCE_SECTIONS.map((section) => ({ ...section })),
    groupHeading: EXPERIENCES_GROUP_HEADING,
    groupBody: EXPERIENCES_GROUP_BODY,
    galleryEyebrow: EXPERIENCES_GALLERY_EYEBROW,
    galleryHeading: EXPERIENCES_GALLERY_HEADING,
    datesHeading: EXPERIENCES_DATES_HEADING,
    retreatsHeading: EXPERIENCES_RETREATS_HEADING,
  };
}

export function collaborativeContentDefaults() {
  return {
    eyebrow: COLLABORATIVE_CARE_EYEBROW,
    body: COLLABORATIVE_CARE_BODY,
    partnerName: COLLABORATIVE_CARE_PARTNER_NAME,
    partnerDetail: COLLABORATIVE_CARE_PARTNER_DETAIL,
    partnerBody: [...COLLABORATIVE_CARE_PARTNER_BODY],
    partnerLabel: COLLABORATIVE_CARE_PARTNER_LABEL,
    partnerUrl: COLLABORATIVE_CARE_PARTNER_URL,
  };
}

export function bookContentDefaults() {
  return {
    eyebrow: BOOK_EYEBROW,
    heading: BOOK_HEADING,
    lead: BOOK_LEAD,
    intro: BOOK_INTRO,
    connectTitle: BOOK_CONNECT_TITLE,
    connectBody: BOOK_CONNECT_BODY,
    insuranceTitle: BOOK_INSURANCE_TITLE,
    insuranceBody: BOOK_INSURANCE_BODY,
    berryStreetLabel: BOOK_BERRY_STREET_LABEL,
    inquiriesTitle: BOOK_INQUIRIES_TITLE,
    inquiriesBody: BOOK_INQUIRIES_BODY,
    tagline: BOOK_TAGLINE,
    formTitle: BOOK_FORM_TITLE,
    formLead: BOOK_FORM_LEAD,
    formIntro: BOOK_FORM_INTRO,
    formNote: BOOK_FORM_NOTE,
  };
}

export function contactContentDefaults() {
  return { intro: CONTACT_SECOND };
}

export function calendarContentDefaults() {
  return { intro: CALENDAR_DESCRIPTION };
}

export function eventsContentDefaults() {
  return { intro: EVENTS_INTRO };
}

export function nourishContentDefaults() {
  return {
    description: NOURISH_DESCRIPTION,
    journalLead: NOURISH_JOURNAL_LEAD,
    journalBody: NOURISH_JOURNAL_BODY,
    journalTags: [...NOURISH_JOURNAL_TAGS],
    insightsHeading: NOURISH_INSIGHTS_HEADING,
    recipesLead: NOURISH_RECIPES_LEAD,
    recipesBody: NOURISH_RECIPES_BODY,
    recipeTags: [...NOURISH_RECIPE_TAGS],
    resourcesHeading: NOURISH_RESOURCES_HEADING,
    resourcesBody: NOURISH_RESOURCES_BODY,
  };
}

export function defaultContentFor(slug: string): Record<string, unknown> {
  switch (slug) {
    case "home":
      return homeContentDefaults();
    case "about":
      return aboutContentDefaults();
    case "nutrition":
      return nutritionContentDefaults();
    case "sound-healing":
      return soundHealingContentDefaults();
    case "meditation":
      return meditationContentDefaults();
    case "experiences":
      return experiencesContentDefaults();
    case "events":
      return eventsContentDefaults();
    case "calendar":
      return calendarContentDefaults();
    case "book":
      return bookContentDefaults();
    case "contact":
      return contactContentDefaults();
    case "retreats":
      return retreatsContentDefaults();
    case "nourish":
      return nourishContentDefaults();
    case "collaborative-care":
      return collaborativeContentDefaults();
    default:
      return {};
  }
}

export const PAGE_TEMPLATES: Record<string, PageTemplate> = {
  home: {
    slug: "home",
    description: "These fields match the published home page: intro, pillars, and the Meet Anna section.",
    sections: [
      {
        heading: "Home intro",
        fields: [
          { key: "intro", label: "Intro paragraph", kind: "textarea", rows: 5 },
        ],
      },
      {
        heading: "Core pillars",
        fields: [
          { key: "pillarsEyebrow", label: "Section eyebrow", kind: "text" },
          { key: "pillarsHeading", label: "Section heading", kind: "text" },
          { key: "pillarsSub", label: "Section subheading", kind: "text" },
          { key: "mind", label: "Nourish Mind", kind: "textarea", rows: 4 },
          { key: "body", label: "Nourish Body", kind: "textarea", rows: 4 },
          { key: "spirit", label: "Nourish Spirit", kind: "textarea", rows: 4 },
        ],
      },
      {
        heading: "Meet Anna",
        fields: [
          { key: "meetEyebrow", label: "Section eyebrow", kind: "text" },
          { key: "meetHeading", label: "Section heading", kind: "text" },
          { key: "quote", label: "Portrait quote", kind: "textarea", rows: 2 },
          { key: "practitioner", label: "About Anna — first paragraph", kind: "textarea", rows: 5 },
          { key: "practitionerMore", label: "About Anna — second paragraph", kind: "textarea", rows: 4 },
        ],
      },
    ],
  },
  about: {
    slug: "about",
    description: "These fields match the published About page biography, credentials, book note, and Amazon button.",
    sections: [
      {
        heading: "About Anna",
        help: "Separate paragraphs with a blank line.",
        fields: [
          { key: "paragraphs", label: "Biography", kind: "paragraphs", rows: 16 },
          {
            key: "credentials",
            label: "Credentials list",
            kind: "list",
            rows: 8,
            help: "One credential per line.",
          },
          { key: "bookNote", label: "Children's book note", kind: "textarea", rows: 3 },
        ],
      },
      {
        heading: "Buy on Amazon button",
        help: "When the visual layout is off, this is the template button under the book note. When the layout is on, place a button block in the page body designer — these fields prefill that block so the live button does not disappear.",
        fields: [
          {
            key: "showAmazonButton",
            label: "Show Buy on Amazon button",
            kind: "checkbox",
            help: "Uncheck to hide the template button. To hide it on a designed layout, delete the button block on the canvas.",
          },
          { key: "amazonButtonLabel", label: "Button label", kind: "text" },
          {
            key: "amazonButtonUrl",
            label: "Button URL",
            kind: "text",
            help: "Defaults to the Plant Superheroes Amazon listing.",
          },
        ],
      },
    ],
  },
  nutrition: {
    slug: "nutrition",
    description: "These fields match the published Nourish Body page, including How it Works and Areas I Support.",
    sections: [
      {
        heading: "Nourish Body intro",
        fields: [
          { key: "heading", label: "Section heading", kind: "text" },
          { key: "intro", label: "Intro paragraph", kind: "textarea", rows: 5 },
          { key: "notAlone", label: "Highlight line", kind: "textarea", rows: 2 },
          { key: "approach", label: "Approach paragraph", kind: "textarea", rows: 5 },
          { key: "foodFirst", label: "Food-first paragraph", kind: "textarea", rows: 4 },
          { key: "goal", label: "Goal paragraph", kind: "textarea", rows: 4 },
          {
            key: "cookingImage",
            label: "Side image",
            kind: "image",
            help: "The kitchen photo beside the intro.",
          },
        ],
      },
      {
        heading: "How it Works",
        fields: [
          { key: "howEyebrow", label: "Section eyebrow", kind: "text" },
          { key: "howHeading", label: "Section heading", kind: "text" },
          { key: "closing", label: "Closing line", kind: "textarea", rows: 3 },
        ],
        groups: [
          {
            key: "howItWorks",
            label: "Steps",
            itemLabel: "Step",
            fields: [
              { key: "title", label: "Title", kind: "text" },
              { key: "text", label: "Text", kind: "textarea", rows: 3 },
            ],
          },
        ],
      },
      {
        heading: "Areas I Support",
        fields: [
          { key: "areasEyebrow", label: "Section eyebrow", kind: "text" },
          { key: "areasHeading", label: "Section heading", kind: "text" },
        ],
        groups: [
          {
            key: "areas",
            label: "Support areas",
            itemLabel: "Area",
            help: "Icon keys: heart, droplet, weight, gut (stomach), bowl (apple + carrot), lotus. Gut, nutrient, and well-being titles always use those three icons on the public page.",
            fields: [
              { key: "title", label: "Title", kind: "text" },
              { key: "detail", label: "Detail", kind: "textarea", rows: 2 },
              { key: "icon", label: "Icon key", kind: "text" },
            ],
          },
        ],
      },
    ],
  },
  "sound-healing": {
    slug: "sound-healing",
    description: "These fields match the published Nourish Mind / sound healing page.",
    sections: [
      {
        heading: "Sound healing copy",
        fields: [
          { key: "whatHeading", label: "What heading", kind: "text" },
          { key: "what", label: "What is sound healing?", kind: "textarea", rows: 6 },
          { key: "howHeading", label: "How heading", kind: "text" },
          { key: "how", label: "How sound may influence awareness", kind: "textarea", rows: 6 },
          { key: "meditative", label: "Meditative paragraph", kind: "textarea", rows: 5 },
          { key: "close", label: "Sessions paragraph", kind: "textarea", rows: 4 },
          { key: "sectionImage", label: "Section image", kind: "image", help: "Photo beside the article copy." },
        ],
      },
    ],
  },
  meditation: {
    slug: "meditation",
    description: "These fields match the published Nourish Spirit page.",
    sections: [
      {
        heading: "Gather · Learn · Reconnect",
        fields: [
          { key: "eyebrow", label: "Hero eyebrow", kind: "text" },
          { key: "gatherEyebrow", label: "Section eyebrow", kind: "text" },
          { key: "gatherHeading", label: "Section heading", kind: "text" },
          { key: "gatherIntro", label: "Gather intro", kind: "textarea", rows: 4 },
          { key: "gatherMore", label: "Gather second paragraph", kind: "textarea", rows: 4 },
          { key: "experienceHeading", label: "Experiences heading", kind: "text" },
          {
            key: "experienceItems",
            label: "Experiences may include",
            kind: "list",
            rows: 8,
            help: "One item per line.",
          },
        ],
      },
      {
        heading: "Retreats & immersive experiences",
        fields: [
          { key: "retreatsEyebrow", label: "Section eyebrow", kind: "text" },
          { key: "retreatsHeading", label: "Section heading", kind: "text" },
          { key: "retreatsLead", label: "Lead line", kind: "textarea", rows: 2 },
          { key: "retreatsBody", label: "Retreats paragraph", kind: "textarea", rows: 4 },
          { key: "retreatsGreece", label: "Greece paragraph", kind: "textarea", rows: 4 },
          { key: "image1", label: "Photo 1", kind: "image" },
          { key: "image2", label: "Photo 2", kind: "image" },
          { key: "image3", label: "Photo 3", kind: "image" },
        ],
      },
    ],
  },
  experiences: {
    slug: "experiences",
    description:
      "These fields match the published Workshops & Experiences page. The bottom photo strip is managed in the Workshop gallery section.",
    sections: [
      {
        heading: "Workshops intro",
        fields: [
          { key: "intro", label: "Intro paragraph", kind: "textarea", rows: 4 },
          { key: "introMore", label: "Second paragraph", kind: "textarea", rows: 4 },
        ],
      },
      {
        heading: "Experience types",
        groups: [
          {
            key: "experienceSections",
            label: "Sections",
            itemLabel: "Experience",
            fields: [
              { key: "title", label: "Title", kind: "text" },
              { key: "body", label: "Body", kind: "textarea", rows: 4 },
            ],
          },
        ],
      },
      {
        heading: "Group experiences & gallery",
        help: "Gallery photos are added, replaced, and reordered in Workshop gallery below. These fields only edit the strip heading and nearby cards.",
        fields: [
          { key: "groupHeading", label: "Group heading", kind: "text" },
          { key: "groupBody", label: "Group paragraph", kind: "textarea", rows: 4 },
          { key: "galleryEyebrow", label: "Gallery eyebrow", kind: "text" },
          { key: "galleryHeading", label: "Gallery heading", kind: "text" },
          { key: "datesHeading", label: "Calendar card heading", kind: "text" },
          { key: "retreatsHeading", label: "Retreats card heading", kind: "text" },
        ],
      },
    ],
  },
  events: {
    slug: "events",
    description: "These fields match the published Events listing page.",
    sections: [
      {
        heading: "Events intro",
        fields: [{ key: "intro", label: "Intro paragraph", kind: "textarea", rows: 4 }],
      },
    ],
  },
  calendar: {
    slug: "calendar",
    description: "The calendar heading and description come from the hero fields above. This intro is kept in sync.",
    sections: [
      {
        heading: "Calendar intro",
        fields: [{ key: "intro", label: "Intro / description", kind: "textarea", rows: 4 }],
      },
    ],
  },
  book: {
    slug: "book",
    description: "These fields match the published Book a Discovery Call page.",
    sections: [
      {
        heading: "Book page copy",
        fields: [
          { key: "eyebrow", label: "Eyebrow", kind: "text" },
          { key: "heading", label: "Page heading", kind: "text" },
          { key: "lead", label: "Lead line", kind: "textarea", rows: 2 },
          { key: "intro", label: "Intro paragraph", kind: "textarea", rows: 4 },
          { key: "connectTitle", label: "Let's Connect heading", kind: "text" },
          { key: "connectBody", label: "Let's Connect paragraph", kind: "textarea", rows: 3 },
          { key: "insuranceTitle", label: "Insurance heading", kind: "text" },
          { key: "insuranceBody", label: "Insurance paragraph", kind: "textarea", rows: 3 },
          { key: "berryStreetLabel", label: "Berry Street button label", kind: "text" },
          { key: "inquiriesTitle", label: "General inquiries heading", kind: "text" },
          { key: "inquiriesBody", label: "General inquiries paragraph", kind: "textarea", rows: 3 },
          { key: "tagline", label: "Tagline", kind: "text" },
        ],
      },
      {
        heading: "Discovery form",
        fields: [
          { key: "formTitle", label: "Form heading", kind: "text" },
          { key: "formLead", label: "Form lead", kind: "textarea", rows: 2 },
          { key: "formIntro", label: "Form intro", kind: "textarea", rows: 4 },
          { key: "formNote", label: "Form note", kind: "textarea", rows: 3 },
        ],
      },
    ],
  },
  contact: {
    slug: "contact",
    description: "The hero description is the Contact heading area. This intro sits beside the form.",
    sections: [
      {
        heading: "Contact intro",
        fields: [{ key: "intro", label: "Service-area paragraph", kind: "textarea", rows: 4 }],
      },
    ],
  },
  retreats: {
    slug: "retreats",
    description: "These fields match the published Retreats page, including the extra bottom image.",
    sections: [
      {
        heading: "Retreats intro",
        help: "Separate paragraphs with a blank line.",
        fields: [{ key: "intro", label: "Retreats intro", kind: "paragraphs", rows: 6 }],
      },
      {
        heading: "What You May Experience",
        fields: [
          { key: "whatHeading", label: "Section heading", kind: "text" },
          {
            key: "whatItems",
            label: "Experience list",
            kind: "list",
            rows: 8,
            help: "One item per line.",
          },
        ],
      },
      {
        heading: "Rooted in Nature",
        fields: [
          { key: "natureHeading", label: "Section heading", kind: "text" },
          { key: "nature", label: "Nature paragraphs", kind: "paragraphs", rows: 10 },
          { key: "natureImage1", label: "Nature photo 1", kind: "image" },
          { key: "natureImage2", label: "Nature photo 2", kind: "image" },
          {
            key: "bottomImage",
            label: "Bottom image",
            kind: "image",
            help: "Optional extra photo shown under the nature section. Leave empty to hide it.",
          },
        ],
      },
      {
        heading: "Upcoming retreats & mailing list",
        fields: [
          { key: "upcomingHeading", label: "Upcoming heading", kind: "text" },
          { key: "upcomingEmpty", label: "No-dates message", kind: "textarea", rows: 3 },
          { key: "mailingHeading", label: "Mailing list heading", kind: "text" },
          { key: "mailingBody", label: "Mailing list paragraph", kind: "textarea", rows: 3 },
        ],
      },
    ],
  },
  nourish: {
    slug: "nourish",
    description: "These fields match the published Nourish hub (journal, recipes, resources).",
    sections: [
      {
        heading: "Nourish intro",
        fields: [{ key: "description", label: "Intro paragraph", kind: "textarea", rows: 4 }],
      },
      {
        heading: "Journal",
        fields: [
          { key: "insightsHeading", label: "Journal heading", kind: "text" },
          { key: "journalLead", label: "Journal lead", kind: "textarea", rows: 2 },
          { key: "journalBody", label: "Journal paragraph", kind: "textarea", rows: 3 },
          { key: "journalTags", label: "Journal tags", kind: "list", rows: 5, help: "One tag per line." },
        ],
      },
      {
        heading: "Recipes",
        fields: [
          { key: "recipesLead", label: "Recipes heading", kind: "text" },
          { key: "recipesBody", label: "Recipes paragraph", kind: "textarea", rows: 3 },
          { key: "recipeTags", label: "Recipe tags", kind: "list", rows: 6, help: "One tag per line." },
        ],
      },
      {
        heading: "Resources",
        fields: [
          { key: "resourcesHeading", label: "Resources heading", kind: "text" },
          { key: "resourcesBody", label: "Resources paragraph", kind: "textarea", rows: 3 },
        ],
      },
    ],
  },
  "collaborative-care": {
    slug: "collaborative-care",
    description:
      "These fields match the published Collaborative Care intro. Wellness partner cards are managed in the Wellness partners section below.",
    sections: [
      {
        heading: "Collaborative Care intro",
        fields: [
          { key: "eyebrow", label: "Hero eyebrow", kind: "text" },
          {
            key: "body",
            label: "Intro paragraphs",
            kind: "paragraphs",
            rows: 6,
            help: "Separate paragraphs with a blank line.",
          },
        ],
      },
    ],
  },
};

export function getPageTemplate(slug: string) {
  return PAGE_TEMPLATES[slug];
}

function encodeFieldValue(kind: FieldKind, value: unknown) {
  if (kind === "checkbox") {
    return pickBoolean(value, true) ? "on" : "off";
  }
  if (kind === "list" || kind === "paragraphs") {
    const items = Array.isArray(value)
      ? value.map((item) => String(item).trim()).filter(Boolean)
      : typeof value === "string"
        ? [value]
        : [];
    return kind === "paragraphs" ? items.join("\n\n") : items.join("\n");
  }
  return typeof value === "string" ? value : value == null ? "" : String(value);
}

function decodeFieldValue(kind: FieldKind, raw: string) {
  if (kind === "checkbox") {
    return raw === "on";
  }
  if (kind === "list") {
    return raw.split(/\n+/).map((item) => item.trim()).filter(Boolean);
  }
  if (kind === "paragraphs") {
    return raw.split(/\n\n+/).map((item) => item.trim()).filter(Boolean);
  }
  return raw;
}

export function resolveStoredContent(slug: string, raw?: string | null) {
  const stored = parsePageJson(raw);
  const defaults = defaultContentFor(slug);
  if (slug === "retreats") {
    const intro = stored.intro;
    const legacyIntro =
      intro === RETREATS_SUB ||
      (typeof intro === "string" && intro.trim() === RETREATS_SUB) ||
      (Array.isArray(intro) && intro.length === 1 && intro[0] === RETREATS_SUB);
    if (legacyIntro) delete stored.intro;
  }
  if (slug === "home" && isLegacyHeroIntro(typeof stored.intro === "string" ? stored.intro : "")) {
    delete stored.intro;
  }
  return fillMissingContent(stored, defaults);
}

export function getTemplateFormValues(slug: string, raw?: string | null) {
  const resolved = resolveStoredContent(slug, raw);
  const template = getPageTemplate(slug);
  const fields: Record<string, string> = {};
  const groups: Record<string, StringRecord[]> = {};
  if (!template) return { fields, groups };

  for (const section of template.sections) {
    for (const field of section.fields || []) {
      if (field.kind === "image") {
        fields[field.key] = pickText(resolved[field.key], String(defaultContentFor(slug)[field.key] || ""));
        fields[`${field.key}Alt`] = pickText(
          resolved[`${field.key}Alt`],
          String(defaultContentFor(slug)[`${field.key}Alt`] || ""),
        );
      } else {
        fields[field.key] = encodeFieldValue(field.kind, resolved[field.key]);
      }
    }
    for (const group of section.groups || []) {
      const fallback = (defaultContentFor(slug)[group.key] as StringRecord[] | undefined) || [];
      groups[group.key] = pickItems(
        resolved[group.key],
        fallback,
        group.fields.map((field) => field.key),
      );
      if (slug === "nutrition" && group.key === "areas") {
        groups[group.key] = groups[group.key].map((area) => ({
          title: area.title,
          detail: area.detail,
          icon: resolveAreaIconKey(area.title, area.icon),
        }));
      }
    }
  }
  return { fields, groups };
}

export function contentFromFormData(slug: string, formData: FormData, existingRaw: string) {
  const template = getPageTemplate(slug);
  const existing = parsePageJson(existingRaw);
  if (!template) {
    return String(formData.get("content") || existingRaw || "");
  }

  const next: Record<string, unknown> = { ...existing };
  const layoutRaw = formData.get("layout");
  if (typeof layoutRaw === "string" && layoutRaw.trim()) {
    try {
      const parsed = JSON.parse(layoutRaw) as unknown;
      if (parsed && typeof parsed === "object") next.layout = parsed;
    } catch {
      /* keep existing layout */
    }
  }
  for (const section of template.sections) {
    for (const field of section.fields || []) {
      if (field.kind === "image") {
        next[field.key] = String(formData.get(`sec_${field.key}`) || "").trim();
        next[`${field.key}Alt`] = String(formData.get(`sec_${field.key}Alt`) || "").trim();
      } else if (field.kind === "checkbox") {
        next[field.key] = formData.get(`sec_${field.key}`) === "on";
      } else {
        next[field.key] = decodeFieldValue(field.kind, String(formData.get(`sec_${field.key}`) || ""));
      }
    }
    for (const group of section.groups || []) {
      const count = Number(formData.get(`grp_${group.key}_count`) || 0);
      const items: StringRecord[] = [];
      for (let index = 0; index < count; index += 1) {
        const row: StringRecord = {};
        for (const field of group.fields) {
          row[field.key] = String(formData.get(`grp_${group.key}_${index}_${field.key}`) || "").trim();
        }
        if (Object.values(row).some(Boolean)) items.push(row);
      }
      next[group.key] = items;
    }
  }
  if (slug === "collaborative-care") {
    const partners = partnersFromFormData(formData);
    if (partners) next.partners = partners;
  }
  if (slug === "experiences") {
    const gallery = galleryFromFormData(formData);
    if (gallery) next.gallery = gallery;
  }
  if (slug === "home" && next.layout && typeof next.layout === "object" && !Array.isArray(next.layout)) {
    next.layout = { ...(next.layout as Record<string, unknown>), enabled: false };
  }
  return JSON.stringify(next);
}

export function resolveRetreatsContent(raw?: string | null) {
  const content = resolveStoredContent("retreats", raw);
  return {
    intro: pickParagraphs(content.intro, RETREATS_INTRO, [RETREATS_SUB]),
    whatHeading: pickText(content.whatHeading, RETREATS_WHAT_HEADING),
    whatItems: pickList(content.whatItems, RETREATS_WHAT),
    natureHeading: pickText(content.natureHeading, RETREATS_NATURE_HEADING),
    nature: pickParagraphs(content.nature, RETREATS_NATURE),
    natureImage1: pickText(content.natureImage1, SITE_IMAGES.greeceCircle),
    natureImage1Alt: pickText(content.natureImage1Alt, SITE_IMAGES.greeceCircleAlt),
    natureImage2: pickText(content.natureImage2, SITE_IMAGES.wellnessCliff),
    natureImage2Alt: pickText(content.natureImage2Alt, SITE_IMAGES.wellnessCliffAlt),
    bottomImage: pickText(content.bottomImage, ""),
    bottomImageAlt: pickText(content.bottomImageAlt, ""),
    upcomingHeading: pickText(content.upcomingHeading, RETREATS_UPCOMING_HEADING),
    upcomingEmpty: pickText(content.upcomingEmpty, RETREATS_UPCOMING_EMPTY),
    mailingHeading: pickText(content.mailingHeading, RETREATS_MAILING_HEADING),
    mailingBody: pickText(content.mailingBody, RETREATS_MAILING_BODY),
  };
}

export function resolveNutritionContent(raw?: string | null) {
  const content = resolveStoredContent("nutrition", raw);
  const defaults = nutritionContentDefaults();
  return {
    heading: pickText(content.heading, NUTRITION_HEADING),
    intro: pickText(content.intro, NUTRITION_INTRO),
    notAlone: pickText(content.notAlone, NUTRITION_NOT_ALONE),
    approach: pickText(content.approach, NUTRITION_APPROACH),
    foodFirst: pickText(content.foodFirst, NUTRITION_FOOD_FIRST),
    goal: pickText(content.goal, NUTRITION_GOAL),
    closing: pickText(content.closing, NUTRITION_CLOSING),
    cookingImage: pickText(content.cookingImage, NUTRITION_COOKING_IMAGE),
    cookingImageAlt: pickText(content.cookingImageAlt, NUTRITION_COOKING_ALT),
    howEyebrow: pickText(content.howEyebrow, NUTRITION_HOW_EYEBROW),
    howHeading: pickText(content.howHeading, NUTRITION_HOW_HEADING),
    howItWorks: pickItems(content.howItWorks, defaults.howItWorks, ["title", "text"]),
    areasEyebrow: pickText(content.areasEyebrow, NUTRITION_AREAS_EYEBROW),
    areasHeading: pickText(content.areasHeading, NUTRITION_AREAS_HEADING),
    areas: pickItems(content.areas, defaults.areas, ["title", "detail", "icon"]).map((area) => ({
      title: area.title,
      detail: area.detail,
      icon: resolveAreaIconKey(area.title, area.icon),
    })),
  };
}

export function resolveAboutContent(raw?: string | null) {
  const content = resolveStoredContent("about", raw);
  return {
    paragraphs: pickParagraphs(content.paragraphs, ABOUT_PARAGRAPHS),
    credentials: pickList(content.credentials, ABOUT_CREDENTIAL_ITEMS),
    bookNote: pickText(content.bookNote, CHILDRENS_BOOK_NOTE),
    showAmazonButton: pickBoolean(content.showAmazonButton, true),
    amazonButtonLabel: pickText(content.amazonButtonLabel, AMAZON_BOOK_LABEL),
    amazonButtonUrl: pickText(content.amazonButtonUrl, AMAZON_BOOK_URL),
  };
}

export function resolveHomeContent(raw?: string | null) {
  const content = resolveStoredContent("home", raw);
  const intro = pickText(content.intro, HERO_INTRO);
  return {
    intro: isLegacyHeroIntro(intro) ? HERO_INTRO : intro,
    mind: resolvePillarCopy(pickText(content.mind, PILLAR_MIND), PILLAR_MIND),
    body: resolvePillarCopy(pickText(content.body, PILLAR_BODY), PILLAR_BODY),
    spirit: resolvePillarCopy(pickText(content.spirit, PILLAR_SPIRIT), PILLAR_SPIRIT),
    quote: pickText(content.quote, HOME_QUOTE),
    practitioner: pickText(content.practitioner, HOME_PRACTITIONER),
    practitionerMore: pickText(content.practitionerMore, HOME_PRACTITIONER_MORE),
    pillarsEyebrow: pickText(content.pillarsEyebrow, HOME_PILLARS_EYEBROW),
    pillarsHeading: pickText(content.pillarsHeading, HOME_PILLARS_HEADING),
    pillarsSub: pickText(content.pillarsSub, HOME_PILLARS_SUB),
    meetEyebrow: pickText(content.meetEyebrow, HOME_MEET_EYEBROW),
    meetHeading: pickText(content.meetHeading, HOME_MEET_HEADING),
  };
}

export function resolveSoundHealingContent(raw?: string | null) {
  const content = resolveStoredContent("sound-healing", raw);
  return {
    whatHeading: pickText(content.whatHeading, MIND_WHAT_HEADING),
    what: pickText(content.what, MIND_WHAT),
    howHeading: pickText(content.howHeading, MIND_HOW_HEADING),
    how: pickText(content.how, MIND_HOW),
    meditative: pickText(content.meditative, MIND_MEDITATIVE),
    close: pickText(content.close, MIND_SESSIONS),
    sectionImage: pickText(content.sectionImage, SITE_IMAGES.mindBowls),
    sectionImageAlt: pickText(content.sectionImageAlt, SITE_IMAGES.mindBowlsAlt),
  };
}

export function resolveMeditationContent(raw?: string | null) {
  const content = resolveStoredContent("meditation", raw);
  return {
    eyebrow: pickText(content.eyebrow, SPIRIT_EYEBROW),
    gatherEyebrow: pickText(content.gatherEyebrow, SPIRIT_GATHER_EYEBROW),
    gatherHeading: pickText(content.gatherHeading, SPIRIT_GATHER_HEADING),
    gatherIntro: pickText(content.gatherIntro, SPIRIT_GATHER_INTRO),
    gatherMore: pickText(content.gatherMore, SPIRIT_GATHER_MORE),
    experienceHeading: pickText(content.experienceHeading, SPIRIT_EXPERIENCE_HEADING),
    experienceItems: pickList(content.experienceItems, SPIRIT_EXPERIENCE_ITEMS),
    retreatsEyebrow: pickText(content.retreatsEyebrow, SPIRIT_RETREATS_EYEBROW),
    retreatsHeading: pickText(content.retreatsHeading, SPIRIT_RETREATS_HEADING),
    retreatsLead: pickText(content.retreatsLead, SPIRIT_RETREATS_LEAD),
    retreatsBody: pickText(content.retreatsBody, SPIRIT_RETREATS_BODY),
    retreatsGreece: pickText(content.retreatsGreece, SPIRIT_RETREATS_GREECE),
    image1: pickText(content.image1, SITE_IMAGES.spiritSoundbath),
    image1Alt: pickText(content.image1Alt, SITE_IMAGES.spiritSoundbathAlt),
    image2: pickText(content.image2, SITE_IMAGES.greeceCircle),
    image2Alt: pickText(content.image2Alt, SITE_IMAGES.greeceCircleAlt),
    image3: pickText(content.image3, SITE_IMAGES.greeceClose),
    image3Alt: pickText(content.image3Alt, SITE_IMAGES.greeceCloseAlt),
  };
}

export function resolveExperiencesContent(raw?: string | null) {
  const content = resolveStoredContent("experiences", raw);
  const defaults = experiencesContentDefaults();
  return {
    intro: pickText(content.intro, EXPERIENCES_INTRO),
    introMore: pickText(content.introMore, EXPERIENCES_INTRO_MORE),
    experienceSections: pickItems(content.experienceSections, defaults.experienceSections, ["title", "body"]),
    groupHeading: pickText(content.groupHeading, EXPERIENCES_GROUP_HEADING),
    groupBody: pickText(content.groupBody, EXPERIENCES_GROUP_BODY),
    galleryEyebrow: pickText(content.galleryEyebrow, EXPERIENCES_GALLERY_EYEBROW),
    galleryHeading: pickText(content.galleryHeading, EXPERIENCES_GALLERY_HEADING),
    gallery: resolveExperiencesGallery(raw),
    datesHeading: pickText(content.datesHeading, EXPERIENCES_DATES_HEADING),
    retreatsHeading: pickText(content.retreatsHeading, EXPERIENCES_RETREATS_HEADING),
  };
}

export function resolveCollaborativeContent(raw?: string | null) {
  const content = resolveStoredContent("collaborative-care", raw);
  const body = pickParagraphs(content.body, COLLABORATIVE_CARE_PARAGRAPHS);
  const partners = resolveWellnessPartners(raw);
  const first = partners[0];
  return {
    eyebrow: pickText(content.eyebrow, COLLABORATIVE_CARE_EYEBROW),
    paragraphs: body,
    partners,
    partnerName: first?.name || pickText(content.partnerName, COLLABORATIVE_CARE_PARTNER_NAME),
    partnerDetail: first?.detail || pickText(content.partnerDetail, COLLABORATIVE_CARE_PARTNER_DETAIL),
    partnerBody: first?.body || pickParagraphs(content.partnerBody, COLLABORATIVE_CARE_PARTNER_BODY),
    partnerLabel: first?.label || pickText(content.partnerLabel, COLLABORATIVE_CARE_PARTNER_LABEL),
    partnerUrl: first?.url || pickText(content.partnerUrl, COLLABORATIVE_CARE_PARTNER_URL),
  };
}

export function resolveBookContent(raw?: string | null) {
  const content = resolveStoredContent("book", raw);
  return {
    eyebrow: pickText(content.eyebrow, BOOK_EYEBROW),
    heading: pickText(content.heading, BOOK_HEADING),
    lead: pickText(content.lead, BOOK_LEAD),
    intro: pickText(content.intro, BOOK_INTRO),
    connectTitle: pickText(content.connectTitle, BOOK_CONNECT_TITLE),
    connectBody: pickText(content.connectBody, BOOK_CONNECT_BODY),
    insuranceTitle: pickText(content.insuranceTitle, BOOK_INSURANCE_TITLE),
    insuranceBody: pickText(content.insuranceBody, BOOK_INSURANCE_BODY),
    berryStreetLabel: pickText(content.berryStreetLabel, BOOK_BERRY_STREET_LABEL),
    inquiriesTitle: pickText(content.inquiriesTitle, BOOK_INQUIRIES_TITLE),
    inquiriesBody: pickText(content.inquiriesBody, BOOK_INQUIRIES_BODY),
    tagline: pickText(content.tagline, BOOK_TAGLINE),
    formTitle: pickText(content.formTitle, BOOK_FORM_TITLE),
    formLead: pickText(content.formLead, BOOK_FORM_LEAD),
    formIntro: pickText(content.formIntro, BOOK_FORM_INTRO),
    formNote: pickText(content.formNote, BOOK_FORM_NOTE),
  };
}

export function resolveContactContent(raw?: string | null) {
  const content = resolveStoredContent("contact", raw);
  return { intro: pickText(content.intro, CONTACT_SECOND) };
}

export function resolveNourishContent(raw?: string | null) {
  const content = resolveStoredContent("nourish", raw);
  return {
    description: pickText(content.description, NOURISH_DESCRIPTION),
    journalLead: pickText(content.journalLead, NOURISH_JOURNAL_LEAD),
    journalBody: pickText(content.journalBody, NOURISH_JOURNAL_BODY),
    journalTags: pickList(content.journalTags, NOURISH_JOURNAL_TAGS),
    insightsHeading: pickText(content.insightsHeading, NOURISH_INSIGHTS_HEADING),
    recipesLead: pickText(content.recipesLead, NOURISH_RECIPES_LEAD),
    recipesBody: pickText(content.recipesBody, NOURISH_RECIPES_BODY),
    recipeTags: pickList(content.recipeTags, NOURISH_RECIPE_TAGS),
    resourcesHeading: pickText(content.resourcesHeading, NOURISH_RESOURCES_HEADING),
    resourcesBody: pickText(content.resourcesBody, NOURISH_RESOURCES_BODY),
  };
}

export function resolveEventsContent(raw?: string | null) {
  const content = resolveStoredContent("events", raw);
  return { intro: pickText(content.intro, EVENTS_INTRO) };
}
