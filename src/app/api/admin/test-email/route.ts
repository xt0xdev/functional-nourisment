import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { formEmailConfigured, formsFromAddress } from "@/lib/notify";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!formEmailConfigured()) {
    return NextResponse.json(
      { error: "RESEND_API_KEY is not set on this deployment." },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => ({}))) as { to?: string };
  const to = body.to?.trim() || "";
  if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    return NextResponse.json({ error: "A valid to address is required." }, { status: 400 });
  }

  const from = formsFromAddress();
  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from,
    to,
    subject: "Functional Nourishment test email",
    text: [
      "This is a test from the live Functional Nourishment site.",
      `Sent by admin ${user.email}.`,
      `From: ${from}`,
      "If you received this, Resend is delivering mail.",
    ].join("\n"),
    html: `<p>This is a test from the live Functional Nourishment site.</p>
      <p>Sent by admin ${user.email}.</p>
      <p>If you received this, Resend is delivering mail.</p>`,
  });

  if (error) {
    return NextResponse.json({ ok: false, from, to, error: error.message }, { status: 502 });
  }
  return NextResponse.json({ ok: true, from, to, id: data?.id || null });
}
