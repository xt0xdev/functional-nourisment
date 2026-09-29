import { prisma } from "./prisma";
import { DEFAULT_NOTIFY_EMAIL, DEFAULT_SITE_URL, PUBLIC_SITE_HOST } from "./site-defaults";

export { DEFAULT_NOTIFY_EMAIL };
export const DEFAULT_FORMS_FROM_EMAIL = "Functional Nourishment <forms@functionalnourishment.com>";
export const PRACTICE_MAILING_ADDRESS = "Astoria, NY 11105";

const SMTP_ENV_KEYS = ["SMTP_HOST", "SMTP_USER", "SMTP_PASS"] as const;

export type FormNotifyField = {
  label: string;
  value?: string | number | boolean | string[] | null;
};

export type FormNotifyInput = {
  subject: string;
  heading: string;
  replyTo?: string;
  fields: FormNotifyField[];
  to?: string;
};

export type FormNotifyResult = {
  sent: boolean;
  skippedReason?: string;
  id?: string | null;
  from?: string;
  to?: string;
};

export function normalizeNotifyEmail(value?: string | null) {
  const raw = value?.trim() || "";
  if (!raw) return DEFAULT_NOTIFY_EMAIL;
  const lower = raw.toLowerCase();
  if (lower === "anna@functionalnourishment.com" || lower === "functionalnurture@gmail.com") {
    return DEFAULT_NOTIFY_EMAIL;
  }
  return raw;
}

export function smtpConfigured() {
  return SMTP_ENV_KEYS.every((key) => Boolean(process.env[key]?.trim()));
}

export function formEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY?.trim()) || smtpConfigured();
}

export function formEmailAdminNote() {
  if (process.env.RESEND_API_KEY?.trim()) {
    return "Live form emails are sent with Resend from forms@functionalnourishment.com. Reply-To is the visitor so Anna can reply from Outlook. A new sending domain can land in Junk at first — allow forms@functionalnourishment.com in Outlook if needed.";
  }
  if (smtpConfigured()) {
    return "RESEND_API_KEY is not set, so form emails use the SMTP fallback. Prefer Resend on Vercel — do not SMTP directly to Microsoft 365 without auth.";
  }
  return "Form submissions are saved in the admin, but live email is off. Add RESEND_API_KEY in Vercel so Anna is notified at the form notification address. Do not SMTP directly to Microsoft 365 without auth.";
}

export function formsFromAddress() {
  const configured = process.env.FORMS_FROM_EMAIL?.trim();
  if (!configured) return DEFAULT_FORMS_FROM_EMAIL;
  if (configured.includes("<") && configured.includes(">")) return configured;
  return `Functional Nourishment <${configured}>`;
}

export function publicSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL).replace(/\/$/, "");
}

export async function resolveNotifyEmail() {
  const row = await prisma.setting.findUnique({ where: { key: "notifyEmail" } });
  return normalizeNotifyEmail(row?.value);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatFieldValue(value: FormNotifyField["value"]) {
  if (value === true) return "Yes";
  if (value === false) return "No";
  if (Array.isArray(value)) return value.filter(Boolean).join(", ");
  if (value == null) return "";
  return String(value);
}

export function renderFormEmail(input: FormNotifyInput) {
  const siteUrl = publicSiteUrl();
  const rows = input.fields
    .map((field) => {
      const value = formatFieldValue(field.value).trim();
      if (!value) return "";
      return `<tr>
        <th align="left" style="padding:10px 16px 10px 0;border-bottom:1px solid #eadfce;vertical-align:top;color:#355046;font-size:13px;font-weight:normal;white-space:nowrap;">${escapeHtml(field.label)}</th>
        <td style="padding:10px 0;border-bottom:1px solid #eadfce;color:#1b2a24;font-size:15px;white-space:pre-wrap;">${escapeHtml(value)}</td>
      </tr>`;
    })
    .filter(Boolean)
    .join("");

  const html = `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f4f1ea;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f1ea;padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid #eadfce;">
            <tr>
              <td style="padding:28px 32px 8px;font-family:Arial,Helvetica,sans-serif;color:#1b2a24;">
                <p style="margin:0 0 6px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#5c6f68;">Functional Nourishment</p>
                <p style="margin:0 0 14px;font-size:22px;line-height:1.35;">${escapeHtml(input.heading)}</p>
                <p style="margin:0 0 18px;font-size:15px;line-height:1.55;color:#355046;">
                  A visitor submitted this form on
                  <a href="${escapeHtml(siteUrl)}" style="color:#2f5d4c;">${escapeHtml(PUBLIC_SITE_HOST)}</a>.
                  The submission is also saved in the admin. Reply to this email to reach the visitor.
                </p>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">${rows}</table>
                <p style="margin:22px 0 0;font-size:13px;line-height:1.55;color:#5c6f68;">
                  Functional Nourishment, LLC<br />
                  ${escapeHtml(PRACTICE_MAILING_ADDRESS)}<br />
                  <a href="${escapeHtml(siteUrl)}" style="color:#2f5d4c;">${escapeHtml(siteUrl.replace(/^https?:\/\//, ""))}</a>
                </p>
                <p style="margin:16px 0 0;font-size:12px;line-height:1.5;color:#7a8a84;">
                  This is a transactional practice notification, not marketing mail.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 28px;"></td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = [
    "Functional Nourishment",
    input.heading,
    "",
    `A visitor submitted this form on ${PUBLIC_SITE_HOST}. The submission is also saved in the admin.`,
    "Reply to this email to reach the visitor.",
    "",
    ...input.fields
      .map((field) => {
        const value = formatFieldValue(field.value).trim();
        return value ? `${field.label}: ${value}` : "";
      })
      .filter(Boolean),
    "",
    "Functional Nourishment, LLC",
    PRACTICE_MAILING_ADDRESS,
    siteUrl,
    "",
    "This is a transactional practice notification, not marketing mail.",
  ].join("\n");

  return { html, text };
}

function notificationHeaders() {
  return {
    "X-Entity-Ref-ID": crypto.randomUUID(),
    "X-Auto-Response-Suppress": "OOF, AutoReply",
  };
}

async function sendWithResend(options: {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}) {
  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = formsFromAddress();
  const { data, error } = await resend.emails.send({
    from,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
    replyTo: options.replyTo || undefined,
    headers: notificationHeaders(),
    tags: [{ name: "category", value: "form_notification" }],
  });
  if (error) {
    throw new Error(error.message || "Resend rejected the message.");
  }
  return { id: data?.id || null, from };
}

async function sendWithSmtp(options: {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}) {
  const nodemailer = await import("nodemailer");
  const createTransport = nodemailer.createTransport ?? nodemailer.default.createTransport;
  const transporter = createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true" || process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  const from = formsFromAddress();
  const info = await transporter.sendMail({
    from,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
    replyTo: options.replyTo || undefined,
    headers: notificationHeaders(),
  });
  return { id: info.messageId || null, from };
}

export async function notifyFormSubmission(input: FormNotifyInput): Promise<FormNotifyResult> {
  const to = input.to?.trim() || (await resolveNotifyEmail());
  const { html, text } = renderFormEmail(input);
  const replyTo = input.replyTo?.trim() || undefined;

  try {
    if (process.env.RESEND_API_KEY?.trim()) {
      const sent = await sendWithResend({ to, subject: input.subject, html, text, replyTo });
      return { sent: true, id: sent.id, from: sent.from, to };
    }
    if (smtpConfigured()) {
      const sent = await sendWithSmtp({ to, subject: input.subject, html, text, replyTo });
      return { sent: true, id: sent.id, from: sent.from, to };
    }
    const skippedReason =
      "RESEND_API_KEY is not set (and no SMTP fallback). Form was saved; email was skipped.";
    console.warn(`[forms] ${skippedReason} Add RESEND_API_KEY in Vercel for live notifications to ${to}.`);
    return { sent: false, skippedReason, from: formsFromAddress(), to };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Email send failed.";
    console.error(`[forms] Notification failed; submission was still saved. ${message}`);
    return { sent: false, skippedReason: message, from: formsFromAddress(), to };
  }
}
