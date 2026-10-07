import { Dumbbell, Droplet, HeartPulse } from "lucide-react";

type IconProps = { className?: string; strokeWidth?: number };

function GutIcon({ className, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Large intestine: cecum, colon frame, sigmoid */}
      <path d="M6.2 20.2c-1.95.2-3.1-1.15-2.95-3 .2-2.55.05-5.7.2-8.25C3.6 6.05 5.5 4 8.2 4.1c2.35.1 4.9-.2 7.15.25 2.3.45 3.55 2.25 3.4 4.55-.2 2.7.15 5.15-.2 7-.4 2.1-2.2 3.2-4.05 2.85" />
      <path d="M14.5 16.5c.15 1.55-.55 3.05-2.15 3.5-1.25.35-2.4 0-3.15-.85" />
      {/* Small intestine: packed curved loops */}
      <path d="M8.85 7.05a1.55 1.55 0 1 1 0 3.1" />
      <path d="M13.75 7.15a1.5 1.5 0 1 0 0 3" />
      <path d="M8.95 10.75a1.5 1.5 0 1 1 0 3" />
      <path d="M13.85 10.85a1.5 1.5 0 1 0 0 3" />
      <path d="M11.35 14.35a1.4 1.4 0 1 1 0 2.8" />
    </svg>
  );
}

function FruitBowlIcon({ className, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Apple */}
      <path d="M8.35 8.7c-2.1.15-3.6 1.95-3.6 4.2 0 2.8 2 5.15 3.95 5.15.45 0 .75-.26 1.05-.26.3 0 .6.26 1.05.26 1.95 0 3.95-2.35 3.95-5.15 0-2.25-1.5-4.05-3.6-4.2-.55 1.2-2.1 1.2-2.8 0Z" />
      <path d="M8.65 8.55c.25-1.4 1.2-2.35 2.4-2.6" />
      <path d="M8.85 7.15c1.1-.2 2 .5 2.15 1.45" />
      {/* Fat tapered carrot, rings, and fanned greens */}
      <path d="M13.85 8.85 20.7 6.7 15.7 20.35Z" />
      <path d="M15.15 11.85 18.35 10.8" />
      <path d="M15.25 14.95 17.75 14.1" />
      <path d="M16.2 7.15C15.7 4.7 14.55 3.15 13.2 2.85" />
      <path d="M17.35 6.85C17.55 4.35 18.35 2.7 19.4 2.45" />
      <path d="M18.5 6.55C19.7 4.6 21.15 3.55 22.2 3.7" />
    </svg>
  );
}

function LotusIcon({ className, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Circular head, no facial details */}
      <circle cx="12" cy="4.15" r="2" />
      {/* Upright torso */}
      <path d="M9.35 8c.7-1.15 1.7-1.7 2.65-1.7s1.95.55 2.65 1.7" />
      <path d="M9.35 8 9.6 12.7" />
      <path d="M14.65 8 14.4 12.7" />
      <path d="M9.6 12.7h4.8" />
      {/* Arms to knees, hands resting */}
      <path d="M9.35 8.3C7.25 10 5.7 12.15 4.9 14.3" />
      <path d="M14.65 8.3C16.75 10 18.3 12.15 19.1 14.3" />
      <circle cx="4.7" cy="14.85" r=".9" />
      <circle cx="19.3" cy="14.85" r=".9" />
      {/* Thighs to knees; shins cross as an X */}
      <path d="M9.6 12.7C7.4 13.25 5.8 14 4.85 14.95" />
      <path d="M14.4 12.7C16.6 13.25 18.2 14 19.15 14.95" />
      <path d="M4.95 15.15C8.2 17.9 12.6 20.55 16.35 20.85" />
      <path d="M19.05 15.15C15.8 17.9 11.4 20.55 7.65 20.85" />
    </svg>
  );
}

export const areaIcons = {
  heart: HeartPulse,
  droplet: Droplet,
  weight: Dumbbell,
  gut: GutIcon,
  bowl: FruitBowlIcon,
  lotus: LotusIcon,
} as const;
