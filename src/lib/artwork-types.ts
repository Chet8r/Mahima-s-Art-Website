export type ArtworkStatus = "available" | "reserved" | "sold";

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
  description: string;
};
