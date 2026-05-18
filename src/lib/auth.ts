import "server-only";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "mahi_admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) {
    throw new Error(
      "Missing or weak SESSION_SECRET (need at least 32 chars)."
    );
  }
  return s;
}

function adminPassword(): string {
  const p = process.env.ADMIN_PASSWORD;
  if (!p) throw new Error("Missing ADMIN_PASSWORD.");
  return p;
}

function sign(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

function constantTimeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export function verifyPassword(input: string): boolean {
  return constantTimeEqual(input, adminPassword());
}

export function createSessionToken(now: number = Date.now()): {
  value: string;
  maxAge: number;
} {
  const expiresAt = String(now + MAX_AGE_SECONDS * 1000);
  const signature = sign(expiresAt);
  return { value: `${expiresAt}.${signature}`, maxAge: MAX_AGE_SECONDS };
}

export function isSessionTokenValid(token: string | undefined): boolean {
  if (!token) return false;
  const [expiresAt, signature] = token.split(".");
  if (!expiresAt || !signature) return false;

  const expected = sign(expiresAt);
  if (!constantTimeEqual(signature, expected)) return false;

  const ts = Number(expiresAt);
  if (!Number.isFinite(ts)) return false;
  return Date.now() < ts;
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
