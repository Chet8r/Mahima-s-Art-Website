import Link from "next/link";
import { LegalSection } from "@/components/legal";

export const metadata = {
  title: "Privacy Policy",
  description:
    "How Mahi Art collects, uses, and protects your personal data.",
};

const LAST_UPDATED = "20 May 2026";

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 sm:px-10 py-16 sm:py-20">
      <p className="text-xs uppercase tracking-[0.28em] text-gold mb-4">
        Legal
      </p>
      <h1 className="font-display text-5xl sm:text-6xl text-navy leading-tight">
        Privacy <span className="italic text-navy-soft">Policy</span>
      </h1>
      <p className="mt-4 text-sm text-muted">Last updated: {LAST_UPDATED}</p>

      <p className="mt-8 text-sm text-ink/85 leading-relaxed">
        This policy explains what personal information Mahi Art (&quot;we&quot;,
        &quot;us&quot;) collects when you use{" "}
        <a
          href="https://www.shopmahiart.com"
          className="text-navy underline decoration-gold/50 underline-offset-2"
        >
          shopmahiart.com
        </a>
        , why we collect it, and your rights over it. Mahi Art is operated by
        Mahima Rajesh, a sole trader based in the United Kingdom.
      </p>

      <LegalSection title="What we collect">
        <p>We only collect what we need to run the shop and reply to you:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>When you order:</strong> your name, email, phone number,
            and shipping &amp; billing address.
          </li>
          <li>
            <strong>When you contact us:</strong> your name, email, subject,
            and the message you send.
          </li>
          <li>
            <strong>Automatically:</strong> basic, privacy-friendly usage data
            (pages visited, approximate country, device/browser type) via our
            analytics, plus limited technical data such as IP address where
            needed for site security and spam prevention.
          </li>
        </ul>
        <p>
          We <strong>never</strong> see or store your card details. All
          payments are handled directly by Stripe.
        </p>
      </LegalSection>

      <LegalSection title="Why we use it">
        <ul className="list-disc pl-5 space-y-1">
          <li>To process and deliver your order (our contract with you).</li>
          <li>To reply to enquiries you send us.</li>
          <li>
            To send order confirmations and updates about your purchase.
          </li>
          <li>
            To keep the site secure and understand how it&apos;s used so we can
            improve it (our legitimate interests).
          </li>
          <li>To meet our legal and tax obligations.</li>
        </ul>
        <p>We do not sell your data, and we do not send marketing spam.</p>
      </LegalSection>

      <LegalSection title="Who we share it with">
        <p>
          We use a small number of trusted service providers who process data
          on our behalf, only as needed to run the shop:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Stripe</strong> — payment processing (
            <a
              href="https://stripe.com/privacy"
              className="text-navy underline decoration-gold/50 underline-offset-2"
            >
              privacy notice
            </a>
            )
          </li>
          <li>
            <strong>Vercel</strong> — website hosting &amp; analytics
          </li>
          <li>
            <strong>Supabase</strong> — secure database for artwork &amp; order
            records
          </li>
          <li>
            <strong>Cloudinary</strong> — image hosting
          </li>
          <li>
            <strong>Resend</strong> — sending order &amp; enquiry emails
          </li>
        </ul>
        <p>
          We may also disclose information if required by law. Some providers
          may process data outside the UK; where they do, appropriate
          safeguards are in place.
        </p>
      </LegalSection>

      <LegalSection title="How long we keep it">
        <p>
          Order and transaction records are kept for <strong>6 years</strong>{" "}
          to meet UK tax and accounting requirements. Contact enquiries are
          kept for up to 2 years. Card details are never stored by us.
        </p>
      </LegalSection>

      <LegalSection title="How we protect it">
        <p>
          The site runs over encrypted HTTPS, secrets are stored securely, the
          admin area is password-protected, and card data never touches our
          servers. No system is ever 100% secure, but we take reasonable steps
          to protect your information.
        </p>
      </LegalSection>

      <LegalSection title="Your rights">
        <p>
          Under UK GDPR you can ask us to access, correct, or delete your
          personal data, or to restrict or object to how we use it. To make a
          request, just{" "}
          <Link
            href="/contact"
            className="text-navy underline decoration-gold/50 underline-offset-2"
          >
            get in touch
          </Link>
          . You also have the right to complain to the Information
          Commissioner&apos;s Office (ICO) at{" "}
          <a
            href="https://ico.org.uk"
            className="text-navy underline decoration-gold/50 underline-offset-2"
          >
            ico.org.uk
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="Cookies">
        <p>
          We only use essential cookies needed to keep the site working (such
          as keeping the admin signed in and enabling secure checkout). We
          don&apos;t use advertising cookies. Our analytics is cookieless.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about this policy or your data? Email{" "}
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
