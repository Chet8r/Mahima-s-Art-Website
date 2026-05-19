"use server";

import "server-only";
import { Resend } from "resend";
import { headers } from "next/headers";

export type ContactResult = { ok: true } | { ok: false; error: string };

const MAX_NAME = 100;
const MAX_SUBJECT = 200;
const MAX_MESSAGE = 5000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Tiny in-memory rate limit: 5 submissions / 10 min / IP.
// Resets when the process restarts — fine for a personal site.
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT = 5;
const recent = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const stamps = (recent.get(ip) ?? []).filter(
    (t) => now - t < RATE_WINDOW_MS
  );
  if (stamps.length >= RATE_LIMIT) {
    recent.set(ip, stamps);
    return true;
  }
  stamps.push(now);
  recent.set(ip, stamps);
  return false;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendContactMessage(
  _prev: ContactResult | null,
  formData: FormData
): Promise<ContactResult> {
  // Honeypot — real users never fill this field; bots fill everything.
  if (String(formData.get("website") ?? "")) {
    return { ok: true }; // pretend success, silently drop
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name) return { ok: false, error: "Please enter your name." };
  if (name.length > MAX_NAME)
    return { ok: false, error: "Name is too long." };
  if (!email || !EMAIL_RE.test(email))
    return { ok: false, error: "Please enter a valid email address." };
  if (subject.length > MAX_SUBJECT)
    return { ok: false, error: "Subject is too long." };
  if (!message)
    return { ok: false, error: "Please add a message." };
  if (message.length > MAX_MESSAGE)
    return { ok: false, error: "Message is too long." };

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    return {
      ok: false,
      error: "Contact email isn't configured. Please email directly.",
    };
  }

  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip)) {
    return {
      ok: false,
      error: "Too many messages from your network. Try again later.",
    };
  }

  const safe = {
    name: escapeHtml(name),
    email: escapeHtml(email),
    subject: escapeHtml(subject || "(no subject)"),
    message: escapeHtml(message).replace(/\n/g, "<br>"),
  };

  const html = `
    <div style="font-family: Inter, system-ui, sans-serif; max-width: 560px; margin: 0 auto;">
      <h2 style="margin: 0 0 16px;">New enquiry from ShopMahiArt.com</h2>
      <p style="margin: 0 0 4px;"><strong>From:</strong> ${safe.name} &lt;${safe.email}&gt;</p>
      <p style="margin: 0 0 16px;"><strong>Subject:</strong> ${safe.subject}</p>
      <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 16px 0;" />
      <div style="white-space: pre-wrap; line-height: 1.6;">${safe.message}</div>
    </div>
  `.trim();

  const text = [
    "New enquiry from ShopMahiArt.com",
    "",
    `From: ${name} <${email}>`,
    `Subject: ${subject || "(no subject)"}`,
    "",
    message,
  ].join("\n");

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: subject ? `[Mahi Art] ${subject}` : "[Mahi Art] New enquiry",
      html,
      text,
    });
    if (error) {
      console.error("Resend send failed", error);
      return { ok: false, error: "Couldn't send right now. Try again soon." };
    }
  } catch (e) {
    console.error("Resend exception", e);
    return { ok: false, error: "Couldn't send right now. Try again soon." };
  }

  return { ok: true };
}
