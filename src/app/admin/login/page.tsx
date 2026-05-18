import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { isSessionTokenValid, SESSION_COOKIE_NAME } from "@/lib/auth";
import { LoginForm } from "./form";

export const metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;

  // If already signed in, jump straight to the destination.
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (isSessionTokenValid(token)) {
    redirect(from && from.startsWith("/admin") ? from : "/admin");
  }

  return (
    <section className="mx-auto max-w-md px-6 sm:px-10 py-20">
      <p className="text-xs uppercase tracking-[0.28em] text-gold mb-3">
        Admin
      </p>
      <h1 className="font-display text-3xl sm:text-4xl text-navy leading-tight mb-2">
        Sign in
      </h1>
      <p className="text-sm text-muted mb-8">
        Enter the admin password to manage the collection.
      </p>

      <LoginForm
        redirectTo={from && from.startsWith("/admin") ? from : "/admin"}
      />
    </section>
  );
}
