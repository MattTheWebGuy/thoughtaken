import { NextResponse } from "next/server";
import { isbot } from "isbot";
import nodemailer from "nodemailer";
import { SITE_CONFIG } from "../../lib/site-config";

type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
  company?: string;
  formStartedAt?: number;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const { contactApi } = SITE_CONFIG;
const { validation, errors } = contactApi;

const RATE_LIMIT_WINDOW_MS = validation.rateLimitWindowMs;
const RATE_LIMIT_MAX_SUBMISSIONS = validation.rateLimitMaxSubmissions;
const ipSubmissionMap = new Map<string, number[]>();
const URL_REGEX = /(https?:\/\/|www\.)/gi;
const SUSPICIOUS_REGEX = /<script|<iframe|\[url\]|\[link\]|href=|\bviagra\b|\bcasino\b/i;

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
        { ok: false, error: errors.botBlocked },
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
    if (typeof formStartedAt !== "number" || now - formStartedAt < validation.minSubmitDelayMs) {
      return NextResponse.json(
        { ok: false, error: errors.submissionValidationFailed },
        { status: 400 },
      );
    }

    const clientIp = getClientIp(request);
    if (tooManyRecentSubmissions(clientIp, now)) {
      return NextResponse.json(
        { ok: false, error: errors.tooManySubmissions },
        { status: 429 },
      );
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: errors.allFieldsRequired },
        { status: 400 },
      );
    }

    if (name.length < validation.nameMinLength || name.length > validation.nameMaxLength) {
      return NextResponse.json(
        { ok: false, error: errors.invalidNameLength },
        { status: 400 },
      );
    }

    if (
      message.length < validation.messageMinLength ||
      message.length > validation.messageMaxLength
    ) {
      return NextResponse.json(
        { ok: false, error: errors.invalidMessageLength },
        { status: 400 },
      );
    }

    const urlCount = (message.match(URL_REGEX) || []).length;
    if (urlCount > validation.maxLinksInMessage || SUSPICIOUS_REGEX.test(message)) {
      return NextResponse.json(
        { ok: false, error: errors.spamBlocked },
        { status: 400 },
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { ok: false, error: errors.invalidEmail },
        { status: 400 },
      );
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || "0");
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const contactTo = process.env.CONTACT_TO;
    const contactFrom = process.env.CONTACT_FROM || smtpUser;

    if (
      !smtpHost ||
      !smtpPort ||
      !smtpUser ||
      !smtpPass ||
      !contactTo ||
      !contactFrom
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: errors.missingSmtpConfig,
        },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: contactFrom,
      to: contactTo,
      replyTo: email,
      subject: `${contactApi.email.subjectPrefix} | ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong></p><p>${message.replace(/\n/g, "<br />")}</p>`,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: errors.sendFailure },
      { status: 500 },
    );
  }
}
