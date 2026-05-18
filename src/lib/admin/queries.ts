import "server-only";
import { supabaseAdmin } from "@/lib/supabase/server";
import type { ArtworkStatus } from "@/lib/artwork-types";

export type AdminArtwork = {
  id: string;
  slug: string;
  title: string;
  year: number;
  medium: string;
  dimensions: string;
  pricePence: number;
  status: ArtworkStatus;
  description: string;
  position: number;
  isPublished: boolean;
  images: {
    id: string;
    publicId: string;
    alt: string;
    isPrimary: boolean;
    position: number;
    width: number | null;
    height: number | null;
  }[];
};

const COLUMNS =
  "id, slug, title, year, medium, dimensions, price_pence, status, description, position, is_published, artwork_images(id, cloudinary_public_id, alt, is_primary, position, width, height)";

type Row = {
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
  artwork_images: {
    id: string;
    cloudinary_public_id: string;
    alt: string;
    is_primary: boolean;
    position: number;
    width: number | null;
    height: number | null;
  }[];
};

function toAdmin(row: Row): AdminArtwork {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    year: row.year,
    medium: row.medium,
    dimensions: row.dimensions,
    pricePence: row.price_pence,
    status: row.status,
    description: row.description,
    position: row.position,
    isPublished: row.is_published,
    images: row.artwork_images
      .map((i) => ({
        id: i.id,
        publicId: i.cloudinary_public_id,
        alt: i.alt,
        isPrimary: i.is_primary,
        position: i.position,
        width: i.width,
        height: i.height,
      }))
      .sort((a, b) => a.position - b.position),
  };
}

export async function listAdminArtworks(): Promise<AdminArtwork[]> {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("artworks")
    .select(COLUMNS)
    .order("position", { ascending: true });
  if (error) {
    console.error("Failed to list admin artworks", error);
    return [];
  }
  return (data as Row[]).map(toAdmin);
}

export async function getAdminArtwork(id: string): Promise<AdminArtwork | null> {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("artworks")
    .select(COLUMNS)
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return toAdmin(data as Row);
}

export function thumbUrl(
  publicId: string,
  cloud: string | undefined
): string {
  if (publicId.startsWith("placeholder/")) {
    const seed = publicId.replace("placeholder/", "");
    return `https://picsum.photos/seed/${seed}/200/250`;
  }
  if (!cloud) {
    return `https://picsum.photos/seed/${encodeURIComponent(publicId)}/200/250`;
  }
  return `https://res.cloudinary.com/${cloud}/image/upload/c_fill,w_200,h_250,f_auto,q_auto/${publicId}`;
}
