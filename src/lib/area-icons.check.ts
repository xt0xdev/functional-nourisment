import { Apple } from "lucide-react";
import { resolveAreaIcon, StomachIcon } from "../components/site/SupportIcons";
import { NUTRITION_AREAS, resolveAreaIconKey } from "./page-copy";

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

const gut = resolveAreaIconKey("Gut & Digestive Health", "lotus");
const deficiency = resolveAreaIconKey("Nutritional Deficiencies", "lotus");
const wellbeing = resolveAreaIconKey("General Well-Being & Stress Support", "bowl");

assert(gut === "gut", "gut title must resolve to the stomach icon");
assert(deficiency === "bowl", "deficiency title must resolve to the apple icon key");
assert(wellbeing === "lotus", "well-being title must keep the lotus");
assert(new Set([gut, deficiency, wellbeing]).size === 3, "the three area cards must stay distinct");
assert(
  resolveAreaIcon("Gut & Digestive Health", "lotus") === StomachIcon,
  "gut card must render the J-shaped stomach, not a cross or wellness glyph",
);
assert(
  resolveAreaIcon("Nutritional Deficiencies", "lotus") === Apple,
  "deficiency card must render a single apple, not apple and carrot",
);
assert(
  resolveAreaIcon("General Well-Being & Stress Support", "bowl") !== Apple &&
    resolveAreaIcon("General Well-Being & Stress Support", "bowl") !== StomachIcon,
  "well-being card must keep the lotus",
);

assert(
  resolveAreaIconKey("Gut & Digestive Health", "bowl") === "gut",
  "stale apple/bowl keys must not replace the gut title",
);
assert(
  resolveAreaIconKey("Nutritional Deficiencies", "gut") === "bowl",
  "stale gut keys must not replace the deficiency title",
);
assert(
  resolveAreaIconKey("General Well-Being & Stress Support", "gut") === "lotus",
  "stale gut keys must not replace the lotus title",
);
assert(
  resolveAreaIconKey("Gut & Digestive Health", "cross") === "gut",
  "medical-cross leftovers must still resolve to the gut card",
);

const keys = NUTRITION_AREAS.map((area) => resolveAreaIconKey(area.title, area.icon));
assert(new Set(keys).size === keys.length, "every default nutrition area must keep its own icon");

console.log("area-icons.check: ok");
