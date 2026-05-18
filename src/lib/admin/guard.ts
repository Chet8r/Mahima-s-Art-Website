import "server-only";
import { cookies } from "next/headers";
import { isSessionTokenValid, SESSION_COOKIE_NAME } from "@/lib/auth";

/**
 * Ensure the caller has a valid admin session.
 * Throws if not — server actions should call this before any mutation.
 */
export async function assertAdmin(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!isSessionTokenValid(token)) {
    throw new Error("Unauthorized");
  }
}
