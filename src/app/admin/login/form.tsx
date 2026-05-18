"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { login, type LoginResult } from "@/lib/admin/auth-actions";

const initial: LoginResult | null = null;

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const [state, formAction] = useActionState<LoginResult | null, FormData>(
    async (_prev, formData) => login(_prev, formData),
    initial
  );

  useEffect(() => {
    if (state?.ok) {
      router.replace(redirectTo);
      router.refresh();
    }
  }, [state, router, redirectTo]);

  return (
    <form action={formAction} className="space-y-5">
      <label className="block">
        <span className="block text-xs uppercase tracking-[0.18em] text-navy mb-2">
          Password
        </span>
        <input
          type="password"
          name="password"
          required
          autoFocus
          autoComplete="current-password"
          className="w-full h-11 px-3 bg-white text-ink border border-line focus:border-navy outline-none transition-colors text-sm dark-admin:bg-slate-800 dark-admin:text-slate-100 dark-admin:border-slate-700"
        />
      </label>

      {state && !state.ok && (
        <p className="text-sm text-rose-600 dark-admin:text-rose-400">
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center w-full h-11 px-7 bg-navy text-cream text-xs uppercase tracking-[0.18em] hover:bg-navy-deep transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}
