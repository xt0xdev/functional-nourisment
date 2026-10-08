import type { CSSProperties, ReactNode } from "react";
import {
  CANVAS_WIDTH,
  SITE_CONTENT_CLASS,
  buttonLinkProps,
  buttonStyle,
  flowBlockBoxStyle,
  flowShellClass,
  imageCaption,
  imageFit,
  layoutButtonClass,
  layoutButtonLabel,
  layoutUsesWrap,
  sanitizeLayoutHref,
  type LayoutBlock,
  type LayoutButtonStyle,
  type PageLayout,
  sanitizeLayoutHtml,
} from "@/lib/page-layout";
import { SmartImage } from "./SmartImage";

export function LayoutLinkButton({
  label,
  href,
  style = "outline",
  className = "",
}: {
  label: string;
  href: string;
  style?: LayoutButtonStyle;
  className?: string;
}) {
  const text = label.trim();
  const safe = sanitizeLayoutHref(href);
  if (!text || !safe) return null;
  return (
    <a {...buttonLinkProps(safe)} className={`${layoutButtonClass(style)} ${className}`.trim()}>
      {text}
    </a>
  );
}

function BlockButton({ block }: { block: LayoutBlock }) {
  return (
    <LayoutLinkButton
      label={layoutButtonLabel(block)}
      href={block.href || ""}
      style={buttonStyle(block)}
    />
  );
}

function imageObjectClass(block: LayoutBlock) {
  const fit = imageFit(block);
  if (fit === "circle" || fit === "cover") return "object-cover";
  return "object-contain";
}

function imageBoxClass(block: LayoutBlock) {
  const fit = imageFit(block);
  if (fit === "circle") return "relative aspect-square overflow-hidden rounded-full bg-mist";
  if (fit === "cover") return "relative overflow-hidden rounded-2xl bg-mist";
  return "relative rounded-2xl";
}

function coverBoxStyle(block: LayoutBlock): CSSProperties | undefined {
  if (imageFit(block) !== "cover") return undefined;
  const widthPx = Math.max(1, (block.w / 100) * CANVAS_WIDTH);
  return { aspectRatio: `${widthPx} / ${Math.max(1, block.h)}` };
}

function BlockHtml({ html, className }: { html?: string; className?: string }) {
  const safe = sanitizeLayoutHtml(html || "");
  return <div className={className} dangerouslySetInnerHTML={{ __html: safe }} />;
}

function TextualBlock({ block }: { block: LayoutBlock }) {
  if (block.type === "heading") {
    return (
      <h2 className="font-serif text-3xl text-primary md:text-4xl">
        <BlockHtml html={block.html} />
      </h2>
    );
  }
  if (block.type === "quote") {
    return (
      <blockquote className="border-l-4 border-teal pl-5 font-serif text-2xl italic text-primary">
        <BlockHtml html={block.html} />
      </blockquote>
    );
  }
  return <BlockHtml html={block.html} className="prose-fn max-w-none" />;
}

function FlowImage({ block, usesWrap }: { block: LayoutBlock; usesWrap: boolean }) {
  const floatClass =
    block.wrap === "left"
      ? "fn-layout-float-left"
      : block.wrap === "right"
        ? "fn-layout-float-right"
        : "fn-layout-clear";
  const fit = imageFit(block);
  const caption = imageCaption(block);
  return (
    <figure className={floatClass} style={flowBlockBoxStyle(block, usesWrap)}>
      {fit === "contain" ? (
        block.src ? (
          <SmartImage
            src={block.src}
            alt={block.alt || ""}
            className="h-auto w-full rounded-2xl object-contain"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        ) : null
      ) : (
        <div className={imageBoxClass(block)} style={coverBoxStyle(block)}>
          {block.src ? (
            <SmartImage
              src={block.src}
              alt={block.alt || ""}
              fill
              className={imageObjectClass(block)}
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          ) : null}
        </div>
      )}
      {caption ? <figcaption className="mt-2 text-sm text-muted">{caption}</figcaption> : null}
    </figure>
  );
}

function FlowBlock({ block, usesWrap }: { block: LayoutBlock; usesWrap: boolean }) {
  if (block.type === "image") return <FlowImage block={block} usesWrap={usesWrap} />;
  const shell = flowShellClass(block, usesWrap);
  const style = flowBlockBoxStyle(block, usesWrap);
  if (block.type === "button") {
    return (
      <div className={shell} style={style}>
        <BlockButton block={block} />
      </div>
    );
  }
  return (
    <div className={shell} style={style}>
      <TextualBlock block={block} />
    </div>
  );
}

function FreeBlock({ block, canvasHeight }: { block: LayoutBlock; canvasHeight: number }) {
  const style = {
    left: `${block.x}%`,
    top: `${(block.y / canvasHeight) * 100}%`,
    width: `${block.w}%`,
    height: `${(block.h / canvasHeight) * 100}%`,
    zIndex: block.type === "button" ? Math.max(block.z, 8) : block.z,
  };

  if (block.type === "button") {
    return (
      <div className="absolute flex items-start overflow-visible" style={style}>
        <BlockButton block={block} />
      </div>
    );
  }

  if (block.type === "image") {
    const fit = imageFit(block);
    const frame =
      fit === "circle"
        ? "absolute overflow-hidden rounded-full"
        : fit === "cover"
          ? "absolute overflow-hidden rounded-2xl"
          : "absolute overflow-visible rounded-2xl";
    return (
      <div className={frame} style={style}>
        {block.src ? (
          <SmartImage
            src={block.src}
            alt={block.alt || ""}
            fill
            className={imageObjectClass(block)}
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-mist text-sm text-muted">Choose an image</div>
        )}
      </div>
    );
  }

  return (
    <div className="absolute overflow-auto" style={style}>
      <TextualBlock block={block} />
    </div>
  );
}

function sortedBlocks(blocks: LayoutBlock[]) {
  return [...blocks].sort((a, b) => a.y - b.y || a.x - b.x);
}

export function LayoutDocument({
  layout,
  className = "",
}: {
  layout: PageLayout;
  className?: string;
}) {
  const blocks = sortedBlocks(layout.blocks);
  const usesWrap = layoutUsesWrap(layout.blocks);
  const canvasHeight = Math.max(layout.canvasHeight, 240);

  return (
    <div className={`fn-layout ${className}`}>
      <div className="fn-layout-mobile space-y-6 md:hidden">
        {blocks.map((block) => (
          <FlowBlock
            key={block.id}
            usesWrap={usesWrap}
            block={block.wrap === "none" ? { ...block, wrap: "full", x: 0, w: 100 } : block}
          />
        ))}
      </div>

      <div className="hidden md:block">
        {usesWrap ? (
          <div className="fn-layout-flow">
            {blocks.map((block) => (
              <FlowBlock key={block.id} block={block} usesWrap={usesWrap} />
            ))}
          </div>
        ) : (
          <div
            className="relative w-full"
            style={{ paddingBottom: `${(canvasHeight / CANVAS_WIDTH) * 100}%` }}
          >
            <div className="absolute inset-0">
              {layout.blocks.map((block) => (
                <FreeBlock key={block.id} block={block} canvasHeight={canvasHeight} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function PageLayoutBody({
  layout,
  className,
  bare = false,
}: {
  layout: PageLayout;
  className?: string;
  bare?: boolean;
}) {
  if (!layout.blocks.length) return null;
  if (bare) return <LayoutDocument layout={layout} className={className} />;
  return (
    <section className={className || "bg-background"}>
      <div className={`${SITE_CONTENT_CLASS} py-12 md:py-16`}>
        <LayoutDocument layout={layout} />
      </div>
    </section>
  );
}

export function PageBodyOrLayout({
  content: _content,
  layout,
  fallback,
  className,
  bare = false,
}: {
  content?: string | null;
  layout?: PageLayout | null;
  fallback: ReactNode;
  className?: string;
  bare?: boolean;
}) {
  if (layout?.enabled && layout.blocks.length) {
    return <PageLayoutBody layout={layout} className={className} bare={bare} />;
  }
  return <>{fallback}</>;
}
