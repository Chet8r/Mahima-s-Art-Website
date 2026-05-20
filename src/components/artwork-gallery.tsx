"use client";

import Image from "next/image";
import { useState } from "react";
import type { ArtworkImage } from "@/lib/artwork-types";

type Props = {
  images: ArtworkImage[];
  badge?: React.ReactNode;
};

export function ArtworkGallery({ images, badge }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];

  // Use the painting's true aspect ratio so landscape pieces show wide and
  // portrait pieces show tall — never cropped. Fall back to 4/5 if we don't
  // have dimensions for this image.
  const aspect =
    active && active.width && active.height
      ? `${active.width} / ${active.height}`
      : "4 / 5";

  return (
    <div className="w-full max-w-[480px] justify-self-center lg:justify-self-end">
      <div
        className="relative bg-cream-soft w-full"
        style={{ aspectRatio: aspect }}
      >
        <div className="absolute -inset-2 border border-gold/30" aria-hidden />
        {active && (
          <Image
            src={active.url}
            alt={active.alt}
            fill
            priority
            sizes="(min-width: 1024px) 40vw, 90vw"
            className="object-contain"
          />
        )}
        {badge}
      </div>

      {images.length > 1 && (
        <ul className="mt-3 grid grid-cols-4 gap-2">
          {images.map((img, idx) => {
            const isActive = idx === activeIndex;
            return (
              <li key={idx}>
                <button
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Show image ${idx + 1}`}
                  aria-current={isActive}
                  className={`relative block w-full aspect-square overflow-hidden bg-cream-soft p-1 transition-opacity ${
                    isActive
                      ? "outline outline-2 outline-navy outline-offset-2"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt=""
                    fill
                    sizes="120px"
                    className="object-contain"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
