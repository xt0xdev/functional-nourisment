import { prisma } from "./prisma";
import { DEFAULT_NOTIFY_EMAIL } from "./site-defaults";

export { DEFAULT_NOTIFY_EMAIL };
export const DEFAULT_FORMS_FROM_EMAIL = "Functional Nourishment <beth.t@example.com>";

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
};

export type FormNotifyResult = {
  sent: boolean;
  skippedReason?: string;
};

export function normalizeNotifyEmail(value?: string | null) {
  const raw = value?.trim() || "";
  if (!raw) return DEFAULT_NOTIFY_EMAIL;
  if (raw.toLowerCase() === "anna@functionalnourishment.com") {
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
    return "Live form emails are sent with Resend to the notification address below. Reply-To is the visitor so Anna can reply from Outlook.";
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

function renderEmail(input: FormNotifyInput) {
  const rows = input.fields
    .map((field) => {
      const value = formatFieldValue(field.value).trim();
      if (!value) return "";
      return `<tr>
        <th align="left" style="padding:8px 12px 8px 0;vertical-align:top;color:#355046;font-size:13px;white-space:nowrap;">${escapeHtml(field.label)}</th>
        <td style="padding:8px 0;color:#1b2a24;font-size:14px;white-space:pre-wrap;">${escapeHtml(value)}</td>
      </tr>`;
    })
    .filter(Boolean)
    .join("");

  const html = `
    <div style="font-family:Georgia,serif;color:#1b2a24;line-height:1.5;">
      <p style="font-size:18px;margin:0 0 16px;">${escapeHtml(input.heading)}</p>
      <table style="border-collapse:collapse;width:100%;">${rows}</table>
      <p style="margin:20px 0 0;font-size:12px;color:#5c6f68;">Saved in the Functional Nourishment admin. Reply to this email to reach the visitor.</p>
    </div>
  `;
  const text = [
    input.heading,
    "",
    ...input.fields
      .map((field) => {
        const value = formatFieldValue(field.value).trim();
        return value ? `${field.label}: ${value}` : "";
      })
      .filter(Boolean),
    "",
    "Saved in the Functional Nourishment admin.",
  ].join("\n");
  return { html, text };
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
  const { error } = await resend.emails.send({
    from: formsFromAddress(),
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
    replyTo: options.replyTo || undefined,
  });
  if (error) {
    throw new Error(error.message || "Resend rejected the message.");
  }
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
  await transporter.sendMail({
    from: formsFromAddress(),
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
    replyTo: options.replyTo || undefined,
  });
}

export async function notifyFormSubmission(input: FormNotifyInput): Promise<FormNotifyResult> {
  const to = await resolveNotifyEmail();
  const { html, text } = renderEmail(input);
  const replyTo = input.replyTo?.trim() || undefined;

  try {
    if (process.env.RESEND_API_KEY?.trim()) {
      await sendWithResend({ to, subject: input.subject, html, text, replyTo });
      return { sent: true };
    }
    if (smtpConfigured()) {
      await sendWithSmtp({ to, subject: input.subject, html, text, replyTo });
      return { sent: true };
    }
    const skippedReason =
      "RESEND_API_KEY is not set (and no SMTP fallback). Form was saved; email was skipped.";
    console.warn(`[forms] ${skippedReason} Add RESEND_API_KEY in Vercel for live notifications to ${to}.`);
    return { sent: false, skippedReason };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Email send failed.";
    console.error(`[forms] Notification failed; submission was still saved. ${message}`);
    return { sent: false, skippedReason: message };
  }
}
