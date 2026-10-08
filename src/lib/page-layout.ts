import { SITE_IMAGES } from "./site-images";
import {
  parsePageJson,
  resolveAboutContent,
  resolveBookContent,
  resolveCollaborativeContent,
  resolveExperiencesContent,
  resolveHomeContent,
  resolveMeditationContent,
  resolveNourishContent,
  resolveNutritionContent,
  resolveRetreatsContent,
  resolveSoundHealingContent,
  resolveStoredContent,
} from "./page-templates";

export const LAYOUT_VERSION = 1;
/** Designer coordinate space for x/w percentages and snap math. Not the live page width. */
export const CANVAS_WIDTH = 960;
/**
 * Public content well — same rail as PageHero, Header, Footer, and Credentials.
 * Tailwind `max-w-6xl` (72rem) with `px-4 md:px-6`.
 */
export const SITE_CONTENT_CLASS = "mx-auto max-w-6xl px-4 md:px-6";
export const MIN_BLOCK_WIDTH_PCT = 8;
export const MIN_BLOCK_HEIGHT = 40;

export type LayoutBlockType = "text" | "heading" | "quote" | "image" | "button";
export type LayoutWrap = "none" | "left" | "right" | "full";
export type LayoutImageFit = "contain" | "cover" | "circle";
export type LayoutButtonStyle = "outline" | "primary" | "link";

export type LayoutBlock = {
  id: string;
  type: LayoutBlockType;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  wrap: LayoutWrap;
  html?: string;
  src?: string;
  alt?: string;
  caption?: string;
  fit?: LayoutImageFit;
  label?: string;
  href?: string;
  style?: LayoutButtonStyle;
};

export type PageLayout = {
  version: typeof LAYOUT_VERSION;
  enabled: boolean;
  canvasHeight: number;
  blocks: LayoutBlock[];
  seededButton?: boolean;
};

const WRAP_VALUES: LayoutWrap[] = ["none", "left", "right", "full"];
const TYPE_VALUES: LayoutBlockType[] = ["text", "heading", "quote", "image", "button"];
const FIT_VALUES: LayoutImageFit[] = ["contain", "cover", "circle"];
const BUTTON_STYLE_VALUES: LayoutButtonStyle[] = ["outline", "primary", "link"];

export function imageFit(block: Pick<LayoutBlock, "fit">): LayoutImageFit {
  return FIT_VALUES.includes(block.fit as LayoutImageFit) ? (block.fit as LayoutImageFit) : "contain";
}

/** Visible caption only — never fall back to alt text. */
export function imageCaption(block: Pick<LayoutBlock, "caption">) {
  return typeof block.caption === "string" ? block.caption.trim() : "";
}

export function buttonStyle(block: Pick<LayoutBlock, "style"> | LayoutButtonStyle | undefined): LayoutButtonStyle {
  const value = typeof block === "string" || !block ? block : block.style;
  return BUTTON_STYLE_VALUES.includes(value as LayoutButtonStyle) ? (value as LayoutButtonStyle) : "outline";
}

export function sanitizeLayoutHref(href?: string) {
  const trimmed = (href || "").trim();
  if (!trimmed) return "";
  if (/^(javascript|data|vbscript):/i.test(trimmed)) return "";
  return trimmed;
}

export function buttonLinkProps(href?: string) {
  const safe = sanitizeLayoutHref(href);
  if (/^https?:\/\//i.test(safe)) {
    return { href: safe, target: "_blank" as const, rel: "noreferrer" };
  }
  return { href: safe };
}

export function layoutButtonClass(style?: LayoutButtonStyle | string) {
  const resolved = buttonStyle(style as LayoutButtonStyle);
  if (resolved === "primary") return "btn-primary no-underline";
  if (resolved === "link") return "text-teal underline-offset-4 hover:underline";
  return "btn-outline no-underline";
}

export function layoutButtonLabel(block: Pick<LayoutBlock, "label">) {
  return typeof block.label === "string" ? block.label.trim() : "";
}

export function isButtonBlock(block: Pick<LayoutBlock, "type">) {
  return block.type === "button";
}

export function newLayoutId() {
  return `b_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}

export function escapeLayoutText(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function paragraphHtml(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return "<p></p>";
  return `<p>${escapeLayoutText(trimmed).replace(/\n/g, "<br />")}</p>`;
}

export function listHtml(items: readonly string[]) {
  const rows = items.map((item) => `<li>${escapeLayoutText(item)}</li>`).join("");
  return `<ul>${rows}</ul>`;
}

export function sanitizeLayoutHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/<\/?(?!\/?(p|br|strong|em|b|i|u|a|ul|ol|li|h2|h3|blockquote|span)\b)[^>]*>/gi, "");
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function emptyLayout(enabled = false): PageLayout {
  return { version: LAYOUT_VERSION, enabled, canvasHeight: 640, blocks: [] };
}

function asNumber(value: unknown, fallback: number) {
  const next = typeof value === "number" ? value : Number(value);
  return Number.isFinite(next) ? next : fallback;
}

export function normalizeBlock(raw: unknown, index = 0): LayoutBlock | null {
  if (!raw || typeof raw !== "object") return null;
  const block = raw as Record<string, unknown>;
  const type = TYPE_VALUES.includes(block.type as LayoutBlockType)
    ? (block.type as LayoutBlockType)
    : "text";
  const wrap = WRAP_VALUES.includes(block.wrap as LayoutWrap) ? (block.wrap as LayoutWrap) : "none";
  const id = typeof block.id === "string" && block.id.trim() ? block.id : newLayoutId();
  return {
    id,
    type,
    x: clamp(asNumber(block.x, 0), 0, 100),
    y: Math.max(0, asNumber(block.y, index * 80)),
    w: clamp(asNumber(block.w, type === "image" ? 40 : 100), MIN_BLOCK_WIDTH_PCT, 100),
    h: Math.max(MIN_BLOCK_HEIGHT, asNumber(block.h, type === "image" ? 240 : 80)),
    z: asNumber(block.z, index + 1),
    wrap,
    html: typeof block.html === "string" ? block.html : "",
    src: typeof block.src === "string" ? block.src : "",
    alt: typeof block.alt === "string" ? block.alt : "",
    caption: typeof block.caption === "string" ? block.caption : "",
    fit: imageFit({ fit: block.fit as LayoutImageFit }),
    label: typeof block.label === "string" ? block.label : "",
    href: typeof block.href === "string" ? block.href : "",
    style: buttonStyle({ style: block.style as LayoutButtonStyle }),
  };
}

export function normalizeLayout(raw: unknown): PageLayout | null {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Record<string, unknown>;
  const blocks = Array.isArray(value.blocks)
    ? value.blocks.map((block, index) => normalizeBlock(block, index)).filter((block): block is LayoutBlock => Boolean(block))
    : [];
  return {
    version: LAYOUT_VERSION,
    enabled: value.enabled !== false && blocks.length > 0,
    canvasHeight: Math.max(240, asNumber(value.canvasHeight, 640)),
    blocks,
    seededButton: value.seededButton === true,
  };
}

export function parseLayoutFromUnknown(raw: unknown): PageLayout | null {
  if (!raw) return null;
  if (typeof raw === "string") {
    const text = raw.trim();
    if (!text) return null;
    try {
      return normalizeLayout(JSON.parse(text));
    } catch {
      return null;
    }
  }
  return normalizeLayout(raw);
}

export function getStoredLayout(raw?: string | null): PageLayout | null {
  const parsed = parsePageJson(raw);
  return parseLayoutFromUnknown(parsed.layout);
}

/** The marketing homepage always uses its locked Ocean Deep sections. */
export function usesPublicBodyDesigner(slug: string) {
  return slug !== "home";
}

export function getPublicPageLayout(slug: string, raw?: string | null): PageLayout | null {
  if (!usesPublicBodyDesigner(slug)) return null;
  return getStoredLayout(raw);
}

/** Turn off a designed layout without deleting blocks or other content keys. */
export function disablePublishedLayout<T extends Record<string, unknown>>(content: T): T {
  const layout = content.layout;
  if (!layout || typeof layout !== "object" || Array.isArray(layout)) return content;
  const current = layout as { enabled?: unknown };
  if (current.enabled === false) return content;
  return { ...content, layout: { ...current, enabled: false } };
}

export function hasEnabledLayout(raw?: string | null) {
  const layout = getStoredLayout(raw);
  return Boolean(layout?.enabled && layout.blocks.length);
}

export function measureCanvasHeight(blocks: LayoutBlock[], fallback = 640) {
  const bottom = blocks.reduce((max, block) => Math.max(max, block.y + block.h), 0);
  return Math.max(fallback, bottom + 48);
}

function pushBlock(blocks: LayoutBlock[], partial: Omit<LayoutBlock, "id" | "z">) {
  blocks.push({
    ...partial,
    id: newLayoutId(),
    z: blocks.length + 1,
  });
}

class LayoutBuilder {
  blocks: LayoutBlock[] = [];
  y = 0;

  heading(text: string, x = 0, w = 100) {
    if (!text.trim()) return this;
    pushBlock(this.blocks, {
      type: "heading",
      x,
      y: this.y,
      w,
      h: 64,
      wrap: "full",
      html: escapeLayoutText(text.trim()),
    });
    this.y += 80;
    return this;
  }

  text(text: string, wrap: LayoutWrap = "full", x = 0, w = 100, h = 110) {
    if (!text.trim()) return this;
    pushBlock(this.blocks, {
      type: "text",
      x,
      y: this.y,
      w,
      h,
      wrap,
      html: paragraphHtml(text),
    });
    this.y += h + 16;
    return this;
  }

  html(html: string, h = 140, wrap: LayoutWrap = "full", x = 0, w = 100) {
    if (!html.trim()) return this;
    pushBlock(this.blocks, {
      type: "text",
      x,
      y: this.y,
      w,
      h,
      wrap,
      html,
    });
    this.y += h + 16;
    return this;
  }

  quote(text: string) {
    if (!text.trim()) return this;
    pushBlock(this.blocks, {
      type: "quote",
      x: 4,
      y: this.y,
      w: 92,
      h: 88,
      wrap: "full",
      html: escapeLayoutText(text.trim()),
    });
    this.y += 108;
    return this;
  }

  image(src: string, alt: string, wrap: LayoutWrap = "left", w = 40, h = 280, x?: number) {
    if (!src.trim()) return this;
    const left = x ?? (wrap === "right" ? Math.max(0, 100 - w) : 0);
    pushBlock(this.blocks, {
      type: "image",
      x: left,
      y: this.y,
      w,
      h,
      wrap,
      src,
      alt,
      caption: "",
      fit: "contain",
    });
    if (wrap === "full" || wrap === "none") this.y += h + 20;
    return this;
  }

  button(label: string, href: string, style: LayoutButtonStyle = "outline", x = 0, w = 36, h = 64) {
    if (!label.trim() || !sanitizeLayoutHref(href)) return this;
    pushBlock(this.blocks, {
      type: "button",
      x,
      y: this.y,
      w,
      h,
      wrap: "full",
      label: label.trim(),
      href: sanitizeLayoutHref(href),
      style,
    });
    this.y += h + 16;
    return this;
  }

  finish(enabled = false): PageLayout {
    return {
      version: LAYOUT_VERSION,
      enabled,
      canvasHeight: measureCanvasHeight(this.blocks),
      blocks: this.blocks,
      seededButton: this.blocks.some(isButtonBlock),
    };
  }
}

function appendPlainContent(
  builder: LayoutBuilder,
  raw?: string | null,
  box?: { x?: number; w?: number },
) {
  const parsed = parsePageJson(raw);
  const body =
    typeof parsed.body === "string"
      ? parsed.body
      : Array.isArray(parsed.paragraphs)
        ? (parsed.paragraphs as string[]).join("\n\n")
        : raw?.trim().startsWith("{")
          ? ""
          : raw || "";
  if (!body.trim()) return;

  const x = box?.x ?? 0;
  const w = box?.w ?? 100;
  for (const part of body.split(/\n\n+/)) {
    const block = part.trim();
    if (!block) continue;
    const image = block.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (image) {
      builder.image(image[2], image[1] || "Image", "full", 100, 320);
      continue;
    }
    if (block.startsWith("## ")) {
      builder.heading(block.replace(/^##\s+/, ""), x, w);
      continue;
    }
    builder.text(block, "full", x, w, Math.max(90, Math.min(220, 40 + block.length / 3)));
  }
}

function layoutFromPlainContent(raw?: string | null) {
  const builder = new LayoutBuilder();
  appendPlainContent(builder, raw);
  return builder.finish();
}

export type EventLayoutSource = {
  description?: string | null;
  itinerary?: string | null;
  coverUrl?: string | null;
  coverAlt?: string | null;
  gallery?: { url: string; alt?: string | null }[];
};

export function getEventLayout(raw?: string | null): PageLayout | null {
  return parseLayoutFromUnknown(raw);
}

export function hasEnabledEventLayout(raw?: string | null) {
  const layout = getEventLayout(raw);
  return Boolean(layout?.enabled && layout.blocks.length);
}

/** Prefill an event canvas from current copy, cover, and gallery Blob URLs. */
export function prefillEventLayout(source: EventLayoutSource = {}): PageLayout {
  const builder = new LayoutBuilder();
  const coverUrl = (source.coverUrl || "").trim();
  const coverAlt = source.coverAlt || "Event photo";
  const coverH = 320;

  if (coverUrl) {
    builder.image(coverUrl, coverAlt, "left", 40, coverH);
  }

  const besideCover = coverUrl ? { x: 44, w: 56 } : undefined;
  const afterCoverY = coverUrl ? builder.y + coverH + 20 : builder.y;
  appendPlainContent(builder, source.description, besideCover);
  if (coverUrl) builder.y = Math.max(builder.y, afterCoverY);

  if (source.itinerary?.trim()) {
    builder.heading("Itinerary");
    appendPlainContent(builder, source.itinerary);
  }

  const seen = new Set(coverUrl ? [coverUrl] : []);
  for (const [index, item] of (source.gallery || []).entries()) {
    const url = (item.url || "").trim();
    if (!url || seen.has(url)) continue;
    seen.add(url);
    const wrap = index % 2 === 0 ? "left" : "right";
    builder.image(url, item.alt || "Event photo", wrap, 48, 260);
    if (wrap === "right") builder.y += 280;
  }

  if (!builder.blocks.length) {
    builder.text("Write your event details here, then add photos around the copy.", "full", 0, 100, 110);
  }

  return builder.finish();
}

export function resolveEventEditorLayout(storedRaw: string | null | undefined, source: EventLayoutSource): PageLayout {
  const stored = getEventLayout(storedRaw);
  if (stored && stored.blocks.length) return stored;
  return prefillEventLayout(source);
}

export function prefillLayout(slug: string, raw?: string | null): PageLayout {
  const builder = new LayoutBuilder();

  switch (slug) {
    case "about": {
      const content = resolveAboutContent(raw);
      builder.image(SITE_IMAGES.practitionerPortrait, SITE_IMAGES.practitionerPortraitAlt, "left", 38, 460);
      content.paragraphs.forEach((paragraph) => builder.text(paragraph, "full", 42, 58, 130));
      builder.heading("Credentials");
      builder.html(listHtml(content.credentials), 220);
      builder.text(content.bookNote, "full", 0, 100, 90);
      if (content.showAmazonButton) {
        builder.button(content.amazonButtonLabel, content.amazonButtonUrl);
      }
      return builder.finish();
    }
    case "nutrition": {
      const content = resolveNutritionContent(raw);
      builder.image(content.cookingImage, content.cookingImageAlt, "left", 42, 420);
      builder.heading(content.heading, 46, 54);
      builder.text(content.intro, "full", 46, 54, 140);
      builder.text(content.notAlone, "full", 46, 54, 80);
      builder.text(content.approach, "full", 0, 100, 120);
      builder.text(content.foodFirst, "full", 0, 100, 110);
      builder.text(content.goal, "full", 0, 100, 110);
      return builder.finish();
    }
    case "sound-healing": {
      const content = resolveSoundHealingContent(raw);
      builder.image(content.sectionImage, content.sectionImageAlt, "left", 42, 360);
      builder.heading(content.whatHeading, 46, 54);
      builder.text(content.what, "full", 46, 54, 180);
      builder.heading(content.howHeading);
      builder.text(content.how, "full", 0, 100, 160);
      builder.text(content.meditative, "full", 0, 100, 140);
      builder.text(content.close, "full", 0, 100, 120);
      return builder.finish();
    }
    case "meditation": {
      const content = resolveMeditationContent(raw);
      builder.heading(content.gatherHeading);
      builder.text(content.gatherIntro);
      builder.text(content.gatherMore);
      builder.heading(content.experienceHeading);
      builder.html(listHtml(content.experienceItems), 220);
      builder.heading(content.retreatsHeading);
      builder.quote(content.retreatsLead);
      builder.text(content.retreatsBody);
      builder.text(content.retreatsGreece);
      builder.image(content.image1, content.image1Alt, "none", 32, 200, 0);
      builder.y -= 220;
      builder.image(content.image2, content.image2Alt, "none", 32, 200, 34);
      builder.y -= 220;
      builder.image(content.image3, content.image3Alt, "none", 32, 200, 68);
      return builder.finish();
    }
    case "home": {
      const content = resolveHomeContent(raw);
      builder.heading(content.pillarsHeading);
      builder.text(content.pillarsSub, "full", 0, 100, 70);
      builder.text(content.mind, "none", 0, 32, 180);
      builder.text(content.body, "none", 34, 32, 180);
      builder.text(content.spirit, "none", 68, 32, 180);
      builder.y += 200;
      builder.image(SITE_IMAGES.practitionerPortrait, SITE_IMAGES.practitionerPortraitAlt, "left", 40, 420);
      builder.heading(content.meetHeading, 44, 56);
      builder.quote(content.quote);
      builder.text(content.practitioner, "full", 44, 56, 160);
      builder.text(content.practitionerMore, "full", 44, 56, 140);
      return builder.finish();
    }
    case "retreats": {
      const content = resolveRetreatsContent(raw);
      content.intro.forEach((paragraph) => builder.text(paragraph));
      builder.heading(content.whatHeading);
      builder.html(listHtml(content.whatItems), 220);
      builder.heading(content.natureHeading);
      content.nature.forEach((paragraph) => builder.text(paragraph));
      builder.image(content.natureImage1, content.natureImage1Alt, "left", 48, 260);
      builder.image(content.natureImage2, content.natureImage2Alt, "right", 48, 260);
      if (content.bottomImage) {
        builder.y += 280;
        builder.image(content.bottomImage, content.bottomImageAlt || "Retreat photo", "full", 100, 260);
      }
      return builder.finish();
    }
    case "experiences": {
      const content = resolveExperiencesContent(raw);
      builder.text(content.intro);
      builder.text(content.introMore);
      content.experienceSections.forEach((section) => {
        builder.heading(section.title);
        builder.text(section.body);
      });
      builder.heading(content.groupHeading);
      builder.text(content.groupBody);
      // Workshop gallery stays a locked template widget fed by the CMS list.
      return builder.finish();
    }
    case "collaborative-care": {
      const content = resolveCollaborativeContent(raw);
      content.paragraphs.forEach((paragraph) => builder.text(paragraph));
      return builder.finish();
    }
    case "book": {
      const content = resolveBookContent(raw);
      builder.heading(content.heading);
      builder.text(content.lead, "full", 0, 100, 80);
      builder.text(content.intro);
      builder.heading(content.connectTitle);
      builder.text(content.connectBody);
      builder.heading(content.insuranceTitle);
      builder.text(content.insuranceBody);
      builder.heading(content.inquiriesTitle);
      builder.text(content.inquiriesBody);
      builder.quote(content.tagline);
      return builder.finish();
    }
    case "contact": {
      const content = resolveStoredContent("contact", raw);
      builder.text(String(content.intro || ""), "full", 0, 100, 140);
      return builder.finish();
    }
    case "events": {
      const content = resolveStoredContent("events", raw);
      builder.text(String(content.intro || ""), "full", 0, 100, 120);
      return builder.finish();
    }
    case "calendar": {
      const content = resolveStoredContent("calendar", raw);
      builder.text(String(content.intro || ""), "full", 0, 100, 120);
      return builder.finish();
    }
    case "nourish": {
      const content = resolveNourishContent(raw);
      builder.text(content.description);
      return builder.finish();
    }
    default:
      return layoutFromPlainContent(raw);
  }
}

export function resolveEditorLayout(slug: string, raw?: string | null): PageLayout {
  const stored = getStoredLayout(raw);
  if (stored && stored.blocks.length) {
    return slug === "about" ? ensureAboutAmazonButton(stored, raw) : stored;
  }
  return prefillLayout(slug, raw);
}

export function ensureAboutAmazonButton(layout: PageLayout, raw?: string | null): PageLayout {
  if (layout.blocks.some(isButtonBlock)) return { ...layout, seededButton: true };
  if (layout.seededButton) return layout;
  const content = resolveAboutContent(raw);
  if (!content.showAmazonButton) return { ...layout, seededButton: true };
  const button: LayoutBlock = {
    ...createBlankBlock("button", nextBlockY(layout.blocks)),
    label: content.amazonButtonLabel,
    href: content.amazonButtonUrl,
    style: "outline",
    wrap: "full",
    x: 0,
    w: 36,
    h: 64,
    z: nextBlockZ(layout.blocks),
  };
  const blocks = [...layout.blocks, button];
  return {
    ...layout,
    seededButton: true,
    blocks,
    canvasHeight: measureCanvasHeight(blocks, layout.canvasHeight),
  };
}

export function mergeLayoutIntoContent(existingRaw: string, layout: PageLayout | null, nextTemplate?: Record<string, unknown>) {
  const existing = parsePageJson(existingRaw);
  const looksJson = existingRaw.trim().startsWith("{") && Object.keys(existing).length > 0;
  const next: Record<string, unknown> = nextTemplate
    ? { ...existing, ...nextTemplate }
    : looksJson
      ? { ...existing }
      : { body: existingRaw };
  if (layout) next.layout = layout;
  return JSON.stringify(next);
}

export function layoutFromFormData(formData: FormData) {
  return parseLayoutFromUnknown(formData.get("layout"));
}

export function isUsableLayout(value: unknown) {
  const layout = normalizeLayout(value);
  return Boolean(layout && layout.blocks.length);
}

/** Keep an existing designed layout when filling missing template fields. */
export function preserveLayout<T extends Record<string, unknown>>(existing: Record<string, unknown>, next: T): T {
  if (isUsableLayout(existing.layout)) {
    return { ...next, layout: existing.layout };
  }
  return next;
}

export function createBlankBlock(type: LayoutBlockType, y: number): LayoutBlock {
  if (type === "button") {
    return {
      id: newLayoutId(),
      type,
      x: 0,
      y,
      w: 36,
      h: 64,
      z: 1,
      wrap: "full",
      label: "Button",
      href: "",
      style: "outline",
    };
  }
  if (type === "image") {
    return {
      id: newLayoutId(),
      type,
      x: 8,
      y,
      w: 40,
      h: 240,
      z: 1,
      wrap: "none",
      src: "",
      alt: "",
      caption: "",
      fit: "contain",
    };
  }
  if (type === "heading") {
    return {
      id: newLayoutId(),
      type,
      x: 0,
      y,
      w: 100,
      h: 64,
      z: 1,
      wrap: "full",
      html: "Heading",
    };
  }
  if (type === "quote") {
    return {
      id: newLayoutId(),
      type,
      x: 6,
      y,
      w: 88,
      h: 90,
      z: 1,
      wrap: "full",
      html: "A short quote",
    };
  }
  return {
    id: newLayoutId(),
    type: "text",
    x: 0,
    y,
    w: 100,
    h: 120,
    z: 1,
    wrap: "full",
    html: paragraphHtml("Write your text here."),
  };
}

export function nextBlockY(blocks: LayoutBlock[]) {
  return blocks.reduce((max, block) => Math.max(max, block.y + block.h), 0) + 20;
}

export const WRAP_OPTIONS: { value: LayoutWrap; label: string; hint: string }[] = [
  { value: "none", label: "None", hint: "Place exactly — no text wrapping" },
  { value: "left", label: "Left", hint: "Image on the left, text wraps on the right" },
  { value: "right", label: "Right", hint: "Image on the right, text wraps on the left" },
  { value: "full", label: "Full", hint: "Full width, stacked above or below other blocks" },
];

export function wrapLabel(wrap: LayoutWrap) {
  return WRAP_OPTIONS.find((option) => option.value === wrap)?.label || "None";
}

export function wrapHint(wrap: LayoutWrap) {
  return WRAP_OPTIONS.find((option) => option.value === wrap)?.hint || WRAP_OPTIONS[0].hint;
}

export function blockTypeLabel(type: LayoutBlockType) {
  switch (type) {
    case "heading":
      return "Heading";
    case "quote":
      return "Quote";
    case "image":
      return "Image";
    case "button":
      return "Button";
    default:
      return "Text";
  }
}

export function nextBlockZ(blocks: LayoutBlock[]) {
  return blocks.reduce((max, block) => Math.max(max, block.z), 0) + 1;
}

export function removeBlockFromLayout(layout: PageLayout, id: string): PageLayout {
  const blocks = layout.blocks.filter((block) => block.id !== id);
  return {
    ...layout,
    blocks,
    canvasHeight: measureCanvasHeight(blocks, layout.canvasHeight),
  };
}

export function applyWrapPreset(block: LayoutBlock, wrap: LayoutWrap): LayoutBlock {
  if (wrap === "left") return { ...block, wrap, x: 0, w: Math.min(block.w || 40, 48) };
  if (wrap === "right") return { ...block, wrap, x: Math.max(52, 100 - (block.w || 40)), w: Math.min(block.w || 40, 48) };
  if (wrap === "full") return { ...block, wrap, x: 0, w: 100 };
  return { ...block, wrap };
}

export function layoutUsesWrap(blocks: Pick<LayoutBlock, "wrap">[]) {
  return blocks.some((block) => block.wrap === "left" || block.wrap === "right");
}

function clampFlowWidth(width: number, min = 18) {
  return `${Math.min(100, Math.max(min, width))}%`;
}

/**
 * Wrap-left/right pages flow copy in the full content well. The designer may
 * still store a narrow right-hand box (x/w on a 960px canvas); the public
 * renderer must not keep text locked to that box.
 */
export function flowIgnoresDesignerBox(block: Pick<LayoutBlock, "type" | "wrap">, usesWrap: boolean) {
  if (block.type === "image") return false;
  if (usesWrap && block.type !== "button") return true;
  return block.wrap === "full";
}

/** Buttons and freeform/full blocks start on a new line so floated photos cannot sit under them. */
export function flowShellClass(block: Pick<LayoutBlock, "type" | "wrap">, usesWrap = false) {
  if (block.type === "button") return "fn-layout-clear";
  if (block.type === "heading") return "fn-layout-clear";
  if (block.type === "image") {
    return block.wrap === "left" || block.wrap === "right" ? "" : "fn-layout-clear";
  }
  // Body copy wraps beside floated photos, then fills the same well as Credentials.
  if (usesWrap) return "";
  if (block.wrap === "full" || block.wrap === "none") return "fn-layout-clear";
  return "";
}

export function flowBlockBoxStyle(
  block: Pick<LayoutBlock, "type" | "wrap" | "w" | "x">,
  usesWrap: boolean,
): { width: string; marginLeft?: string } | undefined {
  if (block.type === "image") {
    if (block.wrap === "full") return undefined;
    const width = clampFlowWidth(block.w);
    if (block.wrap === "none") return { width, marginLeft: `${block.x}%` };
    return { width };
  }
  if (flowIgnoresDesignerBox(block, usesWrap)) return undefined;
  return { width: clampFlowWidth(block.w, 20), marginLeft: `${block.x}%` };
}

