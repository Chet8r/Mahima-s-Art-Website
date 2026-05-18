"use client";

import { ArtworkForm } from "@/components/admin/artwork-form";
import { createArtwork } from "@/lib/admin/artworks";
import type { UploadedImage } from "@/components/admin/image-uploader";

export function NewArtworkForm() {
  return (
    <ArtworkForm
      mode="create"
      onSubmit={async (values, images) => {
        const pricePence = Math.round(Number(values.priceGbp || "0") * 100);
        const result = await createArtwork(
          {
            slug: values.slug,
            title: values.title,
            year: values.year,
            medium: values.medium,
            dimensions: values.dimensions,
            pricePence,
            status: values.status,
            description: values.description,
          },
          images.map((img: UploadedImage) => ({
            publicId: img.publicId,
            width: img.width,
            height: img.height,
            alt: img.alt,
          }))
        );
        return result;
      }}
    />
  );
}
