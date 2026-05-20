import Image from "next/image";
import Link from "next/link";
import type { Artwork } from "@/lib/artwork-types";
import { formatPrice } from "@/lib/format";

export function ArtworkCard({ artwork }: { artwork: Artwork }) {
  const isSold = artwork.status === "sold";
  const isReserved = artwork.status === "reserved";
  const secondImage = artwork.images[1];

  return (
    <Link href={`/art/${artwork.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-cream-soft p-3 sm:p-4">
        <Image
          src={artwork.imageUrl}
          alt={artwork.title}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          className={`object-contain transition-all duration-500 group-hover:scale-[1.03] ${
            secondImage ? "group-hover:opacity-0" : ""
          }`}
        />
        {secondImage && (
          <Image
            src={secondImage.url}
            alt=""
            aria-hidden
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
            className="object-contain opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-[1.03]"
          />
        )}
        {isSold && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] bg-[#7f1d1d] text-cream">
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
        <p className="text-sm font-semibold text-navy whitespace-nowrap pt-0.5">
          {isSold ? (
            <span className="text-sm font-normal text-muted">Out of stock</span>
          ) : (
            formatPrice(artwork.price)
          )}
        </p>
      </div>
    </Link>
  );
}
