import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

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
  serviceArea: "New York City metro area — Astoria, Queens, Manhattan, Brooklyn, and remote care across NY, NJ, and CT",
  instagram: "https://www.instagram.com/functionalnourishment/",
  berryStreetUrl: "https://www.berrystreet.co/provider-details/anna-almiroudis",
  insurance:
    "UnitedHealthcare, Aetna, and Blue Cross Blue Shield (booked through Berry Street). Additional plans may be available through Berry Street, including Cigna, EmblemHealth, and Highmark New York.",
  bookingNote:
    "All nutrition appointments are conducted remotely. In-person Reiki and sound bath meditation sessions are offered in Astoria, NY.",
  npi: "1326877432",
  languages: "English, Greek",
  footerText: "Functional Nourishment, LLC · Astoria, NY",
  footerBlurb:
    "A whole-person approach to health that combines personalized functional nutrition with integrative mind-body practices to address root causes, restore balance, and support lasting well-being.",
  clientPortalUrl: "https://client.practicebetter.io/#/signin",
  bookingUrl: "https://my.practicebetter.io/#/6a98aeab3815665e47eb56c5/bookings",
};

const pages = [
  {
    slug: "home",
    title: "Home",
    metaTitle: "Functional Nutritionist in NYC | Anna Almiroudis, MS, CNS | Astoria",
    metaDescription:
      "Anna Almiroudis, MS, CNS, LN, CDN is a functional nutritionist in Astoria serving the NYC metro area. Insurance-covered medical nutrition therapy for gut health, cardiometabolic health, weight, and mental health.",
    heroHeading: "Nourishing your whole self from the inside out.",
    heroSubheading:
      "Holistic functional nutrition and mind-body modalities designed to help you find balance, healing, and sustainable vitality.",
    content: JSON.stringify({
      intro:
        "Holistic functional nutrition and mind-body modalities designed to help you find balance, healing, and sustainable vitality.",
      mind: "Sound healing, meditation and breathwork to quiet the nervous system, deepen self-awareness, and restore mental clarity.",
      body: "Functional nutrition counseling and medical nutrition therapy tailored to your biochemistry, lifestyle, and root-cause goals.",
      spirit:
        "Meditation, breathwork and sound bath experiences that reconnect you with purpose, peace, and a sense of inner alignment.",
      quote: "True nourishment begins with listening to the body.",
      practitioner:
        "As a board certified nutrition specialist, licensed nutritionist, certified dietitian-nutritionist and certified holistic health coach based in Astoria, NY, I bridge the gap between clinical science and intuitive wellness.",
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
    metaTitle: "About Anna Almiroudis, MS, CNS | Functional Nutritionist in Astoria, NYC",
    metaDescription:
      "Meet Anna Almiroudis, MS, CNS, LN, CDN, CHHC — a Certified Nutrition Specialist, licensed nutritionist, Reiki Master, and sound bath facilitator serving Astoria and the New York City metro area.",
    heroHeading: "Anna Almiroudis, MS, CNS, LN, CDN, CHHC",
    heroSubheading:
      "Certified Nutrition Specialist, licensed nutritionist, and integrative practitioner serving Astoria and the NYC metro area.",
    content: JSON.stringify({
      paragraphs: [
        "As a Certified Nutritionist Specialist (CNS), Certified Health Coach, Nutrition Educator, Writer, Karuna® and Usui Reiki Master, and Sound Bath & Meditation Facilitator, I bring a uniquely integrative approach to wellness—grounded in science, rooted in nature, and powered by compassion. With advanced training in functional nutrition and a specialization in herbal medicine, I blend evidence-based nutrition with holistic healing practices to support mind-body transformation.",
        "I specialize in cardiometabolic health, weight management, gastrointestinal disorders, and mental health nutrition. I provide evidence-based Medical Nutrition Therapy (MNT) for individuals with dyslipidemia, hypertension, insulin resistance, prediabetes and diabetes, gut dysbiosis, metabolic syndrome, irritable bowel syndrome (IBS), celiac disease, weight management, and stress induced health outcomes.",
        "My clinical approach integrates functional nutrition and mind-body medicine to identify and address the root causes of health imbalances. By integrating nutrition interventions, lifestyle modifications, and mind-body stress reduction interventions such as Reiki, Sound Healing and Meditation, I help clients restore metabolic balance, improve gut-health, mitigate stress and barriers to their health and wellness goals.",
        "My ultimate goal is to educate, support and empower individuals to improve their health and mental well-being through sustainable, whole-person, personalized care. Whether I am guiding a private client, leading a corporate wellness workshop, teaching a class, or writing, my goal is to create sustainable pathways to health that nourish all aspects of one’s being, mind, body and spirit.",
        "I am especially passionate about the intersection of nutrition and mental health—helping individuals harness the power of food, meditation, self-awareness and energy healing practices to reduce stress, improve mood, resilience, and overall wellbeing.",
        "With over 10 years of experience, my work is deeply plant-powered, personalized, and client-centered. I work with pediatric and adult clients across the New York City metro area, and I offer services in English and Greek.",
      ],
    }),
  },
  {
    slug: "nutrition",
    title: "Nourish Body",
    metaTitle: "Functional Nutrition Counseling in NYC | Medical Nutrition Therapy",
    metaDescription:
      "Personalized functional nutrition programs in Astoria and across the NYC metro area. 3-month Medical Nutrition Therapy for gut health, diabetes, heart health, and weight management.",
    heroHeading: "Nourish Body",
    heroSubheading:
      "Evidence-based functional nutrition and Medical Nutrition Therapy for sustainable, whole-person change.",
    content: JSON.stringify({
      questions: [
        "Are you ready to blossom into the best version of yourself but don’t know where to start?",
        "Are you confused by the plethora of dietary theories and health fads out there and seeking sound guidance on what’s best for you and/or your family?",
        "Do you feel like you need endless cups of coffee to get through the day because you are chronically fatigued, drained and unmotivated?",
        "Is a chronic health condition preventing you from enjoying life to the fullest?",
      ],
      paragraphs: [
        "If you answered yes to any of these questions then health and nutritional counseling may be the right fit for you. I strive to support you in your health and wellness goals by inspiring sustainable lifestyle changes to help you achieve your optimal health and wellness. I take a holistic, plant-based, and root-cause approach, recognizing the interplay between your bio-individuality (biology), your environment, and emotional well-being when helping you identify and transform your health and wellness goals into action. I consider each client as a “whole” and recognize that health and wellness is an integrative balance of the physical, mental, social and spiritual aspects of your being.",
        "My goal is to empower you to use self-awareness, mindful eating habits and conscious lifestyle choices to create the changes you want to see in your life. No emphasis on crash diets, quick-fixes or obsessive health fads here. I aim to help you create sustainable, healthy and positive lifestyle changes based on evidence-based, scientific nutritional guidance. I draw from the immense healing power of functional nutrition by promoting the incorporation of nutrient dense, whole foods and herbs to help you look and feel your best from the inside out.",
      ],
      howItWorks: [
        "Wellness isn’t a final destination or something you do once and check off your list. It’s an evolving practice of daily self-care. True power comes from within by connecting with your authentic, higher self. By being in tune with your body through self-awareness, self-love and mindfulness, you can identify what lifestyle habits and dietary behaviors are working and which ones are holding you back.",
        "My functional nutrition programs are a minimum of 3 months long because they are designed for sustainable change. We conduct a thorough assessment of your current diet and lifestyle and identify your goals at our 90–120 minute initial nutrition-intake consultation. We meet again shortly after to go over your nutrition assessment and kick off your individualized plan. We then establish a set schedule of meeting via a telehealth platform for 30 to 60 minute nutrition counseling sessions.",
        "Programs are all-encompassing and cater to both individuals who want to strive for optimal health and clients who need support with chronic health conditions. I work with pediatric and adult clients. In addition to nutritional counseling, clients are educated on healthy lifestyle practices which include guidance on following a nutrient dense diet of whole-foods and antioxidant-rich herbs, stress mitigation and healthy cooking recipes and practices.",
        "We address spiritual and mental health by including Reiki energy balancing, meditation, breathwork and/or sound healing in most packages. Most clients report that their Reiki/Sound healing sessions help them relax and increase self-awareness around identifying subconscious blocks that are preventing them from achieving their health and wellness goals.",
      ],
    }),
  },
  {
    slug: "sound-healing",
    title: "Nourish Mind",
    metaTitle: "Sound Healing & Reiki in Astoria, NY | Functional Nourishment",
    metaDescription:
      "Sound bath meditations and Reiki in Astoria, NY. Crystal and Tibetan singing bowls to calm the nervous system, reduce stress, and support mind-body healing.",
    heroHeading: "Nourish Mind",
    heroSubheading: "Sound healing, Reiki, and nervous-system restoration in Astoria and across NYC.",
    content: JSON.stringify({
      what: "Music, and moving to music, are outlets of human expression that have existed cross-culturally since antiquity. The art of sound healing has also existed across cultures, with various forms used for both religious and spiritual ceremonies (i.e. Tibetan monks use Himalayan/Tibetan singing bowls for spiritual ceremonies) for many centuries. Modern-day sound healing uses various instruments (including but not limited to crystal singing bowls, Tibetan singing bowls, gongs and drums) that create vibrational frequencies that initiate a relaxing, meditative state in the sound bath participants.",
      how: "Similarly to the way breath is used to induce the parasympathetic nervous system during meditation, sound healing uses vibrational frequencies to help activate the parasympathetic nervous system and slow down your breathing and heart rate as you go into a relaxed state. The various frequencies emitted by the singing bowls can also influence brain wave patterns, helping you go into alpha, theta or even delta brainwaves, supporting a restful and relaxed state. Since everything in the universe is in motion and has a vibrational frequency, it is hypothesized that the frequency of the instruments is interacting with both the Biofield (energy field) and physical body, creating effects all the way down to the cellular level. Different singing bowls are tuned to different musical notes or frequencies which are associated with different chakras (energy centers), therefore helping balance your energy field.",
      close:
        "Sound healing therefore offers a mind, body, spirit experience and can be a great stress reducing and relaxing tool both on its own and as part of a Reiki session. I offer Sound Healing as part of my Reiki sessions and during Sound Bath and Reiki Meditations.",
    }),
  },
  {
    slug: "meditation",
    title: "Nourish Spirit",
    metaTitle: "Meditation & Breathwork in Astoria, NYC | Functional Nourishment",
    metaDescription:
      "Meditation and breathwork with Anna Almiroudis in Astoria, NY. Evidence-informed practices to lower stress, improve sleep, and support sustainable lifestyle change.",
    heroHeading: "Nourish Spirit",
    heroSubheading: "Meditation and breathwork as gentle, evidence-informed tools for inner balance.",
    content: JSON.stringify({
      paragraphs: [
        "Meditation is a simple yet powerful mind–body practice that trains your attention and awareness. Through techniques such as focused breathing, guided imagery, or sound-based practices, meditation helps shift the nervous system out of chronic “fight-or-flight” mode and into a more restorative, parasympathetic state.",
        "Regular meditation has been shown to support stress resilience by lowering cortisol levels, improving emotional regulation, enhancing sleep quality, and increasing mental clarity. Over time, this practice helps your body respond to stress more efficiently rather than remaining stuck in a state of overload.",
        "At Functional Nourishment, meditation and breathwork are used as gentle, evidence-informed tools to support nervous system balance, emotional well-being, and sustainable lifestyle change from the inside out.",
      ],
    }),
  },
  {
    slug: "experiences",
    title: "Wellness Experiences",
    metaTitle: "Corporate Wellness Workshops NYC | Nutrition, Sound Baths & Cooking",
    metaDescription:
      "Bespoke corporate wellness workshops and small-group experiences in New York City: food and mood cooking classes, sound baths, breathwork, and skin nutrition workshops.",
    heroHeading: "Wellness Experiences",
    heroSubheading:
      "Bespoke corporate wellness workshops and intimate local experiences across New York City.",
    content: JSON.stringify({
      intro:
        "I offer bespoke corporate wellness workshops, as well as intimate small group and local experiences, that blend functional nutrition and culinary experiences, stress resilience, and immersive mind-body practices, including breathwork, meditation, and sound baths. Each session is thoughtfully designed to restore balance, elevate energy, and provide practical tools for sustained well-being. If you don’t see exactly what you’re looking for, you’re welcome to share your preferences — each experience can be thoughtfully customized to meet your needs.",
    }),
  },
  {
    slug: "events",
    title: "Events",
    metaTitle: "Workshops & Events | Functional Nourishment Astoria, NYC",
    metaDescription:
      "Upcoming nutrition workshops, sound baths, and wellness events with Anna Almiroudis in Astoria and the New York City metro area.",
    heroHeading: "Events & Workshops",
    heroSubheading: "Join an upcoming class, sound bath, or community wellness gathering.",
    content: JSON.stringify({
      intro:
        "Check back for upcoming cooking classes, sound baths, and community workshops. Private and corporate bookings are available year-round.",
    }),
  },
  {
    slug: "book",
    title: "Book",
    metaTitle: "Book a Nutritionist in NYC | Insurance & Discovery Calls",
    metaDescription:
      "Book a free 20-minute discovery call or schedule insurance-covered nutrition counseling with Anna Almiroudis through Berry Street. Remote care for the NYC metro area.",
    heroHeading: "Book an Appointment",
    heroSubheading:
      "Remote nutrition counseling for the NYC metro area, plus in-person Reiki and sound bath sessions in Astoria.",
    content: JSON.stringify({
      paragraphs: [
        "Please note that all nutrition appointments are conducted remotely. I offer in-person Reiki-Sound Bath Meditation sessions in Astoria, NY.",
        "If you are out of network and interested in booking nutritional counseling services, please use the form below to book a free, 20-minute discovery call.",
        "I am currently in network with UnitedHealthcare, Aetna and Blue Cross Blue Shield insurance providers. To book a nutritional counseling appointment through your insurance, please book through Berry Street.",
        "Please email functionalnurture@gmail.com if you have any questions or would like to find out more about my services.",
      ],
    }),
  },
  {
    slug: "contact",
    title: "Contact",
    metaTitle: "Contact a Nutritionist in Astoria, NY | Functional Nourishment",
    metaDescription:
      "Contact Anna Almiroudis at Functional Nourishment in Astoria, NY. In-person and remote appointments. Email functionalnurture@gmail.com.",
    heroHeading: "Contact",
    heroSubheading: "In-person and remote appointments offered in Astoria, NY and across the NYC metro area.",
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

const experiences = [
  {
    slug: "balanced-food-mood",
    title: "Balanced Food & Mood",
    subtitle: "A Holistic Approach to Stress Resilience",
    excerpt:
      "Discover how food, breath, and mindful awareness work together to support a balanced mood and resilient energy. Includes a hands-on cooking demo of a nourishing meal that supports mood.",
    body: "This interactive workshop supports stress resilience through a whole-person approach, integrating breathwork, nutrition, and mindful awareness. Participants will learn simple techniques to regulate the nervous system, explore how balanced nutrition supports energy and mood, and apply these concepts by creating a simple, nourishing mini-meal that supports a balanced mood.",
    sortOrder: 1,
  },
  {
    slug: "reset-restore-reconnect",
    title: "Reset, Restore, Reconnect",
    subtitle: "A Guided Sound & Breath Experience",
    excerpt:
      "Step away from the demands of the day and into a restorative pause. Breathwork, guided meditation, and a soothing sound bath help release tension and reset the nervous system.",
    body: "This immersive group experience invites busy professionals to step out of the constant demands of the day and into a deeply restorative pause. In today’s fast-paced environments, the nervous system often remains in a heightened state of alert. This session offers a calming, intentional space to unwind, release accumulated tension, and reconnect with inner stillness. Participants are gently guided through a sequence of breathwork practices, a calming visualization meditation, and an immersive sound bath using crystal singing bowls and other instruments.",
    sortOrder: 2,
  },
  {
    slug: "nourish-your-skin",
    title: "Nourish Your Skin: Inside and Out",
    subtitle: "An edible beauty cooking class",
    excerpt:
      "An interactive edible beauty cooking class using simple, wholesome ingredients to nourish the body and skin from the inside out.",
    body: "This interactive group experience explores how nutrition and food-derived ingredients can support healthy, radiant skin. The hands-on workshop blends skin nutrition education with a guided DIY skincare activity, giving participants both practical knowledge and a take-home product. Participants learn the fundamentals of skin-supportive nutrients such as antioxidants, healthy fats, hydration, and protein, then create a gentle antioxidant-rich face mask using simple kitchen ingredients.",
    sortOrder: 3,
  },
];

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

  for (const [key, value] of Object.entries(settings)) {
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

  await prisma.event.deleteMany();
  await prisma.event.create({
    data: {
      title: "Private & corporate bookings available",
      description:
        "No public calendar events are scheduled right now. Email to arrange a private sound bath, cooking class, or corporate wellness workshop in the NYC metro area.",
      location: "Astoria, NY and remote",
      published: true,
      sortOrder: 1,
    },
  });

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
    where: { label: "Book a Discovery Call" },
    data: {
      href: "https://my.practicebetter.io/#/6a98aeab3815665e47eb56c5/bookings",
      openInNew: true,
    },
  });
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
  const community = await prisma.menuItem.create({
    data: {
      label: "Community",
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
    { parentId: community.id, label: "Sound Bath Meditations", href: "/events", sortOrder: 21 },
    { parentId: community.id, label: "Wellness Experiences", href: "/experiences", sortOrder: 22 },
    { parentId: community.id, label: "News", href: "/journal", sortOrder: 23 },
  ];
  for (const item of headerChildren) {
    await prisma.menuItem.create({ data: { ...item, location: "header" } });
  }

  await prisma.menuItem.createMany({
    data: [
      { label: "About", href: "/about", location: "header", sortOrder: 30, style: "link" },
      { label: "Contact", href: "/contact", location: "header", sortOrder: 40, style: "link" },
      { label: "Client Portal", href: "https://client.practicebetter.io/#/signin", location: "header", sortOrder: 50, style: "ghost", openInNew: true },
      { label: "Book a Discovery Call", href: "https://my.practicebetter.io/#/6a98aeab3815665e47eb56c5/bookings", location: "header", sortOrder: 60, style: "cta", openInNew: true },
      { label: "Nourish Mind", href: "/sound-healing", location: "footer", groupName: "Services", sortOrder: 10 },
      { label: "Nourish Body", href: "/nutrition", location: "footer", groupName: "Services", sortOrder: 20 },
      { label: "Nourish Spirit", href: "/meditation", location: "footer", groupName: "Services", sortOrder: 30 },
      { label: "Sound Bath Meditations", href: "/events", location: "footer", groupName: "Community", sortOrder: 10 },
      { label: "Wellness Experiences", href: "/experiences", location: "footer", groupName: "Community", sortOrder: 20 },
      { label: "News", href: "/journal", location: "footer", groupName: "Community", sortOrder: 30 },
      { label: "About", href: "/about", location: "footer", groupName: "Connect", sortOrder: 10 },
      { label: "Contact", href: "/contact", location: "footer", groupName: "Connect", sortOrder: 20 },
      { label: "Book a Discovery Call", href: "https://my.practicebetter.io/#/6a98aeab3815665e47eb56c5/bookings", location: "footer", groupName: "Connect", sortOrder: 30, openInNew: true },
      { label: "Client Portal", href: "https://client.practicebetter.io/#/signin", location: "footer", groupName: "Connect", sortOrder: 40, openInNew: true },
    ],
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
