export const metadata = {
  title: "Terms of Sale",
  description:
    "Terms, shipping, and refund information for purchases from MahiArt.",
};

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 sm:px-10 py-16 sm:py-20">
      <p className="text-xs uppercase tracking-[0.28em] text-gold mb-4">
        Legal
      </p>
      <h1 className="font-display text-5xl sm:text-6xl text-navy leading-tight">
        Terms <span className="italic text-navy-soft">of Sale</span>
      </h1>
      <p className="mt-4 text-sm text-muted">
        Last updated: [DATE]
      </p>

      <div className="mt-12 space-y-10 text-ink/85 leading-relaxed">
        <div>
          <h2 className="font-display text-2xl text-navy mb-3">Overview</h2>
          <p className="text-sm">
            [Placeholder — replace with finalised wording. This page should
            cover: who is selling, business address/contact, and the scope of
            these terms.]
          </p>
        </div>

        <div>
          <h2 className="font-display text-2xl text-navy mb-3">
            Orders &amp; pricing
          </h2>
          <p className="text-sm">
            [Placeholder — confirm currency (GBP), how prices are shown,
            whether VAT is included, when an order is considered accepted,
            and what happens if a piece becomes unavailable after order.]
          </p>
        </div>

        <div>
          <h2 className="font-display text-2xl text-navy mb-3">Payment</h2>
          <p className="text-sm">
            [Placeholder — note that payments are processed by Stripe, cards
            accepted, currency, when payment is taken.]
          </p>
        </div>

        <div>
          <h2 className="font-display text-2xl text-navy mb-3">Shipping</h2>
          <p className="text-sm">
            [Placeholder — UK / international shipping arrangements, who pays
            for shipping, typical despatch and delivery times, packaging,
            tracking, and what happens if a piece is lost or damaged in
            transit.]
          </p>
        </div>

        <div>
          <h2 className="font-display text-2xl text-navy mb-3">
            Cancellations &amp; refunds
          </h2>
          <p className="text-sm">
            [Placeholder — under UK Consumer Contracts Regulations, buyers have
            a 14-day right to cancel from receipt. Explain how to cancel, who
            pays return shipping, condition of returned goods, and refund
            timeframes. Note any exclusions e.g. commissioned/custom pieces.]
          </p>
        </div>

        <div>
          <h2 className="font-display text-2xl text-navy mb-3">
            Originals &amp; authenticity
          </h2>
          <p className="text-sm">
            [Placeholder — each piece is an original, one of a kind. Confirm
            that no prints or copies are produced. Optional: provenance and
            care notes.]
          </p>
        </div>

        <div>
          <h2 className="font-display text-2xl text-navy mb-3">
            Commissions
          </h2>
          <p className="text-sm">
            [Placeholder — terms specific to commissioned pieces: deposit,
            timeline, approval process, that commissions are non-refundable
            once work has begun.]
          </p>
        </div>

        <div>
          <h2 className="font-display text-2xl text-navy mb-3">
            Liability
          </h2>
          <p className="text-sm">
            [Placeholder — standard limitation of liability wording.]
          </p>
        </div>

        <div>
          <h2 className="font-display text-2xl text-navy mb-3">
            Governing law
          </h2>
          <p className="text-sm">
            [Placeholder — these terms are governed by the laws of England and
            Wales (or your jurisdiction).]
          </p>
        </div>

        <div>
          <h2 className="font-display text-2xl text-navy mb-3">Contact</h2>
          <p className="text-sm">
            [Placeholder — email and any other contact details for sale
            queries.]
          </p>
        </div>
      </div>
    </section>
  );
}
