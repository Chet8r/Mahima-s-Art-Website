import Link from "next/link";
import Image from "next/image";
import { getAllArtworks } from "@/lib/artworks";
import { ArtworkCard } from "@/components/artwork-card";

export default async function Home() {
  const artworks = await getAllArtworks();
  return (
    <>
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <Image
          src="/hero-wall.png"
          alt="Original oil paintings displayed on a wall"
          fill
          priority
          sizes="100vw"
          className="object-cover -z-10"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-r from-black/70 via-black/45 to-black/20"
        />
        <div className="relative mx-auto max-w-7xl w-full px-6 sm:px-10 py-24">
          <div className="max-w-2xl">
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-cream leading-[1.05] drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
              Quiet works,
              <br />
              <span className="italic text-gold-soft">painted slowly.</span>
            </h1>
            <p className="mt-8 text-lg text-cream/85 max-w-md leading-relaxed">
              A small collection of one-of-a-kind paintings by Mahi. Each
              piece is hand-painted in-house and signed by the artist.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="#collection"
                className="inline-flex items-center justify-center h-12 px-7 bg-cream text-navy text-sm uppercase tracking-[0.18em] hover:bg-gold transition-colors"
              >
                View the Collection
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center h-12 px-7 border border-cream text-cream text-sm uppercase tracking-[0.18em] hover:bg-cream hover:text-navy transition-colors"
              >
                Commission a Piece
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        id="collection"
        className="bg-cream-soft border-y border-line scroll-mt-20"
      >
        <div className="mx-auto max-w-7xl px-6 sm:px-10 py-20">
          <div className="max-w-2xl mb-14">
            <p className="text-xs uppercase tracking-[0.28em] text-gold mb-3">
              The Collection
            </p>
            <h2 className="font-display text-4xl sm:text-5xl text-navy leading-tight">
              Available <span className="italic text-navy-soft">works</span>
            </h2>
            <p className="mt-5 text-base text-muted leading-relaxed">
              Every painting below is original and one of a kind. Shipping is
              arranged on a per-piece basis after purchase.
            </p>
          </div>
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {artworks.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
