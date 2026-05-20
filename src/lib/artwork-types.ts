export type ArtworkStatus = "available" | "reserved" | "sold";

export type ArtworkImage = {
  url: string;
  alt: string;
  width: number | null;
  height: number | null;
};

export type Artwork = {
  id: string;
  slug: string;
  title: string;
  year: number;
  medium: string;
  dimensions: string;
  price: number;
  status: ArtworkStatus;
  imageUrl: string;
  // Aspect ratio of the primary image (width/height), if known.
  primaryAspect: number | null;
  images: ArtworkImage[];
  description: string;
};
