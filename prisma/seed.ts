import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  ABOUT_CREDENTIAL_SOUND,
  ABOUT_HERO_SUBHEADING,
  ABOUT_NAME,
  EXPERIENCES_INTRO,
  EXPERIENCES_INTRO_MORE,
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
  PILLAR_BODY,
  PILLAR_MIND,
  PILLAR_SPIRIT,
  SPIRIT_GATHER_INTRO,
  SPIRIT_GATHER_MORE,
  SPIRIT_HERO,
  SPIRIT_RETREATS_BODY,
  SPIRIT_RETREATS_GREECE,
  SPIRIT_RETREATS_LEAD,
  SQUARESPACE_EXPERIENCES,
} from "../src/lib/page-copy";
import { FOOTER_BLURB } from "../src/lib/site-defaults";

const prisma = new PrismaClient();

const settings: Record<string, string> = {
  siteName: "Functional Nourishment",
  practitionerName: "Anna Almiroudis, MS, CNS, LN, CDN, CHHC",
  practitionerShortName: "Anna Almiroudis",
  credentials: "MS, CNS, LN, CDN, CHHC",
  tagline:
    "Optimal health and wellness is not just about the absence of disease — it is an intricate balance of your mental, emotional, spiritual and physical health.",
  email: "functionalnurture@gmail.com",
  phone: "",
  address: "Astoria, NY 11105",
  city: "Astoria",
  region: "NY",
  postalCode: "11105",
  serviceArea:
    "Astoria, Queens, New York City, and New York State telehealth — plus remote care for eligible clients in NJ and CA",
  instagram: "https://www.instagram.com/functional_nourishment/",
  berryStreetUrl: "https://www.berrystreet.co/provider-details/anna-almiroudis",
  stripeUrl: "https://book.stripe.com/dRm7sLewW98h3uTaCo6Zy00",
  paypalUrl: "https://www.paypal.com/ncp/payment/KZSXHPJZ4HCMU",
  insurance:
    "UnitedHealthcare, Aetna, Cigna, Emblem Health, GHI, and Blue Cross Blue Shield. Insurance visits book through Berry Street.",
  bookingNote:
    "Nutrition appointments are conducted by telehealth throughout New York City and New York State. Meditation and sound bath experiences are offered locally.",
  npi: "1326877432",
  languages: "English, Greek",
  footerText: "Anna Almiroudis, MS, CNS, LN, CDN — Functional Nourishment, LLC — Functional-Nourishment.com",
  footerBlurb: FOOTER_BLURB,
  clientPortalUrl: "https://client.practicebetter.io/#/signin",
  bookingUrl: "https://calendly.com/functionalnourishment-krbc/new-meeting",
};

const pages = [
  {
    slug: "home",
    title: "Home",
    metaTitle: "Nutritionist in Astoria, Queens & NYC | Anna Almiroudis, MS, CNS",
    metaDescription:
      "Anna Almiroudis, MS, CNS is a functional nutritionist in Astoria, Queens offering insurance-covered Medical Nutrition Therapy across New York City for gut health, heart health, weight, and mental health.",
    heroHeading: "Nourishing your whole self from the inside out.",
    heroSubheading:
      "Personalized, evidence-based functional nutrition and integrative mind-body practices to support your health and well-being. Based in Astoria, Queens, serving New York City and beyond through telehealth, with meditation and sound bath experiences offered locally.",
    content: JSON.stringify({
      intro:
        "Personalized, evidence-based functional nutrition and integrative mind-body practices to support your health and well-being. Based in Astoria, Queens, serving New York City and beyond through telehealth, with meditation and sound bath experiences offered locally.",
      mind: PILLAR_MIND,
      body: PILLAR_BODY,
      spirit: PILLAR_SPIRIT,
      quote: "True nourishment begins with listening to the body.",
      practitioner:
        "As a board certified nutrition specialist, licensed nutritionist, certified dietitian-nutritionist and certified holistic health coach based in Astoria, Queens, I bridge the gap between clinical science and intuitive wellness for clients across New York City.",
      practitionerMore:
        "My practice is rooted in functional nutrition and medical nutrition therapy, with a whole-person view of health. I consider your bio-individuality, your environment and your emotional well-being together, because lasting change rarely comes from a meal plan alone.",
      support: [
        "Educating, guiding and supporting you with healthy lifestyle and diet practices specific to your health condition so that you feel empowered and in charge of your health.",
        "Using a client-centered, food-first, functional nutrition approach that is tailored to your unique lifestyle and bio-individuality.",
        "Incorporating integrative health modalities such as Reiki, meditation and sound healing to help you increase self-awareness, restore inner balance, and reduce stress.",
        "Offering nutritional counseling, cooking and holistic wellness workshops, sound bath meditations, and private Reiki and sound healing treatments. Anna also teaches cooking and nutrition in schools and community centers and leads corporate wellness workshops.",
      ],
    }),
  },
  {
    slug: "about",
    title: "About",
    metaTitle: "About Anna Almiroudis | Functional Nutritionist in Astoria, NYC",
    metaDescription:
      "Meet Anna Almiroudis, MS, CNS, LN, CDN — a Certified Nutrition Specialist and licensed nutritionist in Astoria, Queens, offering Medical Nutrition Therapy across New York City.",
    heroHeading: ABOUT_NAME,
    heroSubheading: ABOUT_HERO_SUBHEADING,
    content: JSON.stringify({
      paragraphs: [
        `As a Certified Nutritionist Specialist (CNS), Certified Health Coach, Nutrition Educator, Writer, Karuna® and Usui Reiki Master, and ${ABOUT_CREDENTIAL_SOUND}, I bring a uniquely integrative approach to wellness—grounded in science, rooted in nature, and powered by compassion. With advanced training in functional nutrition and a specialization in herbal medicine, I blend evidence-based nutrition with holistic healing practices to support mind-body transformation.`,
        "I specialize in cardiometabolic health, weight management, gastrointestinal disorders, and mental health nutrition. I provide evidence-based Medical Nutrition Therapy (MNT) for individuals with dyslipidemia, hypertension, insulin resistance, prediabetes and diabetes, gut dysbiosis, metabolic syndrome, irritable bowel syndrome (IBS), celiac disease, weight management, and stress induced health outcomes.",
        "My clinical approach integrates functional nutrition and mind-body medicine to identify and address the root causes of health imbalances. By integrating nutrition interventions, lifestyle modifications, and mind-body stress reduction interventions such as Reiki, Sound Healing and Meditation, I help clients restore metabolic balance, improve gut-health, mitigate stress and barriers to their health and wellness goals.",
        "My ultimate goal is to educate, support and empower individuals to improve their health and mental well-being through sustainable, whole-person, personalized care. Whether I am guiding a private client, leading a corporate wellness workshop, teaching a class, or writing, my goal is to create sustainable pathways to health that nourish all aspects of one’s being, mind, body and spirit.",
        "I am especially passionate about the intersection of nutrition and mental health—helping individuals harness the power of food, meditation, self-awareness and energy healing practices to reduce stress, improve mood, resilience, and overall wellbeing.",
        "With over 10 years of experience, my work is deeply plant-powered, personalized, and client-centered. I work with pediatric and adult clients from my Astoria, Queens practice and across New York City, and I offer services in English and Greek.",
      ],
    }),
  },
  {
    slug: "nutrition",
    title: "Nourish Body",
    metaTitle: "Nutritionist in Queens & NYC | Functional Nutrition Counseling",
    metaDescription:
      "Personalized functional nutrition in Astoria, Queens, and across NYC. Three-month Medical Nutrition Therapy for gut health, diabetes, heart health, and weight management.",
    heroHeading: "Nourish Body",
    heroSubheading: NUTRITION_HERO,
    content: JSON.stringify({
      intro: NUTRITION_INTRO,
      notAlone: NUTRITION_NOT_ALONE,
      approach: NUTRITION_APPROACH,
      foodFirst: NUTRITION_FOOD_FIRST,
      goal: NUTRITION_GOAL,
      closing: NUTRITION_CLOSING,
    }),
  },
  {
    slug: "sound-healing",
    title: "Nourish Mind",
    metaTitle: "Sound Healing & Reiki in Astoria, NY | Queens & NYC",
    metaDescription:
      "Sound bath meditations and Reiki in Astoria, Queens. Crystal and Tibetan singing bowls to calm the nervous system, reduce stress, and support mind-body healing.",
    heroHeading: "Nourish Mind",
    heroSubheading: MIND_HERO,
    content: JSON.stringify({
      what: MIND_WHAT,
      how: MIND_HOW,
      meditative: MIND_MEDITATIVE,
      close: MIND_SESSIONS,
    }),
  },
  {
    slug: "meditation",
    title: "Nourish Spirit",
    metaTitle: "Meditation & Breathwork in Astoria, NYC",
    metaDescription:
      "Meditation and breathwork with Anna Almiroudis in Astoria, Queens. Evidence-informed practices to lower stress, improve sleep, and support sustainable lifestyle change.",
    heroHeading: "Nourish Spirit",
    heroSubheading: SPIRIT_HERO,
    content: JSON.stringify({
      gatherIntro: SPIRIT_GATHER_INTRO,
      gatherMore: SPIRIT_GATHER_MORE,
      retreatsLead: SPIRIT_RETREATS_LEAD,
      retreatsBody: SPIRIT_RETREATS_BODY,
      retreatsGreece: SPIRIT_RETREATS_GREECE,
    }),
  },
  {
    slug: "experiences",
    title: "Wellness Experiences",
    metaTitle: "Corporate Wellness Workshops in NYC | Nutrition & Sound Baths",
    metaDescription:
      "Bespoke corporate wellness workshops and small-group experiences in New York City and Queens: food-and-mood cooking classes, sound baths, breathwork, and skin nutrition.",
    heroHeading: "Wellness Experiences",
    heroSubheading:
      "Bespoke corporate wellness workshops and intimate local experiences across New York City, Queens, and Astoria.",
    content: JSON.stringify({
      intro: EXPERIENCES_INTRO,
      introMore: EXPERIENCES_INTRO_MORE,
    }),
  },
  {
    slug: "events",
    title: "Events",
    metaTitle: "Nutrition Workshops & Sound Baths in Astoria, NYC",
    metaDescription:
      "Upcoming nutrition workshops, sound baths, and wellness events with Anna Almiroudis in Astoria, Queens, and the New York City metro area.",
    heroHeading: "Events & Workshops",
    heroSubheading:
      "Join an upcoming class, sound bath, or community wellness gathering in Astoria and New York City.",
    content: JSON.stringify({
      intro:
        "Check back for upcoming cooking classes, sound baths, and community workshops in Astoria and across New York City. Private and corporate bookings are available year-round.",
    }),
  },
  {
    slug: "calendar",
    title: "Calendar",
    metaTitle: "Workshop & Sound Bath Calendar | Functional Nourishment",
    metaDescription:
      "Upcoming workshops and sound bath meditations with Anna Almiroudis. Book and pay online with Stripe or PayPal.",
    heroHeading: "Calendar",
    heroSubheading:
      "Upcoming workshops and sound bath meditations. Reserve your spot with Stripe or PayPal.",
    content: JSON.stringify({
      intro:
        "Join Anna for workshops and sound bath meditations. Browse upcoming dates and pay securely through Stripe or PayPal. Sound Bath Meditations also remain listed on the events page.",
    }),
  },
  {
    slug: "book",
    title: "Book",
    metaTitle: "Book a Nutritionist in Astoria, Queens & NYC",
    metaDescription:
      "Book a free 20-minute discovery call or insurance-covered nutrition counseling with Anna Almiroudis. Remote Medical Nutrition Therapy for Astoria, Queens, and NYC.",
    heroHeading: "Book an Appointment",
    heroSubheading:
      "Remote nutrition counseling for Astoria, Queens, and the NYC metro area, plus in-person Reiki and sound bath sessions in Astoria.",
    content: JSON.stringify({
      paragraphs: [
        "Please note that all nutrition appointments are conducted remotely for clients in Astoria, Queens, and across New York City. I offer in-person Reiki-Sound Bath Meditation sessions in Astoria, NY.",
        "If you are out of network and interested in booking nutritional counseling services, please use the form below to book a free, 20-minute discovery call.",
        "I am currently in network with UnitedHealthcare, Aetna and Blue Cross Blue Shield insurance providers. To book a nutritional counseling appointment through your insurance, please book through Berry Street.",
        "Please email functionalnurture@gmail.com if you have any questions or would like to find out more about my services.",
      ],
    }),
  },
  {
    slug: "contact",
    title: "Contact",
    metaTitle: "Contact a Nutritionist in Astoria, Queens & NYC",
    metaDescription:
      "Contact Anna Almiroudis at Functional Nourishment in Astoria, NY. Remote nutrition care across Queens and New York City. Email functionalnurture@gmail.com.",
    heroHeading: "Contact",
    heroSubheading: "In-person and remote appointments offered in Astoria, Queens, and across the New York City metro area.",
    content: JSON.stringify({
      intro: "In person and remote appointments offered in Astoria, NY. Email: functionalnurture@gmail.com",
    }),
  },
];

const services = [
  {
    slug: "medical-nutrition-therapy",
    title: "Medical Nutrition Therapy",
    excerpt:
      "Evidence-based MNT for cardiometabolic health, diabetes, gut disorders, and weight management.",
    body: "Personalized Medical Nutrition Therapy for dyslipidemia, hypertension, insulin resistance, prediabetes and diabetes, gut dysbiosis, metabolic syndrome, IBS, celiac disease, and stress-related health outcomes. Programs are a minimum of three months and begin with a 90–120 minute intake.",
    icon: "heart-pulse",
    sortOrder: 1,
  },
  {
    slug: "gut-health",
    title: "Gut Health & GI Nutrition",
    excerpt: "Food-first support for IBS, celiac disease, dysbiosis, and digestive comfort.",
    body: "A functional, food-first approach to gastrointestinal disorders that looks at diet, lifestyle, stress, and the gut-brain axis. Care is tailored to your symptoms, labs, and daily life in New York City.",
    icon: "leaf",
    sortOrder: 2,
  },
  {
    slug: "mental-health-nutrition",
    title: "Mental Health Nutrition",
    excerpt: "Nutrition, meditation, and mind-body care for mood, stress, and resilience.",
    body: "Care at the intersection of nutrition and mental health — using food, meditation, self-awareness, and energy healing practices to reduce stress, improve mood, and build resilience.",
    icon: "brain",
    sortOrder: 3,
  },
  {
    slug: "weight-management",
    title: "Weight Management",
    excerpt: "Sustainable, non-diet support — no crash plans or quick fixes.",
    body: "Client-centered weight management that emphasizes nutrient-dense whole foods, mindful eating, and sustainable lifestyle change rather than restrictive fads.",
    icon: "scale",
    sortOrder: 4,
  },
  {
    slug: "reiki-sound",
    title: "Reiki & Sound Healing",
    excerpt: "In-person Reiki and sound bath sessions in Astoria, NY.",
    body: "Private Reiki and sound healing treatments, plus group sound bath meditations, to support relaxation, self-awareness, and nervous system balance.",
    icon: "sparkles",
    sortOrder: 5,
  },
  {
    slug: "corporate-wellness",
    title: "Corporate & Community Workshops",
    excerpt: "Cooking, nutrition, and mind-body workshops for teams, schools, and communities.",
    body: "Bespoke corporate wellness workshops and community classes that blend functional nutrition, culinary experiences, breathwork, meditation, and sound baths.",
    icon: "users",
    sortOrder: 6,
  },
];

const experiences = SQUARESPACE_EXPERIENCES.map((experience) => ({ ...experience }));

const posts = [
  {
    slug: "functional-nutritionist-nyc-what-to-expect",
    title: "What to Expect from a Functional Nutritionist in New York City",
    excerpt:
      "How functional nutrition differs from a quick diet plan — and what Medical Nutrition Therapy looks like for NYC clients.",
    metaTitle: "What to Expect from a Functional Nutritionist in NYC",
    metaDescription:
      "Learn how functional nutrition and Medical Nutrition Therapy work in New York City, including telehealth visits, insurance coverage, and 3-month care plans.",
    body: `If you have been searching for a nutritionist in New York City who looks beyond calorie counting, functional nutrition may be the approach you have been missing.

Functional nutrition asks why symptoms are happening. Instead of handing you a one-size-fits-all meal plan, a Certified Nutrition Specialist evaluates diet, lifestyle, stress, sleep, medications, labs, and your daily environment — including the very real pace of life in the five boroughs.

## A food-first, root-cause process

At Functional Nourishment in Astoria, care begins with a 90–120 minute nutrition intake. We review your history, current eating patterns, and goals, then meet again to walk through your assessment and an individualized plan. Follow-up sessions are 30–60 minutes by telehealth, so clients in Queens, Manhattan, Brooklyn, the Bronx, Long Island, Westchester, and nearby New Jersey can stay consistent without commuting.

Programs last a minimum of three months. Sustainable change rarely happens in a single visit, especially when you are managing IBS, blood sugar, cholesterol, or stress-driven eating.

## Conditions commonly supported

Medical Nutrition Therapy can support dyslipidemia, hypertension, insulin resistance, prediabetes and diabetes, gut dysbiosis, metabolic syndrome, IBS, celiac disease, weight concerns, and stress-related health outcomes.

## Insurance in the NYC metro area

Many New Yorkers can use insurance. Anna Almiroudis, MS, CNS, LN, CDN is in network with UnitedHealthcare, Aetna, and Blue Cross Blue Shield through Berry Street. If you are out of network, a complimentary 20-minute discovery call is a useful first step.

Nutrition appointments are remote. In-person Reiki and sound bath sessions are available in Astoria for clients who want mind-body support alongside nutrition care.`,
  },
  {
    slug: "ibs-gut-health-nutritionist-queens",
    title: "Working with an IBS and Gut Health Nutritionist in Queens",
    excerpt:
      "Practical, food-first strategies for IBS, bloating, and digestive discomfort with a Queens-based functional nutritionist.",
    metaTitle: "IBS & Gut Health Nutritionist in Queens, NYC",
    metaDescription:
      "Find gut-health nutrition support in Queens and Astoria. Functional nutrition for IBS, celiac disease, and dysbiosis with insurance-friendly telehealth care.",
    body: `Living with IBS in New York City can feel like a second job. Between commutes, late dinners, and limited kitchen time, it is easy to cycle through restriction, bloating, and frustration.

A gut-health nutritionist does more than hand you a low-FODMAP printout. The work is to understand your pattern — what flares symptoms, what your schedule actually allows, and how stress is showing up in digestion.

## Why Queens and Astoria clients choose functional nutrition

Anna Almiroudis practices in Astoria and sees clients across Queens and the wider metro area by telehealth. Care is food-first and bio-individual. That means we look at fiber tolerance, meal timing, hydration, movement, sleep, and the gut-brain connection — not just a list of “never eat” foods.

For some people, a structured elimination and reintroduction is useful. For others, the highest-yield change is regular meals, nervous-system support, or addressing dysbiosis with a realistic plan.

## Conditions we commonly see

Irritable bowel syndrome, celiac disease, gut dysbiosis, and stress-induced digestive symptoms are core areas of this practice. Medical Nutrition Therapy is used to create a plan you can live with in Queens — whether you cook at home in Astoria or grab lunch near your office in Long Island City.

## Pairing nutrition with mind-body care

Many clients notice that symptoms worsen during high-stress weeks. That is why packages often include Reiki, meditation, breathwork, or sound healing. These are not replacements for nutrition science. They help the nervous system shift out of fight-or-flight so digestion can do its job.

If you are looking for an IBS nutritionist in Queens who takes a whole-person approach, start with a Berry Street insurance visit or a free discovery call.`,
  },
  {
    slug: "prediabetes-nutrition-counseling-nyc",
    title: "Prediabetes and Cardiometabolic Nutrition Counseling in NYC",
    excerpt:
      "How Medical Nutrition Therapy can support blood sugar, cholesterol, and blood pressure for New Yorkers.",
    metaTitle: "Prediabetes Nutritionist in NYC | Cardiometabolic Care",
    metaDescription:
      "Medical Nutrition Therapy in New York City for prediabetes, diabetes, cholesterol, and metabolic syndrome. Insurance-covered telehealth with a CNS in Astoria.",
    body: `Cardiometabolic health is one of the most common reasons New Yorkers seek a nutritionist. Prediabetes, insulin resistance, high cholesterol, high blood pressure, and metabolic syndrome often travel together — and they respond well to consistent, personalized nutrition care.

## What Medical Nutrition Therapy looks like

Medical Nutrition Therapy (MNT) is clinical nutrition care, not a wellness trend. Sessions focus on your labs, medications, food access, culture, and routine. For a client in Manhattan that might mean strategy for restaurant-heavy weeks. For a family in Brooklyn or the Bronx, it might mean grocery frameworks and simple cooking. For someone in Westchester or Long Island, it might mean evening meal structure after a long commute.

Anna Almiroudis, MS, CNS, LN, CDN provides MNT for dyslipidemia, hypertension, insulin resistance, prediabetes and diabetes, and metabolic syndrome. Plans emphasize nutrient-dense whole foods and antioxidant-rich herbs — without crash diets.

## Why three months matters

Blood sugar and lipid changes are measured over time. A three-month minimum program allows us to assess, implement, adjust, and build habits that survive a New York calendar.

## Using insurance

In-network care is available through Berry Street for UnitedHealthcare, Aetna, and Blue Cross Blue Shield. Ask your plan about nutrition counseling benefits, then book online or reach out for a discovery call if you are paying out of pocket.

Remote visits make it realistic to stay consistent whether you live in Astoria or elsewhere in the NYC metro area.`,
  },
  {
    slug: "food-and-mood-mental-health-nutrition-nyc",
    title: "Food and Mood: Mental Health Nutrition in New York City",
    excerpt:
      "How nutrition, meditation, and sound healing can support stress, mood, and resilience for NYC clients.",
    metaTitle: "Mental Health Nutritionist in NYC | Food, Mood & Stress",
    metaDescription:
      "Mental health nutrition in New York City with Anna Almiroudis. Food-first care plus meditation and sound healing for stress, mood, and emotional eating.",
    body: `New York City asks a lot of the nervous system. Long days, constant stimulation, and irregular meals can quietly reshape mood, sleep, and cravings.

Mental health nutrition looks at that full picture. Food is not a replacement for therapy or medical care, but it is a powerful lever for energy, blood sugar stability, inflammation, and how resilient you feel under stress.

## A whole-person approach

Anna’s work sits at the intersection of nutrition and mental health. Clients learn how meal timing, protein, colorful plants, and caffeine patterns affect mood — then pair those changes with meditation, breathwork, and, when desired, Reiki or sound healing.

Sound healing uses crystal and Tibetan singing bowls, gongs, and drums to support a parasympathetic, rest-and-digest state. Many clients describe leaving a session more aware of the subconscious habits that keep them stuck.

## Who this is for

This work is a fit if you are navigating stress-induced health outcomes, emotional eating, low energy, or you simply want a more grounded relationship with food in a high-pace city.

Workshops such as Balanced Food & Mood bring the same ideas to teams and small groups across NYC — combining a cooking demo with nervous-system tools you can use the same week.

Nutrition visits are remote. In-person sound bath and Reiki sessions are offered in Astoria.`,
  },
  {
    slug: "nutritionist-astoria-insurance-berry-street",
    title: "How to Book a Nutritionist in Astoria Who Takes Insurance",
    excerpt:
      "A clear path to insurance-covered nutrition counseling in Astoria, Queens, and the NYC metro area.",
    metaTitle: "Nutritionist in Astoria, NY Who Takes Insurance",
    metaDescription:
      "Book an in-network nutritionist in Astoria, NY. Anna Almiroudis accepts UnitedHealthcare, Aetna, and Blue Cross Blue Shield through Berry Street.",
    body: `Finding a nutritionist in Astoria who is both clinically trained and in network can take time. Here is the straightforward path.

## Meet the practice

Functional Nourishment is based in Astoria, NY 11105. Anna Almiroudis, MS, CNS, LN, CDN, CHHC is a Certified Nutrition Specialist and New York Certified Dietitian-Nutritionist. She offers remote Medical Nutrition Therapy and in-person Reiki and sound bath sessions in Astoria.

## Insurance currently listed

UnitedHealthcare, Aetna, and Blue Cross Blue Shield can be booked through Berry Street. Berry Street may also surface additional plans such as Cigna, EmblemHealth, and Highmark New York depending on your coverage. Always confirm benefits with your insurer.

## Two ways to start

1. **In network:** Book a nutrition appointment through Berry Street.
2. **Out of network or unsure:** Request a free 20-minute discovery call using the booking form on this site, or email functionalnurture@gmail.com.

Nutrition appointments are telehealth, which is convenient if you live in Astoria, work in Manhattan, or commute from elsewhere in the metro area. Reiki and sound healing can be scheduled in person locally.

If you have been searching “nutritionist near me” in Astoria, Long Island City, Ditmars, or greater Queens, this is a local practice built for exactly that search — with citywide remote care as the clinical default.`,
  },
];

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@functional-nourishment.com";
  const password = process.env.ADMIN_PASSWORD || "NourishAdmin2026!";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, name: "Anna Almiroudis" },
    create: { email, passwordHash, name: "Anna Almiroudis" },
  });

  const preserveKeys = new Set(["clientPortalUrl"]);
  for (const [key, value] of Object.entries(settings)) {
    if (preserveKeys.has(key)) {
      const existing = await prisma.setting.findUnique({ where: { key } });
      if (existing) continue;
    }
    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: page,
      create: { ...page, system: true },
    });
  }

  await prisma.page.updateMany({
    where: { slug: { in: pages.map((page) => page.slug) } },
    data: { system: true },
  });

  await seedMenu();
  await syncCanonicalMenu();
  await renameCommunityToWellness();
  await ensureCalendarMenuItems();
  await ensureServingFooterLinks();

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
  }

  for (const experience of experiences) {
    await prisma.experience.upsert({
      where: { slug: experience.slug },
      update: experience,
      create: experience,
    });
  }

  await seedEvents();
  await seedSampleMedia();

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }

  console.log("Seed complete.");
  console.log(`Admin login: ${email}`);
}

async function syncCanonicalMenu() {
  await prisma.menuItem.updateMany({
    where: { label: { in: ["Events", "Sound Bath Meditations"] } },
    data: { label: "Sound Bath Meditations", href: "/events" },
  });
  await prisma.menuItem.updateMany({
    where: { label: "Client Portal" },
    data: {
      href: "https://client.practicebetter.io/#/signin",
      openInNew: true,
    },
  });
  await prisma.menuItem.updateMany({
    where: { label: { in: ["Book a Discovery Call", "Book Now"] } },
    data: {
      href: "https://calendly.com/functionalnourishment-krbc/new-meeting",
      openInNew: true,
    },
  });
}

async function renameCommunityToWellness() {
  await prisma.menuItem.updateMany({
    where: { label: "Community" },
    data: { label: "Wellness" },
  });
  await prisma.menuItem.updateMany({
    where: { groupName: "Community" },
    data: { groupName: "Wellness" },
  });
}

async function ensureCalendarMenuItems() {
  const existing = await prisma.menuItem.findFirst({
    where: { href: "/calendar" },
  });
  if (existing) {
    await prisma.menuItem.updateMany({
      where: { href: "/calendar", label: { not: "Calendar" } },
      data: { label: "Calendar" },
    });
    return;
  }

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

  const footerCalendar = await prisma.menuItem.findFirst({
    where: { location: "footer", href: "/calendar" },
  });
  if (!footerCalendar) {
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
}

async function seedMenu() {
  const existing = await prisma.menuItem.count();
  if (existing > 0) return;

  const services = await prisma.menuItem.create({
    data: {
      label: "Services",
      href: "",
      location: "header",
      sortOrder: 10,
      style: "link",
    },
  });
  const wellness = await prisma.menuItem.create({
    data: {
      label: "Wellness",
      href: "",
      location: "header",
      sortOrder: 20,
      style: "link",
    },
  });

  const headerChildren = [
    { parentId: services.id, label: "Nourish Mind", href: "/sound-healing", sortOrder: 11 },
    { parentId: services.id, label: "Nourish Body", href: "/nutrition", sortOrder: 12 },
    { parentId: services.id, label: "Nourish Spirit", href: "/meditation", sortOrder: 13 },
    { parentId: wellness.id, label: "Sound Bath Meditations", href: "/events", sortOrder: 21 },
    { parentId: wellness.id, label: "Wellness Experiences", href: "/experiences", sortOrder: 22 },
    { parentId: wellness.id, label: "News", href: "/journal", sortOrder: 23 },
    { parentId: wellness.id, label: "Calendar", href: "/calendar", sortOrder: 24 },
  ];
  for (const item of headerChildren) {
    await prisma.menuItem.create({ data: { ...item, location: "header" } });
  }

  await prisma.menuItem.createMany({
    data: [
      { label: "About", href: "/about", location: "header", sortOrder: 30, style: "link" },
      { label: "Contact", href: "/contact", location: "header", sortOrder: 40, style: "link" },
      { label: "Client Portal", href: "https://client.practicebetter.io/#/signin", location: "header", sortOrder: 50, style: "ghost", openInNew: true },
      { label: "Book a Discovery Call", href: "https://calendly.com/functionalnourishment-krbc/new-meeting", location: "header", sortOrder: 60, style: "cta", openInNew: true },
      { label: "Nourish Mind", href: "/sound-healing", location: "footer", groupName: "Services", sortOrder: 10 },
      { label: "Nourish Body", href: "/nutrition", location: "footer", groupName: "Services", sortOrder: 20 },
      { label: "Nourish Spirit", href: "/meditation", location: "footer", groupName: "Services", sortOrder: 30 },
      { label: "Sound Bath Meditations", href: "/events", location: "footer", groupName: "Wellness", sortOrder: 10 },
      { label: "Calendar", href: "/calendar", location: "footer", groupName: "Wellness", sortOrder: 15 },
      { label: "Wellness Experiences", href: "/experiences", location: "footer", groupName: "Wellness", sortOrder: 20 },
      { label: "News", href: "/journal", location: "footer", groupName: "Wellness", sortOrder: 30 },
      { label: "About", href: "/about", location: "footer", groupName: "Connect", sortOrder: 10 },
      { label: "Contact", href: "/contact", location: "footer", groupName: "Connect", sortOrder: 20 },
      { label: "Book a Discovery Call", href: "https://calendly.com/functionalnourishment-krbc/new-meeting", location: "footer", groupName: "Connect", sortOrder: 30, openInNew: true },
      { label: "Client Portal", href: "https://client.practicebetter.io/#/signin", location: "footer", groupName: "Connect", sortOrder: 40, openInNew: true },
      { label: "Nutritionist in Astoria", href: "/locations/astoria", location: "footer", groupName: "Serving", sortOrder: 10 },
      { label: "Nutritionist in Queens", href: "/locations/queens", location: "footer", groupName: "Serving", sortOrder: 20 },
      { label: "Nutritionist in NYC", href: "/locations/nyc", location: "footer", groupName: "Serving", sortOrder: 30 },
      { label: "Nutritionist in Manhattan", href: "/locations/manhattan", location: "footer", groupName: "Serving", sortOrder: 40 },
      { label: "Nutritionist in Brooklyn", href: "/locations/brooklyn", location: "footer", groupName: "Serving", sortOrder: 50 },
      { label: "NYC Metro Area", href: "/locations/metro", location: "footer", groupName: "Serving", sortOrder: 60 },
      { label: "New York State telehealth", href: "/locations/new-york-state", location: "footer", groupName: "Serving", sortOrder: 70 },
    ],
  });
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function seedEvents() {
  const count = await prisma.event.count();
  if (count === 0) {
    await prisma.event.create({
      data: {
        title: "Private & corporate bookings available",
        slug: "private-corporate-bookings",
        description:
          "No public calendar events are scheduled right now. Email to arrange a private sound bath, cooking class, or corporate wellness workshop in Astoria, Queens, or anywhere in the NYC metro area.",
        location: "Astoria, Queens and remote across NYC",
        stripeUrl: "https://book.stripe.com/dRm7sLewW98h3uTaCo6Zy00",
        paypalUrl: "https://www.paypal.com/ncp/payment/KZSXHPJZ4HCMU",
        published: true,
        sortOrder: 1,
      },
    });
  }

  const events = await prisma.event.findMany();
  const used = new Set(events.map((event) => event.slug).filter(Boolean) as string[]);
  for (const event of events) {
    if (event.slug) continue;
    let slug = slugify(event.title) || `event-${event.id.slice(-6)}`;
    const base = slug;
    let n = 2;
    while (used.has(slug)) slug = `${base}-${n++}`;
    used.add(slug);
    await prisma.event.update({ where: { id: event.id }, data: { slug } });
  }
}

async function seedSampleMedia() {
  const url = "/images/anna-almiroudis.webp";
  const existing = await prisma.media.findFirst({ where: { url } });
  if (existing) return;
  await prisma.media.create({
    data: {
      filename: "anna-almiroudis.webp",
      url,
      mimeType: "image/webp",
      size: 123300,
      alt: "Anna Almiroudis, functional nutritionist in Astoria, Queens",
      caption: "Practitioner portrait",
    },
  });
}

async function ensureServingFooterLinks() {
  const serving = [
    { label: "Nutritionist in Astoria", href: "/locations/astoria", sortOrder: 10 },
    { label: "Nutritionist in Queens", href: "/locations/queens", sortOrder: 20 },
    { label: "Nutritionist in NYC", href: "/locations/nyc", sortOrder: 30 },
    { label: "Nutritionist in Manhattan", href: "/locations/manhattan", sortOrder: 40 },
    { label: "Nutritionist in Brooklyn", href: "/locations/brooklyn", sortOrder: 50 },
    { label: "NYC Metro Area", href: "/locations/metro", sortOrder: 60 },
    { label: "New York State telehealth", href: "/locations/new-york-state", sortOrder: 70 },
  ];

  for (const item of serving) {
    const existing = await prisma.menuItem.findFirst({
      where: { location: "footer", href: item.href },
    });
    if (existing) continue;
    await prisma.menuItem.create({
      data: {
        ...item,
        location: "footer",
        groupName: "Serving",
      },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
