import {
  CANVAS_WIDTH,
  MIN_BLOCK_HEIGHT,
  MIN_BLOCK_WIDTH_PCT,
  clamp,
  type LayoutBlock,
  type LayoutWrap,
} from "./page-layout";

export type ResizeHandle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";
export type TransformMode = "move" | ResizeHandle;

export { MIN_BLOCK_HEIGHT, MIN_BLOCK_WIDTH_PCT };
export const SNAP_THRESHOLD_PX = 8;

export type SnapGuide = {
  axis: "x" | "y";
  /** x guides are canvas percent; y guides are design pixels. */
  at: number;
};

export function percentFromDelta(dx: number, canvasCssWidth: number) {
  if (!canvasCssWidth) return 0;
  return (dx / canvasCssWidth) * 100;
}

function pctToPx(pct: number) {
  return (pct / 100) * CANVAS_WIDTH;
}

function pxToPct(px: number) {
  return (px / CANVAS_WIDTH) * 100;
}

export function applyDrag(origin: LayoutBlock, mode: TransformMode, dxPct: number, dy: number): LayoutBlock {
  if (mode === "move") {
    const next = {
      ...origin,
      x: clamp(origin.x + dxPct, 0, 100 - origin.w),
      y: Math.max(0, origin.y + dy),
    };
    return withWrapForGeometry(origin, next);
  }

  let { x, y, w, h } = origin;
  if (mode.includes("e")) {
    w = clamp(origin.w + dxPct, MIN_BLOCK_WIDTH_PCT, 100 - origin.x);
  }
  if (mode.includes("s")) {
    h = Math.max(MIN_BLOCK_HEIGHT, origin.h + dy);
  }
  if (mode.includes("w")) {
    const right = origin.x + origin.w;
    w = clamp(origin.w - dxPct, MIN_BLOCK_WIDTH_PCT, right);
    x = clamp(right - w, 0, 100 - w);
  }
  if (mode.includes("n")) {
    const bottom = origin.y + origin.h;
    h = Math.max(MIN_BLOCK_HEIGHT, origin.h - dy);
    y = Math.max(0, bottom - h);
  }

  return withWrapForGeometry(origin, { ...origin, x, y, w, h });
}

function withWrapForGeometry(origin: LayoutBlock, next: LayoutBlock): LayoutBlock {
  let wrap: LayoutWrap = next.wrap;
  const movedOrResizedWidth = Math.abs(next.x - origin.x) > 0.001 || Math.abs(next.w - origin.w) > 0.001;
  if (origin.wrap === "full" && movedOrResizedWidth) {
    wrap = "none";
  }
  return { ...next, wrap };
}

function nearestTarget(value: number, targets: number[], threshold: number) {
  let best: { at: number; dist: number } | null = null;
  for (const at of targets) {
    const dist = Math.abs(at - value);
    if (dist <= threshold && (!best || dist < best.dist)) {
      best = { at, dist };
    }
  }
  return best;
}

function collectTargets(others: LayoutBlock[], canvasHeight: number) {
  const xTargets = [0, CANVAS_WIDTH / 2, CANVAS_WIDTH];
  const yTargets = [0, canvasHeight / 2, canvasHeight];
  for (const other of others) {
    const left = pctToPx(other.x);
    const right = pctToPx(other.x + other.w);
    xTargets.push(left, right, (left + right) / 2);
    yTargets.push(other.y, other.y + other.h, other.y + other.h / 2);
  }
  return { xTargets, yTargets };
}

export function snapBlock(
  block: LayoutBlock,
  mode: TransformMode,
  others: LayoutBlock[],
  canvasHeight: number,
  thresholdPx = SNAP_THRESHOLD_PX,
): { block: LayoutBlock; guides: SnapGuide[] } {
  const { xTargets, yTargets } = collectTargets(others, canvasHeight);
  const guides: SnapGuide[] = [];

  let left = pctToPx(block.x);
  let width = pctToPx(block.w);
  let right = left + width;
  let top = block.y;
  let height = block.h;
  let bottom = top + height;

  const minWidthPx = pctToPx(MIN_BLOCK_WIDTH_PCT);

  if (mode === "move") {
    const edgesX = [left, (left + right) / 2, right];
    let bestX: { delta: number; at: number } | null = null;
    for (const edge of edgesX) {
      const hit = nearestTarget(edge, xTargets, thresholdPx);
      if (!hit) continue;
      const delta = hit.at - edge;
      if (!bestX || Math.abs(delta) < Math.abs(bestX.delta)) bestX = { delta, at: hit.at };
    }
    if (bestX) {
      left += bestX.delta;
      right += bestX.delta;
      guides.push({ axis: "x", at: pxToPct(bestX.at) });
    }

    const edgesY = [top, (top + bottom) / 2, bottom];
    let bestY: { delta: number; at: number } | null = null;
    for (const edge of edgesY) {
      const hit = nearestTarget(edge, yTargets, thresholdPx);
      if (!hit) continue;
      const delta = hit.at - edge;
      if (!bestY || Math.abs(delta) < Math.abs(bestY.delta)) bestY = { delta, at: hit.at };
    }
    if (bestY) {
      top += bestY.delta;
      bottom += bestY.delta;
      guides.push({ axis: "y", at: bestY.at });
    }
  } else {
    if (mode.includes("e")) {
      const hit = nearestTarget(right, xTargets, thresholdPx);
      if (hit && hit.at - left >= minWidthPx) {
        right = hit.at;
        width = right - left;
        guides.push({ axis: "x", at: pxToPct(hit.at) });
      }
    }
    if (mode.includes("w")) {
      const hit = nearestTarget(left, xTargets, thresholdPx);
      if (hit && right - hit.at >= minWidthPx) {
        left = Math.max(0, hit.at);
        width = right - left;
        guides.push({ axis: "x", at: pxToPct(left) });
      }
    }
    if (mode.includes("s")) {
      const hit = nearestTarget(bottom, yTargets, thresholdPx);
      if (hit && hit.at - top >= MIN_BLOCK_HEIGHT) {
        bottom = hit.at;
        height = bottom - top;
        guides.push({ axis: "y", at: hit.at });
      }
    }
    if (mode.includes("n")) {
      const hit = nearestTarget(top, yTargets, thresholdPx);
      if (hit && bottom - hit.at >= MIN_BLOCK_HEIGHT) {
        top = Math.max(0, hit.at);
        height = bottom - top;
        guides.push({ axis: "y", at: top });
      }
    }
  }

  left = clamp(left, 0, CANVAS_WIDTH - minWidthPx);
  if (mode !== "move" && (mode.includes("e") || mode.includes("w"))) {
    width = right - left;
  }
  width = clamp(width, minWidthPx, CANVAS_WIDTH - left);
  top = Math.max(0, top);
  if (mode !== "move" && (mode.includes("n") || mode.includes("s"))) {
    height = bottom - top;
  }
  height = Math.max(MIN_BLOCK_HEIGHT, height);

  const next = {
    ...block,
    x: pxToPct(left),
    w: pxToPct(width),
    y: top,
    h: height,
  };
  return { block: withWrapForGeometry(block, next), guides };
}
