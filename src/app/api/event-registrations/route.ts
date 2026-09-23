import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { inferEventKind } from "@/lib/events";
import {
  RETREAT_DIETARY_OPTIONS,
  RETREAT_HEAR_ABOUT_OPTIONS,
} from "@/lib/registration";
import { resolveStripeUrl } from "@/lib/site-defaults";
import { notifyFormSubmission } from "@/lib/notify";

const workshopSchema = z.object({
  eventId: z.string().min(1),
  formKind: z.literal("workshop"),
  name: z.string().min(1).max(160),
  email: z.string().email().max(160),
  phone: z.string().min(7).max(40),
  participantCount: z.coerce.number().int().min(1).max(20).optional().default(1),
  notes: z.string().max(2000).optional().default(""),
  mailingOptIn: z.boolean().optional().default(false),
  agreedPolicy: z.literal(true),
});

const retreatSchema = z.object({
  eventId: z.string().min(1),
  formKind: z.literal("retreat"),
  name: z.string().min(1).max(160),
  email: z.string().email().max(160),
  phone: z.string().min(7).max(40),
  residence: z.string().max(160).optional().default(""),
  participantCount: z.coerce.number().int().min(1).max(20),
  dietaryPreferences: z.array(z.enum(RETREAT_DIETARY_OPTIONS)).min(1),
  dietaryOther: z.string().max(200).optional().default(""),
  foodAllergies: z.string().min(1).max(400),
  accessibilityNeeds: z.string().max(2000).optional().default(""),
  inspiration: z.string().min(1).max(2000),
  hopes: z.string().max(2000).optional().default(""),
  heardAbout: z.array(z.enum(RETREAT_HEAR_ABOUT_OPTIONS)).min(1),
  mailingOptIn: z.boolean().optional().default(false),
  agreedPolicy: z.literal(true),
  agreedVoluntary: z.literal(true),
  agreedEssentialComms: z.literal(true),
});

const schema = z.discriminatedUnion("formKind", [workshopSchema, retreatSchema]);

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Please complete the required fields." }, { status: 400 });
  }

  const event = await prisma.event.findFirst({
    where: { id: parsed.data.eventId, published: true },
  });
  if (!event) {
    return NextResponse.json({ error: "This event is no longer available." }, { status: 404 });
  }

  const kind = inferEventKind(event);
  if (parsed.data.formKind === "retreat" && kind !== "retreat") {
    return NextResponse.json({ error: "Please use the workshop registration form for this event." }, { status: 400 });
  }
  if (parsed.data.formKind === "workshop" && kind === "retreat") {
    return NextResponse.json({ error: "Please use the retreat registration form for this event." }, { status: 400 });
  }

  const data = parsed.data;
  const details =
    data.formKind === "retreat"
      ? {
          dietaryPreferences: data.dietaryPreferences,
          dietaryOther: data.dietaryOther,
          foodAllergies: data.foodAllergies,
          accessibilityNeeds: data.accessibilityNeeds,
          inspiration: data.inspiration,
          hopes: data.hopes,
          heardAbout: data.heardAbout,
          agreedPolicy: data.agreedPolicy,
          agreedVoluntary: data.agreedVoluntary,
          agreedEssentialComms: data.agreedEssentialComms,
        }
      : {
          agreedPolicy: data.agreedPolicy,
        };

  await prisma.eventRegistration.create({
    data: {
      eventId: event.id,
      formKind: data.formKind,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      residence: data.formKind === "retreat" ? data.residence.trim() : "",
      participantCount: data.participantCount,
      notes: data.formKind === "workshop" ? data.notes.trim() : data.formKind === "retreat" ? data.hopes.trim() : "",
      details: JSON.stringify(details),
      mailingOptIn: data.mailingOptIn,
    },
  });

  if (data.mailingOptIn) {
    const name = data.name.trim();
    const email = data.email.trim().toLowerCase();
    const existing = await prisma.subscriber.findUnique({ where: { email } });
    if (!existing) {
      await prisma.subscriber.create({ data: { name, email } });
    } else if (existing.name !== name) {
      await prisma.subscriber.update({ where: { email }, data: { name } });
    }
  }

  await notifyFormSubmission({
    subject: `New ${data.formKind} registration: ${event.title} — ${data.name.trim()}`,
    heading:
      data.formKind === "retreat"
        ? "A retreat registration was submitted on Functional Nourishment."
        : "An event registration was submitted on Functional Nourishment.",
    replyTo: data.email,
    fields:
      data.formKind === "retreat"
        ? [
            { label: "Event", value: event.title },
            { label: "Name", value: data.name },
            { label: "Email", value: data.email },
            { label: "Phone", value: data.phone },
            { label: "Residence", value: data.residence },
            { label: "Participants", value: data.participantCount },
            { label: "Dietary preferences", value: data.dietaryPreferences },
            { label: "Dietary other", value: data.dietaryOther },
            { label: "Food allergies", value: data.foodAllergies },
            { label: "Accessibility needs", value: data.accessibilityNeeds },
            { label: "Inspiration", value: data.inspiration },
            { label: "Hopes", value: data.hopes },
            { label: "How they heard", value: data.heardAbout },
            { label: "Mailing list", value: data.mailingOptIn },
          ]
        : [
            { label: "Event", value: event.title },
            { label: "Name", value: data.name },
            { label: "Email", value: data.email },
            { label: "Phone", value: data.phone },
            { label: "Participants", value: data.participantCount },
            { label: "Notes", value: data.notes },
            { label: "Mailing list", value: data.mailingOptIn },
          ],
  });

  const settingsRows = await prisma.setting.findMany({
    where: { key: { in: ["stripeUrl"] } },
  });
  const settings = Object.fromEntries(settingsRows.map((row) => [row.key, row.value]));

  return NextResponse.json({
    ok: true,
    stripeUrl: resolveStripeUrl(event, settings),
  });
}
