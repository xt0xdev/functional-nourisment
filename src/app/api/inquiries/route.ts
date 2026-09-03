import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(160),
  phone: z.string().max(40).optional().default(""),
  topic: z.string().max(80).optional().default("General"),
  message: z.string().min(1).max(4000),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Please complete the required fields." }, { status: 400 });
  }

  await prisma.inquiry.create({ data: parsed.data });
  return NextResponse.json({ ok: true });
}
