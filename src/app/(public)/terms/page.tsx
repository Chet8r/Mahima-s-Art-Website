import Link from "next/link";
import { LegalSection } from "@/components/legal";

export const metadata = {
  title: "Terms of Sale",
  description: "Terms, shipping, and returns for purchases from Mahi Art.",
};

const LAST_UPDATED = "20 May 2026";

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 sm:px-10 py-16 sm:py-20">
      <p className="text-xs uppercase tracking-[0.28em] text-gold mb-4">
        Legal
      </p>
      <h1 className="font-display text-5xl sm:text-6xl text-navy leading-tight">
        Terms <span className="italic text-navy-soft">of Sale</span>
      </h1>
      <p className="mt-4 text-sm text-muted">Last updated: {LAST_UPDATED}</p>

      <p className="mt-8 text-sm text-ink/85 leading-relaxed">
        These terms apply to purchases made through{" "}
        <a
          href="https://www.shopmahiart.com"
          className="text-navy underline decoration-gold/50 underline-offset-2"
        >
          shopmahiart.com
        </a>
        . The shop is operated by Mahima Rajesh, trading as Mahi Art, a sole
        trader based in the United Kingdom. By placing an order you agree to
        these terms.
      </p>

      <LegalSection title="The artwork">
        <p>
          Every piece sold here is an <strong>original, one-of-a-kind</strong>{" "}
          oil painting, hand-painted by the artist. No prints or copies are
          produced. Colours may appear slightly different on screen depending
          on your display.
        </p>
      </LegalSection>

      <LegalSection title="Orders & pricing">
        <p>
          All prices are in pounds sterling (GBP) and include any applicable
          taxes. We are not VAT-registered, so no VAT is charged. An order is
          confirmed once payment is successfully completed and you receive a
          confirmation email.
        </p>
        <p>
          As each painting is unique, once a piece is sold it is no longer
          available. If we cannot fulfil an order for any reason, we will
          contact you and issue a full refund.
        </p>
      </LegalSection>

      <LegalSection title="Payment">
        <p>
          Payments are processed securely by Stripe. We accept major debit and
          credit cards. We never see or store your card details.
        </p>
      </LegalSection>

      <LegalSection title="Shipping">
        <p>
          We currently ship within the <strong>United Kingdom</strong>. Two
          options are offered at checkout:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Standard delivery</strong> — £4, tracked, 2–5 working days
          </li>
          <li>
            <strong>Express delivery</strong> — £8, signed for, next working
            day
          </li>
        </ul>
        <p>
          Each painting is carefully hand-packed for transit. Despatch times
          may vary; we&apos;ll keep you updated. International buyers are
          welcome to{" "}
          <Link
            href="/contact"
            className="text-navy underline decoration-gold/50 underline-offset-2"
          >
            get in touch
          </Link>{" "}
          to arrange shipping individually.
        </p>
      </LegalSection>

      <LegalSection title="Cancellations & returns">
        <p>
          Under the UK Consumer Contracts Regulations, you have the right to
          cancel your order within <strong>14 days</strong> of receiving the
          painting, for any reason. To cancel, contact us within that period.
        </p>
        <p>
          Please contact us before sending any artwork back so we can confirm
          the return details. You then have 14 days to return the painting to
          us. Return postage is paid by the buyer, and we recommend using a
          tracked, insured service as you are responsible for the artwork until
          it reaches us. Once we receive the painting back, we&apos;ll refund
          the price paid, including the original standard delivery cost, within
          14 days. If the painting has been damaged or handled beyond what is
          needed to inspect it, we may deduct any reduction in value permitted
          by law.
        </p>
        <p>
          Commissioned or personalised pieces are made to order and are not
          eligible for this cancellation right once work has begun.
        </p>
      </LegalSection>

      <LegalSection title="Damaged in transit">
        <p>
          We pack every piece with care, but if your painting arrives damaged,
          please{" "}
          <Link
            href="/contact"
            className="text-navy underline decoration-gold/50 underline-offset-2"
          >
            contact us
          </Link>{" "}
          as soon as possible, ideally within 48 hours of delivery, with photos
          of the artwork and packaging so we can review the issue and advise on
          next steps.
        </p>
      </LegalSection>

      <LegalSection title="Liability">
        <p>
          Nothing in these terms limits your statutory rights as a consumer. To
          the extent permitted by law, our liability is limited to the price
          paid for the artwork.
        </p>
      </LegalSection>

      <LegalSection title="Governing law">
        <p>
          These terms are governed by the laws of England and Wales, and any
          disputes are subject to the courts of England and Wales.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about an order or these terms? Email{" "}
          <a
            href="mailto:art.mahipatel@gmail.com"
            className="text-navy underline decoration-gold/50 underline-offset-2"
          >
            art.mahipatel@gmail.com
          </a>{" "}
          or use our{" "}
          <Link
            href="/contact"
            className="text-navy underline decoration-gold/50 underline-offset-2"
          >
            contact form
          </Link>
          .
        </p>
      </LegalSection>
    </section>
  );
}
