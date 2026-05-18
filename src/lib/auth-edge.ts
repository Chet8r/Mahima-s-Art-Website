// Web Crypto version of the session check. Used in middleware, which
// runs in the edge runtime where Node's `crypto` module isn't available.
// Must stay in sync with src/lib/auth.ts.

const COOKIE_NAME = "mahi_admin_session";

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) {
    throw new Error(
      "Missing or weak SESSION_SECRET (need at least 32 chars)."
    );
  }
  return s;
}

function toHex(bytes: ArrayBuffer): string {
  return Array.from(new Uint8Array(bytes))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sign(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return toHex(sig);
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function isSessionTokenValidEdge(
  token: string | undefined
): Promise<boolean> {
  if (!token) return false;
  const [expiresAt, signature] = token.split(".");
  if (!expiresAt || !signature) return false;

  const expected = await sign(expiresAt);
  if (!constantTimeEqual(signature, expected)) return false;

  const ts = Number(expiresAt);
  if (!Number.isFinite(ts)) return false;
  return Date.now() < ts;
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
