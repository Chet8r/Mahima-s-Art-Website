"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import {
  sendContactMessage,
  type ContactResult,
} from "@/lib/contact";

const initial: ContactResult | null = null;

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState<ContactResult | null, FormData>(
    async (_prev, formData) => sendContactMessage(_prev, formData),
    initial
  );

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="mt-14 grid gap-6">
      {/* Honeypot — hidden from real users, attractive to bots. */}
      <div className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
        <label>
          Website
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

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
          maxLength={100}
          autoComplete="name"
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
          autoComplete="email"
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
          maxLength={200}
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
          maxLength={5000}
          className="w-full p-4 bg-white border border-line focus:border-navy outline-none transition-colors resize-y"
        />
      </div>

      {state?.ok && (
        <p className="text-sm text-navy bg-gold/15 border border-gold/40 px-4 py-3">
          Message sent. Mahi will be in touch soon.
        </p>
      )}
      {state && !state.ok && (
        <p className="text-sm text-[#7f1d1d] bg-[#7f1d1d]/5 border border-[#7f1d1d]/30 px-4 py-3">
          {state.error}
        </p>
      )}

      <div>
        <SubmitButton />
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center h-12 px-8 bg-navy text-cream text-sm uppercase tracking-[0.18em] hover:bg-navy-deep transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {pending ? "Sending…" : "Send Message"}
    </button>
  );
}
