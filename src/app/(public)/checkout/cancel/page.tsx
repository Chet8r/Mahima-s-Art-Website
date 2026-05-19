import Link from "next/link";

export const metadata = {
  title: "Checkout cancelled",
  robots: { index: false, follow: false },
};

export default function CheckoutCancel() {
  return (
    <section className="mx-auto max-w-2xl px-6 sm:px-10 py-20 text-center">
      <p className="text-xs uppercase tracking-[0.28em] text-gold mb-4">
        Checkout cancelled
      </p>
      <h1 className="font-display text-4xl sm:text-5xl text-navy leading-tight">
        No worries
      </h1>
      <p className="mt-6 text-base text-muted leading-relaxed">
        Your basket is still saved. You can pick up where you left off
        whenever you&apos;re ready.
      </p>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center justify-center h-11 px-7 bg-navy text-cream text-xs uppercase tracking-[0.18em] hover:bg-navy-deep transition-colors"
        >
          Back to the collection
        </Link>
      </div>
    </section>
  );
}
