export type LocationFaq = {
  q: string;
  a: string;
};

export type LocationPage = {
  slug: string;
  name: string;
  region: string;
  title: string;
  description: string;
  heading: string;
  intro: string;
  paragraphs: string[];
  neighborhoods: string[];
  faqs: LocationFaq[];
};

export const primaryServiceAreas = [
  {
    slug: "astoria",
    name: "Astoria, NY",
    shortName: "Astoria",
    href: "/locations/astoria",
    summary:
      "Home base in Astoria, NY 11105. Telehealth nutrition for the neighborhood, plus in-person Reiki and sound baths.",
  },
  {
    slug: "queens",
    name: "Queens",
    shortName: "Queens",
    href: "/locations/queens",
    summary:
      "A Queens nutritionist for Astoria, Long Island City, Sunnyside, Jackson Heights, Forest Hills, and beyond.",
  },
  {
    slug: "nyc",
    name: "New York City",
    shortName: "NYC",
    href: "/locations/nyc",
    summary:
      "Remote Medical Nutrition Therapy for all five boroughs, with a local Astoria studio for mind-body care.",
  },
] as const;

export const locations: LocationPage[] = [
  {
    slug: "astoria",
    name: "Astoria",
    region: "Queens, NY",
    title: "Nutritionist in Astoria, NY | Queens & NYC Functional Nutrition",
    description:
      "Anna Almiroudis, MS, CNS is a functional nutritionist in Astoria, NY 11105. Insurance-covered nutrition counseling for Queens and NYC, plus in-person Reiki and sound healing.",
    heading: "A functional nutritionist in Astoria, New York",
    intro:
      "Functional Nourishment is based in Astoria, NY 11105. If you searched for a nutritionist near Ditmars, Steinway, Astoria Boulevard, or Long Island City, you have found a local Queens practice with clinical nutrition and in-person mind-body care.",
    paragraphs: [
      "Nutrition appointments are offered by telehealth, which is convenient if you live in Astoria and want consistent care without leaving home. Reiki and sound bath meditation sessions are available in person in Astoria for clients from Queens and across New York City.",
      "Anna Almiroudis, MS, CNS, LN, CDN specializes in cardiometabolic health, gastrointestinal disorders, weight management, and mental health nutrition. She works with pediatric and adult clients throughout Astoria, Queens, and the NYC metro area.",
      "In-network booking is available through Berry Street for UnitedHealthcare, Aetna, and Blue Cross Blue Shield. Out-of-network clients in Astoria can start with a free 20-minute discovery call.",
      "Neighbors in Ditmars-Steinway, Astoria Heights, and along 30th Avenue or Broadway can use the practice as a local home base, then keep follow-up nutrition visits remote when that is easier. Greek-language care is available for Astoria’s Greek community.",
    ],
    neighborhoods: [
      "Ditmars-Steinway",
      "Astoria Heights",
      "Astoria Boulevard",
      "30th Avenue",
      "Broadway / Steinway",
      "Long Island City",
    ],
    faqs: [
      {
        q: "Is there a nutritionist in Astoria who takes insurance?",
        a: "Yes. Anna Almiroudis accepts UnitedHealthcare, Aetna, and Blue Cross Blue Shield through Berry Street. Nutrition visits are remote; Reiki and sound baths are in person in Astoria.",
      },
      {
        q: "Do I have to come into the Astoria studio for nutrition counseling?",
        a: "No. All Medical Nutrition Therapy appointments are telehealth, so Astoria, Queens, and NYC clients can meet from home. In-person sessions are for Reiki and sound healing.",
      },
    ],
  },
  {
    slug: "queens",
    name: "Queens",
    region: "New York City",
    title: "Nutritionist in Queens, NY | Astoria-Based Functional Nutrition",
    description:
      "See a functional nutritionist serving all of Queens — Astoria, Long Island City, Jackson Heights, Forest Hills, Flushing, and beyond — via telehealth, with local Astoria sound healing.",
    heading: "Nutrition counseling for clients across Queens",
    intro:
      "Queens is one of the most food-rich counties in the country. A Queens nutritionist should honor that — working with your culture, kitchen, and neighborhood — while still delivering evidence-based Medical Nutrition Therapy.",
    paragraphs: [
      "Anna sees clients from across Queens by telehealth from her Astoria practice. Whether you are in Long Island City, Sunnyside, Jackson Heights, Elmhurst, Flushing, Forest Hills, Bayside, or the Rockaways, you can complete a full three-month nutrition program without a midtown commute.",
      "Common reasons Queens clients book include IBS, prediabetes, cholesterol, weight concerns, and stress-related eating. Care is food-first and personalized to the way people actually eat in Queens — from home cooking to neighborhood restaurants.",
      "In-person Reiki and sound healing remain available in Astoria for Queens residents who want a local mind-body session without traveling into Manhattan.",
      "If you have been searching for a nutritionist in Queens, a dietitian near Astoria, or gut-health support in Long Island City, Functional Nourishment is a Queens-based practice built for that search — with citywide NYC remote care as the clinical default.",
    ],
    neighborhoods: [
      "Astoria",
      "Long Island City",
      "Sunnyside",
      "Jackson Heights",
      "Elmhurst",
      "Flushing",
      "Forest Hills",
      "Bayside",
      "The Rockaways",
    ],
    faqs: [
      {
        q: "Do you see clients from all of Queens?",
        a: "Yes. Nutrition counseling is remote, so clients anywhere in Queens — from Astoria and LIC to Flushing, Forest Hills, and the Rockaways — can book the same Medical Nutrition Therapy program.",
      },
      {
        q: "Where are in-person sessions for Queens clients?",
        a: "Reiki and sound bath meditations are offered in person in Astoria. Nutrition visits stay on telehealth.",
      },
    ],
  },
  {
    slug: "nyc",
    name: "New York City",
    region: "Five boroughs",
    title: "Nutritionist in NYC | Astoria & Queens Functional Nutrition",
    description:
      "Looking for a nutritionist in NYC? Anna Almiroudis offers remote Medical Nutrition Therapy for Manhattan, Brooklyn, Queens, the Bronx, and Staten Island, with a home studio in Astoria.",
    heading: "A New York City nutritionist for whole-person care",
    intro:
      "New Yorkers need nutrition care that fits real schedules. Functional Nourishment provides remote Medical Nutrition Therapy across the five boroughs, with a home studio for Reiki and sound baths in Astoria, Queens.",
    paragraphs: [
      "Search results for “nutritionist NYC” often mix coaches, apps, and clinics. Anna is a Certified Nutrition Specialist and New York Certified Dietitian-Nutritionist (CDN) offering clinical Medical Nutrition Therapy from her Astoria, Queens practice.",
      "She supports cardiometabolic health, gastrointestinal disorders, weight management, and mental health nutrition. Programs last at least three months and include a comprehensive intake.",
      "Book with insurance through Berry Street or request a discovery call if you are paying privately. English and Greek language care is available for NYC clients.",
      "Whether you live in Manhattan, Brooklyn, Queens, the Bronx, or Staten Island, follow-up visits stay remote so care survives office days, travel, and late nights. When you want an in-person reset, Astoria is a short trip for sound healing or Reiki.",
    ],
    neighborhoods: ["Manhattan", "Brooklyn", "Queens", "The Bronx", "Staten Island"],
    faqs: [
      {
        q: "Do you take insurance for nutrition counseling in NYC?",
        a: "Yes. UnitedHealthcare, Aetna, and Blue Cross Blue Shield can be booked through Berry Street for New York City clients.",
      },
      {
        q: "Where is the NYC practice located?",
        a: "Functional Nourishment is based in Astoria, Queens. Nutrition visits are remote across NYC. Reiki and sound baths are in person in Astoria.",
      },
    ],
  },
  {
    slug: "manhattan",
    name: "Manhattan",
    region: "New York, NY",
    title: "Nutritionist in Manhattan | Remote MNT from Astoria, Queens",
    description:
      "Manhattan clients can work with Anna Almiroudis by telehealth for diabetes, gut health, weight, and stress nutrition — plus in-person sound healing in Astoria, Queens.",
    heading: "Nutrition support for Manhattan — without the midtown waitlist",
    intro:
      "If you live or work in Manhattan and want a clinically trained NYC nutritionist, telehealth with Functional Nourishment keeps care consistent between office days, travel, and late nights.",
    paragraphs: [
      "Sessions are remote, so you can meet from FiDi, Midtown, the Upper West Side, or Harlem. Plans account for restaurant-heavy weeks, limited kitchen time, and high-stress work.",
      "Anna’s specialties include heart health, blood sugar, IBS, and the food-mood connection. Mind-body add-ons such as meditation coaching and Astoria sound baths are available for Manhattan clients who want to come to Queens.",
      "Use Berry Street to check UnitedHealthcare, Aetna, or Blue Cross Blue Shield coverage, or book a complimentary screening call.",
    ],
    neighborhoods: ["FiDi", "Midtown", "Upper West Side", "Upper East Side", "Harlem", "Downtown"],
    faqs: [
      {
        q: "Can Manhattan clients see you in person?",
        a: "Nutrition visits are telehealth. In-person Reiki and sound baths are offered in Astoria, Queens — a short trip from many Manhattan neighborhoods.",
      },
    ],
  },
  {
    slug: "brooklyn",
    name: "Brooklyn",
    region: "New York City",
    title: "Nutritionist in Brooklyn, NY | Functional Care from Astoria",
    description:
      "Brooklyn residents can access insurance-covered functional nutrition with Anna Almiroudis via telehealth, with optional in-person Reiki in Astoria, Queens.",
    heading: "A functional nutritionist serving Brooklyn",
    intro:
      "From Williamsburg to Bay Ridge, Brooklyn clients use Functional Nourishment for Medical Nutrition Therapy that respects plant-forward cooking, family meals, and busy creative schedules.",
    paragraphs: [
      "All nutrition visits are remote. That makes it simple to stay in care whether you are in Park Slope, Bushwick, Brooklyn Heights, or Flatbush.",
      "Anna works with adults and pediatric clients on gut health, cardiometabolic conditions, weight, and mental health nutrition. No crash diets — only sustainable, evidence-based change.",
      "When you want an in-person reset, Reiki and sound bath sessions are offered across the East River in Astoria, Queens.",
    ],
    neighborhoods: ["Williamsburg", "Park Slope", "Brooklyn Heights", "Bushwick", "Flatbush", "Bay Ridge"],
    faqs: [
      {
        q: "Is nutrition counseling available to all of Brooklyn?",
        a: "Yes. Telehealth Medical Nutrition Therapy is available citywide, including Brooklyn, with optional in-person mind-body sessions in Astoria.",
      },
    ],
  },
  {
    slug: "metro",
    name: "NYC Metro Area",
    region: "NY · NJ · CT",
    title: "Nutritionist for the NYC Metro Area | NY, NJ & CT Telehealth",
    description:
      "Remote nutrition counseling for Long Island, Westchester, Northern New Jersey, and Connecticut with an Astoria, Queens-based Certified Nutrition Specialist.",
    heading: "Nutrition care across the New York metro area",
    intro:
      "The NYC metro area is larger than the five boroughs. If you live on Long Island, in Westchester, in Northern New Jersey, or in nearby Connecticut, you can still work with Anna through telehealth.",
    paragraphs: [
      "Commuter schedules are built into the plan. Evening structure, travel weeks, and family cooking all get addressed during the three-month program.",
      "Clinical focus areas remain the same: cardiometabolic health, GI disorders, weight management, and mental health nutrition, with optional mind-body practices.",
      "Confirm insurance on Berry Street or email functionalnurture@gmail.com to request a discovery call. In-person sound healing is a short trip to Astoria, Queens when you want it.",
    ],
    neighborhoods: ["Long Island", "Westchester", "Northern New Jersey", "Connecticut"],
    faqs: [
      {
        q: "Do you work with clients outside the five boroughs?",
        a: "Yes. Telehealth nutrition counseling is available across the NYC metro area, including Long Island, Westchester, Northern New Jersey, and nearby Connecticut.",
      },
    ],
  },
];

export const locationLinks = locations.map((location) => ({
  href: `/locations/${location.slug}`,
  label: location.name,
}));

export function getLocation(slug: string) {
  return locations.find((location) => location.slug === slug);
}
