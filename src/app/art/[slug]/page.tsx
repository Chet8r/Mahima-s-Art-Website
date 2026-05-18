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
    <section className="mx-auto max-w-7xl px-6 sm:px-10 py-12 sm:py-16">
      <Link
        href="/shop"
        className="inline-flex items-center text-sm text-navy/70 hover:text-gold transition-colors mb-10"
      >
        ← Back to shop
      </Link>

      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/5] bg-cream-soft">
          <div className="absolute -inset-3 border border-gold/30" aria-hidden />
          <Image
            src={artwork.imageUrl}
            alt={artwork.title}
            fill
            priority
            sizes="(min-width: 1024px) 45vw, 90vw"
            className="object-cover"
          />
          {isSold && (
            <span className="absolute top-5 left-5 px-3 py-1.5 text-xs uppercase tracking-[0.22em] bg-navy text-cream">
              Sold
            </span>
          )}
          {isReserved && (
            <span className="absolute top-5 left-5 px-3 py-1.5 text-xs uppercase tracking-[0.22em] bg-gold text-navy">
              Reserved
            </span>
          )}
        </div>

        <div className="lg:pt-6">
          <p className="text-xs uppercase tracking-[0.28em] text-gold mb-4">
            {artwork.year} · Original
          </p>
          <h1 className="font-display text-4xl sm:text-5xl text-navy leading-tight">
            {artwork.title}
          </h1>

          <div className="mt-8 flex items-baseline gap-4">
            {isSold ? (
              <p className="text-2xl text-muted">Out of stock</p>
            ) : (
              <p className="text-3xl text-navy">{formatPrice(artwork.price)}</p>
            )}
            {isReserved && (
              <span className="text-xs uppercase tracking-[0.2em] text-gold">
                Currently reserved
              </span>
            )}
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 text-sm border-y border-line py-6">
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

          <p className="mt-8 text-base text-ink/80 leading-relaxed">
            {artwork.description}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            {isAvailable ? (
              <button
                type="button"
                disabled
                className="inline-flex items-center justify-center h-12 px-8 bg-navy text-cream text-sm uppercase tracking-[0.18em] hover:bg-navy-deep transition-colors disabled:opacity-90 cursor-not-allowed"
                title="Checkout will be wired up in a later step"
              >
                Add to Cart
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex items-center justify-center h-12 px-8 bg-cream-soft text-muted text-sm uppercase tracking-[0.18em] border border-line cursor-not-allowed"
              >
                {isSold ? "Sold" : "Reserved"}
              </button>
            )}
            <Link
              href="/contact"
              className="inline-flex items-center justify-center h-12 px-8 border border-navy text-navy text-sm uppercase tracking-[0.18em] hover:bg-navy hover:text-cream transition-colors"
            >
              Enquire
            </Link>
          </div>

          <p className="mt-6 text-xs text-muted">
            Worldwide shipping arranged on request. Each painting is signed and
            includes a certificate of authenticity.
          </p>
        </div>
      </div>
    </section>
  );
}
