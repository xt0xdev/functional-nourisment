import Image from "next/image";

type SmartImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  width?: number;
  height?: number;
};

export function SmartImage({ src, alt, fill, className, sizes, priority, width, height }: SmartImageProps) {
  if (!src) return null;
  const usable = src.startsWith("/") || src.startsWith("https://") || src.startsWith("http://");
  if (!usable) {
    return <img src={src} alt={alt} className={className} />;
  }
  if (fill) {
    return <Image src={src} alt={alt} fill className={className} sizes={sizes} priority={priority} />;
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={width || 1600}
      height={height || 1066}
      className={className}
      sizes={sizes}
      priority={priority}
    />
  );
}
