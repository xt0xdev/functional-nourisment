import Image from "next/image";

export function Logo({
  className = "h-14 w-14",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/images/functional-nourishment-logo.png"
      alt="Functional Nourishment"
      width={256}
      height={256}
      className={`rounded-full bg-transparent ${className}`}
      priority={priority}
    />
  );
}
