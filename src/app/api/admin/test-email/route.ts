import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { formEmailConfigured, formsFromAddress, notifyFormSubmission } from "@/lib/notify";

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

  const result = await notifyFormSubmission({
    to,
    subject: "New inquiry: Practice notification — Functional Nourishment",
    heading: "A form notification was sent from Functional Nourishment.",
    replyTo: user.email,
    fields: [
      { label: "Requested by", value: user.email },
      { label: "Purpose", value: "Confirm delivery of site form notifications." },
      { label: "Practice", value: "Functional Nourishment, LLC — Astoria, NY" },
      { label: "Website", value: "https://functionalnourishment.com" },
      {
        label: "Outlook note",
        value:
          "If this landed in Junk, mark it Not junk and allow forms@functionalnourishment.com. The sending domain is new, so Microsoft may filter the first messages even when SPF, DKIM, and DMARC pass.",
      },
    ],
  });

  if (!result.sent) {
    return NextResponse.json(
      { ok: false, from: result.from || formsFromAddress(), to, error: result.skippedReason || "Send failed." },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    from: result.from || formsFromAddress(),
    to: result.to || to,
    id: result.id || null,
  });
}
