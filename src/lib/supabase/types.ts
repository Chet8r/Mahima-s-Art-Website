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
  is_published: boolean;
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
        Insert: {
          id?: string;
          slug: string;
          title: string;
          year: number;
          medium: string;
          dimensions: string;
          price_pence: number;
          status?: ArtworkStatus;
          description?: string;
          position?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<ArtworkRow, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      artwork_images: {
        Row: ArtworkImageRow;
        Insert: {
          id?: string;
          artwork_id: string;
          cloudinary_public_id: string;
          alt?: string;
          position?: number;
          is_primary?: boolean;
          width?: number | null;
          height?: number | null;
          created_at?: string;
        };
        Update: Partial<Omit<ArtworkImageRow, "id" | "created_at">>;
        Relationships: [
          {
            foreignKeyName: "artwork_images_artwork_id_fkey";
            columns: ["artwork_id"];
            isOneToOne: false;
            referencedRelation: "artworks";
            referencedColumns: ["id"];
          }
        ];
      };
      processed_webhooks: {
        Row: { event_id: string; processed_at: string };
        Insert: { event_id: string; processed_at?: string };
        Update: { event_id?: string; processed_at?: string };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      artwork_status: ArtworkStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};
