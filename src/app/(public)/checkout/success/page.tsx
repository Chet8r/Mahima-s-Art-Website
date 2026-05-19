import Link from "next/link";
import { stripe } from "@/lib/stripe";
import { ClearCartOnMount } from "./clear-cart";

export const metadata = {
  title: "Thank you",
  robots: { index: false, follow: false },
};

async function resolveOrderReference(
  sessionId: string | undefined,
): Promise<string | null> {
  if (!sessionId) return null;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const pi =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? null;
    if (!pi) return null;
    return pi.slice(-8).toUpperCase();
  } catch {
    return null;
  }
}

export default async function CheckoutSuccess({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const reference = await resolveOrderReference(session_id);

  return (
    <section className="mx-auto max-w-2xl px-6 sm:px-10 py-20 text-center">
      <ClearCartOnMount />

      <p className="text-xs uppercase tracking-[0.28em] text-gold mb-4">
        Order confirmed
      </p>
      <h1 className="font-display text-4xl sm:text-5xl text-navy leading-tight">
        Thank you for your purchase
      </h1>
      <p className="mt-6 text-base text-muted leading-relaxed">
        Your payment was successful and a receipt has been emailed to you.
        Mahi will be in touch within a couple of days about shipping.
      </p>

      {reference && (
        <p className="mt-8 text-xs text-muted">
          Order reference:{" "}
          <code className="text-navy tracking-widest">{reference}</code>
        </p>
      )}

      <div className="mt-12 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center justify-center h-11 px-7 bg-navy text-cream text-xs uppercase tracking-[0.18em] hover:bg-navy-deep transition-colors"
        >
          Back to the collection
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center h-11 px-7 border border-navy text-navy text-xs uppercase tracking-[0.18em] hover:bg-navy hover:text-cream transition-colors"
        >
          Contact Mahi
        </Link>
      </div>
    </section>
  );
}
