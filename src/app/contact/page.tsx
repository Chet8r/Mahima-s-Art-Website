export const metadata = {
  title: "Contact",
  description: "Get in touch with Mahi about paintings, commissions, and exhibitions.",
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

      <form className="mt-14 grid gap-6">
        <div>
          <label
            htmlFor="name"
            className="block text-xs uppercase tracking-[0.18em] text-navy mb-2"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full h-12 px-4 bg-white border border-line focus:border-navy outline-none transition-colors"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-xs uppercase tracking-[0.18em] text-navy mb-2"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full h-12 px-4 bg-white border border-line focus:border-navy outline-none transition-colors"
          />
        </div>
        <div>
          <label
            htmlFor="subject"
            className="block text-xs uppercase tracking-[0.18em] text-navy mb-2"
          >
            Subject
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            className="w-full h-12 px-4 bg-white border border-line focus:border-navy outline-none transition-colors"
          />
        </div>
        <div>
          <label
            htmlFor="message"
            className="block text-xs uppercase tracking-[0.18em] text-navy mb-2"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            required
            className="w-full p-4 bg-white border border-line focus:border-navy outline-none transition-colors resize-y"
          />
        </div>
        <div>
          <button
            type="submit"
            disabled
            className="inline-flex items-center justify-center h-12 px-8 bg-navy text-cream text-sm uppercase tracking-[0.18em] hover:bg-navy-deep transition-colors disabled:opacity-80 cursor-not-allowed"
            title="Form submission will be wired up in a later step"
          >
            Send Message
          </button>
          <p className="mt-3 text-xs text-muted">
            Form is currently a placeholder — submissions aren&apos;t sent yet.
          </p>
        </div>
      </form>
    </section>
  );
}
