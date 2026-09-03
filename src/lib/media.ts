export type MediaDTO = {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  alt: string;
  caption: string;
  createdAt: string;
};

export function toMediaDTO(media: {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  alt: string;
  caption: string;
  createdAt: Date;
}): MediaDTO {
  return {
    id: media.id,
    filename: media.filename,
    url: media.url,
    mimeType: media.mimeType,
    size: media.size,
    width: media.width,
    height: media.height,
    alt: media.alt,
    caption: media.caption,
    createdAt: media.createdAt.toISOString(),
  };
}

export const eventMediaInclude = {
  coverImage: true,
  images: { orderBy: { sortOrder: "asc" as const }, include: { media: true } },
};
