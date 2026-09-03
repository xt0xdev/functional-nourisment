export type LocationPage = {
  slug: string;
  name: string;
  region: string;
  title: string;
  description: string;
  heading: string;
  intro: string;
  paragraphs: string[];
};

export const locations: LocationPage[] = [
  {
    slug: "astoria",
    name: "Astoria",
    region: "Queens, NY",
    title: "Nutritionist in Astoria, NY | Functional Nourishment",
    description:
      "Anna Almiroudis is a Certified Nutrition Specialist in Astoria, NY 11105 offering insurance-covered nutrition counseling, Reiki, and sound healing.",
    heading: "A functional nutritionist in Astoria, New York",
    intro:
      "Functional Nourishment is based in Astoria, NY 11105. If you searched for a nutritionist near Ditmars, Steinway, or Long Island City, you have found a local practice with clinical nutrition and in-person mind-body care.",
    paragraphs: [
      "Nutrition appointments are offered by telehealth, which is convenient if you live in Astoria and want consistent care without leaving home. Reiki and sound bath meditation sessions are available in person in Astoria.",
      "Anna Almiroudis, MS, CNS, LN, CDN specializes in cardiometabolic health, gastrointestinal disorders, weight management, and mental health nutrition. She works with pediatric and adult clients.",
      "In-network booking is available through Berry Street for UnitedHealthcare, Aetna, and Blue Cross Blue Shield. Out-of-network clients can start with a free 20-minute discovery call.",
    ],
  },
  {
    slug: "queens",
    name: "Queens",
    region: "New York City",
    title: "Nutritionist in Queens, NY | Gut Health & MNT",
    description:
      "See a functional nutritionist serving all of Queens — Astoria, Long Island City, Jackson Heights, Forest Hills, and beyond — via telehealth and local Astoria sessions.",
    heading: "Nutrition counseling for clients across Queens",
    intro:
      "Queens is one of the most food-rich counties in the country. A Queens nutritionist should honor that — working with your culture, kitchen, and neighborhood — while still delivering evidence-based Medical Nutrition Therapy.",
    paragraphs: [
      "Anna sees clients from across Queens by telehealth from her Astoria practice. Whether you are in Long Island City, Sunnyside, Jackson Heights, Flushing, Forest Hills, or the Rockaways, you can complete a full three-month nutrition program without a midtown commute.",
      "Common reasons Queens clients book include IBS, prediabetes, cholesterol, weight concerns, and stress-related eating. Care is food-first and personalized.",
      "In-person Reiki and sound healing remain available in Astoria for Queens residents who want a local mind-body session.",
    ],
  },
  {
    slug: "nyc",
    name: "New York City",
    region: "Five boroughs",
    title: "Nutritionist in NYC | Functional Nutrition & Insurance",
    description:
      "Looking for a nutritionist in NYC? Anna Almiroudis offers remote Medical Nutrition Therapy for Manhattan, Brooklyn, Queens, the Bronx, and Staten Island.",
    heading: "A New York City nutritionist for whole-person care",
    intro:
      "New Yorkers need nutrition care that fits real schedules. Functional Nourishment provides remote Medical Nutrition Therapy across the five boroughs, with a home studio for Reiki and sound baths in Astoria.",
    paragraphs: [
      "Search results for “nutritionist NYC” often mix coaches, apps, and clinics. Anna is a Certified Nutrition Specialist and New York Certified Dietitian-Nutritionist (CDN) offering clinical Medical Nutrition Therapy.",
      "She supports cardiometabolic health, gastrointestinal disorders, weight management, and mental health nutrition. Programs last at least three months and include a comprehensive intake.",
      "Book with insurance through Berry Street or request a discovery call if you are paying privately. English and Greek language care is available.",
    ],
  },
  {
    slug: "manhattan",
    name: "Manhattan",
    region: "New York, NY",
    title: "Nutritionist in Manhattan | Remote MNT from a NYC CNS",
    description:
      "Manhattan clients can work with Anna Almiroudis by telehealth for diabetes, gut health, weight, and stress nutrition — plus in-person sound healing in Astoria.",
    heading: "Nutrition support for Manhattan — without the midtown waitlist",
    intro:
      "If you live or work in Manhattan and want a clinically trained nutritionist, telehealth with Functional Nourishment keeps care consistent between office days, travel, and late nights.",
    paragraphs: [
      "Sessions are remote, so you can meet from FiDi, Midtown, the Upper West Side, or Harlem. Plans account for restaurant-heavy weeks, limited kitchen time, and high-stress work.",
      "Anna’s specialties include heart health, blood sugar, IBS, and the food-mood connection. Mind-body add-ons such as meditation coaching and Astoria sound baths are available.",
      "Use Berry Street to check UnitedHealthcare, Aetna, or Blue Cross Blue Shield coverage, or book a complimentary screening call.",
    ],
  },
  {
    slug: "brooklyn",
    name: "Brooklyn",
    region: "New York City",
    title: "Nutritionist in Brooklyn, NY | Functional & Holistic Care",
    description:
      "Brooklyn residents can access insurance-covered functional nutrition with Anna Almiroudis via telehealth, with optional in-person Reiki in Astoria.",
    heading: "A functional nutritionist serving Brooklyn",
    intro:
      "From Williamsburg to Bay Ridge, Brooklyn clients use Functional Nourishment for Medical Nutrition Therapy that respects plant-forward cooking, family meals, and busy creative schedules.",
    paragraphs: [
      "All nutrition visits are remote. That makes it simple to stay in care whether you are in Park Slope, Bushwick, Brooklyn Heights, or Flatbush.",
      "Anna works with adults and pediatric clients on gut health, cardiometabolic conditions, weight, and mental health nutrition. No crash diets — only sustainable, evidence-based change.",
      "When you want an in-person reset, Reiki and sound bath sessions are offered across the East River in Astoria.",
    ],
  },
  {
    slug: "metro",
    name: "NYC Metro Area",
    region: "NY · NJ · CT",
    title: "Nutritionist for the NYC Metro Area | NY, NJ & CT Telehealth",
    description:
      "Remote nutrition counseling for Long Island, Westchester, Northern New Jersey, and Connecticut with an Astoria-based Certified Nutrition Specialist.",
    heading: "Nutrition care across the New York metro area",
    intro:
      "The NYC metro area is larger than the five boroughs. If you live on Long Island, in Westchester, in Northern New Jersey, or in nearby Connecticut, you can still work with Anna through telehealth.",
    paragraphs: [
      "Commuter schedules are built into the plan. Evening structure, travel weeks, and family cooking all get addressed during the three-month program.",
      "Clinical focus areas remain the same: cardiometabolic health, GI disorders, weight management, and mental health nutrition, with optional mind-body practices.",
      "Confirm insurance on Berry Street or email functionalnurture@gmail.com to request a discovery call. In-person sound healing is a short trip to Astoria when you want it.",
    ],
  },
];

export function getLocation(slug: string) {
  return locations.find((location) => location.slug === slug);
}
