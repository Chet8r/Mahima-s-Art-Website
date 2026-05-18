import { artworks } from "@/lib/artworks";
import { ArtworkCard } from "@/components/artwork-card";

export const metadata = {
  title: "Shop",
  description: "Browse the full collection of original oil paintings.",
};

export default function ShopPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 sm:px-10 py-16 sm:py-24">
      <header className="max-w-2xl mb-14">
        <p className="text-xs uppercase tracking-[0.28em] text-gold mb-4">
          The Collection
        </p>
        <h1 className="font-display text-5xl sm:text-6xl text-navy leading-tight">
          Available <span className="italic text-navy-soft">works</span>
        </h1>
        <p className="mt-6 text-lg text-muted leading-relaxed">
          Every painting below is original and one of a kind. Shipping is
          arranged on a per-piece basis after purchase.
        </p>
      </header>

      <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {artworks.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} />
        ))}
      </div>
    </section>
  );
}
