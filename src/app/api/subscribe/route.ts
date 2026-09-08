import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(160),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter your name and a valid email." }, { status: 400 });
  }

  const name = parsed.data.name.trim();
  const email = parsed.data.email.trim().toLowerCase();

  const existing = await prisma.subscriber.findUnique({ where: { email } });
  if (existing) {
    if (existing.name !== name) {
      await prisma.subscriber.update({ where: { email }, data: { name } });
    }
    return NextResponse.json({ ok: true, alreadySubscribed: true });
  }

  await prisma.subscriber.create({ data: { name, email } });
  return NextResponse.json({ ok: true });
}
