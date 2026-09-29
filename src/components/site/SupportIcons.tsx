import { Dumbbell, Droplet, HeartPulse } from "lucide-react";

type IconProps = { className?: string; strokeWidth?: number };

function GutIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M7 4.2c-2.4.3-3.7 2.2-3.7 4.4 0 2.6 2.1 3.7 4.2 4.7 1.6.8 3.1 1.5 3.1 3 0 1.3-1.2 2.3-2.7 2.3-1.5 0-2.6-1-3-2" />
      <path d="M17 4.2c2.4.3 3.7 2.2 3.7 4.4 0 2.3-1.5 3.5-3.4 4.5" />
      <path d="M10.2 16.6c.6 1.8 2.2 3 4.2 3 2.8 0 4.8-2.1 4.8-4.8 0-2-1.4-3.3-3.2-4.2" />
      <path d="M6.8 20.6c1.3.8 2.8 1.2 4.4 1.2 1.6 0 3-.4 4.2-1.2" />
    </svg>
  );
}

function FruitBowlIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4.2 13.2h15.6" />
      <path d="M5.2 13.2c.8 4.6 3.8 7.2 6.8 7.2s6-2.6 6.8-7.2" />
      <circle cx="9" cy="9.1" r="2.7" />
      <path d="M9 6.4c.4-1.2 1.4-2 2.4-2.2" />
      <circle cx="14.7" cy="9.4" r="2.5" />
      <path d="M12.2 7.4c1.2-2 3-2.5 4-1.9-.2 1.4-1.8 2.6-3.6 2.4" />
    </svg>
  );
}

function LotusIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 20.2c0-5.2-2.6-8.4-7.4-10 1.8 3.6 4.2 6.2 7.4 7.8 3.2-1.6 5.6-4.2 7.4-7.8-4.8 1.6-7.4 4.8-7.4 10Z" />
      <path d="M12 20.2c0-4.2-3.6-7.2-8.2-8 2.4 3.2 5 5.6 8.2 7 3.2-1.4 5.8-3.8 8.2-7-4.6.8-8.2 3.8-8.2 8Z" />
      <path d="M12 20.2V8.6" />
      <path d="M7.4 8.2C9 6 10.7 5 12 5c1.3 0 3 1 4.6 3.2" />
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
