import Link from "next/link";
import { NewArtworkForm } from "./form";

export default function NewArtworkPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 sm:px-10 py-10">
      <Link
        href="/admin"
        className="inline-flex items-center text-xs uppercase tracking-[0.18em] text-navy/70 hover:text-gold transition-colors mb-6"
      >
        ← Back to admin
      </Link>

      <p className="text-xs uppercase tracking-[0.28em] text-gold mb-2">
        Admin · New
      </p>
      <h1 className="font-display text-3xl sm:text-4xl text-navy leading-tight mb-8">
        Add an artwork
      </h1>

      <NewArtworkForm />
    </section>
  );
}
