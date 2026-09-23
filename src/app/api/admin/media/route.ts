import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toMediaDTO } from "@/lib/media";
import {
  BLOB_REQUIRED_MESSAGE,
  blobAdminNote,
  formatBytes,
  hasBlobToken,
  isVercelRuntime,
  saveUpload,
  StorageConfigError,
  storageDriver,
  storageLabel,
} from "@/lib/storage";

export const runtime = "nodejs";

async function requireUser() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const denied = await requireUser();
  if (denied) return denied;

  const items = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });
  const driver = storageDriver();
  return NextResponse.json({
    items: items.map(toMediaDTO),
    driver,
    storageLabel: storageLabel(driver),
    ephemeral: driver !== "vercel-blob",
    blobConfigured: hasBlobToken(),
    vercelReadonly: isVercelRuntime(),
    uploadBlocked: driver === "unconfigured",
    uploadBlockedMessage: driver === "unconfigured" ? BLOB_REQUIRED_MESSAGE : "",
    adminNote: blobAdminNote(driver),
  });
}

export async function POST(request: Request) {
  const denied = await requireUser();
  if (denied) return denied;

  const contentType = request.headers.get("content-type") || "";

  try {
    if (contentType.includes("application/json")) {
      const body = (await request.json()) as {
        url?: string;
        filename?: string;
        mimeType?: string;
        size?: number;
        width?: number;
        height?: number;
        alt?: string;
        caption?: string;
      };
      const url = String(body.url || "").trim();
      if (!url) {
        return NextResponse.json({ error: "Image URL is required." }, { status: 400 });
      }
      const media = await prisma.media.create({
        data: {
          url,
          filename: body.filename || url.split("/").pop() || "image",
          mimeType: body.mimeType || "image/*",
          size: Number(body.size || 0),
          width: body.width || null,
          height: body.height || null,
          alt: body.alt || "",
          caption: body.caption || "",
        },
      });
      return NextResponse.json({ item: toMediaDTO(media) });
    }

    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "Choose an image to upload." }, { status: 400 });
    }
    if (isVercelRuntime() && !hasBlobToken()) {
      return NextResponse.json({ error: BLOB_REQUIRED_MESSAGE }, { status: 503 });
    }
    const saved = await saveUpload(file);
    const media = await prisma.media.create({
      data: {
        filename: saved.filename,
        url: saved.url,
        mimeType: saved.mimeType,
        size: saved.size,
        width: saved.width ?? null,
        height: saved.height ?? null,
        alt: String(form.get("alt") || ""),
        caption: String(form.get("caption") || ""),
      },
    });
    return NextResponse.json({ item: toMediaDTO(media), bytes: formatBytes(saved.size) });
  } catch (error) {
    const message = (error as Error).message || "Upload failed.";
    const status = error instanceof StorageConfigError ? error.status : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
