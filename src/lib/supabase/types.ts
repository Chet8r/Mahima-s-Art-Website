export type ArtworkStatus = "available" | "reserved" | "sold";

export type ArtworkRow = {
  id: string;
  slug: string;
  title: string;
  year: number;
  medium: string;
  dimensions: string;
  price_pence: number;
  status: ArtworkStatus;
  description: string;
  position: number;
  created_at: string;
  updated_at: string;
};

export type ArtworkImageRow = {
  id: string;
  artwork_id: string;
  cloudinary_public_id: string;
  alt: string;
  position: number;
  is_primary: boolean;
  width: number | null;
  height: number | null;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      artworks: {
        Row: ArtworkRow;
        Insert: Omit<ArtworkRow, "id" | "created_at" | "updated_at"> & {
          id?: string;
        };
        Update: Partial<Omit<ArtworkRow, "id" | "created_at" | "updated_at">>;
      };
      artwork_images: {
        Row: ArtworkImageRow;
        Insert: Omit<ArtworkImageRow, "id" | "created_at"> & { id?: string };
        Update: Partial<Omit<ArtworkImageRow, "id" | "created_at">>;
      };
    };
  };
};
