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

  return (
    <div className="w-full max-w-[420px] justify-self-center lg:justify-self-end">
      <div className="relative aspect-[4/5] bg-cream-soft">
        <div className="absolute -inset-2 border border-gold/30" aria-hidden />
        {active && (
          <Image
            src={active.url}
            alt={active.alt}
            fill
            priority
            sizes="(min-width: 1024px) 35vw, 90vw"
            className="object-cover"
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
                  className={`relative block w-full aspect-[4/5] overflow-hidden transition-opacity ${
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
                    className="object-cover"
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
