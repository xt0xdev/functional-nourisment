import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { INQUIRY_INTERESTS, INQUIRY_SOURCES, showsReferredBy, showsSourceOther } from "@/lib/inquiry";

const schema = z
  .object({
    name: z.string().min(1).max(120),
    email: z.string().email().max(160),
    phone: z.string().min(7).max(40),
    topic: z.enum(INQUIRY_INTERESTS).optional().default("General Inquiry"),
    source: z.enum(INQUIRY_SOURCES),
    referredBy: z.string().max(160).optional().default(""),
    sourceOther: z.string().max(160).optional().default(""),
    message: z.string().min(1).max(4000),
  })
  .superRefine((value, ctx) => {
    if (showsReferredBy(value.source) && !value.referredBy.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please share who referred you.",
        path: ["referredBy"],
      });
    }
    if (showsSourceOther(value.source) && !value.sourceOther.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please tell us how you heard about Functional Nourishment.",
        path: ["sourceOther"],
      });
    }
  });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Please complete the required fields." }, { status: 400 });
  }

  const { sourceOther, ...data } = parsed.data;
  await prisma.inquiry.create({
    data: {
      ...data,
      referredBy: showsSourceOther(data.source) ? sourceOther.trim() : data.referredBy.trim(),
    },
  });
  return NextResponse.json({ ok: true });
}
