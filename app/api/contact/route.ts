import { NextResponse } from "next/server";
import { isbot } from "isbot";

type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
  company?: string;
  formStartedAt?: number;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SUBJECT_PREFIX = "THOUGHTAKEN Contact";
const MIN_SUBMIT_DELAY_MS = 2500;
const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 80;
const MESSAGE_MIN_LENGTH = 15;
const MESSAGE_MAX_LENGTH = 2000;
const MAX_LINKS_IN_MESSAGE = 2;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_SUBMISSIONS = 5;
const ERROR_BOT_BLOCKED = "Bot traffic is blocked.";
const ERROR_SUBMISSION_VALIDATION = "Submission validation failed.";
const ERROR_TOO_MANY_SUBMISSIONS = "Too many submissions. Please try again later.";
const ERROR_ALL_FIELDS_REQUIRED = "All fields are required.";
const ERROR_INVALID_NAME_LENGTH = "Name must be between 2 and 80 characters.";
const ERROR_INVALID_MESSAGE_LENGTH = "Message must be between 15 and 2000 characters.";
const ERROR_SPAM_BLOCKED = "Message looks like spam and was blocked.";
const ERROR_INVALID_EMAIL = "Please enter a valid email.";
const ERROR_MISSING_MAIL_CONFIG =
  "Contact forwarding is not configured yet. Add MAILJET_* and CONTACT_TO env variables.";
const ERROR_SEND_FAILURE = "Unable to send message right now.";
const ipSubmissionMap = new Map<string, number[]>();
const URL_REGEX = /(https?:\/\/|www\.)/gi;
const SUSPICIOUS_REGEX = /<script|<iframe|\[url\]|\[link\]|href=|\bviagra\b|\bcasino\b/i;

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function toHtmlParagraph(value: string) {
  return escapeHtml(value).replace(/\n/g, "<br />");
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwardedFor || request.headers.get("x-real-ip") || "unknown";
}

function tooManyRecentSubmissions(clientIp: string, now: number) {
  const recent = (ipSubmissionMap.get(clientIp) || []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );

  if (recent.length >= RATE_LIMIT_MAX_SUBMISSIONS) {
    ipSubmissionMap.set(clientIp, recent);
    return true;
  }

  recent.push(now);
  ipSubmissionMap.set(clientIp, recent);
  return false;
}

export async function POST(request: Request) {
  try {
    const userAgent = request.headers.get("user-agent") || "";
    if (isbot(userAgent)) {
      return NextResponse.json(
        { ok: false, error: ERROR_BOT_BLOCKED },
        { status: 403 },
      );
    }

    const body = (await request.json()) as ContactPayload;
    const name = body.name?.trim();
    const email = body.email?.trim();
    const message = body.message?.trim();
    const company = body.company?.trim();
    const formStartedAt = body.formStartedAt;

    if (company) {
      return NextResponse.json({ ok: true });
    }

    const now = Date.now();
    if (typeof formStartedAt !== "number" || now - formStartedAt < MIN_SUBMIT_DELAY_MS) {
      return NextResponse.json(
        { ok: false, error: ERROR_SUBMISSION_VALIDATION },
        { status: 400 },
      );
    }

    const clientIp = getClientIp(request);
    if (tooManyRecentSubmissions(clientIp, now)) {
      return NextResponse.json(
        { ok: false, error: ERROR_TOO_MANY_SUBMISSIONS },
        { status: 429 },
      );
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: ERROR_ALL_FIELDS_REQUIRED },
        { status: 400 },
      );
    }

    if (name.length < NAME_MIN_LENGTH || name.length > NAME_MAX_LENGTH) {
      return NextResponse.json(
        { ok: false, error: ERROR_INVALID_NAME_LENGTH },
        { status: 400 },
      );
    }

    if (
      message.length < MESSAGE_MIN_LENGTH ||
      message.length > MESSAGE_MAX_LENGTH
    ) {
      return NextResponse.json(
        { ok: false, error: ERROR_INVALID_MESSAGE_LENGTH },
        { status: 400 },
      );
    }

    const urlCount = (message.match(URL_REGEX) || []).length;
    if (urlCount > MAX_LINKS_IN_MESSAGE || SUSPICIOUS_REGEX.test(message)) {
      return NextResponse.json(
        { ok: false, error: ERROR_SPAM_BLOCKED },
        { status: 400 },
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { ok: false, error: ERROR_INVALID_EMAIL },
        { status: 400 },
      );
    }

    const mailjetApiKey = process.env.MAILJET_API_KEY?.trim();
    const mailjetApiSecret = process.env.MAILJET_API_SECRET?.trim();
    const mailjetFromEmail = process.env.MAILJET_FROM_EMAIL?.trim();
    const mailjetFromName = process.env.MAILJET_FROM_NAME?.trim() || "ThoughtTaken";
    const contactTo = process.env.CONTACT_TO?.trim();

    const missingEnvKeys: string[] = [];
    if (!mailjetApiKey) missingEnvKeys.push("MAILJET_API_KEY");
    if (!mailjetApiSecret) missingEnvKeys.push("MAILJET_API_SECRET");
    if (!mailjetFromEmail) missingEnvKeys.push("MAILJET_FROM_EMAIL");
    if (!contactTo) missingEnvKeys.push("CONTACT_TO");

    if (missingEnvKeys.length > 0) {
      return NextResponse.json(
        {
          ok: false,
          error: `${ERROR_MISSING_MAIL_CONFIG} Missing: ${missingEnvKeys.join(", ")}`,
        },
        { status: 500 },
      );
    }

    const mailjetAuth = Buffer.from(`${mailjetApiKey}:${mailjetApiSecret}`).toString("base64");
    const submittedAt = new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    const mailjetResponse = await fetch("https://api.mailjet.com/v3.1/send", {
      method: "POST",
      headers: {
        Authorization: `Basic ${mailjetAuth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Messages: [
          {
            From: {
              Email: mailjetFromEmail,
              Name: mailjetFromName,
            },
            To: [{ Email: contactTo }],
            ReplyTo: { Email: email },
            Subject: `${SUBJECT_PREFIX} | ${name}`,
            TextPart: `Name: ${name}\nEmail: ${email}\n\nPlease do not reply to this email. Replies here are not monitored.\nTo respond, email the sender directly at: ${email}\n\nMessage:\n${message}`,
            HTMLPart: `
              <div style="margin:0;padding:24px;background:#0b0b0b;font-family:Arial,Helvetica,sans-serif;color:#e5e7eb;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;background:#121212;border:1px solid #262626;border-radius:14px;overflow:hidden;">
                  <tr>
                    <td style="padding:18px 22px;background:#111111;border-bottom:1px solid #262626;">
                      <h2 style="margin:0;font-size:18px;letter-spacing:0.08em;text-transform:uppercase;color:#ffffff;">THOUGHTAKEN Contact</h2>
                      <p style="margin:6px 0 0 0;font-size:12px;color:#a3a3a3;">Submitted ${escapeHtml(submittedAt)}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:18px 22px;">
                      <p style="margin:0 0 10px 0;font-size:13px;color:#a3a3a3;text-transform:uppercase;letter-spacing:0.07em;">Sender</p>
                      <p style="margin:0 0 4px 0;font-size:16px;color:#ffffff;font-weight:700;">${escapeHtml(name)}</p>
                      <p style="margin:0 0 14px 0;font-size:14px;color:#d1d5db;">${escapeHtml(email)}</p>

                      <div style="margin:0 0 14px 0;padding:10px 12px;background:#0c0c0c;border:1px solid #2f2f2f;border-radius:10px;color:#d1d5db;font-size:13px;line-height:1.5;">
                        Please do not reply to this email. Replies here are not monitored.<br />
                        To respond, email the sender directly at <strong style="color:#ffffff;">${escapeHtml(email)}</strong>.
                      </div>

                      <p style="margin:0 0 10px 0;font-size:13px;color:#a3a3a3;text-transform:uppercase;letter-spacing:0.07em;">Message</p>
                      <div style="margin:0;padding:14px;background:#0c0c0c;border:1px solid #262626;border-radius:10px;font-size:15px;line-height:1.6;color:#f5f5f5;">
                        ${toHtmlParagraph(message)}
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
            `,
            CustomID: "ThoughtTaken-Contact-Form",
          },
        ],
      }),
    });

    if (!mailjetResponse.ok) {
      const responseText = await mailjetResponse.text();
      throw new Error(`Mailjet API error (${mailjetResponse.status}): ${responseText}`);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const isDevelopment = process.env.NODE_ENV !== "production";
    const errorMessage =
      error instanceof Error ? error.message : ERROR_SEND_FAILURE;

    return NextResponse.json(
      {
        ok: false,
        error: isDevelopment
          ? `${ERROR_SEND_FAILURE} (${errorMessage})`
          : ERROR_SEND_FAILURE,
      },
      { status: 500 },
    );
  }
}
