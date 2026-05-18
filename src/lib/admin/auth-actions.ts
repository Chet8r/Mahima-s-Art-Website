"use server";

import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createSessionToken,
  verifyPassword,
  SESSION_COOKIE_NAME,
} from "@/lib/auth";

export type LoginResult = { ok: true } | { ok: false; error: string };

export async function login(
  _prevState: unknown,
  formData: FormData
): Promise<LoginResult> {
  const password = String(formData.get("password") ?? "");
  if (!password) return { ok: false, error: "Enter the password." };

  if (!verifyPassword(password)) {
    // Small artificial delay to slow brute-force attempts.
    await new Promise((r) => setTimeout(r, 400));
    return { ok: false, error: "Incorrect password." };
  }

  const { value, maxAge } = createSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });

  return { ok: true };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect("/admin/login");
}
