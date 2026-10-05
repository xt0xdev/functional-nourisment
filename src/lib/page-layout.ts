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
export const CANVAS_WIDTH = 960;
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

function layoutFromPlainContent(raw?: string | null) {
  const builder = new LayoutBuilder();
  const parsed = parsePageJson(raw);
  const body =
    typeof parsed.body === "string"
      ? parsed.body
      : Array.isArray(parsed.paragraphs)
        ? (parsed.paragraphs as string[]).join("\n\n")
        : raw?.trim().startsWith("{")
          ? ""
          : raw || "";
  if (!body.trim()) return builder.finish();

  for (const part of body.split(/\n\n+/)) {
    const block = part.trim();
    if (!block) continue;
    const image = block.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (image) {
      builder.image(image[2], image[1] || "Image", "full", 100, 320);
      continue;
    }
    if (block.startsWith("## ")) {
      builder.heading(block.replace(/^##\s+/, ""));
      continue;
    }
    builder.text(block, "full", 0, 100, Math.max(90, Math.min(220, 40 + block.length / 3)));
  }
  return builder.finish();
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
      wrap: "left",
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

export function wrapLabel(wrap: LayoutWrap) {
  switch (wrap) {
    case "left":
      return "Wrap text right";
    case "right":
      return "Wrap text left";
    case "full":
      return "Full width";
    default:
      return "Freeform";
  }
}

export function applyWrapPreset(block: LayoutBlock, wrap: LayoutWrap): LayoutBlock {
  if (wrap === "left") return { ...block, wrap, x: 0, w: Math.min(block.w || 40, 48) };
  if (wrap === "right") return { ...block, wrap, x: Math.max(52, 100 - (block.w || 40)), w: Math.min(block.w || 40, 48) };
  if (wrap === "full") return { ...block, wrap, x: 0, w: 100 };
  return { ...block, wrap };
}

