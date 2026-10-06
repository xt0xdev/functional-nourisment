import { PrismaClient } from "@prisma/client";
import {
  ABOUT_CREDENTIALS,
  ABOUT_HERO_SUBHEADING,
  ABOUT_NAME,
  CALENDAR_DESCRIPTION,
  CALENDAR_META_TITLE,
  CALENDAR_TITLE,
  COLLABORATIVE_CARE_META_DESCRIPTION,
  COLLABORATIVE_CARE_META_TITLE,
  COLLABORATIVE_CARE_TITLE,
  BOOK_HEADING,
  BOOK_LEAD,
  BOOK_META_DESCRIPTION,
  CONTACT_HERO,
  CONTACT_SECOND,
  EXPERIENCES_INTRO,
  EXPERIENCES_INTRO_MORE,
  EXPERIENCES_SUB,
  EXPERIENCES_TITLE,
  NOURISH_DESCRIPTION,
  NOURISH_HERO_LINE,
  NOURISH_TITLE,
  RETREATS_INTRO,
  RETREATS_SUB,
  RETREATS_TITLE,
  MIND_HOW,
  MIND_HERO,
  MIND_MEDITATIVE,
  MIND_SESSIONS,
  MIND_WHAT,
  NUTRITION_APPROACH,
  NUTRITION_CLOSING,
  NUTRITION_FOOD_FIRST,
  NUTRITION_GOAL,
  NUTRITION_HERO,
  NUTRITION_INTRO,
  NUTRITION_NOT_ALONE,
  SPIRIT_GATHER_INTRO,
  SPIRIT_GATHER_MORE,
  SPIRIT_HERO,
  SPIRIT_RETREATS_BODY,
  SPIRIT_RETREATS_GREECE,
  SPIRIT_RETREATS_LEAD,
  SQUARESPACE_EXPERIENCES,
  normalizeCredentials,
  withUpdatedSoundCredential,
} from "../src/lib/page-copy";
import {
  DEFAULT_NOTIFY_EMAIL,
  DEFAULT_PUBLIC_EMAIL,
  DEFAULT_SITE_URL,
  FOOTER_BLURB,
  PRACTITIONER_CREDIT,
  isLegacyPublicEmail,
} from "../src/lib/site-defaults";
import { FOOTER_SETTING_DEFAULTS } from "../src/lib/footer-copy";
import { inferEventKind } from "../src/lib/events";
import { SITE_IMAGES, isPractitionerImage, isStockOrEmptyImage } from "../src/lib/site-images";
import { STARTER_JOURNAL, STARTER_RECIPES } from "../src/lib/starter-content";
import { syncLatestNavigation } from "./sync-nav";
import {
  defaultContentFor,
  fillMissingContent,
  parsePageJson,
  retreatsContentDefaults,
} from "../src/lib/page-templates";
import { preserveLayout } from "../src/lib/page-layout";

const prisma = new PrismaClient();

const CALENDLY = "https://calendly.com/functionalnourishment-krbc/new-meeting";
const INSTAGRAM = "https://www.instagram.com/functional_nourishment/";
const STRIPE = "https://book.stripe.com/dRm7sLewW98h3uTaCo6Zy00";
const PAYPAL = "https://www.paypal.com/ncp/payment/KZSXHPJZ4HCMU";
const HOME_INTRO =
  "Personalized, evidence-based functional nutrition and integrative mind-body practices to support your health and well-being. Based in Astoria, Queens, serving New York City and beyond through telehealth, with meditation and sound bath experiences offered locally.";

function isLegacyBooking(value?: string | null) {
  const url = value?.trim().toLowerCase() || "";
  if (!url) return true;
  if (url.includes("berrystreet.co/provider-details")) return true;
  if (url.includes("practicebetter.io") && url.includes("booking")) return true;
  return false;
}

function isLegacyInstagram(value?: string | null) {
  const url = value?.trim().toLowerCase() || "";
  if (!url) return true;
  return url.includes("instagram.com/functionalnourishment") && !url.includes("functional_nourishment");
}

function isLegacyFooter(value?: string | null) {
  const text = value?.trim() || "";
  if (!text) return true;
  return (
    text.includes("A whole-person functional nutrition practice in Astoria, Queens, serving New York City") ||
    text.includes(
      "Personalized, evidence-based functional nutrition rooted in a whole-person approach to health and well-being. Based in Astoria, Queens, serving New York City and New York State through telehealth.",
    )
  );
}

function isLegacyIntro(value?: string | null) {
  const text = value?.trim() || "";
  if (!text) return true;
  return text.includes("Holistic functional nutrition and mind-body care from Astoria, Queens");
}

function isLegacySiteUrl(value?: string | null) {
  const url = value?.trim().toLowerCase() || "";
  if (!url) return true;
  return url.includes("functional-nourishment.com");
}

function isLegacyFooterText(value?: string | null) {
  const text = value?.trim() || "";
  if (!text) return true;
  return /functional-nourishment\.com/i.test(text);
}

function parseJson(raw?: string | null): Record<string, unknown> {
  return parsePageJson(raw);
}

function isBlank(value?: string | null) {
  return !value?.trim();
}

async function upsertSetting(key: string, value: string, shouldWrite: boolean) {
  if (!shouldWrite) return;
  await prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

async function mergePage(
  slug: string,
  data: {
    heroHeading?: string;
    heroSubheading?: string;
    content?: Record<string, unknown>;
  },
) {
  const page = await prisma.page.findUnique({ where: { slug } });
  if (!page) return;
  const existingContent = parseJson(page.content);
  const content = preserveLayout(
    existingContent,
    fillMissingContent(existingContent, {
      ...defaultContentFor(slug),
      ...(data.content || {}),
    }),
  );
  await prisma.page.update({
    where: { slug },
    data: {
      ...(data.heroHeading && isBlank(page.heroHeading) ? { heroHeading: data.heroHeading } : {}),
      ...(data.heroSubheading && isBlank(page.heroSubheading) ? { heroSubheading: data.heroSubheading } : {}),
      content: JSON.stringify(content),
    },
  });
}

async function main() {
  const rows = await prisma.setting.findMany({
    where: {
      key: {
        in: [
          "bookingUrl",
          "instagram",
          "footerBlurb",
          "footerText",
          ...Object.keys(FOOTER_SETTING_DEFAULTS),
          "siteUrl",
          "stripeUrl",
          "paypalUrl",
          "notifyEmail",
          "email",
        ],
      },
    },
  });
  const current = Object.fromEntries(rows.map((row) => [row.key, row.value]));

  await upsertSetting("bookingUrl", CALENDLY, isLegacyBooking(current.bookingUrl));
  await upsertSetting("instagram", INSTAGRAM, isLegacyInstagram(current.instagram));
  await upsertSetting("footerBlurb", FOOTER_BLURB, isLegacyFooter(current.footerBlurb));
  await upsertSetting("footerText", PRACTITIONER_CREDIT, isLegacyFooterText(current.footerText));
  for (const [key, value] of Object.entries(FOOTER_SETTING_DEFAULTS)) {
    if (key === "footerBlurb" || key === "footerText") continue;
    await upsertSetting(key, value, !current[key]?.trim());
  }
  await upsertSetting("siteUrl", DEFAULT_SITE_URL, isLegacySiteUrl(current.siteUrl));
  await upsertSetting("stripeUrl", STRIPE, !current.stripeUrl?.trim());
  await upsertSetting("paypalUrl", PAYPAL, !current.paypalUrl?.trim());
  await upsertSetting("notifyEmail", DEFAULT_NOTIFY_EMAIL, isLegacyPublicEmail(current.notifyEmail));
  await upsertSetting("email", DEFAULT_PUBLIC_EMAIL, isLegacyPublicEmail(current.email));

  const home = await prisma.page.findUnique({ where: { slug: "home" } });
  if (home) {
    const content = parseJson(home.content);
    const intro = typeof content.intro === "string" ? content.intro : "";
    await prisma.page.update({
      where: { slug: "home" },
      data: {
        heroSubheading: isLegacyIntro(home.heroSubheading) ? HOME_INTRO : home.heroSubheading,
        content: JSON.stringify(
          preserveLayout(
            content,
            fillMissingContent(
              {
                ...content,
                intro: isLegacyIntro(intro) ? HOME_INTRO : intro,
              },
              defaultContentFor("home"),
            ),
          ),
        ),
      },
    });
  }

  const about = await prisma.page.findUnique({ where: { slug: "about" } });
  if (about) {
    const content = parseJson(about.content);
    const paragraphs = Array.isArray(content.paragraphs)
      ? (content.paragraphs as string[]).map((paragraph) =>
          normalizeCredentials(
            withUpdatedSoundCredential(paragraph).replace(
              /\bCertified Health Coach\b/g,
              "Certified Integrative Nutrition Health Coach (CINHC)",
            ),
          ),
        )
      : content.paragraphs;
    await prisma.page.update({
      where: { slug: "about" },
      data: {
        heroHeading: ABOUT_NAME,
        heroSubheading: ABOUT_HERO_SUBHEADING,
        content: JSON.stringify(preserveLayout(content, { ...content, paragraphs })),
      },
    });
  }

  await mergePage("nutrition", {
    heroSubheading: NUTRITION_HERO,
    content: {
      intro: NUTRITION_INTRO,
      notAlone: NUTRITION_NOT_ALONE,
      approach: NUTRITION_APPROACH,
      foodFirst: NUTRITION_FOOD_FIRST,
      goal: NUTRITION_GOAL,
      closing: NUTRITION_CLOSING,
    },
  });

  await mergePage("sound-healing", {
    heroSubheading: MIND_HERO,
    content: {
      what: MIND_WHAT,
      how: MIND_HOW,
      meditative: MIND_MEDITATIVE,
      close: MIND_SESSIONS,
    },
  });

  await mergePage("meditation", {
    heroHeading: "Nourish Spirit",
    heroSubheading: SPIRIT_HERO,
    content: {
      gatherIntro: SPIRIT_GATHER_INTRO,
      gatherMore: SPIRIT_GATHER_MORE,
      retreatsLead: SPIRIT_RETREATS_LEAD,
      retreatsBody: SPIRIT_RETREATS_BODY,
      retreatsGreece: SPIRIT_RETREATS_GREECE,
    },
  });

  await mergePage("experiences", {
    heroHeading: EXPERIENCES_TITLE,
    heroSubheading: EXPERIENCES_SUB,
    content: {
      intro: EXPERIENCES_INTRO,
      introMore: EXPERIENCES_INTRO_MORE,
    },
  });

  await mergePage("contact", {
    heroSubheading: CONTACT_HERO,
    content: { intro: CONTACT_SECOND },
  });

  const book = await prisma.page.findUnique({ where: { slug: "book" } });
  if (book) {
    const legacyHeading =
      !book.heroHeading.trim() ||
      book.heroHeading === "Book an Appointment" ||
      book.heroHeading === "Book";
    await prisma.page.update({
      where: { slug: "book" },
      data: {
        heroHeading: legacyHeading ? BOOK_HEADING : book.heroHeading,
        heroSubheading: book.heroSubheading.includes("Remote nutrition counseling")
          ? BOOK_LEAD
          : book.heroSubheading || BOOK_LEAD,
        metaDescription: book.metaDescription.includes("insurance-covered nutrition counseling")
          ? BOOK_META_DESCRIPTION
          : book.metaDescription,
        ...(isStockOrEmptyImage(book.heroImage) || isPractitionerImage(book.heroImage)
          ? { heroImage: SITE_IMAGES.bodyBowl, heroImageAlt: SITE_IMAGES.bodyBowlAlt }
          : {}),
      },
    });
  }

  const retreats = await prisma.page.findUnique({ where: { slug: "retreats" } });
  const retreatsDefaults = retreatsContentDefaults();
  if (!retreats) {
    await prisma.page.create({
      data: {
        slug: "retreats",
        title: RETREATS_TITLE,
        metaTitle: "Retreats | Functional Nourishment",
        metaDescription: RETREATS_SUB,
        heroHeading: RETREATS_TITLE,
        heroSubheading: RETREATS_SUB,
        heroImage: SITE_IMAGES.spiritSoundbath,
        heroImageAlt: SITE_IMAGES.spiritSoundbathAlt,
        content: JSON.stringify(retreatsDefaults),
        system: true,
        published: true,
      },
    });
  } else {
    const content = parseJson(retreats.content);
    const intro = content.intro;
    const legacyIntro =
      intro === RETREATS_SUB ||
      (typeof intro === "string" && intro.trim() === RETREATS_SUB) ||
      (Array.isArray(intro) && intro.length === 1 && intro[0] === RETREATS_SUB);
    if (legacyIntro) delete content.intro;
    await prisma.page.update({
      where: { slug: "retreats" },
      data: {
        content: JSON.stringify(
          preserveLayout(
            content,
            fillMissingContent(
              {
                ...content,
                ...(legacyIntro ? { intro: [...RETREATS_INTRO] } : {}),
              },
              retreatsDefaults,
            ),
          ),
        ),
      },
    });
  }

  const nourish = await prisma.page.findUnique({ where: { slug: "nourish" } });
  if (!nourish) {
    await prisma.page.create({
      data: {
        slug: "nourish",
        title: NOURISH_TITLE,
        metaTitle: "Nourish | Journal, Recipes & Resources",
        metaDescription: NOURISH_DESCRIPTION,
        heroHeading: NOURISH_TITLE,
        heroSubheading: NOURISH_HERO_LINE,
        heroImage: SITE_IMAGES.bodyBowl,
        heroImageAlt: SITE_IMAGES.bodyBowlAlt,
        content: JSON.stringify(defaultContentFor("nourish")),
        system: true,
        published: true,
      },
    });
  }

  await prisma.page.deleteMany({
    where: {
      OR: [
        { slug: "seasonal-reset" },
        { slug: { equals: "seasonal-reset", mode: "insensitive" } },
        { title: { equals: "Seasonal Reset", mode: "insensitive" } },
      ],
    },
  });

  const collaborative = await prisma.page.findUnique({ where: { slug: "collaborative-care" } });
  if (!collaborative) {
    await prisma.page.create({
      data: {
        slug: "collaborative-care",
        title: COLLABORATIVE_CARE_TITLE,
        metaTitle: COLLABORATIVE_CARE_META_TITLE,
        metaDescription: COLLABORATIVE_CARE_META_DESCRIPTION,
        heroHeading: COLLABORATIVE_CARE_TITLE,
        heroSubheading: COLLABORATIVE_CARE_META_DESCRIPTION,
        heroImage: SITE_IMAGES.wellnessDining,
        heroImageAlt: SITE_IMAGES.wellnessDiningAlt,
        content: JSON.stringify(defaultContentFor("collaborative-care")),
        system: true,
        published: true,
      },
    });
  } else {
    await prisma.page.update({
      where: { slug: "collaborative-care" },
      data: {
        system: true,
        published: true,
        content: JSON.stringify(
          preserveLayout(
            parseJson(collaborative.content),
            fillMissingContent(parseJson(collaborative.content), defaultContentFor("collaborative-care")),
          ),
        ),
      },
    });
  }

  for (const key of ["practitionerName", "credentials"] as const) {
    const row = await prisma.setting.findUnique({ where: { key } });
    if (!row) {
      await prisma.setting.create({
        data: {
          key,
          value: key === "credentials" ? ABOUT_CREDENTIALS : `${ABOUT_NAME}, ${ABOUT_CREDENTIALS}`,
        },
      });
      continue;
    }
    if (row.value.includes("CHHC")) {
      await prisma.setting.update({
        where: { key },
        data: { value: normalizeCredentials(row.value) },
      });
    }
  }

  const imageUpdates: Record<string, { image: string; alt: string }> = {
    home: { image: SITE_IMAGES.landingHero, alt: SITE_IMAGES.landingHeroAlt },
    nutrition: { image: SITE_IMAGES.bodyBowl, alt: SITE_IMAGES.bodyBowlAlt },
    "sound-healing": { image: SITE_IMAGES.mindMeditation, alt: SITE_IMAGES.mindMeditationAlt },
    meditation: { image: SITE_IMAGES.spiritSoundbath, alt: SITE_IMAGES.spiritSoundbathAlt },
    experiences: { image: SITE_IMAGES.wellnessYoga, alt: SITE_IMAGES.wellnessYogaAlt },
    contact: { image: SITE_IMAGES.landingMeet, alt: SITE_IMAGES.landingMeetAlt },
    book: { image: SITE_IMAGES.bodyBowl, alt: SITE_IMAGES.bodyBowlAlt },
  };
  for (const [slug, next] of Object.entries(imageUpdates)) {
    const page = await prisma.page.findUnique({ where: { slug } });
    if (!page) continue;
    const replaceBookPortrait = slug === "book" && isPractitionerImage(page.heroImage);
    if (!isStockOrEmptyImage(page.heroImage) && !replaceBookPortrait) continue;
    await prisma.page.update({
      where: { slug },
      data: { heroImage: next.image, heroImageAlt: next.alt },
    });
  }

  for (const experience of SQUARESPACE_EXPERIENCES) {
    await prisma.experience.upsert({
      where: { slug: experience.slug },
      update: {
        title: experience.title,
        subtitle: experience.subtitle,
        excerpt: experience.excerpt,
        body: experience.body,
        sortOrder: experience.sortOrder,
        published: true,
      },
      create: { ...experience, published: true },
    });
  }

  await prisma.menuItem.updateMany({
    where: { label: "Community" },
    data: { label: "Wellness" },
  });
  await prisma.menuItem.updateMany({
    where: { groupName: "Community" },
    data: { groupName: "Wellness" },
  });
  await prisma.menuItem.updateMany({
    where: { label: { in: ["Book a Discovery Call", "Book Now"] } },
    data: {
      href: "/book",
      openInNew: false,
    },
  });

  await syncLatestNavigation(prisma);

  for (const post of STARTER_JOURNAL) {
    const existing = await prisma.post.findUnique({ where: { slug: post.slug } });
    if (existing) continue;
    await prisma.post.create({
      data: { ...post, kind: "journal", published: true },
    });
  }
  for (const post of STARTER_RECIPES) {
    const existing = await prisma.post.findUnique({ where: { slug: post.slug } });
    if (existing) continue;
    await prisma.post.create({
      data: { ...post, kind: "recipe", published: true },
    });
  }

  const calendarExists = await prisma.menuItem.findFirst({ where: { href: "/calendar" } });
  if (!calendarExists) {
    const wellnessParent = await prisma.menuItem.findFirst({
      where: { location: "header", parentId: null, label: "Wellness" },
    });
    if (wellnessParent) {
      await prisma.menuItem.create({
        data: {
          parentId: wellnessParent.id,
          label: "Calendar",
          href: "/calendar",
          location: "header",
          sortOrder: 24,
        },
      });
    }
    await prisma.menuItem.create({
      data: {
        label: "Calendar",
        href: "/calendar",
        location: "footer",
        groupName: "Wellness",
        sortOrder: 15,
      },
    });
  }

  await prisma.menuItem.updateMany({
    where: { href: "/locations/new-york-state" },
    data: { label: "New York State Telehealth" },
  });
  const nys = await prisma.menuItem.findFirst({
    where: { location: "footer", href: "/locations/new-york-state" },
  });
  if (!nys) {
    await prisma.menuItem.create({
      data: {
        label: "New York State Telehealth",
        href: "/locations/new-york-state",
        location: "footer",
        groupName: "Serving",
        sortOrder: 70,
      },
    });
  }

  const calendarPage = await prisma.page.findUnique({ where: { slug: "calendar" } });
  if (!calendarPage) {
    await prisma.page.create({
      data: {
        slug: "calendar",
        title: CALENDAR_TITLE,
        metaTitle: CALENDAR_META_TITLE,
        metaDescription: CALENDAR_DESCRIPTION,
        heroHeading: CALENDAR_TITLE,
        heroSubheading: CALENDAR_DESCRIPTION,
        content: JSON.stringify(defaultContentFor("calendar")),
        system: true,
        published: true,
      },
    });
  } else {
    await prisma.page.update({
      where: { slug: "calendar" },
      data: {
        metaTitle: calendarPage.metaTitle || CALENDAR_META_TITLE,
        metaDescription: calendarPage.metaDescription || CALENDAR_DESCRIPTION,
        heroHeading: calendarPage.heroHeading || CALENDAR_TITLE,
        heroSubheading: calendarPage.heroSubheading || CALENDAR_DESCRIPTION,
        content: JSON.stringify(
          preserveLayout(
            parseJson(calendarPage.content),
            fillMissingContent(parseJson(calendarPage.content), defaultContentFor("calendar")),
          ),
        ),
      },
    });
  }

  const events = await prisma.event.findMany({ select: { id: true, title: true, description: true, kind: true } });
  for (const event of events) {
    const inferred = inferEventKind(event);
    if (event.kind !== inferred) {
      await prisma.event.update({ where: { id: event.id }, data: { kind: inferred } });
    }
  }

  console.log("Targeted site-update sync complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
