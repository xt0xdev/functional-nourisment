import { Dumbbell, Droplet, HeartPulse } from "lucide-react";
import { resolveAreaIconKey, type AreaIconKey } from "@/lib/page-copy";

type IconProps = { className?: string; strokeWidth?: number };

function iconProps({ className, strokeWidth = 1.6 }: IconProps) {
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true as const,
  };
}

/** J-shaped stomach outline — Gut & Digestive Health */
function StomachIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path
        fill="none"
        d="M8.6 2.5c-.1 2.7-1.2 4.3-3 6.1-2.2 2.2-2.8 6.6-.4 10 2.2 3 7.4 3.8 11 1.4 2.6-1.8 3.4-5.4 1.2-8.2-1.2-1.6-1.4-2.6-.6-4.8L17.6 3.2l-3 1c-.6 3.2-2.2 5-4.4 4.6-1-.2-1.4-2.2-1.4-4.6Z"
      />
    </svg>
  );
}

/** Grouped apple + carrot — Nutritional / Nutrient Deficiencies */
function AppleCarrotIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path
        fill="none"
        d="M8.2 6.6c-.55-.7-1.35-1.1-2.25-1.1-1.95 0-3.4 1.9-3.4 4.75 0 3.9 2.5 9.05 5.2 9.05.45 0 .8-.22 1.15-.22s.7.22 1.15.22c2.7 0 5.2-5.15 5.2-9.05 0-2.85-1.45-4.75-3.4-4.75-.9 0-1.7.4-2.25 1.1Z"
      />
      <path fill="none" d="M9 6.15c.3-1.5 1.25-2.5 2.5-2.8" />
      <path fill="none" d="M10.2 5.05c1.4-.15 2.55.7 2.7 2-1.4.15-2.55-.7-2.7-2Z" />
      <path fill="none" d="M14.95 8.55 20.35 7.45 16.7 21Z" />
      <path fill="none" d="M16.85 8c-.55-2.55-1.45-4.15-2.75-4.55" />
      <path fill="none" d="M18 7.75c.85-2.6 2-4.2 3.4-4.45" />
    </svg>
  );
}

/** Five-petal line lotus — Well-Being & Stress Support */
function LotusIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path fill="none" d="M12 20.8C7.5 14.5 7.5 6 12 2C16.5 6 16.5 14.5 12 20.8Z" />
      <path fill="none" d="M12 20.6C7 16.5 3.5 10 5.4 3.8C9.5 6.5 11.2 13.5 12 20.6Z" />
      <path fill="none" d="M12 20.6C17 16.5 20.5 10 18.6 3.8C14.5 6.5 12.8 13.5 12 20.6Z" />
      <path fill="none" d="M12 20.6C7.5 18.5 2.2 16.8 1.4 11.2C6.5 12.2 9.8 16.5 12 20.6Z" />
      <path fill="none" d="M12 20.6C16.5 18.5 21.8 16.8 22.6 11.2C17.5 12.2 14.2 16.5 12 20.6Z" />
    </svg>
  );
}

export const areaIcons = {
  heart: HeartPulse,
  droplet: Droplet,
  weight: Dumbbell,
  gut: StomachIcon,
  stomach: StomachIcon,
  bowl: AppleCarrotIcon,
  apple: AppleCarrotIcon,
  carrot: AppleCarrotIcon,
  foods: AppleCarrotIcon,
  lotus: LotusIcon,
  flower: LotusIcon,
  meditate: LotusIcon,
  meditation: LotusIcon,
} as const;

export function resolveAreaIcon(title?: string | null, icon?: string | null) {
  const key = resolveAreaIconKey(title, icon) as AreaIconKey;
  return areaIcons[key] || LotusIcon;
}
