import Link from "next/link";
import Image from "next/image";
import { artworks } from "@/lib/artworks";
import { ArtworkCard } from "@/components/artwork-card";

export default function Home() {
  const featured = artworks.slice(0, 3);

  return (
    <>
      <section className="relative">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 pt-16 pb-20 sm:pt-24 sm:pb-28 grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-gold mb-6">
              Original Oil Paintings
            </p>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-navy leading-[1.05]">
              Quiet works,
              <br />
              <span className="italic text-navy-soft">painted slowly.</span>
            </h1>
            <p className="mt-8 text-lg text-muted max-w-md leading-relaxed">
              A small collection of one-of-a-kind oil paintings by Mahi Patel.
              Each piece is hand-painted in the studio and signed by the artist.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center h-12 px-7 bg-navy text-cream text-sm uppercase tracking-[0.18em] hover:bg-navy-deep transition-colors"
              >
                View the Collection
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center h-12 px-7 border border-navy text-navy text-sm uppercase tracking-[0.18em] hover:bg-navy hover:text-cream transition-colors"
              >
                Commission a Piece
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/5] lg:aspect-[3/4] w-full max-w-lg justify-self-center lg:justify-self-end">
            <div className="absolute -inset-3 border border-gold/40" aria-hidden />
            <Image
              src="https://picsum.photos/seed/mahi-hero/900/1200"
              alt="Featured oil painting"
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-cream-soft border-y border-line">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 py-20">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-gold mb-3">
                Featured
              </p>
              <h2 className="font-display text-4xl sm:text-5xl text-navy">
                Recent works
              </h2>
            </div>
            <Link
              href="/shop"
              className="hidden sm:inline text-sm uppercase tracking-[0.18em] text-navy hover:text-gold transition-colors"
            >
              See all →
            </Link>
          </div>
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-3xl px-6 sm:px-10 py-24 text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-gold mb-6">
            About the artist
          </p>
          <h2 className="font-display text-4xl sm:text-5xl text-navy leading-tight">
            Painting from a small studio,
            <br />
            <span className="italic text-navy-soft">one canvas at a time.</span>
          </h2>
          <p className="mt-8 text-lg text-muted leading-relaxed">
            Mahi Patel works in oils, drawn to the slow patience of layered
            glazes and the way light settles on quiet subjects. Every painting
            here is original — there are no prints, no copies.
          </p>
        </div>
      </section>
    </>
  );
}
