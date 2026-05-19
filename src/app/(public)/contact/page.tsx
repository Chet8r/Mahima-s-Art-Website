import { ContactForm } from "./contact-form";

export const metadata = {
  title: "Contact",
  description:
    "Get in touch with Mahi about paintings, commissions, and exhibitions.",
};

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 sm:px-10 py-16 sm:py-24">
      <p className="text-xs uppercase tracking-[0.28em] text-gold mb-4">
        Get in Touch
      </p>
      <h1 className="font-display text-5xl sm:text-6xl text-navy leading-tight">
        Say <span className="italic text-navy-soft">hello</span>
      </h1>
      <p className="mt-6 text-lg text-muted leading-relaxed max-w-xl">
        For purchase enquiries, commissions, exhibitions or press, drop a note
        below. Replies usually come within a couple of days.
      </p>

      <ContactForm />
    </section>
  );
}
