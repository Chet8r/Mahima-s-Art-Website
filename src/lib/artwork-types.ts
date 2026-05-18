export type ArtworkStatus = "available" | "reserved" | "sold";

export type ArtworkImage = {
  url: string;
  alt: string;
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
  images: ArtworkImage[];
  description: string;
};
