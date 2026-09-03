import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toMediaDTO } from "@/lib/media";
import { deleteStoredFile } from "@/lib/storage";

export const runtime = "nodejs";

async function requireUser() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireUser();
  if (denied) return denied;
  const { id } = await params;
  const body = (await request.json()) as { alt?: string; caption?: string };
  const media = await prisma.media.update({
    where: { id },
    data: {
      alt: body.alt ?? undefined,
      caption: body.caption ?? undefined,
    },
  });
  return NextResponse.json({ item: toMediaDTO(media) });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireUser();
  if (denied) return denied;
  const { id } = await params;
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  await prisma.media.delete({ where: { id } });
  await deleteStoredFile(media.url);
  return NextResponse.json({ ok: true });
}
