import { Dumbbell, Droplet, HeartPulse, Pill } from "lucide-react";

function GutIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M8 4c-2.2.4-3.5 2.2-3.5 4.4 0 3 2.4 4.2 4.6 5.2 1.7.8 3.4 1.6 3.4 3.4 0 1.6-1.3 2.8-3 2.8-1.3 0-2.4-.7-2.8-1.7" />
      <path d="M16 4c2.2.4 3.5 2.2 3.5 4.4 0 2.2-1.3 3.4-2.8 4.3" />
      <path d="M14.8 14.2c1.5.8 2.7 1.9 2.7 3.6 0 1.8-1.5 3.2-3.5 3.2-1.4 0-2.6-.7-3.1-1.7" />
    </svg>
  );
}

function LotusIcon({ className }: { className?: string }) {
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
      <path d="M12 20c0-3.2-1.8-5.5-4.2-6.8C6 12.3 5 10.6 5 8.8c0 0 3.2.6 7 4.2 3.8-3.6 7-4.2 7-4.2 0 1.8-1 3.5-2.8 4.4C13.8 14.5 12 16.8 12 20Z" />
      <path d="M12 20c0-4.5 2.4-7.4 6.2-8.8" />
      <path d="M12 20c0-4.5-2.4-7.4-6.2-8.8" />
      <path d="M8 7.5C9.4 6 11 5.2 12 5c1 .2 2.6 1 4 2.5" />
    </svg>
  );
}

export const areaIcons = {
  heart: HeartPulse,
  droplet: Droplet,
  weight: Dumbbell,
  gut: GutIcon,
  pill: Pill,
  lotus: LotusIcon,
} as const;
