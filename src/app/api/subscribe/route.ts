import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { notifyFormSubmission } from "@/lib/notify";

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
    await notifyFormSubmission({
      subject: `Mailing list signup (already subscribed) — ${name}`,
      heading: "Someone submitted the mailing list form. They were already subscribed.",
      replyTo: email,
      fields: [
        { label: "Name", value: name },
        { label: "Email", value: email },
        { label: "Status", value: "Already on the list" },
      ],
    });
    return NextResponse.json({ ok: true, alreadySubscribed: true });
  }

  await prisma.subscriber.create({ data: { name, email } });
  await notifyFormSubmission({
    subject: `New mailing list signup — ${name}`,
    heading: "A new subscriber joined the Functional Nourishment mailing list.",
    replyTo: email,
    fields: [
      { label: "Name", value: name },
      { label: "Email", value: email },
    ],
  });
  return NextResponse.json({ ok: true });
}
