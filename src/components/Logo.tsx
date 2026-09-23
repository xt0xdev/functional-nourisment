import Image from "next/image";

export function Logo({
  className = "h-16 w-16",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/images/functional-nourishment-logo.png"
      alt="Functional Nourishment — Nourishment for Mind, Body and Spirit"
      width={512}
      height={512}
      className={`rounded-full bg-transparent ${className}`}
      priority={priority}
      quality={100}
      unoptimized
    />
  );
}
