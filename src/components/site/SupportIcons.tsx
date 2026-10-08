import { Apple, Dumbbell, Droplet, HeartPulse } from "lucide-react";
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

/** Clinical J-shaped stomach outline with esophagus — Gut & Digestive Health */
export function StomachIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M9.5 2.2v5" />
      <path d="M11.6 2.2v4.3" />
      <path d="M9.5 7.2c-3.7.4-5.6 3.1-5.45 6.6.2 4.4 3.8 7.4 8.2 7.15 3.4-.2 5.9-2.8 5.7-5.8" />
      <path d="M11.6 6.5c1.35 2.2 1.5 5.4.35 8.1-.75 1.8.35 3.15 2.55 2.85 1.7-.25 2.85-1.5 3.55-2.75" />
      <path d="M18.05 14.7c1.35-1.15 2.65-2.5 2.85-4.4" />
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
  bowl: Apple,
  apple: Apple,
  carrot: Apple,
  foods: Apple,
  lotus: LotusIcon,
  flower: LotusIcon,
  meditate: LotusIcon,
  meditation: LotusIcon,
} as const;

export function resolveAreaIcon(title?: string | null, icon?: string | null) {
  const key = resolveAreaIconKey(title, icon) as AreaIconKey;
  return areaIcons[key] || LotusIcon;
}
