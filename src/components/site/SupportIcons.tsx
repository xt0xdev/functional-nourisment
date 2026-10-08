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

/** Clinical J-shaped stomach with esophagus — Gut & Digestive Health */
export function StomachIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M9.6 2.2v5.4" />
      <path d="M9.6 7.6c-3.85.2-6.2 2.7-6.25 6.05C3.25 18.3 6.7 22.2 11.9 22.3c3.55.08 6.05-2.3 5.95-5.4-.08-2.15-1.55-3.2-1.2-5.75.3-2 1.85-3.15 4.05-3" />
      <path d="M10 9.2c1.2 2.3 1.3 4.9.05 7.1" />
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
