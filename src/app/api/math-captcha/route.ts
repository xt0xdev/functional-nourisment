import { NextResponse } from "next/server";
import { createMathChallenge, isMathCaptchaAction } from "@/lib/math-captcha";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const action = new URL(request.url).searchParams.get("action") || "";
  if (!isMathCaptchaAction(action)) {
    return NextResponse.json({ error: "Unknown form." }, { status: 400 });
  }

  const challenge = createMathChallenge({ action });
  return NextResponse.json(challenge, {
    headers: { "Cache-Control": "no-store" },
  });
}
