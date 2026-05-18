import Image from "next/image";
import Link from "next/link";
import { Artwork, formatPrice } from "@/lib/artworks";

export function ArtworkCard({ artwork }: { artwork: Artwork }) {
  const isSold = artwork.status === "sold";
  const isReserved = artwork.status === "reserved";

  return (
    <Link
      href={`/art/${artwork.slug}`}
      className="group block"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-cream-soft">
        <Image
          src={artwork.imageUrl}
          alt={artwork.title}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
        {isSold && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] bg-navy text-cream">
            Sold
          </span>
        )}
        {isReserved && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] bg-gold text-navy">
            Reserved
          </span>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-lg text-navy leading-tight">
            {artwork.title}
          </h3>
          <p className="text-xs text-muted mt-1">
            {artwork.medium} · {artwork.dimensions}
          </p>
        </div>
        <p className="text-sm text-navy whitespace-nowrap pt-1">
          {isSold ? (
            <span className="text-muted">Out of stock</span>
          ) : (
            formatPrice(artwork.price)
          )}
        </p>
      </div>
    </Link>
  );
}
