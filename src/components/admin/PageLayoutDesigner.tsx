"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { MediaPicker } from "./MediaPicker";
import { LayoutDocument } from "@/components/site/PageLayoutBody";
import {
  CANVAS_WIDTH,
  SITE_CONTENT_CLASS,
  WRAP_OPTIONS,
  applyWrapPreset,
  blockTypeLabel,
  buttonStyle,
  createBlankBlock,
  imageFit,
  layoutButtonClass,
  layoutButtonLabel,
  measureCanvasHeight,
  nextBlockY,
  nextBlockZ,
  removeBlockFromLayout,
  type LayoutBlock,
  type LayoutBlockType,
  type LayoutButtonStyle,
  type LayoutImageFit,
  type LayoutWrap,
  type PageLayout,
  wrapHint,
  wrapLabel,
} from "@/lib/page-layout";
import {
  applyDrag,
  percentFromDelta,
  snapBlock,
  type ResizeHandle,
  type SnapGuide,
  type TransformMode,
} from "@/lib/page-layout-transform";

type DesignerProps = {
  name?: string;
  initialLayout: PageLayout;
  pageTitle: string;
  heroHeading: string;
  heroSubheading: string;
  heroImage?: string;
  wasPublishedLayout: boolean;
  title?: string;
  help?: string;
  bodyLabel?: string;
  enabledLabel?: string;
  lockedAfterHero?: ReactNode;
  lockedAfterBody?: ReactNode;
};

type DragState = {
  id: string;
  mode: TransformMode;
  startX: number;
  startY: number;
  origin: LayoutBlock;
};

const HANDLES: ResizeHandle[] = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];

export function PageLayoutDesigner({
  name = "layout",
  initialLayout,
  pageTitle,
  heroHeading,
  heroSubheading,
  heroImage,
  wasPublishedLayout,
  title = "Page body",
  help = "Select a block, then use Delete or Backspace — or the Delete button — to remove it. Wrap (None / Left / Right / Full) is in the inspector when a photo is selected. The hero banner above is edited in the Hero section, not on this canvas.",
  bodyLabel = "Body canvas",
  enabledLabel = "Use this layout on the live page",
  lockedAfterHero,
  lockedAfterBody,
}: DesignerProps) {
  const [layout, setLayout] = useState<PageLayout>(initialLayout);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [interactingId, setInteractingId] = useState<string | null>(null);
  const [guides, setGuides] = useState<SnapGuide[]>([]);
  const [mode, setMode] = useState<"design" | "preview">("design");
  const [picker, setPicker] = useState<"new" | string | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(CANVAS_WIDTH);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const layoutRef = useRef(layout);
  const selectedIdRef = useRef(selectedId);
  const editingIdRef = useRef(editingId);
  layoutRef.current = layout;
  selectedIdRef.current = selectedId;
  editingIdRef.current = editingId;

  const selected = layout.blocks.find((block) => block.id === selectedId) || null;
  const scale = canvasWidth / CANVAS_WIDTH;
  const canvasHeight = Math.max(layout.canvasHeight, measureCanvasHeight(layout.blocks));
  const orderedBlocks = useMemo(
    () => [...layout.blocks].sort((a, b) => a.y - b.y || a.x - b.x || a.z - b.z),
    [layout.blocks],
  );

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
    const current = layoutRef.current;
    commit({
      ...current,
      blocks: current.blocks.map((block) => {
        if (block.id !== id) return block;
        return typeof patch === "function" ? patch(block) : { ...block, ...patch };
      }),
    });
  }

  function addBlock(type: LayoutBlockType) {
    const current = layoutRef.current;
    const block = {
      ...createBlankBlock(type, nextBlockY(current.blocks)),
      z: nextBlockZ(current.blocks),
    };
    commit({ ...current, blocks: [...current.blocks, block] });
    setSelectedId(block.id);
    if (type === "image") setPicker(block.id);
    if (type !== "image" && type !== "button") setEditingId(block.id);
  }

  function removeBlock(id: string | null) {
    if (!id) return;
    const current = layoutRef.current;
    if (!current.blocks.some((block) => block.id === id)) return;
    commit(removeBlockFromLayout(current, id));
    setSelectedId((cur) => (cur === id ? null : cur));
    setEditingId((cur) => (cur === id ? null : cur));
    setPicker((cur) => (cur === id ? null : cur));
  }

  function selectBlock(id: string) {
    setSelectedId(id);
    setEditingId(null);
    const current = layoutRef.current;
    const maxZ = current.blocks.reduce((max, block) => Math.max(max, block.z), 0);
    const block = current.blocks.find((item) => item.id === id);
    if (block && block.z < maxZ) {
      updateBlock(id, { z: maxZ + 1 });
    }
  }

  function shiftLayer(direction: "front" | "back") {
    if (!selected) return;
    const zs = layout.blocks.map((block) => block.z);
    const nextZ = direction === "front" ? Math.max(...zs, 0) + 1 : Math.min(...zs, 1) - 1;
    updateBlock(selected.id, { z: nextZ });
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Delete" && event.key !== "Backspace") return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
      if (editingIdRef.current) return;
      const id = selectedIdRef.current;
      if (!id) return;
      event.preventDefault();
      removeBlock(id);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function onPointerDown(event: ReactPointerEvent, id: string, handle?: ResizeHandle) {
    if (editingId === id && !handle) return;
    const block = layout.blocks.find((item) => item.id === id);
    if (!block) return;
    event.preventDefault();
    event.stopPropagation();
    selectBlock(id);
    setInteractingId(id);
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
      const draft = applyDrag(drag.origin, drag.mode, dxPct, dy);
      const others = layoutRef.current.blocks.filter((item) => item.id !== id);
      const snapped = snapBlock(draft, drag.mode, others, Math.max(layoutRef.current.canvasHeight, canvasHeight));
      setGuides(snapped.guides);
      setLayout((current) => {
        const blocks = current.blocks.map((item) => (item.id === id ? snapped.block : item));
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
      setInteractingId(null);
      setGuides([]);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  function setWrap(wrap: LayoutWrap) {
    const block = layoutRef.current.blocks.find((item) => item.id === selectedIdRef.current);
    if (!block) return;
    updateBlock(block.id, applyWrapPreset(block, wrap));
  }

  const payload = useMemo(() => JSON.stringify(layout), [layout]);

  return (
    <div className="grid gap-4">
      <input type="hidden" name={name} value={payload} />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl text-forest">{title}</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted">{help}</p>
        </div>
        <label className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm">
          <input
            type="checkbox"
            checked={layout.enabled}
            onChange={(event) => commit({ ...layout, enabled: event.target.checked }, false)}
          />
          {enabledLabel}
        </label>
      </div>

      {!layout.enabled ? (
        <p className="rounded-2xl bg-mist px-4 py-3 text-sm text-muted">
          The live page still uses the template body. Edit the canvas or turn on “{enabledLabel}”
          {wasPublishedLayout ? "" : " — this canvas is prefilled from the published copy so it is not blank"}.
        </p>
      ) : (
        <p className="rounded-2xl bg-white px-4 py-3 text-sm text-muted">
          Saving publishes this body layout. Header, hero banner, footer, and template widgets stay
          outside the canvas.
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
          Add body image
        </button>
        <button type="button" className="rounded-full bg-forest px-4 py-2 text-sm text-cream" onClick={() => addBlock("button")}>
          Add button
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
        {selected ? (
          <button
            type="button"
            className="rounded-full bg-clay px-4 py-2 text-sm text-cream"
            onClick={() => removeBlock(selected.id)}
          >
            Delete selected
          </button>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-3xl border border-forest/10 bg-sand">
        <div className="pointer-events-none select-none bg-forest px-5 py-3 text-cream">
          <p className="text-[10px] uppercase tracking-[0.2em] text-cream/60">Site template · locked</p>
          <div className="mt-1 flex items-center justify-between gap-3">
            <p className="font-serif text-xl">Functional Nourishment</p>
            <p className="text-xs text-cream/70">Header · Navigation</p>
          </div>
        </div>
        <div className={`${SITE_CONTENT_CLASS} pointer-events-none select-none grid gap-4 bg-background py-6 md:grid-cols-2`}>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-teal">Hero banner · locked here</p>
            <p className="mt-2 font-serif text-3xl text-primary">{heroHeading || pageTitle}</p>
            {heroSubheading ? <p className="mt-2 text-sm text-muted">{heroSubheading}</p> : null}
            <p className="mt-3 text-xs text-muted">Change the banner photo in the Hero banner section above.</p>
          </div>
          {heroImage ? (
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-mist">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={heroImage} alt="" className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="flex aspect-[16/9] items-center justify-center rounded-2xl bg-mist text-sm text-muted">
              No hero banner
            </div>
          )}
        </div>
        {lockedAfterHero}

        <div className="border-y border-dashed border-forest/20 bg-white py-3">
          <p className={`${SITE_CONTENT_CLASS} mb-2 text-[10px] uppercase tracking-[0.2em] text-teal`}>{bodyLabel}</p>
          {mode === "preview" ? (
            <div className={`${SITE_CONTENT_CLASS} bg-background py-12 md:py-16`}>
              <LayoutDocument layout={layout} />
            </div>
          ) : (
            <div className={SITE_CONTENT_CLASS}>
              <div
                ref={canvasRef}
                tabIndex={0}
                className="fn-layout-canvas w-full overflow-visible rounded-2xl bg-background outline-none"
                style={{ height: canvasHeight * scale, minHeight: 360 }}
                onClick={() => {
                  setSelectedId(null);
                  setEditingId(null);
                }}
              >
              {layout.blocks.map((block) => {
                const active = block.id === selectedId;
                const interacting = block.id === interactingId;
                const buried = Boolean(interactingId && !interacting);
                return (
                  <div
                    key={block.id}
                    data-layout-block={block.id}
                    className={`absolute ${active ? "cursor-move ring-2 ring-teal" : "cursor-move hover:ring-1 hover:ring-teal/40"}`}
                    style={{
                      left: `${block.x}%`,
                      top: block.y * scale,
                      width: `${block.w}%`,
                      height: block.h * scale,
                      zIndex: interacting ? 1000 : active ? 800 : block.z,
                      minWidth: 0,
                      overflow: "visible",
                      pointerEvents: buried ? "none" : "auto",
                    }}
                    onClick={(event) => {
                      event.stopPropagation();
                      selectBlock(block.id);
                    }}
                    onDoubleClick={(event) => {
                      event.stopPropagation();
                      if (block.type !== "image" && block.type !== "button") setEditingId(block.id);
                    }}
                    onPointerDown={(event) => onPointerDown(event, block.id)}
                  >
                    <div className={`fn-layout-block-content${editingId === block.id ? " is-editing" : ""}`}>
                      <CanvasBlock
                        block={block}
                        editing={editingId === block.id}
                        onHtml={(html) => updateBlock(block.id, { html })}
                      />
                    </div>
                    {block.type === "image" ? (
                      <span className="pointer-events-none absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] uppercase tracking-wide text-forest">
                        Wrap: {wrapLabel(block.wrap)}
                      </span>
                    ) : null}
                    {active ? (
                      <div
                        className="absolute -top-10 right-0 z-[60] flex gap-1"
                        onPointerDown={(event) => event.stopPropagation()}
                        onClick={(event) => event.stopPropagation()}
                      >
                        <button
                          type="button"
                          className="rounded-full bg-forest px-3 py-1 text-[11px] text-cream shadow"
                          onClick={() => removeBlock(block.id)}
                        >
                          Delete
                        </button>
                      </div>
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
              {guides.map((guide, index) => (
                <div
                  key={`${guide.axis}-${guide.at}-${index}`}
                  className="fn-layout-guide pointer-events-none"
                  style={
                    guide.axis === "x"
                      ? { left: `${guide.at}%`, top: 0, width: 1, height: "100%" }
                      : { top: guide.at * scale, left: 0, height: 1, width: "100%" }
                  }
                />
              ))}
              </div>
            </div>
          )}
        </div>
        {lockedAfterBody}

        <div className="pointer-events-none select-none bg-forest px-5 py-4 text-cream">
          <p className="text-[10px] uppercase tracking-[0.2em] text-cream/60">Site template · locked</p>
          <p className="mt-1 text-sm text-cream/80">Call to action · Footer</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        {selected ? (
          <div className="grid gap-3 rounded-2xl bg-white p-5 md:grid-cols-2">
            <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-2">
              <p className="font-serif text-xl text-forest">Selected: {blockTypeLabel(selected.type)}</p>
              <button
                type="button"
                className="rounded-full bg-clay px-4 py-2 text-sm text-cream"
                onClick={() => removeBlock(selected.id)}
              >
                Delete
              </button>
            </div>
            <label className="grid gap-1 text-sm">
              Wrap
              <select
                value={selected.wrap}
                onChange={(event) => setWrap(event.target.value as LayoutWrap)}
                className="rounded-xl border border-forest/15 px-3 py-2"
              >
                {WRAP_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} — {option.hint}
                  </option>
                ))}
              </select>
              <span className="text-xs text-muted">{wrapHint(selected.wrap)}</span>
            </label>
            {selected.type === "image" ? (
              <label className="grid gap-1 text-sm">
                Image alt text
                <input
                  value={selected.alt || ""}
                  onChange={(event) => updateBlock(selected.id, { alt: event.target.value })}
                  className="rounded-xl border border-forest/15 px-3 py-2"
                  placeholder="For screen readers only"
                />
              </label>
            ) : selected.type === "button" ? (
              <label className="grid gap-1 text-sm">
                Button label
                <input
                  value={selected.label || ""}
                  onChange={(event) => updateBlock(selected.id, { label: event.target.value })}
                  className="rounded-xl border border-forest/15 px-3 py-2"
                  placeholder="Buy on Amazon"
                />
              </label>
            ) : (
              <p className="self-end text-sm text-muted">
                Double-click the box to edit text. Drag the edge handles to shrink or grow after any resize.
              </p>
            )}
            <div className="flex flex-wrap items-end gap-2 md:col-span-2">
              {selected.type === "image" ? (
                <button type="button" className="rounded-full bg-forest px-4 py-2 text-sm text-cream" onClick={() => setPicker(selected.id)}>
                  Replace body image
                </button>
              ) : null}
              <button type="button" className="rounded-full bg-mist px-4 py-2 text-sm text-forest" onClick={() => shiftLayer("front")}>
                Bring forward
              </button>
              <button type="button" className="rounded-full bg-mist px-4 py-2 text-sm text-forest" onClick={() => shiftLayer("back")}>
                Send back
              </button>
            </div>
            {selected.type === "image" ? (
              <>
                <label className="grid gap-1 text-sm">
                  Caption (optional)
                  <input
                    value={selected.caption || ""}
                    onChange={(event) => updateBlock(selected.id, { caption: event.target.value })}
                    className="rounded-xl border border-forest/15 px-3 py-2"
                    placeholder="Leave blank — alt text is not a caption"
                  />
                </label>
                <label className="grid gap-1 text-sm">
                  Photo fit
                  <select
                    value={imageFit(selected)}
                    onChange={(event) => updateBlock(selected.id, { fit: event.target.value as LayoutImageFit })}
                    className="rounded-xl border border-forest/15 px-3 py-2"
                  >
                    <option value="contain">Show full photo</option>
                    <option value="cover">Crop to fill the box</option>
                    <option value="circle">Circle crop</option>
                  </select>
                </label>
              </>
            ) : null}
            {selected.type === "button" ? (
              <>
                <label className="grid gap-1 text-sm">
                  Button URL
                  <input
                    value={selected.href || ""}
                    onChange={(event) => updateBlock(selected.id, { href: event.target.value })}
                    className="rounded-xl border border-forest/15 px-3 py-2"
                    placeholder="https://www.amazon.com/…"
                  />
                </label>
                <label className="grid gap-1 text-sm">
                  Button style
                  <select
                    value={buttonStyle(selected)}
                    onChange={(event) => updateBlock(selected.id, { style: event.target.value as LayoutButtonStyle })}
                    className="rounded-xl border border-forest/15 px-3 py-2"
                  >
                    <option value="outline">Outline</option>
                    <option value="primary">Filled</option>
                    <option value="link">Text link</option>
                  </select>
                </label>
              </>
            ) : null}
          </div>
        ) : (
          <p className="rounded-2xl bg-white px-5 py-4 text-sm text-muted">
            Select a body block to change wrap (None / Left / Right / Full), replace a photo, or delete
            it. Delete and Backspace also remove the selected block.
          </p>
        )}

        <div className="rounded-2xl bg-white p-4">
          <p className="text-sm font-medium text-forest">Blocks on this page</p>
          <p className="mt-1 text-xs text-muted">Covered or leftover images stay in this list so they can always be selected and deleted.</p>
          {orderedBlocks.length ? (
            <ul className="mt-3 grid gap-1">
              {orderedBlocks.map((block) => {
                const active = block.id === selectedId;
                return (
                  <li key={block.id} className="flex items-center gap-2">
                    <button
                      type="button"
                      className={`min-w-0 flex-1 truncate rounded-xl px-3 py-2 text-left text-sm ${
                        active ? "bg-forest text-cream" : "bg-mist text-forest"
                      }`}
                      onClick={() => selectBlock(block.id)}
                    >
                      {blockTypeLabel(block.type)}
                      {block.type === "image" ? ` · ${wrapLabel(block.wrap)}` : ""}
                      {block.type === "button" && block.label ? ` · ${block.label}` : ""}
                    </button>
                    <button
                      type="button"
                      className="rounded-full bg-clay/10 px-2.5 py-1 text-xs text-forest"
                      onClick={() => removeBlock(block.id)}
                    >
                      Delete
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted">No body blocks yet.</p>
          )}
        </div>
      </div>

      {picker ? (
        <MediaPicker
          key={picker}
          asField={false}
          hideTrigger
          defaultOpen
          label="Choose a body image"
          help="This photo is placed on the body canvas. It does not replace the hero banner."
          onSelect={(item) => {
            const current = layoutRef.current;
            if (picker === "new") {
              const block = {
                ...createBlankBlock("image", nextBlockY(current.blocks)),
                src: item.url,
                alt: item.alt || "",
                z: nextBlockZ(current.blocks),
              };
              commit({ ...current, blocks: [...current.blocks, block] });
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
  if (block.type === "button") {
    const label = layoutButtonLabel(block) || "Button";
    return (
      <div className="pointer-events-none flex h-full items-start">
        <span className={layoutButtonClass(buttonStyle(block))}>{label}</span>
      </div>
    );
  }

  if (block.type === "image") {
    if (!block.src) {
      return <div className="flex h-full items-center justify-center rounded-2xl bg-mist text-sm text-muted">No image yet</div>;
    }
    const fit = imageFit(block);
    const imageClass =
      fit === "circle"
        ? "h-full w-full rounded-full object-cover"
        : fit === "cover"
          ? "h-full w-full rounded-2xl object-cover"
          : "h-full w-full rounded-2xl object-contain";
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={block.src} alt={block.alt || ""} className={imageClass} draggable={false} />
    );
  }

  const className =
    block.type === "heading"
      ? "h-full min-w-0 overflow-hidden font-serif text-3xl text-primary"
      : block.type === "quote"
        ? "h-full min-w-0 overflow-hidden border-l-4 border-teal pl-4 font-serif text-2xl italic text-primary"
        : "prose-fn h-full min-w-0 max-w-none overflow-hidden";

  return (
    <div
      className={`${className} ${editing ? "cursor-text overflow-auto rounded-md bg-white/80 outline outline-teal" : ""}`}
      contentEditable={editing}
      suppressContentEditableWarning
      onBlur={(event) => onHtml(event.currentTarget.innerHTML)}
      dangerouslySetInnerHTML={{ __html: block.html || "" }}
    />
  );
}
