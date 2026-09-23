import { prisma } from "@/lib/prisma";
import { blobAdminNote, BLOB_REQUIRED_MESSAGE, formatBytes, storageDriver, storageLabel } from "@/lib/storage";
import { MediaLibrary } from "./media-library";

export default async function AdminMediaPage() {
  const items = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });
  const driver = storageDriver();

  return (
    <div>
      <h1 className="font-serif text-4xl text-forest">Media library</h1>
      <p className="mt-2 max-w-3xl text-sm text-muted">
        Upload photos for events, pages, and journal posts. Only the image URL, alt text, and caption are stored in
        Postgres — the files themselves live in {storageLabel(driver)}.
      </p>
      <div className="mt-4 rounded-2xl bg-white p-4 text-sm text-muted">
        <p>
          <span className="font-medium text-forest">Storage:</span> {storageLabel(driver)}
        </p>
        <p className={`mt-2 ${driver === "unconfigured" ? "text-clay" : ""}`}>{blobAdminNote(driver)}</p>
        <p className="mt-2">
          Neon free tier is about 0.5 GB of storage and limited compute. Putting image binaries in Postgres would exhaust
          that quickly. URLs-only is safe: a thousand CMS rows are still tiny compared with one photo.
        </p>
      </div>
      <MediaLibrary
        initialItems={items.map((item) => ({
          id: item.id,
          filename: item.filename,
          url: item.url,
          mimeType: item.mimeType,
          size: item.size,
          width: item.width,
          height: item.height,
          alt: item.alt,
          caption: item.caption,
          createdAt: item.createdAt.toISOString(),
        }))}
        driver={driver}
        uploadBlocked={driver === "unconfigured"}
        uploadBlockedMessage={driver === "unconfigured" ? BLOB_REQUIRED_MESSAGE : ""}
      />
      <p className="mt-4 text-xs text-muted">{items.length} files · {formatBytes(items.reduce((sum, item) => sum + item.size, 0))} tracked</p>
    </div>
  );
}
