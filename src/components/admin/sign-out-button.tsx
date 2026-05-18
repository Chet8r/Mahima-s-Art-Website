"use client";

import { useTransition } from "react";
import { logout } from "@/lib/admin/auth-actions";

export function SignOutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => startTransition(() => logout())}
      disabled={pending}
      className="text-xs uppercase tracking-[0.18em] text-navy hover:text-gold transition-colors disabled:opacity-50"
    >
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
