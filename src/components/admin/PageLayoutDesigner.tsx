"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { MediaPicker } from "./MediaPicker";
import { LayoutDocument } from "@/components/site/PageLayoutBody";
import {
  CANVAS_WIDTH,
  applyWrapPreset,
  createBlankBlock,
  measureCanvasHeight,
  nextBlockY,
  type LayoutBlock,
  type LayoutBlockType,
  type LayoutWrap,
  type PageLayout,
  wrapLabel,
} from "@/lib/page-layout";

type DesignerProps = {
  name?: string;
  initialLayout: PageLayout;
  pageTitle: string;
  heroHeading: string;
  heroSubheading: string;
  heroImage?: string;
  wasPublishedLayout: boolean;
};

type DragState = {
  id: string;
  mode: "move" | Handle;
  startX: number;
  startY: number;
  origin: LayoutBlock;
};

type Handle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

const HANDLES: Handle[] = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];

function percentFromDelta(dx: number, canvasCssWidth: number) {
  return (dx / canvasCssWidth) * 100;
}

function applyDrag(origin: LayoutBlock, mode: DragState["mode"], dxPct: number, dy: number): LayoutBlock {
  if (mode === "move") {
    return {
      ...origin,
      x: Math.min(100 - origin.w, Math.max(0, origin.x + dxPct)),
      y: Math.max(0, origin.y + dy),
    };
  }

  let { x, y, w, h } = origin;
  if (mode.includes("e")) w = Math.min(100 - x, Math.max(12, origin.w + dxPct));
  if (mode.includes("s")) h = Math.max(40, origin.h + dy);
  if (mode.includes("w")) {
    const nextW = Math.max(12, origin.w - dxPct);
    const used = origin.w - nextW;
    x = Math.min(100 - nextW, Math.max(0, origin.x + used));
    w = nextW;
  }
  if (mode.includes("n")) {
    const nextH = Math.max(40, origin.h - dy);
    const used = origin.h - nextH;
    y = Math.max(0, origin.y + used);
    h = nextH;
  }
  if (origin.wrap === "full") {
    x = 0;
    w = 100;
  }
  return { ...origin, x, y, w, h };
}

export function PageLayoutDesigner({
  name = "layout",
  initialLayout,
  pageTitle,
  heroHeading,
  heroSubheading,
  heroImage,
  wasPublishedLayout,
}: DesignerProps) {
  const [layout, setLayout] = useState<PageLayout>(initialLayout);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [mode, setMode] = useState<"design" | "preview">("design");
  const [picker, setPicker] = useState<"new" | string | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(CANVAS_WIDTH);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);

  const selected = layout.blocks.find((block) => block.id === selectedId) || null;
  const scale = canvasWidth / CANVAS_WIDTH;
  const canvasHeight = Math.max(layout.canvasHeight, measureCanvasHeight(layout.blocks));

  useEffect(() => {
    const node = canvasRef.current;
    if (!node) return;
    const update = () => setCanvasWidth(node.clientWidth || CANVAS_WIDTH);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [mode]);

  function commit(next: PageLayout, markDirty = true) {
    if (markDirty) {
      next = { ...next, enabled: true, canvasHeight: measureCanvasHeight(next.blocks, next.canvasHeight) };
    }
    setLayout(next);
  }

  function updateBlock(id: string, patch: Partial<LayoutBlock> | ((block: LayoutBlock) => LayoutBlock)) {
    commit({
      ...layout,
      blocks: layout.blocks.map((block) => {
        if (block.id !== id) return block;
        return typeof patch === "function" ? patch(block) : { ...block, ...patch };
      }),
    });
  }

  function addBlock(type: LayoutBlockType) {
    const block = createBlankBlock(type, nextBlockY(layout.blocks));
    commit({ ...layout, blocks: [...layout.blocks, block] });
    setSelectedId(block.id);
    if (type === "image") setPicker(block.id);
    if (type !== "image") setEditingId(block.id);
  }

  function removeSelected() {
    if (!selectedId) return;
    commit({ ...layout, blocks: layout.blocks.filter((block) => block.id !== selectedId) });
    setSelectedId(null);
    setEditingId(null);
  }

  function onPointerDown(event: ReactPointerEvent, id: string, handle?: Handle) {
    if (editingId === id && !handle) return;
    const block = layout.blocks.find((item) => item.id === id);
    if (!block) return;
    event.preventDefault();
    event.stopPropagation();
    setSelectedId(id);
    setEditingId(null);
    const drag: DragState = {
      id,
      mode: handle || "move",
      startX: event.clientX,
      startY: event.clientY,
      origin: block,
    };
    dragRef.current = drag;

    const onMove = (moveEvent: PointerEvent) => {
      const dxPct = percentFromDelta(moveEvent.clientX - drag.startX, canvasWidth);
      const dy = (moveEvent.clientY - drag.startY) / scale;
      const nextBlock = applyDrag(drag.origin, drag.mode, dxPct, dy);
      setLayout((current) => {
        const blocks = current.blocks.map((item) => (item.id === id ? nextBlock : item));
        return {
          ...current,
          enabled: true,
          blocks,
          canvasHeight: measureCanvasHeight(blocks, current.canvasHeight),
        };
      });
    };
    const onUp = () => {
      dragRef.current = null;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  function setWrap(wrap: LayoutWrap) {
    if (!selected) return;
    updateBlock(selected.id, applyWrapPreset(selected, wrap));
  }

  const payload = useMemo(() => JSON.stringify(layout), [layout]);

  return (
    <div className="grid gap-4">
      <input type="hidden" name={name} value={payload} />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl text-forest">Page body designer</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            Drag text and images in the body area. Header, navigation, hero, and footer stay locked to the
            site template. Wrap left or right so published text flows around a photo. On phones, blocks
            stack in top-to-bottom order.
          </p>
        </div>
        <label className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm">
          <input
            type="checkbox"
            checked={layout.enabled}
            onChange={(event) => commit({ ...layout, enabled: event.target.checked })}
          />
          Use this layout on the live page
        </label>
      </div>

      {!layout.enabled ? (
        <p className="rounded-2xl bg-mist px-4 py-3 text-sm text-muted">
          The live page still uses the current template body. Change the layout or turn on “Use this layout”
          {wasPublishedLayout ? "" : " — this canvas is prefilled from the published copy so it is not blank"}.
        </p>
      ) : (
        <p className="rounded-2xl bg-white px-4 py-3 text-sm text-muted">
          Saving publishes this body layout. Site chrome (header, hero, footer, forms, calendars, and card
          widgets) stays template-controlled.
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <button type="button" className="rounded-full bg-forest px-4 py-2 text-sm text-cream" onClick={() => addBlock("text")}>
          Add text
        </button>
        <button type="button" className="rounded-full bg-forest px-4 py-2 text-sm text-cream" onClick={() => addBlock("heading")}>
          Add heading
        </button>
        <button type="button" className="rounded-full bg-forest px-4 py-2 text-sm text-cream" onClick={() => addBlock("quote")}>
          Add quote
        </button>
        <button type="button" className="rounded-full bg-forest px-4 py-2 text-sm text-cream" onClick={() => addBlock("image")}>
          Add image
        </button>
        <button
          type="button"
          className={`rounded-full px-4 py-2 text-sm ${mode === "design" ? "bg-white text-forest" : "bg-mist text-muted"}`}
          onClick={() => setMode("design")}
        >
          Design
        </button>
        <button
          type="button"
          className={`rounded-full px-4 py-2 text-sm ${mode === "preview" ? "bg-white text-forest" : "bg-mist text-muted"}`}
          onClick={() => setMode("preview")}
        >
          Published preview
        </button>
      </div>

      <div className="overflow-hidden rounded-3xl border border-forest/10 bg-sand">
        <div className="pointer-events-none select-none bg-forest px-5 py-3 text-cream">
          <p className="text-[10px] uppercase tracking-[0.2em] text-cream/60">Site template · locked</p>
          <div className="mt-1 flex items-center justify-between gap-3">
            <p className="font-serif text-xl">Functional Nourishment</p>
            <p className="text-xs text-cream/70">Header · Navigation</p>
          </div>
        </div>
        <div className="pointer-events-none select-none grid gap-4 bg-background px-5 py-6 md:grid-cols-2">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-teal">Hero · locked</p>
            <p className="mt-2 font-serif text-3xl text-primary">{heroHeading || pageTitle}</p>
            {heroSubheading ? <p className="mt-2 text-sm text-muted">{heroSubheading}</p> : null}
          </div>
          {heroImage ? (
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-mist">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={heroImage} alt="" className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="flex aspect-[16/9] items-center justify-center rounded-2xl bg-mist text-sm text-muted">
              Hero image
            </div>
          )}
        </div>

        <div className="border-y border-dashed border-forest/20 bg-white px-3 py-3 md:px-5">
          <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-teal">Editable page body</p>
          {mode === "preview" ? (
            <div className="rounded-2xl bg-background p-4">
              <LayoutDocument layout={layout} />
            </div>
          ) : (
            <div
              ref={canvasRef}
              className="fn-layout-canvas mx-auto max-w-[960px] overflow-hidden rounded-2xl bg-background"
              style={{ height: canvasHeight * scale, minHeight: 360 }}
              onClick={() => {
                setSelectedId(null);
                setEditingId(null);
              }}
            >
              {layout.blocks.map((block) => {
                const active = block.id === selectedId;
                return (
                  <div
                    key={block.id}
                    className={`absolute cursor-move ${active ? "z-20 ring-2 ring-teal" : "hover:ring-1 hover:ring-teal/40"}`}
                    style={{
                      left: `${block.x}%`,
                      top: block.y * scale,
                      width: `${block.w}%`,
                      height: block.h * scale,
                      zIndex: active ? 20 : block.z,
                    }}
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedId(block.id);
                    }}
                    onDoubleClick={(event) => {
                      event.stopPropagation();
                      if (block.type !== "image") setEditingId(block.id);
                    }}
                    onPointerDown={(event) => onPointerDown(event, block.id)}
                  >
                    <CanvasBlock block={block} editing={editingId === block.id} onHtml={(html) => updateBlock(block.id, { html })} />
                    {block.type === "image" ? (
                      <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] uppercase tracking-wide text-forest">
                        {wrapLabel(block.wrap)}
                      </span>
                    ) : null}
                    {active
                      ? HANDLES.map((handle) => (
                          <button
                            key={handle}
                            type="button"
                            aria-label={`Resize ${handle}`}
                            className={`fn-layout-handle fn-layout-handle-${handle}`}
                            onPointerDown={(event) => onPointerDown(event, block.id, handle)}
                          />
                        ))
                      : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="pointer-events-none select-none bg-forest px-5 py-4 text-cream">
          <p className="text-[10px] uppercase tracking-[0.2em] text-cream/60">Site template · locked</p>
          <p className="mt-1 text-sm text-cream/80">Call to action · Footer</p>
        </div>
      </div>

      {selected ? (
        <div className="grid gap-3 rounded-2xl bg-white p-5 md:grid-cols-[1fr_1fr_auto]">
          <label className="grid gap-1 text-sm">
            Placement
            <select
              value={selected.wrap}
              onChange={(event) => setWrap(event.target.value as LayoutWrap)}
              className="rounded-xl border border-forest/15 px-3 py-2"
            >
              <option value="none">Freeform — place exactly</option>
              <option value="left">Image left, wrap text around</option>
              <option value="right">Image right, wrap text around</option>
              <option value="full">Full width, stacked</option>
            </select>
          </label>
          {selected.type === "image" ? (
            <label className="grid gap-1 text-sm">
              Image alt text
              <input
                value={selected.alt || ""}
                onChange={(event) => updateBlock(selected.id, { alt: event.target.value })}
                className="rounded-xl border border-forest/15 px-3 py-2"
              />
            </label>
          ) : (
            <p className="self-end text-sm text-muted">Double-click the box to edit text.</p>
          )}
          <div className="flex flex-wrap items-end gap-2">
            {selected.type === "image" ? (
              <button type="button" className="rounded-full bg-forest px-4 py-2 text-sm text-cream" onClick={() => setPicker(selected.id)}>
                Change image
              </button>
            ) : null}
            <button type="button" className="rounded-full bg-clay/10 px-4 py-2 text-sm text-forest" onClick={removeSelected}>
              Delete block
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted">Select a block to set wrap, replace an image, or delete it.</p>
      )}

      {picker ? (
        <MediaPicker
          key={picker}
          asField={false}
          hideTrigger
          defaultOpen
          label="Choose an image"
          onSelect={(item) => {
            if (picker === "new") {
              const block = { ...createBlankBlock("image", nextBlockY(layout.blocks)), src: item.url, alt: item.alt || "" };
              commit({ ...layout, blocks: [...layout.blocks, block] });
              setSelectedId(block.id);
            } else {
              updateBlock(picker, { src: item.url, alt: item.alt || "" });
              setSelectedId(picker);
            }
            setPicker(null);
          }}
        />
      ) : null}
    </div>
  );
}

function CanvasBlock({
  block,
  editing,
  onHtml,
}: {
  block: LayoutBlock;
  editing: boolean;
  onHtml: (html: string) => void;
}) {
  if (block.type === "image") {
    if (!block.src) {
      return <div className="flex h-full items-center justify-center rounded-2xl bg-mist text-sm text-muted">No image yet</div>;
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={block.src} alt={block.alt || ""} className="h-full w-full rounded-2xl object-cover" draggable={false} />
    );
  }

  const className =
    block.type === "heading"
      ? "h-full overflow-auto font-serif text-3xl text-primary"
      : block.type === "quote"
        ? "h-full overflow-auto border-l-4 border-teal pl-4 font-serif text-2xl italic text-primary"
        : "prose-fn h-full max-w-none overflow-auto";

  return (
    <div
      className={`${className} ${editing ? "cursor-text rounded-md bg-white/80 outline outline-teal" : ""}`}
      contentEditable={editing}
      suppressContentEditableWarning
      onBlur={(event) => onHtml(event.currentTarget.innerHTML)}
      dangerouslySetInnerHTML={{ __html: block.html || "" }}
    />
  );
}
