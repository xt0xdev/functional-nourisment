export function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2" />
      <path
        d="M32 14c0 10-6 14-6 22 0 4 2.6 8 6 8s6-4 6-8c0-8-6-12-6-22Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M20 30c8 1 10 6 12 12M44 30c-8 1-10 6-12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M18 24c6 3 10 2 14 0M46 24c-6 3-10 2-14 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="32" cy="46" r="2.2" fill="currentColor" />
    </svg>
  );
}
