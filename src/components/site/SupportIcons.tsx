import { Dumbbell, Droplet, HeartPulse } from "lucide-react";

type IconProps = { className?: string; strokeWidth?: number };

function GutIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M8.2 3.8c-2.6.2-4.4 2.1-4.4 4.7 0 2.3 1.5 3.5 3.4 4.4 1.5.7 2.8 1.3 2.8 2.5 0 1.1-1 1.9-2.3 1.9-1.4 0-2.4-.9-2.7-1.9" />
      <path d="M15.8 3.8c2.6.2 4.4 2.1 4.4 4.7 0 2.1-1.3 3.3-3 4.2" />
      <path d="M9.8 15.8c.4 1.6 1.8 2.8 3.7 2.8 2.6 0 4.5-1.9 4.5-4.4 0-1.8-1.2-3-2.8-3.9" />
      <path d="M7.2 20.4c1.1.7 2.4 1.1 3.8 1.1 1.3 0 2.5-.3 3.5-.9" />
    </svg>
  );
}

function FruitBowlIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 13.5h16" />
      <path d="M5 13.5c.7 4.2 3.5 6.8 7 6.8s6.3-2.6 7-6.8" />
      <circle cx="9.2" cy="9.4" r="2.6" />
      <path d="M9.2 6.8c.3-1.1 1.2-1.8 2.2-2" />
      <circle cx="14.6" cy="9.8" r="2.4" />
      <path d="M12.4 7.6c1.1-1.8 2.8-2.3 3.7-1.8-.3 1.3-1.7 2.5-3.4 2.3" />
    </svg>
  );
}

function LotusIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 20c0-4.2-2.4-7.2-6.8-8.6 1.6 3.4 3.8 5.8 6.8 7.2 3-1.4 5.2-3.8 6.8-7.2C14.4 12.8 12 15.8 12 20Z" />
      <path d="M12 20c0-3.6-3.2-6.4-7.6-7.2 2.2 3 4.6 5.2 7.6 6.4 3-1.2 5.4-3.4 7.6-6.4C15.2 13.6 12 16.4 12 20Z" />
      <path d="M12 20c0-5.4 2.6-8.6 7.2-10" />
      <path d="M12 20c0-5.4-2.6-8.6-7.2-10" />
      <path d="M7.2 8C8.8 6 10.6 5.1 12 5c1.4.1 3.2 1 4.8 3" />
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
