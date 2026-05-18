import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { artworks, getArtworkBySlug, formatPrice } from "@/lib/artworks";

export function generateStaticParams() {
  return artworks.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artwork = getArtworkBySlug(slug);
  if (!artwork) return {};
  return {
    title: artwork.title,
    description: artwork.description,
  };
}

export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artwork = getArtworkBySlug(slug);
  if (!artwork) notFound();

  const isSold = artwork.status === "sold";
  const isReserved = artwork.status === "reserved";
  const isAvailable = artwork.status === "available";

  return (
    <section className="mx-auto max-w-7xl px-6 sm:px-10 py-6 sm:py-8">
      <Link
        href="/#collection"
        className="inline-flex items-center text-sm text-navy/70 hover:text-gold transition-colors mb-4"
      >
        ← Back to collection
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12 items-center">
        <div className="relative w-full max-w-[420px] aspect-[4/5] bg-cream-soft justify-self-center lg:justify-self-end">
          <div className="absolute -inset-2 border border-gold/30" aria-hidden />
          <Image
            src={artwork.imageUrl}
            alt={artwork.title}
            fill
            priority
            sizes="(min-width: 1024px) 35vw, 90vw"
            className="object-cover"
          />
          {isSold && (
            <span className="absolute top-4 left-4 px-3 py-1.5 text-xs uppercase tracking-[0.22em] bg-[#7f1d1d] text-cream">
              Sold
            </span>
          )}
          {isReserved && (
            <span className="absolute top-4 left-4 px-3 py-1.5 text-xs uppercase tracking-[0.22em] bg-gold text-navy">
              Reserved
            </span>
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-gold mb-3">
            {artwork.year} · Original
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-navy leading-tight">
            {artwork.title}
          </h1>

          <div className="mt-4 flex items-baseline gap-4">
            {isSold ? (
              <p className="text-xl text-muted">Out of stock</p>
            ) : (
              <p className="text-2xl text-navy">{formatPrice(artwork.price)}</p>
            )}
            {isReserved && (
              <span className="text-xs uppercase tracking-[0.2em] text-gold">
                Currently reserved
              </span>
            )}
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm border-y border-line py-4">
            <dt className="text-muted uppercase tracking-[0.18em] text-xs">
              Medium
            </dt>
            <dd className="text-navy">{artwork.medium}</dd>
            <dt className="text-muted uppercase tracking-[0.18em] text-xs">
              Dimensions
            </dt>
            <dd className="text-navy">{artwork.dimensions}</dd>
            <dt className="text-muted uppercase tracking-[0.18em] text-xs">
              Year
            </dt>
            <dd className="text-navy">{artwork.year}</dd>
            <dt className="text-muted uppercase tracking-[0.18em] text-xs">
              Edition
            </dt>
            <dd className="text-navy">Original, 1 of 1</dd>
          </dl>

          <p className="mt-5 text-sm text-ink/80 leading-relaxed">
            {artwork.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {isAvailable ? (
              <button
                type="button"
                disabled
                className="inline-flex items-center justify-center h-11 px-7 bg-navy text-cream text-xs uppercase tracking-[0.18em] hover:bg-navy-deep transition-colors disabled:opacity-90 cursor-not-allowed"
                title="Checkout will be wired up in a later step"
              >
                Add to Cart
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex items-center justify-center h-11 px-7 bg-cream-soft text-muted text-xs uppercase tracking-[0.18em] border border-line cursor-not-allowed"
              >
                {isSold ? "Sold" : "Reserved"}
              </button>
            )}
            <Link
              href="/contact"
              className="inline-flex items-center justify-center h-11 px-7 border border-navy text-navy text-xs uppercase tracking-[0.18em] hover:bg-navy hover:text-cream transition-colors"
            >
              Enquire
            </Link>
          </div>

          <p className="mt-4 text-xs text-muted">
            Worldwide shipping arranged on request.
          </p>
        </div>
      </div>
    </section>
  );
}
