"use client";

import { ArtworkForm } from "@/components/admin/artwork-form";
import { updateArtwork } from "@/lib/admin/artworks";
import type { ArtworkStatus } from "@/lib/artwork-types";

type Props = {
  id: string;
  initial: {
    slug: string;
    title: string;
    year: number;
    medium: string;
    dimensions: string;
    priceGbp: string;
    status: ArtworkStatus;
    description: string;
  };
};

export function EditArtworkForm({ id, initial }: Props) {
  return (
    <ArtworkForm
      mode="edit"
      showImageUploader={false}
      initialValues={initial}
      onSubmit={async (values) => {
        const pricePence = Math.round(Number(values.priceGbp || "0") * 100);
        return await updateArtwork(id, {
          slug: values.slug,
          title: values.title,
          year: values.year,
          medium: values.medium,
          dimensions: values.dimensions,
          pricePence,
          status: values.status,
          description: values.description,
        });
      }}
    />
  );
}
