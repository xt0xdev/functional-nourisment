import { JOURNAL_TOPICS, RECIPE_BRIEF, STARTER_JOURNAL, STARTER_RECIPES } from "./starter-content";
import { slugify } from "./menu";

export type DraftKind = "journal" | "recipe";

export type GeneratedDraft = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  tags: string;
  metaTitle: string;
  metaDescription: string;
  featuredImage: string;
  featuredImageAlt: string;
  source: "ai" | "seed";
};

function fallbackDraft(kind: DraftKind): GeneratedDraft {
  const pool = kind === "recipe" ? STARTER_RECIPES : STARTER_JOURNAL;
  const item = pool[Math.floor(Math.random() * pool.length)];
  return {
    title: `${item.title} (draft)`,
    slug: `${item.slug}-draft-${Date.now().toString().slice(-4)}`,
    excerpt: item.excerpt,
    body: `${item.body}\n\n_This is an unpublished starter draft. Edit freely before publishing._`,
    tags: item.tags,
    metaTitle: item.metaTitle,
    metaDescription: item.metaDescription,
    featuredImage: "featuredImage" in item ? item.featuredImage : "",
    featuredImageAlt: "featuredImageAlt" in item ? item.featuredImageAlt : "",
    source: "seed",
  };
}

function parseModelJson(raw: string): Partial<GeneratedDraft> | null {
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]) as Partial<GeneratedDraft>;
  } catch {
    return null;
  }
}

async function generateWithOpenAI(kind: DraftKind) {
  const topic =
    kind === "recipe"
      ? RECIPE_BRIEF
      : JOURNAL_TOPICS[Math.floor(Math.random() * JOURNAL_TOPICS.length)];
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content:
            "You write unpublished educational drafts for Functional Nourishment, a functional nutrition practice. Voice: warm, evidence-informed, non-dogmatic, no medical diagnosis. Return JSON only with keys title, excerpt, body, tags, metaTitle, metaDescription.",
        },
        {
          role: "user",
          content:
            kind === "recipe"
              ? `Write a complete ${kind} draft. Brief: ${topic}. Body can use markdown with ingredients and method. Tags from: Breakfast, Main Dishes, Snacks, Smoothies, Plant-Forward, Mediterranean, Seasonal.`
              : `Write a journal education draft about ${topic}. Tags from: Nutrition & Health, Mind-Body Wellness, Food & Herbs, Mindful Living, Seasonal Wellness.`,
        },
      ],
    }),
  });
  if (!response.ok) throw new Error("OpenAI request failed");
  const data = (await response.json()) as { choices?: { message?: { content?: string } }[] };
  return parseModelJson(data.choices?.[0]?.message?.content || "");
}

async function generateWithAnthropic(kind: DraftKind) {
  const topic =
    kind === "recipe"
      ? RECIPE_BRIEF
      : JOURNAL_TOPICS[Math.floor(Math.random() * JOURNAL_TOPICS.length)];
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY || "",
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-3-5-haiku-latest",
      max_tokens: 1400,
      messages: [
        {
          role: "user",
          content: `Write an unpublished ${kind} draft for Functional Nourishment. Topic/brief: ${topic}. Return JSON only with keys title, excerpt, body, tags, metaTitle, metaDescription. Warm, evidence-informed, not diagnostic.`,
        },
      ],
    }),
  });
  if (!response.ok) throw new Error("Anthropic request failed");
  const data = (await response.json()) as { content?: { text?: string }[] };
  return parseModelJson(data.content?.[0]?.text || "");
}

export async function generateDraftContent(kind: DraftKind): Promise<GeneratedDraft> {
  try {
    const parsed = process.env.OPENAI_API_KEY
      ? await generateWithOpenAI(kind)
      : process.env.ANTHROPIC_API_KEY
        ? await generateWithAnthropic(kind)
        : null;
    if (!parsed?.title || !parsed.body) return fallbackDraft(kind);
    const title = parsed.title.trim();
    return {
      title,
      slug: slugify(parsed.slug || title) || `draft-${Date.now().toString().slice(-6)}`,
      excerpt: (parsed.excerpt || "").trim(),
      body: `${parsed.body.trim()}\n\n_Unpublished draft — review before publishing. Nothing is auto-posted._`,
      tags: parsed.tags || (kind === "recipe" ? "Mediterranean, Plant-Forward" : "Nutrition & Health"),
      metaTitle: parsed.metaTitle || title,
      metaDescription: parsed.metaDescription || parsed.excerpt || title,
      featuredImage: "",
      featuredImageAlt: "",
      source: "ai",
    };
  } catch {
    return fallbackDraft(kind);
  }
}
