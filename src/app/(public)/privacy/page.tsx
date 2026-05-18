export const metadata = {
  title: "Privacy Policy",
  description: "How MahiArt collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 sm:px-10 py-16 sm:py-20">
      <p className="text-xs uppercase tracking-[0.28em] text-gold mb-4">
        Legal
      </p>
      <h1 className="font-display text-5xl sm:text-6xl text-navy leading-tight">
        Privacy <span className="italic text-navy-soft">Policy</span>
      </h1>
      <p className="mt-4 text-sm text-muted">
        Last updated: [DATE]
      </p>

      <div className="mt-12 space-y-10 text-ink/85 leading-relaxed">
        <div>
          <h2 className="font-display text-2xl text-navy mb-3">Overview</h2>
          <p className="text-sm">
            [Placeholder — replace with finalised wording. This page should
            cover: who the data controller is, contact details, and a short
            summary of how personal data is handled.]
          </p>
        </div>

        <div>
          <h2 className="font-display text-2xl text-navy mb-3">
            What we collect
          </h2>
          <p className="text-sm">
            [Placeholder — list the personal data collected: name, email,
            shipping address, payment details processed via Stripe, contact
            form submissions, etc.]
          </p>
        </div>

        <div>
          <h2 className="font-display text-2xl text-navy mb-3">
            Why we collect it
          </h2>
          <p className="text-sm">
            [Placeholder — explain lawful bases for processing: fulfilling
            orders, responding to enquiries, complying with legal obligations.]
          </p>
        </div>

        <div>
          <h2 className="font-display text-2xl text-navy mb-3">
            Who we share it with
          </h2>
          <p className="text-sm">
            [Placeholder — list processors: Stripe (payments), Cloudinary
            (image hosting), Vercel (site hosting), email provider, etc.]
          </p>
        </div>

        <div>
          <h2 className="font-display text-2xl text-navy mb-3">
            How long we keep it
          </h2>
          <p className="text-sm">
            [Placeholder — retention periods for orders, accounting records,
            and contact enquiries.]
          </p>
        </div>

        <div>
          <h2 className="font-display text-2xl text-navy mb-3">
            Your rights
          </h2>
          <p className="text-sm">
            [Placeholder — under UK GDPR / EU GDPR you have rights to access,
            rectification, erasure, restriction, portability, and objection.
            Include how to exercise them and how to contact the ICO.]
          </p>
        </div>

        <div>
          <h2 className="font-display text-2xl text-navy mb-3">Cookies</h2>
          <p className="text-sm">
            [Placeholder — describe any cookies used. If only essential cookies
            are used, say so explicitly.]
          </p>
        </div>

        <div>
          <h2 className="font-display text-2xl text-navy mb-3">Contact</h2>
          <p className="text-sm">
            [Placeholder — email address for privacy queries.]
          </p>
        </div>
      </div>
    </section>
  );
}
