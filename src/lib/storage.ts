import { randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { del, put } from "@vercel/blob";
import { ALLOWED_IMAGE_TYPE_SET, MAX_UPLOAD_BYTES } from "./media-constants";

export { MAX_UPLOAD_BYTES, ALLOWED_IMAGE_TYPE_SET as ALLOWED_IMAGE_TYPES } from "./media-constants";

export type StorageDriver = "vercel-blob" | "filesystem";

export type SavedUpload = {
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
};

export function storageDriver(): StorageDriver {
  return process.env.BLOB_READ_WRITE_TOKEN ? "vercel-blob" : "filesystem";
}

export function storageLabel(driver: StorageDriver = storageDriver()) {
  return driver === "vercel-blob"
    ? "Vercel Blob (persistent object storage)"
    : "Local filesystem (public/uploads)";
}

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function assertAllowedImage(file: { type: string; size: number }) {
  if (!ALLOWED_IMAGE_TYPE_SET.has(file.type)) {
    throw new Error("Please upload a JPEG, PNG, WebP, or GIF image.");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Images must be 10 MB or smaller.");
  }
}

export function safeFilename(original: string, mimeType: string) {
  const extFromName = path.extname(original).replace(/^\./, "").toLowerCase();
  const ext = EXT_BY_TYPE[mimeType] || (["jpg", "jpeg", "png", "webp", "gif"].includes(extFromName) ? extFromName : "img");
  return `${Date.now()}-${randomUUID()}.${ext}`;
}

export async function saveUpload(file: File): Promise<SavedUpload> {
  assertAllowedImage(file);
  const filename = safeFilename(file.name, file.type);
  const buffer = Buffer.from(await file.arrayBuffer());
  const dimensions = readImageSize(buffer);

  if (storageDriver() === "vercel-blob") {
    const blob = await put(filename, buffer, {
      access: "public",
      contentType: file.type,
      addRandomSuffix: false,
    });
    return {
      url: blob.url,
      filename,
      mimeType: file.type,
      size: file.size,
      ...dimensions,
    };
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), buffer);
  return {
    url: `/uploads/${filename}`,
    filename,
    mimeType: file.type,
    size: file.size,
    ...dimensions,
  };
}

export async function deleteStoredFile(url: string) {
  if (url.includes("blob.vercel-storage.com")) {
    try {
      await del(url);
    } catch {
      /* already gone or token missing */
    }
    return;
  }
  if (url.startsWith("/uploads/")) {
    const filename = path.basename(url);
    if (!filename || filename.includes("..")) return;
    try {
      await unlink(path.join(process.cwd(), "public", "uploads", filename));
    } catch {
      /* already gone */
    }
  }
}

export function readImageSize(buf: Buffer): { width?: number; height?: number } {
  if (buf.length > 24 && buf[0] === 0x89 && buf[1] === 0x50) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  if (buf.length > 10 && buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) {
    return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) };
  }
  if (buf.length > 30 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    const type = buf.toString("ascii", 12, 16);
    if (type === "VP8X") {
      return { width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) };
    }
    if (type === "VP8 ") {
      return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
    }
    if (type === "VP8L") {
      const bits = buf.readUInt32LE(21);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
  }
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let offset = 2;
    while (offset < buf.length - 8) {
      if (buf[offset] !== 0xff) break;
      const marker = buf[offset + 1];
      const size = buf.readUInt16BE(offset + 2);
      if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
        return { height: buf.readUInt16BE(offset + 5), width: buf.readUInt16BE(offset + 7) };
      }
      offset += 2 + size;
    }
  }
  return {};
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
