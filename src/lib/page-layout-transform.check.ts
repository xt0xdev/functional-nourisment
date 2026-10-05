import { applyDrag, snapBlock, SNAP_THRESHOLD_PX } from "./page-layout-transform";
import type { LayoutBlock } from "./page-layout";

function block(partial: Partial<LayoutBlock> & Pick<LayoutBlock, "id">): LayoutBlock {
  return {
    type: "text",
    x: 0,
    y: 0,
    w: 100,
    h: 120,
    z: 1,
    wrap: "full",
    html: "<p>Hello</p>",
    ...partial,
  };
}

function assert(condition: unknown, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

function almost(actual: number, expected: number, message: string, epsilon = 0.05) {
  assert(Math.abs(actual - expected) <= epsilon, `${message} (got ${actual}, expected ${expected})`);
}

const full = block({ id: "full" });

const firstEast = applyDrag(full, "e", -30, 0);
assert(firstEast.w < 100, `east shrink should reduce width, got ${firstEast.w}`);
assert(firstEast.w > 8, `east shrink should stay above min width, got ${firstEast.w}`);
assert(firstEast.wrap === "none", `width change must leave full-wrap so later shrinks are not locked, got ${firstEast.wrap}`);

const secondEast = applyDrag(firstEast, "e", -20, 0);
assert(secondEast.w < firstEast.w, `second east shrink is the reported bug: ${firstEast.w} -> ${secondEast.w}`);

const grown = applyDrag(firstEast, "e", 15, 0);
assert(grown.w > firstEast.w, `width must grow after a shrink: ${firstEast.w} -> ${grown.w}`);

const west = applyDrag(full, "w", 25, 0);
assert(west.w < 100 && west.x > 0, `west shrink should move the left edge, got x=${west.x} w=${west.w}`);
const westAgain = applyDrag(west, "w", 15, 0);
assert(westAgain.w < west.w, `second west shrink failed: ${west.w} -> ${westAgain.w}`);

const aboutStyle = block({ id: "about", x: 42, w: 58, wrap: "full" });
const taller = applyDrag(aboutStyle, "s", 0, 80);
almost(taller.w, 58, "height-only resize must not force full width");
almost(taller.x, 42, "height-only resize must not reset x");
assert(taller.wrap === "full", "height-only resize should keep wrap=full");
assert(taller.h === 200, `height should grow, got ${taller.h}`);

const afterHeightWidth = applyDrag(taller, "e", -18, 0);
assert(afterHeightWidth.w < taller.w, `width shrink after a height resize must work: ${taller.w} -> ${afterHeightWidth.w}`);
assert(afterHeightWidth.wrap === "none", "shrinking a full-wrap box should switch to freeform");

const image = block({ id: "img", type: "image", x: 0, w: 38, h: 460, wrap: "left" });
const moved = applyDrag(image, "move", 10, 12);
almost(moved.x, 10, "move should update x");
assert(moved.y === 12, `move should update y, got ${moved.y}`);
assert(moved.wrap === "left", "moving a wrap-left image should keep wrap");

const neighbor = block({ id: "n", x: 40, w: 20, y: 100, h: 80, wrap: "none" });
const approaching = applyDrag(block({ id: "m", x: 8, w: 20, y: 100, h: 80, wrap: "none" }), "move", 11.6, 0);
const snapped = snapBlock(approaching, "move", [neighbor], 640, SNAP_THRESHOLD_PX);
almost(snapped.block.x + snapped.block.w, 40, "right edge should affix to the neighbor's left edge");
assert(snapped.guides.some((guide) => guide.axis === "x"), "snap should emit a vertical guide");

const far = applyDrag(block({ id: "far", x: 8, w: 20, y: 100, h: 80, wrap: "none" }), "move", 20, 0);
const unsnapped = snapBlock(far, "move", [neighbor], 640, SNAP_THRESHOLD_PX);
assert(
  Math.abs(unsnapped.block.x + unsnapped.block.w - 40) > 1,
  "snap must not glue when the edge is farther than the threshold",
);

console.log("page-layout-transform checks passed");
