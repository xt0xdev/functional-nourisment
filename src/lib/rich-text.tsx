import { SmartImage } from "@/components/site/SmartImage";

export function renderRichText(body: string) {
  return body.split(/\n\n+/).map((block, index) => {
    const image = block.trim().match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (image) {
      return (
        <figure key={index} className="my-6">
          <SmartImage src={image[2]} alt={image[1]} className="h-auto w-full rounded-2xl" sizes="(min-width: 768px) 700px, 100vw" />
          {image[1] ? <figcaption className="mt-2 text-sm text-muted">{image[1]}</figcaption> : null}
        </figure>
      );
    }
    if (block.startsWith("## ")) {
      return (
        <h2 key={index} className="font-serif text-3xl text-forest">
          {block.replace(/^## /, "")}
        </h2>
      );
    }
    if (/^\d+\.\s/.test(block)) {
      return (
        <p key={index} className="text-muted">
          {block}
        </p>
      );
    }
    return (
      <p key={index} className="leading-relaxed text-muted">
        {block}
      </p>
    );
  });
}
