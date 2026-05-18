import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const secretKey = process.env.SUPABASE_SECRET_KEY;

if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
if (!publishableKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
}

// Public reads from server components — respects RLS.
export const supabaseServer = createClient<Database>(url, publishableKey, {
  auth: { persistSession: false },
});

// Admin client for server-side mutations. Bypasses RLS — never expose
// to the browser. Lazily created so dev still works without the secret
// (only routes that need write access will fail).
export function supabaseAdmin() {
  if (!secretKey) {
    throw new Error(
      "Missing SUPABASE_SECRET_KEY — required for admin writes."
    );
  }
  return createClient<Database>(url!, secretKey, {
    auth: { persistSession: false },
  });
}
